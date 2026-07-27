# 导入运行结果校验/单据查看/核销配置页面

本地启动：

```bash
python3 server.py --port 8070
```

打开：

```text
http://127.0.0.1:8070/
```

页面左侧有三个菜单：

- 导入校验：选择公司后，把 Excel 文件以 `file` 字段上传到：

```text
/cloudaccount/importTestData/validateExcel
```

- 查看单据：选择公司后，按平台订单号查询导入执行后的单据信息：

```text
/cloudaccount/importTestData/platformOrderNo
```

- 核销配置：在页面顶部选择公司，查看并保存 `YzCompanyConfigDO` 的核销相关配置。页面调用：

```text
GET  /cloudaccount/config/company/getByCompanyId?companyId=...
POST /cloudaccount/config/company/insertOrUpdate
```

其中 `id`、`reissueExchangeOutReceivedMatch`、`exchangeInReceivedMatch`、`createdAt`、`isDeleted` 不展示；`updatedAt` 仅展示、不可编辑。
核销配置接口固定访问灰度 3：`https://pubcloud3.superboss.cc/`。

- 测试用例：按平台订单号和状态查询已录制的导入测试用例，列表和分页信息会一并请求：

```text
POST /cloudaccount/testCase/pageList?companyId=...
POST /cloudaccount/testCase/pageInfo?companyId=...
```

请求体使用 `QueryYzImportTestCaseReq`：`platformOrderNo`、`status`、`pageNo`、`pageSize` 等字段。该菜单默认使用本地环境 `http://127.0.0.1:8080/`；可通过系统配置切换到灰度3环境。

支持的环境：

- 本地环境：`http://127.0.0.1:8080/`
- 灰度3环境：`https://pubcloud3.superboss.cc/`

访问环境会保存到本目录的 `config.json`，该文件已加入 `.gitignore`。公司通过页面下拉框选择：

- 导入校验默认：德赛集团，`companyId=37041`
- 查看单据默认：德赛集团，`companyId=37041`
- 核销配置默认：德赛集团，`companyId=37041`
- 测试用例默认：德赛集团，`companyId=37041`
