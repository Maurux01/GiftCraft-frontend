document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();
    inicializarMetodosPago();

    const btnVaciarCarrito = document.querySelector("#btn-vaciar-carrito");

    if (btnVaciarCarrito) {
        btnVaciarCarrito.addEventListener("click", vaciarCarrito);
    }
});

//Obtener carrito de localStorage de forma segura
function obtenerCarrito() {
    const datos = localStorage.getItem("carritoGiftcraft");
    if (datos && datos !== "undefined") {
        try {
            return JSON.parse(datos);
        } catch (e) {
            console.error("Error al parsear el carrito:", e);
            return [];
        }
    }
    return [];
}

// Cargar tabla de productos y calcular totales
function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const tbody = document.querySelector("#tbody-carrito");
    const contadorArticulos = document.querySelector("#contador-articulos");

    if (!tbody) return;

    tbody.innerHTML = "";

    // Si el carrito está vacío
    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <p class="mb-0 text-muted fs-5">Tu carrito está vacío 🛒</p>
                    <a href="productos.html" class="btn btn-sm btn-outline-primary mt-2 rounded-pill">Ver productos</a>
                </td>
            </tr>
        `;
        if (contadorArticulos) contadorArticulos.textContent = "0 artículos";
        actualizarTotales(0);
        return;
    }

    let subtotalGeneral = 0;
    let totalItemsCount = 0;

    carrito.forEach((producto, index) => {
        const precioUnitario = Number(producto.precio) || 0;
        const cantidad = Number(producto.cantidad) || 1;
        const subtotalItem = precioUnitario * cantidad;

        subtotalGeneral += subtotalItem;
        totalItemsCount += cantidad;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center gap-3">
                    <img src="${producto.imagen || '../ASSETS/img/regalo.png'}" alt="${producto.nombre}" class="cart-item-img">
                    <div>
                        <h6 class="mb-0 fw-bold">${producto.nombre}</h6>
                        <small class="text-muted">${producto.categoria || ''}</small>
                    </div>
                </div>
            </td>
            <td class="text-center">$${precioUnitario.toLocaleString("es-CO")}</td>
            <td class="text-center">
                <span class="fw-semibold">${cantidad}</span>
            </td>
            <td class="text-center fw-bold">$${subtotalItem.toLocaleString("es-CO")}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${index})" aria-label="Quitar">
                    <i class="bi bi-trash3"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (contadorArticulos) {
        contadorArticulos.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'artículo' : 'artículos'}`;
    }

    actualizarTotales(subtotalGeneral);
}

//Eliminar producto del carrito
function eliminarProducto(index) {
    let carrito = obtenerCarrito();
    carrito.splice(index, 1);
    localStorage.setItem("carritoGiftcraft", JSON.stringify(carrito));
    window.dispatchEvent(new Event("carritoActualizado"));
}

function actualizarVistasCarrito() {
    renderizarCarrito();

    if (typeof renderizarOffcanvas === "function") {
        renderizarOffcanvas();
    }

    if (typeof actualizarContadorCarrito === "function") {
        actualizarContadorCarrito();
    }
}

// Cambios realizados en la misma página
window.addEventListener("carritoActualizado", actualizarVistasCarrito);

// Cambios realizados desde otra pestaña
window.addEventListener("storage", (event) => {
    if (event.key === "carritoGiftcraft" || event.key === null) {
        actualizarVistasCarrito();
    }
});


window.addEventListener("carritoActualizado", () => {
    renderizarCarrito();

    if (typeof renderizarOffcanvas === "function") {
        renderizarOffcanvas();
    }

    if (typeof actualizarContadorCarrito === "function") {
        actualizarContadorCarrito();
    }
});

// Vaciar todo el carrito
function vaciarCarrito() {
    const carrito = obtenerCarrito();

    // Verificar si el carrito ya está vacío
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'No tienes productos para eliminar.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#C77D9F'
        });
        return;
    }

    // Solicitar confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminarán todos los productos de tu carrito.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#C77D9F',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("carritoGiftcraft");
            window.dispatchEvent(new Event("carritoActualizado"));
            renderizarCarrito();

            Swal.fire({
                icon: 'success',
                title: '¡Carrito vaciado!',
                text: 'Todos los productos fueron eliminados correctamente.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#C77D9F'
            });
        }

        localStorage.removeItem("carritoGiftcraft");

        window.dispatchEvent(new Event("carritoActualizado"));
    });
}

// Recalcular Subtotal, Envío y Total en la UI
function actualizarTotales(subtotal) {
    const costoEnvio = subtotal > 0 ? 12000 : 0;
    const total = subtotal + costoEnvio;

    const elSubtotal = document.querySelector("#resumen-subtotal");
    const elEnvio = document.querySelector("#resumen-envio");
    const elTotal = document.querySelector("#resumen-total");
    const btnPagar = document.querySelector("#btn-pagar");

    if (elSubtotal) elSubtotal.textContent = `$${subtotal.toLocaleString("es-CO")}`;
    if (elEnvio) elEnvio.textContent = `$${costoEnvio.toLocaleString("es-CO")}`;
    if (elTotal) elTotal.textContent = `$${total.toLocaleString("es-CO")}`;
    if (btnPagar) btnPagar.innerHTML = `<i class="bi bi-lock-fill"></i> Pagar $${total.toLocaleString("es-CO")}`;
}

//Métodos de pago 
function inicializarMetodosPago() {
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            const radio = option.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            const tarjeta = document.getElementById('datosTarjeta');
            if (tarjeta) tarjeta.style.display = radio && radio.id === 'pagoTarjeta' ? 'block' : 'none';
        });
    });
}