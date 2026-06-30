const state = {
  config: { environment: "local", cookie: "" },
  environments: {},
  validatePath: "/cloudaccount/importTestData/validateExcel",
  result: null,
  rawResponse: null,
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
  configForm: document.getElementById("configForm"),
  uploadForm: document.getElementById("uploadForm"),
  jsonImportForm: document.getElementById("jsonImportForm"),
  cookieInput: document.getElementById("cookieInput"),
  jsonInput: document.getElementById("jsonInput"),
  baseUrlText: document.getElementById("baseUrlText"),
  envSummary: document.getElementById("envSummary"),
  saveConfigStatus: document.getElementById("saveConfigStatus"),
  uploadStatus: document.getElementById("uploadStatus"),
  jsonImportStatus: document.getElementById("jsonImportStatus"),
  fileInput: document.getElementById("fileInput"),
  fileNameText: document.getElementById("fileNameText"),
  dropZone: document.getElementById("dropZone"),
  validateButton: document.getElementById("validateButton"),
  requestState: document.getElementById("requestState"),
  overviewEmpty: document.getElementById("overviewEmpty"),
  overviewContent: document.getElementById("overviewContent"),
  overviewSubtitle: document.getElementById("overviewSubtitle"),
  summaryMetrics: document.getElementById("summaryMetrics"),
  sheetSummaryTable: document.getElementById("sheetSummaryTable"),
  topIssuePanel: document.getElementById("topIssuePanel"),
  focusFailedButton: document.getElementById("focusFailedButton"),
  downloadJsonButton: document.getElementById("downloadJsonButton"),
  toast: document.getElementById("toast"),
};

window.__validateViewer = {
  renderResponse(response) {
    const unwrapped = acceptValidateResponse(response);
    switchTab("overview");
    els.downloadJsonButton.disabled = false;
    return {
      sheetCount: state.sheetEntries.length,
      totalRowCount: state.result?.totalRowCount,
      totalMismatchCount: state.result?.totalMismatchCount,
      error: unwrapped.error,
    };
  },
  inspect() {
    return {
      activeTab: state.activeTab,
      sheetCount: state.sheetEntries.length,
      hasResult: Boolean(state.result),
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

init();

async function init() {
  bindEvents();
  await loadConfig();
  switchTab("config");
}

function bindEvents() {
  els.tabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (!tab) return;
    switchTab(tab.dataset.tab);
  });

  els.configForm.addEventListener("change", (event) => {
    if (event.target.name === "environment") {
      setEnvironment(event.target.value);
    }
  });

  els.configForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveConfig();
  });

  els.uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await validateExcel();
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
    if (!search) return;
    const tabId = search.dataset.tabId;
    const filter = ensureSheetFilter(tabId);
    filter.query = search.value.trim();
    renderSheetRows(tabId);
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
    state.validatePath = payload.validatePath || state.validatePath;
    applyConfig(payload.config || {});
  } catch (error) {
    showToast(`配置读取失败：${error.message}`);
  }
}

function applyConfig(config) {
  state.config = { ...state.config, ...config };
  els.cookieInput.value = state.config.cookie || "";
  setEnvironment(state.config.environment || "local");
}

function setEnvironment(value) {
  state.config.environment = value;
  document.querySelectorAll("input[name='environment']").forEach((input) => {
    input.checked = input.value === value;
    input.closest(".segment").classList.toggle("active", input.checked);
  });

  const env = state.environments[value] || {};
  const baseUrl = env.baseUrl || "";
  els.baseUrlText.textContent = baseUrl;
  els.envSummary.textContent = `${env.label || value} · ${baseUrl}${state.validatePath.replace(/^\//, "")}`;
}

function getSelectedEnvironment() {
  const selected = document.querySelector("input[name='environment']:checked");
  return selected ? selected.value : "local";
}

async function saveConfig() {
  setInlineStatus(els.saveConfigStatus, "保存中...");
  try {
    const response = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        environment: getSelectedEnvironment(),
        cookie: els.cookieInput.value,
      }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || "保存失败");
    }
    applyConfig(payload.config);
    setInlineStatus(els.saveConfigStatus, "已保存", "success");
    showToast("配置已保存");
  } catch (error) {
    setInlineStatus(els.saveConfigStatus, error.message, "error");
    showToast(`保存失败：${error.message}`);
  }
}

async function validateExcel() {
  const file = els.fileInput.files[0];
  if (!file) {
    showToast("请选择 Excel 文件");
    return;
  }

  setRequestState("running", "校验中");
  els.validateButton.disabled = true;
  setInlineStatus(els.uploadStatus, "正在上传并校验...");

  const formData = new FormData();
  formData.append("environment", getSelectedEnvironment());
  formData.append("cookie", els.cookieInput.value);
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
    setRequestState("error", "校验失败");
    setInlineStatus(els.uploadStatus, error.message, "error");
    showToast(`校验失败：${error.message}`);
  } finally {
    els.validateButton.disabled = false;
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

function renderAllResults() {
  clearDynamicTabs();
  renderOverview();
  renderSheetTabsAndPages();
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
  els.overviewSubtitle.textContent = `${fileName} · companyId=${displayValue(state.result.companyId)}`;

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
      ${metricCard("Excel 有效行", sheet.excelDataRowCount ?? sheet.rowCount, `读取行 ${numberText(sheet.rowCount)}`)}
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
              <th>Excel 表头</th>
              <th>Java 字段</th>
              <th>Excel 值</th>
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
      <td>${escapeHtml(displayValue(field.header))}</td>
      <td class="mono-cell">${escapeHtml(displayValue(field.field))}</td>
      <td class="value ${field.matched ? "" : "diff"}">${escapeHtml(displayValue(field.excelValue))}</td>
      <td class="value ${field.matched ? "" : "diff"}">${escapeHtml(displayValue(field.databaseValue))}</td>
      <td>${escapeHtml(displayValue(field.message || ""))}</td>
      <td><span class="status-chip ${tone}">${field.matched ? "匹配" : "不一致"}</span></td>
    </tr>
  `;
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

function metricCard(label, value, sub) {
  return `
    <div class="metric-card">
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

function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
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

function downloadRawJson() {
  if (!state.rawResponse) return;
  const blob = new Blob([JSON.stringify(state.rawResponse, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = url;
  link.download = `validate-result-${stamp}.json`;
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
