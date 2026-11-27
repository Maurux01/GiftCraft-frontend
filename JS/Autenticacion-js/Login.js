document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("mcFormLogin");
    const inputCorreo = document.getElementById("mc-user");
    const inputPass = document.getElementById("mc-pass");
    const errorLogin = document.getElementById("errorLogin");
    const togglePass = document.getElementById("togglePassLogin");

    if (formLogin) {
        formLogin.addEventListener("submit", (evento) => {
            evento.preventDefault();

            if (errorLogin) {
                errorLogin.textContent = "";
                errorLogin.style.color = "";

                const correo = inputCorreo.value.toLowerCase();
                const password = inputPass.value;
                
                if (!correo || !password) {
                    if (errorLogin) {
                        errorLogin.textContent = "¡Completa tu correo y contraseña!";
                    }
                    return;
                }

                const usuarios = typeof obtenerUsuariosRegistrados === "function"
                    ? obtenerUsuariosRegistrados() : JSON.parse(localStorage.getItem("usuariosRegistro")) || [];
                const usuarioValido = usuarios.find(
                    u => u.email.trim().toLowerCase() === correo && u.password === password
                );

                if (!usuarioValido) {
                    if (errorLogin) {
                        errorLogin.textContent = "¡Correo o contraseña incorrectos!";
                    }
                    inputPass.focus();
                    return;
                }

                // Guardar sesión activa para la tienda
                const sesionActiva = {
                    id: usuarioValido.id,
                    name: usuarioValido.name,
                    email: usuarioValido.email,
                    phone: usuarioValido.phone,
                    rol: usuarioValido.rol || "cliente",
                    loginAt: new Date().toISOString()
                };

                localStorage.setItem("sesionActivaGiftcraft", JSON.stringify(sesionActiva));
                formLogin.reset();

                if (errorLogin) {
                    errorLogin.style.color = "#5e8a3a";
                    errorLogin.textContent = `¡Hola, ${usuarioValido.name}! Redirigiendo...`;
                }

                // Redirigir a la vista de productos / tienda
                setTimeout(() => {
                    const destino = sesionActiva.rol === "admin"
                    ? "../Admin/Dashboard.html"
                    : "../productos.html";

                    window.location.href = destino;
                }, 1200);
            }

        });
    }

});


