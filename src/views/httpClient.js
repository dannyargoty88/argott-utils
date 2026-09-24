/**
 * HTTP Client View - Argott Utils
 * Cliente REST en el navegador (estilo Postman / Insomnia) para probar APIs.
 * Soporta métodos GET, POST, PUT, PATCH, DELETE, custom Headers, Body JSON, Bearer Auth y métricas de respuesta.
 * Construido con Vanilla HTML5, CSS3 y JavaScript ES6+ (Fetch API).
 */

function renderHttpClientView(container) {
  container.innerHTML = `
    <div class="http-client-container">
      
      <!-- Encabezado de la Vista -->
      <div class="panel-box">
        <div class="panel-header" style="justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="panel-title" style="font-size: 1.25rem;">
              <i class="ph ph-globe-hemisphere-west" style="color: var(--accent-primary);"></i> REST HTTP Client
            </h2>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Realiza peticiones HTTP/REST a APIs externas o locales directamente desde el navegador.
            </p>
          </div>

          <div class="http-presets">
            <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-dim); text-transform: uppercase;">Probar API Pública:</span>
            <button id="btn-http-preset-json" class="btn-preset"><i class="ph ph-lightning"></i> JSONPlaceholder</button>
            <button id="btn-http-preset-github" class="btn-preset"><i class="ph ph-github-logo"></i> GitHub API</button>
            <button id="btn-http-preset-httpbin" class="btn-preset"><i class="ph ph-planet"></i> Httpbin.org</button>
          </div>
        </div>
      </div>

      <!-- Barra de Dirección de la Petición (Method + URL + Send) -->
      <div class="panel-box http-request-bar-box">
        <div class="http-request-bar">
          <select id="http-method-select" class="form-control http-method-select">
            <option value="GET" selected>GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>

          <input type="url" id="http-url-input" class="form-control http-url-input" placeholder="https://api.ejemplo.com/v1/recursos" value="https://jsonplaceholder.typicode.com/posts/1" required>

          <button id="btn-http-send" class="btn-primary" style="width: auto; padding: 0.55rem 1.4rem;">
            <i class="ph ph-paper-plane-right"></i> Send Request
          </button>
        </div>
      </div>

      <!-- Grid de Configuración de la Petición y Respuesta -->
      <div class="http-grid">
        
        <!-- Panel Izquierdo: Configuración de Request (Headers, Body, Auth) -->
        <div class="panel-box http-box">
          <div class="panel-header" style="margin-bottom: 0.6rem;">
            <div class="segmented-control" style="font-size: 0.76rem;">
              <button id="tab-req-headers" class="segment-btn active" data-reqtab="headers">Headers (<span id="req-header-count">1</span>)</button>
              <button id="tab-req-body" class="segment-btn" data-reqtab="body">Body</button>
              <button id="tab-req-auth" class="segment-btn" data-reqtab="auth">Auth</button>
            </div>
          </div>

          <!-- Tab Content: Headers -->
          <div id="sec-req-headers" class="http-tab-content active">
            <div class="http-headers-builder">
              <div class="http-header-row-header">
                <span>Key (Nombre)</span>
                <span>Value (Valor)</span>
                <span style="width: 30px;"></span>
              </div>
              <div id="http-headers-list" class="http-headers-list">
                <!-- Inyectado dinámicamente -->
              </div>
              <button id="btn-add-header" class="btn-secondary" style="width: auto; padding: 0.35rem 0.75rem; margin-top: 0.6rem; font-size: 0.76rem;">
                <i class="ph ph-plus"></i> Agregar Header
              </button>
            </div>
          </div>

          <!-- Tab Content: Body -->
          <div id="sec-req-body" class="http-tab-content">
            <div style="display: flex; gap: 1rem; margin-bottom: 0.6rem;">
              <label class="diff-checkbox-label"><input type="radio" name="body-type" value="none"> <span>None</span></label>
              <label class="diff-checkbox-label"><input type="radio" name="body-type" value="json" checked> <span>JSON (raw)</span></label>
              <label class="diff-checkbox-label"><input type="radio" name="body-type" value="text"> <span>Text</span></label>
            </div>
            <textarea id="http-req-body-input" class="diff-textarea" style="height: 180px;" placeholder='{\n  "title": "Nuevo Post",\n  "body": "Contenido del post",\n  "userId": 1\n}' spellcheck="false"></textarea>
          </div>

          <!-- Tab Content: Auth -->
          <div id="sec-req-auth" class="http-tab-content">
            <div class="form-group">
              <label class="form-label" for="http-auth-type">Tipo de Autenticación</label>
              <select id="http-auth-type" class="form-control">
                <option value="none">Sin Autenticación (None)</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth (Usuario & Clave)</option>
              </select>
            </div>

            <div id="http-auth-bearer-container" class="form-group" style="display: none;">
              <label class="form-label" for="http-token-input">Token de Acceso (Bearer)</label>
              <input type="text" id="http-token-input" class="form-control" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...">
            </div>

            <div id="http-auth-basic-container" style="display: none;">
              <div class="form-group">
                <label class="form-label" for="http-basic-user">Usuario</label>
                <input type="text" id="http-basic-user" class="form-control" placeholder="admin">
              </div>
              <div class="form-group">
                <label class="form-label" for="http-basic-pass">Contraseña</label>
                <input type="password" id="http-basic-pass" class="form-control" placeholder="••••••••">
              </div>
            </div>
          </div>

        </div>

        <!-- Panel Derecho: Respuesta del Servidor (Status, Time, Headers, Body) -->
        <div class="panel-box http-box">
          <div class="panel-header" style="margin-bottom: 0.6rem; justify-content: space-between; flex-wrap: wrap;">
            
            <div class="segmented-control" style="font-size: 0.76rem;">
              <button id="tab-res-body" class="segment-btn active" data-restab="body">Response Body</button>
              <button id="tab-res-headers" class="segment-btn" data-restab="headers">Headers</button>
            </div>

            <!-- Métricas de Respuesta (Status Code + Tiempo + Tamaño) -->
            <div id="http-res-metrics" class="http-metrics-bar" style="display: none;">
              <span id="http-status-badge" class="badge badge-activo">200 OK</span>
              <span id="http-res-time" class="json-stats-pill"><i class="ph ph-clock"></i> 0 ms</span>
              <span id="http-res-size" class="json-stats-pill"><i class="ph ph-hard-drives"></i> 0 B</span>
            </div>

          </div>

          <!-- Body de la Respuesta -->
          <div id="sec-res-body" class="http-tab-content active">
            <div id="http-res-body-container">
              <pre id="http-res-body-code" class="json-code-highlighter"><span style="color:var(--text-dim);">Haz clic en 'Send Request' o prueba una API pública para ver la respuesta...</span></pre>
            </div>
          </div>

          <!-- Headers de la Respuesta -->
          <div id="sec-res-headers" class="http-tab-content">
            <div id="http-res-headers-container" class="table-responsive" style="max-height: 230px;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Header</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody id="http-res-headers-tbody">
                  <tr><td colspan="2" class="empty-state" style="padding: 1.5rem;">Ejecuta una petición para ver los encabezados de respuesta.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;

  setupHttpClientEvents();
}

/* ==========================================================================
   LÓGICA Y EJECUCIÓN DEL REST HTTP CLIENT
   ========================================================================== */

let defaultHeaders = [
  { key: "Content-Type", value: "application/json", active: true }
];

function setupHttpClientEvents() {
  // Pestañas de Request (Headers, Body, Auth)
  const tabReqHeaders = document.getElementById("tab-req-headers");
  const tabReqBody = document.getElementById("tab-req-body");
  const tabReqAuth = document.getElementById("tab-req-auth");

  const secReqHeaders = document.getElementById("sec-req-headers");
  const secReqBody = document.getElementById("sec-req-body");
  const secReqAuth = document.getElementById("sec-req-auth");

  tabReqHeaders.addEventListener("click", () => {
    tabReqHeaders.classList.add("active");
    tabReqBody.classList.remove("active");
    tabReqAuth.classList.remove("active");
    secReqHeaders.classList.add("active");
    secReqBody.classList.remove("active");
    secReqAuth.classList.remove("active");
  });

  tabReqBody.addEventListener("click", () => {
    tabReqBody.classList.add("active");
    tabReqHeaders.classList.remove("active");
    tabReqAuth.classList.remove("active");
    secReqBody.classList.add("active");
    secReqHeaders.classList.remove("active");
    secReqAuth.classList.remove("active");
  });

  tabReqAuth.addEventListener("click", () => {
    tabReqAuth.classList.add("active");
    tabReqHeaders.classList.remove("active");
    tabReqBody.classList.remove("active");
    secReqAuth.classList.add("active");
    secReqHeaders.classList.remove("active");
    secReqBody.classList.remove("active");
  });

  // Pestañas de Response (Body vs Headers)
  const tabResBody = document.getElementById("tab-res-body");
  const tabResHeaders = document.getElementById("tab-res-headers");
  const secResBody = document.getElementById("sec-res-body");
  const secResHeaders = document.getElementById("sec-res-headers");

  tabResBody.addEventListener("click", () => {
    tabResBody.classList.add("active");
    tabResHeaders.classList.remove("active");
    secResBody.classList.add("active");
    secResHeaders.classList.remove("active");
  });

  tabResHeaders.addEventListener("click", () => {
    tabResHeaders.classList.add("active");
    tabResBody.classList.remove("active");
    secResHeaders.classList.add("active");
    secResBody.classList.remove("active");
  });

  // Renderizar Lista de Headers
  renderHeaderRows();

  document.getElementById("btn-add-header").addEventListener("click", () => {
    defaultHeaders.push({ key: "", value: "", active: true });
    renderHeaderRows();
  });

  // Auth Type Selector
  const authSelect = document.getElementById("http-auth-type");
  const bearerBox = document.getElementById("http-auth-bearer-container");
  const basicBox = document.getElementById("http-auth-basic-container");

  authSelect.addEventListener("change", () => {
    const val = authSelect.value;
    bearerBox.style.display = val === "bearer" ? "block" : "none";
    basicBox.style.display = val === "basic" ? "block" : "none";
  });

  // Presets
  document.getElementById("btn-http-preset-json").addEventListener("click", () => {
    document.getElementById("http-method-select").value = "GET";
    document.getElementById("http-url-input").value = "https://jsonplaceholder.typicode.com/posts/1";
    executeHttpRequest();
  });

  document.getElementById("btn-http-preset-github").addEventListener("click", () => {
    document.getElementById("http-method-select").value = "GET";
    document.getElementById("http-url-input").value = "https://api.github.com/users/octocat";
    executeHttpRequest();
  });

  document.getElementById("btn-http-preset-httpbin").addEventListener("click", () => {
    document.getElementById("http-method-select").value = "GET";
    document.getElementById("http-url-input").value = "https://httpbin.org/get";
    executeHttpRequest();
  });

  // Send Request
  document.getElementById("btn-http-send").addEventListener("click", executeHttpRequest);
}

function renderHeaderRows() {
  const container = document.getElementById("http-headers-list");
  const headerCountSpan = document.getElementById("req-header-count");
  if (!container) return;

  if (headerCountSpan) headerCountSpan.textContent = defaultHeaders.length;

  container.innerHTML = defaultHeaders.map((h, idx) => `
    <div class="http-header-row">
      <input type="text" class="form-control header-key-input" value="${escapeHTML(h.key)}" placeholder="Key (ej. Authorization)" data-idx="${idx}">
      <input type="text" class="form-control header-val-input" value="${escapeHTML(h.value)}" placeholder="Value (ej. Bearer xyz...)" data-idx="${idx}">
      <button class="btn-icon-danger btn-remove-header" data-idx="${idx}" title="Eliminar header"><i class="ph ph-x"></i></button>
    </div>
  `).join("");

  // Re-vincular eventos
  container.querySelectorAll(".header-key-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const idx = parseInt(e.target.getAttribute("data-idx"), 10);
      defaultHeaders[idx].key = e.target.value;
    });
  });

  container.querySelectorAll(".header-val-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const idx = parseInt(e.target.getAttribute("data-idx"), 10);
      defaultHeaders[idx].value = e.target.value;
    });
  });

  container.querySelectorAll(".btn-remove-header").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-idx"), 10);
      defaultHeaders.splice(idx, 1);
      renderHeaderRows();
    });
  });
}

async function executeHttpRequest() {
  const url = document.getElementById("http-url-input").value.trim();
  const method = document.getElementById("http-method-select").value;
  const btnSend = document.getElementById("btn-http-send");

  const resBodyCode = document.getElementById("http-res-body-code");
  const metricsBar = document.getElementById("http-res-metrics");
  const statusBadge = document.getElementById("http-status-badge");
  const timeSpan = document.getElementById("http-res-time");
  const sizeSpan = document.getElementById("http-res-size");
  const headersTbody = document.getElementById("http-res-headers-tbody");

  if (!url) {
    alert("Por favor ingresa una URL válida.");
    return;
  }

  btnSend.disabled = true;
  btnSend.innerHTML = `<i class="ph ph-spinner spinner"></i> Enviando...`;
  if (resBodyCode) resBodyCode.innerHTML = `<span style="color:var(--text-dim);">Cargando respuesta del servidor...</span>`;

  const headers = {};

  // Agregar Headers definidos
  defaultHeaders.forEach(h => {
    if (h.key.trim() && h.value.trim()) {
      headers[h.key.trim()] = h.value.trim();
    }
  });

  // Autenticación
  const authType = document.getElementById("http-auth-type").value;
  if (authType === "bearer") {
    const token = document.getElementById("http-token-input").value.trim();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  } else if (authType === "basic") {
    const user = document.getElementById("http-basic-user").value.trim();
    const pass = document.getElementById("http-basic-pass").value.trim();
    if (user || pass) {
      const b64 = btoa(`${user}:${pass}`);
      headers["Authorization"] = `Basic ${b64}`;
    }
  }

  // Body de la Petición
  let body = null;
  const bodyType = document.querySelector('input[name="body-type"]:checked')?.value || "none";
  if (method !== "GET" && method !== "HEAD" && bodyType !== "none") {
    const bodyInput = document.getElementById("http-req-body-input").value;
    body = bodyInput;
  }

  const startTime = performance.now();

  try {
    const options = {
      method: method,
      headers: headers
    };

    if (body) {
      options.body = body;
    }

    const response = await fetch(url, options);
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    const status = response.status;
    const statusText = response.statusText || getHttpStatusText(status);

    // Formatear Badge de Estado
    statusBadge.textContent = `${status} ${statusText}`;
    if (status >= 200 && status < 300) {
      statusBadge.className = "badge badge-activo";
    } else if (status >= 400 && status < 500) {
      statusBadge.className = "badge badge-pendiente";
    } else {
      statusBadge.className = "badge badge-inactivo";
    }

    timeSpan.innerHTML = `<i class="ph ph-clock"></i> ${duration} ms`;

    // Procesar Headers de Respuesta
    const resHeadersList = [];
    response.headers.forEach((val, key) => {
      resHeadersList.push({ key, val });
    });

    if (headersTbody) {
      headersTbody.innerHTML = resHeadersList.map(h => `
        <tr>
          <td style="font-weight:600; color:var(--accent-primary);">${escapeHTML(h.key)}</td>
          <td>${escapeHTML(h.val)}</td>
        </tr>
      `).join("");
    }

    // Procesar Body de Respuesta
    const textData = await response.text();
    const sizeBytes = new Blob([textData]).size;
    sizeSpan.innerHTML = `<i class="ph ph-hard-drives"></i> ${formatBytes(sizeBytes)}`;

    const resBodyCode = document.getElementById("http-res-body-code");
    if (resBodyCode) {
      try {
        const jsonObj = JSON.parse(textData);
        resBodyCode.innerHTML = highlightJsonSyntax(jsonObj);
      } catch (e) {
        resBodyCode.textContent = textData;
      }
    }

    metricsBar.style.display = "flex";

  } catch (err) {
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    statusBadge.textContent = "Error de Conexión / CORS";
    statusBadge.className = "badge badge-inactivo";
    timeSpan.innerHTML = `<i class="ph ph-clock"></i> ${duration} ms`;
    sizeSpan.innerHTML = `<i class="ph ph-hard-drives"></i> 0 B`;
    metricsBar.style.display = "flex";

    const resBodyCode = document.getElementById("http-res-body-code");
    if (resBodyCode) {
      resBodyCode.innerHTML = `<span style="color:var(--accent-rose);">✕ Error al realizar la petición Fetch:\n${escapeHTML(err.message)}\n\nNota: Es posible que la API no permita CORS (Cross-Origin Resource Sharing) desde el navegador.</span>`;
    }
  } finally {
    btnSend.disabled = false;
    btnSend.innerHTML = `<i class="ph ph-paper-plane-right"></i> Send Request`;
  }
}

/**
 * Resaltado sintáctico de JSON para dar colores distintos a claves y valores
 */
function highlightJsonSyntax(json) {
  let str = typeof json !== "string" ? JSON.stringify(json, null, 2) : json;
  str = escapeHTML(str);

  return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = "json-hl-number";
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = "json-hl-key";
      } else {
        cls = "json-hl-string";
      }
    } else if (/true|false/.test(match)) {
      cls = "json-hl-boolean";
    } else if (/null/.test(match)) {
      cls = "json-hl-null";
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

function getHttpStatusText(code) {
  const codes = {
    200: "OK", 201: "Created", 204: "No Content",
    400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found",
    500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable"
  };
  return codes[code] || "Response";
}
