#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import mimetypes
import secrets
import sys
from email.parser import BytesParser
from email.policy import default
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urljoin, urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
STATIC_DIR = ROOT / "static"
CONFIG_FILE = ROOT / "config.json"
VALIDATE_PATH = "/cloudaccount/importTestData/validateExcel"
DOCUMENT_QUERY_PATH = "/cloudaccount/importTestData/platformOrderNo"
MAX_UPLOAD_BYTES = 80 * 1024 * 1024
REQUEST_TIMEOUT_SECONDS = 300
KMERP_ROOT = Path("/Users/huangjie/workspace/workspace_git/kmerp-account-system")

ENVIRONMENTS = {
    "local": {
        "label": "本地环境",
        "baseUrl": "http://127.0.0.1:8080/",
    },
    "gray3": {
        "label": "灰度3环境",
        "baseUrl": "https://pubcloud3.superboss.cc/",
    },
}

DEFAULT_CONFIG = {
    "environment": "local",
    "cookie": "",
}

SCHEMA_SOURCE_FILES = [
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/imports/dto/ImportAfterQueryResult.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/imports/dto/ImportAfterQueryOriginalOrderResult.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/imports/dto/ImportAfterQueryOriginalAfterSaleResult.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/imports/dto/ImportAfterQueryOrderStreamResult.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/orderstream/YzOrderStreamExtDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/orderstream/YzOrderStreamDetailDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/erpsync/ErpItemSnapshotDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/erpsync/ErpTradeDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/erpsync/ErpOrderDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/erpsync/ErpWorkOrderDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/erpsync/ErpReissueOrRefundDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/aftersales/YzRefundOnlyTrackingDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/aftersales/YzAfterSalesExceptionDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/standardfund/YzStandardFundBillFlowInfoDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/adjustment/YzArAdjustmentRecordDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/verification/YzManualVerifyRecordDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/reconciliation/YzArReconciliationDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/issuedbalance/YzIssuedBalanceProcessDO.java",
    KMERP_ROOT / "cloud-account-core/src/main/java/com/raycloud/cloudaccount/core/base/domain/issuedbalance/YzIssuedBalanceDetailDO.java",
    KMERP_ROOT / "kmerp-account-core/src/main/java/com/raycloud/dmj/account/core/common/BaseInfo.java",
]


def load_config() -> dict[str, Any]:
    if not CONFIG_FILE.exists():
        return dict(DEFAULT_CONFIG)
    try:
        data = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return dict(DEFAULT_CONFIG)

    config = dict(DEFAULT_CONFIG)
    if data.get("environment") in ENVIRONMENTS:
        config["environment"] = data["environment"]
    if isinstance(data.get("cookie"), str):
        config["cookie"] = data["cookie"]
    return config


def save_config(config: dict[str, Any]) -> dict[str, Any]:
    normalized = dict(DEFAULT_CONFIG)
    if config.get("environment") in ENVIRONMENTS:
        normalized["environment"] = config["environment"]
    if isinstance(config.get("cookie"), str):
        normalized["cookie"] = config["cookie"].strip()

    CONFIG_FILE.write_text(
        json.dumps(normalized, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return normalized


def json_bytes(payload: Any) -> bytes:
    return json.dumps(payload, ensure_ascii=False).encode("utf-8")


def parse_multipart(content_type: str, body: bytes) -> tuple[dict[str, str], dict[str, dict[str, Any]]]:
    if not content_type or "multipart/form-data" not in content_type:
        raise ValueError("请求必须是 multipart/form-data")

    message = BytesParser(policy=default).parsebytes(
        b"Content-Type: " + content_type.encode("utf-8") + b"\r\n"
        b"MIME-Version: 1.0\r\n\r\n"
        + body
    )
    if not message.is_multipart():
        raise ValueError("未解析到 multipart 内容")

    fields: dict[str, str] = {}
    files: dict[str, dict[str, Any]] = {}
    for part in message.iter_parts():
        disposition = part.get("Content-Disposition", "")
        if not disposition.startswith("form-data"):
            continue
        params = dict(part.get_params(header="content-disposition", unquote=True) or [])
        name = params.get("name")
        if not name:
            continue

        payload = part.get_payload(decode=True) or b""
        filename = params.get("filename")
        if filename is None:
            charset = part.get_content_charset() or "utf-8"
            fields[name] = payload.decode(charset, errors="replace")
        else:
            files[name] = {
                "filename": filename,
                "content": payload,
                "contentType": part.get_content_type() or "application/octet-stream",
            }
    return fields, files


def multipart_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def build_multipart(
    fields: dict[str, str],
    file_field_name: str,
    file_name: str,
    file_content: bytes,
    file_content_type: str,
) -> tuple[str, bytes]:
    boundary = "----CloudAccountValidate" + secrets.token_hex(16)
    chunks: list[bytes] = []

    for name, value in fields.items():
        chunks.append(f"--{boundary}\r\n".encode("utf-8"))
        chunks.append(
            f'Content-Disposition: form-data; name="{multipart_escape(name)}"\r\n\r\n'.encode("utf-8")
        )
        chunks.append(str(value).encode("utf-8"))
        chunks.append(b"\r\n")

    encoded_filename = quote(file_name.encode("utf-8"))
    disposition = (
        f'Content-Disposition: form-data; name="{multipart_escape(file_field_name)}"; '
        f'filename="{multipart_escape(file_name)}"; filename*=UTF-8\'\'{encoded_filename}\r\n'
    )
    chunks.append(f"--{boundary}\r\n".encode("utf-8"))
    chunks.append(disposition.encode("utf-8"))
    chunks.append(f"Content-Type: {file_content_type or 'application/octet-stream'}\r\n\r\n".encode("utf-8"))
    chunks.append(file_content)
    chunks.append(b"\r\n")
    chunks.append(f"--{boundary}--\r\n".encode("utf-8"))
    return boundary, b"".join(chunks)


def decode_target_response(raw: bytes) -> Any:
    text = raw.decode("utf-8", errors="replace")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"rawText": text}


def clean_java_doc(lines: list[str]) -> str:
    text = " ".join(
        line.strip().lstrip("*").strip()
        for line in lines
        if line.strip() and line.strip() not in ("/**", "*/")
    )
    return " ".join(text.split())


def schema_description(annotation_line: str) -> str:
    for key in ("description", "value"):
        marker = f'{key} = "'
        start = annotation_line.find(marker)
        if start >= 0:
            start += len(marker)
            end = annotation_line.find('"', start)
            if end >= 0:
                return annotation_line[start:end].strip()

    start = annotation_line.find('("')
    if start >= 0:
        start += 2
        end = annotation_line.find('"', start)
        if end >= 0:
            return annotation_line[start:end].strip()
    return ""


def extract_field_labels() -> dict[str, str]:
    labels = {
        "created": "创建时间",
        "modified": "更新时间",
        "companyId": "公司ID",
        "createdAt": "创建时间",
        "updatedAt": "更新时间",
        "isDeleted": "逻辑删除",
        "deletedVersion": "逻辑删除版本号",
    }

    for file_path in SCHEMA_SOURCE_FILES:
        if not file_path.exists():
            continue
        try:
            lines = file_path.read_text(encoding="utf-8").splitlines()
        except OSError:
            continue

        comment_lines: list[str] = []
        pending_comment = ""
        pending_schema = ""
        in_comment = False

        for line in lines:
            stripped = line.strip()
            if stripped.startswith("/**"):
                in_comment = True
                comment_lines = [stripped]
                if stripped.endswith("*/"):
                    in_comment = False
                    pending_comment = clean_java_doc(comment_lines)
                continue
            if in_comment:
                comment_lines.append(stripped)
                if stripped.endswith("*/"):
                    in_comment = False
                    pending_comment = clean_java_doc(comment_lines)
                continue

            if stripped.startswith("@Schema(") or stripped.startswith("@ApiModelProperty("):
                pending_schema = schema_description(stripped)
                continue

            if ";" not in stripped:
                continue

            declaration = stripped.split("=", 1)[0].rstrip(";").strip()
            tokens = declaration.split()
            if not tokens:
                continue
            if not any(token in {"private", "protected", "public"} for token in tokens):
                continue
            field_name = tokens[-1]
            if field_name == "serialVersionUID":
                pending_comment = ""
                pending_schema = ""
                continue

            label = pending_schema or pending_comment
            if label:
                labels[field_name] = label
            pending_comment = ""
            pending_schema = ""

    return labels


class ValidateViewerHandler(BaseHTTPRequestHandler):
    server_version = "CloudAccountValidateViewer/1.0"

    def log_message(self, fmt: str, *args: Any) -> None:
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/config":
            self.send_json(
                {
                    "config": load_config(),
                    "environments": ENVIRONMENTS,
                    "validatePath": VALIDATE_PATH,
                    "documentQueryPath": DOCUMENT_QUERY_PATH,
                }
            )
            return
        if path == "/api/document-labels":
            self.send_json({"labels": extract_field_labels()})
            return
        if path == "/api/health":
            self.send_json({"ok": True})
            return
        self.serve_static(path)

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/config":
            self.save_config_from_request()
            return
        if path == "/api/validate":
            self.proxy_validate_request()
            return
        if path == "/api/document-query":
            self.proxy_document_query_request()
            return
        self.send_json({"ok": False, "message": "接口不存在"}, HTTPStatus.NOT_FOUND)

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def send_json(self, payload: Any, status: int | HTTPStatus = HTTPStatus.OK) -> None:
        body = json_bytes(payload)
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_body(self) -> bytes:
        length = int(self.headers.get("Content-Length") or 0)
        if length > MAX_UPLOAD_BYTES:
            raise ValueError(f"上传内容超过 {MAX_UPLOAD_BYTES // 1024 // 1024}MB")
        return self.rfile.read(length)

    def serve_static(self, path: str) -> None:
        if path in ("", "/"):
            file_path = STATIC_DIR / "index.html"
        elif path.startswith("/static/"):
            file_path = STATIC_DIR / path.removeprefix("/static/")
        else:
            self.send_error(HTTPStatus.NOT_FOUND)
            return

        try:
            resolved = file_path.resolve()
            resolved.relative_to(STATIC_DIR.resolve())
        except ValueError:
            self.send_error(HTTPStatus.FORBIDDEN)
            return

        if not resolved.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return

        content_type = mimetypes.guess_type(str(resolved))[0] or "application/octet-stream"
        body = resolved.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type + ("; charset=utf-8" if content_type.startswith("text/") else ""))
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def save_config_from_request(self) -> None:
        try:
            payload = json.loads(self.read_body().decode("utf-8"))
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json({"ok": False, "message": str(exc)}, HTTPStatus.BAD_REQUEST)
            return

        environment = payload.get("environment")
        if environment not in ENVIRONMENTS:
            self.send_json({"ok": False, "message": "环境配置不正确"}, HTTPStatus.BAD_REQUEST)
            return

        config = save_config(
            {
                "environment": environment,
                "cookie": payload.get("cookie", ""),
            }
        )
        self.send_json({"ok": True, "config": config, "environments": ENVIRONMENTS})

    def proxy_validate_request(self) -> None:
        try:
            body = self.read_body()
            fields, files = parse_multipart(self.headers.get("Content-Type", ""), body)
        except ValueError as exc:
            self.send_json({"ok": False, "message": str(exc)}, HTTPStatus.BAD_REQUEST)
            return

        upload_file = files.get("file")
        if not upload_file:
            self.send_json({"ok": False, "message": "请选择 Excel 文件"}, HTTPStatus.BAD_REQUEST)
            return

        config = load_config()
        environment = fields.get("environment") or config.get("environment")
        if environment not in ENVIRONMENTS:
            self.send_json({"ok": False, "message": "环境配置不正确"}, HTTPStatus.BAD_REQUEST)
            return

        cookie = fields.get("cookie")
        if cookie is None:
            cookie = config.get("cookie", "")
        config = save_config({"environment": environment, "cookie": cookie})

        base_url = ENVIRONMENTS[environment]["baseUrl"]
        target_url = urljoin(base_url, VALIDATE_PATH.lstrip("/"))
        boundary, target_body = build_multipart(
            {},
            "file",
            upload_file["filename"] or "validate.xlsx",
            upload_file["content"],
            upload_file["contentType"] or "application/octet-stream",
        )

        headers = {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "Content-Length": str(len(target_body)),
            "User-Agent": self.server_version,
            "Referer": base_url,
        }
        if config.get("cookie"):
            headers["Cookie"] = config["cookie"]

        request = Request(target_url, data=target_body, headers=headers, method="POST")
        try:
            with urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
                status = response.status
                raw = response.read()
                target_headers = dict(response.headers.items())
        except HTTPError as exc:
            status = exc.code
            raw = exc.read()
            target_headers = dict(exc.headers.items()) if exc.headers else {}
        except URLError as exc:
            self.send_json(
                {
                    "ok": False,
                    "message": f"无法访问目标环境：{exc.reason}",
                    "targetUrl": target_url,
                },
                HTTPStatus.BAD_GATEWAY,
            )
            return

        target_payload = decode_target_response(raw)
        self.send_json(
            {
                "ok": 200 <= status < 400,
                "targetStatus": status,
                "targetUrl": target_url,
                "contentType": target_headers.get("Content-Type"),
                "response": target_payload,
            },
            HTTPStatus.OK if status < 500 else HTTPStatus.BAD_GATEWAY,
        )

    def proxy_document_query_request(self) -> None:
        try:
            payload = json.loads(self.read_body().decode("utf-8"))
        except (ValueError, json.JSONDecodeError) as exc:
            self.send_json({"ok": False, "message": str(exc)}, HTTPStatus.BAD_REQUEST)
            return

        platform_order_no = str(payload.get("platformOrderNo") or "").strip()
        if not platform_order_no:
            self.send_json({"ok": False, "message": "请输入平台订单号"}, HTTPStatus.BAD_REQUEST)
            return

        config = load_config()
        environment = payload.get("environment") or config.get("environment")
        if environment not in ENVIRONMENTS:
            self.send_json({"ok": False, "message": "环境配置不正确"}, HTTPStatus.BAD_REQUEST)
            return

        cookie = payload.get("cookie")
        if cookie is None:
            cookie = config.get("cookie", "")
        config = save_config({"environment": environment, "cookie": cookie})

        base_url = ENVIRONMENTS[environment]["baseUrl"]
        query_string = urlencode({"platformOrderNo": platform_order_no})
        target_url = urljoin(base_url, DOCUMENT_QUERY_PATH.lstrip("/")) + "?" + query_string
        headers = {
            "Accept": "application/json, text/plain, */*",
            "User-Agent": self.server_version,
            "Referer": base_url,
        }
        if config.get("cookie"):
            headers["Cookie"] = config["cookie"]

        request = Request(target_url, headers=headers, method="GET")
        try:
            with urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
                status = response.status
                raw = response.read()
                target_headers = dict(response.headers.items())
        except HTTPError as exc:
            status = exc.code
            raw = exc.read()
            target_headers = dict(exc.headers.items()) if exc.headers else {}
        except URLError as exc:
            self.send_json(
                {
                    "ok": False,
                    "message": f"无法访问目标环境：{exc.reason}",
                    "targetUrl": target_url,
                },
                HTTPStatus.BAD_GATEWAY,
            )
            return

        target_payload = decode_target_response(raw)
        self.send_json(
            {
                "ok": 200 <= status < 400,
                "targetStatus": status,
                "targetUrl": target_url,
                "contentType": target_headers.get("Content-Type"),
                "response": target_payload,
            },
            HTTPStatus.OK if status < 500 else HTTPStatus.BAD_GATEWAY,
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Cloud account import validation result viewer")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8070)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    server = ThreadingHTTPServer((args.host, args.port), ValidateViewerHandler)
    print(f"校验导入运行结果页面已启动：http://{args.host}:{args.port}/")
    print("按 Ctrl+C 停止服务")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务已停止")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
