document.addEventListener("DOMContentLoaded", () => {
    const formProducto = document.getElementById("formProducto");

    //Cargar los productos guardados al abrir la página
    cargarProductos();

    formProducto.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombreProducto").value;
        const categoria = document.getElementById("categoriaProducto").value;
        const descripcion = document.getElementById("descripcionProducto").value;
        const precio = document.getElementById("precioProducto").value;
        const stock = document.getElementById("stockProducto").value;
        
        // Capturar colores
        const inputColor = document.querySelectorAll(".input-color");
        const colores = [];
        inputColor.forEach(input => {
            colores.push(input.value); 
        });

        // Capturar Tamaños
        const tamanios = [];
        if (document.getElementById("sizeS").checked) tamanios.push("S");
        if (document.getElementById("sizeM").checked) tamanios.push("M");
        if (document.getElementById("sizeL").checked) tamanios.push("L");

        // Capturar la imagen seleccionada
        const imagenInput = document.getElementById("imagenesProducto");

        if (imagenInput.files && imagenInput.files[0]) {
            const archivo = imagenInput.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                const imagenBase64 = event.target.result; // Foto convertida a Base64

                // Crear objeto del producto
                const nuevoProducto = {
                    id: Date.now(), // ID único basado en el tiempo
                    nombre,
                    categoria,
                    descripcion,
                    precio,
                    stock,
                    tamanios,
                    colores,
                    imagen: imagenBase64
                };

                // Guardar en localStorage
                guardarEnLocalStorage(nuevoProducto);

                // Limpiar formulario y cerrar modal
                formProducto.reset();
                const modalElement = document.getElementById("modalAgregarProducto");
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();

                // Recargar la tabla para mostrar el nuevo producto de inmediato
                cargarProductos();

                alert("¡Producto guardado con éxito!");
            };

            reader.readAsDataURL(archivo);
        } else {
            alert("Por favor selecciona una imagen.");
        }
    });
});

// Función para guardar en el localStorage
function guardarEnLocalStorage(producto) {
    let productos = JSON.parse(localStorage.getItem("productosGiftcraft")) || [];
    productos.push(producto);
    localStorage.setItem("productosGiftcraft", JSON.stringify(productos));
}

// Función para leer el localStorage y pintar las filas en el HTML
function cargarProductos() {
    const contenedor = document.getElementById("listaProductosContainer");
    if (!contenedor) return;

    let productos = JSON.parse(localStorage.getItem("productosGiftcraft")) || [];
    
    // Limpiar contenedor antes de renderizar
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = `<p class="text-center text-muted py-3 m-0">No hay productos registrados todavía.</p>`;
        return;
    }

    // Recorrer cada producto guardado y crear su estructura HTML
    productos.forEach(producto => {
        // Generar dinámicamente los círculos de colores
        let circulosColores = '';
        if (producto.colores && producto.colores.length > 0) {
            producto.colores.forEach(color => {
                circulosColores += `<span class="rounded-circle shadow-sm" style="width: 14px; height: 14px; background-color: ${color}; display: inline-block;" title="${color}"></span>`;
            });
        }

        // Generar dinámicamente los badges de tamaños
        let badgesTamanios = '';
        if (producto.tamanios && producto.tamanios.length > 0) {
            producto.tamanios.forEach(t => {
                badgesTamanios += `<span class="badge bg-light text-dark border rounded-circle d-flex align-items-center justify-content-center" style="width: 24px; height: 24px; font-size: 0.7rem;">${t}</span>`;
            });
        }

        const fila = document.createElement("div");
        fila.className = "row align-items-center py-3 border-bottom";
        fila.innerHTML = `
            <div class="col-4 col-md-1">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="rounded-3 shadow-sm"
                    style="width: 45px; height: 45px; object-fit: cover;">
            </div>
            <div class="col-8 col-md-2 fw-bold text-dark">
                ${producto.nombre}
            </div>
            <div class="col-6 col-md-2 mt-2 mt-md-0">
                <span class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2 py-1">${producto.categoria}</span>
            </div>
            <div class="col-6 col-md-2 text-muted small text-truncate">
                ${producto.descripcion}
            </div>
            <div class="col-6 col-md-1 text-success fw-semibold">
                $ ${producto.precio}
            </div>
            <div class="col-6 col-md-1">
                <span class="badge bg-secondary-subtle text-dark px-2 py-1">${producto.stock}</span>
            </div>
            <div class="col-6 col-md-1">
                <div class="d-flex gap-1 align-items-center flex-wrap">
                    ${circulosColores}
                </div>
            </div>
            <div class="col-6 col-md-1">
                <div class="d-flex gap-1">
                    ${badgesTamanios}
                </div>
            </div>
            <div class="col-6 col-md-1">
                <button type="button" class="btn btn-light btn-sm text-primary border shadow-sm p-1 rounded-3" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-light btn-sm text-danger border shadow-sm p-1 rounded-3" title="Eliminar" onclick="eliminarProducto(${producto.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        contenedor.appendChild(fila);
    });
}

// Función para eliminar un producto del localStorage
function eliminarProducto(id) {
    let productos = JSON.parse(localStorage.getItem("productosGiftcraft")) || [];
    productos = productos.filter(prod => prod.id !== id);
    localStorage.setItem("productosGiftcraft", JSON.stringify(productos));
    cargarProductos(); // Actualizar la vista al borrar
}