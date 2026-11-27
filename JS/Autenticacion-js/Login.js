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

                const destino = sesionActiva.rol === "admin"
                    ? "../Admin/Dashboard.html"
                    : "../productos.html";

                const redirigir = () => {
                    window.location.href = destino;
                };

                if (typeof Swal !== "undefined") {
                    Swal.fire({
                        icon: "success",
                        title: "¡Inicio de sesión exitoso!",
                        text: `Bienvenido, ${usuarioValido.name}.`,
                        confirmButtonText: "Continuar"
                    }).then(redirigir);
                } else {
                    window.alert(`¡Inicio de sesión exitoso! Bienvenido, ${usuarioValido.name}.`);
                    redirigir();
                }
            }

        });
    }

});


