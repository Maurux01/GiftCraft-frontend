document.addEventListener("DOMContentLoaded", () => {
    const formProducto = document.getElementById("formProducto");

    formProducto.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombreProducto").value;
        const categoria = document.getElementById("categoriaProducto").value;
        const descripcion = document.getElementById("descripcionProducto").value;
        const precio = document.getElementById("precioProducto").value;
        const stock = document.getElementById("stockProducto").value;

        // Tamaños
        const tamanios = [];
        if (document.getElementById("sizeS").checked) tamanios.push("S");
        if (document.getElementById("sizeM").checked) tamanios.push("M");
        if (document.getElementById("sizeL").checked) tamanios.push("L");

        // Capturar la imagen seleccionada
        const imagenInput = document.getElementById("imagenesProducto");
        
        if (imagenInput.files && imagenInput.files[0]) {
            const archivo = imagenInput.files[0];
            
            // Usamos FileReader para convertir la imagen a Base64 (texto seguro para localStorage)
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const imagenBase64 = event.target.result; // Aquí está la foto convertida

                // Crear objeto del producto con la imagen incluida
                const nuevoProducto = {
                    id: Date.now(),
                    nombre,
                    categoria,
                    descripcion,
                    precio,
                    stock,
                    tamanios,
                    imagen: imagenBase64 // Guardamos la imagen en Base64
                };

                // Guardar en localStorage
                guardarEnLocalStorage(nuevoProducto);

                // Limpiar formulario y cerrar modal
                formProducto.reset();
                const modalElement = document.getElementById("modalAgregarProducto");
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();

                // Acá lo cambio ahorita para que se pint en el html de admin
                alert("¡Producto guardado con éxito!");
            };

            // Leemos el archivo como una URL de datos (Base64)
            reader.readAsDataURL(archivo);
        } else {
            alert("Por favor selecciona una imagen.");
        }
    });
});

function guardarEnLocalStorage(producto) {
    let productos = JSON.parse(localStorage.getItem("productosGiftcraft")) || [];
    productos.push(producto);
    localStorage.setItem("productosGiftcraft", JSON.stringify(productos));
}