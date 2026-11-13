// Convierte un HEX a un nombre de color aproximado
function nombreColorHex(hex) {
    const valor = String(hex ?? "").trim();
    if (!valor) return "Color";
    if (!valor.startsWith("#")) return valor; // ya es un nombre
    const limpio = valor.replace("#", "");
    let full = limpio;
    if (limpio.length === 3) full = limpio.split("").map(c => c + c).join("");
    if (full.length !== 6) return valor;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    const paleta = [
        { nombre: "Rojo", hex: "FF0000" }, { nombre: "Verde", hex: "008000" },
        { nombre: "Azul", hex: "0000FF" }, { nombre: "Amarillo", hex: "FFFF00" },
        { nombre: "Naranja", hex: "FFA500" }, { nombre: "Morado", hex: "800080" },
        { nombre: "Rosa", hex: "FFC0CB" }, { nombre: "Negro", hex: "000000" },
        { nombre: "Blanco", hex: "FFFFFF" }, { nombre: "Gris", hex: "808080" },
        { nombre: "Marrón", hex: "8B4513" }, { nombre: "Turquesa", hex: "40E0D0" },
        { nombre: "Celeste", hex: "87CEEB" }, { nombre: "Verde lima", hex: "00FF00" },
        { nombre: "Magenta", hex: "FF00FF" }, { nombre: "Cian", hex: "00FFFF" },
        { nombre: "Dorado", hex: "FFD700" }, { nombre: "Plateado", hex: "C0C0C0" },
        { nombre: "Beige", hex: "F5F5DC" }, { nombre: "Coral", hex: "FF7F50" }
    ];
    let mejor = paleta[0];
    let minDist = Infinity;
    paleta.forEach(c => {
        const cr = parseInt(c.hex.slice(0, 2), 16);
        const cg = parseInt(c.hex.slice(2, 4), 16);
        const cb = parseInt(c.hex.slice(4, 6), 16);
        const dist = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
        if (dist < minDist) { minDist = dist; mejor = c; }
    });
    return mejor.nombre;
}

// ELEMENTOS DEL MODAL (Variables globales)
const imagen = document.getElementById("imagenVisualizacion");
const nombre = document.getElementById("modalPersonalizarLabel");
const descripcion = document.getElementById("modalDescripcion");
const precio = document.getElementById("modalPrecio");
const stock = document.getElementById("modalStock");
const colores = document.getElementById("modalColores");
const tamanios = document.getElementById("modalTamanios");
const botonModalAgregar = document.getElementById("btnAgregarDesdeModal");

// Variable global para saber qué producto está cargado actualmente en el modal
let productoActualModal = null;

// Función auxiliar para obtener el carrito de localStorage
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


// Cuando el header (y su offcanvas) terminen de cargar, renderizar el carrito
window.addEventListener("headerLoaded", () => {
    if (typeof renderizarOffcanvas === "function") {
        renderizarOffcanvas();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const productos = JSON.parse(localStorage.getItem("productosGiftcraft")) || [];
    const contenedor = document.getElementById("contenedorProductos");

    if (!contenedor) return;

    // 1. SI NO HAY PRODUCTOS
    if (productos.length === 0) {
        contenedor.innerHTML = `
        <div class="col-12 d-flex justify-content-center align-items-center">
            <div class="mensaje-sin-productos-contenedor text-center">
                <h4 class="mensaje-sin-productos">
                    No hay productos registrados
                </h4>
            </div>
        </div>`;
        return;
    }

    //GENERAR CARDS DINÁMICAS
    contenedor.innerHTML = "";
    productos.forEach((producto) => {
        const columna = document.createElement("div");
        columna.classList.add("col");

        columna.innerHTML = `
            <div class="card h-100">
                <img
                    src="${producto.imagen || ''}"
                    class="card-img-top"
                    alt="${producto.nombre}"
                    style="height: 250px; object-fit: contain;"
                >
                <div class="card-body">
                    <div class="card-info">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.categoria || ''}</p>
                        <div class="d-flex align-items-center justify-content-between mt-2 gap-3">
                            <p class="card-precio mb-0">$${Number(producto.precio).toLocaleString("es-CO")}</p>
                            <button
                                class="btn btn-personalizar"
                                type="button"
                                data-producto-id="${producto.id}"
                                data-bs-toggle="modal"
                                data-bs-target="#modalPersonalizarProducto"
                            >
                                <i class="bi bi-cart"></i>
                                Comprar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        contenedor.appendChild(columna);
    });

    // ACTIVAR EVENTOS DE LOS BOTONES "AGREGAR AL CARRITO" DE LAS CARDS
    escucharBotonesCarrito(productos);

    // Renderizar offcanvas del carrito con lo guardado en localStorage
    renderizarOffcanvas();

    // MOSTRAR INFORMACIÓN DEL PRODUCTO EN EL MODAL (Delegación de eventos)
    contenedor.addEventListener("click", (e) => {
        const btnPersonalizar = e.target.closest("button[data-bs-target='#modalPersonalizarProducto']");

        if (!btnPersonalizar) return;

        const productoId = btnPersonalizar.dataset.productoId;
        const productoSeleccionado = productos.find(
            (p) => String(p.id) === String(productoId)
        );

        if (!productoSeleccionado) return;

        // Guardamos la referencia global del producto seleccionado
        productoActualModal = productoSeleccionado;

        // Llenar datos en el modal
        if (imagen) {
            imagen.src = productoSeleccionado.imagen || "";
            imagen.alt = productoSeleccionado.nombre;
        }
        if (nombre) nombre.textContent = productoSeleccionado.nombre;
        if (descripcion) descripcion.textContent = productoSeleccionado.descripcion || "Sin descripción disponible.";
        if (precio) precio.textContent = `$${Number(productoSeleccionado.precio).toLocaleString("es-CO")}`;

        if (stock) {
            stock.innerHTML = `
                <i class="bi bi-box-seam"></i>
                Stock: ${productoSeleccionado.stock ?? 0} disponibles
            `;
        }

        // GENERAR OPCIONES DE COLOR
        if (colores) {
            colores.replaceChildren();
            const listaColores = productoSeleccionado.colores || [];

            if (listaColores.length > 0) {
                listaColores.forEach((color, index) => {
                    const input = document.createElement("input");
                    input.type = "radio";
                    input.className = "btn-check";
                    input.name = "opcionColor";
                    input.id = `colorProducto${index}`;
                    input.value = color;
                    input.autocomplete = "off";
                    if (index === 0) input.checked = true;

                    const label = document.createElement("label");
                    label.className = "btn btn-outline-secondary";
                    label.htmlFor = input.id;
                    label.textContent = nombreColorHex(color);
                    label.title = color;

                    // Si el color es un HEX válido, pintar el botón con ese color
                    const hexMatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color.trim());
                    if (hexMatch) {
                        label.style.backgroundColor = color.trim();
                        // Elegir color de texto legible según luminancia
                        const hex = color.trim().replace("#", "");
                        const full = hex.length === 3 ? hex.split("").map(c => c + c).join("") : hex;
                        const r = parseInt(full.substring(0, 2), 16);
                        const g = parseInt(full.substring(2, 4), 16);
                        const b = parseInt(full.substring(4, 6), 16);
                        const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                        label.style.color = luminancia > 0.5 ? "#1a1a1a" : "#ffffff";
                        label.style.borderColor = "#5a3e2b";
                    }

                    colores.append(input, label);
                });
            } else {
                colores.textContent = "No hay colores especificados.";
            }
        }

        // GENERAR OPCIONES DE TAMAÑO
        if (tamanios) {
            tamanios.replaceChildren();
            const listaTamanios = productoSeleccionado.tamanios || [];

            if (listaTamanios.length > 0) {
                listaTamanios.forEach((tamano, index) => {
                    const input = document.createElement("input");
                    input.type = "radio";
                    input.className = "btn-check";
                    input.name = "opcionTamano";
                    input.id = `tamanoProducto${index}`;
                    input.value = tamano;
                    input.autocomplete = "off";
                    if (index === 0) input.checked = true;

                    const label = document.createElement("label");
                    label.className = "btn btn-tamanio";
                    label.htmlFor = input.id;
                    label.textContent = tamano;

                    tamanios.append(input, label);
                });
            } else {
                tamanios.textContent = "No hay tamaños especificados.";
            }
        }
    });

    // 5. ACCIÓN DEL BOTÓN DENTRO DEL MODAL (AGREGAR PRODUCTO PERSONALIZADO)
    if (botonModalAgregar) {
        botonModalAgregar.addEventListener("click", () => {
            if (!productoActualModal) return;

            // Obtener color y tamaño seleccionados en el modal
            const colorChecked = colores ? colores.querySelector("input[name='opcionColor']:checked") : null;
            const tamanoChecked = tamanios ? tamanios.querySelector("input[name='opcionTamano']:checked") : null;

            const normalizar = (v) => String(v ?? "Estándar").trim();
            const colorElegido = normalizar(colorChecked ? colorChecked.value : "Estándar");
            const tamanoElegido = normalizar(tamanoChecked ? tamanoChecked.value : "Estándar");

            let carrito = obtenerCarritoLocal();

            // Buscar si ya existe el producto exactamente con ese mismo color y tamaño
            const indexExistente = carrito.findIndex(p =>
                String(p.id) === String(productoActualModal.id) &&
                normalizar(p.colorElegido) === colorElegido &&
                normalizar(p.tamanoElegido) === tamanoElegido
            );

            if (indexExistente !== -1) {
                carrito[indexExistente].cantidad += 1;
            } else {
                carrito.push({
                    ...productoActualModal,
                    colorElegido: colorElegido,
                    tamanoElegido: tamanoElegido,
                    cantidad: 1
                });
            }

            localStorage.setItem("carritoGiftcraft", JSON.stringify(carrito));

            // Actualizar contador y toggle
            actualizarContadorCarrito();
            renderizarOffcanvas();

            // Notificar a la pasarela
            window.dispatchEvent(new Event("carritoActualizado"));

            // Cerrar el modal de Bootstrap
            const modalEl = document.getElementById("modalPersonalizarProducto");
            if (modalEl) {
                const instancia = bootstrap.Modal.getOrCreateInstance(modalEl);
                instancia.hide();
            }

            // Alerta visual de éxito y, al confirmar/cerrar, abrir el offcanvas del carrito
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    title: "¡Producto agregado!",
                    text: `${productoActualModal.nombre} (${colorElegido}, ${tamanoElegido}) fue añadido a tu carrito.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    const offcanvasCartEl = document.getElementById("offcanvasCart");
                    if (offcanvasCartEl && typeof bootstrap !== "undefined") {
                        const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasCartEl);
                        offcanvas.show();
                    }
                });
            } else {
                const offcanvasCartEl = document.getElementById("offcanvasCart");
                if (offcanvasCartEl && typeof bootstrap !== "undefined") {
                    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasCartEl);
                    offcanvas.show();
                }
            }
        });
    }
});

// Función encargada de vincular el clic a todos los botones de "Agregar al carrito" en la card
function escucharBotonesCarrito(productos) {
    const botonesCarrito = document.querySelectorAll(".btn-carrito");

    botonesCarrito.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const idSeleccionado = e.currentTarget.dataset.productoId;
            const productoEncontrado = productos.find(
                (p) => String(p.id) === String(idSeleccionado)
            );

            if (productoEncontrado) {
                let carrito = obtenerCarritoLocal();

                // Buscar un producto que se haya agregado directamente sin opciones personalizadas
                const indexExistente = carrito.findIndex(
                    (p) => String(p.id) === String(idSeleccionado) && !p.colorElegido
                );

                if (indexExistente !== -1) {
                    carrito[indexExistente].cantidad += 1;
                } else {
                    carrito.push({
                        ...productoEncontrado,
                        colorElegido: "Estándar",
                        tamanoElegido: "Estándar",
                        cantidad: 1
                    });
                }

                localStorage.setItem("carritoGiftcraft", JSON.stringify(carrito));

                actualizarContadorCarrito();
                renderizarOffcanvas();

                // Notificar a la pasarela
                window.dispatchEvent(new Event("carritoActualizado"));

                console.log("Producto básico agregado al carrito:", productoEncontrado.nombre);
            }
        });
    });
}


