/**
 * Wrapper de Alertas y Modales Argott (SweetAlert2 Integration)
 * Proporciona notificaciones y alertas adaptadas al tema de la aplicación (Dark/Light).
 */

const ArgottAlert = {
  /**
   * Muestra un mensaje modal de éxito
   */
  success(title, text = "") {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#6366f1',
      background: document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#121624',
      color: document.documentElement.getAttribute('data-theme') === 'light' ? '#0f172a' : '#f8fafc'
    });
  },

  /**
   * Muestra un mensaje modal de error
   */
  error(title, text = "") {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#f43f5e',
      background: document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#121624',
      color: document.documentElement.getAttribute('data-theme') === 'light' ? '#0f172a' : '#f8fafc'
    });
  },

  /**
   * Muestra un mensaje modal de advertencia / atención
   */
  warning(title, text = "") {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonColor: '#f59e0b',
      background: document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#121624',
      color: document.documentElement.getAttribute('data-theme') === 'light' ? '#0f172a' : '#f8fafc'
    });
  },

  /**
   * Modal de Confirmación interactivo (Acciones críticas/eliminar)
   */
  confirm(title, text = "Esta acción no se puede deshacer.", confirmText = "Sí, continuar") {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#64748b',
      background: document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#121624',
      color: document.documentElement.getAttribute('data-theme') === 'light' ? '#0f172a' : '#f8fafc'
    });
  },

  /**
   * Toast / Notificación flotante rápida en la esquina superior derecha
   */
  toast(message, icon = 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#121624',
      color: document.documentElement.getAttribute('data-theme') === 'light' ? '#0f172a' : '#f8fafc',
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    return Toast.fire({
      icon: icon,
      title: message
    });
  }
};
