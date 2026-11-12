// Alternar pestañas y visibilidad de contraseña
(function () {
    const tabs = document.querySelectorAll('.mc-tab');
    const fLogin = document.getElementById('mcFormLogin');
    const fReg = document.getElementById('mcFormRegister');

    function show(name) {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
        if (name === 'login') {
            fLogin.classList.add('active');
            fReg.classList.remove('active');
        } else {
            fReg.classList.add('active');
            fLogin.classList.remove('active');
        }
    }

    tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.tab)));

    // Función para alternar la visibilidad de la contraseña con el ícono de ojo
    const togglePassword = (inputId, iconId) => {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        if (input && icon) {
            icon.addEventListener('click', () => {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            });
        }
    };

    // Activamos el ojo para los campos de contraseña
    togglePassword('mc-pass', 'togglePassLogin');
    togglePassword('mc-reg-pass', 'togglePassReg');
    togglePassword('mc-reg-pass-confirm', 'togglePassRegConfirm');
})();


// Función capturar datos del formulario de registro
document.addEventListener("DOMContentLoaded", () => {
    const formUser = document.getElementById("mcFormRegister");

    if (formUser) {
        formUser.addEventListener("submit", (evento) => {
            evento.preventDefault(); // Evitamos que la página se recargue

            // Validar opcionalmente si las contraseñas coinciden antes de guardar
            const pass = document.getElementById("mc-reg-pass").value;
            const passConfirm = document.getElementById("mc-reg-pass-confirm").value;

            if (pass !== passConfirm) {
                alert("Las contraseñas no coinciden. Por favor, revísalas.");
                return;
            }

            // Llamamos la función para extraer los valores del formulario
            const datosFormulario = capturarDatos();

            // Guardamos en el localStorage
            guardarEnLocalStorage(datosFormulario, "usuariosRegistro");

            // Limpiamos el form
            formUser.reset();
            alert("¡Datos guardados con éxito!");
        });
    }
});

function capturarDatos() {
    const nombre = document.getElementById("mc-reg-name").value;
    const celular = document.getElementById("mc-reg-phone").value;
    const correo = document.getElementById("mc-reg-email").value;
    const contraseña = document.getElementById("mc-reg-pass").value;

    return {
        id: Date.now(),
        name: nombre,
        phone: celular,
        email: correo,
        password: contraseña,
        fechaRegistro: new Date().toLocaleDateString()
    };
}

// Función para guardar en el localStorage
function guardarEnLocalStorage(nuevoObjeto, claveStorage) {
    // Obtenemos los datos actuales, si no hay nada devuelve un array vacío
    let registrosActuales = JSON.parse(localStorage.getItem(claveStorage)) || [];
    
    // Agregamos el nuevo objeto al array
    registrosActuales.push(nuevoObjeto);

    // Convertimos el array a texto JSON y guardamos en el localStorage
    localStorage.setItem(claveStorage, JSON.stringify(registrosActuales));
}