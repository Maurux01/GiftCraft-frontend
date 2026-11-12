document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();
    inicializarMetodosPago();

    const btnVaciarCarrito = document.querySelector("#btn-vaciar-carrito");

    if (btnVaciarCarrito) {
        btnVaciarCarrito.addEventListener("click", vaciarCarrito);
    }
});

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

function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const tbody = document.querySelector("#tbody-carrito");
    const contadorArticulos = document.querySelector("#contador-articulos");

    if (!tbody) return;

    tbody.innerHTML = "";

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

        // Texto informativo de color y tamaño
        const detalles = (producto.colorElegido || producto.tamanoElegido)
            ? `Color: ${producto.colorElegido || 'Estándar'} | Tamaño: ${producto.tamanoElegido || 'Estándar'}`
            : (producto.categoria || '');

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center gap-3">
                    <img src="${producto.imagen || '../ASSETS/img/regalo.png'}" alt="${producto.nombre}" class="cart-item-img">
                    <div>
                        <h6 class="mb-0 fw-bold">${producto.nombre}</h6>
                        <small class="text-muted d-block">${detalles}</small>
                    </div>
                </div>
            </td>
            <td class="text-center">$${precioUnitario.toLocaleString("es-CO")}</td>
            <td class="text-center">
                <input type="number" 
                       class="form-control form-control-sm qty-input mx-auto" 
                       value="${cantidad}" 
                       min="1" 
                       onchange="cambiarCantidad(${index}, this.value)">
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

function cambiarCantidad(index, nuevaCantidad) {
    let carrito = obtenerCarrito();
    const cantidadNumerica = parseInt(nuevaCantidad);

    if (cantidadNumerica > 0 && carrito[index]) {
        carrito[index].cantidad = cantidadNumerica;
        localStorage.setItem("carritoGiftcraft", JSON.stringify(carrito));
        renderizarCarrito();
        //ACTUALIZAR EL CONTADORES EN TIEMPO REAL
        actualizarContadorCarrito();
    }
}

function eliminarProducto(index) {
    let carrito = obtenerCarrito();
    carrito.splice(index, 1);
    localStorage.setItem("carritoGiftcraft", JSON.stringify(carrito));
    renderizarCarrito();
    //ACTUALIZAR EL CONTADORES EN TIEMPO REAL
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    const carrito = obtenerCarrito();
    // Evitar confirmación si el carrito está vacío
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'No tienes productos para eliminar.',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Confirmar antes de eliminar todos los productos
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se eliminarán todos los productos de tu carrito.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("carritoGiftcraft");

            renderizarCarrito();

            //ACTUALIZAR EL CONTADORES EN TIEMPO REAL
            actualizarContadorCarrito();

            Swal.fire({
                icon: 'success',
                title: '¡Carrito vaciado!',
                text: 'Todos los productos fueron eliminados correctamente.',
                confirmButtonText: 'Entendido'
            });
        }
    });
}
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