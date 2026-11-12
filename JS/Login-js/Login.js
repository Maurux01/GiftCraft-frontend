

// Función para guardar en el localStorage (por compatibilidad)
function guardarEnLocalStorage(producto) {
    let productos = JSON.parse(localStorage.getItem("productosGiftcraft")) || [];
    productos.push(producto);
    localStorage.setItem("productosGiftcraft", JSON.stringify(productos));
}


//Alternar pestañas
(function () {
    const tabs = document.querySelectorAll('.mc-tab');
    const fLogin = document.getElementById('mcFormLogin');
    const fReg = document.getElementById('mcFormRegister');
    const mainTitle = document.getElementById('mcMainTitle');
    const subTitle = document.getElementById('mcSubTitle');

    function show(name) {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
        if (name === 'login') {
            fLogin.classList.add('active');
            fReg.classList.remove('active');
            mainTitle.textContent = "¡Bienvenido de nuevo!";
            subTitle.innerHTML = '<span class="mc-sub-decor">--</span> Inicia sesión y continúa tu aventura <span class="mc-sub-decor">--</span>';
        } else {
            fReg.classList.add('active');
            fLogin.classList.remove('active');
            mainTitle.textContent = "¡Crea tu cuenta!";
            subTitle.innerHTML = '<span class="mc-sub-decor">--</span> Regístrate y empieza tu aventura <span class="mc-sub-decor">--</span>';
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

    // Activamos el ojo para los 3 campos de contraseña
    togglePassword('mc-pass', 'togglePassLogin');
    togglePassword('mc-reg-pass', 'togglePassReg');
    togglePassword('mc-reg-pass-confirm', 'togglePassRegConfirm');
})();