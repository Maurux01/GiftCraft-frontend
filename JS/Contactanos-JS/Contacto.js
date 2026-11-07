const $form = document.querySelector('#formulario-contact');
const $mensajeRespuesta = document.querySelector('#mensaje-respuesta');

$form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = event.target;
  const data = new FormData(form);

  // Muestra estado de cargando
  $mensajeRespuesta.className = 'mt-3 p-3 text-center rounded-3 bg-light text-muted fw-bold';
  $mensajeRespuesta.textContent = 'Enviando mensaje...';
  $mensajeRespuesta.classList.remove('d-none');

  try {
    const response = await fetch('https://formspree.io/f/mrpppokv', {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Mensaje de éxito con diseño estilo Minecraft/Crema
      $mensajeRespuesta.className = 'mt-3 p-3 text-center rounded-3 text-success fw-bold border border-success-subtle bg-success-subtle';
      $mensajeRespuesta.innerHTML = '¡Gracias por contactarnos! Tu mensaje ha sido enviado con éxito. 💚';
      form.reset();
    } else {
      const result = await response.json();
      let errorMsg = 'Hubo un problema al enviar el mensaje. Inténtalo de nuevo.';
      if (Object.hasOwn(result, 'errors')) {
        errorMsg = result.errors.map(error => error.message).join(', ');
      }
      
      // Mensaje de error
      $mensajeRespuesta.className = 'mt-3 p-3 text-center rounded-3 text-danger fw-bold border border-danger-subtle bg-danger-subtle';
      $mensajeRespuesta.textContent = errorMsg;
    }
  } catch (error) {
    $mensajeRespuesta.className = 'mt-3 p-3 text-center rounded-3 text-danger fw-bold border border-danger-subtle bg-danger-subtle';
    $mensajeRespuesta.textContent = 'Ocurrió un error de conexión. Verifica tu red e inténtalo más tarde.';
  }
});

