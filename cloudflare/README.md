# Cloudflare 部署

Workers 提供静态页面，将 `/api/*` 请求转发至现有 Python 服务。接口地址、HTTP 方法、查询参数、上传文件和响应状态均保留，接口响应不缓存。

- 构建命令：`mkdir -p dist/static && cp static/index.html dist/index.html && cp -R static/. dist/static/`
- 部署命令：`npx wrangler deploy`
- 根目录：`/`
- 配置入口：根目录 `wrangler.jsonc`，其中 `BACKEND_ORIGIN` 指向 `https://yz.aicodexy.com`。
- 校验：`node --check cloudflare/worker.mjs && node --test cloudflare/worker.test.mjs`

部署后检查 `/static/styles.css`、`/static/app.js`、`/api/health`、`/api/config` 和 `/api/document-labels`。

Python 服务继续负责配置持久化、字段标签和业务接口代理。配置保存与原站点共享；选择“本地环境”指向 Python 服务器自身的 `127.0.0.1`，不能访问使用者电脑上的 Java 服务。
