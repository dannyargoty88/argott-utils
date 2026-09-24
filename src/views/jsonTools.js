/**
 * JSON Tools View - Argott Utils
 * Permite Formatear, Minificar, Validar y Comparar archivos/estructuras JSON.
 * Desarrollado puramente con Vanilla HTML5, CSS3 y JavaScript ES6+.
 */

function renderJsonToolsView(container) {
  container.innerHTML = `
    <div class="json-tools-container">
      
      <!-- Encabezado de la Vista -->
      <div class="panel-box">
        <div class="panel-header" style="justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="panel-title" style="font-size: 1.25rem;">
              <i class="ph ph-brackets-curly" style="color: var(--accent-primary);"></i> JSON Tools
            </h2>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Herramienta integral para validar, formatear, minificar y comparar estructuras JSON.
            </p>
          </div>

          <!-- Pestañas Principales (Formateador vs Comparador) -->
          <div class="segmented-control">
            <button id="tab-json-editor" class="segment-btn active" data-tab="editor">
              <i class="ph ph-code-block"></i> Formatear & Validar
            </button>
            <button id="tab-json-compare" class="segment-btn" data-tab="compare">
              <i class="ph ph-arrows-left-right"></i> Comparar JSONs
            </button>
          </div>
        </div>
      </div>

      <!-- ==========================================================================
           SECCIÓN 1: FORMATEADOR / MINIFICADOR / VALIDADOR
           ========================================================================== -->
      <div id="section-json-editor" class="json-tab-content active">
        
        <!-- Toolbar de Acciones -->
        <div class="panel-box json-toolbar-box">
          <div class="json-toolbar">
            
            <div class="json-actions-left">
              <button id="btn-json-format" class="btn-primary" style="width: auto; padding: 0.45rem 1rem;">
                <i class="ph ph-magic-wand"></i> Formatear JSON
              </button>
              
              <button id="btn-json-minify" class="btn-secondary" style="width: auto; padding: 0.45rem 0.9rem;">
                <i class="ph ph-arrows-in-line-horizontal"></i> Minificar
              </button>

              <button id="btn-json-validate" class="btn-secondary" style="width: auto; padding: 0.45rem 0.9rem;">
                <i class="ph ph-check-circle"></i> Validar
              </button>

              <div class="json-indent-selector">
                <span class="diff-option-label">Sangría:</span>
                <select id="select-indent" class="form-control" style="width: 100px; padding: 0.35rem 0.5rem; font-size: 0.78rem;">
                  <option value="2">2 espacios</option>
                  <option value="4" selected>4 espacios</option>
                  <option value="tab">Tabulación</option>
                </select>
              </div>
            </div>

            <div class="json-actions-right">
              <label class="btn-file-upload" title="Cargar archivo .json">
                <i class="ph ph-upload-simple"></i> Cargar JSON
                <input type="file" id="file-input-json" accept=".json,.txt" hidden>
              </label>

              <button id="btn-json-copy" class="btn-secondary" style="width: auto; padding: 0.45rem 0.8rem;" title="Copiar resultado">
                <i class="ph ph-copy"></i> Copiar
              </button>

              <button id="btn-json-download" class="btn-secondary" style="width: auto; padding: 0.45rem 0.8rem;" title="Descargar archivo JSON">
                <i class="ph ph-download-simple"></i> Descargar
              </button>

              <button id="btn-json-clear" class="btn-icon-action" title="Limpiar todo">
                <i class="ph ph-trash"></i>
              </button>
            </div>

          </div>
        </div>

        <!-- Banner de Notificación de Validación / Estado -->
        <div id="json-status-banner" class="json-status-banner" style="display: none;"></div>

        <!-- Grid de Editor / Resultado -->
        <div class="json-editor-grid">
          
          <!-- Entrada de JSON -->
          <div class="panel-box json-box">
            <div class="json-box-header">
              <span class="json-box-title"><i class="ph ph-file-code"></i> Entrada JSON</span>
              <span id="json-input-stats" class="json-stats-pill">0 caracteres</span>
            </div>
            <textarea id="json-textarea-input" class="diff-textarea json-textarea" placeholder='Pega tu código JSON aquí...\n\nEjemplo:\n{\n  "nombre": "Argott",\n  "version": 2.0,\n  "activo": true\n}' spellcheck="false"></textarea>
          </div>

          <!-- Salida de JSON Formateado / Vista Arbolada -->
          <div class="panel-box json-box">
            <div class="json-box-header">
              <span class="json-box-title"><i class="ph ph-brackets-curly"></i> Resultado Formateado</span>
              <div class="segmented-control" style="font-size: 0.72rem;">
                <button id="btn-view-code" class="segment-btn active" style="padding: 0.2rem 0.5rem;">Código</button>
                <button id="btn-view-tree" class="segment-btn" style="padding: 0.2rem 0.5rem;">Árbol Visual</button>
              </div>
            </div>
            
            <div id="json-output-code-container">
              <textarea id="json-textarea-output" class="diff-textarea json-textarea" readonly placeholder="El resultado formateado o minificado aparecerá aquí..." spellcheck="false"></textarea>
            </div>

            <div id="json-output-tree-container" class="json-tree-wrapper" style="display: none;">
              <div class="empty-state">
                <i class="ph ph-tree-structure"></i>
                <p>Formatea un JSON válido para explorar su árbol interactivo.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- ==========================================================================
           SECCIÓN 2: COMPARADOR DE DOS JSONs
           ========================================================================== -->
      <div id="section-json-compare" class="json-tab-content">
        
        <div class="panel-box json-toolbar-box">
          <div class="json-toolbar">
            <div class="json-actions-left">
              <button id="btn-compare-json-run" class="btn-primary" style="width: auto; padding: 0.45rem 1.2rem;">
                <i class="ph ph-lightning"></i> Comparar Claves & Valores JSON
              </button>
              <button id="btn-compare-swap" class="btn-secondary" style="width: auto; padding: 0.45rem 0.9rem;">
                <i class="ph ph-arrows-down-up"></i> Intercambiar
              </button>
            </div>
            
            <div class="diff-stats-bar" id="json-diff-stats">
              <span class="diff-stat-item stat-add"><i class="ph ph-plus"></i> <strong id="json-stat-add">0</strong> nuevas claves</span>
              <span class="diff-stat-item stat-del"><i class="ph ph-minus"></i> <strong id="json-stat-del">0</strong> eliminadas</span>
              <span class="diff-stat-item stat-same"><i class="ph ph-equals"></i> <strong id="json-stat-mod">0</strong> modificadas</span>
            </div>
          </div>
        </div>

        <div class="diff-inputs-grid">
          <!-- JSON A -->
          <div class="panel-box diff-input-box">
            <div class="diff-input-header">
              <span class="diff-input-title"><i class="ph ph-file-text" style="color: var(--accent-amber);"></i> JSON Original (A)</span>
              <button id="btn-clear-json-a" class="btn-icon-action"><i class="ph ph-trash"></i></button>
            </div>
            <textarea id="json-text-a" class="diff-textarea json-textarea" placeholder="Pega el primer JSON aquí..." spellcheck="false"></textarea>
          </div>

          <!-- JSON B -->
          <div class="panel-box diff-input-box">
            <div class="diff-input-header">
              <span class="diff-input-title"><i class="ph ph-file-plus" style="color: var(--accent-emerald);"></i> JSON Modificado (B)</span>
              <button id="btn-clear-json-b" class="btn-icon-action"><i class="ph ph-trash"></i></button>
            </div>
            <textarea id="json-text-b" class="diff-textarea json-textarea" placeholder="Pega el segundo JSON a comparar aquí..." spellcheck="false"></textarea>
          </div>
        </div>

        <!-- Área de Resultados de Comparación -->
        <div class="panel-box json-output-box" style="margin-top: 1rem;">
          <div class="panel-header">
            <h3 class="panel-title" style="font-size: 1.05rem;">
              <i class="ph ph-git-pull-request"></i> Resultado de la Comparación Estructurada JSON
            </h3>
          </div>

          <div id="json-compare-render" class="diff-render-area">
            <div class="empty-state">
              <i class="ph ph-brackets-curly"></i>
              <p>Ingresa ambos JSONs arriba y haz clic en <strong>Comparar Claves & Valores JSON</strong>.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;

  // Inicializar todos los Event Listeners de JSON Tools
  setupJsonToolsEvents();
}

/* ==========================================================================
   LÓGICA Y EVENTOS DE JSON TOOLS
   ========================================================================== */

function setupJsonToolsEvents() {
  // Pestañas
  const tabEditor = document.getElementById("tab-json-editor");
  const tabCompare = document.getElementById("tab-json-compare");
  const secEditor = document.getElementById("section-json-editor");
  const secCompare = document.getElementById("section-json-compare");

  tabEditor.addEventListener("click", () => {
    tabEditor.classList.add("active");
    tabCompare.classList.remove("active");
    secEditor.classList.add("active");
    secCompare.classList.remove("active");
  });

  tabCompare.addEventListener("click", () => {
    tabCompare.classList.add("active");
    tabEditor.classList.remove("active");
    secCompare.classList.add("active");
    secEditor.classList.remove("active");
  });

  // Botones de Acción del Formateador
  const inputEl = document.getElementById("json-textarea-input");
  const outputEl = document.getElementById("json-textarea-output");
  const btnFormat = document.getElementById("btn-json-format");
  const btnMinify = document.getElementById("btn-json-minify");
  const btnValidate = document.getElementById("btn-json-validate");
  const btnCopy = document.getElementById("btn-json-copy");
  const btnDownload = document.getElementById("btn-json-download");
  const btnClear = document.getElementById("btn-json-clear");
  const fileInput = document.getElementById("file-input-json");
  const selectIndent = document.getElementById("select-indent");
  const statsPill = document.getElementById("json-input-stats");

  // Alternar vista Código vs Árbol
  const btnViewCode = document.getElementById("btn-view-code");
  const btnViewTree = document.getElementById("btn-view-tree");
  const containerCode = document.getElementById("json-output-code-container");
  const containerTree = document.getElementById("json-output-tree-container");

  btnViewCode.addEventListener("click", () => {
    btnViewCode.classList.add("active");
    btnViewTree.classList.remove("active");
    containerCode.style.display = "block";
    containerTree.style.display = "none";
  });

  btnViewTree.addEventListener("click", () => {
    btnViewTree.classList.add("active");
    btnViewCode.classList.remove("active");
    containerCode.style.display = "none";
    containerTree.style.display = "block";
    renderJsonTree();
  });

  // Contador de caracteres
  inputEl.addEventListener("input", () => {
    if (statsPill) statsPill.textContent = `${inputEl.value.length} caracteres`;
  });

  // Formatear
  btnFormat.addEventListener("click", () => {
    formatJsonInput();
  });

  // Minificar
  btnMinify.addEventListener("click", () => {
    minifyJsonInput();
  });

  // Validar
  btnValidate.addEventListener("click", () => {
    validateJsonInput(true);
  });

  // Limpiar
  btnClear.addEventListener("click", () => {
    inputEl.value = "";
    outputEl.value = "";
    if (statsPill) statsPill.textContent = "0 caracteres";
    hideStatusBanner();
    containerTree.innerHTML = `
      <div class="empty-state">
        <i class="ph ph-tree-structure"></i>
        <p>Formatea un JSON válido para explorar su árbol interactivo.</p>
      </div>
    `;
  });

  // Copiar al portapapeles
  btnCopy.addEventListener("click", () => {
    const textToCopy = outputEl.value || inputEl.value;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showStatusBanner("Copiado al portapapeles con éxito", "success");
    }).catch(() => {
      showStatusBanner("Error al copiar al portapapeles", "error");
    });
  });

  // Descargar JSON
  btnDownload.addEventListener("click", () => {
    const content = outputEl.value || inputEl.value;
    if (!content) {
      showStatusBanner("No hay contenido JSON para descargar", "error");
      return;
    }
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `argott_json_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Cargar archivo
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      inputEl.value = evt.target.result;
      if (statsPill) statsPill.textContent = `${inputEl.value.length} caracteres`;
      formatJsonInput();
    };
    reader.readAsText(file);
  });

  // Acciones de Comparación
  const btnCompareRun = document.getElementById("btn-compare-json-run");
  const btnCompareSwap = document.getElementById("btn-compare-swap");
  const btnClearJsonA = document.getElementById("btn-clear-json-a");
  const btnClearJsonB = document.getElementById("btn-clear-json-b");

  btnCompareRun.addEventListener("click", executeJsonCompare);

  btnCompareSwap.addEventListener("click", () => {
    const textA = document.getElementById("json-text-a");
    const textB = document.getElementById("json-text-b");
    const temp = textA.value;
    textA.value = textB.value;
    textB.value = temp;
    executeJsonCompare();
  });

  btnClearJsonA.addEventListener("click", () => {
    document.getElementById("json-text-a").value = "";
    executeJsonCompare();
  });

  btnClearJsonB.addEventListener("click", () => {
    document.getElementById("json-text-b").value = "";
    executeJsonCompare();
  });
}

function getSelectedIndent() {
  const select = document.getElementById("select-indent");
  const val = select ? select.value : "4";
  if (val === "tab") return "\t";
  return parseInt(val, 10) || 4;
}

function formatJsonInput() {
  const inputEl = document.getElementById("json-textarea-input");
  const outputEl = document.getElementById("json-textarea-output");
  const raw = inputEl.value.trim();

  if (!raw) {
    showStatusBanner("Por favor ingresa o pega una cadena JSON para formatear.", "error");
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    const indent = getSelectedIndent();
    const formatted = JSON.stringify(parsed, null, indent);
    outputEl.value = formatted;
    showStatusBanner("✓ JSON Válido y Formateado correctamente", "success");
    renderJsonTree();
  } catch (err) {
    outputEl.value = "";
    showStatusBanner(`✕ Error de Sintaxis JSON: ${err.message}`, "error");
  }
}

function minifyJsonInput() {
  const inputEl = document.getElementById("json-textarea-input");
  const outputEl = document.getElementById("json-textarea-output");
  const raw = inputEl.value.trim();

  if (!raw) {
    showStatusBanner("Por favor ingresa una cadena JSON para minificar.", "error");
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    const minified = JSON.stringify(parsed);
    outputEl.value = minified;
    showStatusBanner("✓ JSON Minificado con éxito (1 sola línea)", "success");
  } catch (err) {
    outputEl.value = "";
    showStatusBanner(`✕ Error al minificar: ${err.message}`, "error");
  }
}

function validateJsonInput(showBannerIfValid) {
  const inputEl = document.getElementById("json-textarea-input");
  const raw = inputEl.value.trim();

  if (!raw) {
    showStatusBanner("El campo de entrada está vacío.", "error");
    return false;
  }

  try {
    JSON.parse(raw);
    if (showBannerIfValid) {
      showStatusBanner("✓ Estructura JSON 100% Válida", "success");
    }
    return true;
  } catch (err) {
    showStatusBanner(`✕ JSON Inválido: ${err.message}`, "error");
    return false;
  }
}

function showStatusBanner(msg, type) {
  const banner = document.getElementById("json-status-banner");
  if (!banner) return;
  banner.className = `json-status-banner banner-${type}`;
  banner.innerHTML = `<i class="ph ph-${type === "success" ? "check-circle" : "warning-circle"}"></i> <span>${msg}</span>`;
  banner.style.display = "flex";
}

function hideStatusBanner() {
  const banner = document.getElementById("json-status-banner");
  if (banner) banner.style.display = "none";
}

/**
 * Renderizado de Árbol Interactivo JSON
 */
function renderJsonTree() {
  const inputEl = document.getElementById("json-textarea-input");
  const outputEl = document.getElementById("json-textarea-output");
  const treeContainer = document.getElementById("json-output-tree-container");

  if (!treeContainer) return;

  const raw = outputEl.value || inputEl.value;
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    treeContainer.innerHTML = `<div class="json-tree-root">${buildTreeNodes(parsed, "root")}</div>`;
    setupTreeCollapseEvents(treeContainer);
  } catch (e) {
    treeContainer.innerHTML = `
      <div class="empty-state">
        <i class="ph ph-warning"></i>
        <p>No se puede generar el árbol porque el JSON contiene errores de sintaxis.</p>
      </div>
    `;
  }
}

function buildTreeNodes(obj, keyName) {
  if (obj === null) {
    return `<div class="tree-node"><span class="tree-key">${escapeHTML(keyName)}:</span> <span class="tree-val val-null">null</span></div>`;
  }

  const type = typeof obj;
  if (type === "boolean") {
    return `<div class="tree-node"><span class="tree-key">${escapeHTML(keyName)}:</span> <span class="tree-val val-bool">${obj}</span></div>`;
  }
  if (type === "number") {
    return `<div class="tree-node"><span class="tree-key">${escapeHTML(keyName)}:</span> <span class="tree-val val-num">${obj}</span></div>`;
  }
  if (type === "string") {
    return `<div class="tree-node"><span class="tree-key">${escapeHTML(keyName)}:</span> <span class="tree-val val-str">"${escapeHTML(obj)}"</span></div>`;
  }

  if (Array.isArray(obj)) {
    const children = obj.map((item, idx) => buildTreeNodes(item, idx.toString())).join("");
    return `
      <div class="tree-group">
        <div class="tree-group-header">
          <i class="ph ph-caret-down tree-caret"></i>
          <span class="tree-key">${escapeHTML(keyName)}</span>
          <span class="tree-badge">Array[${obj.length}]</span>
        </div>
        <div class="tree-children">${children}</div>
      </div>
    `;
  }

  if (type === "object") {
    const keys = Object.keys(obj);
    const children = keys.map(k => buildTreeNodes(obj[k], k)).join("");
    return `
      <div class="tree-group">
        <div class="tree-group-header">
          <i class="ph ph-caret-down tree-caret"></i>
          <span class="tree-key">${escapeHTML(keyName)}</span>
          <span class="tree-badge">Object{${keys.length}}</span>
        </div>
        <div class="tree-children">${children}</div>
      </div>
    `;
  }

  return "";
}

function setupTreeCollapseEvents(container) {
  container.querySelectorAll(".tree-group-header").forEach(header => {
    header.addEventListener("click", () => {
      const group = header.closest(".tree-group");
      if (group) group.classList.toggle("collapsed");
    });
  });
}

/**
 * Comparación Estructurada de dos JSONs (Diff de Claves y Valores)
 */
function executeJsonCompare() {
  const textA = document.getElementById("json-text-a")?.value.trim() || "";
  const textB = document.getElementById("json-text-b")?.value.trim() || "";
  const renderArea = document.getElementById("json-compare-render");

  if (!renderArea) return;

  if (!textA && !textB) {
    renderArea.innerHTML = `
      <div class="empty-state">
        <i class="ph ph-brackets-curly"></i>
        <p>Ingresa ambos JSONs arriba para analizar diferencias estructurales.</p>
      </div>
    `;
    updateJsonDiffStats(0, 0, 0);
    return;
  }

  let jsonA = null;
  let jsonB = null;

  try {
    if (textA) jsonA = JSON.parse(textA);
  } catch (e) {
    renderArea.innerHTML = `<div class="empty-state" style="color: var(--accent-rose);"><i class="ph ph-warning-circle"></i> Error de sintaxis en JSON Original (A): ${e.message}</div>`;
    return;
  }

  try {
    if (textB) jsonB = JSON.parse(textB);
  } catch (e) {
    renderArea.innerHTML = `<div class="empty-state" style="color: var(--accent-rose);"><i class="ph ph-warning-circle"></i> Error de sintaxis en JSON Modificado (B): ${e.message}</div>`;
    return;
  }

  // Formatear ambos textos ordenadamente para compararlos línea por línea con el motor de diff
  const formattedA = jsonA ? JSON.stringify(jsonA, null, 2) : "";
  const formattedB = jsonB ? JSON.stringify(jsonB, null, 2) : "";

  const linesA = formattedA.split("\n");
  const linesB = formattedB.split("\n");

  const diffResult = computeMyersDiff(linesA, linesB, false);

  let added = 0, deleted = 0, same = 0;
  diffResult.forEach(item => {
    if (item.type === "add") added++;
    else if (item.type === "del") deleted++;
    else if (item.type === "same") same++;
  });

  updateJsonDiffStats(added, deleted, same);
  renderSplitView(renderArea, diffResult, true);
}

function updateJsonDiffStats(added, deleted, same) {
  const statAdd = document.getElementById("json-stat-add");
  const statDel = document.getElementById("json-stat-del");
  const statMod = document.getElementById("json-stat-mod");

  if (statAdd) statAdd.textContent = added;
  if (statDel) statDel.textContent = deleted;
  if (statMod) statMod.textContent = same;
}
