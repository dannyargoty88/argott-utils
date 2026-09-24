/**
 * SQL Formatter View - Argott Utils
 * Permite Formatear, Minificar y Embellecer consultas SQL (PostgreSQL, MySQL, PL/SQL, T-SQL, Oracle).
 * Desarrollado con Vanilla HTML5, CSS3 y JavaScript ES6+.
 */

function renderSqlFormatterView(container) {
  container.innerHTML = `
    <div class="sql-formatter-container">
      
      <!-- Encabezado de la Vista -->
      <div class="panel-box">
        <div class="panel-header" style="justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="panel-title" style="font-size: 1.25rem;">
              <i class="ph ph-database" style="color: var(--accent-primary);"></i> SQL Formatter & Beautifier
            </h2>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Formatea, embellece, sangra y minifica consultas SQL para PostgreSQL, MySQL, SQL Server, PL/SQL y Oracle.
            </p>
          </div>

          <div class="sql-header-actions">
            <button id="btn-sql-sample" class="btn-secondary" style="width: auto; padding: 0.45rem 0.9rem;">
              <i class="ph ph-lightning"></i> Cargar Consulta Ejemplo
            </button>
            <button id="btn-sql-clear" class="btn-icon-action" title="Limpiar todo">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Banner de Notificación -->
      <div id="sql-status-banner" class="json-status-banner" style="display: none;"></div>

      <!-- Toolbar de Opciones y Acciones -->
      <div class="panel-box sql-toolbar-box">
        <div class="json-toolbar">
          
          <div class="json-actions-left">
            <button id="btn-sql-format" class="btn-primary" style="width: auto; padding: 0.45rem 1rem;">
              <i class="ph ph-magic-wand"></i> Formatear SQL
            </button>

            <button id="btn-sql-minify" class="btn-secondary" style="width: auto; padding: 0.45rem 0.9rem;">
              <i class="ph ph-arrows-in-line-horizontal"></i> Minificar
            </button>

            <div class="json-indent-selector">
              <span class="diff-option-label">Palabras Clave:</span>
              <select id="select-sql-case" class="form-control" style="width: 125px; padding: 0.35rem 0.5rem; font-size: 0.78rem;">
                <option value="upper" selected>MAYÚSCULAS</option>
                <option value="lower">minúsculas</option>
                <option value="preserve">Mantener</option>
              </select>
            </div>

            <div class="json-indent-selector">
              <span class="diff-option-label">Sangría:</span>
              <select id="select-sql-indent" class="form-control" style="width: 100px; padding: 0.35rem 0.5rem; font-size: 0.78rem;">
                <option value="2" selected>2 espacios</option>
                <option value="4">4 espacios</option>
                <option value="tab">Tabulación</option>
              </select>
            </div>
          </div>

          <div class="json-actions-right">
            <label class="btn-file-upload" title="Cargar archivo .sql">
              <i class="ph ph-upload-simple"></i> Cargar SQL
              <input type="file" id="file-input-sql" accept=".sql,.txt" hidden>
            </label>

            <button id="btn-sql-copy" class="btn-secondary" style="width: auto; padding: 0.45rem 0.8rem;" title="Copiar resultado">
              <i class="ph ph-copy"></i> Copiar
            </button>

            <button id="btn-sql-download" class="btn-secondary" style="width: auto; padding: 0.45rem 0.8rem;" title="Descargar archivo .sql">
              <i class="ph ph-download-simple"></i> Descargar
            </button>
          </div>

        </div>
      </div>

      <!-- Grid de Entrada / Salida -->
      <div class="json-editor-grid">
        
        <!-- Entrada SQL -->
        <div class="panel-box json-box">
          <div class="json-box-header">
            <span class="json-box-title"><i class="ph ph-terminal-window"></i> Consulta SQL Desordenada (Entrada)</span>
            <span id="sql-input-stats" class="json-stats-pill">0 caracteres</span>
          </div>
          <textarea id="sql-textarea-input" class="diff-textarea json-textarea" style="height: 380px;" placeholder="Pega tu consulta SQL sin formatear aquí...\n\nEjemplo:\nselect u.id, u.nombre, r.nombre as rol from usuarios u left join roles r on u.rol_id = r.id where u.estado = 'activo' order by u.id desc;" spellcheck="false"></textarea>
        </div>

        <!-- Salida SQL Formateado -->
        <div class="panel-box json-box">
          <div class="json-box-header">
            <span class="json-box-title"><i class="ph ph-code-block"></i> Consulta SQL Formateada (Salida)</span>
            <button id="btn-sql-swap" class="btn-secondary" style="width: auto; padding: 0.2rem 0.6rem; font-size: 0.74rem;">
              <i class="ph ph-arrows-down-up"></i> Usar como Entrada
            </button>
          </div>
          <textarea id="sql-textarea-output" class="diff-textarea json-textarea" style="height: 380px;" readonly placeholder="La consulta SQL formateada o minificada aparecerá aquí..." spellcheck="false"></textarea>
        </div>

      </div>

    </div>
  `;

  setupSqlFormatterEvents();
  loadSqlSample();
}

/* ==========================================================================
   MOTOR DE FORMATEO Y MINIFICACIÓN SQL
   ========================================================================== */

function setupSqlFormatterEvents() {
  const inputEl = document.getElementById("sql-textarea-input");
  const outputEl = document.getElementById("sql-textarea-output");
  const btnFormat = document.getElementById("btn-sql-format");
  const btnMinify = document.getElementById("btn-sql-minify");
  const btnSample = document.getElementById("btn-sql-sample");
  const btnClear = document.getElementById("btn-sql-clear");
  const btnCopy = document.getElementById("btn-sql-copy");
  const btnDownload = document.getElementById("btn-sql-download");
  const btnSwap = document.getElementById("btn-sql-swap");
  const fileInput = document.getElementById("file-input-sql");
  const statsPill = document.getElementById("sql-input-stats");
  const caseSelect = document.getElementById("select-sql-case");
  const indentSelect = document.getElementById("select-sql-indent");

  inputEl.addEventListener("input", () => {
    if (statsPill) statsPill.textContent = `${inputEl.value.length} caracteres`;
  });

  btnFormat.addEventListener("click", () => {
    formatSqlInput();
  });

  btnMinify.addEventListener("click", () => {
    minifySqlInput();
  });

  if (caseSelect) {
    caseSelect.addEventListener("change", () => {
      if (inputEl.value.trim()) formatSqlInput();
    });
  }

  if (indentSelect) {
    indentSelect.addEventListener("change", () => {
      if (inputEl.value.trim()) formatSqlInput();
    });
  }

  btnSample.addEventListener("click", loadSqlSample);

  btnClear.addEventListener("click", () => {
    inputEl.value = "";
    outputEl.value = "";
    if (statsPill) statsPill.textContent = "0 caracteres";
    hideSqlStatus();
  });

  btnSwap.addEventListener("click", () => {
    if (!outputEl.value) return;
    inputEl.value = outputEl.value;
    if (statsPill) statsPill.textContent = `${inputEl.value.length} caracteres`;
  });

  btnCopy.addEventListener("click", () => {
    const textToCopy = outputEl.value || inputEl.value;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showSqlStatus("✓ Consulta SQL copiada al portapapeles", "success");
    });
  });

  btnDownload.addEventListener("click", () => {
    const content = outputEl.value || inputEl.value;
    if (!content) {
      showSqlStatus("No hay consulta SQL para descargar", "error");
      return;
    }
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consulta_argott_${new Date().getTime()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  });

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      inputEl.value = evt.target.result;
      if (statsPill) statsPill.textContent = `${inputEl.value.length} caracteres`;
      formatSqlInput();
    };
    reader.readAsText(file);
  });
}

function loadSqlSample() {
  const sample = `select u.id, u.nombre, u.email, u.rol, count(s.id) as total_solicitudes, sum(s.monto) as monto_total from usuarios u left join solicitudes s on u.id = s.usuario_id where u.estado = 'activo' and (u.rol = 'Administrador' or u.rol = 'Editor') group by u.id, u.nombre, u.email, u.rol having count(s.id) > 0 order by monto_total desc limit 50;`;
  const inputEl = document.getElementById("sql-textarea-input");
  if (inputEl) {
    inputEl.value = sample;
    document.getElementById("sql-input-stats").textContent = `${sample.length} caracteres`;
    formatSqlInput();
  }
}

function formatSqlInput() {
  const inputEl = document.getElementById("sql-textarea-input");
  const outputEl = document.getElementById("sql-textarea-output");
  const caseOption = document.getElementById("select-sql-case")?.value || "upper";
  const indentOption = document.getElementById("select-sql-indent")?.value || "2";

  const raw = inputEl.value.trim();
  if (!raw) {
    showSqlStatus("Por favor ingresa una consulta SQL para formatear.", "error");
    return;
  }

  try {
    const formatted = formatSqlString(raw, caseOption, indentOption);
    outputEl.value = formatted;
    showSqlStatus("✓ Consulta SQL formateada y embellecida correctamente", "success");
  } catch (err) {
    showSqlStatus(`Error al formatear SQL: ${err.message}`, "error");
  }
}

function minifySqlInput() {
  const inputEl = document.getElementById("sql-textarea-input");
  const outputEl = document.getElementById("sql-textarea-output");
  const raw = inputEl.value.trim();

  if (!raw) {
    showSqlStatus("Por favor ingresa una consulta SQL para minificar.", "error");
    return;
  }

  try {
    const minified = minifySqlString(raw);
    outputEl.value = minified;
    showSqlStatus("✓ Consulta SQL minificada a una sola línea", "success");
  } catch (err) {
    showSqlStatus(`Error al minificar SQL: ${err.message}`, "error");
  }
}

/**
  * Conjunto de Palabras Clave Reservadas de SQL
  */
const SQL_KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "GROUP", "BY", "HAVING", "ORDER", "LIMIT", "OFFSET",
  "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "FULL", "CROSS", "ON", "USING",
  "UNION", "ALL", "INTERSECT", "EXCEPT", "INSERT", "INTO", "VALUES", "UPDATE",
  "SET", "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "WITH", "AS", "AND",
  "OR", "NOT", "IN", "IS", "NULL", "EXISTS", "LIKE", "ILIKE", "BETWEEN", "CASE",
  "WHEN", "THEN", "ELSE", "END", "ASC", "DESC", "NULLS", "FIRST", "LAST",
  "DISTINCT", "RETURNING", "CAST", "COALESCE", "NULLIF", "OVER", "PARTITION",
  "ROW_NUMBER", "RANK", "DENSE_RANK", "COUNT", "SUM", "AVG", "MIN", "MAX",
  "TRUE", "FALSE", "CHARACTER", "VARYING", "VARCHAR", "TEXT", "INTEGER", "INT",
  "BIGINT", "SMALLINT", "NUMERIC", "DECIMAL", "BOOLEAN", "TIMESTAMP", "DATE",
  "TIME", "JSONB", "JSON", "DEFAULT", "CONSTRAINT", "PRIMARY", "KEY", "FOREIGN",
  "REFERENCES", "CHECK", "INDEX", "VIEW", "TRIGGER", "FUNCTION", "PROCEDURE",
  "RETURNS", "DECLARE", "BEGIN", "COMMIT", "ROLLBACK", "TRUNCATE", "RECURSIVE",
  "WINDOW", "FILTER", "EXTRACT", "NOW", "CURRENT_TIMESTAMP", "CURRENT_DATE"
]);

const MAJOR_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT", "OFFSET",
  "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "FULL JOIN", "CROSS JOIN", "JOIN",
  "UNION ALL", "UNION", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
  "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "WITH"
];

const SUB_KEYWORDS = ["AND", "OR", "ON", "WHEN", "THEN", "ELSE", "END"];

/**
 * Tokenizador SQL que preserva literales de texto, cadenas JSON y comentarios
 */
function tokenizeSql(sql) {
  const regex = /('(?:''|[^'])*'|"(?:""|[^"])*"|`[^`]*`|\$\w*\$[\s\S]*?\$\w*\$|--[^\r\n]*|\/\*[\s\S]*?\*\/|::|<=|>=|<>|!=|->>|->|=>|\d+(?:\.\d+)?|[a-zA-Z_\u00C0-\u024F][a-zA-Z0-9_\u00C0-\u024F]*|[^\s])/g;
  const rawTokens = [];
  let match;
  while ((match = regex.exec(sql)) !== null) {
    rawTokens.push(match[0]);
  }

  // Agrupar palabras clave compuestas (ej: GROUP BY, LEFT JOIN, CHARACTER VARYING)
  const tokens = [];
  for (let i = 0; i < rawTokens.length; i++) {
    const current = rawTokens[i];
    const next = rawTokens[i + 1] ? rawTokens[i + 1] : "";
    const combinedKey = `${current.toUpperCase()} ${next.toUpperCase()}`;

    if (MAJOR_KEYWORDS.includes(combinedKey) || combinedKey === "CHARACTER VARYING" || combinedKey === "PRIMARY KEY" || combinedKey === "FOREIGN KEY" || combinedKey === "UNION ALL") {
      tokens.push({ text: `${current} ${next}`, isKeyword: true, key: combinedKey });
      i++;
    } else {
      const upper = current.toUpperCase();
      const isLiteralOrComment = /^['"`$]|^\/\*|^--/.test(current);
      const isKw = !isLiteralOrComment && SQL_KEYWORDS.has(upper);
      tokens.push({ text: current, isKeyword: isKw, key: upper });
    }
  }
  return tokens;
}

/**
 * Formatea cadenas JSON incrustadas en literales SQL manteniendo el Casing de las claves
 */
function formatEmbeddedJson(tokenText, indentStr, currentIndent) {
  if (!tokenText.startsWith("'") || !tokenText.endsWith("'") || tokenText.length < 4) {
    return tokenText;
  }
  const inner = tokenText.slice(1, -1).trim();
  if (!inner.startsWith("{") && !inner.startsWith("[")) {
    return tokenText;
  }
  try {
    const parsed = JSON.parse(inner);
    const jsonFormatted = JSON.stringify(parsed, null, 2);
    const lines = jsonFormatted.split("\n");
    const baseIndent = indentStr.repeat(currentIndent > 0 ? currentIndent + 1 : 1);
    const indentedJson = lines.map((line, idx) => {
      if (idx === 0) return line;
      return baseIndent + line;
    }).join("\n");
    return "'" + indentedJson + "'";
  } catch (e) {
    return tokenText;
  }
}

/**
 * Algoritmo de Embellecimiento SQL respetando el Case de palabras clave y formateando JSON incrustado
 */
function formatSqlString(sql, kwCase, indentSize) {
  let indentStr = "  ";
  if (indentSize === "4") indentStr = "    ";
  else if (indentSize === "tab") indentStr = "\t";

  const tokens = tokenizeSql(sql);
  if (tokens.length === 0) return "";

  let formatted = "";
  let currentIndent = 0;
  let inParenDepth = 0;
  const parenStack = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const text = t.text;
    const isLiteralOrComment = /^['"`$]|^\/\*|^--/.test(text);

    // Formateo de Casing solo si es Palabra Clave SQL
    let display = text;
    if (t.isKeyword && !isLiteralOrComment) {
      if (kwCase === "upper") display = text.toUpperCase();
      else if (kwCase === "lower") display = text.toLowerCase();
    } else if (isLiteralOrComment && text.startsWith("'")) {
      display = formatEmbeddedJson(text, indentStr, currentIndent);
    }

    if (t.isKeyword && MAJOR_KEYWORDS.includes(t.key)) {
      if (formatted.length > 0 && !formatted.endsWith("\n")) {
        formatted += "\n";
      }
      formatted += indentStr.repeat(currentIndent) + display + " ";
    } else if (t.isKeyword && SUB_KEYWORDS.includes(t.key)) {
      if (!formatted.endsWith("\n")) formatted += "\n";
      formatted += indentStr.repeat(currentIndent + 1) + display + " ";
    } else if (text === ",") {
      formatted = formatted.trimEnd() + ",";
      if (inParenDepth <= 1) {
        const nextIndent = currentIndent > 0 ? currentIndent : 1;
        formatted += "\n" + indentStr.repeat(nextIndent);
      } else {
        formatted += " ";
      }
    } else if (text === "(") {
      inParenDepth++;
      const prevToken = tokens[i - 1];
      if (prevToken && (prevToken.isKeyword || /^[a-zA-Z_]/.test(prevToken.text)) && prevToken.text !== "VALUES" && !MAJOR_KEYWORDS.includes(prevToken.key)) {
        formatted = formatted.trimEnd() + "(\n";
        currentIndent++;
        formatted += indentStr.repeat(currentIndent);
        parenStack.push("func");
      } else {
        formatted = formatted.trimEnd() + " (\n";
        currentIndent++;
        formatted += indentStr.repeat(currentIndent);
        parenStack.push("block");
      }
    } else if (text === ")") {
      const type = parenStack.pop() || "block";
      inParenDepth = Math.max(0, inParenDepth - 1);
      currentIndent = Math.max(0, currentIndent - 1);
      formatted = formatted.trimEnd() + "\n" + indentStr.repeat(currentIndent) + ")";
      if (tokens[i + 1] && tokens[i + 1].text !== "," && tokens[i + 1].text !== ")" && tokens[i + 1].text !== "::" && tokens[i + 1].text !== ";") {
        formatted += " ";
      }
    } else if (text === ".") {
      formatted = formatted.trimEnd() + ".";
    } else if (text === "::") {
      formatted = formatted.trimEnd() + "::";
    } else if (tokens[i - 1] && tokens[i - 1].text === ".") {
      formatted += display + " ";
    } else if (tokens[i - 1] && tokens[i - 1].text === "::") {
      formatted += display + " ";
    } else {
      formatted += display + " ";
    }
  }

  return formatted
    .replace(/ \./g, ".")
    .replace(/\. /g, ".")
    .replace(/ ::/g, "::")
    .replace(/ \n/g, "\n")
    .replace(/\n\s*\n/g, "\n")
    .replace(/ ;/g, ";")
    .trim();
}

/**
 * Minificador SQL seguro (no altera texto dentro de comillas)
 */
function minifySqlString(sql) {
  const regex = /('(?:''|[^'])*'|"(?:""|[^"])*"|`[^`]*`|\$\w*\$[\s\S]*?\$\w*\$|--[^\r\n]*|\/\*[\s\S]*?\*\/|::|<=|>=|<>|!=|->>|->|=>|\d+(?:\.\d+)?|[a-zA-Z_\u00C0-\u024F][a-zA-Z0-9_\u00C0-\u024F]*|[^\s])/g;
  const tokens = [];
  let match;
  while ((match = regex.exec(sql)) !== null) {
    const t = match[0];
    if (t.startsWith("--") || t.startsWith("/*")) continue;
    tokens.push(t);
  }

  let result = "";
  for (let i = 0; i < tokens.length; i++) {
    const curr = tokens[i];
    const prev = tokens[i - 1];
    if (!prev) {
      result += curr;
      continue;
    }
    const prevIsWord = /^[\w\u00C0-\u024F]+$/.test(prev);
    const currIsWord = /^[\w\u00C0-\u024F]+$/.test(curr);
    if (prevIsWord && currIsWord) {
      result += " " + curr;
    } else if (curr === "." || curr === "::" || curr === "," || curr === ";" || curr === ")") {
      result += curr;
    } else if (prev === "." || prev === "::" || prev === "(") {
      result += curr;
    } else {
      result += curr;
    }
  }
  return result;
}

function showSqlStatus(msg, type) {
  const banner = document.getElementById("sql-status-banner");
  if (!banner) return;
  banner.className = `json-status-banner banner-${type}`;
  banner.innerHTML = `<i class="ph ph-${type === "success" ? "check-circle" : "warning-circle"}"></i> <span>${msg}</span>`;
  banner.style.display = "flex";
}

function hideSqlStatus() {
  const banner = document.getElementById("sql-status-banner");
  if (banner) banner.style.display = "none";
}
