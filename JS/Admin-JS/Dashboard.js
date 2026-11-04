// Mauro parte

// Funcion que toma los valores del formulario "formProducto" del dashboard.html
// y los guarda como un objeto dentro del array "productos".
function guardarProductoDelFormulario(form) {
    const nombre = form.querySelector('#nombreProducto')?.value.trim() || '';
    const categoria = form.querySelector('#categoriaProducto')?.value || '';
    const descripcion = form.querySelector('#descripcionProducto')?.value.trim() || '';
    const precio = form.querySelector('#precioProducto')?.value.trim() || '';
    const stock = Number(form.querySelector('#stockProducto')?.value) || 0;

    // Colores disponibles (inputs type="color" del formulario)
    const colores = Array.from(form.querySelectorAll('input[type="color"]'))
        .map(input => input.value);

    // Tamanos disponibles (checkboxes S, M, L)
    const tamanos = [];
    if (document.getElementById('sizeS')?.checked) tamanos.push('S');
    if (document.getElementById('sizeM')?.checked) tamanos.push('M');
    if (document.getElementById('sizeL')?.checked) tamanos.push('L');

    // Imagenes seleccionadas (solo nombres de archivo)
    const inputImagenes = form.querySelector('#imagenesProducto');
    const imagenes = inputImagenes
        ? Array.from(inputImagenes.files).map(archivo => archivo.name)
        : [];

    // Genera un id nuevo basado en el maximo existente + 1
    const nuevoId = productos.length
        ? Math.max(...productos.map(p => p.id || 0)) + 1
        : 1;

    const nuevoProducto = {
        id: nuevoId,
        nombre: nombre,
        categoria: categoria,
        descripcion: descripcion,
        precio: precio,
        stock: stock,
        colores: colores,
        tamanos: tamanos,
        imagenes: imagenes
    };

    // Guarda el objeto en el array de productos
    productos.push(nuevoProducto);

    return nuevoProducto;
}

// Conecta la funcion con el submit del formulario del dashboard.
// Se registra de forma robusta por si el script se carga despues de DOMContentLoaded.
function inicializarFormularioProducto() {
    const formProducto = document.getElementById('formProducto');
    if (!formProducto) {
        console.warn('No se encontro #formProducto en el DOM.');
        return;
    }

    formProducto.addEventListener('submit', (event) => {
        event.preventDefault();

        const productoGuardado = guardarProductoDelFormulario(formProducto);
        console.log('Producto guardado:', productoGuardado);
        console.log('Array de productos:', productos);
        console.log('JSON:', JSON.stringify(productos));

        // Limpia el formulario y cierra el modal
        formProducto.reset();
        const modalEl = document.getElementById('modalAgregarProducto');
        if (modalEl && window.bootstrap) {
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.hide();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarFormularioProducto);
} else {
    inicializarFormularioProducto();
}