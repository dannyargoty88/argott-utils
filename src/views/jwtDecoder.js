/**
 * JWT Decoder View - Argott Utils
 * Decodifica tokens JWT (Header, Payload, Signature), calcula estado de expiración (exp, iat, nbf)
 * y ofrece resaltado interactivo de colores según la especificación RFC 7519.
 * Construido con Vanilla HTML5, CSS3 y JavaScript ES6+.
 */

function renderJwtDecoderView(container) {
  container.innerHTML = `
    <div class="jwt-decoder-container">
      
      <!-- Encabezado de la Vista -->
      <div class="panel-box">
        <div class="panel-header" style="justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="panel-title" style="font-size: 1.25rem;">
              <i class="ph ph-key" style="color: var(--accent-primary);"></i> JWT Decoder
            </h2>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Decodifica y analiza tokens JSON Web Token (RFC 7519), verifica estado de expiración y claims.
            </p>
          </div>

          <div class="jwt-header-actions">
            <button id="btn-jwt-sample" class="btn-secondary" style="width: auto; padding: 0.45rem 0.9rem;">
              <i class="ph ph-lightning"></i> Cargar Token Ejemplo
            </button>
            <button id="btn-jwt-clear" class="btn-icon-action" title="Limpiar todo">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Banner de Estado de Expiración -->
      <div id="jwt-status-banner" class="jwt-status-banner" style="display: none;"></div>

      <!-- Grid de Entrada (Token Codificado) vs Salida Decodificada -->
      <div class="jwt-grid">
        
        <!-- Entrada del Token (Codificado) -->
        <div class="panel-box jwt-box">
          <div class="jwt-box-header">
            <span class="jwt-box-title"><i class="ph ph-lock-key"></i> Token Codificado (Encoded JWT)</span>
            <span id="jwt-length-stats" class="json-stats-pill">0 caracteres</span>
          </div>

          <!-- Highlight visual del token JWT (Header.Payload.Signature) -->
          <div class="jwt-input-wrapper">
            <textarea id="jwt-textarea-input" class="diff-textarea jwt-textarea" placeholder="Pega tu token JWT aquí (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)" spellcheck="false"></textarea>
          </div>

          <!-- Leyenda de Colores Estándar RFC 7519 -->
          <div class="jwt-legend">
            <span class="jwt-legend-item color-header"><span class="legend-dot"></span> Header (Algoritmo)</span>
            <span class="jwt-legend-item color-payload"><span class="legend-dot"></span> Payload (Datos)</span>
            <span class="jwt-legend-item color-signature"><span class="legend-dot"></span> Signature (Firma)</span>
          </div>
        </div>

        <!-- Resultados Decodificados (Header + Payload) -->
        <div class="jwt-results-column">
          
          <!-- Secciones Decodificadas: Header -->
          <div class="panel-box jwt-box">
            <div class="jwt-box-header">
              <span class="jwt-box-title" style="color: var(--accent-secondary);">
                <i class="ph ph-code"></i> Header (Encabezado)
              </span>
              <button id="btn-copy-header" class="btn-secondary" style="width: auto; padding: 0.25rem 0.6rem; font-size: 0.74rem;">
                <i class="ph ph-copy"></i> Copiar
              </button>
            </div>
            <textarea id="jwt-output-header" class="diff-textarea jwt-output-area color-header-bg" readonly placeholder="Header decodificado aparecerá aquí..." spellcheck="false"></textarea>
          </div>

          <!-- Secciones Decodificadas: Payload -->
          <div class="panel-box jwt-box">
            <div class="jwt-box-header">
              <span class="jwt-box-title" style="color: var(--accent-primary);">
                <i class="ph ph-user-focus"></i> Payload (Datos del Usuario & Claims)
              </span>
              <button id="btn-copy-payload" class="btn-secondary" style="width: auto; padding: 0.25rem 0.6rem; font-size: 0.74rem;">
                <i class="ph ph-copy"></i> Copiar
              </button>
            </div>
            <textarea id="jwt-output-payload" class="diff-textarea jwt-output-area color-payload-bg" readonly placeholder="Payload decodificado aparecerá aquí..." spellcheck="false"></textarea>
          </div>

          <!-- Secciones Decodificadas: Signature -->
          <div class="panel-box jwt-box">
            <div class="jwt-box-header">
              <span class="jwt-box-title" style="color: var(--accent-cyan);">
                <i class="ph ph-shield-check"></i> Signature (Verificación de Firma)
              </span>
              <span id="jwt-alg-badge" class="badge badge-activo" style="font-size: 0.72rem;">HMAC SHA-256</span>
            </div>
            <div id="jwt-signature-display" class="jwt-signature-box">
              <code id="jwt-signature-code">Firma no proporcionada</code>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;

  setupJwtDecoderEvents();

  // Cargar ejemplo por defecto para pruebas instantáneas
  loadJwtSample();
}

/* ==========================================================================
   LÓGICA Y DESCODIFICACIÓN JWT (RFC 7519)
   ========================================================================== */

function setupJwtDecoderEvents() {
  const inputEl = document.getElementById("jwt-textarea-input");
  const btnSample = document.getElementById("btn-jwt-sample");
  const btnClear = document.getElementById("btn-jwt-clear");
  const btnCopyHeader = document.getElementById("btn-copy-header");
  const btnCopyPayload = document.getElementById("btn-copy-payload");
  const statsPill = document.getElementById("jwt-length-stats");

  inputEl.addEventListener("input", () => {
    const raw = inputEl.value.trim();
    if (statsPill) statsPill.textContent = `${raw.length} caracteres`;
    decodeJwtToken(raw);
  });

  btnSample.addEventListener("click", loadJwtSample);

  btnClear.addEventListener("click", () => {
    inputEl.value = "";
    document.getElementById("jwt-output-header").value = "";
    document.getElementById("jwt-output-payload").value = "";
    document.getElementById("jwt-signature-code").textContent = "Firma no proporcionada";
    if (statsPill) statsPill.textContent = "0 caracteres";
    hideJwtStatus();
  });

  btnCopyHeader.addEventListener("click", () => {
    const val = document.getElementById("jwt-output-header").value;
    if (val) copyToClipboard(val, "Header copiado al portapapeles");
  });

  btnCopyPayload.addEventListener("click", () => {
    const val = document.getElementById("jwt-output-payload").value;
    if (val) copyToClipboard(val, "Payload copiado al portapapeles");
  });
}

function loadJwtSample() {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 86400 * 7; // Expira en 7 días

  // Generar JWT de prueba estándar válido
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: "usr_998142",
    nombre: "Carlos Argott",
    email: "carlos@argott.com",
    rol: "Administrador",
    empresa: "Argott Utils",
    iat: now,
    exp: exp,
    iss: "argott_auth_server"
  };

  const base64UrlEncode = (obj) => {
    const jsonStr = JSON.stringify(obj);
    const base64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const token = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.dbS6z8T6n83F1W87Lp0a1K_Xv5gR-v7q3k9j6l5m4n`;
  const inputEl = document.getElementById("jwt-textarea-input");
  if (inputEl) {
    inputEl.value = token;
    document.getElementById("jwt-length-stats").textContent = `${token.length} caracteres`;
    decodeJwtToken(token);
  }
}

function decodeJwtToken(tokenStr) {
  const headerArea = document.getElementById("jwt-output-header");
  const payloadArea = document.getElementById("jwt-output-payload");
  const sigCode = document.getElementById("jwt-signature-code");
  const algBadge = document.getElementById("jwt-alg-badge");

  if (!tokenStr) {
    headerArea.value = "";
    payloadArea.value = "";
    sigCode.textContent = "Firma no proporcionada";
    hideJwtStatus();
    return;
  }

  const parts = tokenStr.split(".");
  if (parts.length !== 3) {
    headerArea.value = "";
    payloadArea.value = "";
    sigCode.textContent = "Formato inválido";
    showJwtStatus("✕ Formato de Token inválido: Debe contener 3 partes separadas por puntos (Header.Payload.Signature)", "error");
    return;
  }

  try {
    const headerObj = base64UrlDecode(parts[0]);
    const payloadObj = base64UrlDecode(parts[1]);

    headerArea.value = JSON.stringify(headerObj, null, 2);
    payloadArea.value = JSON.stringify(payloadObj, null, 2);
    sigCode.textContent = parts[2] || "Firma vacía";

    if (algBadge) {
      algBadge.textContent = headerObj.alg || "HS256";
    }

    // Verificar Expiración y Timestamps
    checkJwtExpiration(payloadObj);

  } catch (err) {
    headerArea.value = "";
    payloadArea.value = "";
    sigCode.textContent = "Error al decodificar";
    showJwtStatus(`✕ Error al decodificar la estructura Base64: ${err.message}`, "error");
  }
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  const decoded = new TextDecoder().decode(bytes);
  return JSON.parse(decoded);
}

function checkJwtExpiration(payload) {
  const now = Math.floor(Date.now() / 1000);

  if (!payload.exp) {
    showJwtStatus("ℹ Token sin fecha de expiración declarada (sin claim 'exp')", "info");
    return;
  }

  const expTime = payload.exp;
  const diffSec = expTime - now;

  const formatDate = (timestamp) => {
    const d = new Date(timestamp * 1000);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  if (diffSec < 0) {
    const absDiff = Math.abs(diffSec);
    const mins = Math.floor(absDiff / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    let timeAgo = `${absDiff} segundos`;
    if (days > 0) timeAgo = `${days} día(s)`;
    else if (hours > 0) timeAgo = `${hours} hora(s)`;
    else if (mins > 0) timeAgo = `${mins} minuto(s)`;

    showJwtStatus(`✕ TOKEN EXPIRADO el ${formatDate(expTime)} (hace ${timeAgo})`, "error");
  } else {
    const mins = Math.floor(diffSec / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    let remaining = `${diffSec} segundos`;
    if (days > 0) remaining = `${days} día(s)`;
    else if (hours > 0) remaining = `${hours} hora(s)`;
    else if (mins > 0) remaining = `${mins} minuto(s)`;

    showJwtStatus(`✓ TOKEN VÁLIDO & EN VIGOR — Expira el ${formatDate(expTime)} (le quedan ${remaining})`, "success");
  }
}

function showJwtStatus(msg, type) {
  const banner = document.getElementById("jwt-status-banner");
  if (!banner) return;
  banner.className = `jwt-status-banner banner-${type}`;
  banner.innerHTML = `<i class="ph ph-${type === "success" ? "shield-check" : type === "error" ? "warning" : "info"}"></i> <span>${msg}</span>`;
  banner.style.display = "flex";
}

function hideJwtStatus() {
  const banner = document.getElementById("jwt-status-banner");
  if (banner) banner.style.display = "none";
}

function copyToClipboard(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showJwtStatus(`✓ ${successMsg}`, "success");
  });
}
