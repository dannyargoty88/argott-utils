/**
 * Code Converter View - Argott Utils
 * Conversor bidireccional multi-lenguaje:
 * - JSON -> SQL, Go Struct, TS Interface
 * - Go Struct -> JSON, TS Interface, SQL
 * - TS Interface -> Go Struct, JSON, SQL
 * - SQL -> JSON, Go Struct, TS Interface
 */

function renderCodeConverterView(container) {
  container.innerHTML = `
    <div class="code-converter-container">
      
      <!-- Encabezado -->
      <div class="panel-box">
        <div class="panel-header" style="justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="panel-title" style="font-size: 1.25rem;">
              <i class="ph ph-arrows-clockwise" style="color: var(--accent-primary);"></i> Code Converter
            </h2>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Convierte estructuras bidireccionalmente entre JSON, Go Structs, Interfaces TypeScript y Consultas/Tablas SQL.
            </p>
          </div>
        </div>
      </div>

      <!-- Barra de Configuración de la Conversión -->
      <div class="panel-box converter-toolbar-box">
        <div class="converter-toolbar">
          
          <!-- Tipo de Entrada (Source) -->
          <div class="converter-select-group">
            <span class="converter-label">Entrada (Source):</span>
            <select id="conv-source-type" class="form-control converter-select">
              <option value="json" selected>JSON</option>
              <option value="go-struct">Go Struct</option>
              <option value="ts-interface">TypeScript Interface</option>
              <option value="sql">SQL Query / Schema</option>
            </select>
          </div>

          <!-- Flecha de Dirección -->
          <div class="converter-arrow-icon">
            <i class="ph ph-arrow-right"></i>
          </div>

          <!-- Tipo de Salida (Target) -->
          <div class="converter-select-group">
            <span class="converter-label">Convertir A (Target):</span>
            <select id="conv-target-type" class="form-control converter-select">
              <!-- Inyectado dinámicamente -->
            </select>
          </div>

          <!-- Nombre de la Clase / Struct / Tabla -->
          <div class="converter-select-group" style="flex: 1; min-width: 180px;">
            <span class="converter-label">Nombre del Struct / Tabla:</span>
            <input type="text" id="conv-struct-name" class="form-control" value="User" placeholder="Ej. User, Product, usuario">
          </div>

          <!-- Botón Ejecutar -->
          <button id="btn-convert-run" class="btn-primary" style="width: auto; padding: 0.55rem 1.4rem;">
            <i class="ph ph-lightning"></i> Convertir Código
          </button>

        </div>
      </div>

      <!-- Banner de Estado -->
      <div id="conv-status-banner" class="conv-status-banner" style="display: none;"></div>

      <!-- Editor Grid: Entrada vs Salida -->
      <div class="converter-grid">
        
        <!-- Panel Izquierdo: Input Code -->
        <div class="panel-box converter-box">
          <div class="converter-box-header">
            <span id="conv-input-title" class="converter-box-title">
              <i class="ph ph-brackets-curly" style="color: var(--accent-amber);"></i> Entrada JSON
            </span>
            <div class="converter-box-actions">
              <button id="btn-conv-preset" class="btn-preset" title="Cargar Ejemplo"><i class="ph ph-sparkle"></i> Ejemplo</button>
              <button id="btn-conv-clear-input" class="btn-icon-action" title="Limpiar Entrada"><i class="ph ph-trash"></i></button>
            </div>
          </div>
          <textarea id="conv-input-code" class="diff-textarea converter-textarea" spellcheck="false" placeholder="Ingresa tu código de origen aquí..."></textarea>
        </div>

        <!-- Panel Derecho: Output Code Generated -->
        <div class="panel-box converter-box">
          <div class="converter-box-header">
            <span id="conv-output-title" class="converter-box-title">
              <i class="ph ph-file-code" style="color: var(--accent-emerald);"></i> Código Generado
            </span>
            <div class="converter-box-actions">
              <button id="btn-conv-copy-output" class="btn-preset" title="Copiar al portapapeles"><i class="ph ph-copy"></i> Copiar</button>
            </div>
          </div>
          <pre id="conv-output-code" class="json-code-highlighter converter-code-output"><span style="color:var(--text-dim);">El código transformado se generará aquí...</span></pre>
        </div>

      </div>

    </div>
  `;

  setupCodeConverterEvents();
}

/* Presets demostrativos para cada tipo de entrada */
const PRESETS = {
  json: `{\n  "id": 10,\n  "name": "Danny",\n  "active": true,\n  "email": "danny@ejemplo.com",\n  "meta": {\n    "login_count": 42,\n    "ip_address": "192.168.1.1"\n  }\n}`,
  "go-struct": `type User struct {\n  ID        int       \`json:"id"\`\n  Name      string    \`json:"name"\`\n  Active    bool      \`json:"active"\`\n  Email     string    \`json:"email"\`\n  CreatedAt string    \`json:"created_at"\`\n}`,
  "ts-interface": `export interface User {\n  id: number;\n  name: string;\n  active: boolean;\n  email: string;\n  createdAt: string;\n}`,
  sql: `SELECT \n  p.id_producto AS id,\n  p.nombre_producto AS name,\n  p.precio AS price,\n  p.es_activo AS active,\n  p.fecha_creacion AS created_at\nFROM public.producto p\nWHERE p.estado = 'A';`
};

/* Configuración de Opciones de Destino por Fuente */
const TARGET_MAP = {
  json: [
    { value: "go-struct", label: "Go Struct" },
    { value: "ts-interface", label: "TypeScript Interface" },
    { value: "sql", label: "SQL CREATE TABLE / SELECT" }
  ],
  "go-struct": [
    { value: "json", label: "JSON" },
    { value: "ts-interface", label: "TypeScript Interface" },
    { value: "sql", label: "SQL CREATE TABLE" }
  ],
  "ts-interface": [
    { value: "go-struct", label: "Go Struct" },
    { value: "json", label: "JSON" },
    { value: "sql", label: "SQL CREATE TABLE" }
  ],
  sql: [
    { value: "json", label: "JSON" },
    { value: "go-struct", label: "Go Struct" },
    { value: "ts-interface", label: "TypeScript Interface" }
  ]
};

function setupCodeConverterEvents() {
  const sourceTypeSelect = document.getElementById("conv-source-type");
  const targetTypeSelect = document.getElementById("conv-target-type");
  const inputCode = document.getElementById("conv-input-code");
  const btnRun = document.getElementById("btn-convert-run");
  const btnPreset = document.getElementById("btn-conv-preset");
  const btnClear = document.getElementById("btn-conv-clear-input");
  const btnCopy = document.getElementById("btn-conv-copy-output");
  const structNameInput = document.getElementById("conv-struct-name");

  function updateTargetOptions() {
    const src = sourceTypeSelect.value;
    const targets = TARGET_MAP[src] || [];

    targetTypeSelect.innerHTML = targets.map((t, idx) => `
      <option value="${t.value}" ${idx === 0 ? "selected" : ""}>${t.label}</option>
    `).join("");

    const inputTitle = document.getElementById("conv-input-title");
    const icons = {
      json: '<i class="ph ph-brackets-curly" style="color: var(--accent-amber);"></i> Entrada JSON',
      "go-struct": '<i class="ph ph-code" style="color: var(--accent-primary);"></i> Entrada Go Struct',
      "ts-interface": '<i class="ph ph-file-code" style="color: var(--accent-secondary);"></i> Entrada TS Interface',
      sql: '<i class="ph ph-database" style="color: var(--accent-cyan);"></i> Entrada SQL Query / Schema'
    };

    if (inputTitle) inputTitle.innerHTML = icons[src] || "Entrada Código";
    if (!inputCode.value.trim() || isGenericPreset(inputCode.value)) {
      inputCode.value = PRESETS[src] || "";
    }
  }

  sourceTypeSelect.addEventListener("change", () => {
    updateTargetOptions();
    executeCodeConversion();
  });

  targetTypeSelect.addEventListener("change", executeCodeConversion);
  structNameInput.addEventListener("input", executeCodeConversion);
  btnRun.addEventListener("click", executeCodeConversion);

  btnPreset.addEventListener("click", () => {
    const src = sourceTypeSelect.value;
    inputCode.value = PRESETS[src] || "";
    executeCodeConversion();
  });

  btnClear.addEventListener("click", () => {
    inputCode.value = "";
    document.getElementById("conv-output-code").innerHTML = `<span style="color:var(--text-dim);">Ingresa un texto para convertir...</span>`;
    hideConvBanner();
  });

  btnCopy.addEventListener("click", () => {
    const outputEl = document.getElementById("conv-output-code");
    const text = outputEl ? outputEl.textContent : "";
    if (!text || text.includes("El código transformado")) return;
    navigator.clipboard.writeText(text).then(() => {
      if (typeof ArgottAlert !== "undefined") {
        ArgottAlert.toast("Código copiado al portapapeles", "success");
      }
    });
  });

  // Inicialización
  updateTargetOptions();
  executeCodeConversion();
}

function isGenericPreset(val) {
  return Object.values(PRESETS).some(p => p.trim() === val.trim());
}

/* Engine Principal de Conversiones */
function executeCodeConversion() {
  const srcType = document.getElementById("conv-source-type").value;
  const targetType = document.getElementById("conv-target-type").value;
  const rawInput = document.getElementById("conv-input-code").value.trim();
  const nameInput = document.getElementById("conv-struct-name").value.trim() || "User";
  const outputCode = document.getElementById("conv-output-code");

  if (!rawInput) {
    if (outputCode) outputCode.innerHTML = `<span style="color:var(--text-dim);">Ingresa tu código en el panel izquierdo para ver el resultado...</span>`;
    hideConvBanner();
    return;
  }

  try {
    let result = "";

    // 1. FUENTE: JSON
    if (srcType === "json") {
      const parsed = JSON.parse(rawInput);
      if (targetType === "go-struct") {
        result = convertJsonToGoStruct(parsed, nameInput);
      } else if (targetType === "ts-interface") {
        result = convertJsonToTsInterface(parsed, nameInput);
      } else if (targetType === "sql") {
        result = convertJsonToSql(parsed, nameInput);
      }
    }
    // 2. FUENTE: GO STRUCT
    else if (srcType === "go-struct") {
      const fields = parseGoStructFields(rawInput);
      if (fields.length === 0) throw new Error("No se pudieron extraer campos del Go Struct.");

      if (targetType === "json") {
        result = convertFieldsToJson(fields);
      } else if (targetType === "ts-interface") {
        result = convertFieldsToTsInterface(fields, nameInput);
      } else if (targetType === "sql") {
        result = convertFieldsToSqlTable(fields, nameInput);
      }
    }
    // 3. FUENTE: TYPESCRIPT INTERFACE
    else if (srcType === "ts-interface") {
      const fields = parseTsInterfaceFields(rawInput);
      if (fields.length === 0) throw new Error("No se pudieron extraer campos de la Interface TypeScript.");

      if (targetType === "go-struct") {
        result = convertFieldsToGoStruct(fields, nameInput);
      } else if (targetType === "json") {
        result = convertFieldsToJson(fields);
      } else if (targetType === "sql") {
        result = convertFieldsToSqlTable(fields, nameInput);
      }
    }
    // 4. FUENTE: SQL
    else if (srcType === "sql") {
      const fields = parseSqlFields(rawInput);
      if (fields.length === 0) throw new Error("No se detectaron campos o alias en la consulta/tabla SQL.");

      if (targetType === "json") {
        result = convertSqlFieldsToJson(fields);
      } else if (targetType === "go-struct") {
        result = convertSqlFieldsToGoStruct(fields, nameInput);
      } else if (targetType === "ts-interface") {
        result = convertSqlFieldsToTsInterface(fields, nameInput);
      }
    }

    if (outputCode) {
      outputCode.innerHTML = highlightConvertedCode(result, targetType);
    }
    showConvBanner("✓ Conversión generada exitosamente", "success");

  } catch (err) {
    if (outputCode) {
      outputCode.innerHTML = `<span style="color:var(--accent-rose);">✕ Error en la conversión:\n${escapeHTML(err.message)}</span>`;
    }
    showConvBanner(`✕ Error: ${err.message}`, "error");
  }
}

/* ==========================================================================
   TRANSFORMADORES JSON -> GO STRUCT, TS INTERFACE, SQL
   ========================================================================== */

function convertJsonToGoStruct(obj, rootStructName) {
  const rootName = toPascalCase(rootStructName) || "AutoGenerated";
  const structsMap = new Map();

  function generateStruct(currentObj, structName) {
    const pascalName = toPascalCase(structName);

    if (Array.isArray(currentObj)) {
      if (currentObj.length > 0 && typeof currentObj[0] === "object" && currentObj[0] !== null) {
        return `[]${generateStruct(currentObj[0], singularize(structName))}`;
      } else if (currentObj.length > 0) {
        return `[]${getGoTypeSimple(currentObj[0])}`;
      } else {
        return `[]interface{}`;
      }
    }

    if (typeof currentObj !== "object" || currentObj === null) {
      return getGoTypeSimple(currentObj);
    }

    if (structsMap.has(pascalName)) return pascalName;

    const fields = [];
    let maxFieldLen = 0;
    let maxTypeLen = 0;

    Object.entries(currentObj).forEach(([key, val]) => {
      const fieldName = toPascalCase(key);
      let fieldType = "";

      if (val !== null && typeof val === "object") {
        if (Array.isArray(val)) {
          if (val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
            const childStructName = generateStruct(val[0], singularize(key));
            fieldType = `[]${childStructName}`;
          } else if (val.length > 0) {
            fieldType = `[]${getGoTypeSimple(val[0])}`;
          } else {
            fieldType = `[]interface{}`;
          }
        } else {
          fieldType = generateStruct(val, key);
        }
      } else {
        fieldType = getGoTypeSimple(val);
      }

      if (fieldName.length > maxFieldLen) maxFieldLen = fieldName.length;
      if (fieldType.length > maxTypeLen) maxTypeLen = fieldType.length;

      fields.push({ key, fieldName, fieldType });
    });

    const structLines = [`type ${pascalName} struct {`];
    fields.forEach(({ key, fieldName, fieldType }) => {
      const padField = fieldName.padEnd(maxFieldLen + 2, " ");
      const padType = fieldType.padEnd(maxTypeLen + 2, " ");
      structLines.push(`  ${padField}${padType}\`json:"${key}"\``);
    });
    structLines.push("}");

    structsMap.set(pascalName, structLines.join("\n"));
    return pascalName;
  }

  generateStruct(obj, rootName);
  return Array.from(structsMap.values()).join("\n\n");
}

function convertJsonToTsInterface(obj, rootInterfaceName) {
  const rootName = toPascalCase(rootInterfaceName) || "AutoGenerated";
  const interfacesMap = new Map();

  function generateInterface(currentObj, interfaceName) {
    const pascalName = toPascalCase(interfaceName);

    if (Array.isArray(currentObj)) {
      if (currentObj.length > 0 && typeof currentObj[0] === "object" && currentObj[0] !== null) {
        return `${generateInterface(currentObj[0], singularize(interfaceName))}[]`;
      } else if (currentObj.length > 0) {
        return `${getTsTypeSimple(currentObj[0])}[]`;
      } else {
        return `any[]`;
      }
    }

    if (typeof currentObj !== "object" || currentObj === null) {
      return getTsTypeSimple(currentObj);
    }

    if (interfacesMap.has(pascalName)) return pascalName;

    const lines = [`export interface ${pascalName} {`];
    Object.entries(currentObj).forEach(([key, val]) => {
      let fieldType = "";

      if (val !== null && typeof val === "object") {
        if (Array.isArray(val)) {
          if (val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
            const childName = generateInterface(val[0], singularize(key));
            fieldType = `${childName}[]`;
          } else if (val.length > 0) {
            fieldType = `${getTsTypeSimple(val[0])}[]`;
          } else {
            fieldType = `any[]`;
          }
        } else {
          fieldType = generateInterface(val, key);
        }
      } else {
        fieldType = getTsTypeSimple(val);
      }

      lines.push(`  ${key}: ${fieldType};`);
    });

    lines.push("}");
    interfacesMap.set(pascalName, lines.join("\n"));
    return pascalName;
  }

  generateInterface(obj, rootName);
  return Array.from(interfacesMap.values()).join("\n\n");
}

function convertJsonToSql(obj, tableName) {
  const name = toSnakeCase(tableName) || "tabla_ejemplo";
  if (Array.isArray(obj) && obj.length > 0) obj = obj[0];
  if (typeof obj !== "object" || obj === null) return "";

  const keys = Object.keys(obj);
  let maxKeyLen = 0;
  keys.forEach(k => {
    if (k.length > maxKeyLen) maxKeyLen = k.length;
  });

  // 1. Generar CREATE TABLE
  const tableLines = [`CREATE TABLE ${name} (`];
  keys.forEach((key, idx) => {
    const val = obj[key];
    const sqlDataType = inferSqlDataTypeFromVal(key, val);
    const padKey = key.padEnd(maxKeyLen + 2, " ");
    const isLast = idx === keys.length - 1;
    const isPk = key.toLowerCase() === "id" ? " PRIMARY KEY" : "";
    tableLines.push(`  ${padKey}${sqlDataType}${isPk}${isLast ? "" : ","}`);
  });
  tableLines.push(");");

  // 2. Generar SELECT Query
  const selectLines = ["\n-- Consulta SELECT correspondiente:", "SELECT"];
  keys.forEach((key, idx) => {
    const alias = toSnakeCase(key);
    const isLast = idx === keys.length - 1;
    selectLines.push(`  ${name}.${alias}${isLast ? "" : ","}`);
  });
  selectLines.push(`FROM ${name};`);

  return tableLines.join("\n") + "\n" + selectLines.join("\n");
}

/* ==========================================================================
   PARSERS Y TRANSFORMADORES DE GO STRUCT
   ========================================================================== */

function parseGoStructFields(code) {
  const fields = [];
  const structRegex = /type\s+([A-Za-z0-9_]+)\s+struct\s*\{([\s\S]*?)\}/g;
  let match;

  while ((match = structRegex.exec(code)) !== null) {
    const body = match[2];
    const bodyLines = body.split("\n");

    bodyLines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//")) return;

      const fieldMatch = trimmed.match(/^([A-Za-z0-9_]+)\s+([A-Za-z0-9_\[\]\{\}\*\.]+)(?:\s+`json:"([^"]+)"`)?/);
      if (fieldMatch) {
        const goName = fieldMatch[1];
        const goType = fieldMatch[2];
        const jsonTag = fieldMatch[3] || toSnakeCase(goName);

        fields.push({
          jsonName: jsonTag,
          goName: goName,
          goType: goType,
          tsType: mapGoTypeToTs(goType),
          sqlType: mapGoTypeToSql(jsonTag, goType),
          val: getDefaultValForGoType(goType)
        });
      }
    });
  }

  return fields;
}

/* ==========================================================================
   PARSERS Y TRANSFORMADORES DE TYPESCRIPT INTERFACE
   ========================================================================== */

function parseTsInterfaceFields(code) {
  const fields = [];
  const interfaceRegex = /(?:export\s+)?interface\s+([A-Za-z0-9_]+)\s*\{([\s\S]*?)\}/g;
  let match;

  while ((match = interfaceRegex.exec(code)) !== null) {
    const body = match[2];
    const bodyLines = body.split("\n");

    bodyLines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//")) return;

      const fieldMatch = trimmed.match(/^([A-Za-z0-9_]+)\s*\??:\s*([A-Za-z0-9_\[\]]+);?/);
      if (fieldMatch) {
        const propName = fieldMatch[1];
        const tsType = fieldMatch[2];

        fields.push({
          jsonName: propName,
          goName: toPascalCase(propName),
          tsType: tsType,
          goType: mapTsTypeToGo(tsType),
          sqlType: mapTsTypeToSql(propName, tsType),
          val: getDefaultValForTsType(tsType)
        });
      }
    });
  }

  return fields;
}

/* ==========================================================================
   GENÉRICO DE GENERACIÓN DESDE CAMPOS PROCESADOS (FIELDS)
   ========================================================================== */

function convertFieldsToJson(fields) {
  const jsonObj = {};
  fields.forEach(f => {
    jsonObj[f.jsonName] = f.val;
  });
  return JSON.stringify(jsonObj, null, 2);
}

function convertFieldsToGoStruct(fields, structName) {
  const pascalName = toPascalCase(structName) || "AutoStruct";
  const lines = [`type ${pascalName} struct {`];
  let maxFieldLen = 0;
  let maxTypeLen = 0;

  fields.forEach(f => {
    if (f.goName.length > maxFieldLen) maxFieldLen = f.goName.length;
    if (f.goType.length > maxTypeLen) maxTypeLen = f.goType.length;
  });

  fields.forEach(f => {
    const padField = f.goName.padEnd(maxFieldLen + 2, " ");
    const padType = f.goType.padEnd(maxTypeLen + 2, " ");
    lines.push(`  ${padField}${padType}\`json:"${f.jsonName}"\``);
  });

  lines.push("}");
  return lines.join("\n");
}

function convertFieldsToTsInterface(fields, interfaceName) {
  const pascalName = toPascalCase(interfaceName) || "AutoInterface";
  const lines = [`export interface ${pascalName} {`];

  fields.forEach(f => {
    lines.push(`  ${f.jsonName}: ${f.tsType};`);
  });

  lines.push("}");
  return lines.join("\n");
}

function convertFieldsToSqlTable(fields, tableName) {
  const name = toSnakeCase(tableName) || "tabla_ejemplo";
  let maxKeyLen = 0;

  fields.forEach(f => {
    if (f.jsonName.length > maxKeyLen) maxKeyLen = f.jsonName.length;
  });

  // 1. Generar CREATE TABLE
  const tableLines = [`CREATE TABLE ${name} (`];
  fields.forEach((f, idx) => {
    const padKey = f.jsonName.padEnd(maxKeyLen + 2, " ");
    const isLast = idx === fields.length - 1;
    const isPk = f.jsonName.toLowerCase() === "id" ? " PRIMARY KEY" : "";
    tableLines.push(`  ${padKey}${f.sqlType}${isPk}${isLast ? "" : ","}`);
  });
  tableLines.push(");");

  // 2. Generar SELECT Query
  const selectLines = ["\n-- Consulta SELECT correspondiente:", "SELECT"];
  fields.forEach((f, idx) => {
    const alias = f.jsonName;
    const isLast = idx === fields.length - 1;
    selectLines.push(`  ${name}.${alias}${isLast ? "" : ","}`);
  });
  selectLines.push(`FROM ${name};`);

  return tableLines.join("\n") + "\n" + selectLines.join("\n");
}

/* ==========================================================================
   PARSER DE CONSULTAS Y TABLAS SQL
   ========================================================================== */

function parseSqlFields(sql) {
  const fields = [];
  const cleanSql = sql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");

  if (/CREATE\s+TABLE/i.test(cleanSql)) {
    const match = cleanSql.match(/\(([\s\S]+)\)/);
    if (match) {
      const columnLines = match[1].split(",");
      columnLines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !/^(CONSTRAINT|PRIMARY|FOREIGN|KEY|UNIQUE|INDEX)/i.test(trimmed)) {
          const parts = trimmed.split(/\s+/);
          if (parts.length > 0) {
            const colName = parts[0].replace(/["`']/g, "");
            if (colName) {
              fields.push({ name: colName, type: inferTypeFromSqlName(colName, parts[1]) });
            }
          }
        }
      });
      return fields;
    }
  }

  const selectMatch = cleanSql.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
  let selectClause = selectMatch ? selectMatch[1] : cleanSql;
  selectClause = selectClause.replace(/^DISTINCT\s+/i, "");

  const items = selectClause.split(/,(?![^(]*\))/);

  items.forEach(item => {
    const trimmed = item.trim();
    if (!trimmed) return;

    let fieldName = "";
    const asMatch = trimmed.match(/\s+AS\s+["`']?([a-zA-Z0-9_]+)["`']?$/i);
    if (asMatch) {
      fieldName = asMatch[1];
    } else {
      const words = trimmed.split(/\s+/);
      const lastWord = words[words.length - 1].replace(/["`']/g, "");
      const dotParts = lastWord.split(".");
      fieldName = dotParts[dotParts.length - 1];
    }

    fieldName = fieldName.replace(/[^a-zA-Z0-9_]/g, "");
    if (fieldName) {
      fields.push({ name: fieldName, type: inferTypeFromSqlName(fieldName) });
    }
  });

  return fields;
}

function convertSqlFieldsToJson(fields) {
  const jsonObj = {};
  fields.forEach(f => {
    jsonObj[f.name] = f.type.default;
  });
  return JSON.stringify(jsonObj, null, 2);
}

function convertSqlFieldsToGoStruct(fields, structName) {
  const pascalName = toPascalCase(structName);
  const lines = [`type ${pascalName} struct {`];
  let maxFieldLen = 0;
  let maxTypeLen = 0;

  const entries = fields.map(f => {
    const fieldName = toPascalCase(f.name);
    const goType = f.type.go;
    if (fieldName.length > maxFieldLen) maxFieldLen = fieldName.length;
    if (goType.length > maxTypeLen) maxTypeLen = goType.length;
    return { name: f.name, fieldName, goType };
  });

  entries.forEach(({ name, fieldName, goType }) => {
    const padField = fieldName.padEnd(maxFieldLen + 2, " ");
    const padType = goType.padEnd(maxTypeLen + 2, " ");
    lines.push(`  ${padField}${padType}\`json:"${name}"\``);
  });

  lines.push("}");
  return lines.join("\n");
}

function convertSqlFieldsToTsInterface(fields, interfaceName) {
  const pascalName = toPascalCase(interfaceName);
  const lines = [`export interface ${pascalName} {`];

  fields.forEach(f => {
    lines.push(`  ${f.name}: ${f.type.ts};`);
  });

  lines.push("}");
  return lines.join("\n");
}

/* ==========================================================================
   HELPERS Y MAPEOS DE TIPOS NATIVOS
   ========================================================================== */

function getGoTypeSimple(val) {
  if (val === null) return "interface{}";
  const type = typeof val;
  if (type === "boolean") return "bool";
  if (type === "number") return Number.isInteger(val) ? "int" : "float64";
  if (type === "string") return "string";
  return "interface{}";
}

function getTsTypeSimple(val) {
  if (val === null) return "any";
  const type = typeof val;
  if (type === "boolean") return "boolean";
  if (type === "number") return "number";
  if (type === "string") return "string";
  return "any";
}

function inferSqlDataTypeFromVal(key, val) {
  const k = key.toLowerCase();
  if (k === "id" || k.endsWith("_id")) return "BIGINT";
  const t = typeof val;
  if (t === "number") return Number.isInteger(val) ? "INTEGER" : "NUMERIC(12,2)";
  if (t === "boolean") return "BOOLEAN";
  if (k.includes("fecha") || k.includes("date") || k.includes("created")) return "TIMESTAMP";
  return "VARCHAR(255)";
}

function mapGoTypeToTs(goType) {
  if (/int|int64|int32|float|float64/.test(goType)) return "number";
  if (/bool/.test(goType)) return "boolean";
  if (/string/.test(goType)) return "string";
  if (goType.startsWith("[]")) return `${mapGoTypeToTs(goType.slice(2))}[]`;
  return "any";
}

function mapGoTypeToSql(name, goType) {
  if (name.toLowerCase() === "id") return "BIGINT";
  if (/int|int64|int32/.test(goType)) return "INTEGER";
  if (/float|float64/.test(goType)) return "NUMERIC(12,2)";
  if (/bool/.test(goType)) return "BOOLEAN";
  if (name.includes("fecha") || name.includes("date") || name.includes("created")) return "TIMESTAMP";
  return "VARCHAR(255)";
}

function mapTsTypeToGo(tsType) {
  if (tsType === "number") return "int";
  if (tsType === "boolean") return "bool";
  if (tsType === "string") return "string";
  if (tsType.endsWith("[]")) return `[]${mapTsTypeToGo(tsType.slice(0, -2))}`;
  return "interface{}";
}

function mapTsTypeToSql(name, tsType) {
  if (name.toLowerCase() === "id") return "BIGINT";
  if (tsType === "number") return "INTEGER";
  if (tsType === "boolean") return "BOOLEAN";
  if (name.includes("fecha") || name.includes("date") || name.includes("created")) return "TIMESTAMP";
  return "VARCHAR(255)";
}

function getDefaultValForGoType(goType) {
  if (/int|int64|int32|float|float64/.test(goType)) return 10;
  if (/bool/.test(goType)) return true;
  if (/string/.test(goType)) return "ejemplo";
  return null;
}

function getDefaultValForTsType(tsType) {
  if (tsType === "number") return 10;
  if (tsType === "boolean") return true;
  if (tsType === "string") return "ejemplo";
  return null;
}

function inferTypeFromSqlName(fieldName, rawSqlType = "") {
  const name = fieldName.toLowerCase();
  const sqlT = rawSqlType.toLowerCase();

  if (sqlT.includes("int") || name.startsWith("id") || name.endsWith("id") || name.includes("cantidad") || name.includes("count")) {
    return { go: "int", ts: "number", default: 1 };
  }
  if (sqlT.includes("bool") || name.startsWith("es_") || name.startsWith("is_") || name.includes("activo") || name.includes("active")) {
    return { go: "bool", ts: "boolean", default: true };
  }
  if (sqlT.includes("date") || sqlT.includes("time") || name.includes("fecha") || name.includes("date") || name.includes("created") || name.includes("updated")) {
    return { go: "string", ts: "string", default: "2026-09-08T16:20:00Z" };
  }
  if (sqlT.includes("numeric") || sqlT.includes("decimal") || sqlT.includes("float") || name.includes("precio") || name.includes("price") || name.includes("monto") || name.includes("total")) {
    return { go: "float64", ts: "number", default: 99.99 };
  }
  return { go: "string", ts: "string", default: "ejemplo" };
}

function singularize(name) {
  let s = String(name);
  if (s.endsWith("es")) return s.slice(0, -2);
  if (s.endsWith("s")) return s.slice(0, -1);
  return s;
}

function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9_]/g, " ")
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function toSnakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

function highlightConvertedCode(code, targetType) {
  const escaped = escapeHTML(code);

  if (targetType === "json") {
    try {
      const parsed = JSON.parse(code);
      return highlightJsonSyntax(parsed);
    } catch (e) {
      return escaped;
    }
  }

  return escaped
    .replace(/\b(type|struct|interface|export|string|int|float64|bool|boolean|number|any|CREATE|TABLE|PRIMARY|KEY|INTEGER|BIGINT|VARCHAR|BOOLEAN|TIMESTAMP|NUMERIC|SELECT|FROM|WHERE|AS)\b/g, '<span style="color:#569cd6; font-weight:bold;">$1</span>')
    .replace(/(`json:"[^"]+"`)/g, '<span style="color:#ce9178;">$1</span>')
    .replace(/(\b[A-Z][a-zA-Z0-9_]*\b)(?=\s+(struct|interface|\{))/g, '<span style="color:#4fc1ff; font-weight:600;">$1</span>');
}

function showConvBanner(msg, type) {
  const banner = document.getElementById("conv-status-banner");
  if (!banner) return;
  banner.className = `conv-status-banner banner-${type}`;
  banner.innerHTML = `<i class="ph ph-${type === "success" ? "check-circle" : "warning-circle"}"></i> <span>${msg}</span>`;
  banner.style.display = "flex";
}

function hideConvBanner() {
  const banner = document.getElementById("conv-status-banner");
  if (banner) banner.style.display = "none";
}
