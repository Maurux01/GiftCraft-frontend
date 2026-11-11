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
    }
});

