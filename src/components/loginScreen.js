/**
 * Login Screen Component - Argott Utils
 * Renderiza la tarjeta modal de inicio de sesión con encriptación SHA-256
 */

class LoginScreen {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onSuccess = options.onSuccess;

    this.render();
    this.setupEvents();
  }

  render() {
    if (!this.container) return;

    const appName = typeof APP_NAME !== "undefined" ? APP_NAME : "Argott Utils";

    this.container.innerHTML = `
      <div class="login-card">
        <div class="logo-badge">
          <img src="assets/images/logo.png" alt="Argott Logo">
        </div>
        <h1 class="login-title">${escapeHTML(appName)}</h1>
        <p class="login-subtitle">Introduce tu código de acceso para continuar</p>

        <form id="login-form" autocomplete="off">
          <div class="form-group">
            <label for="pin-input" class="form-label">Código de Acceso</label>
            <div class="pin-input-container">
              <input type="password" id="pin-input" class="pin-input" placeholder="••••••" maxlength="10" required autofocus>
              <button type="button" id="btn-toggle-pin" class="btn-toggle-pin" title="Mostrar/Ocultar código">
                <i class="ph ph-eye"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-primary">
            <span>Ingresar al Sistema</span>
            <i class="ph ph-arrow-right"></i>
          </button>

          <div id="login-error" class="login-error">
            <i class="ph ph-warning-circle"></i> Código de acceso incorrecto. Inténtalo de nuevo.
          </div>
        </form>
      </div>
    `;
  }

  setupEvents() {
    const loginForm = document.getElementById("login-form");
    const pinInput = document.getElementById("pin-input");
    const btnTogglePin = document.getElementById("btn-toggle-pin");
    const loginError = document.getElementById("login-error");

    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputPin = pinInput.value.trim();
        if (!inputPin) return;

        const computedHash = await hashSHA256(inputPin);

        if (computedHash === PIN_HASH_TARGET) {
          if (loginError) loginError.classList.remove("active");
          localStorage.setItem(STORAGE_KEY_AUTH, "true");
          pinInput.value = "";
          if (this.onSuccess) this.onSuccess();
        } else {
          if (loginError) loginError.classList.add("active");
          pinInput.focus();
          pinInput.select();
        }
      });
    }

    if (btnTogglePin && pinInput) {
      btnTogglePin.addEventListener("click", () => {
        const icon = btnTogglePin.querySelector("i");
        if (pinInput.type === "password") {
          pinInput.type = "text";
          if (icon) icon.className = "ph ph-eye-slash";
        } else {
          pinInput.type = "password";
          if (icon) icon.className = "ph ph-eye";
        }
      });
    }
  }
}
