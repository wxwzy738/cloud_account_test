import assert from "node:assert/strict";
import { test } from "node:test";

import worker from "./worker.mjs";

const BACKEND_ORIGIN = "https://backend.example.com";

test("static requests use the assets binding", async () => {
  const request = new Request("https://frontend.example.com/static/styles.css");
  const response = await worker.fetch(request, {
    ASSETS: { fetch: async (received) => {
      assert.equal(received, request);
      return new Response("body { color: blue; }", { headers: { "Content-Type": "text/css" } });
    } },
  });

  assert.equal(response.headers.get("Content-Type"), "text/css");
});

test("API requests preserve query and errors without caching or redirecting", async (t) => {
  t.mock.method(globalThis, "fetch", async (request, options) => {
    assert.equal(request.url, "https://backend.example.com/api/company-config?companyId=123");
    assert.equal(options.redirect, "manual");
    assert.equal(options.cache, "no-store");
    return Response.json({ ok: false }, { status: 403 });
  });

  const response = await worker.fetch(
    new Request("https://frontend.example.com/api/company-config?companyId=123"),
    { BACKEND_ORIGIN },
  );

  assert.equal(response.status, 403);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await response.json(), { ok: false });
});

test("multipart uploads preserve method, boundary, file bytes and authorization", async (t) => {
  const form = new FormData();
  form.set("file", new Blob([new Uint8Array([0, 127, 255])]), "test.xlsx");
  form.set("companyId", "123");
  t.mock.method(globalThis, "fetch", async (request) => {
    assert.equal(request.method, "POST");
    assert.equal(request.headers.get("authorization"), "Bearer test-only");
    const received = await request.formData();
    assert.equal(received.get("companyId"), "123");
    assert.deepEqual(new Uint8Array(await received.get("file").arrayBuffer()), new Uint8Array([0, 127, 255]));
    return Response.json({ ok: true });
  });

  const response = await worker.fetch(new Request("https://frontend.example.com/api/validate", {
    method: "POST",
    headers: { Authorization: "Bearer test-only" },
    body: form,
  }), { BACKEND_ORIGIN });

  assert.equal(response.status, 200);
});

test("network failures return a clear JSON error without upstream details", async (t) => {
  t.mock.method(globalThis, "fetch", async () => { throw new Error("private upstream error"); });
  const response = await worker.fetch(new Request("https://frontend.example.com/api/config"), { BACKEND_ORIGIN });

  assert.equal(response.status, 502);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await response.json(), { ok: false, message: "后端服务暂时无法连接，请稍后重试" });
});
