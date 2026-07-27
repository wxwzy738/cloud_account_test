const REPLAY_DEFAULT_COMPANY_ID = "37041";

const state = {
  config: { environment: "auto" },
  environments: {},
  companies: [
    { name: "德赛集团", companyId: "37041" },
    { name: "咖啡测试3", companyId: "10438" },
  ],
  defaultCompanyByModule: { validate: "37041", documents: "37041", "company-config": "37041", "test-cases": "37041" },
  companyByModule: { validate: "37041", documents: "37041", "company-config": "37041", "test-cases": "37041" },
  activeModule: "validate",
  lastTabs: { validate: "config", documents: "config", "test-cases": "test-cases" },
  validatePath: "/cloudaccount/importTestData/validateExcel",
  documentQueryPath: "/cloudaccount/importTestData/platformOrderNo",
  testCasePageListPath: "/cloudaccount/testCase/pageList",
  testCasePageInfoPath: "/cloudaccount/testCase/pageInfo",
  testCaseGetPath: "/cloudaccount/testCase/getById",
  testCaseValidateResultPath: "/cloudaccount/testCase/validateResult",
  testCaseReplayPath: "/cloudaccount/testCase/replay",
  validationMode: "excel",
  validationTestCases: [],
  validationTestCasesCompanyId: "",
  testCases: [],
  testCasePageInfo: { total: 0, pageNo: 1, pageSize: 20 },
  testCaseQuery: { pageNo: 1, pageSize: 20, platformOrderNo: "", status: "" },
  testCasesLoaded: false,
  testCaseRawResponse: null,
  editingTestCaseTitleId: null,
  editingTestCaseStatusId: null,
  replayTestCaseRecord: null,
  companyConfig: {},
  companyConfigLoading: false,
  result: null,
  rawResponse: null,
  validateSource: "excel",
  validateTestCase: null,
  documentResult: null,
  documentRawResponse: null,
  documentPlatformOrderNo: "",
  documentSource: "live",
  documentTestCase: null,
  documentEditingCell: null,
  documentLabels: {},
  documentModelLabels: {},
  documentLabelsLoaded: false,
  documentFilters: new Map(),
  sheetEntries: [],
  sheetByTabId: new Map(),
  sheetFilters: new Map(),
  rowFieldModes: new Map(),
  expandedRows: new Set(),
  onlyIssueSheets: false,
  activeTab: "config",
};

const els = {
  tabs: document.getElementById("tabs"),
  sheetPages: document.getElementById("sheetPages"),
  documentPages: document.getElementById("documentPages"),
  configForm: document.getElementById("configForm"),
  companyConfigForm: document.getElementById("companyConfigForm"),
  uploadForm: document.getElementById("uploadForm"),
  excelValidationPanel: document.getElementById("excelValidationPanel"),
  testCaseValidationPanel: document.getElementById("testCaseValidationPanel"),
  validationTestCaseSelect: document.getElementById("validationTestCaseSelect"),
  validateTestCaseButton: document.getElementById("validateTestCaseButton"),
  validateTestCaseStatus: document.getElementById("validateTestCaseStatus"),
  testCaseValidatePathText: document.getElementById("testCaseValidatePathText"),
  documentQueryForm: document.getElementById("documentQueryForm"),
  jsonImportForm: document.getElementById("jsonImportForm"),
  companySelect: document.getElementById("companySelect"),
  companyConfigCompanySelect: document.getElementById("companyConfigCompanySelect"),
  companyConfigCompanyHint: document.getElementById("companyConfigCompanyHint"),
  companyConfigFields: document.getElementById("companyConfigFields"),
  companyConfigLoading: document.getElementById("companyConfigLoading"),
  saveCompanyConfigButton: document.getElementById("saveCompanyConfigButton"),
  saveCompanyConfigStatus: document.getElementById("saveCompanyConfigStatus"),
  companyHint: document.getElementById("companyHint"),
  platformOrderInput: document.getElementById("platformOrderInput"),
  jsonInput: document.getElementById("jsonInput"),
  baseUrlText: document.getElementById("baseUrlText"),
  envSummary: document.getElementById("envSummary"),
  configTitle: document.getElementById("configTitle"),
  configSubtitle: document.getElementById("configSubtitle"),
  documentQueryPathText: document.getElementById("documentQueryPathText"),
  uploadPathText: document.getElementById("uploadPathText"),
  saveConfigStatus: document.getElementById("saveConfigStatus"),
  uploadStatus: document.getElementById("uploadStatus"),
  documentQueryStatus: document.getElementById("documentQueryStatus"),
  jsonImportStatus: document.getElementById("jsonImportStatus"),
  fileInput: document.getElementById("fileInput"),
  fileNameText: document.getElementById("fileNameText"),
  dropZone: document.getElementById("dropZone"),
  validateButton: document.getElementById("validateButton"),
  documentQueryButton: document.getElementById("documentQueryButton"),
  testCaseQueryForm: document.getElementById("testCaseQueryForm"),
  testCaseCompanySelect: document.getElementById("testCaseCompanySelect"),
  testCasePlatformOrderInput: document.getElementById("testCasePlatformOrderInput"),
  testCaseStatusSelect: document.getElementById("testCaseStatusSelect"),
  testCaseQueryButton: document.getElementById("testCaseQueryButton"),
  testCaseQueryStatus: document.getElementById("testCaseQueryStatus"),
  openRecordTestCaseButton: document.getElementById("openRecordTestCaseButton"),
  recordTestCaseDialog: document.getElementById("recordTestCaseDialog"),
  recordTestCaseForm: document.getElementById("recordTestCaseForm"),
  closeRecordTestCaseButton: document.getElementById("closeRecordTestCaseButton"),
  recordTestCaseCompanySelect: document.getElementById("recordTestCaseCompanySelect"),
  recordTestCasePlatformOrderInput: document.getElementById("recordTestCasePlatformOrderInput"),
  recordTestCaseTitleInput: document.getElementById("recordTestCaseTitleInput"),
  recordTestCaseButton: document.getElementById("recordTestCaseButton"),
  recordTestCaseStatus: document.getElementById("recordTestCaseStatus"),
  replayTestCaseDialog: document.getElementById("replayTestCaseDialog"),
  replayTestCaseForm: document.getElementById("replayTestCaseForm"),
  closeReplayTestCaseButton: document.getElementById("closeReplayTestCaseButton"),
  replayTestCaseCompanySelect: document.getElementById("replayTestCaseCompanySelect"),
  replayTestCaseSummary: document.getElementById("replayTestCaseSummary"),
  replayTestCaseButton: document.getElementById("replayTestCaseButton"),
  replayTestCaseStatus: document.getElementById("replayTestCaseStatus"),
  testCaseTableBody: document.getElementById("testCaseTableBody"),
  testCaseEmpty: document.getElementById("testCaseEmpty"),
  testCasePagination: document.getElementById("testCasePagination"),
  testCaseDetail: document.getElementById("testCaseDetail"),
  testCaseDetailSummary: document.getElementById("testCaseDetailSummary"),
  testCaseDetailContent: document.getElementById("testCaseDetailContent"),
  requestState: document.getElementById("requestState"),
  overviewEmpty: document.getElementById("overviewEmpty"),
  overviewContent: document.getElementById("overviewContent"),
  overviewSubtitle: document.getElementById("overviewSubtitle"),
  summaryMetrics: document.getElementById("summaryMetrics"),
  sheetSummaryTable: document.getElementById("sheetSummaryTable"),
  topIssuePanel: document.getElementById("topIssuePanel"),
  focusFailedButton: document.getElementById("focusFailedButton"),
  downloadJsonButton: document.getElementById("downloadJsonButton"),
  documentOverviewEmpty: document.getElementById("documentOverviewEmpty"),
  documentOverviewContent: document.getElementById("documentOverviewContent"),
  documentOverviewSubtitle: document.getElementById("documentOverviewSubtitle"),
  documentSummaryMetrics: document.getElementById("documentSummaryMetrics"),
  documentSummaryTable: document.getElementById("documentSummaryTable"),
  toast: document.getElementById("toast"),
};

const DOCUMENT_GROUPS = [
  {
    tabId: "doc-originalOrder",
    key: "originalOrder",
    title: "原始订单",
    collections: [
      { path: ["originalOrder", "tradeList"], title: "ERP 原始主订单", model: "ErpTradeDO" },
      { path: ["originalOrder", "orderList"], title: "ERP 原始子订单", model: "ErpOrderDO" },
    ],
  },
  {
    tabId: "doc-originalAfterSale",
    key: "originalAfterSale",
    title: "原始售后",
    collections: [
      { path: ["originalAfterSale", "workOrderList"], title: "ERP 原始售后工单", model: "ErpWorkOrderDO" },
      { path: ["originalAfterSale", "reissueOrRefundList"], title: "ERP 原始补发退货明细", model: "ErpReissueOrRefundDO" },
      { path: ["originalAfterSale", "itemSnapshotList"], title: "ERP 原始售后商品快照", model: "ErpItemSnapshotDO" },
    ],
  },
  {
    tabId: "doc-standardFundBillList",
    key: "standardFundBillList",
    title: "标准资金账单",
    collections: [{ path: ["standardFundBillList"], title: "标准资金账单", model: "YzStandardFundBillFlowInfoDO" }],
  },
  {
    tabId: "doc-orderStream",
    key: "orderStream",
    title: "出入库流水明细",
    collections: [
      { path: ["orderStream", "detailList"], title: "出入库流水明细", model: "YzOrderStreamDetailDO" },
      { path: ["orderStream", "extList"], title: "出入库流水扩展属性", model: "YzOrderStreamExtDO" },
    ],
  },
  {
    tabId: "doc-arReconciliationList",
    key: "arReconciliationList",
    title: "应收对账表",
    collections: [{ path: ["arReconciliationList"], title: "应收对账表", model: "YzArReconciliationDO" }],
  },
  {
    tabId: "doc-manualVerifyRecordList",
    key: "manualVerifyRecordList",
    title: "账单手动核销",
    collections: [{ path: ["manualVerifyRecordList"], title: "账单手动核销", model: "YzManualVerifyRecordDO" }],
  },
  {
    tabId: "doc-arAdjustmentRecordList",
    key: "arAdjustmentRecordList",
    title: "应收手动调整",
    collections: [{ path: ["arAdjustmentRecordList"], title: "应收手动调整", model: "YzArAdjustmentRecordDO" }],
  },
  {
    tabId: "doc-issuedBalanceProcessList",
    key: "issuedBalanceProcessList",
    title: "发出余额处理",
    collections: [{ path: ["issuedBalanceProcessList"], title: "发出余额处理", model: "YzIssuedBalanceProcessDO" }],
  },
  {
    tabId: "doc-afterSalesExceptionList",
    key: "afterSalesExceptionList",
    title: "售后差异监控",
    collections: [{ path: ["afterSalesExceptionList"], title: "售后差异监控", model: "YzAfterSalesExceptionDO" }],
  },
  {
    tabId: "doc-afterSalesExceptionDetailList",
    key: "afterSalesExceptionDetailList",
    title: "售后差异明细",
    collections: [{ path: ["afterSalesExceptionDetailList"], title: "售后差异明细", model: "YzAfterSalesExceptionDetailDO" }],
  },
  {
    tabId: "doc-refundOnlyTrackingList",
    key: "refundOnlyTrackingList",
    title: "仅退款追踪",
    collections: [{ path: ["refundOnlyTrackingList"], title: "仅退款追踪", model: "YzRefundOnlyTrackingDO" }],
  },
  {
    tabId: "doc-issuedBalanceDetailList",
    key: "issuedBalanceDetailList",
    title: "发出余额明细",
    collections: [{ path: ["issuedBalanceDetailList"], title: "发出余额明细", model: "YzIssuedBalanceDetailDO" }],
  },
];

const TEST_CASE_DOCUMENT_FIELD_BY_RESULT_KEY = {
  originalOrder: "originalOrder",
  originalAfterSale: "originalAfterSale",
  standardFundBillList: "standardFundBill",
  orderStream: "orderStream",
  arReconciliationList: "arReconciliation",
  manualVerifyRecordList: "manualVerifyRecord",
  arAdjustmentRecordList: "arAdjustmentRecord",
  issuedBalanceProcessList: "issuedBalanceProcess",
  afterSalesExceptionList: "afterSalesException",
  afterSalesExceptionDetailList: "afterSalesExceptionDetail",
  refundOnlyTrackingList: "refundOnlyTracking",
  issuedBalanceDetailList: "issuedBalanceDetail",
};

const FALLBACK_FIELD_LABELS = {
  id: "主键ID",
  companyId: "公司ID",
  created: "创建时间",
  modified: "更新时间",
  createdAt: "创建时间",
  updatedAt: "更新时间",
  platformOrderNo: "平台订单号",
  orderNo: "平台订单号",
  tid: "平台订单号",
  sid: "系统订单号",
  oid: "子订单号",
  shopId: "店铺ID",
  shopName: "店铺名称",
  skuCode: "商品编码",
  productName: "商品名称",
  amount: "金额",
  receivableAdjustAmt: "应收调整金额",
  adjustReason: "调整原因",
  receivedAmount: "到账金额",
  buyerPaidReceivedAmount: "到账实付金额",
  receivedSubsidyAmount: "到账补贴金额",
  diffAmount: "合计差额",
  afterSaleDiffSituation: "售后差异情况",
  fundDataId: "资金数据ID",
  verifyTime: "核销时间",
  verifyNo: "核销单号",
  streamId: "关联出入库流水ID",
  remark: "备注",
};

const COMPANY_CONFIG_FIELDS = [
  { key: "reissueRecordReceivable", label: "补发商品是否计入应收", description: "补发商品是否计入应收：0=不计入，1=计入", type: "binary", off: "不计入", on: "计入" },
  { key: "exchangeOrderRefundParticipateReconcile", label: "换货订单/换货退货是否参与对账", description: "换货订单/换货退货是否参与对账：0=不参与，1=参与", type: "binary", off: "不参与", on: "参与" },
  { key: "exchangeOrderRefundRecordReceivable", label: "换货订单/换货退货是否计入应收", description: "换货订单/换货退货是否计入应收：0=不计入，1=计入", type: "binary", off: "不计入", on: "计入" },
  { key: "giftItemParticipateReconcile", label: "赠品是否参与对账", description: "赠品是否参与对账：0=不参与，1=参与", type: "binary", off: "不参与", on: "参与" },
  { key: "giftItemRecordReceivable", label: "赠品是否计入应收", description: "赠品是否计入应收：0=不计入，1=计入", type: "binary", off: "不计入", on: "计入" },
  { key: "emptyOrderParticipateReconcile", label: "空单是否参与对账", description: "空单是否参与对账：0=不参与，1=参与", type: "binary", off: "不参与", on: "参与" },
  { key: "emptyOrderRecordReceivable", label: "空单是否计入应收", description: "空单是否计入应收：0=不计入，1=计入", type: "binary", off: "不计入", on: "计入" },
  { key: "virtualItemParticipateReconcile", label: "虚拟商品是否参与对账", description: "虚拟商品是否参与对账：0=不参与，1=参与", type: "binary", off: "不参与", on: "参与" },
  { key: "virtualItemRecordReceivable", label: "虚拟商品是否计入应收", description: "虚拟商品是否计入应收：0=不计入，1=计入", type: "binary", off: "不计入", on: "计入" },
  { key: "otherErpDeliveryParticipateReconcile", label: "其他ERP发货是否参与对账", description: "其他ERP发货是否参与对账：0=不参与，1=参与", type: "binary", off: "不参与", on: "参与" },
  { key: "otherErpDeliveryRecordReceivable", label: "其他ERP发货是否计入应收", description: "其他ERP发货是否计入应收：0=不计入，1=计入", type: "binary", off: "不计入", on: "计入" },
  { key: "amountToleranceLowerLimit", label: "金额容差下限", description: "差额大于等于该值时，允许自动匹配。", type: "decimal" },
  { key: "amountToleranceUpperLimit", label: "金额容差上限", description: "差额小于等于该值时，允许自动匹配。", type: "decimal" },
  { key: "partialAmountWriteOff", label: "是否开启部分金额核销", description: "是否开启部分金额核销：0=不开启，1=开启", type: "binary", off: "不开启", on: "开启" },
  { key: "afterSalesDiffNotWriteOff", label: "存在售后差异是否不核销", description: "存在售后差异是否不核销：0=需要核销，1=不核销", type: "binary", off: "需要核销", on: "不核销" },
  { key: "returnCostDeductTiming", label: "退货成本扣减时点", description: "退货入库时处理，或在退款账单金额核销时处理退货成本。", type: "choice", choices: [{ value: "RETURN_INBOUND", label: "退货入库时扣减成本" }, { value: "REFUND_WRITEOFF", label: "退款核销时扣减成本" }] },
  { key: "blockReason", label: "售后差异阻断原因", description: "售后差异导致退款账单不核销时，展示或记录的阻断原因。", type: "text" },
  { key: "crossPeriodRule", label: "核销是否允许跨会计期间", description: "ALLOW=允许跨期，FORBID=不允许跨期。", type: "choice", choices: [{ value: "ALLOW", label: "允许跨期" }, { value: "FORBID", label: "不允许跨期" }] },
];

window.__validateViewer = {
  renderResponse(response) {
    setValidationMode("excel", { load: false });
    const unwrapped = acceptValidateResponse(response);
    switchModule("validate");
    switchTab("overview");
    els.downloadJsonButton.disabled = false;
    return {
      sheetCount: state.sheetEntries.length,
      totalRowCount: state.result?.totalRowCount,
      totalMismatchCount: state.result?.totalMismatchCount,
      error: unwrapped.error,
    };
  },
  renderDocumentResponse(response) {
    const unwrapped = acceptDocumentResponse(response);
    switchModule("documents");
    switchTab("doc-overview");
    els.downloadJsonButton.disabled = false;
    return {
      documentCount: totalDocumentRecordCount(),
      platformOrderNo: state.documentPlatformOrderNo,
      error: unwrapped.error,
    };
  },
  inspect() {
    return {
      activeModule: state.activeModule,
      activeTab: state.activeTab,
      sheetCount: state.sheetEntries.length,
      hasResult: Boolean(state.result),
      hasDocumentResult: Boolean(state.documentResult),
    };
  },
};

window.addEventListener("validate-viewer:render-response", (event) => {
  try {
    window.__validateViewer.renderResponse(event.detail);
  } catch (error) {
    showToast(error.message);
  }
});

window.addEventListener("document-viewer:render-response", (event) => {
  try {
    window.__validateViewer.renderDocumentResponse(event.detail);
  } catch (error) {
    showToast(error.message);
  }
});

init();

async function init() {
  bindEvents();
  renderCompanyOptions();
  setCompanyForActiveModule(defaultCompanyForModule(state.activeModule));
  await Promise.all([loadConfig(), loadDocumentLabels()]);
  renderDocumentAll();
  setValidationMode("excel", { load: false });
  switchModule("validate");
}

function bindEvents() {
  document.querySelectorAll("[data-module-switch]").forEach((button) => {
    button.addEventListener("click", () => switchModule(button.dataset.moduleSwitch));
  });

  els.tabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (!tab) return;
    if (tab.dataset.module && tab.dataset.module !== state.activeModule) return;
    switchTab(tab.dataset.tab);
  });

  els.configForm.addEventListener("change", async (event) => {
    if (event.target.name === "environment") {
      setEnvironment(event.target.value);
      if (state.validationMode === "test-case") await loadValidationTestCases();
    } else if (event.target === els.companySelect) {
      setCompanyForActiveModule(event.target.value);
      if (state.validationMode === "test-case") await loadValidationTestCases();
    }
  });

  els.configForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveConfig();
  });

  els.companyConfigCompanySelect.addEventListener("change", async () => {
    setCompanyForActiveModule(els.companyConfigCompanySelect.value);
    await loadCompanyConfig();
  });

  els.companyConfigForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveCompanyConfig();
  });

  els.uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (state.validationMode === "test-case") {
      await validateTestCaseResult();
    } else {
      await validateExcel();
    }
  });
  document.querySelectorAll("[data-validation-mode]").forEach((button) => {
    button.addEventListener("click", () => setValidationMode(button.dataset.validationMode));
  });
  els.validationTestCaseSelect.addEventListener("change", updateValidationTestCaseSelection);

  els.documentQueryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await queryDocumentByPlatformOrderNo();
  });

  els.testCaseQueryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    state.testCaseQuery.pageNo = 1;
    await loadTestCases();
  });

  els.testCaseCompanySelect.addEventListener("change", async () => {
    setCompanyForActiveModule(els.testCaseCompanySelect.value);
    state.testCaseQuery.pageNo = 1;
    await loadTestCases();
  });

  els.openRecordTestCaseButton.addEventListener("click", openRecordTestCaseDialog);
  els.closeRecordTestCaseButton.addEventListener("click", () => els.recordTestCaseDialog.close());
  els.recordTestCaseForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await recordTestCase();
  });
  els.closeReplayTestCaseButton.addEventListener("click", () => els.replayTestCaseDialog.close());
  els.replayTestCaseForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await replayTestCase();
  });

  els.jsonImportForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderJsonInput();
  });

  els.fileInput.addEventListener("change", updateFileName);

  ["dragenter", "dragover"].forEach((name) => {
    els.dropZone.addEventListener(name, (event) => {
      event.preventDefault();
      els.dropZone.classList.add("dragging");
    });
  });

  ["dragleave", "drop"].forEach((name) => {
    els.dropZone.addEventListener(name, (event) => {
      event.preventDefault();
      els.dropZone.classList.remove("dragging");
    });
  });

  els.dropZone.addEventListener("drop", (event) => {
    if (event.dataTransfer.files.length > 0) {
      els.fileInput.files = event.dataTransfer.files;
      updateFileName();
    }
  });

  els.focusFailedButton.addEventListener("click", () => {
    state.onlyIssueSheets = !state.onlyIssueSheets;
    els.focusFailedButton.classList.toggle("active", state.onlyIssueSheets);
    els.focusFailedButton.textContent = state.onlyIssueSheets ? "查看全部 Sheet" : "只看异常 Sheet";
    renderOverview();
  });

  els.downloadJsonButton.addEventListener("click", downloadRawJson);

  document.addEventListener("click", (event) => {
    const switcher = event.target.closest("[data-switch-tab]");
    if (switcher) {
      switchTab(switcher.dataset.switchTab);
      return;
    }

    const testCasePage = event.target.closest("[data-test-case-page]");
    if (testCasePage) {
      const pageNo = Number(testCasePage.dataset.testCasePage);
      if (Number.isInteger(pageNo) && pageNo > 0 && pageNo !== state.testCaseQuery.pageNo) {
        state.testCaseQuery.pageNo = pageNo;
        loadTestCases();
      }
      return;
    }

    const testCaseDetail = event.target.closest("[data-test-case-detail]");
    if (testCaseDetail) {
      viewTestCaseDocuments(Number(testCaseDetail.dataset.testCaseDetail));
      return;
    }

    const testCaseReplay = event.target.closest("[data-test-case-replay]");
    if (testCaseReplay) {
      openReplayTestCaseDialog(Number(testCaseReplay.dataset.testCaseReplay));
      return;
    }

    const testCaseDelete = event.target.closest("[data-test-case-delete]");
    if (testCaseDelete) {
      deleteTestCase(Number(testCaseDelete.dataset.testCaseDelete));
      return;
    }

    const testCaseEditTitle = event.target.closest("[data-test-case-edit-title]");
    if (testCaseEditTitle) {
      state.editingTestCaseTitleId = Number(testCaseEditTitle.dataset.testCaseEditTitle);
      renderTestCases();
      const titleInput = document.querySelector(`[data-test-case-title-input="${cssAttr(state.editingTestCaseTitleId)}"]`);
      titleInput?.focus();
      titleInput?.select();
      return;
    }

    const testCaseSaveTitle = event.target.closest("[data-test-case-save-title]");
    if (testCaseSaveTitle) {
      updateTestCaseTitle(Number(testCaseSaveTitle.dataset.testCaseSaveTitle));
      return;
    }

    const testCaseCancelTitle = event.target.closest("[data-test-case-cancel-title]");
    if (testCaseCancelTitle) {
      state.editingTestCaseTitleId = null;
      renderTestCases();
      return;
    }

    const testCaseEditStatus = event.target.closest("[data-test-case-edit-status]");
    if (testCaseEditStatus) {
      state.editingTestCaseStatusId = Number(testCaseEditStatus.dataset.testCaseEditStatus);
      renderTestCases();
      document.querySelector(`[data-test-case-status-input="${cssAttr(state.editingTestCaseStatusId)}"]`)?.focus();
      return;
    }

    const testCaseSaveStatus = event.target.closest("[data-test-case-save-status]");
    if (testCaseSaveStatus) {
      updateTestCaseStatus(Number(testCaseSaveStatus.dataset.testCaseSaveStatus));
      return;
    }

    const testCaseCancelStatus = event.target.closest("[data-test-case-cancel-status]");
    if (testCaseCancelStatus) {
      state.editingTestCaseStatusId = null;
      renderTestCases();
      return;
    }

    const documentEdit = event.target.closest("[data-document-edit]");
    if (documentEdit) {
      beginDocumentFieldEdit(documentEdit);
      return;
    }

    const documentSave = event.target.closest("[data-document-save]");
    if (documentSave) {
      saveDocumentFieldEdit(documentSave);
      return;
    }

    const documentCancel = event.target.closest("[data-document-cancel]");
    if (documentCancel) {
      state.documentEditingCell = null;
      renderDocumentPages();
      return;
    }

    const modeButton = event.target.closest("[data-filter-mode]");
    if (modeButton) {
      const tabId = modeButton.dataset.tabId;
      const filter = ensureSheetFilter(tabId);
      filter.mode = modeButton.dataset.filterMode;
      renderSheetRows(tabId);
      return;
    }

    const fieldModeButton = event.target.closest("[data-field-mode]");
    if (fieldModeButton) {
      const tabId = fieldModeButton.dataset.tabId;
      const rowIndex = Number(fieldModeButton.dataset.rowIndex);
      const key = rowKey(tabId, rowIndex);
      state.expandedRows.add(key);
      state.rowFieldModes.set(key, fieldModeButton.dataset.fieldMode);
      renderSheetRows(tabId);
      return;
    }

    const toggle = event.target.closest("[data-action='toggle-row']");
    if (toggle) {
      const tabId = toggle.dataset.tabId;
      const rowIndex = Number(toggle.dataset.rowIndex);
      const key = rowKey(tabId, rowIndex);
      if (state.expandedRows.has(key)) {
        state.expandedRows.delete(key);
      } else {
        state.expandedRows.add(key);
      }
      renderSheetRows(tabId);
    }
  });

  document.addEventListener("input", (event) => {
    const search = event.target.closest("[data-row-search]");
    if (search) {
      const tabId = search.dataset.tabId;
      const filter = ensureSheetFilter(tabId);
      filter.query = search.value.trim();
      renderSheetRows(tabId);
      return;
    }

    const documentSearch = event.target.closest("[data-document-search]");
    if (documentSearch) {
      const tabId = documentSearch.dataset.tabId;
      const filter = ensureDocumentFilter(tabId);
      filter.query = documentSearch.value.trim();
      renderDocumentPages();
      switchTab(tabId);
      restoreDocumentSearchFocus(tabId);
    }
  });

  document.addEventListener("change", (event) => {
    const targetSelect = event.target.closest("[data-target-select]");
    if (targetSelect) {
      const tabId = targetSelect.dataset.tabId;
      const filter = ensureSheetFilter(tabId);
      filter.target = targetSelect.value;
      renderSheetRows(tabId);
      return;
    }

  });
}

async function loadConfig() {
  try {
    const response = await fetch("/api/config");
    const payload = await response.json();
    state.environments = payload.environments || {};
    state.companies = normalizeCompanies(payload.companies);
    state.defaultCompanyByModule = {
      ...state.defaultCompanyByModule,
      ...(payload.defaultCompanyByModule || {}),
    };
    state.companyByModule = { ...state.defaultCompanyByModule };
    state.validatePath = payload.validatePath || state.validatePath;
    state.documentQueryPath = payload.documentQueryPath || state.documentQueryPath;
    state.testCasePageListPath = payload.testCasePageListPath || state.testCasePageListPath;
    state.testCasePageInfoPath = payload.testCasePageInfoPath || state.testCasePageInfoPath;
    state.testCaseValidateResultPath = payload.testCaseValidateResultPath || state.testCaseValidateResultPath;
    state.testCaseReplayPath = payload.testCaseReplayPath || state.testCaseReplayPath;
    applyConfig(payload.config || {});
  } catch (error) {
    showToast(`配置读取失败：${error.message}`);
  }
}

async function loadDocumentLabels() {
  try {
    const response = await fetch("/api/document-labels");
    const payload = await response.json();
    state.documentLabels = { ...FALLBACK_FIELD_LABELS, ...(payload.labels || {}) };
    state.documentModelLabels = payload.models || {};
    state.documentLabelsLoaded = Boolean(payload.labels || payload.models);
  } catch (error) {
    state.documentLabels = { ...FALLBACK_FIELD_LABELS };
    state.documentModelLabels = {};
    state.documentLabelsLoaded = false;
  }
}

async function ensureDocumentLabels() {
  if (state.documentLabelsLoaded) return;
  await loadDocumentLabels();
}

function applyConfig(config, options = {}) {
  state.config = { ...state.config, ...config };
  renderCompanyOptions();
  setEnvironment(state.config.environment || "auto");
  if (options.resetCompany !== false) {
    setCompanyForActiveModule(defaultCompanyForModule(state.activeModule));
  }
}

function setEnvironment(value) {
  state.config.environment = state.environments[value] ? value : "auto";
  document.querySelectorAll("input[name='environment']").forEach((input) => {
    input.checked = input.value === state.config.environment;
    input.closest(".segment").classList.toggle("active", input.checked);
  });

  els.baseUrlText.textContent = environmentBaseUrl();
  updateRequestText();
}

function getSelectedEnvironment() {
  const selected = document.querySelector("input[name='environment']:checked");
  return selected ? selected.value : "auto";
}

function updateEnvSummary() {
  const environment = getSelectedEnvironment();
  const baseUrl = environmentBaseUrl(environment);
  const path = state.activeModule === "documents"
    ? state.documentSource === "test-case" ? state.testCaseGetPath : state.documentQueryPath
    : state.activeModule === "test-cases"
      ? state.testCasePageListPath
    : state.activeModule === "company-config"
      ? "/cloudaccount/config/company/getByCompanyId"
      : currentValidatePath();
  els.envSummary.textContent = `${environmentLabel(environment)} · ${baseUrl}${path.replace(/^\//, "")}`;
}

function environmentBaseUrl(environment = getSelectedEnvironment()) {
  if (state.environments[environment]?.baseUrl) return state.environments[environment].baseUrl;
  return window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8080/"
    : "https://pubcloud3.superboss.cc/";
}

function environmentLabel(environment) {
  if (state.environments[environment]?.label) return state.environments[environment].label;
  return "自动环境";
}

function currentValidatePath() {
  if (state.validateSource !== "test-case") return state.validatePath;
  return state.validateTestCase?.validationType === "replay"
    ? state.testCaseReplayPath
    : state.testCaseValidateResultPath;
}

function normalizeCompanies(companies) {
  if (!Array.isArray(companies) || companies.length === 0) {
    return state.companies;
  }
  const normalized = companies
    .map((company) => ({
      name: String(company.name || company.label || "").trim(),
      companyId: String(company.companyId || company.value || "").trim(),
    }))
    .filter((company) => company.name && company.companyId);
  return normalized.length > 0 ? normalized : state.companies;
}

function renderCompanyOptions() {
  els.companySelect.innerHTML = state.companies
    .map((company) => `<option value="${escapeAttr(company.companyId)}">${escapeHtml(company.name)}</option>`)
    .join("");
  els.companyConfigCompanySelect.innerHTML = state.companies
    .map((company) => `<option value="${escapeAttr(company.companyId)}">${escapeHtml(company.name)}（${escapeHtml(company.companyId)}）</option>`)
    .join("");
  els.testCaseCompanySelect.innerHTML = state.companies
    .map((company) => `<option value="${escapeAttr(company.companyId)}">${escapeHtml(company.name)}（${escapeHtml(company.companyId)}）</option>`)
    .join("");
  els.recordTestCaseCompanySelect.innerHTML = state.companies
    .map((company) => `<option value="${escapeAttr(company.companyId)}">${escapeHtml(company.name)}（${escapeHtml(company.companyId)}）</option>`)
    .join("");
  const replayDefaultCompanyId = state.companies.some((company) => company.companyId === REPLAY_DEFAULT_COMPANY_ID)
    ? REPLAY_DEFAULT_COMPANY_ID
    : state.companies[0]?.companyId || "";
  els.replayTestCaseCompanySelect.innerHTML = state.companies
    .map((company) => `<option value="${escapeAttr(company.companyId)}"${company.companyId === replayDefaultCompanyId ? " selected" : ""}>${escapeHtml(company.name)}（${escapeHtml(company.companyId)}）</option>`)
    .join("");
  els.replayTestCaseCompanySelect.value = replayDefaultCompanyId;
}

function defaultCompanyForModule(module) {
  return state.defaultCompanyByModule[module] || state.companies[0]?.companyId || "";
}

function selectedCompanyId() {
  return state.companyByModule[state.activeModule] || defaultCompanyForModule(state.activeModule);
}

function selectedCompanyConfigId() {
  return String(els.companyConfigCompanySelect.value || "").trim();
}

function selectedCompany() {
  const companyId = selectedCompanyId();
  return state.companies.find((company) => company.companyId === companyId) || { name: "未选择公司", companyId };
}

function setCompanyForActiveModule(companyId) {
  const normalizedCompanyId = String(companyId || "").trim();
  state.companyByModule[state.activeModule] = normalizedCompanyId;
  if (els.companySelect.value !== normalizedCompanyId) {
    els.companySelect.value = normalizedCompanyId;
  }
  if (els.companyConfigCompanySelect.value !== normalizedCompanyId) {
    els.companyConfigCompanySelect.value = normalizedCompanyId;
  }
  if (els.testCaseCompanySelect.value !== normalizedCompanyId) {
    els.testCaseCompanySelect.value = normalizedCompanyId;
  }
  updateRequestText();
}

function updateRequestText() {
  updateEnvSummary();
  const company = selectedCompany();
  els.companyHint.textContent = company.companyId ? `companyId=${company.companyId}` : "请选择公司";
  els.uploadPathText.textContent = `POST ${state.validatePath} · companyId=${company.companyId || "-"}`;
  els.testCaseValidatePathText.textContent = `POST ${state.testCaseValidateResultPath} · companyId=${company.companyId || "-"}`;
  els.documentQueryPathText.textContent = `GET ${state.documentQueryPath}?platformOrderNo=...&companyId=${company.companyId || "-"}`;
  els.companyConfigCompanyHint.textContent = company.companyId ? `companyId=${company.companyId}` : "请选择公司";
}

async function loadCompanyConfig() {
  const companyId = selectedCompanyConfigId();
  if (!companyId) return;
  state.companyConfigLoading = true;
  els.companyConfigLoading.classList.remove("hidden");
  els.saveCompanyConfigButton.disabled = true;
  try {
    const params = new URLSearchParams({ companyId, environment: getSelectedEnvironment() });
    const response = await fetch(`/api/company-config?${params.toString()}`);
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || `获取失败（HTTP ${payload.targetStatus || response.status}）`);
    }
    const config = unwrapCompanyConfigResponse(payload.response);
    state.companyConfig = { ...config, companyId: String(companyId) };
    renderCompanyConfigFields();
    setInlineStatus(els.saveCompanyConfigStatus, "当前配置已加载", "success");
  } catch (error) {
    state.companyConfig = { companyId: String(companyId) };
    renderCompanyConfigFields();
    setInlineStatus(els.saveCompanyConfigStatus, error.message, "error");
    showToast(`核销配置读取失败：${error.message}`);
  } finally {
    state.companyConfigLoading = false;
    els.companyConfigLoading.classList.add("hidden");
    els.saveCompanyConfigButton.disabled = false;
  }
}

function unwrapCompanyConfigResponse(response) {
  if (!response || response.rawText) {
    throw new Error(response?.rawText?.slice(0, 300) || "接口返回为空");
  }
  const failed = response.result !== undefined && Number(response.result) !== 200 && response.success !== true;
  if (failed) {
    throw new Error(response.errorMessage || response.message || response.errorCode || "业务接口返回失败");
  }
  const config = response.data ?? response;
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("接口返回的配置格式不正确");
  }
  return config;
}

function renderCompanyConfigFields() {
  const config = state.companyConfig || {};
  els.companyConfigFields.innerHTML = [
    ...COMPANY_CONFIG_FIELDS.map((field) => renderCompanyConfigField(field, config[field.key])),
    `<div class="company-config-field readonly-field">
      <div class="company-config-field-meta"><label class="field-label">最后修改时间</label><div class="field-hint">字段：updatedAt；系统自动维护，不能编辑。</div></div>
      <output class="readonly-value">${escapeHtml(formatDateTime(config.updatedAt))}</output>
    </div>`,
  ].join("");
}

function renderCompanyConfigField(field, value) {
  const inputId = `company-config-${field.key}`;
  let control = "";
  if (field.type === "binary") {
    control = renderCompanyConfigRadioGroup(field, value, [{ value: "0", label: field.off }, { value: "1", label: field.on }]);
  } else if (field.type === "choice") {
    control = renderCompanyConfigRadioGroup(field, value, field.choices);
  } else if (field.type === "decimal") {
    control = `<input id="${inputId}" data-company-config-field="${field.key}" type="text" inputmode="decimal" autocomplete="off" placeholder="暂不填写" value="${escapeAttr(value ?? "")}" />`;
  } else {
    control = `<input id="${inputId}" data-company-config-field="${field.key}" type="text" autocomplete="off" placeholder="暂不填写" value="${escapeAttr(value ?? "")}" />`;
  }
  return `<div class="company-config-field">
    <div class="company-config-field-meta"><label class="field-label" for="${inputId}">${escapeHtml(field.label)}</label><div class="field-hint">${escapeHtml(field.description)}</div></div>
    <div class="company-config-control">${control}</div>
  </div>`;
}

function renderCompanyConfigRadioGroup(field, value, choices) {
  const isUnset = value === null || value === undefined || value === "";
  const selected = isUnset ? "" : String(value);
  const items = isUnset ? [{ value: "", label: "暂不选择" }, ...choices] : choices;
  return `<div class="company-config-radio-group">${items.map((item) => {
    const id = `company-config-${field.key}-${item.value || "unset"}`;
    return `<label class="company-config-radio${selected === item.value ? " active" : ""}" for="${id}">
      <input id="${id}" data-company-config-field="${field.key}" type="radio" name="company-config-${field.key}" value="${escapeAttr(item.value)}"${selected === item.value ? " checked" : ""} />
      <span>${escapeHtml(item.label)}</span>
    </label>`;
  }).join("")}</div>`;
}

function companyConfigFormPayload() {
  const companyId = selectedCompanyConfigId();
  if (!companyId) {
    throw new Error("请选择公司");
  }
  // 以核销配置页顶部下拉框的当前值为准，不使用其他菜单的公司选择状态。
  const payload = { companyId, environment: getSelectedEnvironment() };
  for (const field of COMPANY_CONFIG_FIELDS) {
    const inputs = els.companyConfigFields.querySelectorAll(`[data-company-config-field="${cssAttr(field.key)}"]`);
    let value;
    if (field.type === "binary" || field.type === "choice") {
      value = [...inputs].find((input) => input.checked)?.value ?? "";
    } else {
      value = inputs[0]?.value.trim() ?? "";
    }
    if (field.type === "binary") {
      payload[field.key] = value === "" ? null : Number(value);
    } else {
      payload[field.key] = value === "" ? null : value;
    }
  }
  return payload;
}

async function saveCompanyConfig() {
  setInlineStatus(els.saveCompanyConfigStatus, "保存中...");
  els.saveCompanyConfigButton.disabled = true;
  try {
    const response = await fetch("/api/company-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyConfigFormPayload()),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || `保存失败（HTTP ${payload.targetStatus || response.status}）`);
    }
    const result = payload.response || {};
    if (result.result !== undefined && Number(result.result) !== 200 && result.success !== true) {
      throw new Error(result.errorMessage || result.message || "业务接口保存失败");
    }
    await loadCompanyConfig();
    setInlineStatus(els.saveCompanyConfigStatus, "已保存并刷新当前配置", "success");
    showToast("核销配置已保存");
  } catch (error) {
    setInlineStatus(els.saveCompanyConfigStatus, error.message, "error");
    showToast(`保存失败：${error.message}`);
  } finally {
    els.saveCompanyConfigButton.disabled = false;
  }
}

function formatDateTime(value) {
  if (!value) return "暂无修改记录";
  if (typeof value === "string") return value.replace("T", " ");
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("zh-CN", { hour12: false });
}

async function saveConfig() {
  setInlineStatus(els.saveConfigStatus, "保存中...");
  try {
    const response = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: getSelectedEnvironment(),
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || "保存失败");
    }
    applyConfig(payload.config, { resetCompany: false });
    setInlineStatus(els.saveConfigStatus, "已保存", "success");
    showToast("配置已保存");
  } catch (error) {
    setInlineStatus(els.saveConfigStatus, error.message, "error");
    showToast(`保存失败：${error.message}`);
  }
}

function setValidationMode(mode, options = {}) {
  state.validationMode = mode === "test-case" ? "test-case" : "excel";
  document.querySelectorAll("[data-validation-mode]").forEach((button) => {
    const active = button.dataset.validationMode === state.validationMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-validation-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.validationPanel !== state.validationMode);
  });

  if (state.validationMode === "test-case") {
    setValidateSource("test-case", { validationType: "validate-result" });
    if (options.load !== false) loadValidationTestCases();
  } else {
    setValidateSource("excel");
  }
  updateValidationModeUi();
}

function updateValidationModeUi() {
  if (state.activeModule !== "validate") return;
  els.configSubtitle.textContent = state.validationMode === "test-case"
    ? "选择环境、公司和已录制的测试用例，校验当前运行结果。"
    : "选择环境和公司，上传预期结果 Excel。";
  updateRequestText();
}

async function loadValidationTestCases() {
  const companyId = selectedCompanyId();
  const environment = getSelectedEnvironment();
  const requestKey = `${environment}:${companyId}`;
  state.validationTestCases = [];
  state.validationTestCasesCompanyId = companyId;
  els.validationTestCaseSelect.disabled = true;
  els.validateTestCaseButton.disabled = true;
  els.validationTestCaseSelect.innerHTML = '<option value="">正在加载测试用例...</option>';
  setInlineStatus(els.validateTestCaseStatus, "正在加载...");

  try {
    const response = await fetch("/api/test-cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment,
        companyId,
        pageNo: 1,
        pageSize: 500,
      }),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      const statuses = Object.values(proxyPayload.targetStatus || {}).join("/");
      throw new Error(proxyPayload.message || `目标接口 HTTP ${statuses || response.status}`);
    }
    if (`${getSelectedEnvironment()}:${selectedCompanyId()}` !== requestKey || state.validationMode !== "test-case") return;

    const records = unwrapTestCaseResponse(proxyPayload.response?.list, "用例列表");
    if (!Array.isArray(records)) {
      throw new Error("用例列表接口返回的 data 不是数组");
    }
    state.validationTestCases = records;
    els.validationTestCaseSelect.innerHTML = [
      '<option value="">请选择测试用例</option>',
      ...records.map((record) => `<option value="${escapeAttr(record.id)}">#${escapeHtml(numberText(record.id))} · ${escapeHtml(displayValue(record.title) || "未命名用例")} · ${escapeHtml(displayValue(record.platformOrderNo) || "-")}</option>`),
    ].join("");
    els.validationTestCaseSelect.disabled = false;
    setInlineStatus(
      els.validateTestCaseStatus,
      records.length ? `已加载 ${records.length} 条用例` : "当前公司暂无测试用例",
      records.length ? "success" : "",
    );
  } catch (error) {
    if (`${getSelectedEnvironment()}:${selectedCompanyId()}` !== requestKey || state.validationMode !== "test-case") return;
    els.validationTestCaseSelect.innerHTML = '<option value="">测试用例加载失败</option>';
    setInlineStatus(els.validateTestCaseStatus, error.message, "error");
    showToast(`用例列表加载失败：${error.message}`);
  }
}

function updateValidationTestCaseSelection() {
  const id = Number(els.validationTestCaseSelect.value);
  const record = state.validationTestCases.find((item) => Number(item.id) === id);
  els.validateTestCaseButton.disabled = !record;
  if (!record) {
    setValidateSource("test-case", { validationType: "validate-result" });
    return;
  }
  const company = selectedCompany();
  setValidateSource("test-case", {
    ...record,
    validationType: "validate-result",
    validationCompanyId: company.companyId,
    validationCompanyName: company.name,
  });
}

async function validateTestCaseResult() {
  const id = Number(els.validationTestCaseSelect.value);
  const record = state.validationTestCases.find((item) => Number(item.id) === id);
  if (!record) {
    showToast("请选择测试用例");
    els.validationTestCaseSelect.focus();
    return;
  }

  const company = selectedCompany();
  els.validateTestCaseButton.disabled = true;
  setInlineStatus(els.validateTestCaseStatus, "正在校验用例...");
  setRequestState("running", "用例校验中");
  try {
    const response = await fetch("/api/test-case-validate-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: getSelectedEnvironment(),
        companyId: company.companyId,
        id,
      }),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      throw new Error(proxyPayload.message || `目标接口 HTTP ${proxyPayload.targetStatus || response.status}`);
    }

    const unwrapped = unwrapValidateResponse(proxyPayload.response);
    if (!unwrapped.data) {
      throw new Error(unwrapped.error || "用例校验接口返回中未找到 data.sheetResultMap");
    }
    setValidateSource("test-case", {
      ...record,
      validationType: "validate-result",
      validationCompanyId: company.companyId,
      validationCompanyName: company.name,
    });
    acceptValidateResponse(proxyPayload.response, unwrapped);
    switchTab("overview");
    setRequestState(unwrapped.error ? "error" : "success", unwrapped.error ? "用例校验异常" : "用例校验完成");
    setInlineStatus(els.validateTestCaseStatus, `${state.sheetEntries.length} 个 sheet`, "success");
    els.downloadJsonButton.disabled = false;
    showToast(unwrapped.error || `测试用例 #${id} 校验完成`);
  } catch (error) {
    setRequestState("error", "用例校验失败");
    setInlineStatus(els.validateTestCaseStatus, error.message, "error");
    showToast(`用例校验失败：${error.message}`);
  } finally {
    const selectedId = Number(els.validationTestCaseSelect.value);
    els.validateTestCaseButton.disabled = els.validationTestCaseSelect.disabled
      || !state.validationTestCases.some((item) => Number(item.id) === selectedId);
  }
}

async function validateExcel() {
  const file = els.fileInput.files[0];
  if (!file) {
    showToast("请选择 Excel 文件");
    return;
  }

  const previousSource = state.validateSource;
  const previousTestCase = state.validateTestCase;
  setValidateSource("excel");
  setRequestState("running", "校验中");
  els.validateButton.disabled = true;
  setInlineStatus(els.uploadStatus, "正在上传并校验...");

  const formData = new FormData();
  formData.append("environment", getSelectedEnvironment());
  formData.append("companyId", selectedCompanyId());
  formData.append("file", file);

  try {
    const response = await fetch("/api/validate", {
      method: "POST",
      body: formData,
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      const message = proxyPayload.message || `目标接口 HTTP ${proxyPayload.targetStatus || response.status}`;
      throw new Error(message);
    }

    const unwrapped = unwrapValidateResponse(proxyPayload.response);
    if (!unwrapped.data) {
      throw new Error(unwrapped.error || "接口返回中未找到 data.sheetResultMap");
    }

    acceptValidateResponse(proxyPayload.response, unwrapped);
    setRequestState(unwrapped.error ? "error" : "success", unwrapped.error ? "接口异常" : "校验完成");
    setInlineStatus(els.uploadStatus, `HTTP ${proxyPayload.targetStatus} · ${state.sheetEntries.length} 个 sheet`);
    els.downloadJsonButton.disabled = false;
    switchTab("overview");
    showToast(unwrapped.error || "校验结果已更新");
  } catch (error) {
    setValidateSource(previousSource, previousTestCase);
    setRequestState("error", "校验失败");
    setInlineStatus(els.uploadStatus, error.message, "error");
    showToast(`校验失败：${error.message}`);
  } finally {
    els.validateButton.disabled = false;
  }
}

async function queryDocumentByPlatformOrderNo() {
  const platformOrderNo = els.platformOrderInput.value.trim();
  if (!platformOrderNo) {
    showToast("请输入平台订单号");
    return;
  }

  setRequestState("running", "查询中");
  els.documentQueryButton.disabled = true;
  setInlineStatus(els.documentQueryStatus, "正在查询单据...");

  try {
    const response = await fetch("/api/document-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: getSelectedEnvironment(),
        companyId: selectedCompanyId(),
        platformOrderNo,
      }),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      const message = proxyPayload.message || `目标接口 HTTP ${proxyPayload.targetStatus || response.status}`;
      throw new Error(message);
    }

    const unwrapped = unwrapDocumentResponse(proxyPayload.response);
    if (!unwrapped.data) {
      throw new Error(unwrapped.error || "接口返回中未找到单据数据");
    }

    state.documentPlatformOrderNo = platformOrderNo;
    await ensureDocumentLabels();
    setDocumentSource("live");
    acceptDocumentResponse(proxyPayload.response, unwrapped);
    setRequestState(unwrapped.error ? "error" : "success", unwrapped.error ? "接口异常" : "查询完成");
    setInlineStatus(els.documentQueryStatus, `HTTP ${proxyPayload.targetStatus} · ${totalDocumentRecordCount()} 条记录`, "success");
    els.downloadJsonButton.disabled = false;
    switchTab("doc-overview");
    showToast(unwrapped.error || "单据结果已更新");
  } catch (error) {
    setRequestState("error", "查询失败");
    setInlineStatus(els.documentQueryStatus, error.message, "error");
    showToast(`查询失败：${error.message}`);
  } finally {
    els.documentQueryButton.disabled = false;
  }
}

function openRecordTestCaseDialog() {
  const defaultCompanyId = defaultCompanyForModule("test-cases");
  els.recordTestCaseCompanySelect.value = defaultCompanyId;
  els.recordTestCasePlatformOrderInput.value = "";
  els.recordTestCaseTitleInput.value = "";
  setInlineStatus(els.recordTestCaseStatus, "");
  els.recordTestCaseDialog.showModal();
  window.requestAnimationFrame(() => els.recordTestCasePlatformOrderInput.focus());
}

function openReplayTestCaseDialog(id) {
  const record = state.testCases.find((item) => Number(item.id) === id);
  if (!record || !Number.isInteger(id) || id < 1) return;

  state.replayTestCaseRecord = record;
  els.replayTestCaseCompanySelect.value = REPLAY_DEFAULT_COMPANY_ID;
  if (!els.replayTestCaseCompanySelect.value) {
    els.replayTestCaseCompanySelect.value = defaultCompanyForModule("test-cases");
  }
  els.replayTestCaseSummary.textContent = `测试用例 #${id} · ${displayValue(record.title) || "未命名用例"} · 平台订单号 ${displayValue(record.platformOrderNo) || "-"}`;
  setInlineStatus(els.replayTestCaseStatus, "");
  els.replayTestCaseDialog.showModal();
  window.requestAnimationFrame(() => els.replayTestCaseCompanySelect.focus());
}

async function replayTestCase() {
  const record = state.replayTestCaseRecord;
  const id = Number(record?.id);
  const companyId = String(els.replayTestCaseCompanySelect.value || "").trim();
  if (!record || !Number.isInteger(id) || id < 1) {
    setInlineStatus(els.replayTestCaseStatus, "未找到需要回放的测试用例", "error");
    return;
  }
  if (!companyId) {
    setInlineStatus(els.replayTestCaseStatus, "请选择回放公司", "error");
    els.replayTestCaseCompanySelect.focus();
    return;
  }

  const company = state.companies.find((item) => item.companyId === companyId) || { name: "未命名公司", companyId };
  els.replayTestCaseButton.disabled = true;
  setInlineStatus(els.replayTestCaseStatus, "正在回放，请稍候...");
  setRequestState("running", "回放中");
  try {
    const response = await fetch("/api/test-case-replay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: getSelectedEnvironment(),
        companyId,
        id,
      }),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      throw new Error(proxyPayload.message || `目标接口 HTTP ${proxyPayload.targetStatus || response.status}`);
    }

    const unwrapped = unwrapValidateResponse(proxyPayload.response);
    if (!unwrapped.data) {
      throw new Error(unwrapped.error || "回放接口返回中未找到 data.sheetResultMap");
    }

    const replayMeta = {
      ...record,
      validationType: "replay",
      replayCompanyId: companyId,
      replayCompanyName: company.name,
    };
    setValidationMode("test-case", { load: false });
    setValidateSource("test-case", replayMeta);
    acceptValidateResponse(proxyPayload.response, unwrapped);
    els.replayTestCaseDialog.close();
    switchModule("validate");
    setCompanyForActiveModule(companyId);
    loadValidationTestCases();
    switchTab("overview");
    setRequestState(unwrapped.error ? "error" : "success", unwrapped.error ? "回放异常" : "回放完成");
    els.downloadJsonButton.disabled = false;
    showToast(unwrapped.error || `测试用例 #${id} 回放完成`);
  } catch (error) {
    setRequestState("error", "回放失败");
    setInlineStatus(els.replayTestCaseStatus, error.message, "error");
    showToast(`回放失败：${error.message}`);
  } finally {
    els.replayTestCaseButton.disabled = false;
  }
}

async function recordTestCase() {
  const companyId = String(els.recordTestCaseCompanySelect.value || "").trim();
  const platformOrderNo = els.recordTestCasePlatformOrderInput.value.trim();
  const title = els.recordTestCaseTitleInput.value.trim();
  if (!companyId) {
    setInlineStatus(els.recordTestCaseStatus, "请选择公司", "error");
    return;
  }
  if (!platformOrderNo) {
    setInlineStatus(els.recordTestCaseStatus, "请输入平台订单号", "error");
    els.recordTestCasePlatformOrderInput.focus();
    return;
  }

  els.recordTestCaseButton.disabled = true;
  setInlineStatus(els.recordTestCaseStatus, "正在录制...");
  try {
    const response = await fetch("/api/test-case-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: getSelectedEnvironment(),
        companyId,
        platformOrderNo,
        title: title || undefined,
      }),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      throw new Error(proxyPayload.message || `目标接口 HTTP ${proxyPayload.targetStatus || response.status}`);
    }

    const testCaseId = unwrapTestCaseResponse(proxyPayload.response, "录制");
    if (testCaseId === null || testCaseId === undefined || testCaseId === "") {
      throw new Error("录制接口未返回用例编号");
    }

    els.recordTestCaseDialog.close();
    setCompanyForActiveModule(companyId);
    state.testCaseQuery.pageNo = 1;
    state.testCaseQuery.status = "";
    els.testCasePlatformOrderInput.value = "";
    els.testCaseStatusSelect.value = "";
    await loadTestCases();
    showToast(`录制成功，用例编号：${testCaseId}`);
  } catch (error) {
    setInlineStatus(els.recordTestCaseStatus, error.message, "error");
    showToast(`录制失败：${error.message}`);
  } finally {
    els.recordTestCaseButton.disabled = false;
  }
}

function testCaseRequestPayload() {
  const platformOrderNo = els.testCasePlatformOrderInput.value.trim();
  const status = els.testCaseStatusSelect.value;
  state.testCaseQuery.platformOrderNo = platformOrderNo;
  state.testCaseQuery.status = status;
  return {
    environment: getSelectedEnvironment(),
    companyId: selectedCompanyId(),
    platformOrderNo: platformOrderNo || undefined,
    status: status === "" ? undefined : Number(status),
    pageNo: state.testCaseQuery.pageNo,
    pageSize: state.testCaseQuery.pageSize,
  };
}

async function loadTestCases() {
  const requestPayload = testCaseRequestPayload();
  setRequestState("running", "查询中");
  els.testCaseQueryButton.disabled = true;
  setInlineStatus(els.testCaseQueryStatus, "");

  try {
    const response = await fetch("/api/test-cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      const statuses = Object.values(proxyPayload.targetStatus || {}).join("/");
      throw new Error(proxyPayload.message || `目标接口 HTTP ${statuses || response.status}`);
    }

    const list = unwrapTestCaseResponse(proxyPayload.response?.list, "列表");
    const pageInfo = unwrapTestCaseResponse(proxyPayload.response?.pageInfo, "分页信息");
    if (!Array.isArray(list)) {
      throw new Error("列表接口返回的 data 不是数组");
    }
    if (!pageInfo || typeof pageInfo !== "object" || Array.isArray(pageInfo)) {
      throw new Error("分页接口返回的 data 格式不正确");
    }

    state.testCases = list;
    state.testCasePageInfo = {
      total: Number(pageInfo.total || 0),
      pageNo: Number(pageInfo.pageNo || state.testCaseQuery.pageNo),
      pageSize: Number(pageInfo.pageSize || state.testCaseQuery.pageSize),
    };
    state.testCaseQuery.pageNo = state.testCasePageInfo.pageNo;
    state.testCaseQuery.pageSize = state.testCasePageInfo.pageSize;
    state.testCasesLoaded = true;
    state.testCaseRawResponse = proxyPayload.response;
    renderTestCases();
    setRequestState("success", "查询完成");
    setInlineStatus(els.testCaseQueryStatus, "");
    syncDownloadButton();
  } catch (error) {
    setRequestState("error", "查询失败");
    setInlineStatus(els.testCaseQueryStatus, error.message, "error");
    showToast(`测试用例查询失败：${error.message}`);
  } finally {
    els.testCaseQueryButton.disabled = false;
  }
}

function unwrapTestCaseResponse(response, name) {
  if (!response || response.rawText) {
    throw new Error(`${name}接口返回为空或不是 JSON`);
  }
  const failed = response.result !== undefined && Number(response.result) !== 200 && response.success !== true;
  if (failed) {
    throw new Error(response.errorMessage || response.message || `${name}接口业务处理失败`);
  }
  return response.data ?? response;
}

function renderTestCases() {
  const records = state.testCases || [];
  const firstRowNumber = (state.testCasePageInfo.pageNo - 1) * state.testCasePageInfo.pageSize + 1;
  els.testCaseTableBody.innerHTML = records.map((record, index) => {
    const status = testCaseStatus(record.status);
    const isEditingTitle = Number(record.id) === state.editingTestCaseTitleId;
    const isEditingStatus = Number(record.id) === state.editingTestCaseStatusId;
    const titleCell = isEditingTitle
      ? `<div class="test-case-title-editor">
          <input data-test-case-title-input="${escapeAttr(record.id)}" type="text" value="${escapeAttr(displayValue(record.title))}" aria-label="用例标题" />
          <button class="test-case-title-save" type="button" data-test-case-save-title="${escapeAttr(record.id)}">保存</button>
          <button class="test-case-title-cancel" type="button" data-test-case-cancel-title="${escapeAttr(record.id)}">取消</button>
        </div>`
      : `<div class="test-case-title-cell">
          <span>${escapeHtml(displayValue(record.title) || "-")}</span>
          <button class="test-case-title-edit" type="button" data-test-case-edit-title="${escapeAttr(record.id)}">编辑</button>
        </div>`;
    const statusCell = isEditingStatus
      ? `<div class="test-case-status-editor">
          <select data-test-case-status-input="${escapeAttr(record.id)}" aria-label="用例状态">
            ${renderTestCaseStatusOptions(record.status)}
          </select>
          <button class="test-case-title-save" type="button" data-test-case-save-status="${escapeAttr(record.id)}">保存</button>
          <button class="test-case-title-cancel" type="button" data-test-case-cancel-status="${escapeAttr(record.id)}">取消</button>
        </div>`
      : `<div class="test-case-status-cell">
          <span class="status-chip ${status.tone}">${escapeHtml(status.label)}</span>
          <button class="test-case-title-edit" type="button" data-test-case-edit-status="${escapeAttr(record.id)}">编辑</button>
        </div>`;
    return `<tr>
      <td class="number-cell">${numberText(firstRowNumber + index)}</td>
      <td class="number-cell">${numberText(record.id)}</td>
      <td>${titleCell}</td>
      <td class="mono-cell">${escapeHtml(displayValue(record.platformOrderNo) || "-")}</td>
      <td>${statusCell}</td>
      <td class="number-cell">${escapeHtml(formatDateTime(record.createdAt))}</td>
      <td class="number-cell">${escapeHtml(formatDateTime(record.updatedAt))}</td>
      <td class="test-case-actions">
        <button class="test-case-action" type="button" data-test-case-detail="${escapeAttr(record.id)}">查看</button>
        <button class="test-case-action replay" type="button" data-test-case-replay="${escapeAttr(record.id)}">回放</button>
        <button class="test-case-action danger" type="button" data-test-case-delete="${escapeAttr(record.id)}">删除</button>
      </td>
    </tr>`;
  }).join("");

  const hasRecords = records.length > 0;
  els.testCaseEmpty.classList.toggle("hidden", hasRecords);
  if (!hasRecords) {
    els.testCaseEmpty.textContent = state.testCasesLoaded ? "没有符合条件的测试用例。" : "点击查询获取测试用例。";
  }
  renderTestCasePagination();
}

function renderTestCaseStatusOptions(value) {
  const selected = Number(value);
  return [
    [0, "待处理"],
    [1, "已完成"],
    [2, "作废"],
  ].map(([status, label]) => `<option value="${status}"${status === selected ? " selected" : ""}>${label}</option>`).join("");
}

function testCaseStatus(value) {
  const status = Number(value);
  if (status === 0) return { label: "待处理", tone: "warning" };
  if (status === 1) return { label: "已完成", tone: "success" };
  if (status === 2) return { label: "作废", tone: "error" };
  return { label: value === null || value === undefined || value === "" ? "-" : String(value), tone: "" };
}

function renderTestCasePagination() {
  const { total, pageNo, pageSize } = state.testCasePageInfo;
  const pageCount = Math.ceil(total / pageSize);
  els.testCasePagination.classList.toggle("hidden", pageCount <= 1);
  if (pageCount <= 1) {
    els.testCasePagination.innerHTML = "";
    return;
  }

  const pages = new Set([1, pageCount, pageNo - 1, pageNo, pageNo + 1]);
  const items = [...pages].filter((page) => page >= 1 && page <= pageCount).sort((a, b) => a - b);
  let previous = 0;
  const pageButtons = items.map((page) => {
    const gap = page - previous > 1 ? `<span class="pagination-gap">…</span>` : "";
    previous = page;
    return `${gap}<button type="button" class="${page === pageNo ? "active" : ""}" data-test-case-page="${page}">${page}</button>`;
  }).join("");
  els.testCasePagination.innerHTML = `
    <button type="button" ${pageNo <= 1 ? "disabled" : ""} data-test-case-page="${pageNo - 1}" aria-label="上一页">‹</button>
    ${pageButtons}
    <button type="button" ${pageNo >= pageCount ? "disabled" : ""} data-test-case-page="${pageNo + 1}" aria-label="下一页">›</button>`;
}

async function viewTestCaseDocuments(id) {
  const listRecord = state.testCases.find((item) => Number(item.id) === id);
  if (!listRecord) return;
  setRequestState("running", "读取用例中");
  try {
    const response = await fetch("/api/test-case-get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: getSelectedEnvironment(),
        companyId: selectedCompanyId(),
        id,
      }),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      throw new Error(proxyPayload.message || `目标接口 HTTP ${proxyPayload.targetStatus || response.status}`);
    }
    const record = unwrapTestCaseResponse(proxyPayload.response, "用例详情");
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      throw new Error("用例详情数据格式不正确");
    }

    const documentResult = testCaseRecordToDocumentResult(record);
    state.documentPlatformOrderNo = displayValue(record.platformOrderNo);
    await ensureDocumentLabels();
    setDocumentSource("test-case", record);
    acceptDocumentResponse({ data: documentResult, testCase: record }, { data: documentResult, error: "" });
    switchModule("documents");
    setCompanyForActiveModule(String(record.companyId || selectedCompanyId()));
    switchTab("doc-overview");
    setRequestState("success", "用例已加载");
    showToast(`已打开用例 #${id} 的单据快照`);
  } catch (error) {
    setRequestState("error", "读取失败");
    showToast(`用例详情读取失败：${error.message}`);
  }
}

function testCaseRecordToDocumentResult(record) {
  return {
    originalOrder: parseTestCaseSnapshot(record.originalOrder, {}),
    originalAfterSale: parseTestCaseSnapshot(record.originalAfterSale, {}),
    standardFundBillList: parseTestCaseSnapshot(record.standardFundBill, []),
    orderStream: parseTestCaseSnapshot(record.orderStream, {}),
    arReconciliationList: parseTestCaseSnapshot(record.arReconciliation, []),
    manualVerifyRecordList: parseTestCaseSnapshot(record.manualVerifyRecord, []),
    arAdjustmentRecordList: parseTestCaseSnapshot(record.arAdjustmentRecord, []),
    issuedBalanceProcessList: parseTestCaseSnapshot(record.issuedBalanceProcess, []),
    afterSalesExceptionList: parseTestCaseSnapshot(record.afterSalesException, []),
    afterSalesExceptionDetailList: parseTestCaseSnapshot(record.afterSalesExceptionDetail, []),
    refundOnlyTrackingList: parseTestCaseSnapshot(record.refundOnlyTracking, []),
    issuedBalanceDetailList: parseTestCaseSnapshot(record.issuedBalanceDetail, []),
  };
}

function parseTestCaseSnapshot(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    return parsed === null ? fallback : parsed;
  } catch (error) {
    throw new Error(`用例快照 JSON 解析失败：${error.message}`);
  }
}

function setDocumentSource(source, testCase = null) {
  state.documentSource = source === "test-case" ? "test-case" : "live";
  state.documentTestCase = state.documentSource === "test-case" ? testCase : null;
  state.documentEditingCell = null;
  document.body.dataset.documentSource = state.documentSource;
  updateDocumentSourceUi();
}

function setValidateSource(source, testCase = null) {
  state.validateSource = source === "test-case" ? "test-case" : "excel";
  state.validateTestCase = state.validateSource === "test-case" ? testCase : null;
  document.body.dataset.validateSource = state.validateSource;
  updateValidateSourceUi();
}

function updateValidateSourceUi() {
  if (state.activeModule !== "validate") return;
  const fromTestCase = state.validateSource === "test-case";
  const isReplay = state.validateTestCase?.validationType === "replay";
  document.querySelector(".brand-mark").textContent = fromTestCase ? "例" : "验";
  document.querySelector(".brand-title").textContent = fromTestCase
    ? isReplay ? "测试用例回放校验" : "测试用例运行结果校验"
    : "导入运行结果校验";
  updateEnvSummary();
}

function validateTestCaseSourceText() {
  const record = state.validateTestCase;
  if (state.validateSource !== "test-case" || !record?.id) return "";
  const isReplay = record.validationType === "replay";
  const companyName = displayValue(isReplay ? record.replayCompanyName : record.validationCompanyName) || "未命名公司";
  const companyId = displayValue(isReplay ? record.replayCompanyId : record.validationCompanyId) || "-";
  const actionLabel = isReplay ? "回放公司" : "校验公司";
  return `测试用例 #${record.id} · ${displayValue(record.title) || "未命名用例"} · ${actionLabel} ${companyName}（${companyId}）`;
}

function updateDocumentSourceUi() {
  if (state.activeModule !== "documents") return;
  const fromTestCase = state.documentSource === "test-case";
  document.querySelector(".brand-mark").textContent = fromTestCase ? "例" : "单";
  document.querySelector(".brand-title").textContent = fromTestCase ? "测试用例单据查看" : "导入运行结果单据查看";
  updateEnvSummary();
}

async function updateTestCaseTitle(id) {
  const titleInput = document.querySelector(`[data-test-case-title-input="${cssAttr(id)}"]`);
  const title = titleInput?.value.trim() || "";
  if (!title) {
    showToast("用例标题不能为空");
    titleInput?.focus();
    return;
  }

  try {
    const response = await fetch("/api/test-case-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: getSelectedEnvironment(),
        companyId: selectedCompanyId(),
        id,
        title,
      }),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      throw new Error(proxyPayload.message || `目标接口 HTTP ${proxyPayload.targetStatus || response.status}`);
    }
    const updatedCount = unwrapTestCaseResponse(proxyPayload.response, "修改");
    if (Number(updatedCount) < 1) {
      throw new Error("未找到可修改的测试用例");
    }

    state.editingTestCaseTitleId = null;
    await loadTestCases();
    showToast("用例标题已更新");
  } catch (error) {
    showToast(`修改失败：${error.message}`);
  }
}

async function updateTestCaseStatus(id) {
  const statusInput = document.querySelector(`[data-test-case-status-input="${cssAttr(id)}"]`);
  const status = Number(statusInput?.value);
  if (![0, 1, 2].includes(status)) {
    showToast("请选择有效状态");
    statusInput?.focus();
    return;
  }

  try {
    const response = await fetch("/api/test-case-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: getSelectedEnvironment(),
        companyId: selectedCompanyId(),
        id,
        status,
      }),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      throw new Error(proxyPayload.message || `目标接口 HTTP ${proxyPayload.targetStatus || response.status}`);
    }
    const updatedCount = unwrapTestCaseResponse(proxyPayload.response, "修改状态");
    if (Number(updatedCount) < 1) {
      throw new Error("未找到可修改的测试用例");
    }

    state.editingTestCaseStatusId = null;
    await loadTestCases();
    showToast("用例状态已更新");
  } catch (error) {
    showToast(`状态修改失败：${error.message}`);
  }
}

async function deleteTestCase(id) {
  const record = state.testCases.find((item) => Number(item.id) === id);
  if (!record || !Number.isInteger(id) || id < 1) return;
  const label = displayValue(record.title) || `用例 #${id}`;
  if (!window.confirm(`确认删除“${label}”吗？此操作不可恢复。`)) return;

  setRequestState("running", "删除中");
  try {
    const response = await fetch("/api/test-case-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: getSelectedEnvironment(),
        companyId: selectedCompanyId(),
        id,
      }),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      throw new Error(proxyPayload.message || `目标接口 HTTP ${proxyPayload.targetStatus || response.status}`);
    }
    const deletedCount = unwrapTestCaseResponse(proxyPayload.response, "删除");
    if (Number(deletedCount) < 1) {
      throw new Error("未找到可删除的测试用例");
    }

    els.testCaseDetail.classList.add("hidden");
    els.testCaseDetail.open = false;
    await loadTestCases();
    showToast("测试用例已删除");
  } catch (error) {
    setRequestState("error", "删除失败");
    showToast(`删除失败：${error.message}`);
  }
}

function renderJsonInput() {
  const text = els.jsonInput.value.trim();
  if (!text) {
    showToast("请先粘贴接口返回 JSON");
    return;
  }
  try {
    const payload = JSON.parse(text);
    setValidationMode("excel", { load: false });
    const unwrapped = acceptValidateResponse(payload);
    els.downloadJsonButton.disabled = false;
    switchTab("overview");
    setRequestState(unwrapped.error ? "error" : "success", unwrapped.error ? "接口异常" : "JSON 已渲染");
    setInlineStatus(els.jsonImportStatus, `${state.sheetEntries.length} 个 sheet`, "success");
    showToast(unwrapped.error || "JSON 已渲染");
  } catch (error) {
    setRequestState("error", "JSON 解析失败");
    setInlineStatus(els.jsonImportStatus, error.message, "error");
    showToast(`JSON 解析失败：${error.message}`);
  }
}

function acceptValidateResponse(response, existingUnwrapped = null) {
  const unwrapped = existingUnwrapped || unwrapValidateResponse(response);
  if (!unwrapped.data) {
    throw new Error(unwrapped.error || "接口返回中未找到 data.sheetResultMap");
  }
  state.result = unwrapped.data;
  state.rawResponse = response;
  state.sheetEntries = Object.entries(state.result.sheetResultMap || {});
  state.expandedRows.clear();
  state.rowFieldModes.clear();
  renderAllResults();
  return unwrapped;
}

function unwrapValidateResponse(response) {
  if (!response) {
    return { data: null, error: "接口返回为空" };
  }
  if (response.sheetResultMap) {
    return { data: response, error: "" };
  }
  if (response.data && response.data.sheetResultMap) {
    const error = response.result && response.result !== 200
      ? response.errorMessage || response.errorCode || "业务接口返回非 200"
      : "";
    return { data: response.data, error };
  }
  if (response.rawText) {
    return { data: null, error: response.rawText.slice(0, 500) };
  }
  return { data: null, error: response.errorMessage || response.message || "接口返回结构不匹配" };
}

function acceptDocumentResponse(response, existingUnwrapped = null) {
  const unwrapped = existingUnwrapped || unwrapDocumentResponse(response);
  if (!unwrapped.data) {
    throw new Error(unwrapped.error || "接口返回中未找到单据数据");
  }
  state.documentResult = unwrapped.data;
  state.documentRawResponse = response;
  state.documentFilters.clear();
  renderDocumentAll();
  return unwrapped;
}

function unwrapDocumentResponse(response) {
  if (!response) {
    return { data: null, error: "接口返回为空" };
  }
  if (isDocumentResult(response)) {
    return { data: response, error: "" };
  }
  if (response.data && isDocumentResult(response.data)) {
    const error = response.result && response.result !== 200
      ? response.errorMessage || response.errorCode || "业务接口返回非 200"
      : "";
    return { data: response.data, error };
  }
  if (response.rawText) {
    return { data: null, error: response.rawText.slice(0, 500) };
  }
  return { data: null, error: response.errorMessage || response.message || "接口返回结构不匹配" };
}

function isDocumentResult(value) {
  if (!value || typeof value !== "object") return false;
  return DOCUMENT_GROUPS.some((group) => Object.prototype.hasOwnProperty.call(value, group.key));
}

function renderAllResults() {
  clearDynamicTabs();
  renderOverview();
  renderSheetTabsAndPages();
  renderModuleTabs();
}

function renderDocumentAll() {
  renderDocumentOverview();
  renderDocumentPages();
  renderModuleTabs();
}

function renderDocumentOverview() {
  if (!state.documentResult) {
    els.documentOverviewEmpty.classList.remove("hidden");
    els.documentOverviewContent.classList.add("hidden");
    els.documentOverviewSubtitle.textContent = "输入平台订单号查询后，这里会展示各单据记录数。";
    return;
  }

  els.documentOverviewEmpty.classList.add("hidden");
  els.documentOverviewContent.classList.remove("hidden");
  const sourceText = state.documentSource === "test-case" && state.documentTestCase
    ? `测试用例 #${state.documentTestCase.id} · ${displayValue(state.documentTestCase.title) || "未命名用例"}`
    : "实时接口查询";
  els.documentOverviewSubtitle.textContent = `${sourceText} · 平台订单号 ${state.documentPlatformOrderNo || "-"} · ${totalDocumentRecordCount()} 条记录`;

  const groupCounts = DOCUMENT_GROUPS.map((group) => ({
    group,
    collections: resolveDocumentCollections(group),
  }));
  const nonEmptyCount = groupCounts.filter((item) => collectionTotal(item.collections) > 0).length;
  els.documentSummaryMetrics.innerHTML = [
    metricCard("平台订单号", state.documentPlatformOrderNo || "-", "本次查询条件", "compact-value"),
    metricCard("总记录数", totalDocumentRecordCount(), `${nonEmptyCount} 个单据页有数据`),
    metricCard("明细分组", groupCounts.reduce((sum, item) => sum + item.collections.length, 0), "按响应对象列表拆分"),
    metricCard("空单据页", DOCUMENT_GROUPS.length - nonEmptyCount, "当前未返回记录"),
  ].join("");

  const tbody = els.documentSummaryTable.querySelector("tbody");
  tbody.innerHTML = groupCounts.map(({ group, collections }) => {
    const count = collectionTotal(collections);
    const details = collections.map((collection) => `${collection.title} ${collection.records.length}`).join(" / ") || "无明细分组";
    return `
      <tr>
        <td>${escapeHtml(group.title)}</td>
        <td class="number-cell">${numberText(count)}</td>
        <td>${escapeHtml(details)}</td>
        <td>
          <button class="small-button" type="button" data-switch-tab="${escapeAttr(group.tabId)}" ${count ? "" : "disabled"}>查看</button>
        </td>
      </tr>
    `;
  }).join("");
}

function renderDocumentPages() {
  els.documentPages.innerHTML = DOCUMENT_GROUPS.map((group) => renderDocumentPage(group)).join("");
}

function renderDocumentPage(group) {
  const collections = resolveDocumentCollections(group);
  const filter = ensureDocumentFilter(group.tabId);
  const total = collectionTotal(collections);
  const visibleTotal = collections.reduce((sum, collection) => {
    return sum + filterDocumentRecords(collection.records, filter, collection.model).length;
  }, 0);
  return `
    <section class="page ${state.activeTab === group.tabId ? "active" : ""}" id="page-${escapeAttr(group.tabId)}" data-page="${escapeAttr(group.tabId)}">
      <div class="sheet-head">
        <div>
          <h1>${escapeHtml(group.title)}</h1>
          <div class="sheet-meta">
            ${renderPill(`总记录 ${numberText(total)}`)}
            ${renderPill(`当前展示 ${numberText(visibleTotal)}`)}
            ${renderPill(`平台订单号 ${displayValue(state.documentPlatformOrderNo) || "-"}`)}
            ${state.documentSource === "test-case" && state.documentTestCase ? renderPill(`测试用例 #${state.documentTestCase.id} · 可编辑`, "red") : ""}
          </div>
        </div>
        <div class="toolbar">
          <button class="secondary-button" type="button" data-switch-tab="doc-overview">返回概况</button>
        </div>
      </div>

      <div class="sheet-toolbar">
        <div class="sheet-toolbar-main">
          <span class="target-chip">${escapeHtml(collections.length ? `${collections.length} 个明细分组` : "无明细分组")}</span>
        </div>
        <div class="sheet-toolbar-extra">
          <input type="search" placeholder="搜索字段和值" value="${escapeAttr(filter.query)}" data-document-search data-tab-id="${escapeAttr(group.tabId)}" />
        </div>
      </div>

      ${state.documentResult ? renderDocumentCollections(collections, filter, group) : renderDocumentEmpty("暂无单据结果，请先按平台订单号查询。")}
    </section>
  `;
}

function renderDocumentCollections(collections, filter, group) {
  if (!collectionTotal(collections)) {
    return renderDocumentEmpty("当前平台订单号没有返回该单据数据。");
  }
  return collections.map((collection, collectionIndex) => renderDocumentCollection(collection, filter, group, collectionIndex)).join("");
}

function renderDocumentCollection(collection, filter, group, collectionIndex) {
  const records = collection.records
    .map((record, recordIndex) => ({ record, recordIndex }))
    .filter(({ record }) => filterDocumentRecords([record], filter, collection.model).length > 0);
  const fields = collectDocumentFields(collection.records);
  return `
    <section class="document-section">
      <div class="document-section-head">
        <div>
          <h2>${escapeHtml(collection.title)}</h2>
          <p class="muted">${numberText(records.length)} / ${numberText(collection.records.length)} 条记录</p>
        </div>
      </div>
      ${records.length ? `
        <div class="table-wrap">
          <table class="data-table document-table">
            <thead>
              <tr>
                ${fields.map((field) => renderDocumentHeader(field, collection.model)).join("")}
              </tr>
            </thead>
            <tbody>
              ${records.map(({ record, recordIndex }) => `
                <tr>
                  ${fields.map((field) => `<td>${renderDocumentFieldCell(record[field], {
                    groupKey: group.key,
                    tabId: group.tabId,
                    collectionIndex,
                    recordIndex,
                    field,
                  })}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      ` : renderDocumentEmpty("没有符合搜索条件的记录。")}
    </section>
  `;
}

function renderDocumentFieldCell(value, meta) {
  if (state.documentSource !== "test-case") {
    return renderDocumentValue(value);
  }
  const key = documentCellKey(meta);
  if (documentCellKey(state.documentEditingCell) === key) {
    return `<div class="document-field-editor">
      <textarea data-document-editor-key="${escapeAttr(key)}" data-value-type="${escapeAttr(documentValueType(value))}" aria-label="编辑 ${escapeAttr(meta.field)}">${escapeHtml(documentEditorText(value))}</textarea>
      <div class="document-field-editor-actions">
        <button class="document-field-save" type="button" data-document-save
          data-group-key="${escapeAttr(meta.groupKey)}" data-tab-id="${escapeAttr(meta.tabId)}"
          data-collection-index="${meta.collectionIndex}" data-record-index="${meta.recordIndex}"
          data-field="${escapeAttr(meta.field)}">保存</button>
        <button class="document-field-cancel" type="button" data-document-cancel>取消</button>
      </div>
    </div>`;
  }
  return `<div class="document-field-cell">
    <div class="document-field-value">${renderDocumentValue(value)}</div>
    <button class="document-field-edit" type="button" data-document-edit
      data-group-key="${escapeAttr(meta.groupKey)}" data-tab-id="${escapeAttr(meta.tabId)}"
      data-collection-index="${meta.collectionIndex}" data-record-index="${meta.recordIndex}"
      data-field="${escapeAttr(meta.field)}">编辑</button>
  </div>`;
}

function documentCellKey(meta) {
  if (!meta) return "";
  return [meta.groupKey, meta.collectionIndex, meta.recordIndex, meta.field].join("::");
}

function documentValueType(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "object") return "object";
  return typeof value;
}

function documentEditorText(value) {
  if (value === null || value === undefined) return "";
  return typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
}

function beginDocumentFieldEdit(button) {
  if (state.documentSource !== "test-case") return;
  state.documentEditingCell = documentEditMeta(button);
  renderDocumentPages();
  switchTab(state.documentEditingCell.tabId);
  const editor = document.querySelector(`[data-document-editor-key="${cssAttr(documentCellKey(state.documentEditingCell))}"]`);
  editor?.focus();
  editor?.select();
}

async function saveDocumentFieldEdit(button) {
  if (state.documentSource !== "test-case" || !state.documentTestCase) return;
  const meta = documentEditMeta(button);
  const key = documentCellKey(meta);
  const editor = document.querySelector(`[data-document-editor-key="${cssAttr(key)}"]`);
  if (!editor) return;

  const group = DOCUMENT_GROUPS.find((item) => item.key === meta.groupKey);
  const collection = group?.collections[meta.collectionIndex];
  const records = collection ? normalizeRecords(valueAtPath(state.documentResult, collection.path)) : [];
  const record = records[meta.recordIndex];
  const snapshotField = TEST_CASE_DOCUMENT_FIELD_BY_RESULT_KEY[meta.groupKey];
  if (!group || !collection || !record || !snapshotField) {
    showToast("无法定位需要修改的单据字段");
    return;
  }

  const oldValue = record[meta.field];
  let nextValue;
  try {
    nextValue = parseDocumentEditorValue(editor.value, editor.dataset.valueType);
  } catch (error) {
    showToast(`字段值格式不正确：${error.message}`);
    editor.focus();
    return;
  }

  record[meta.field] = nextValue;
  const snapshotJson = JSON.stringify(state.documentResult[meta.groupKey]);
  button.disabled = true;
  try {
    const requestBody = {
      environment: getSelectedEnvironment(),
      companyId: String(state.documentTestCase.companyId),
      id: Number(state.documentTestCase.id),
      [snapshotField]: snapshotJson,
    };
    const response = await fetch("/api/test-case-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const proxyPayload = await response.json();
    if (!response.ok || !proxyPayload.ok) {
      throw new Error(proxyPayload.message || `目标接口 HTTP ${proxyPayload.targetStatus || response.status}`);
    }
    const updatedCount = unwrapTestCaseResponse(proxyPayload.response, "修改单据字段");
    if (Number(updatedCount) < 1) {
      throw new Error("未找到可修改的测试用例");
    }

    state.documentTestCase[snapshotField] = snapshotJson;
    state.documentEditingCell = null;
    renderDocumentPages();
    switchTab(meta.tabId);
    showToast(`${fieldLabel(meta.field, collection.model)} 已保存`);
  } catch (error) {
    record[meta.field] = oldValue;
    button.disabled = false;
    showToast(`保存失败：${error.message}`);
  }
}

function documentEditMeta(element) {
  return {
    groupKey: element.dataset.groupKey,
    tabId: element.dataset.tabId,
    collectionIndex: Number(element.dataset.collectionIndex),
    recordIndex: Number(element.dataset.recordIndex),
    field: element.dataset.field,
  };
}

function parseDocumentEditorValue(text, type) {
  if (type === "object") {
    return JSON.parse(text);
  }
  if (type === "number") {
    const number = Number(text.trim());
    if (!Number.isFinite(number)) throw new Error("请输入有效数字");
    return number;
  }
  if (type === "boolean") {
    const normalized = text.trim().toLowerCase();
    if (normalized !== "true" && normalized !== "false") throw new Error("布尔值只能填写 true 或 false");
    return normalized === "true";
  }
  if (type === "null") {
    const normalized = text.trim();
    if (!normalized) return null;
    try {
      return JSON.parse(normalized);
    } catch (_) {
      return text;
    }
  }
  return text;
}

function renderDocumentHeader(field, model) {
  const label = fieldLabel(field, model);
  return `
    <th title="${escapeAttr(label)}">
      <span class="document-field-label">${escapeHtml(compactLabel(label))}</span>
      <small>${escapeHtml(field)}</small>
    </th>
  `;
}

function renderDocumentValue(value) {
  if (value === null || value === undefined || value === "") {
    return `<span class="muted">-</span>`;
  }
  if (typeof value === "object") {
    return `<code class="json-cell">${escapeHtml(JSON.stringify(value))}</code>`;
  }
  return escapeHtml(String(value));
}

function renderDocumentEmpty(text) {
  return `
    <div class="empty-state compact-empty">
      <div class="empty-text">${escapeHtml(text)}</div>
    </div>
  `;
}

function clearDynamicTabs() {
  document.querySelectorAll("[data-dynamic-tab='true']").forEach((tab) => tab.remove());
  els.sheetPages.innerHTML = "";
  state.sheetByTabId.clear();
  state.sheetFilters.clear();
}

function renderOverview() {
  if (!state.result) return;

  els.overviewEmpty.classList.add("hidden");
  els.overviewContent.classList.remove("hidden");
  els.focusFailedButton.disabled = false;
  const fileName = state.result.fileName || "未命名文件";
  const sourceText = validateTestCaseSourceText();
  els.overviewSubtitle.textContent = sourceText
    ? `${sourceText} · ${fileName}`
    : `${fileName} · companyId=${displayValue(state.result.companyId)}`;

  const sheets = state.sheetEntries;
  const issueSheets = sheets.filter(([, sheet]) => hasSheetIssue(sheet)).length;
  els.summaryMetrics.innerHTML = [
    metricCard("总读取行", state.result.totalRowCount, `有效行 ${numberText(totalValidRows(sheets))} · ${sheets.length} 个 sheet`),
    metricCard("差异字段", state.result.totalMismatchCount, issueSheets ? `${issueSheets} 个 sheet 存在异常` : "全部通过"),
    metricCard("未匹配/空单号行", state.result.totalMissingActualRowCount, "未找到目标对象或平台订单号为空"),
    metricCard("完全匹配行", totalMatchedRows(sheets), `字段差异行 ${numberText(totalFieldMismatchRows(sheets))}`),
  ].join("");

  const visibleSheets = state.onlyIssueSheets ? sheets.filter(([, sheet]) => hasSheetIssue(sheet)) : sheets;
  const tbody = els.sheetSummaryTable.querySelector("tbody");
  tbody.innerHTML = visibleSheets.map(([name, sheet], index) => {
    const tabId = tabIdForSheetName(name);
    const status = sheetStatus(sheet);
    return `
      <tr>
        <td>
          <button class="sheet-link" type="button" data-switch-tab="${escapeAttr(tabId)}">${escapeHtml(name)}</button>
        </td>
        <td class="number-cell">${numberText(sheet.rowCount)}</td>
        <td class="number-cell">${numberText(sheet.excelDataRowCount)}</td>
        <td class="number-cell">${numberText(sheet.actualRowCount)}</td>
        <td class="number-cell">${numberText(sheet.matchedRowCount)}</td>
        <td class="number-cell">${numberText(fieldMismatchRowCount(sheet))}</td>
        <td class="number-cell">${numberText(sheet.missingActualRowCount)}</td>
        <td class="number-cell">${numberText(sheet.mismatchCount)}</td>
        <td><span class="status-chip ${status.tone}">${escapeHtml(status.label)}</span></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="9" class="muted">没有符合条件的 sheet。</td></tr>`;

  renderTopIssues();
}

function renderTopIssues() {
  const sheetIssues = state.sheetEntries
    .filter(([, sheet]) => hasSheetIssue(sheet))
    .sort((a, b) => sheetIssueScore(b[1]) - sheetIssueScore(a[1]))
    .slice(0, 8);

  const fieldIssues = [];
  state.sheetEntries.forEach(([sheetName, sheet]) => {
    (sheet.rowResults || []).forEach((row) => {
      (row.unmatchFieldResults || []).forEach((field) => {
        if (fieldIssues.length < 8) {
          fieldIssues.push({ sheetName, row, field });
        }
      });
    });
  });

  els.topIssuePanel.innerHTML = `
    <h2>异常定位</h2>
    <ul class="issue-list">
      ${sheetIssues.map(([name, sheet]) => `
        <li>
          <button class="sheet-link" type="button" data-switch-tab="${escapeAttr(tabIdForSheetName(name))}">${escapeHtml(name)}</button>
          <div class="muted">差异 ${numberText(sheet.mismatchCount)}，未匹配 ${numberText(sheet.missingActualRowCount)}</div>
        </li>
      `).join("") || `<li>未发现 sheet 级异常。</li>`}
    </ul>
    <h2 class="issue-gap">字段差异</h2>
    <ul class="issue-list">
      ${fieldIssues.map(({ sheetName, row, field }) => `
        <li>
          <button class="sheet-link" type="button" data-switch-tab="${escapeAttr(tabIdForSheetName(sheetName))}">${escapeHtml(sheetName)}</button>
          <div>第 ${numberText(row.rowNumber)} 行 · ${escapeHtml(field.header || field.field || "")}</div>
          <div class="muted">${escapeHtml(field.message || "字段值不一致")}</div>
        </li>
      `).join("") || `<li>未发现字段差异。</li>`}
    </ul>
  `;
}

function renderSheetTabsAndPages() {
  state.sheetEntries.forEach(([sheetName, sheet], index) => {
    const tabId = `sheet-${index}`;
    state.sheetByTabId.set(tabId, { sheetName, sheet });
    ensureSheetFilter(tabId);

    const tab = document.createElement("button");
    tab.className = `tab${hasSheetIssue(sheet) ? " has-error" : ""}`;
    tab.type = "button";
    tab.dataset.tab = tabId;
    tab.dataset.module = "validate";
    tab.dataset.dynamicTab = "true";
    tab.title = sheetName;
    tab.textContent = sheetName;
    els.tabs.appendChild(tab);

    renderSheetPage(tabId, sheetName, sheet);
  });
}

function renderSheetPage(tabId, sheetName, sheet) {
  const page = document.createElement("section");
  page.className = "page";
  page.id = `page-${tabId}`;
  page.dataset.page = tabId;

  const status = sheetStatus(sheet);
  const targetOptions = collectTargets(sheet);
  page.innerHTML = `
    <div class="sheet-head">
      <div>
        <h1>${escapeHtml(sheetName)}</h1>
        <div class="sheet-meta">
          <span class="status-chip ${status.tone}">${escapeHtml(status.label)}</span>
          ${state.validateSource === "test-case" && state.validateTestCase?.id
            ? renderPill(`测试用例 #${state.validateTestCase.id} · ${state.validateTestCase.validationType === "replay" ? "回放结果" : "用例校验结果"}`, "red")
            : ""}
          <span class="target-chip">表头行 ${numberText(sheet.headerRow)}</span>
          <span class="target-chip">数据起始行 ${numberText(sheet.dataStartRow)}</span>
          ${renderTargetChips(sheet)}
        </div>
      </div>
      <div class="toolbar">
        <button class="secondary-button" type="button" data-switch-tab="overview">返回概况</button>
      </div>
    </div>

    <div class="metric-grid">
      ${metricCard(validationDataSourceText("有效行"), sheet.excelDataRowCount ?? sheet.rowCount, `读取行 ${numberText(sheet.rowCount)}`)}
      ${metricCard("数据库行", sheet.actualRowCount, "主目标表记录数")}
      ${metricCard("匹配行", sheet.matchedRowCount, rowPassRate(sheet))}
      ${metricCard("异常", sheetIssueScore(sheet), `差异 ${numberText(sheet.mismatchCount)} · 未匹配 ${numberText(sheet.missingActualRowCount)}`)}
    </div>

    ${renderHeaderSection(sheet)}

    <div class="sheet-toolbar">
      <div class="sheet-toolbar-main">
        <button class="small-button active" type="button" data-filter-mode="issue" data-tab-id="${escapeAttr(tabId)}">异常行</button>
        <button class="small-button" type="button" data-filter-mode="all" data-tab-id="${escapeAttr(tabId)}">全部行</button>
        <button class="small-button" type="button" data-filter-mode="missing" data-tab-id="${escapeAttr(tabId)}">未匹配</button>
        <button class="small-button" type="button" data-filter-mode="matched" data-tab-id="${escapeAttr(tabId)}">已匹配</button>
      </div>
      <div class="sheet-toolbar-extra">
        <input type="search" placeholder="搜索行号、订单号、字段和值" data-row-search data-tab-id="${escapeAttr(tabId)}" />
        <select data-target-select data-tab-id="${escapeAttr(tabId)}">
          <option value="all">全部目标对象</option>
          ${targetOptions.map((target) => `<option value="${escapeAttr(target)}">${escapeHtml(target)}</option>`).join("")}
        </select>
      </div>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>行</th>
            <th>数据序号</th>
            <th>平台订单号</th>
            <th>状态</th>
            <th>未匹配目标</th>
            <th>差异字段</th>
            <th>匹配字段</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="sheet-body-${escapeAttr(tabId)}"></tbody>
      </table>
    </div>
  `;
  els.sheetPages.appendChild(page);
  renderSheetRows(tabId);
}

function renderSheetRows(tabId) {
  const holder = state.sheetByTabId.get(tabId);
  if (!holder) return;
  const { sheet } = holder;
  const filter = ensureSheetFilter(tabId);
  const rows = (sheet.rowResults || [])
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => rowMatchesFilter(row, filter));

  document.querySelectorAll(`[data-filter-mode][data-tab-id="${cssAttr(tabId)}"]`).forEach((button) => {
    button.classList.toggle("active", button.dataset.filterMode === filter.mode);
  });

  const tbody = document.getElementById(`sheet-body-${tabId}`);
  if (!tbody) return;
  tbody.innerHTML = rows.map(({ row, index }) => renderRow(tabId, row, index, filter)).join("")
    || `<tr><td colspan="8" class="muted">没有符合条件的行。</td></tr>`;
}

function renderRow(tabId, row, index, filter) {
  const status = rowStatus(row);
  const missingTargets = row.missingTargetNames || [];
  const unmatchedCount = (row.unmatchFieldResults || []).length;
  const matchedCount = (row.matchedFieldResults || []).length;
  const expanded = state.expandedRows.has(rowKey(tabId, index));
  return `
    <tr class="clickable" data-action="toggle-row" data-tab-id="${escapeAttr(tabId)}" data-row-index="${index}">
      <td class="number-cell">${numberText(row.rowNumber)}</td>
      <td class="number-cell">${numberText(row.dataRowIndex)}</td>
      <td class="mono-cell">${escapeHtml(displayValue(row.platformOrderNo))}</td>
      <td><span class="status-chip ${status.tone}">${escapeHtml(status.label)}</span></td>
      <td>${missingTargets.length ? renderPills(missingTargets, "red") : `<span class="muted">无</span>`}</td>
      <td class="number-cell">${renderFieldCountButton(tabId, index, "diff", unmatchedCount, "差异字段")}</td>
      <td class="number-cell">${renderFieldCountButton(tabId, index, "matched", matchedCount, "匹配字段")}</td>
      <td>
        <button class="small-button" type="button" data-action="toggle-row" data-tab-id="${escapeAttr(tabId)}" data-row-index="${index}">
          ${expanded ? "收起" : "展开"}
        </button>
      </td>
    </tr>
    <tr class="row-detail ${expanded ? "" : "hidden"}">
      <td colspan="8">${renderRowDetail(tabId, row, index)}</td>
    </tr>
  `;
}

function renderRowDetail(tabId, row, index) {
  const missingTargets = row.missingTargetNames || [];
  const unmatched = row.unmatchFieldResults || [];
  const matched = row.matchedFieldResults || [];
  const mode = state.rowFieldModes.get(rowKey(tabId, index)) || "diff";
  const fields = fieldResultsByMode(mode, unmatched, matched);
  return `
    <div class="detail-box">
      <div class="detail-title-row">
        <div>
          <div class="detail-title">第 ${numberText(row.rowNumber)} 行字段比对</div>
          <div class="detail-subtitle">${fieldModeTitle(mode)}</div>
        </div>
        <div class="field-mode-row">
          ${renderPill(`平台订单号 ${displayValue(row.platformOrderNo)}`)}
          ${renderFieldModeButton(tabId, index, "diff", `差异 ${unmatched.length}`, unmatched.length ? "red" : "green", mode)}
          ${renderFieldModeButton(tabId, index, "matched", `匹配 ${matched.length}`, "green", mode)}
          ${renderFieldModeButton(tabId, index, "all", `全部 ${unmatched.length + matched.length}`, "", mode)}
        </div>
      </div>
      ${missingTargets.length ? `
        <div class="missing-target-block">
          <h2>未匹配目标对象</h2>
          ${renderPills(missingTargets, "red")}
        </div>
      ` : ""}
      <div class="table-wrap">
        <table class="field-table">
          <thead>
            <tr>
              <th>目标对象</th>
              <th>${validationDataSourceText("表头")}</th>
              <th>Java 字段</th>
              <th>${validationDataSourceText("值")}</th>
              <th>数据库值</th>
              <th>说明</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            ${fields.map((field) => renderFieldRow(field)).join("") || `
              <tr><td colspan="7" class="muted">${emptyFieldMessage(mode)}</td></tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderFieldCountButton(tabId, rowIndex, mode, count, label) {
  return `
    <button class="field-count-button ${mode === "diff" ? "red" : "green"}" type="button"
      title="查看${escapeAttr(label)}"
      data-field-mode="${escapeAttr(mode)}"
      data-tab-id="${escapeAttr(tabId)}"
      data-row-index="${rowIndex}">
      ${numberText(count)}
    </button>
  `;
}

function renderFieldModeButton(tabId, rowIndex, mode, text, tone, currentMode) {
  return `
    <button class="field-mode-button ${escapeAttr(tone)} ${mode === currentMode ? "active" : ""}" type="button"
      data-field-mode="${escapeAttr(mode)}"
      data-tab-id="${escapeAttr(tabId)}"
      data-row-index="${rowIndex}">
      ${escapeHtml(text)}
    </button>
  `;
}

function fieldResultsByMode(mode, unmatched, matched) {
  if (mode === "matched") return matched;
  if (mode === "all") return [...unmatched, ...matched];
  return unmatched;
}

function fieldModeTitle(mode) {
  if (mode === "matched") return "当前展示匹配字段";
  if (mode === "all") return "当前展示全部字段";
  return "当前展示差异字段";
}

function emptyFieldMessage(mode) {
  if (mode === "matched") return "这一行没有匹配字段。";
  if (mode === "all") return "这一行没有字段比对结果。";
  return "这一行没有字段差异。点击“匹配”可查看匹配字段。";
}

function renderFieldRow(field) {
  const tone = field.matched ? "success" : "error";
  return `
    <tr>
      <td>${escapeHtml(displayValue(field.targetName))}</td>
      <td>${escapeHtml(validationFieldHeader(field))}</td>
      <td class="mono-cell">${escapeHtml(displayValue(field.field))}</td>
      <td class="value ${field.matched ? "" : "diff"}">${escapeHtml(displayValue(field.excelValue))}</td>
      <td class="value ${field.matched ? "" : "diff"}">${escapeHtml(displayValue(field.databaseValue))}</td>
      <td>${escapeHtml(displayValue(field.message || ""))}</td>
      <td><span class="status-chip ${tone}">${field.matched ? "匹配" : "不一致"}</span></td>
    </tr>
  `;
}

function validationDataSourceLabel() {
  return state.validateSource === "test-case" ? "用例" : "Excel";
}

function validationDataSourceText(suffix) {
  const source = validationDataSourceLabel();
  return `${source}${/^[A-Za-z]/.test(source) ? " " : ""}${suffix}`;
}

function validationFieldHeader(field) {
  const header = displayValue(field.header);
  if (!header) return "";

  const javaField = displayValue(field.field) || header;
  const label = conciseValidationFieldLabel(fieldLabel(javaField, displayValue(field.targetName)));
  if (!label || normalizedFieldLabel(label) === normalizedFieldLabel(javaField)) {
    return header;
  }
  return `${header} (${label})`;
}

function conciseValidationFieldLabel(label) {
  const compact = compactLabel(label);
  const punctuationIndex = compact.search(/[，,。；;：:]/);
  return punctuationIndex > 0 ? compact.slice(0, punctuationIndex).trim() : compact;
}

function normalizedFieldLabel(value) {
  return String(value || "").replace(/[^A-Za-z0-9\u4e00-\u9fff]/g, "").toLowerCase();
}

function renderHeaderSection(sheet) {
  const unmatched = sheet.unmatchedHeaders || [];
  const missing = sheet.missingExcelHeaders || [];
  if (!unmatched.length && !missing.length) {
    return `
      <div class="sheet-section">
        <h2>表头状态</h2>
        <div class="pill-row">${renderPill("映射表头完整", "green")}</div>
      </div>
    `;
  }
  return `
    <div class="sheet-section">
      <h2>表头状态</h2>
      <div class="header-groups">
        <div>
          <div class="header-group-title">Excel 中未映射表头</div>
          <ul class="header-list">
            ${unmatched.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || `<li class="muted">无</li>`}
          </ul>
        </div>
        <div>
          <div class="header-group-title">映射配置缺失表头</div>
          <ul class="header-list">
            ${missing.map((item) => `<li>${escapeHtml(item)}</li>`).join("") || `<li class="muted">无</li>`}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function metricCard(label, value, sub, className = "") {
  return `
    <div class="metric-card ${escapeAttr(className)}">
      <div class="metric-label">${escapeHtml(label)}</div>
      <div class="metric-value">${numberText(value)}</div>
      <div class="metric-sub">${escapeHtml(sub || "")}</div>
    </div>
  `;
}

function renderTargetChips(sheet) {
  const entries = Object.entries(sheet.actualTargetRowCountMap || {});
  if (!entries.length) return "";
  return entries
    .map(([name, count]) => `<span class="target-chip">${escapeHtml(name)} ${numberText(count)}</span>`)
    .join("");
}

function renderPills(items, tone = "") {
  return `<div class="pill-row">${items.map((item) => renderPill(item, tone)).join("")}</div>`;
}

function renderPill(text, tone = "") {
  return `<span class="pill ${escapeAttr(tone)}">${escapeHtml(text)}</span>`;
}

function resolveDocumentCollections(group) {
  if (!state.documentResult) {
    return group.collections.map((collection) => ({ ...collection, records: [] }));
  }
  return group.collections.map((collection) => ({
    ...collection,
    records: normalizeRecords(valueAtPath(state.documentResult, collection.path)),
  }));
}

function valueAtPath(source, path) {
  return path.reduce((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return current[key];
  }, source);
}

function normalizeRecords(value) {
  if (Array.isArray(value)) return value.filter((item) => item && typeof item === "object");
  if (value && typeof value === "object") return [value];
  return [];
}

function collectionTotal(collections) {
  return collections.reduce((sum, collection) => sum + collection.records.length, 0);
}

function totalDocumentRecordCount() {
  return DOCUMENT_GROUPS.reduce((sum, group) => sum + collectionTotal(resolveDocumentCollections(group)), 0);
}

function collectDocumentFields(records) {
  const fields = [];
  const seen = new Set();
  records.forEach((record) => {
    Object.keys(record || {}).forEach((field) => {
      if (!seen.has(field)) {
        seen.add(field);
        fields.push(field);
      }
    });
  });
  return fields;
}

function filterDocumentRecords(records, filter, model = "") {
  const query = (filter.query || "").toLowerCase();
  if (!query) return records;
  return records.filter((record) => documentRecordSearchText(record, model).includes(query));
}

function documentRecordSearchText(record, model = "") {
  const parts = [JSON.stringify(record)];
  Object.keys(record || {}).forEach((field) => {
    parts.push(field, fieldLabel(field, model), fieldAliases(field));
  });
  return parts.join(" ").toLowerCase();
}

function fieldAliases(field) {
  const aliases = {
    platformOrderNo: "tid orderNo 平台订单号 原始线上单号",
    orderNo: "tid platformOrderNo 平台订单号",
    tid: "platformOrderNo orderNo 平台订单号 原始线上单号",
    asPlatNo: "tid platformOrderNo orderNo 平台订单号 线上单号 原始线上单号",
    oid: "子订单号 平台子订单号",
    sid: "系统订单号",
  };
  return aliases[field] || "";
}

function restoreDocumentSearchFocus(tabId) {
  const input = document.querySelector(`[data-document-search][data-tab-id="${cssAttr(tabId)}"]`);
  if (!input) return;
  input.focus();
  const end = input.value.length;
  input.setSelectionRange(end, end);
}

function ensureDocumentFilter(tabId) {
  if (!state.documentFilters.has(tabId)) {
    state.documentFilters.set(tabId, { query: "" });
  }
  return state.documentFilters.get(tabId);
}

function fieldLabel(field, model = "") {
  if (model && state.documentModelLabels[model] && state.documentModelLabels[model][field]) {
    return state.documentModelLabels[model][field];
  }
  return state.documentLabels[field] || FALLBACK_FIELD_LABELS[field] || field;
}

function compactLabel(label) {
  if (!label) return "";
  const cleaned = String(label)
    .replace(/\{@link\s+[^}]+}/g, "")
    .replace(/对应\s+[A-Za-z0-9_]+DO/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length <= 22) return cleaned;
  const punctuationIndex = cleaned.search(/[，,。；;：:]/);
  if (punctuationIndex > 3 && punctuationIndex <= 22) {
    return cleaned.slice(0, punctuationIndex);
  }
  return `${cleaned.slice(0, 22)}...`;
}

function ensureSheetFilter(tabId) {
  if (!state.sheetFilters.has(tabId)) {
    state.sheetFilters.set(tabId, {
      mode: "issue",
      query: "",
      target: "all",
    });
  }
  return state.sheetFilters.get(tabId);
}

function rowMatchesFilter(row, filter) {
  const missingCount = (row.missingTargetNames || []).length;
  const unmatchedCount = (row.unmatchFieldResults || []).length;
  const isIssue = !row.matched || missingCount > 0 || unmatchedCount > 0;

  if (filter.mode === "issue" && !isIssue) return false;
  if (filter.mode === "missing" && missingCount === 0) return false;
  if (filter.mode === "matched" && isIssue) return false;

  if (filter.target && filter.target !== "all") {
    const targetText = JSON.stringify([
      row.missingTargetNames || [],
      (row.matchedFieldResults || []).map((item) => item.targetName),
      (row.unmatchFieldResults || []).map((item) => item.targetName),
    ]);
    if (!targetText.includes(filter.target)) return false;
  }

  if (filter.query) {
    const query = filter.query.toLowerCase();
    const text = JSON.stringify(row).toLowerCase();
    if (!text.includes(query)) return false;
  }
  return true;
}

function collectTargets(sheet) {
  const targets = new Set(Object.keys(sheet.actualTargetRowCountMap || {}));
  (sheet.rowResults || []).forEach((row) => {
    (row.missingTargetNames || []).forEach((target) => targets.add(target));
    (row.matchedFieldResults || []).forEach((field) => field.targetName && targets.add(field.targetName));
    (row.unmatchFieldResults || []).forEach((field) => field.targetName && targets.add(field.targetName));
  });
  return [...targets].sort();
}

function rowStatus(row) {
  if ((row.missingTargetNames || []).length > 0) {
    return { label: "未匹配", tone: "error" };
  }
  if ((row.unmatchFieldResults || []).length > 0 || !row.matched) {
    return { label: "有差异", tone: "warning" };
  }
  return { label: "匹配", tone: "success" };
}

function sheetStatus(sheet) {
  if (sheet.missingSheet) {
    return { label: "缺少 Sheet", tone: "error" };
  }
  if ((sheet.missingActualRowCount || 0) > 0) {
    return { label: "未匹配", tone: "error" };
  }
  if ((sheet.mismatchCount || 0) > 0 || (sheet.missingExcelHeaders || []).length > 0) {
    return { label: "有差异", tone: "warning" };
  }
  if ((sheet.unmatchedHeaders || []).length > 0) {
    return { label: "有未映射表头", tone: "warning" };
  }
  return { label: "通过", tone: "success" };
}

function hasSheetIssue(sheet) {
  return Boolean(
    sheet.missingSheet
    || (sheet.mismatchCount || 0) > 0
    || (sheet.missingActualRowCount || 0) > 0
    || (sheet.unmatchedHeaders || []).length > 0
    || (sheet.missingExcelHeaders || []).length > 0
  );
}

function sheetIssueScore(sheet) {
  return (sheet.mismatchCount || 0)
    + (sheet.missingActualRowCount || 0)
    + (sheet.missingSheet ? 1 : 0)
    + (sheet.missingExcelHeaders || []).length
    + (sheet.unmatchedHeaders || []).length;
}

function rowPassRate(sheet) {
  const total = Number(sheet.excelDataRowCount ?? sheet.rowCount ?? 0);
  if (!total) return "无有效数据";
  const matched = Number(sheet.matchedRowCount || 0);
  return `${Math.round((matched / total) * 100)}% 行通过`;
}

function totalMatchedRows(sheets) {
  return sheets.reduce((sum, [, sheet]) => sum + Number(sheet.matchedRowCount || 0), 0);
}

function totalValidRows(sheets) {
  return sheets.reduce((sum, [, sheet]) => sum + Number(sheet.excelDataRowCount ?? sheet.rowCount ?? 0), 0);
}

function totalFieldMismatchRows(sheets) {
  return sheets.reduce((sum, [, sheet]) => sum + fieldMismatchRowCount(sheet), 0);
}

function fieldMismatchRowCount(sheet) {
  return (sheet.rowResults || []).filter((row) => (row.unmatchFieldResults || []).length > 0).length;
}

function tabIdForSheetName(name) {
  const index = state.sheetEntries.findIndex(([sheetName]) => sheetName === name);
  return index >= 0 ? `sheet-${index}` : "overview";
}

function rowKey(tabId, rowIndex) {
  return `${tabId}:${rowIndex}`;
}

function switchModule(module) {
  if (!["validate", "documents", "company-config", "test-cases"].includes(module)) return;
  state.activeModule = module;
  document.body.dataset.module = module;
  setCompanyForActiveModule(defaultCompanyForModule(module));

  document.querySelectorAll("[data-module-switch]").forEach((button) => {
    button.classList.toggle("active", button.dataset.moduleSwitch === module);
  });
  document.querySelectorAll("[data-module-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.modulePanel !== module);
  });

  els.configTitle.textContent = "系统配置";
  els.configSubtitle.textContent = module === "documents"
    ? "选择环境和公司，输入平台订单号查询单据。"
    : "选择环境和公司，上传预期结果 Excel。";

  document.querySelector(".brand-mark").textContent = module === "documents" ? "单" : module === "company-config" ? "核" : module === "test-cases" ? "例" : "验";
  document.querySelector(".brand-title").textContent = module === "documents"
    ? "导入运行结果单据查看"
    : module === "company-config"
      ? "核销配置"
      : module === "test-cases"
        ? "导入测试用例"
      : "导入运行结果校验";
  if (module === "documents") {
    updateDocumentSourceUi();
  }
  if (module === "validate") {
    updateValidateSourceUi();
    updateValidationModeUi();
  }
  updateEnvSummary();
  renderModuleTabs();

  const nextTab = module === "company-config"
    ? "company-config"
    : tabAvailableForModule(state.lastTabs[module], module) ? state.lastTabs[module] : module === "test-cases" ? "test-cases" : "config";
  switchTab(nextTab);
  syncDownloadButton();
  if (module === "company-config") {
    loadCompanyConfig();
  }
  if (module === "test-cases" && !state.testCasesLoaded) {
    loadTestCases();
  }
}

function renderModuleTabs() {
  document.querySelectorAll("#tabs [data-module]").forEach((tab) => {
    tab.classList.toggle("hidden", tab.dataset.module !== state.activeModule);
  });
}

function tabAvailableForModule(tabId, module) {
  return Boolean([...document.querySelectorAll(`#tabs [data-tab="${cssAttr(tabId)}"]`)]
    .find((tab) => tab.dataset.module === module));
}

function switchTab(tabId) {
  state.activeTab = tabId;
  state.lastTabs[state.activeModule] = tabId;
  document.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId && (!tab.dataset.module || tab.dataset.module === state.activeModule));
  });
  document.querySelectorAll("[data-page]").forEach((page) => {
    page.classList.toggle("active", page.dataset.page === tabId);
  });
}

function updateFileName() {
  const file = els.fileInput.files[0];
  els.fileNameText.textContent = file ? file.name : "选择 Excel 文件";
}

function setRequestState(type, text) {
  els.requestState.className = `request-chip ${type || ""}`;
  els.requestState.textContent = text;
}

function setInlineStatus(element, text, type = "") {
  element.textContent = text || "";
  element.style.color = type === "error" ? "var(--red)" : type === "success" ? "var(--green)" : "";
}

function syncDownloadButton() {
  const raw = state.activeModule === "documents"
    ? state.documentRawResponse
    : state.activeModule === "test-cases"
      ? state.testCaseRawResponse
      : state.activeModule === "validate"
        ? state.rawResponse
        : null;
  els.downloadJsonButton.disabled = !raw;
}

function downloadRawJson() {
  const raw = state.activeModule === "documents"
    ? state.documentRawResponse
    : state.activeModule === "test-cases"
      ? state.testCaseRawResponse
      : state.rawResponse;
  if (!raw) return;
  const blob = new Blob([JSON.stringify(raw, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = url;
  const prefix = state.activeModule === "documents" ? "document-result" : state.activeModule === "test-cases" ? "test-case-result" : "validate-result";
  link.download = `${prefix}-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2800);
}

function numberText(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string") {
    const text = value.trim();
    if (/^-?\d{12,}$/.test(text)) return text;
  }
  const number = Number(value);
  if (Number.isFinite(number) && String(value).trim() !== "") {
    return number.toLocaleString("zh-CN");
  }
  return String(value);
}

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string" && value.trim().toLowerCase() === "null") return "";
  return String(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function cssAttr(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
