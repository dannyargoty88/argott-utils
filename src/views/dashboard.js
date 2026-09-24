/**
 * Welcome / Home View - Argott Utils
 * Pantalla principal de bienvenida moderna y elegante con accesos rápidos a las herramientas de desarrollo.
 */

function renderDashboardView(container) {
  const appName = typeof APP_NAME !== "undefined" ? APP_NAME : "Argott Utils";

  container.innerHTML = `
    <div class="welcome-container">
      
      <!-- Banner Hero Principal -->
      <div class="welcome-hero-card">
        <div class="welcome-hero-content">
          <div class="welcome-badge">
            <i class="ph ph-sparkle"></i> Plataforma de Desarrollo Argott
          </div>
          <h1 class="welcome-title">Bienvenido a <span class="gradient-text">${escapeHTML(appName)}</span></h1>
          <p class="welcome-description">
            Tu suite de herramientas de desarrollo integrada en el navegador. Accede rápidamente a los utilitarios de Git, JSON, JWT, Base64, SQL y Cliente REST con máxima velocidad y privacidad.
          </p>
          <div class="welcome-actions" style="display: flex; align-items: center; gap: 0.75rem; background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-light); padding: 0.6rem 1rem; border-radius: var(--radius-md); backdrop-filter: blur(8px); width: fit-content;">
            <i class="ph ph-clock" style="font-size: 1.3rem; color: var(--accent-primary);"></i>
            <div style="display: flex; flex-direction: column; text-align: left;">
              <span id="live-dashboard-date" style="font-size: 0.75rem; text-transform: capitalize; color: var(--text-muted); font-weight: 500; line-height: 1.2;">--</span>
              <span id="live-dashboard-time" style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); font-family: monospace; letter-spacing: 0.05em; line-height: 1.2;">--:--:--</span>
            </div>
          </div>
        </div>
        <div class="welcome-hero-graphic">
          <div class="graphic-circle circle-1"></div>
          <div class="graphic-circle circle-2"></div>
          <i class="ph ph-code-block graphic-icon"></i>
        </div>
      </div>

      <!-- Grid de Accesos Rápidos a las Herramientas -->
      <div class="welcome-section-header">
        <h2 class="welcome-section-title">
          <i class="ph ph-squares-four"></i> Herramientas de Desarrollo
        </h2>
        <span class="welcome-section-subtitle">Selecciona una herramienta para comenzar</span>
      </div>

      <div class="welcome-tools-grid">
        
        <!-- Tool 1: Git Diff -->
        <div class="tool-card" data-view="git-diff">
          <div class="tool-card-icon icon-git">
            <i class="ph ph-git-diff"></i>
          </div>
          <div class="tool-card-info">
            <h3>Git Diff Viewer</h3>
            <p>Comparación de código línea por línea y palabra por palabra con resaltado Myers LCS.</p>
          </div>
          <div class="tool-card-arrow">
            <i class="ph ph-arrow-right"></i>
          </div>
        </div>

        <!-- Tool 2: JSON Tools -->
        <div class="tool-card" data-view="json-tools">
          <div class="tool-card-icon icon-json">
            <i class="ph ph-brackets-curly"></i>
          </div>
          <div class="tool-card-info">
            <h3>JSON Tools</h3>
            <p>Formateador, minificador, validador de sintaxis, árbol interactivo y diff de claves.</p>
          </div>
          <div class="tool-card-arrow">
            <i class="ph ph-arrow-right"></i>
          </div>
        </div>

        <!-- Tool 3: JWT Decoder -->
        <div class="tool-card" data-view="jwt-decoder">
          <div class="tool-card-icon icon-jwt">
            <i class="ph ph-key"></i>
          </div>
          <div class="tool-card-info">
            <h3>JWT Decoder</h3>
            <p>Decodifica Tokens JWT (Header, Payload, Signature) y calcula su expiración de tiempo.</p>
          </div>
          <div class="tool-card-arrow">
            <i class="ph ph-arrow-right"></i>
          </div>
        </div>

        <!-- Tool 4: Base64 -->
        <div class="tool-card" data-view="base64-tool">
          <div class="tool-card-icon icon-base64">
            <i class="ph ph-binary"></i>
          </div>
          <div class="tool-card-info">
            <h3>Base64 Converter</h3>
            <p>Codifica/decodifica texto y archivos con soporte para vista previa directa de imágenes y documentos.</p>
          </div>
          <div class="tool-card-arrow">
            <i class="ph ph-arrow-right"></i>
          </div>
        </div>

        <!-- Tool 5: SQL Formatter -->
        <div class="tool-card" data-view="sql-formatter">
          <div class="tool-card-icon icon-sql">
            <i class="ph ph-database"></i>
          </div>
          <div class="tool-card-info">
            <h3>SQL Formatter</h3>
            <p>Embellecedor de consultas SQL con identación adaptable y minificado instantáneo.</p>
          </div>
          <div class="tool-card-arrow">
            <i class="ph ph-arrow-right"></i>
          </div>
        </div>

        <!-- Tool 6: REST HTTP Client -->
        <div class="tool-card" data-view="http-client">
          <div class="tool-card-icon icon-http">
            <i class="ph ph-globe-hemisphere-west"></i>
          </div>
          <div class="tool-card-info">
            <h3>REST HTTP Client</h3>
            <p>Ejecuta peticiones HTTP/REST (GET, POST, PUT, DELETE), custom headers y Bearer auth.</p>
          </div>
          <div class="tool-card-arrow">
            <i class="ph ph-arrow-right"></i>
          </div>
        </div>

        <!-- Tool 7: Code Converter -->
        <div class="tool-card" data-view="code-converter">
          <div class="tool-card-icon icon-jwt" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-primary);">
            <i class="ph ph-arrows-clockwise"></i>
          </div>
          <div class="tool-card-info">
            <h3>Code Converter</h3>
            <p>Transforma JSON y SQL a Go Structs, Interfaces TypeScript y esquemas estructurados.</p>
          </div>
          <div class="tool-card-arrow">
            <i class="ph ph-arrow-right"></i>
          </div>
        </div>

        <!-- Tool 8: Code Helper -->
        <div class="tool-card" data-view="code-helper">
          <div class="tool-card-icon icon-base64" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">
            <i class="ph ph-book-open"></i>
          </div>
          <div class="tool-card-info">
            <h3>Code Helper & Cheatsheets</h3>
            <p>Comandos y guías esenciales de Git y Docker estructurados con copiar en un clic.</p>
          </div>
          <div class="tool-card-arrow">
            <i class="ph ph-arrow-right"></i>
          </div>
        </div>

        <!-- Tool 9: View Icons -->
        <div class="tool-card" data-view="view-icons">
          <div class="tool-card-icon icon-git" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
            <i class="ph ph-squares-four"></i>
          </div>
          <div class="tool-card-info">
            <h3>View Icons (SVG Library)</h3>
            <p>Explorador visual del diccionario de iconos de Tailwind/Heroicons con copiado rápido de SVG y paths.</p>
          </div>
          <div class="tool-card-arrow">
            <i class="ph ph-arrow-right"></i>
          </div>
        </div>

      </div>

    </div>
  `;

  // Configurar eventos de navegación interactivos desde la pantalla de bienvenida
  setupWelcomeEvents();
}

let dashboardClockInterval = null;

function setupWelcomeEvents() {
  // Limpiar timer previo si existe
  if (dashboardClockInterval) {
    clearInterval(dashboardClockInterval);
    dashboardClockInterval = null;
  }

  // Función para actualizar fecha y hora
  const updateClock = () => {
    const dateEl = document.getElementById("live-dashboard-date");
    const timeEl = document.getElementById("live-dashboard-time");

    if (!dateEl || !timeEl) {
      if (dashboardClockInterval) clearInterval(dashboardClockInterval);
      return;
    }

    const now = new Date();

    // Formato de Fecha en Español (ej: Martes, 8 de Septiembre)
    const optionsDate = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = now.toLocaleDateString('es-ES', optionsDate);

    // Formato de Hora (HH:mm:ss AM/PM o 24h)
    const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    dateEl.textContent = dateStr;
    timeEl.textContent = timeStr;
  };

  // Actualizar inmediatamente y cada segundo
  updateClock();
  dashboardClockInterval = setInterval(updateClock, 1000);

  // Accesos directos desde las tarjetas de herramientas
  document.querySelectorAll(".tool-card").forEach(card => {
    card.addEventListener("click", () => {
      const targetView = card.getAttribute("data-view");
      if (targetView && window.argottApp) {
        window.argottApp.navigateTo(targetView);

        // Actualizar item activo en el sidebar
        const sidebarItems = document.querySelectorAll(".sidebar-nav-item");
        sidebarItems.forEach(item => {
          if (item.getAttribute("data-view") === targetView) {
            sidebarItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
          }
        });
      }
    });
  });
}
