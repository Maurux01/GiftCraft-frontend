// Renderiza componentes reutilizables (header/footer) en todas las paginas

function getRootPrefix() {
    // Prefijo relativo desde la pagina actual hasta la raiz del proyecto.
    // Se infiere de la ruta del propio script components.js (ej. "../../JS/components.js").
    const script = document.querySelector('script[src*="components.js"]');
    const src = script ? (script.getAttribute('src') || '') : '';
    const match = src.match(/^(\.\.\/)+/);
    return match ? match[0] : '';
}

function getBasePath() {
    return getRootPrefix();
}

function getComponentsBasePath() {
    // Los componentes viven siempre en <raiz>/HTML/Components/.
    return getRootPrefix() + 'HTML/Components/';
}

function cargarComponente(id, archivo) {
    const url = getComponentsBasePath() + archivo;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`No se pudo cargar ${url} (${response.status})`);
            return response.text();
        })
        .then(data => {
            const contenedor = document.getElementById(id);
            if (contenedor) {
                contenedor.innerHTML = data;
                if (id === 'header-placeholder') {
                    ajustarRutasHeader(contenedor);
                    marcarActivoHeader(contenedor);
                    // Inicializar offcanvas global del carrito
                    if (typeof renderizarOffcanvas === 'function') {
                        renderizarOffcanvas();
                    }
                    inicializarEventosOffcanvas();
                    actualizarContadorCarrito();
                    window.dispatchEvent(new CustomEvent('headerLoaded'));
                }
                if (id === 'footer-placeholder') {
                    ajustarRutasFooter(contenedor);
                }
            }
        })
        .catch(error => console.error('Error cargando componente:', error));
}

function ajustarRutasHeader(contenedor) {
    const prefix = getRootPrefix();
    contenedor.querySelectorAll('a[href^="/"]').forEach(a => {
        const href = a.getAttribute('href');
        a.setAttribute('href', prefix + href.replace(/^\/+/, ''));
    });
    contenedor.querySelectorAll('img[src^="/"]').forEach(img => {
        const src = img.getAttribute('src');
        img.setAttribute('src', prefix + src.replace(/^\/+/, ''));
    });
}

function ajustarRutasFooter(contenedor) {
    const prefix = getRootPrefix();
    contenedor.querySelectorAll('a[href^="/"]').forEach(a => {
        const href = a.getAttribute('href');
        a.setAttribute('href', prefix + href.replace(/^\/+/, ''));
    });
    contenedor.querySelectorAll('img[src^="/"]').forEach(img => {
        const src = img.getAttribute('src');
        img.setAttribute('src', prefix + src.replace(/^\/+/, ''));
    });
}

function marcarActivoHeader(contenedor) {
    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    contenedor.querySelectorAll('.gc-menu .nav-link').forEach(link => {
        link.classList.remove('active');
        const linkFile = (new URL(link.href, window.location.href).pathname.split('/').pop() || 'index.html').toLowerCase();
        if (linkFile === current || (current === '' && linkFile === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function asegurarPlaceholder(id, posicion) {
    if (document.getElementById(id)) return;
    const div = document.createElement('div');
    div.id = id;
    if (posicion === 'footer') {
        document.body.appendChild(div);
    } else {
        document.body.insertBefore(div, document.body.firstChild);
    }
}

function cargarEstiloHeader() {
    const id = 'header-component-style';
    if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = getBasePath() + 'CSS/components/header.css';
        document.head.appendChild(link);
    }

    // Bootstrap Icons (necesario para los iconos del header)
    const iconsId = 'bootstrap-icons-cdn';
    if (!document.getElementById(iconsId) && !document.querySelector('link[href*="bootstrap-icons"]')) {
        const icons = document.createElement('link');
        icons.id = iconsId;
        icons.rel = 'stylesheet';
        icons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.2/font/bootstrap-icons.min.css';
        document.head.appendChild(icons);
    }
}

function cargarEstiloFooter() {
    const id = 'footer-component-style';
    if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = getBasePath() + 'CSS/components/footer.css';
        document.head.appendChild(link);
    }
}

// Ejecutar al cargar la pagina
document.addEventListener('DOMContentLoaded', () => {
    cargarEstiloHeader();
    cargarEstiloFooter();
    asegurarPlaceholder('header-placeholder', 'header');
    asegurarPlaceholder('footer-placeholder', 'footer');

    cargarComponente('header-placeholder', 'header.html');
    cargarComponente('footer-placeholder', 'footer.html');
});

// Función global para actualizar todos los contadores del carrito
function actualizarContadorCarrito() {
    const datos = localStorage.getItem("carritoGiftcraft");
    const carrito = (datos && datos !== "undefined") ? JSON.parse(datos) : [];

    // Sumar la cantidad total de artículos
    const totalArticulos = carrito.reduce((sum, item) => sum + (Number(item.cantidad) || 1), 0);

    // Buscar los badges en el HTML
    const elementosContador = document.querySelectorAll(".contador-carrito, #contador-articulos");
    
    elementosContador.forEach(el => {
        el.textContent = totalArticulos;
    });
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
    
    // Si usas renderizado dinámico de componentes (header-placeholder), reintentamos a los 300ms
    setTimeout(actualizarContadorCarrito, 300);
});

// 2. Escuchar cambios desde otras pestañas
window.addEventListener("storage", (e) => {
    if (e.key === "carritoGiftcraft") {
        actualizarContadorCarrito();
        if (typeof renderizarCarrito === "function") {
            renderizarCarrito();
        }
        if (typeof renderizarOffcanvas === "function") {
            renderizarOffcanvas();
        }
    }
});

// --- Offcanvas global del carrito ---
function obtenerCarritoLocal() {
    const carritoGuardado = localStorage.getItem("carritoGiftcraft");
    if (carritoGuardado && carritoGuardado !== "undefined") {
        try {
            return JSON.parse(carritoGuardado);
        } catch (error) {
            console.error("Error al leer el carrito de localStorage:", error);
            return [];
        }
    }
    return [];
}

function renderizarOffcanvas() {
    const offcanvas = document.getElementById("offcanvasCart");
    if (!offcanvas) return;
    const lista = offcanvas.querySelector("ul.list-group");
    if (!lista) return;
    const totalLi = lista.querySelector("li.fw-bold");
    // Limpiar items existentes (conservar el li de total)
    lista.querySelectorAll("li[data-precio]").forEach((li) => li.remove());

    const carrito = obtenerCarritoLocal();
    carrito.forEach((producto, index) => {
        const precio = Number(producto.precio) || 0;
        const cantidad = Number(producto.cantidad) || 1;
        const subtotal = precio * cantidad;
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center gc-cart-item";
        li.setAttribute("data-precio", String(subtotal));
        li.setAttribute("data-nombre", producto.nombre);
        li.setAttribute("data-index", String(index));
        li.innerHTML = `
            <span class="gc-cart-item-name">${producto.nombre}</span>
            <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
                <div class="gc-qty-control d-flex align-items-center gap-1">
                    <button type="button" class="btn btn-sm gc-qty-btn gc-qty-dec" data-index="${index}" aria-label="Disminuir cantidad">-</button>
                    <span class="gc-qty-value">${cantidad}</span>
                    <button type="button" class="btn btn-sm gc-qty-btn gc-qty-inc" data-index="${index}" aria-label="Aumentar cantidad">+</button>
                </div>
                <span class="badge bg-primary rounded-pill">$${subtotal.toLocaleString("es-CO")}</span>
                <button type="button" class="btn btn-sm btn-outline-danger" data-index="${index}" aria-label="Eliminar ${producto.nombre}">Eliminar</button>
            </div>
        `;
        if (totalLi) {
            lista.insertBefore(li, totalLi);
        } else {
            lista.appendChild(li);
        }
    });

    recalcularTotalOffcanvas();
}

function recalcularTotalOffcanvas() {
    const offcanvas = document.getElementById("offcanvasCart");
    if (!offcanvas) return;
    const lista = offcanvas.querySelector("ul.list-group");
    const totalBadge = offcanvas.querySelector("li.fw-bold .badge");
    if (!lista) return;
    let total = 0;
    lista.querySelectorAll("li[data-precio]").forEach((li) => {
        total += parseInt(li.getAttribute("data-precio"), 10) || 0;
    });
    if (totalBadge) {
        totalBadge.textContent = "$" + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}

let _offcanvasEventosInicializados = false;
function inicializarEventosOffcanvas() {
    if (_offcanvasEventosInicializados) return;
    const offcanvasEl = document.getElementById("offcanvasCart");
    if (!offcanvasEl) return;
    _offcanvasEventosInicializados = true;
    offcanvasEl.addEventListener("click", (e) => {
        const btnInc = e.target.closest("button.gc-qty-inc");
        const btnDec = e.target.closest("button.gc-qty-dec");
        const btnEliminar = e.target.closest("button.btn-outline-danger");

        let carrito = obtenerCarritoLocal();
        let changed = false;

        if (btnInc || btnDec) {
            const btn = btnInc || btnDec;
            const idx = parseInt(btn.getAttribute("data-index"), 10);
            if (!isNaN(idx) && carrito[idx]) {
                const delta = btnInc ? 1 : -1;
                const nuevaCantidad = (Number(carrito[idx].cantidad) || 1) + delta;
                if (nuevaCantidad < 1) {
                    carrito.splice(idx, 1);
                } else {
                    carrito[idx].cantidad = nuevaCantidad;
                }
                changed = true;
            }
        } else if (btnEliminar) {
            const idx = parseInt(btnEliminar.getAttribute("data-index"), 10);
            if (!isNaN(idx) && carrito[idx]) {
                carrito.splice(idx, 1);
                changed = true;
            } else {
                const li = btnEliminar.closest("li[data-precio]");
                const nombre = li ? li.getAttribute("data-nombre") : null;
                const i = carrito.findIndex((p) => p.nombre === nombre);
                if (i !== -1) {
                    carrito.splice(i, 1);
                    changed = true;
                }
            }
        }

        if (changed) {
            localStorage.setItem("carritoGiftcraft", JSON.stringify(carrito));
            renderizarOffcanvas();
            actualizarContadorCarrito();
        }
    });
}

