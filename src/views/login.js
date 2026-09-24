/**
 * Login Module Controller
 */

function initLoginModule(onSuccess) {
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
        loginError.classList.remove("active");
        localStorage.setItem(STORAGE_KEY_AUTH, "true");
        pinInput.value = "";
        if (onSuccess) onSuccess();
      } else {
        loginError.classList.add("active");
        pinInput.focus();
        pinInput.select();
      }
    });
  }

  if (btnTogglePin) {
    btnTogglePin.addEventListener("click", () => {
      const icon = btnTogglePin.querySelector("i");
      if (pinInput.type === "password") {
        pinInput.type = "text";
        icon.className = "ph ph-eye-slash";
      } else {
        pinInput.type = "password";
        icon.className = "ph ph-eye";
      }
    });
  }
}
