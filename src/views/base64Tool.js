/**
 * Base64 Tool View - Argott Utils
 * Permite Codificar (Encode) y Decodificar (Decode) Texto y Archivos a/desde Base64.
 * Soporta codificación UTF-8 segura, variante URL-Safe, vista previa de imágenes y descarga directa.
 * Desarrollado con Vanilla HTML5, CSS3 y JavaScript ES6+.
 */

function renderBase64ToolView(container) {
  container.innerHTML = `
    <div class="base64-tool-container">
      
      <!-- Encabezado de la Vista -->
      <div class="panel-box">
        <div class="panel-header" style="justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="panel-title" style="font-size: 1.25rem;">
              <i class="ph ph-binary" style="color: var(--accent-primary);"></i> Base64 Encoder & Decoder
            </h2>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Codifica y decodifica texto o archivos binarizados en formato Base64 (estándar y URL-Safe).
            </p>
          </div>

          <!-- Pestañas (Texto vs Archivos) -->
          <div class="segmented-control">
            <button id="tab-b64-text" class="segment-btn active" data-tab="text">
              <i class="ph ph-text-t"></i> Texto Base64
            </button>
            <button id="tab-b64-file" class="segment-btn" data-tab="file">
              <i class="ph ph-file-arrow-up"></i> Archivos Base64
            </button>
          </div>
        </div>
      </div>

      <!-- Banner de Notificación -->
      <div id="b64-status-banner" class="json-status-banner" style="display: none;"></div>

      <!-- ==========================================================================
           SECCIÓN 1: TEXTO BASE64 (ENCODE / DECODE)
           ========================================================================== -->
      <div id="section-b64-text" class="b64-tab-content active">
        
        <!-- Toolbar -->
        <div class="panel-box b64-toolbar-box">
          <div class="json-toolbar">
            <div class="json-actions-left">
              <button id="btn-b64-encode-text" class="btn-primary" style="width: auto; padding: 0.45rem 1rem;">
                <i class="ph ph-arrow-right"></i> Codificar a Base64 (Encode)
              </button>

              <button id="btn-b64-decode-text" class="btn-secondary" style="width: auto; padding: 0.45rem 1rem;">
                <i class="ph ph-arrow-left"></i> Decodificar desde Base64 (Decode)
              </button>

              <label class="diff-checkbox-label" style="margin-left: 0.5rem;">
                <input type="checkbox" id="chk-b64-urlsafe">
                <span>URL-Safe (RFC 4648)</span>
              </label>
            </div>

            <div class="json-actions-right">
              <button id="btn-b64-swap-text" class="btn-secondary" style="width: auto; padding: 0.45rem 0.8rem;" title="Intercambiar Entrada y Salida">
                <i class="ph ph-arrows-down-up"></i> Intercambiar
              </button>
              <button id="btn-b64-clear-text" class="btn-icon-action" title="Limpiar todo">
                <i class="ph ph-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Grid de Texto -->
        <div class="json-editor-grid">
          
          <!-- Entrada de Texto -->
          <div class="panel-box json-box">
            <div class="json-box-header">
              <span class="json-box-title"><i class="ph ph-pencil-simple"></i> Texto de Entrada</span>
              <span id="b64-input-len" class="json-stats-pill">0 caracteres</span>
            </div>
            <textarea id="b64-text-input" class="diff-textarea json-textarea" placeholder="Escribe o pega texto plano o cadena Base64 aquí..." spellcheck="false"></textarea>
          </div>

          <!-- Resultado Base64 -->
          <div class="panel-box json-box">
            <div class="json-box-header">
              <span class="json-box-title"><i class="ph ph-output"></i> Resultado</span>
              <div class="json-actions-right">
                <button id="btn-b64-copy-output" class="btn-secondary" style="width: auto; padding: 0.25rem 0.6rem; font-size: 0.74rem;">
                  <i class="ph ph-copy"></i> Copiar
                </button>
              </div>
            </div>
            <textarea id="b64-text-output" class="diff-textarea json-textarea" readonly placeholder="El resultado codificado o decodificado aparecerá aquí..." spellcheck="false"></textarea>
          </div>

        </div>

      </div>

      <!-- ==========================================================================
           SECCIÓN 2: ARCHIVOS BASE64 (ENCODE / DECODE ARCHIVO)
           ========================================================================== -->
      <div id="section-b64-file" class="b64-tab-content">
        
        <div class="json-editor-grid">
          
          <!-- Archivo -> Base64 (Encode) -->
          <div class="panel-box json-box">
            <div class="panel-header">
              <h3 class="panel-title" style="font-size: 1.05rem;">
                <i class="ph ph-upload-simple" style="color: var(--accent-primary);"></i> Convertir Archivo a Base64
              </h3>
            </div>

            <div class="b64-dropzone" id="b64-dropzone">
              <i class="ph ph-cloud-arrow-up" style="font-size: 2.2rem; color: var(--accent-primary);"></i>
              <p style="font-weight: 600; margin-top: 0.4rem;">Arrastra un archivo aquí o haz clic para examinar</p>
              <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.2rem;">Imágenes, PDF, Documentos, Audios, etc.</p>
              <input type="file" id="b64-file-input" hidden>
            </div>

            <div id="b64-file-info" class="b64-file-info" style="display: none;">
              <i class="ph ph-file"></i>
              <span id="b64-filename">archivo.ext</span>
              <span id="b64-filesize" class="json-stats-pill">0 KB</span>
            </div>

            <div style="margin-top: 0.75rem;">
              <textarea id="b64-file-result-area" class="diff-textarea" style="height: 140px;" readonly placeholder="La cadena Base64 / Data URI del archivo aparecerá aquí..." spellcheck="false"></textarea>
            </div>

            <div style="display: flex; gap: 0.6rem; margin-top: 0.75rem;">
              <button id="btn-copy-file-b64" class="btn-primary" style="flex: 1; padding: 0.45rem;">
                <i class="ph ph-copy"></i> Copiar Base64
              </button>
            </div>
          </div>

          <!-- Base64 -> Archivo / Vista Previa (Decode) -->
          <div class="panel-box json-box">
            <div class="panel-header">
              <h3 class="panel-title" style="font-size: 1.05rem;">
                <i class="ph ph-download-simple" style="color: var(--accent-emerald);"></i> Decodificar Base64 a Archivo
              </h3>
            </div>

            <textarea id="b64-str-to-file-input" class="diff-textarea" style="height: 120px;" placeholder="Pega una cadena Base64 o Data URI (ej. data:image/png;base64,...)" spellcheck="false"></textarea>

            <!-- Selector de Tipo de Archivo -->
            <div style="margin-top: 0.6rem; display: flex; align-items: center; gap: 0.6rem;">
              <label class="diff-option-label" for="select-b64-mime" style="white-space: nowrap;">Tipo de Archivo / Formato:</label>
              <select id="select-b64-mime" class="form-control" style="font-size: 0.8rem; padding: 0.35rem 0.6rem;">
                <option value="auto">Auto-detectar (si incluye data:...)</option>
                <option value="image/png">Imagen PNG (.png)</option>
                <option value="image/jpeg">Imagen JPG (.jpg)</option>
                <option value="image/svg+xml">Imagen Vectorial SVG (.svg)</option>
                <option value="image/gif">Imagen Animada GIF (.gif)</option>
                <option value="application/pdf">Documento PDF (.pdf)</option>
                <option value="text/html">Documento HTML (.html)</option>
                <option value="text/plain">Texto Plano (.txt)</option>
                <option value="audio/mp3">Audio MP3 (.mp3)</option>
                <option value="video/mp4">Video MP4 (.mp4)</option>
              </select>
            </div>

            <div style="display: flex; gap: 0.6rem; margin-top: 0.75rem; flex-wrap: wrap;">
              <button id="btn-preview-b64-media" class="btn-secondary" style="flex: 1; padding: 0.45rem;">
                <i class="ph ph-eye"></i> Vista Previa
              </button>
              <button id="btn-download-b64-file" class="btn-primary" style="flex: 1; padding: 0.45rem;">
                <i class="ph ph-download-simple"></i> Descargar Archivo
              </button>
            </div>

            <!-- Contenedor Vista Previa Media -->
            <div id="b64-media-preview-container" class="b64-preview-box" style="display: none;">
              <div id="b64-preview-content"></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;

  setupBase64ToolEvents();
}

/* ==========================================================================
   LÓGICA BASE64 ENCODER / DECODER
   ========================================================================== */

function setupBase64ToolEvents() {
  const tabText = document.getElementById("tab-b64-text");
  const tabFile = document.getElementById("tab-b64-file");
  const secText = document.getElementById("section-b64-text");
  const secFile = document.getElementById("section-b64-file");

  tabText.addEventListener("click", () => {
    tabText.classList.add("active");
    tabFile.classList.remove("active");
    secText.classList.add("active");
    secFile.classList.remove("active");
  });

  tabFile.addEventListener("click", () => {
    tabFile.classList.add("active");
    tabText.classList.remove("active");
    secFile.classList.add("active");
    secText.classList.remove("active");
  });

  // Codificar / Decodificar Texto
  const inputArea = document.getElementById("b64-text-input");
  const outputArea = document.getElementById("b64-text-output");
  const btnEncodeText = document.getElementById("btn-b64-encode-text");
  const btnDecodeText = document.getElementById("btn-b64-decode-text");
  const chkUrlSafe = document.getElementById("chk-b64-urlsafe");
  const btnSwapText = document.getElementById("btn-b64-swap-text");
  const btnClearText = document.getElementById("btn-b64-clear-text");
  const btnCopyOutput = document.getElementById("btn-b64-copy-output");
  const inputLenPill = document.getElementById("b64-input-len");

  inputArea.addEventListener("input", () => {
    if (inputLenPill) inputLenPill.textContent = `${inputArea.value.length} caracteres`;
  });

  btnEncodeText.addEventListener("click", () => {
    const raw = inputArea.value;
    if (!raw) {
      showB64Status("Ingresa texto para codificar en Base64.", "error");
      return;
    }
    try {
      const isUrlSafe = chkUrlSafe.checked;
      outputArea.value = encodeUtf8ToBase64(raw, isUrlSafe);
      showB64Status("✓ Texto codificado a Base64 con éxito", "success");
    } catch (err) {
      showB64Status(`✕ Error al codificar: ${err.message}`, "error");
    }
  });

  btnDecodeText.addEventListener("click", () => {
    const raw = inputArea.value.trim();
    if (!raw) {
      showB64Status("Ingresa una cadena Base64 para decodificar.", "error");
      return;
    }
    try {
      outputArea.value = decodeBase64ToUtf8(raw);
      showB64Status("✓ Cadena Base64 decodificada con éxito", "success");
    } catch (err) {
      showB64Status(`✕ Error al decodificar Base64: ${err.message}`, "error");
    }
  });

  btnSwapText.addEventListener("click", () => {
    const temp = inputArea.value;
    inputArea.value = outputArea.value;
    outputArea.value = temp;
    if (inputLenPill) inputLenPill.textContent = `${inputArea.value.length} caracteres`;
  });

  btnClearText.addEventListener("click", () => {
    inputArea.value = "";
    outputArea.value = "";
    if (inputLenPill) inputLenPill.textContent = "0 caracteres";
    hideB64Status();
  });

  btnCopyOutput.addEventListener("click", () => {
    if (!outputArea.value) return;
    navigator.clipboard.writeText(outputArea.value).then(() => {
      showB64Status("✓ Copiado al portapapeles", "success");
    });
  });

  // Archivo -> Base64
  const dropzone = document.getElementById("b64-dropzone");
  const fileInput = document.getElementById("b64-file-input");
  const fileResultArea = document.getElementById("b64-file-result-area");
  const btnCopyFileB64 = document.getElementById("btn-copy-file-b64");
  const fileInfoBox = document.getElementById("b64-file-info");
  const fileNameSpan = document.getElementById("b64-filename");
  const fileSizeSpan = document.getElementById("b64-filesize");

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  });

  function processSelectedFile(file) {
    if (!file) return;
    fileNameSpan.textContent = file.name;
    fileSizeSpan.textContent = formatBytes(file.size);
    fileInfoBox.style.display = "flex";

    const reader = new FileReader();
    reader.onload = (evt) => {
      fileResultArea.value = evt.target.result;
      showB64Status(`✓ Archivo '${file.name}' binarizado a Base64 Data URI`, "success");
    };
    reader.readAsDataURL(file);
  }

  btnCopyFileB64.addEventListener("click", () => {
    if (!fileResultArea.value) return;
    navigator.clipboard.writeText(fileResultArea.value).then(() => {
      showB64Status("✓ Cadena Base64 del archivo copiada al portapapeles", "success");
    });
  });

  // Base64 -> Descargar Archivo / Vista Previa
  const strFileInput = document.getElementById("b64-str-to-file-input");
  const selectMime = document.getElementById("select-b64-mime");
  const btnPreview = document.getElementById("btn-preview-b64-media");
  const btnDownloadFile = document.getElementById("btn-download-b64-file");
  const previewBox = document.getElementById("b64-media-preview-container");
  const previewContent = document.getElementById("b64-preview-content");

  function buildDataUri(rawStr) {
    let clean = rawStr.trim();
    if (clean.startsWith("data:")) return clean;

    const selectedType = selectMime ? selectMime.value : "auto";
    const mime = (selectedType && selectedType !== "auto") ? selectedType : "image/png";
    return `data:${mime};base64,${clean}`;
  }

  btnPreview.addEventListener("click", () => {
    const raw = strFileInput.value.trim();
    if (!raw) {
      showB64Status("Pega una cadena Data URI o Base64 para previsualizar.", "error");
      return;
    }

    try {
      const dataUri = buildDataUri(raw);
      const mimeMatch = dataUri.match(/^data:(.*?);base64,/);
      const mime = mimeMatch ? mimeMatch[1] : "image/png";

      if (mime.startsWith("image/")) {
        previewContent.innerHTML = `<img src="${dataUri}" style="max-width: 100%; max-height: 260px; border-radius: 6px; object-fit: contain;" alt="Vista previa Imagen">`;
      } else if (mime === "application/pdf") {
        previewContent.innerHTML = `<embed src="${dataUri}" type="application/pdf" width="100%" height="320px" style="border-radius: 6px;">`;
      } else if (mime.startsWith("audio/")) {
        previewContent.innerHTML = `<audio controls src="${dataUri}" style="width: 100%; margin-top: 0.5rem;"></audio>`;
      } else if (mime.startsWith("video/")) {
        previewContent.innerHTML = `<video controls src="${dataUri}" style="max-width: 100%; max-height: 260px; border-radius: 6px;"></video>`;
      } else if (mime === "text/html" || mime === "text/plain") {
        previewContent.innerHTML = `<iframe src="${dataUri}" style="width: 100%; height: 260px; background: #ffffff; border-radius: 6px; border: 1px solid var(--border-light);"></iframe>`;
      } else {
        previewContent.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted);">Vista previa no disponible para el tipo <code>${mime}</code>. Usa la opción Descargar Archivo.</p>`;
      }

      previewBox.style.display = "block";
      showB64Status(`✓ Vista previa generada como (${mime})`, "success");
    } catch (e) {
      showB64Status(`Error al generar la vista previa: ${e.message}`, "error");
    }
  });

  btnDownloadFile.addEventListener("click", () => {
    const raw = strFileInput.value.trim();
    if (!raw) {
      showB64Status("Ingresa una cadena Base64 para descargar como archivo.", "error");
      return;
    }

    try {
      const dataUri = buildDataUri(raw);
      let filename = `archivo_decodificado_${new Date().getTime()}`;

      const mimeMatch = dataUri.match(/^data:(.*?);base64,/);
      if (mimeMatch) {
        const ext = getExtensionFromMime(mimeMatch[1]);
        filename += `.${ext}`;
      }

      const a = document.createElement("a");
      a.href = dataUri;
      a.download = filename;
      a.click();
      showB64Status(`✓ Descarga iniciada como '${filename}'`, "success");
    } catch (err) {
      showB64Status(`✕ Error al procesar descarga: ${err.message}`, "error");
    }
  });
}

function encodeUtf8ToBase64(str, isUrlSafe) {
  const bytes = new TextEncoder().encode(str);
  let binStr = "";
  for (let i = 0; i < bytes.length; i++) {
    binStr += String.fromCharCode(bytes[i]);
  }
  let base64 = btoa(binStr);
  if (isUrlSafe) {
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return base64;
}

function decodeBase64ToUtf8(base64Str) {
  let str = base64Str.trim().replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  const binStr = atob(str);
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getExtensionFromMime(mime) {
  const map = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
    'application/json': 'json',
    'text/plain': 'txt',
    'text/html': 'html'
  };
  return map[mime] || 'bin';
}

function showB64Status(msg, type) {
  const banner = document.getElementById("b64-status-banner");
  if (!banner) return;
  banner.className = `json-status-banner banner-${type}`;
  banner.innerHTML = `<i class="ph ph-${type === "success" ? "check-circle" : "warning-circle"}"></i> <span>${msg}</span>`;
  banner.style.display = "flex";
}

function hideB64Status() {
  const banner = document.getElementById("b64-status-banner");
  if (banner) banner.style.display = "none";
}
