document.addEventListener("DOMContentLoaded", () => {
    // --- ALTERNAR PESTAÑAS (TABS) ---
    const tabs = document.querySelectorAll('.mc-tab');
    const fLogin = document.getElementById('mcFormLogin');
    const fReg = document.getElementById('mcFormRegister');
    const footerLogin = document.getElementById('mcFooterLogin');
    const footerReg = document.getElementById('mcFooterRegister');

    function showTab(name) {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));

        if (name === 'login') {
            fLogin.classList.add('active');
            fReg.classList.remove('active');
            if (footerLogin) footerLogin.style.display = 'block';
            if (footerReg) footerReg.style.display = 'none';
        } else {
            fReg.classList.add('active');
            fLogin.classList.remove('active');
            if (footerLogin) footerLogin.style.display = 'none';
            if (footerReg) footerReg.style.display = 'block';
        }
    }

    tabs.forEach(t => {
        t.addEventListener('click', () => showTab(t.dataset.tab));
    });

    // Enlaces adicionales por si el usuario hace clic en "Regístrate" o "Inicia sesión" en el footer
    const linkToRegister = document.getElementById('mcToRegister');
    const linkToLogin = document.getElementById('mcToLogin');

    if (linkToRegister) {
        linkToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            showTab('register');
        });
    }

    if (linkToLogin) {
        linkToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showTab('login');
        });
    }

    // --- VISIBILIDAD DE CONTRASEÑAS (ÍCONO DE OJO) ---
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

    // Activamos el ojo para los tres campos de contraseña del login y registro
    togglePassword('mc-pass', 'togglePassLogin');
    togglePassword('mc-reg-pass', 'togglePassReg');
    togglePassword('mc-reg-pass-confirm', 'togglePassRegConfirm');


    // --- 3. VALIDACIÓN Y CAPTURA DE DATOS EN EL REGISTRO ---
    const formUser = document.getElementById("mcFormRegister");

    if (formUser) {
        formUser.addEventListener("submit", (evento) => {
            evento.preventDefault(); // Evitamos que la página se recargue

            // Limpiar mensajes de error previos
            document.getElementById("campoVacio").textContent = "";
            document.getElementById("campoNumero").textContent = "";
            document.getElementById("campoMensaje").textContent = "";
            document.getElementById("campoContraseña").textContent = "";
            document.getElementById("MensajeError").textContent = "";

            // Capturar elementos del DOM
            const nombre = document.getElementById("mc-reg-name");
            const celular = document.getElementById("mc-reg-phone");
            const correo = document.getElementById("mc-reg-email");
            const pass = document.getElementById("mc-reg-pass").value;
            const passConfirm = document.getElementById("mc-reg-pass-confirm").value;

            // Validación 1: Campo nombre vacío
            if (nombre.value.trim() === '') {
                document.getElementById("campoVacio").textContent = "¡El nombre completo no puede quedar vacío!";
                nombre.focus();
                return;
            }

            // Validación 2: Número de celular (mínimo 10 dígitos)
            if (celular.value.trim().length < 10) {
                document.getElementById("campoNumero").textContent = "¡El número de celular debe tener al menos 10 dígitos!";
                celular.focus();
                return;
            }

            // Validación 3: Verificar correos duplicados en localStorage
            const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistro")) || [];
            const correoExistente = usuariosRegistrados.some(
                usuario => usuario.email.toLowerCase() === correo.value.trim().toLowerCase()
            );

            if (correoExistente) {
                document.getElementById("campoMensaje").textContent = "¡Este correo electrónico ya está registrado. Inicia sesión!";
                correo.focus();
                return;
            }

            // Validación 4: Contraseñas débiles
            const errorContrasenia = esContraseniaDebil(pass);
            if (errorContrasenia) {
                document.getElementById("campoContraseña").textContent = errorContrasenia;
                document.getElementById("mc-reg-pass").focus();
                return;
            }

            // Validación 5: Coincidencia de contraseñas
            if (pass !== passConfirm) {
                document.getElementById("campoContraseña").textContent = "¡Las contraseñas no coinciden. Revísalas!";
                return;
            }

            // --- 4. GUARDAR EN LOCALSTORAGE ---
            const datosFormulario = {
                id: Date.now(),
                name: nombre.value.trim(),
                phone: celular.value.trim(),
                email: correo.value.trim(),
                password: pass,
                fechaRegistro: new Date().toLocaleDateString()
            };

            guardarEnLocalStorage(datosFormulario, "usuariosRegistro");

            // Limpiar formulario y mostrar mensaje de éxito en pantalla
            formUser.reset();
            const mensajeExito = document.getElementById("MensajeError");
            mensajeExito.style.color = "#5e8a3a"; // Color verde éxito opcional
            mensajeExito.textContent = "¡Cuenta creada con éxito! Redirigiendo...";

            // Esperar 2 segundos para que el usuario lea el mensaje y luego cambiar a login
            setTimeout(() => {
                mensajeExito.textContent = ""; // Limpiar mensaje
                showTab('login');
            }, 2000);
        });
    }
});

// Función para verificar si la contraseña es débil o común
function esContraseniaDebil(password) {
    const contraseniasProhibidas = [
        "123456", "12345678", "123456789", "12345",
        "abcdef", "qwerty", "password", "contraseña",
        "admin", "111111", "000000"
    ];

    if (contraseniasProhibidas.includes(password.toLowerCase())) {
        return "¡Esta contraseña es demasiado común y fácil de adivinar! Elige otra.";
    }

    const caracteresRepetidos = /^(.)\1+$/;
    if (caracteresRepetidos.test(password)) {
        return "La contraseña no puede estar formada por un solo carácter repetido.";
    }

    if (password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }

    return null;
}

// Función auxiliar para guardar en localStorage
function guardarEnLocalStorage(nuevoObjeto, claveStorage) {
    let registrosActuales = JSON.parse(localStorage.getItem(claveStorage)) || [];
    registrosActuales.push(nuevoObjeto);
    localStorage.setItem(claveStorage, JSON.stringify(registrosActuales));
}