/** Route API requests to the existing Python service and serve frontend assets locally. */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    // Keep the original path/query, but never let clients choose the upstream host.
    const backend = new URL(env.BACKEND_ORIGIN);
    url.protocol = backend.protocol;
    url.host = backend.host;

    const upstreamRequest = new Request(url, request);
    upstreamRequest.headers.delete("host");

    try {
      // Preserve upload bodies and API errors; do not follow redirects with credentials.
      const upstream = await fetch(upstreamRequest, {
        redirect: "manual",
        cache: "no-store",
      });
      const response = new Response(upstream.body, upstream);
      // Configuration and financial responses must not be reused across users or tenants.
      response.headers.set("Cache-Control", "no-store");
      return response;
    } catch {
      return Response.json(
        { ok: false, message: "后端服务暂时无法连接，请稍后重试" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }
  },
};
