/**
 * Pricing View - Argott Utils (Documentos)
 * Genera una propuesta comercial multipágina (presentación, planes, comparativa, soporte, términos
 * y cotización) a partir de una plantilla visual seleccionable y la exporta a PDF
 * (html2canvas + jsPDF, cargados bajo demanda).
 * Construido con Vanilla HTML5, CSS3 y JavaScript ES6+.
 */

const STORAGE_KEY_PRICING_TEMPLATE = "argott_pricing_template";
const HTML2CANVAS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
const JSPDF_CDN = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
// Data URI (src/config/proposalLogo.js) para que el logo no bloquee la exportación a PDF en file://
const PROPOSAL_LOGO = typeof PROPOSAL_LOGO_DATA_URI !== "undefined" ? PROPOSAL_LOGO_DATA_URI : "assets/images/logo_v1.png";
const PROPOSAL_VALIDITY_DAYS = 30;

/**
 * Todas las tarifas se expresan como % del salario mínimo (SMMLV).
 * Estos son los valores por defecto; el formulario de la vista los sobrescribe en cada render.
 */
const PROPOSAL_SMMLV_DEFAULT = { year: 2026, value: 1750905 };
const PROPOSAL_SMMLV = { ...PROPOSAL_SMMLV_DEFAULT };
const PROPOSAL_IMPLEMENTATION_PCT = 50;
const PROPOSAL_EXTRA_USER_PCT = 1;

/**
 * Valor en COP de un % del SMMLV, redondeado a la centena más cercana.
 */
function smmlvPct(pct) {
  return Math.round((PROPOSAL_SMMLV.value * pct) / 100 / 100) * 100;
}

/**
 * Plantillas visuales disponibles. Cada una aplica una clase CSS (.tpl-*) sobre el documento.
 */
const PRICING_TEMPLATES = [
  { id: "argott-software", label: "Argott Software", className: "tpl-argott" },
  { id: "midnight", label: "Midnight (Oscuro)", className: "tpl-midnight" },
  { id: "clean-light", label: "Clean (Claro / Impresión)", className: "tpl-clean" }
];

/**
 * Datos de prueba de la propuesta comercial de la plataforma Argott (argott-nestjs-nextjs).
 */
const ARGOTT_PROPOSAL_DATA = {
  company: {
    name: "Argott Software",
    tagline: "Software empresarial en la nube, a la medida de tu operación",
    email: "danny.argoty@hotmail.com",
    phone: "+57 311 660 0469"
  },

  presentation: {
    lead: "Argott es una plataforma empresarial en la nube que centraliza la operación, las finanzas y la administración de tu compañía en un solo lugar. Se ofrece bajo la modalidad de alquiler (SaaS): sin servidores que comprar, sin instalaciones y con actualizaciones continuas incluidas.",
    pillars: [
      { icon: "ph-database", title: "Base de datos dedicada", text: "Cada cliente opera sobre su propia base de datos aislada. Tu información nunca se mezcla con la de otras empresas." },
      { icon: "ph-shield-check", title: "Seguridad por diseño", text: "Autenticación con tokens firmados, validación de acceso por dominio y bloqueo de accesos cruzados entre clientes." },
      { icon: "ph-puzzle-piece", title: "Modular y escalable", text: "Activa solo los módulos que necesitas hoy y crece en usuarios, almacenamiento y funcionalidades cuando lo requieras." },
      { icon: "ph-chart-line-up", title: "Reportes y automatización", text: "Dashboards con indicadores en tiempo real, reportes en PDF, Excel y Word, correos transaccionales con trazabilidad y procesos programados." }
    ],
    modules: [
      { icon: "ph-sliders-horizontal", name: "Parámetros", items: ["Países, departamentos y ciudades", "Tipos de identificación y documentos", "Parentesco", "Estados Migratorios"] },
      { icon: "ph-gear-six", name: "Administración", items: ["Empresa y sedes", "Usuarios y perfiles", "Configuración", "Log de correos"] },
      { icon: "ph-briefcase", name: "Operación", items: ["Clientes y Agentes", "Aseguradoras", "Enrolamiento", "Eventos y notificaciones", "Entre otros ..."] }
    ],
    stats: [
      { value: "99.9%", label: "Disponibilidad objetivo" },
      { value: "Backups", label: "Con posibilidad de copias de seguridad" },
      { value: "0", label: "Instalaciones locales" },
      { value: "100%", label: "Soporte en español" }
    ]
  },

  plans: [
    {
      id: "basico",
      name: "Básico",
      badge: "",
      pct: 10,
      fromPrice: false,
      includedUsers: 5,
      training: "Videos y guías de uso",
      description: "Para empresas que inician su operación digital con un equipo pequeño",
      features: [
        "Hasta 5 usuarios",
        "Base de datos dedicada para tu empresa",
        "Módulos de Parámetros, Administración y Operación",
        "Envío de correos vía API: hasta 3.000 / mes (máx. 100 por día)",
        "Uso de tu dominio propio en la app y los correos",
        "Dashboard de inicio y reportes PDF / Excel",
        "Hasta 5 GB de almacenamiento",
        "Copias de seguridad semanales",
        "Soporte por correo electrónico (48h hábiles)",
        "8 horas / mes de soporte y desarrollo incluidas",
        "99.5% de disponibilidad objetivo",
        "7 días de historial de logs"
      ],
      cta: "Comenzar con Básico",
      featured: false
    },
    {
      id: "profesional",
      name: "Profesional",
      badge: "Más popular",
      pct: 20,
      fromPrice: false,
      includedUsers: 15,
      training: "2 sesiones virtuales en vivo",
      description: "Para equipos en crecimiento con alto volumen de comunicación con sus clientes",
      features: [
        "Hasta 15 usuarios",
        "Base de datos dedicada para tu empresa",
        "Módulos de Parámetros, Administración y Operación",
        "Envío de correos vía API: hasta 50.000 / mes, sin límite diario",
        "Uso de tu dominio propio en la app y los correos",
        "Dashboards con indicadores de gestión",
        "Reportes PDF / Excel / Word programados",
        "Hasta 50 GB de almacenamiento",
        "Copias de seguridad diarias",
        "Soporte prioritario por correo y WhatsApp (24h hábiles)",
        "16 horas / mes de soporte y desarrollo incluidas",
        "Ambiente de pruebas disponible",
        "99.9% de disponibilidad objetivo",
        "30 días de historial de logs"
      ],
      cta: "Elegir Profesional",
      featured: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      badge: "",
      pct: 40,
      fromPrice: true,
      includedUsers: null,
      training: "Onboarding dedicado",
      description: "Para organizaciones que requieren infraestructura dedicada y soporte prioritario",
      features: [
        "Usuarios ilimitados",
        "Servidores y base de datos dedicados",
        "Alta disponibilidad con réplicas",
        "Envío de correos vía API: desde 50.000 / mes (ampliable)",
        "Uso de tu dominio propio en la app y los correos",
        "Dashboards personalizados",
        "Inicio de sesión único (SSO) y roles avanzados",
        "Integraciones vía API con otros sistemas",
        "Hasta 100 GB de almacenamiento",
        "Copias de seguridad diarias con réplica",
        "Soporte telefónico con gestor de cuenta",
        "32 horas / mes de soporte y desarrollo incluidas",
        "Ambiente de pruebas disponible",
        "99.95% de disponibilidad objetivo",
        "90 días de historial de logs"
      ],
      cta: "Contactar a Ventas",
      featured: false
    }
  ],

  addons: [
    { icon: "ph-user-plus", name: "Usuario adicional", pct: PROPOSAL_EXTRA_USER_PCT, unit: "por usuario / mes" },
    { icon: "ph-envelope-simple", name: "Correos adicionales", pct: 0.3, unit: "por cada 1.000 (Profesional y Enterprise)" },
    { icon: "ph-hard-drives", name: "Almacenamiento", pct: 1, unit: "por cada 10 GB / mes" },
    { icon: "ph-headset", name: "Hora adicional", pct: 5, unit: "soporte o desarrollo" },
  ],

  // Comparativa: true = incluido, false = no incluido, string = valor
  comparison: [
    {
      section: "Recursos y límites",
      rows: [
        ["Usuarios incluidos", "5", "15", "Ilimitados"],
        ["Infraestructura", "Compartida, BD dedicada", "Compartida, mayor capacidad", "Dedicada con réplicas"],
        ["Almacenamiento", "5 GB", "50 GB", "100 GB"],
        ["Correos vía API / mes", "3.000", "50.000", "Desde 50.000"],
        ["Límite diario de correos", "100 por día", "Sin límite", "Sin límite"],
        ["Copias de seguridad", "Semanales", "Diarias", "Diarias + réplica"],
        ["Historial de logs", "7 días", "30 días", "90 días"],
        ["Ambiente de pruebas", false, true, true]
      ]
    },
    {
      section: "Módulos y funcionalidades",
      rows: [
        ["Parámetros", true, true, true],
        ["Administración", true, true, true],
        ["Operación (módulos pactados)", true, true, true],
        ["Dashboards", "Inicio", "Indicadores", "Personalizados"],
        ["Reportes PDF y Excel", true, true, true],
        ["Reportes Word y programados", true, true, true],
        ["API REST para integraciones", false, "Limitada", "Completa"]
      ]
    },
    {
      section: "Seguridad y acceso",
      rows: [
        ["Base de datos aislada por cliente", true, true, true],
        ["Dominio propio (app y correos)", true, true, true],
        ["Roles y permisos", "Predefinidos", "Personalizables", "Avanzado"],
        ["Autenticación (OTP)", true, true, true],
      ]
    },
    {
      section: "Soporte y servicio",
      rows: [
        ["Canales", "Correo", "Correo y WhatsApp", "Correo, WhatsApp, teléfono"],
        ["Primera respuesta", "48h hábiles", "24h hábiles", "4h (críticos 1h)"],
        ["Horas de soporte y desarrollo / mes", "8 horas", "16 horas", "32 horas"],
        ["Disponibilidad objetivo", "99.5%", "99.9%", "99.95%"],
        ["Capacitación", "Videos y guías", "Sesiones en vivo", "Onboarding dedicado"],
      ]
    }
  ],

  support: {
    lead: "Nuestro equipo acompaña a cada cliente desde la puesta en marcha y durante toda la vigencia del contrato. Los tiempos de atención dependen del plan contratado y de la severidad del incidente.",
    // contact: dato del formulario que se muestra en el canal ("email" o "phone")
    channels: [
      { icon: "ph-envelope-simple", title: "Correo electrónico", contact: "email", text: "Todos los planes. Cada solicitud genera un ticket con seguimiento." },
      { icon: "ph-whatsapp-logo", title: "WhatsApp", contact: "phone", text: "Planes Profesional y Enterprise, por chat directo." },
      { icon: "ph-phone", title: "Línea telefónica", contact: "phone", text: "Plan Enterprise, con gestor de cuenta asignado y escalamiento directo." }
    ],
    schedule: "Horario de atención: lunes a viernes de 8:00 a.m. a 6:00 p.m. (hora Colombia). Plan Enterprise: incidentes críticos 24/7.",
    severities: [
      { level: "P1 · Crítico", desc: "Plataforma caída o pérdida de acceso para todos los usuarios", times: ["8h", "4h", "1h"] },
      { level: "P2 · Alto", desc: "Funcionalidad principal afectada sin alternativa disponible", times: ["24h", "8h", "4h"] },
      { level: "P3 · Medio", desc: "Falla parcial con alternativa temporal disponible", times: ["48h", "24h", "8h"] },
      { level: "P4 · Bajo", desc: "Consultas, solicitudes de mejora o dudas de uso", times: ["72h", "48h", "24h"] }
    ],
    maintenance: [
      "Ventana de mantenimiento programado: domingos de 12:00 a.m. a 4:00 a.m. (hora Colombia).",
      "Todo mantenimiento programado se notifica con al menos 72 horas de anticipación.",
      "Las actualizaciones de versión están incluidas en la suscripción sin costo adicional."
    ]
  },

  terms: [
    { title: "Objeto", text: "Argott Software otorga al Cliente una licencia de uso no exclusiva e intransferible de la plataforma bajo la modalidad de software como servicio (SaaS), durante la vigencia del contrato." },
    { title: "Vigencia y renovación", text: "El contrato inicia en la fecha de activación del servicio y se renueva automáticamente por periodos iguales, salvo aviso de no renovación con 30 días de anticipación." },
    { title: "Facturación y pagos", text: "La suscripción se factura por periodo anticipado. El pago debe realizarse dentro de los 5 días hábiles siguientes a la emisión de la factura." },
    { title: "Mora y suspensión", text: "Con más de 15 días de mora, el servicio podrá suspenderse previo aviso. Los datos se conservan intactos durante la suspensión y el acceso se restablece al normalizar el pago." },
    { title: "Ajuste de precios", text: "Las tarifas se expresan como porcentaje del salario mínimo mensual legal vigente (SMMLV) y se actualizan automáticamente cada enero con el nuevo salario mínimo decretado." },
    { title: "Implementación", text: "El pago inicial de implementación cubre el levantamiento del requerimiento, la habilitación de módulos, el cargue de información inicial y el diseño y desarrollo de los módulos de operación pactados en la negociación." },
    { title: "Nuevos requerimientos", text: "Las funcionalidades no pactadas inicialmente (por ejemplo, mensajería por WhatsApp mediante la API de Meta) se atienden mediante nuevas cotizaciones, que pueden o no modificar el valor de la mensualidad." },
    { title: "Propiedad de los datos", text: "La información registrada en la plataforma es propiedad exclusiva del Cliente. Al finalizar el contrato podrá exportarla en formatos estándar durante los 30 días siguientes." },
    { title: "Protección de datos", text: "Argott Software actúa como encargado del tratamiento y aplica la normativa vigente de protección de datos personales (Ley 1581 de 2012 en Colombia y normas que la complementen)." },
    { title: "Confidencialidad", text: "Ambas partes se obligan a mantener en reserva la información técnica, comercial y financiera a la que tengan acceso con ocasión del contrato, aun después de su terminación." },
    { title: "Uso aceptable", text: "El Cliente se compromete a no usar la plataforma para actividades ilícitas, ni intentar vulnerar su seguridad, ni revender el acceso a terceros sin autorización escrita." },
    { title: "Cancelación", text: "El Cliente puede cancelar con 30 días de aviso. En contratos anuales con descuento, la cancelación anticipada no genera devolución del periodo ya facturado." },
    { title: "Limitación de responsabilidad", text: "La responsabilidad total de Argott Software se limita al valor pagado por el Cliente en los 12 meses anteriores al hecho que origine la reclamación." },
    { title: "Propiedad intelectual", text: "El software, su código fuente, diseño y marca son propiedad de Argott Software. Los desarrollos a medida se regirán por lo acordado en su respectiva cotización." }
  ],

  futureServices: [
    { icon: "ph-whatsapp-logo", name: "Mensajería por WhatsApp", text: "Notificaciones y mensajes a tus clientes mediante la API de WhatsApp Business (Meta). El costo por conversación de Meta se factura según consumo.", price: "Por cotizar" },
    { icon: "ph-squares-four", name: "Nuevos módulos de operación", text: "Diseño y desarrollo de módulos adicionales a los pactados en la implementación.", price: "Por cotizar" },
    { icon: "ph-receipt", name: "Facturación electrónica", text: "Emisión de facturas electrónicas integrada con el ente tributario.", price: "Por cotizar" },
    { icon: "ph-device-mobile", name: "Aplicación móvil", text: "App iOS y Android para consultas y operaciones en campo.", price: "Por cotizar" },
    { icon: "ph-plugs-connected", name: "Integraciones a medida", text: "Conexión con ERP, CRM, pasarelas de pago u otros sistemas.", pct: 5, unit: "/ hora" },
    { icon: "ph-graduation-cap", name: "Capacitación adicional", text: "Sesiones para nuevos equipos o funcionalidades.", pct: 3, unit: "/ sesión" }
  ],

  nextSteps: [
    { title: "Aprobación", text: "Firma de esta propuesta o confirmación por correo electrónico." },
    { title: "Activación", text: "Creación del tenant y entrega de credenciales en máximo 2 días hábiles." },
    { title: "Configuración", text: "Parametrización, carga inicial de datos y definición de roles." },
    { title: "Capacitación y salida en vivo", text: "Entrenamiento del equipo y acompañamiento durante el primer mes." }
  ]
};

function renderPricingView(container) {
  const savedTemplate = localStorage.getItem(STORAGE_KEY_PRICING_TEMPLATE);
  const initialTemplate = PRICING_TEMPLATES.some(t => t.id === savedTemplate) ? savedTemplate : PRICING_TEMPLATES[0].id;

  const templateOptions = PRICING_TEMPLATES.map(t => `
    <option value="${t.id}"${t.id === initialTemplate ? " selected" : ""}>${escapeHTML(t.label)}</option>
  `).join("");

  const planOptions = ARGOTT_PROPOSAL_DATA.plans.map(p => `
    <option value="${p.id}"${p.id === "basico" ? " selected" : ""}>${escapeHTML(p.name)}</option>
  `).join("");

  container.innerHTML = `
    <div class="pricing-view-container">

      <!-- Encabezado + Datos de la Propuesta -->
      <div class="panel-box">
        <div class="panel-header pricing-panel-header" style="justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="panel-title" style="font-size: 1.25rem;">
              <i class="ph ph-currency-dollar" style="color: var(--accent-primary);"></i> Pricing
            </h2>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Propuesta comercial de alquiler de software. Completa los datos, elige el estilo y descárgala en PDF.
            </p>
          </div>

          <div class="pricing-header-actions">
            <select id="pricing-template-select" class="form-control" title="Tipo de plantilla">
              ${templateOptions}
            </select>
            <button id="btn-pricing-pdf" class="btn-primary">
              <i class="ph ph-file-pdf"></i> Descargar PDF
            </button>
          </div>
        </div>

        <div class="proposal-form-grid">
          <label class="converter-select-group">
            <span class="converter-label">Cliente</span>
            <input id="proposal-client" class="form-control" type="text" value="Empresa Cliente S.A.S.">
          </label>
          <label class="converter-select-group">
            <span class="converter-label">Contacto</span>
            <input id="proposal-contact" class="form-control" type="text" value="Nombre del contacto">
          </label>
          <label class="converter-select-group">
            <span class="converter-label">N° de propuesta</span>
            <input id="proposal-number" class="form-control" type="text" value="ARG-${new Date().getFullYear()}-001">
          </label>
          <label class="converter-select-group">
            <span class="converter-label">Plan a cotizar</span>
            <select id="proposal-plan" class="form-control">${planOptions}</select>
          </label>
          <label class="converter-select-group">
            <span class="converter-label">Usuarios</span>
            <input id="proposal-users" class="form-control" type="number" min="1" value="5">
          </label>
          <label class="converter-select-group">
            <span class="converter-label">Duración</span>
            <select id="proposal-months" class="form-control">
              <option value="1">1 mes</option>
              <option value="6">6 meses</option>
              <option value="12" selected>12 meses</option>
              <option value="24">24 meses</option>
            </select>
          </label>
          <label class="converter-select-group">
            <span class="converter-label">Correo de soporte</span>
            <input id="proposal-email" class="form-control" type="email" value="${escapeHTML(ARGOTT_PROPOSAL_DATA.company.email)}">
          </label>
          <label class="converter-select-group">
            <span class="converter-label">Teléfono / WhatsApp</span>
            <input id="proposal-phone" class="form-control" type="text" value="${escapeHTML(ARGOTT_PROPOSAL_DATA.company.phone)}">
          </label>
          <label class="converter-select-group">
            <span class="converter-label">Hoja de cotización</span>
            <select id="proposal-include-quote" class="form-control">
              <option value="yes" selected>Incluir</option>
              <option value="no">No incluir</option>
            </select>
          </label>
        </div>

        <span class="proposal-form-section">Tarifas</span>
        <div class="proposal-form-grid cols-5">
          <label class="converter-select-group">
            <span class="converter-label">Salario mínimo (SMMLV)</span>
            <input id="proposal-smmlv" class="form-control" type="text" inputmode="numeric" value="${formatCurrency(PROPOSAL_SMMLV_DEFAULT.value)}">
          </label>
          <label class="converter-select-group">
            <span class="converter-label">Año del SMMLV</span>
            <input id="proposal-smmlv-year" class="form-control" type="number" min="2000" value="${PROPOSAL_SMMLV_DEFAULT.year}">
          </label>
          ${ARGOTT_PROPOSAL_DATA.plans.map(p => `
          <label class="converter-select-group">
            <span class="converter-label">% Plan ${escapeHTML(p.name)}</span>
            <input id="proposal-pct-${p.id}" class="form-control" type="number" min="0" step="0.1" value="${p.pct}">
          </label>`).join("")}
        </div>
      </div>

      <!-- Vista previa del documento -->
      <div class="pricing-preview-scroll">
        <div id="proposal-doc" class="proposal-doc"></div>
      </div>
    </div>
  `;

  const selectEl = container.querySelector("#pricing-template-select");
  const pdfBtn = container.querySelector("#btn-pricing-pdf");
  const docEl = container.querySelector("#proposal-doc");
  const formInputs = container.querySelectorAll(".proposal-form-grid .form-control");

  const readForm = () => ({
    client: container.querySelector("#proposal-client").value.trim() || "Cliente",
    contact: container.querySelector("#proposal-contact").value.trim(),
    number: container.querySelector("#proposal-number").value.trim(),
    planId: container.querySelector("#proposal-plan").value,
    users: Math.max(1, parseInt(container.querySelector("#proposal-users").value, 10) || 1),
    months: parseInt(container.querySelector("#proposal-months").value, 10),
    email: container.querySelector("#proposal-email").value.trim(),
    phone: container.querySelector("#proposal-phone").value.trim(),
    includeQuote: container.querySelector("#proposal-include-quote").value === "yes",
    smmlv: parseInt(container.querySelector("#proposal-smmlv").value.replace(/\D/g, ""), 10) || PROPOSAL_SMMLV_DEFAULT.value,
    smmlvYear: parseInt(container.querySelector("#proposal-smmlv-year").value, 10) || PROPOSAL_SMMLV_DEFAULT.year,
    pcts: Object.fromEntries(ARGOTT_PROPOSAL_DATA.plans.map(p => {
      const value = parseFloat(container.querySelector(`#proposal-pct-${p.id}`).value);
      return [p.id, Number.isFinite(value) && value >= 0 ? value : p.pct];
    }))
  });

  const render = () => {
    const includeQuote = container.querySelector("#proposal-include-quote").value === "yes";
    container.querySelector("#proposal-users").disabled = !includeQuote;
    container.querySelector("#proposal-months").disabled = !includeQuote;
    const template = PRICING_TEMPLATES.find(t => t.id === selectEl.value) || PRICING_TEMPLATES[0];
    docEl.className = `proposal-doc ${template.className}`;
    const form = readForm();
    Object.assign(PROPOSAL_SMMLV, { value: form.smmlv, year: form.smmlvYear });
    const data = { ...ARGOTT_PROPOSAL_DATA, plans: ARGOTT_PROPOSAL_DATA.plans.map(p => ({ ...p, pct: form.pcts[p.id] })) };
    docEl.innerHTML = buildProposalHTML(data, form);
  };

  render();

  selectEl.addEventListener("change", () => {
    localStorage.setItem(STORAGE_KEY_PRICING_TEMPLATE, selectEl.value);
    render();
  });

  formInputs.forEach(input => input.addEventListener("input", render));

  const smmlvInput = container.querySelector("#proposal-smmlv");
  smmlvInput.addEventListener("blur", () => {
    smmlvInput.value = formatCurrency(readForm().smmlv);
  });

  pdfBtn.addEventListener("click", async () => {
    const originalHtml = pdfBtn.innerHTML;
    pdfBtn.disabled = true;

    try {
      const form = readForm();
      const fileName = `propuesta-${slugify(form.number || "argott")}-${slugify(form.client)}.pdf`;
      await exportProposalToPdf(docEl, fileName, (current, total) => {
        pdfBtn.innerHTML = `<i class="ph ph-spinner"></i> Generando ${current}/${total}...`;
      });
      ArgottAlert.toast("PDF generado correctamente");
    } catch (err) {
      console.error(err);
      ArgottAlert.error("No se pudo generar el PDF", err && err.message ? err.message : "");
    } finally {
      pdfBtn.disabled = false;
      pdfBtn.innerHTML = originalHtml;
    }
  });
}

/* ==========================================================================
   Construcción del documento
   ========================================================================== */

function buildProposalHTML(data, form) {
  const issueDate = new Date();
  const validUntil = new Date(issueDate.getTime() + PROPOSAL_VALIDITY_DAYS * 24 * 60 * 60 * 1000);
  const ctx = {
    data,
    form,
    plan: data.plans.find(p => p.id === form.planId) || data.plans[0],
    issueDate: formatLongDate(issueDate),
    validUntil: formatLongDate(validUntil)
  };

  const bodies = [
    buildCoverPage(ctx),
    buildPresentationPage(ctx),
    buildPlansPage(ctx),
    buildComparisonPage(ctx),
    buildSupportPage(ctx),
    buildTermsPage(ctx),
    buildNextStepsPage(ctx),
    ...(form.includeQuote ? [buildQuotePage(ctx)] : [])
  ];

  return bodies.map((body, index) => {
    const isCover = index === 0;
    return `
      <section class="proposal-page${isCover ? " cover" : ""}">
        ${isCover ? "" : buildPageHeader(ctx)}
        <div class="proposal-page-body">${body}</div>
        ${buildPageFooter(ctx, index + 1, bodies.length)}
      </section>
    `;
  }).join("");
}

function buildPageHeader(ctx) {
  return `
    <header class="proposal-page-header">
      <div class="proposal-header-brand">
        <img src="${PROPOSAL_LOGO}" alt="Logo">
        <span>${escapeHTML(ctx.data.company.name)}</span>
      </div>
      <span>Propuesta comercial · ${escapeHTML(ctx.form.number)}</span>
    </header>
  `;
}

function buildPageFooter(ctx, pageNumber, totalPages) {
  return `
    <footer class="proposal-page-footer">
      <span>Documento confidencial preparado para ${escapeHTML(ctx.form.client)}</span>
      <span>Página ${pageNumber} de ${totalPages}</span>
    </footer>
  `;
}

function buildSectionHeading(eyebrow, title, lead = "") {
  return `
    <div class="proposal-heading">
      <span class="proposal-eyebrow">${escapeHTML(eyebrow)}</span>
      <h2 class="proposal-h2">${escapeHTML(title)}</h2>
      ${lead ? `<p class="proposal-lead">${escapeHTML(lead)}</p>` : ""}
    </div>
  `;
}

function buildCoverPage(ctx) {
  const { data, form, plan } = ctx;
  return `
    <div class="cover-content">
      <img class="cover-logo" src="${PROPOSAL_LOGO}" alt="Logo">
      <span class="proposal-eyebrow">Propuesta comercial</span>
      <h1 class="cover-title">Alquiler de Software Empresarial</h1>
      <p class="cover-subtitle">${escapeHTML(data.company.tagline)}</p>

      <div class="cover-client">
        <span class="cover-client-label">Preparada para</span>
        <span class="cover-client-name">${escapeHTML(form.client)}</span>
        ${form.contact ? `<span class="cover-client-contact">Atención: ${escapeHTML(form.contact)}</span>` : ""}
      </div>

      <div class="cover-meta">
        <div><span>N° de propuesta</span><strong>${escapeHTML(form.number)}</strong></div>
        <div><span>Fecha de emisión</span><strong>${escapeHTML(ctx.issueDate)}</strong></div>
        <div><span>Válida hasta</span><strong>${escapeHTML(ctx.validUntil)}</strong></div>
        <div><span>Plan propuesto</span><strong>${escapeHTML(plan.name)}</strong></div>
      </div>
    </div>

    <div class="cover-contact">
      <strong>${escapeHTML(data.company.name)}</strong>
      ${ctx.form.email ? `<span><i class="ph ph-envelope-simple"></i> ${escapeHTML(ctx.form.email)}</span>` : ""}
      ${ctx.form.phone ? `<span><i class="ph ph-whatsapp-logo"></i> ${escapeHTML(ctx.form.phone)}</span>` : ""}
    </div>
  `;
}

function buildPresentationPage(ctx) {
  const p = ctx.data.presentation;

  const pillars = p.pillars.map(item => `
    <div class="proposal-tile">
      <i class="ph ${item.icon} proposal-tile-icon"></i>
      <h4>${escapeHTML(item.title)}</h4>
      <p>${escapeHTML(item.text)}</p>
    </div>
  `).join("");

  const modules = p.modules.map(m => `
    <div class="proposal-module">
      <div class="proposal-module-name"><i class="ph ${m.icon}"></i> ${escapeHTML(m.name)}</div>
      <ul>${m.items.map(i => `<li>${escapeHTML(i)}</li>`).join("")}</ul>
    </div>
  `).join("");

  const stats = p.stats.map(s => `
    <div class="proposal-stat"><strong>${escapeHTML(s.value)}</strong><span>${escapeHTML(s.label)}</span></div>
  `).join("");

  return `
    ${buildSectionHeading("01 · Presentación", "Conoce la plataforma Argott", p.lead)}
    <div class="proposal-stats">${stats}</div>
    <h3 class="proposal-h3">Pilares de la plataforma</h3>
    <div class="proposal-tiles cols-2">${pillars}</div>
    <h3 class="proposal-h3">Módulos disponibles</h3>
    <div class="proposal-modules">${modules}</div>
    <div class="proposal-callout">
      <i class="ph ph-cloud-check"></i>
      <p><strong>Modalidad de alquiler (SaaS):</strong> pagas una suscripción periódica que incluye hosting, mantenimiento, actualizaciones, copias de seguridad y soporte. Sin inversión inicial en infraestructura.</p>
    </div>
  `;
}

function buildPlansPage(ctx) {
  const data = ctx.data;

  const plansHtml = data.plans.map(plan => {
    const featuresHtml = plan.features.map(f => `
      <li><i class="ph-fill ph-check-circle"></i><span>${escapeHTML(f)}</span></li>
    `).join("");

    return `
      <div class="pricing-card${plan.featured ? " featured" : ""}">
        <div class="pricing-card-head">
          <span class="pricing-plan-name">${escapeHTML(plan.name)}</span>
          ${plan.badge ? `<span class="pricing-badge">${escapeHTML(plan.badge)}</span>` : ""}
        </div>
        <div class="pricing-price-row">
          <span class="pricing-price">${formatCurrency(smmlvPct(plan.pct))}</span>
          <span class="pricing-period">/ mes</span>
        </div>
        <span class="pricing-price-note">${plan.fromPrice ? "Desde el " : ""}${plan.pct}% del SMMLV ${PROPOSAL_SMMLV.year}</span>
        <p class="pricing-plan-desc">${escapeHTML(plan.description)}</p>
        <ul class="pricing-features">${featuresHtml}</ul>
        <div class="pricing-cta">${escapeHTML(plan.cta)}</div>
      </div>
    `;
  }).join("");

  const addonsHtml = data.addons.map(a => `
    <div class="pricing-addon">
      <div class="pricing-addon-name"><i class="ph ${a.icon}"></i> ${escapeHTML(a.name)}</div>
      <div class="pricing-addon-price">${formatCurrency(smmlvPct(a.pct))} <span>${escapeHTML(a.unit)}</span></div>
    </div>
  `).join("");

  return `
    ${buildSectionHeading("02 · Planes", "Planes de suscripción", "Elige el plan que mejor se ajusta al tamaño y a las necesidades de tu operación. Puedes cambiar de plan en cualquier momento.")}
    <section class="pricing-cards">${plansHtml}</section>
    <section class="pricing-addons-section">
      <h3 class="pricing-addons-title">Consumo adicional</h3>
      <div class="pricing-addons">${addonsHtml}</div>
    </section>
    <div class="proposal-callout" style="margin-top: 18px;">
      <i class="ph ph-rocket-launch"></i>
      <p><strong>Implementación (pago inicial único): ${formatCurrency(smmlvPct(PROPOSAL_IMPLEMENTATION_PCT))}</strong>, equivalente al ${PROPOSAL_IMPLEMENTATION_PCT}% del SMMLV. Incluye el levantamiento del requerimiento, la habilitación de módulos, el cargue de información inicial y el diseño y desarrollo de los módulos de operación pactados en la negociación.</p>
    </div>
    <div class="proposal-callout" style="margin-top: 14px;">
      <i class="ph ph-currency-circle-dollar"></i>
      <p><strong>Valores en pesos colombianos (COP)</strong> calculados sobre el SMMLV ${PROPOSAL_SMMLV.year} (${formatCurrency(PROPOSAL_SMMLV.value)}) y actualizados cada año con el nuevo salario mínimo. No incluyen IVA. Los nuevos requerimientos se cotizan por separado.</p>
    </div>
  `;
}

function buildComparisonPage(ctx) {
  const plans = ctx.data.plans;

  const renderCell = (value) => {
    if (value === true) return `<i class="ph-fill ph-check-circle cmp-yes"></i>`;
    if (value === false) return `<span class="cmp-no">—</span>`;
    return escapeHTML(value);
  };

  const sections = ctx.data.comparison.map(group => `
    <tr class="cmp-section"><td colspan="${plans.length + 1}">${escapeHTML(group.section)}</td></tr>
    ${group.rows.map(([label, ...values]) => `
      <tr>
        <td class="cmp-label">${escapeHTML(label)}</td>
        ${values.map((v, i) => `<td class="${plans[i].featured ? "cmp-featured" : ""}">${renderCell(v)}</td>`).join("")}
      </tr>
    `).join("")}
  `).join("");

  return `
    ${buildSectionHeading("03 · Comparativa", "Compara las características")}
    <table class="cmp-table">
      <thead>
        <tr>
          <th></th>
          ${plans.map(p => `
            <th class="${p.featured ? "cmp-featured" : ""}">
              <span class="cmp-plan-name">${escapeHTML(p.name)}</span>
              <span class="cmp-plan-price">${p.fromPrice ? "Desde " : ""}${formatCurrency(smmlvPct(p.pct))} / mes · ${p.pct}% SMMLV</span>
            </th>
          `).join("")}
        </tr>
      </thead>
      <tbody>${sections}</tbody>
    </table>
  `;
}

function buildSupportPage(ctx) {
  const s = ctx.data.support;
  const plans = ctx.data.plans;

  const channels = s.channels.map(c => `
    <div class="proposal-tile">
      <i class="ph ${c.icon} proposal-tile-icon"></i>
      <h4>${escapeHTML(c.title)}</h4>
      ${ctx.form[c.contact] ? `<span class="proposal-tile-price">${escapeHTML(ctx.form[c.contact])}</span>` : ""}
      <p>${escapeHTML(c.text)}</p>
    </div>
  `).join("");

  const severityRows = s.severities.map(sev => `
    <tr>
      <td class="cmp-label"><strong>${escapeHTML(sev.level)}</strong><span class="cmp-desc">${escapeHTML(sev.desc)}</span></td>
      ${sev.times.map((t, i) => `<td class="${plans[i].featured ? "cmp-featured" : ""}">${escapeHTML(t)}</td>`).join("")}
    </tr>
  `).join("");

  return `
    ${buildSectionHeading("04 · Soporte", "Soporte y niveles de servicio (SLA)", s.lead)}
    <div class="proposal-tiles cols-3">${channels}</div>
    <p class="proposal-note left"><i class="ph ph-clock"></i> ${escapeHTML(s.schedule)}</p>

    <h3 class="proposal-h3">Tiempos máximos de primera respuesta</h3>
    <table class="cmp-table compact">
      <thead>
        <tr><th>Severidad</th>${plans.map(p => `<th class="${p.featured ? "cmp-featured" : ""}"><span class="cmp-plan-name">${escapeHTML(p.name)}</span></th>`).join("")}</tr>
      </thead>
      <tbody>${severityRows}</tbody>
    </table>

    <h3 class="proposal-h3">Mantenimiento y actualizaciones</h3>
    <ul class="proposal-list">${s.maintenance.map(m => `<li><i class="ph-fill ph-check-circle"></i><span>${escapeHTML(m)}</span></li>`).join("")}</ul>

    <h3 class="proposal-h3">Horas de soporte y desarrollo</h3>
    <div class="proposal-callout" style="margin-top: 0;">
      <i class="ph ph-clock-countdown"></i>
      <p>Cada plan incluye una bolsa mensual de horas: <strong>Básico 8 horas</strong>, <strong>Profesional 16 horas</strong> y <strong>Enterprise 32 horas</strong>. Cubren soporte funcional, ajustes menores, nuevos reportes y cambios de configuración. Las horas no son acumulables de un mes a otro. Las horas adicionales se cobran a ${formatCurrency(smmlvPct(5))} por hora (5% del SMMLV) o con el paquete de 10 horas a ${formatCurrency(smmlvPct(45))} (45% del SMMLV). Los módulos nuevos se cotizan por separado.</p>
    </div>
  `;
}

function buildTermsPage(ctx) {
  const clauses = ctx.data.terms.map((t, i) => `
    <div class="proposal-clause">
      <h4><span>${String(i + 1).padStart(2, "0")}</span> ${escapeHTML(t.title)}</h4>
      <p>${escapeHTML(t.text)}</p>
    </div>
  `).join("");

  return `
    ${buildSectionHeading("05 · Reglamento", "Términos y condiciones del servicio", "Condiciones generales que regirán la relación comercial. Las particularidades de cada cliente se incorporarán en el contrato de suscripción.")}
    <div class="proposal-clauses">${clauses}</div>
  `;
}

function computeProposalQuote(plan, form) {
  const months = form.months;
  const monthly = smmlvPct(plan.pct);
  const extraUsers = plan.includedUsers === null ? 0 : Math.max(0, form.users - plan.includedUsers);
  const usersLabel = plan.includedUsers === null ? "usuarios ilimitados" : `${plan.includedUsers} usuarios`;

  const items = [
    {
      concept: `Suscripción plan ${plan.name}`,
      detail: `${months} ${months === 1 ? "mes" : "meses"} · ${plan.pct}% del SMMLV ${PROPOSAL_SMMLV.year} · incluye ${usersLabel}`,
      qty: months,
      unit: monthly
    }
  ];

  if (extraUsers > 0) {
    items.push({
      concept: "Usuarios adicionales",
      detail: `${extraUsers} ${extraUsers === 1 ? "usuario" : "usuarios"} × ${months} ${months === 1 ? "mes" : "meses"}`,
      qty: extraUsers * months,
      unit: smmlvPct(PROPOSAL_EXTRA_USER_PCT)
    });
  }

  items.push(
    { concept: "Implementación", detail: `Pago inicial único (${PROPOSAL_IMPLEMENTATION_PCT}% del SMMLV) · levantamiento del requerimiento, habilitación de módulos, cargue de información inicial y desarrollo de los módulos de operación pactados`, qty: 1, unit: smmlvPct(PROPOSAL_IMPLEMENTATION_PCT) },
    { concept: "Capacitación inicial", detail: `${plan.training} · incluida en el plan`, qty: 1, unit: 0 }
  );

  items.forEach(item => { item.total = item.qty * item.unit; });

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  // Pago anual: 2 meses gratis por cada año completo contratado
  const freeMonths = Math.floor(months / 12) * 2;
  const discount = freeMonths * monthly;
  return { items, subtotal, freeMonths, discount, total: subtotal - discount };
}

function buildQuotePage(ctx) {
  const { form, plan } = ctx;
  const quote = computeProposalQuote(plan, form);

  const rows = quote.items.map(item => `
    <tr>
      <td class="cmp-label"><strong>${escapeHTML(item.concept)}</strong><span class="cmp-desc">${escapeHTML(item.detail)}</span></td>
      <td>${item.qty}</td>
      <td>${formatCurrency(item.unit)}</td>
      <td class="num">${formatCurrency(item.total)}</td>
    </tr>
  `).join("");

  return `
    ${buildSectionHeading("07 · Cotización", "Cotización del servicio")}

    <div class="quote-meta">
      <div><span>Cliente</span><strong>${escapeHTML(form.client)}</strong></div>
      <div><span>Contacto</span><strong>${escapeHTML(form.contact || "—")}</strong></div>
      <div><span>N° de propuesta</span><strong>${escapeHTML(form.number)}</strong></div>
      <div><span>Fecha de emisión</span><strong>${escapeHTML(ctx.issueDate)}</strong></div>
      <div><span>Válida hasta</span><strong>${escapeHTML(ctx.validUntil)}</strong></div>
      <div><span>Usuarios solicitados</span><strong>${form.users}</strong></div>
    </div>

    <table class="cmp-table quote-table">
      <thead><tr><th>Concepto</th><th>Cantidad</th><th>Valor unitario</th><th class="num">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="quote-totals">
      <div><span>Subtotal</span><strong>${formatCurrency(quote.subtotal)}</strong></div>
      ${quote.discount > 0 ? `<div class="discount"><span>Descuento pago anual (${quote.freeMonths} meses gratis)</span><strong>− ${formatCurrency(quote.discount)}</strong></div>` : ""}
      <div class="grand"><span>Total inversión</span><strong>${formatCurrency(quote.total)} COP</strong></div>
    </div>

    <div class="proposal-two-cols">
      <div>
        <h3 class="proposal-h3">Forma de pago</h3>
        <ul class="proposal-list">
          <li><i class="ph-fill ph-check-circle"></i><span>Implementación: pago inicial único al aprobar la propuesta.</span></li>
          <li><i class="ph-fill ph-check-circle"></i><span>Suscripción: ${form.months >= 12 ? "pago anticipado por año" : "pago mensual anticipado"}.</span></li>
          <li><i class="ph-fill ph-check-circle"></i><span>Transferencia bancaria o tarjeta de crédito.</span></li>
          <li><i class="ph-fill ph-check-circle"></i><span>Valores en COP calculados sobre el SMMLV ${PROPOSAL_SMMLV.year} (${formatCurrency(PROPOSAL_SMMLV.value)}).</span></li>
        </ul>
      </div>
      <div>
        <h3 class="proposal-h3">Observaciones</h3>
        <ul class="proposal-list">
          ${plan.fromPrice ? `<li><i class="ph-fill ph-info"></i><span>El plan Enterprise se cotiza con precio de referencia; el valor final depende del alcance.</span></li>` : ""}
          <li><i class="ph-fill ph-info"></i><span>Nuevos requerimientos (p. ej. WhatsApp vía API de Meta) se cotizan aparte y pueden o no modificar la mensualidad.</span></li>
          <li><i class="ph-fill ph-info"></i><span>Consumos adicionales (almacenamiento, correos) se facturan según uso.</span></li>
          <li><i class="ph-fill ph-info"></i><span>Esta cotización tiene una validez de ${PROPOSAL_VALIDITY_DAYS} días calendario.</span></li>
        </ul>
      </div>
    </div>

    <div class="signature-block">
      <div><span class="signature-line"></span><strong>${escapeHTML(ctx.data.company.name)}</strong><span>Nombre, cargo y fecha</span></div>
      <div><span class="signature-line"></span><strong>${escapeHTML(form.client)}</strong><span>Aceptación: nombre, cargo y fecha</span></div>
    </div>
  `;
}

function buildNextStepsPage(ctx) {
  const data = ctx.data;

  const services = data.futureServices.map(s => `
    <div class="proposal-tile">
      <i class="ph ${s.icon} proposal-tile-icon"></i>
      <h4>${escapeHTML(s.name)}</h4>
      <p>${escapeHTML(s.text)}</p>
      <span class="proposal-tile-price">${s.pct ? `${formatCurrency(smmlvPct(s.pct))} ${escapeHTML(s.unit)}` : escapeHTML(s.price)}</span>
    </div>
  `).join("");

  const steps = data.nextSteps.map((step, i) => `
    <div class="proposal-step">
      <span class="proposal-step-number">${i + 1}</span>
      <div><h4>${escapeHTML(step.title)}</h4><p>${escapeHTML(step.text)}</p></div>
    </div>
  `).join("");

  return `
    ${buildSectionHeading("06 · Crecimiento", "Servicios opcionales y futuras cotizaciones", "La plataforma evoluciona contigo. Estos servicios pueden incorporarse en cualquier momento mediante una cotización independiente.")}
    <div class="proposal-tiles cols-3">${services}</div>

    <h3 class="proposal-h3">Próximos pasos</h3>
    <div class="proposal-steps">${steps}</div>

    <div class="closing-box">
      <h3>¿Listo para empezar?</h3>
      <p>Estamos a tu disposición para resolver dudas, ajustar el alcance o agendar una demostración en vivo.</p>
      <div class="closing-contact">
        ${ctx.form.email ? `<span><i class="ph ph-envelope-simple"></i> ${escapeHTML(ctx.form.email)}</span>` : ""}
        ${ctx.form.phone ? `<span><i class="ph ph-whatsapp-logo"></i> ${escapeHTML(ctx.form.phone)}</span>` : ""}
      </div>
    </div>
  `;
}

/* ==========================================================================
   Helpers
   ========================================================================== */

function formatCurrency(value) {
  return "$" + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatLongDate(date) {
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

function slugify(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Carga un script externo una sola vez (resuelve de inmediato si ya está disponible).
 */
function loadExternalScript(src, isLoaded) {
  if (isLoaded()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`No se pudo cargar ${src} (¿sin conexión?).`));
    document.head.appendChild(script);
  });
}

/**
 * Exporta cada página del documento como una página del PDF, con sus dimensiones exactas.
 * Cada página se captura desde una copia fijada en (0,0) para que el sidebar, el scroll del
 * contenedor o las animaciones de la vista no desplacen ni recorten la imagen.
 */
async function exportProposalToPdf(docEl, fileName, onProgress) {
  await Promise.all([
    loadExternalScript(HTML2CANVAS_CDN, () => typeof html2canvas !== "undefined"),
    loadExternalScript(JSPDF_CDN, () => typeof window.jspdf !== "undefined")
  ]);
  if (document.fonts && document.fonts.ready) await document.fonts.ready;

  // El host replica la clase de plantilla para que las variables --pt-* sigan aplicando
  const host = document.createElement("div");
  host.className = docEl.className;
  host.style.cssText = "position: fixed; left: 0; top: 0; z-index: -1; pointer-events: none;";
  document.body.appendChild(host);

  try {
    const pages = docEl.querySelectorAll(".proposal-page");
    const { jsPDF } = window.jspdf;
    let pdf = null;

    for (let i = 0; i < pages.length; i++) {
      if (onProgress) onProgress(i + 1, pages.length);

      const clone = pages[i].cloneNode(true);
      host.replaceChildren(clone);

      const width = clone.offsetWidth;
      const height = clone.offsetHeight;
      const orientation = width > height ? "landscape" : "portrait";

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        x: 0,
        y: 0,
        width,
        height,
        scrollX: 0,
        scrollY: 0,
        windowWidth: width,
        windowHeight: height
      });

      if (!pdf) {
        pdf = new jsPDF({ orientation, unit: "pt", format: [width, height] });
      } else {
        pdf.addPage([width, height], orientation);
      }
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, width, height);
    }

    pdf.save(fileName);
  } finally {
    host.remove();
  }
}
