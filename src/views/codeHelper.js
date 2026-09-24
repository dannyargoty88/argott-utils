/**
 * Code Helper View - Argott Utils
 * Guías de comandos rápidos y cheatsheets estructuradas (Git, Docker, SQL, Linux, etc.)
 * Con buscador en tiempo real, filtro por categoría, snippets copiables con un clic y explicaciones paso a paso.
 */

const CHEATSHEET_DATA = [
  {
    category: "git",
    categoryLabel: "Git Version Control",
    icon: "ph-git-branch",
    items: [
      {
        title: "Guardar credenciales permanentemente",
        description: "Evita solicitar usuario y token cada vez que haces fetch/push.",
        command: "git config --global credential.helper store"
      },
      {
        title: "Subir rama local asignando origin remoto (-u)",
        description: "Establece el seguimiento upstream entre la rama local y remota.",
        command: "git push -u origin nombreRama"
      },
      {
        title: "Clonar / Crear rama local desde una rama remota",
        description: "Descarga la referencia remota y posiciona tu espacio de trabajo local en ella.",
        command: "git fetch origin <NOMBRE_DE_LA_RAMA>\ngit checkout -b <rama_local> origin/<rama_remota>"
      },
      {
        title: "Abortar un merge conflictivo",
        description: "Regresa el estado del repositorio a como estaba antes de iniciar el merge.",
        command: "git merge --abort"
      },
      {
        title: "Borrar rama local",
        description: "Elimina la rama local especificada.",
        command: "git branch -d <rama_local>"
      },
      {
        title: "Renombrar rama estando ubicado en ella",
        description: "Cambia el nombre de la rama actual en tu máquina.",
        command: "git branch -m <rama_local>"
      },
      {
        title: "Ver todas las ramas remotas",
        description: "Lista las referencias a ramas en el servidor de origin.",
        command: "git branch -r"
      },
      {
        title: "Actualizar / Sincronizar toda la información remota",
        description: "Descarga referencias de todos los remotos sin modificar tus archivos locales.",
        command: "git fetch --all"
      },
      {
        title: "Merge puntual de un solo archivo específico",
        description: "Trae los cambios de un único archivo desde otra rama a la tuya.",
        command: "git checkout bugfix/pagosexcel -- interface/repository/cartera/pago_repository.go\ngit add .\ngit commit -m \"fix: merge puntual de archivo pago_repository\""
      },
      {
        title: "Revertir un cambio o Merge Commit",
        description: "Crea un commit inverso eliminando los cambios introducidos por un merge previo.",
        command: "git log --oneline\ngit checkout prod\ngit revert -m 1 4b98d45c2\ngit push origin prod"
      },
      {
        title: "Devolverse a una acción realizada previamente (git reflog)",
        description: "Inspecciona el historial de punteros HEAD y restaura el estado exacto deseado.",
        command: "git reflog\n# Buscar el hash o HEAD@{n}\ngit checkout ft/329\ngit reset --hard 4f3da4d0"
      },
      {
        title: "Recuperar una rama borrada accidentalmente",
        description: "Inspecciona los commits huérfanos con reflog para reconstruir la rama original.",
        command: "git reflog\n# Ejemplo: ubicar el commit de merge o checkout\ngit show --pretty=raw 814729bdf\ngit branch ft/329 8bc5b4429b3993c6017caf67b76ca9f8ff215d1d"
      }
    ]
  },
  {
    category: "docker",
    categoryLabel: "Docker Containers & Images",
    icon: "ph-cube",
    items: [
      {
        title: "Listar contenedores activos e inactivos",
        description: "Muestra la lista completa de contenedores para obtener su ID o Nombre.",
        command: "docker ps -a"
      },
      {
        title: "Ver logs de un contenedor",
        description: "Despliega la consola de logs producida por el contenedor.",
        command: "docker logs [id_contenedor]"
      },
      {
        title: "Ver últimos 100 registros de logs",
        description: "Filtra únicamente las últimas 100 líneas emitidas.",
        command: "docker logs --tail 100 [id_contenedor]"
      },
      {
        title: "Ver logs en tiempo real (Follow tail)",
        description: "Sigue los logs en tiempo vivo a medida que se escriben.",
        command: "docker logs -f --tail 10 [id_contenedor]"
      },
      {
        title: "Eliminar contenedor detenido (forzado)",
        description: "Remueve el contenedor y sus volúmenes asociados.",
        command: "docker rm -fv sifiv-backend-qa2"
      },
      {
        title: "Ejecutar / Correr un contenedor backend",
        description: "Arranca un contenedor en modo interactivo/desacoplado mapeando puertos y variables de entorno.",
        command: "docker run -dit -p 2070:2021 --name sifiv-backend-qa2 --env SERVERENV=test2 ocalero/golang-app"
      },
      {
        title: "Listar imágenes de Docker descargadas",
        description: "Muestra las imágenes disponibles en el sistema local.",
        command: "docker images"
      },
      {
        title: "Verificar imágenes huérfanas / sin uso (dangling)",
        description: "Filtra imágenes que no tienen etiqueta ni están asociadas a un contenedor.",
        command: "docker images -f \"dangling=true\""
      },
      {
        title: "Eliminar una imagen de Docker específica",
        description: "Remueve la imagen utilizando su ID.",
        command: "docker image rm [id_de_la_imagen]"
      },
      {
        title: "Eliminar imágenes sin uso (rmi)",
        description: "Borra imágenes no utilizadas.",
        command: "docker rmi [id_de_la_imagen]"
      },
      {
        title: "Iniciar un contenedor detenido",
        description: "Re-arranca la ejecución de un contenedor existente.",
        command: "docker start [id_o_nombre_del_contenedor]"
      }
    ]
  }
];

function renderCodeHelperView(container) {
  container.innerHTML = `
    <div class="code-helper-container">
      
      <!-- Encabezado de la Vista -->
      <div class="panel-box">
        <div class="panel-header" style="justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="panel-title" style="font-size: 1.25rem;">
              <i class="ph ph-book-open" style="color: var(--accent-primary);"></i> Code Helper & Cheatsheets
            </h2>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.2rem;">
              Guía práctica de comandos esenciales para Git, Docker y desarrollo de software con copiar en un clic.
            </p>
          </div>
        </div>
      </div>

      <!-- Barra de Configuración: Selección de Guía + Buscador -->
      <div class="panel-box helper-toolbar-box">
        <div class="helper-toolbar">
          
          <!-- Seleccionar Guía -->
          <div class="converter-select-group" style="min-width: 220px;">
            <span class="converter-label">Seleccionar Guía de Código:</span>
            <select id="helper-guide-select" class="form-control converter-select">
              <option value="" selected disabled>-- Selecciona una Guía --</option>
              <option value="git">Git Version Control</option>
              <option value="docker">Docker Containers & Images</option>
            </select>
          </div>

          <!-- Buscador en tiempo real (Deshabilitado hasta elegir guía) -->
          <div class="search-box helper-search-box" style="flex: 1; align-self: flex-end;">
            <i class="ph ph-magnifying-glass"></i>
            <input type="text" id="helper-search-input" class="form-control" placeholder="Buscar comando dentro de la guía seleccionada..." disabled>
          </div>

        </div>
      </div>

      <!-- Lista de Categorías y Comandos -->
      <div id="helper-cards-container" class="helper-cards-grid">
        <!-- Inyectado dinámicamente -->
      </div>

    </div>
  `;

  setupCodeHelperEvents();
}

function setupCodeHelperEvents() {
  const guideSelect = document.getElementById("helper-guide-select");
  const searchInput = document.getElementById("helper-search-input");

  let activeCategory = "";

  if (guideSelect) {
    guideSelect.addEventListener("change", (e) => {
      activeCategory = e.target.value;
      if (searchInput) {
        searchInput.disabled = false;
        searchInput.focus();
      }
      renderHelperCards(activeCategory, searchInput ? searchInput.value : "");
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderHelperCards(activeCategory, e.target.value);
    });
  }

  // Estado inicial: Solicitar selección
  renderHelperCards("", "");
}

function renderHelperCards(categoryFilter, searchQuery) {
  const container = document.getElementById("helper-cards-container");
  if (!container) return;

  const query = searchQuery.toLowerCase().trim();

  let html = "";
  let matchCount = 0;

  CHEATSHEET_DATA.forEach(catGroup => {
    if (categoryFilter !== "all" && catGroup.category !== categoryFilter) {
      return;
    }

    const filteredItems = catGroup.items.filter(item => {
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesDesc = item.description.toLowerCase().includes(query);
      const matchesCmd = item.command.toLowerCase().includes(query);
      return matchesTitle || matchesDesc || matchesCmd;
    });

    if (filteredItems.length === 0) return;

    matchCount += filteredItems.length;

    const cardsHtml = filteredItems.map((item, idx) => `
      <div class="helper-card">
        <div class="helper-card-header">
          <div class="helper-card-title-group">
            <span class="helper-card-badge"><i class="ph ${catGroup.icon}"></i> ${catGroup.categoryLabel}</span>
            <h3 class="helper-card-title">${escapeHTML(item.title)}</h3>
          </div>
          <button class="btn-preset btn-copy-cmd" data-cmd="${escapeHTML(item.command)}" title="Copiar Comando">
            <i class="ph ph-copy"></i> Copiar
          </button>
        </div>
        <p class="helper-card-desc">${escapeHTML(item.description)}</p>
        <pre class="helper-cmd-box"><code>${highlightCmdSyntax(item.command)}</code></pre>
      </div>
    `).join("");

    html += cardsHtml;
  });

  if (!categoryFilter) {
    container.innerHTML = `
      <div class="panel-box" style="width: 100%; grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem;">
        <div class="empty-state">
          <i class="ph ph-hand-pointing" style="font-size: 3rem; color: var(--accent-primary); margin-bottom: 0.8rem;"></i>
          <h3 style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.4rem;">Selecciona una Guía de Código</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 420px; margin: 0 auto;">
            Elige una opción en el menú superior (ej. <strong>Git Version Control</strong> o <strong>Docker Containers</strong>) para explorar los comandos y ejemplos.
          </p>
        </div>
      </div>
    `;
    return;
  }

  if (matchCount === 0) {
    container.innerHTML = `
      <div class="panel-box" style="width: 100%; grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <div class="empty-state">
          <i class="ph ph-magnifying-glass"></i>
          <p>No se encontraron comandos para "<strong>${escapeHTML(searchQuery)}</strong>"</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = html;

  // Event Listeners de Copiado Rápido
  container.querySelectorAll(".btn-copy-cmd").forEach(btn => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      if (!cmd) return;

      navigator.clipboard.writeText(cmd).then(() => {
        if (typeof ArgottAlert !== "undefined") {
          ArgottAlert.toast("Comando copiado al portapapeles", "success");
        }
      });
    });
  });
}

/**
 * Resaltado sintáctico rápido para comandos bash/docker/git
 */
/**
 * Resaltado sintáctico limpio para comandos bash/docker/git
 */
function highlightCmdSyntax(cmd) {
  let str = escapeHTML(cmd);

  // 1. Resaltar flags y opciones (-a, --tail, -f, -dit, etc.)
  str = str.replace(/(^|\s)(--[a-zA-Z0-9_-]+|-[a-zA-Z0-9]+)/g, '$1<span class="cmd-flag">$2</span>');

  // 2. Resaltar comandos principales de Git / Docker
  str = str.replace(/(^|\s)(git|docker|run|ps|images|rm|rmi|start|logs|checkout|push|pull|fetch|commit|add|merge|revert|reflog|reset|branch|show|config)\b/g, '$1<span class="cmd-keyword">$2</span>');

  // 3. Resaltar parámetros con corchetes o signos <rama>
  str = str.replace(/(&lt;[^&]+&gt;|\[[^\]]+\])/g, '<span class="cmd-param">$1</span>');

  return str;
}
