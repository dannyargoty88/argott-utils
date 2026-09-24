/**
 * Estructura de Navegación Centralizada del Sidebar
 * Permite gestionar todos los enlaces, grupos desplegables e íconos dinámicamente desde JavaScript.
 */
const SIDEBAR_MENU_SCHEMA = [
  {
    type: "link",
    view: "dashboard",
    label: "Inicio",
    icon: "ph-house",
    active: true
  },
  {
    type: "group",
    label: "Desarrollo",
    icon: "ph-code",
    open: true,
    items: [
      { view: "git-diff", label: "Git Diff", icon: "ph-git-diff" },
      { view: "json-tools", label: "JSON Tools", icon: "ph-brackets-curly" },
      { view: "jwt-decoder", label: "JWT Decoder", icon: "ph-key" },
      { view: "base64-tool", label: "Base64", icon: "ph-binary" },
      { view: "sql-formatter", label: "SQL Formatter", icon: "ph-database" },
      { view: "http-client", label: "HTTP Client", icon: "ph-globe-hemisphere-west" },
      { view: "code-converter", label: "Code Converter", icon: "ph-arrows-clockwise" },
      { view: "code-helper", label: "Code Helper", icon: "ph-book-open" },
      { view: "view-icons", label: "View Icons", icon: "ph-squares-four" }
    ]
  },
  {
    type: "link",
    view: "settings",
    label: "Configuración",
    icon: "ph-gear"
  }
];

class Sidebar {
  constructor(onViewChange) {
    this.sidebarEl = document.getElementById("app-sidebar");
    this.onViewChange = onViewChange;

    this.render();
    this.init();
  }

  /**
   * Renderiza dinámicamente todo el contenido del Sidebar (Header + Navegación)
   */
  render() {
    if (!this.sidebarEl) return;

    const appName = typeof APP_NAME !== "undefined" ? APP_NAME : "Argott Utils";

    const navHtml = SIDEBAR_MENU_SCHEMA.map(node => {
      if (node.type === "link") {
        const activeClass = node.active ? " active" : "";
        return `
          <a href="#" class="sidebar-nav-item${activeClass}" data-view="${node.view}" title="${node.label}">
            <i class="ph ${node.icon}"></i>
            <span class="nav-text">${node.label}</span>
          </a>
        `;
      } else if (node.type === "group") {
        const openClass = node.open ? " open" : "";
        const subitemsHtml = node.items.map(item => `
          <a href="#" class="sidebar-nav-item sidebar-submenu-item" data-view="${item.view}" title="${item.label}">
            <i class="ph ${item.icon}"></i>
            <span class="nav-text">${item.label}</span>
          </a>
        `).join("");

        return `
          <div class="sidebar-nav-group${openClass}">
            <button type="button" class="sidebar-nav-item sidebar-nav-dropdown-toggle" title="${node.label}">
              <i class="ph ${node.icon}"></i>
              <span class="nav-text">${node.label}</span>
              <i class="ph ph-caret-down nav-dropdown-icon"></i>
            </button>
            <div class="sidebar-submenu">
              ${subitemsHtml}
            </div>
          </div>
        `;
      }
      return "";
    }).join("");

    this.sidebarEl.innerHTML = `
      <div class="sidebar-header">
        <div id="sidebar-brand" class="sidebar-brand" title="Expandir menú">
          <img src="assets/images/logo.png" alt="Logo">
          <span class="brand-text">${escapeHTML(appName)}</span>
        </div>
        <button id="btn-toggle-sidebar" class="btn-toggle-sidebar" title="Colapsar / Expandir Menú">
          <i class="ph ph-caret-left"></i>
        </button>
      </div>

      <nav id="sidebar-nav" class="sidebar-nav">
        ${navHtml}
      </nav>
    `;
  }

  init() {
    this.toggleBtn = document.getElementById("btn-toggle-sidebar");
    this.brandEl = document.getElementById("sidebar-brand");
    this.navLinks = document.querySelectorAll(".sidebar-nav-item");

    // Restaurar estado de colapso guardado
    const isCollapsed = localStorage.getItem(STORAGE_KEY_SIDEBAR) === "true";
    if (isCollapsed) {
      this.sidebarEl.classList.add("collapsed");
    }

    // Event listener para el botón toggle
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggle());
    }

    // Event listener para al hacer clic en el logo/brand (re-expandir si está colapsado)
    if (this.brandEl) {
      this.brandEl.addEventListener("click", () => {
        if (this.sidebarEl.classList.contains("collapsed")) {
          this.toggle();
        }
      });
    }

    // Event listeners para toggles de grupo con submenú (ej. Desarrollo)
    const dropdownToggles = document.querySelectorAll(".sidebar-nav-dropdown-toggle");
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();

        // Si el menú está colapsado, expandirlo al hacer clic en un grupo
        if (this.sidebarEl.classList.contains("collapsed")) {
          this.toggle();
        }

        const group = toggle.closest(".sidebar-nav-group");
        if (group) {
          group.classList.toggle("open");
        }
      });
    });

    // Event listeners para enlaces navegables (aquellos que tienen data-view)
    this.navLinks.forEach(link => {
      const viewTarget = link.getAttribute("data-view");
      if (!viewTarget) return;

      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Desactivar todos los ítems navegables
        this.navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        // Si pertenece a un submenú, asegurar que el padre esté abierto
        const group = link.closest(".sidebar-nav-group");
        if (group) {
          group.classList.add("open");
        }

        if (this.onViewChange) {
          this.onViewChange(viewTarget);
        }
      });
    });
  }

  toggle() {
    this.sidebarEl.classList.toggle("collapsed");
    const collapsedNow = this.sidebarEl.classList.contains("collapsed");
    localStorage.setItem(STORAGE_KEY_SIDEBAR, collapsedNow);
  }
}
