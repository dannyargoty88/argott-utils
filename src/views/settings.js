/**
 * Settings View - En Desarrollo / Under Development
 */

function renderSettingsView(container) {
  const appName = typeof APP_NAME !== "undefined" ? APP_NAME : "Argott Utils";

  container.innerHTML = `
    <div class="panel-box" style="align-items: center; justify-content: center; text-align: center; min-height: 480px; padding: 3rem 1.5rem;">
      
      <div style="max-width: 480px; display: flex; flex-direction: column; align-items: center; gap: 1rem; animation: floatUp 0.5s ease-out;">
        
        <div style="width: 80px; height: 80px; border-radius: 20px; background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.25); display: flex; align-items: center; justify-content: center; color: var(--accent-primary); font-size: 2.8rem; box-shadow: 0 10px 25px var(--accent-glow);">
          <i class="ph ph-gear-six"></i>
        </div>

        <div class="welcome-badge" style="margin-bottom: 0;">
          <i class="ph ph-wrench"></i> Módulo en Desarrollo
        </div>

        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-main); line-height: 1.3;">
          Configuración <span class="gradient-text">${escapeHTML(appName)}</span>
        </h2>

        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
          Estamos trabajando en la implementación de este módulo. Próximamente podrás gestionar tus preferencias globales, personalización avanzada y opciones del sistema.
        </p>

        <button id="btn-settings-back-home" class="btn-primary" style="width: auto; padding: 0.65rem 1.4rem; margin-top: 0.5rem; font-size: 0.86rem;">
          <i class="ph ph-house"></i> Volver al Inicio
        </button>

      </div>

    </div>
  `;

  const btnBack = document.getElementById("btn-settings-back-home");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      if (window.argottApp) {
        window.argottApp.navigateTo("dashboard");

        // Sincronizar active en el sidebar
        const sidebarItems = document.querySelectorAll(".sidebar-nav-item");
        sidebarItems.forEach(item => {
          if (item.getAttribute("data-view") === "dashboard") {
            sidebarItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
          }
        });
      }
    });
  }
}
