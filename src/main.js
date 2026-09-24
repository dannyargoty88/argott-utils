/**
 * Main Application Orchestrator - Argott SPA
 */

class App {
  constructor() {
    this.loginScreenContainer = document.getElementById("login-screen");
    this.dashboardScreen = document.getElementById("dashboard-screen");
    this.mainContent = document.getElementById("main-content-view");
    this.sidebar = null;
    this.navbar = null;
    this.loginComponent = null;

    this.init();
  }

  init() {
    // Restaurar Tema
    this.initTheme();

    // Inicializar componente Navbar
    this.navbar = new Navbar("app-navbar", {
      onLogout: () => this.logout(),
      onToggleTheme: () => this.toggleTheme()
    });
    this.updateThemeIcon();

    // Inicializar componente LoginScreen
    this.loginComponent = new LoginScreen("login-screen", {
      onSuccess: () => this.checkAuth()
    });

    // Actualizar nombre dinámico de la empresa
    this.initBrandName();

    // Verificar sesión al inicio
    this.checkAuth();
  }

  initBrandName() {
    const brandTextEl = document.querySelector(".brand-text");
    const loginTitleEl = document.querySelector(".login-title");
    const name = typeof APP_NAME !== "undefined" ? APP_NAME : "Argott Utils";

    document.title = name;

    if (brandTextEl) brandTextEl.textContent = name;
    if (loginTitleEl) loginTitleEl.textContent = name;
  }

  initTheme() {
    const savedTheme = localStorage.getItem("argott_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("argott_theme", newTheme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const theme = document.documentElement.getAttribute("data-theme") || "dark";
    if (this.navbar) {
      this.navbar.updateThemeIcon(theme);
    }
  }

  checkAuth() {
    const isAuth = localStorage.getItem(STORAGE_KEY_AUTH) === "true";

    if (isAuth) {
      if (this.loginScreenContainer) this.loginScreenContainer.classList.remove("active");
      if (this.dashboardScreen) this.dashboardScreen.classList.add("active");

      // Inicializar Sidebar si no existe
      if (!this.sidebar) {
        this.sidebar = new Sidebar((viewName) => this.navigateTo(viewName));
      }

      // Cargar vista por defecto (Dashboard)
      this.navigateTo("dashboard");
    } else {
      if (this.dashboardScreen) this.dashboardScreen.classList.remove("active");
      if (this.loginScreenContainer) this.loginScreenContainer.classList.add("active");
    }
  }

  navigateTo(viewName) {
    if (!this.mainContent) return;

    if (viewName === "dashboard") {
      renderDashboardView(this.mainContent);
    } else if (viewName === "git-diff") {
      renderGitDiffView(this.mainContent);
    } else if (viewName === "json-tools") {
      renderJsonToolsView(this.mainContent);
    } else if (viewName === "jwt-decoder") {
      renderJwtDecoderView(this.mainContent);
    } else if (viewName === "base64-tool") {
      renderBase64ToolView(this.mainContent);
    } else if (viewName === "sql-formatter") {
      renderSqlFormatterView(this.mainContent);
    } else if (viewName === "http-client") {
      renderHttpClientView(this.mainContent);
    } else if (viewName === "code-converter") {
      renderCodeConverterView(this.mainContent);
    } else if (viewName === "code-helper") {
      renderCodeHelperView(this.mainContent);
    } else if (viewName === "view-icons") {
      renderViewIconsView(this.mainContent);
    } else if (viewName === "settings") {
      renderSettingsView(this.mainContent);
    }
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    this.checkAuth();
  }
}

// Arrancar App cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  window.argottApp = new App();
});
