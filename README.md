# 导入运行结果校验页面

本地启动：

```bash
python3 server.py --port 8070
```

打开：

```text
http://127.0.0.1:8070/
```

页面会把 Excel 文件以 `file` 字段上传到：

```text
/cloudaccount/importTestData/validateExcel
```

支持的环境：

- 本地环境：`http://127.0.0.1:8080/`
- 灰度3环境：`https://pubcloud3.superboss.cc/`

Cookie 会保存到本目录的 `config.json`，该文件已加入 `.gitignore`。
