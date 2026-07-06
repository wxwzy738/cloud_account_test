# 导入运行结果校验/单据查看页面

本地启动：

```bash
python3 server.py --port 8070
```

打开：

```text
http://127.0.0.1:8070/
```

页面左侧有两个菜单：

- 导入校验：选择公司后，把 Excel 文件以 `file` 字段上传到：

```text
/cloudaccount/importTestData/validateExcel
```

- 查看单据：选择公司后，按平台订单号查询导入执行后的单据信息：

```text
/cloudaccount/importTestData/platformOrderNo
```

支持的环境：

- 本地环境：`http://127.0.0.1:8080/`
- 灰度3环境：`https://pubcloud3.superboss.cc/`

访问环境会保存到本目录的 `config.json`，该文件已加入 `.gitignore`。公司通过页面下拉框选择：

- 导入校验默认：咖啡测试3，`companyId=10438`
- 查看单据默认：德赛集团，`companyId=37041`
