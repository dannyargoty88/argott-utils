# 🛠️ Argott Utils

**Argott Utils** suite de herramientas de desarrollo web en formato **Single Page Application (SPA)**. Diseñada en Vanilla JavaScript, HTML5 y CSS3, proporciona a los desarrolladores una colección de utilidades esenciales para simplificar el flujo de trabajo diario sin necesidad de depender de servicios externos o servidores backend.

---

## 🚀 Características y Herramientas Incluidas

La aplicación cuenta con una interfaz intuitiva con soporte para **Modo Oscuro / Claro**, autenticación segura por PIN/Hash y almacenamiento local.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend Core**: HTML5 Semántico, Vanilla JavaScript (ES6+ Modules).
- **Estilos**: Vanilla CSS con variables CSS nativas, efectos de *Glassmorphism*, diseño responsive y soporte para temas.
- **Iconografía**: [Phosphor Icons](https://phosphoricons.com/).
- **Modales y Alertas**: [SweetAlert2](https://sweetalert2.github.io/).
- **Seguridad**: Web Crypto API (Hashing SHA-256 para PIN de acceso).
- **Almacenamiento**: LocalStorage / IndexedDB.

---

## 📁 Estructura del Proyecto

```text
argott-utils/
├── assets/
│   ├── css/
│   │   ├── components.css  # Estilos de componentes UI reusables
│   │   ├── layout.css      # Estructura del Layout (Sidebar, Navbar, Contenedores)
│   │   ├── main.css        # Variables globales, temas y estilos base
│   │   └── views.css       # Estilos específicos de cada vista/herramienta
│   └── images/             # Logotipo y recursos visuales
├── src/
│   ├── components/         # Componentes UI (LoginScreen, Navbar, Sidebar)
│   ├── config/             # Constantes y configuraciones globales
│   ├── database/           # Controladores de base de datos local y almacenamiento
│   ├── utils/              # Helper utilities (Alertas, Criptografía)
│   ├── views/              # Lógica de renderizado de cada módulo de la SPA
│   └── main.js             # Orquestador principal de la aplicación SPA
└── index.html              # Punto de entrada principal HTML
```

---

O abriendo directamente el puerto local generado.

### Uso: Apertura Directa
1. Clona el repositorio:
   ```bash
   git clone https://github.com/dannyargoty88/argott-utils.git
   ```
2. Abre el archivo `index.html` en tu navegador preferido.

---

## 🔒 Autenticación por Defecto

La aplicación incluye un sistema de Login / Bloqueo mediante PIN para proteger el acceso a tus herramientas locales.