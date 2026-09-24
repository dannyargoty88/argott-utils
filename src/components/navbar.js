/**
 * Navbar Component - Argott Utils
 * Renderiza el encabezado superior con botón de cambio de tema y botón de cierre de sesión.
 */

class Navbar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onLogout = options.onLogout;
    this.onToggleTheme = options.onToggleTheme;

    this.render();
    this.setupEvents();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-muted);">
        &nbsp;
      </div>
      <div class="nav-actions">
        <!-- Botón Redondo Cambiar Tema (Claro / Oscuro) -->
        <button id="btn-theme-toggle" class="btn-icon-round" title="Cambiar Tema (Claro / Oscuro)">
          <i class="ph ph-moon"></i>
        </button>

        <!-- Botón Redondo Cerrar Sesión -->
        <button id="btn-logout" class="btn-icon-round btn-icon-round-danger" title="Cerrar Sesión">
          <i class="ph ph-sign-out"></i>
        </button>
      </div>
    `;
  }

  setupEvents() {
    const btnTheme = document.getElementById("btn-theme-toggle");
    const btnLogout = document.getElementById("btn-logout");

    if (btnTheme && this.onToggleTheme) {
      btnTheme.addEventListener("click", () => this.onToggleTheme());
    }

    if (btnLogout && this.onLogout) {
      btnLogout.addEventListener("click", () => this.onLogout());
    }
  }

  updateThemeIcon(theme) {
    const btnTheme = document.getElementById("btn-theme-toggle");
    if (!btnTheme) return;
    const icon = btnTheme.querySelector("i");
    if (icon) {
      icon.className = theme === "dark" ? "ph ph-sun" : "ph ph-moon";
    }
  }
}
