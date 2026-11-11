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

// Obtener el carrito guardado para el offcanvas
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

document.addEventListener("DOMContentLoaded", () => {
    //Json para traer los productos cargados por admin en el LS
    const productos = JSON.parse(localStorage.getItem("productosGiftcraft")) || [];
    const contenedor = document.getElementById("contenedorProductos");

    if (!contenedor) return;

    //SI NO HAY PRODUCTOS
    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>No hay productos registrados</h4>
            </div>
        `;
        return;
    }

    // GENERAR CARDS DINÁMICAS
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
                        <p class="card-precio">$${Number(producto.precio).toLocaleString("es-CO")}</p>
                    </div>
                    <div class="d-flex gap-3">
                        <button
                            class="btn btn-personalizar"
                            type="button"
                            data-producto-id="${producto.id}"
                            data-bs-toggle="modal"
                            data-bs-target="#modalPersonalizarProducto"
                        >
                            <i class="bi bi-pencil"></i>
                            Personalizar
                        </button>
                        <button
                            class="btn btn-carrito"
                            type="button"
                            aria-label="Agregar al carrito"
                            data-producto-id="${producto.id}"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasCart"
                        >
                            <i class="bi bi-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        contenedor.appendChild(columna);
    });

    // ACTIVAR EVENTOS DE LOS BOTONES 
    escucharBotonesCarrito(productos);

    // MOSTRAR INFORMACIÓN DEL PRODUCTO EN EL MODAL CUANDO SE DA CLIC EN "PERSONALIZAR"
    contenedor.addEventListener("click", (e) => {
        const btnPersonalizar = e.target.closest("button[data-bs-target='#modalPersonalizarProducto']");

        if (!btnPersonalizar) return;

        const productoId = btnPersonalizar.dataset.productoId;
        const productoSeleccionado = productos.find(
            (p) => String(p.id) === String(productoId)
        );

        if (!productoSeleccionado) return;

        // Guardamos la referencia global del producto que se está personalizando
        productoActualModal = productoSeleccionado;

        // Llenar datos básicos en el modal
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

        // GENERAR RADIO BUTTONS DE COLOR
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
                    if (index === 0) input.checked = true; // Seleccionar el primero por defecto

                    const label = document.createElement("label");
                    label.className = "btn btn-outline-secondary";
                    label.htmlFor = input.id;
                    label.textContent = color;

                    colores.append(input, label);
                });
            } else {
                colores.textContent = "No hay colores especificados.";
            }
        }

        // GENERAR RADIO BUTTONS DE TAMAÑO
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
                    if (index === 0) input.checked = true; // Seleccionar el primero por defecto

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

    //ESCUCHAR EL BOTÓN DENTRO DEL MODAL Y TOMAR LA PERSONALIZACIÓN ELEGIDA
    if (botonModalAgregar) {
        botonModalAgregar.addEventListener("click", () => {
            if (!productoActualModal) return;

            // BUSCAR LOS RADIOS SELECCIONADOS DIRECTAMENTE DENTRO DE SUS CONTENEDORES
            const colorChecked = colores ? colores.querySelector("input[name='opcionColor']:checked") : null;
            const tamanoChecked = tamanios ? tamanios.querySelector("input[name='opcionTamano']:checked") : null;

            const colorElegido = colorChecked ? colorChecked.value : "Estándar";
            const tamanoElegido = tamanoChecked ? tamanoChecked.value : "Estándar";

            let carrito = obtenerCarritoLocal();

            // Buscar si ya existe el producto con la MISMA combinación de ID, Color y Tamaño
            const indexExistente = carrito.findIndex(p =>
                String(p.id) === String(productoActualModal.id) &&
                p.colorElegido === colorElegido &&
                p.tamanoElegido === tamanoElegido
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

            // Guardar carrito actualizado
            localStorage.setItem("carritoGiftcraft", JSON.stringify(carrito));

            // Feedback visual al usuario
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    title: "¡Producto agregado!",
                    text: `${productoActualModal.nombre} (${colorElegido}, ${tamanoElegido}) fue añadido a tu carrito.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            // Cerrar el modal de Bootstrap
            const modalEl = document.getElementById("modalPersonalizarProducto");
            if (modalEl) {
                const instancia = bootstrap.Modal.getOrCreateInstance(modalEl);
                instancia.hide();
            }
        });
    }

    // Función para el botón directo de carrito de las cards 
    function escucharBotonesCarrito(productos) {
        const botonesCarrito = document.querySelectorAll(".btnAgregarDesdeModal");

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
                    console.log("Producto básico agregado al carrito:", productoEncontrado.nombre);
                }
            });
        });
    }
});