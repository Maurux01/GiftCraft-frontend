// ELEMENTOS DEL MODAL
const imagen = document.getElementById("imagenVisualizacion");
const nombre = document.getElementById("modalPersonalizarLabel");
const descripcion = document.getElementById("modalDescripcion");
const precio = document.getElementById("modalPrecio");
const stock = document.getElementById("modalStock");
const colores = document.getElementById("modalColores");
const tamanios = document.getElementById("modalTamanios");

document.addEventListener("DOMContentLoaded", () => {
    const productos = JSON.parse(localStorage.getItem("productosGiftcraft")) || [];
    const contenedor = document.getElementById("contenedorProductos");

    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>No hay productos registrados</h4>
            </div>
        `;
        return;
    }

    // GENERAR CARDS DINÁMICAS
    productos.forEach(producto => {
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
                        <p class="card-text">${producto.categoria}</p>
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
                             data-bs-target="#offcanvasCart"
                        >
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>

                </div>
            </div>
        `;

        contenedor.appendChild(columna);
    });

    // MOSTRAR INFORMACIÓN DEL PRODUCTO SELECCIONADO
    contenedor.addEventListener("click", (e) => {
        const boton = e.target.closest("button[data-bs-target='#modalPersonalizarProducto']");

        if (!boton) return;

        const productoId = boton.dataset.productoId;

        const productoSeleccionado = productos.find(
            producto => String(producto.id) === String(productoId)
        );

        if (!productoSeleccionado) return;

        imagen.src = productoSeleccionado.imagen || "";
        imagen.alt = productoSeleccionado.nombre;

        nombre.textContent = productoSeleccionado.nombre;
        descripcion.textContent = productoSeleccionado.descripcion || "Sin descripción disponible.";

        precio.textContent = `$${Number(productoSeleccionado.precio).toLocaleString("es-CO")}`;

        stock.innerHTML = `
            <i class="bi bi-box-seam"></i>
            Stock: ${productoSeleccionado.stock} disponibles
        `;

        // GENERAR COLORES
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
                label.textContent = color;

                colores.append(input, label);
            });
        } else {
            colores.textContent = "No hay colores especificados.";
        }

        // GENERAR TAMAÑOS
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
    });
});
