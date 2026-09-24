/**
 * Git Diff View - Comparador de Texto estilo Git
 * Permite comparar dos textos (Original vs Modificado) y muestra las diferencias
 * con soporte para vista lado a lado (Split) y unificada (Unified), resaltado sintáctico de cambios y estadísticas.
 */

function renderGitDiffView(container) {
  container.innerHTML = `
    <div class="diff-view-container">
      
      <!-- Encabezado de la Vista -->
      <div class="panel-box">
        <div class="panel-header">
          <div>
            <h2 class="panel-title" style="font-size: 1.25rem;">
              <i class="ph ph-git-diff" style="color: var(--accent-primary);"></i> Git Diff Viewer
            </h2>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Compara dos fragmentos de texto o código y visualiza adiciones, eliminaciones y cambios en formato Git.
            </p>
          </div>
        </div>
      </div>

      <!-- Área de Entrada de Textos (Original vs Modificado) -->
      <div class="diff-inputs-grid">
        <!-- Texto Original -->
        <div class="panel-box diff-input-box">
          <div class="diff-input-header">
            <span class="diff-input-title">
              <i class="ph ph-file-text" style="color: var(--accent-amber);"></i> Texto Original (Base)
            </span>
            <div class="diff-input-actions">
              <label class="btn-file-upload" title="Cargar archivo text/code">
                <i class="ph ph-upload-simple"></i> Cargar
                <input type="file" id="file-input-a" accept=".txt,.js,.json,.html,.css,.sql,.md,.py,.java" hidden>
              </label>
              <button id="btn-clear-a" class="btn-icon-action" title="Limpiar"><i class="ph ph-trash"></i></button>
            </div>
          </div>
          <textarea id="diff-text-a" class="diff-textarea" placeholder="Pega el texto original o antiguo aquí..." spellcheck="false"></textarea>
        </div>

        <!-- Texto Modificado -->
        <div class="panel-box diff-input-box">
          <div class="diff-input-header">
            <span class="diff-input-title">
              <i class="ph ph-file-plus" style="color: var(--accent-emerald);"></i> Texto Modificado (Nuevo)
            </span>
            <div class="diff-input-actions">
              <label class="btn-file-upload" title="Cargar archivo text/code">
                <i class="ph ph-upload-simple"></i> Cargar
                <input type="file" id="file-input-b" accept=".txt,.js,.json,.html,.css,.sql,.md,.py,.java" hidden>
              </label>
              <button id="btn-clear-b" class="btn-icon-action" title="Limpiar"><i class="ph ph-trash"></i></button>
            </div>
          </div>
          <textarea id="diff-text-b" class="diff-textarea" placeholder="Pega el texto modificado o nuevo aquí..." spellcheck="false"></textarea>
        </div>
      </div>

      <!-- Barra de Herramientas y Opciones de Comparación -->
      <div class="panel-box diff-toolbar-box">
        <div class="diff-toolbar">
          
          <div class="diff-mode-selector">
            <span class="diff-option-label">Modo de Vista:</span>
            <div class="segmented-control">
              <button id="btn-view-split" class="segment-btn active" data-mode="split">
                <i class="ph ph-columns"></i> Lado a Lado (Split)
              </button>
              <button id="btn-view-unified" class="segment-btn" data-mode="unified">
                <i class="ph ph-rows"></i> Unificado (Unified)
              </button>
            </div>
          </div>

          <div class="diff-options-group">
            <label class="diff-checkbox-label">
              <input type="checkbox" id="chk-ignore-space">
              <span>Ignorar Espacios</span>
            </label>
            <label class="diff-checkbox-label">
              <input type="checkbox" id="chk-line-numbers" checked>
              <span>Números de Línea</span>
            </label>
          </div>

          <div class="diff-action-buttons">
            <button id="btn-swap-texts" class="btn-secondary" style="width: auto; padding: 0.5rem 0.9rem;" title="Intercambiar textos A y B">
              <i class="ph ph-arrows-down-up"></i> Intercambiar
            </button>
            <button id="btn-run-diff" class="btn-primary" style="width: auto; padding: 0.5rem 1.2rem;">
              <i class="ph ph-lightning"></i> Comparar Diferencias
            </button>
          </div>

        </div>
      </div>

      <!-- Resultados del Diff -->
      <div class="panel-box diff-output-box">
        <div class="panel-header diff-output-header">
          <h3 class="panel-title" style="font-size: 1.05rem;">
            <i class="ph ph-git-pull-request"></i> Resultado del Análisis Git Diff
          </h3>
          
          <!-- Estadísticas Rápidas (+Add, -Del, =Unchanged) -->
          <div id="diff-stats-container" class="diff-stats-bar">
            <span class="diff-stat-item stat-add"><i class="ph ph-plus"></i> <strong id="stat-add-count">0</strong> adiciones</span>
            <span class="diff-stat-item stat-del"><i class="ph ph-minus"></i> <strong id="stat-del-count">0</strong> eliminaciones</span>
            <span class="diff-stat-item stat-same"><i class="ph ph-equals"></i> <strong id="stat-same-count">0</strong> sin cambios</span>
          </div>
        </div>

        <div id="diff-render-area" class="diff-render-area">
          <div class="empty-state">
            <i class="ph ph-git-diff"></i>
            <p>Ingresa ambos textos arriba y haz clic en <strong>Comparar Diferencias</strong>.</p>
          </div>
        </div>
      </div>

    </div>
  `;

  // Inicializar eventos y comportamiento
  setupGitDiffEvents();
}

/* ==========================================================================
   ALGORITMO Y LÓGICA DE GIT DIFF
   ========================================================================== */

let currentDiffMode = "split";

function setupGitDiffEvents() {
  const btnRun = document.getElementById("btn-run-diff");
  const btnSwap = document.getElementById("btn-swap-texts");
  const btnClearA = document.getElementById("btn-clear-a");
  const btnClearB = document.getElementById("btn-clear-b");

  const fileInputA = document.getElementById("file-input-a");
  const fileInputB = document.getElementById("file-input-b");

  const btnSplit = document.getElementById("btn-view-split");
  const btnUnified = document.getElementById("btn-view-unified");

  const chkIgnoreSpace = document.getElementById("chk-ignore-space");
  const chkLineNumbers = document.getElementById("chk-line-numbers");

  // Modo Split vs Unified
  btnSplit.addEventListener("click", () => {
    btnSplit.classList.add("active");
    btnUnified.classList.remove("active");
    currentDiffMode = "split";
    executeDiff();
  });

  btnUnified.addEventListener("click", () => {
    btnUnified.classList.add("active");
    btnSplit.classList.remove("active");
    currentDiffMode = "unified";
    executeDiff();
  });

  // Opciones
  chkIgnoreSpace.addEventListener("change", executeDiff);
  chkLineNumbers.addEventListener("change", executeDiff);

  // Ejecutar Diff
  btnRun.addEventListener("click", executeDiff);

  // Swap
  btnSwap.addEventListener("click", () => {
    const textA = document.getElementById("diff-text-a");
    const textB = document.getElementById("diff-text-b");
    const temp = textA.value;
    textA.value = textB.value;
    textB.value = temp;
    executeDiff();
  });

  // Clear
  btnClearA.addEventListener("click", () => {
    document.getElementById("diff-text-a").value = "";
    executeDiff();
  });
  btnClearB.addEventListener("click", () => {
    document.getElementById("diff-text-b").value = "";
    executeDiff();
  });

  // File Upload
  handleFileUpload(fileInputA, "diff-text-a");
  handleFileUpload(fileInputB, "diff-text-b");
}

function handleFileUpload(inputEl, textareaId) {
  inputEl.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      document.getElementById(textareaId).value = evt.target.result;
      executeDiff();
    };
    reader.readAsText(file);
  });
}

/**
 * Ejecuta la comparación Myers/LCS y renderiza los resultados.
 */
function executeDiff() {
  const textA = document.getElementById("diff-text-a")?.value || "";
  const textB = document.getElementById("diff-text-b")?.value || "";
  const ignoreSpace = document.getElementById("chk-ignore-space")?.checked || false;
  const showLineNumbers = document.getElementById("chk-line-numbers")?.checked ?? true;
  const renderArea = document.getElementById("diff-render-area");

  if (!renderArea) return;

  if (!textA && !textB) {
    renderArea.innerHTML = `
      <div class="empty-state">
        <i class="ph ph-git-diff"></i>
        <p>No hay texto para comparar. Escribe o pega contenido en los campos superiores.</p>
      </div>
    `;
    updateStats(0, 0, 0);
    return;
  }

  const linesA = textA.split("\n");
  const linesB = textB.split("\n");

  const diffResult = computeMyersDiff(linesA, linesB, ignoreSpace);

  // Calcular estadísticas
  let added = 0;
  let deleted = 0;
  let same = 0;

  diffResult.forEach(item => {
    if (item.type === "add") added++;
    else if (item.type === "del") deleted++;
    else if (item.type === "same") same++;
  });

  updateStats(added, deleted, same);

  if (currentDiffMode === "split") {
    renderSplitView(renderArea, diffResult, showLineNumbers);
  } else {
    renderUnifiedView(renderArea, diffResult, showLineNumbers);
  }
}

function updateStats(added, deleted, same) {
  const statAdd = document.getElementById("stat-add-count");
  const statDel = document.getElementById("stat-del-count");
  const statSame = document.getElementById("stat-same-count");

  if (statAdd) statAdd.textContent = added;
  if (statDel) statDel.textContent = deleted;
  if (statSame) statSame.textContent = same;
}

/**
 * Algoritmo LCS para generar operaciones de Diff (same, del, add)
 */
function computeMyersDiff(linesA, linesB, ignoreSpace) {
  const N = linesA.length;
  const M = linesB.length;

  const normalize = (s) => ignoreSpace ? s.trim().replace(/\s+/g, " ") : s;

  // Matriz de Programación Dinámica LCS
  const dp = Array.from({ length: N + 1 }, () => new Int32Array(M + 1));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (normalize(linesA[i]) === normalize(linesB[j])) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  let i = N;
  let j = M;
  const rawOps = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normalize(linesA[i - 1]) === normalize(linesB[j - 1])) {
      rawOps.push({ type: "same", lineA: linesA[i - 1], lineB: linesB[j - 1], numA: i, numB: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j] >= dp[i][j - 1])) {
      rawOps.push({ type: "add", lineB: linesB[j - 1], numB: j });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j] < dp[i][j - 1])) {
      rawOps.push({ type: "del", lineA: linesA[i - 1], numA: i });
      i--;
    }
  }

  rawOps.reverse();
  return rawOps;
}

/**
 * Resaltado interno a nivel de palabras para pares de líneas modificadas
 */
function computeInlineWordDiff(strA, strB) {
  const wordsA = strA.split(/(\s+|[^\w\s]+)/);
  const wordsB = strB.split(/(\s+|[^\w\s]+)/);

  const N = wordsA.length;
  const M = wordsB.length;
  const dp = Array.from({ length: N + 1 }, () => new Int32Array(M + 1));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (wordsA[i] === wordsB[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  let i = N, j = M;
  const resultA = [];
  const resultB = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsA[i - 1] === wordsB[j - 1]) {
      resultA.push({ type: "same", val: wordsA[i - 1] });
      resultB.push({ type: "same", val: wordsB[j - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j] >= dp[i][j - 1])) {
      resultB.push({ type: "add", val: wordsB[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j] < dp[i][j - 1])) {
      resultA.push({ type: "del", val: wordsA[i - 1] });
      i--;
    }
  }

  resultA.reverse();
  resultB.reverse();

  const htmlA = resultA.map(w => w.type === "del" ? `<mark class="diff-word-del">${escapeHTML(w.val)}</mark>` : escapeHTML(w.val)).join("");
  const htmlB = resultB.map(w => w.type === "add" ? `<mark class="diff-word-add">${escapeHTML(w.val)}</mark>` : escapeHTML(w.val)).join("");

  return { htmlA, htmlB };
}

/**
 * Renderizado Vista Lado a Lado (Split View)
 */
function renderSplitView(container, diffResult, showLineNumbers) {
  // Emparejar cambios del y add consecutivos para mostrar cambios en paralelo
  const rows = [];
  let idx = 0;

  while (idx < diffResult.length) {
    const item = diffResult[idx];

    if (item.type === "same") {
      rows.push({
        left: { type: "same", num: item.numA, text: escapeHTML(item.lineA) },
        right: { type: "same", num: item.numB, text: escapeHTML(item.lineB) }
      });
      idx++;
    } else {
      // Recolectar bloque continuo de del y add
      const dels = [];
      const adds = [];

      while (idx < diffResult.length && (diffResult[idx].type === "del" || diffResult[idx].type === "add")) {
        if (diffResult[idx].type === "del") dels.push(diffResult[idx]);
        else adds.push(diffResult[idx]);
        idx++;
      }

      const maxLen = Math.max(dels.length, adds.length);
      for (let k = 0; k < maxLen; k++) {
        const d = dels[k];
        const a = adds[k];

        let leftContent = "";
        let rightContent = "";

        if (d && a) {
          const inline = computeInlineWordDiff(d.lineA, a.lineB);
          leftContent = inline.htmlA;
          rightContent = inline.htmlB;
        } else {
          if (d) leftContent = escapeHTML(d.lineA);
          if (a) rightContent = escapeHTML(a.lineB);
        }

        rows.push({
          left: d ? { type: "del", num: d.numA, text: leftContent } : { type: "empty", num: "", text: "" },
          right: a ? { type: "add", num: a.numB, text: rightContent } : { type: "empty", num: "", text: "" }
        });
      }
    }
  }

  let tableHTML = `
    <div class="diff-table-wrapper">
      <table class="diff-table split-table">
        <thead>
          <tr>
            ${showLineNumbers ? `<th class="th-num">#</th>` : ''}
            <th class="th-content">Original</th>
            ${showLineNumbers ? `<th class="th-num">#</th>` : ''}
            <th class="th-content">Modificado</th>
          </tr>
        </thead>
        <tbody>
  `;

  rows.forEach(r => {
    const leftSign = r.left.type === "del" ? "-" : " ";
    const rightSign = r.right.type === "add" ? "+" : " ";
    tableHTML += `<tr>${showLineNumbers ? `<td class="td-num num-left ${r.left.type}">${r.left.num}</td>` : ''}<td class="td-line line-left ${r.left.type}"><span class="diff-sign">${leftSign}</span><code class="diff-code">${r.left.text}</code></td>${showLineNumbers ? `<td class="td-num num-right ${r.right.type}">${r.right.num}</td>` : ''}<td class="td-line line-right ${r.right.type}"><span class="diff-sign">${rightSign}</span><code class="diff-code">${r.right.text}</code></td></tr>`;
  });

  tableHTML += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHTML;
}

/**
 * Renderizado Vista Unificada (Unified View)
 */
function renderUnifiedView(container, diffResult, showLineNumbers) {
  let tableHTML = `
    <div class="diff-table-wrapper">
      <table class="diff-table unified-table">
        <thead>
          <tr>
            ${showLineNumbers ? `<th class="th-num">Orig</th><th class="th-num">Nuevo</th>` : ''}
            <th class="th-sign">+/-</th>
            <th class="th-content">Contenido de la línea</th>
          </tr>
        </thead>
        <tbody>
  `;

  diffResult.forEach(item => {
    let typeClass = item.type;
    let sign = " ";
    let numA = item.numA || "";
    let numB = item.numB || "";
    let text = "";

    if (item.type === "same") {
      sign = " ";
      text = escapeHTML(item.lineA);
    } else if (item.type === "del") {
      sign = "-";
      text = escapeHTML(item.lineA);
    } else if (item.type === "add") {
      sign = "+";
      text = escapeHTML(item.lineB);
    }

    tableHTML += `<tr>${showLineNumbers ? `<td class="td-num num-a ${typeClass}">${numA}</td><td class="td-num num-b ${typeClass}">${numB}</td>` : ''}<td class="td-sign ${typeClass}">${sign}</td><td class="td-line line-unified ${typeClass}"><code class="diff-code">${text}</code></td></tr>`;
  });

  tableHTML += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHTML;
}
