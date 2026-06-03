/**
 * main.js — Punto de entrada principal.
 *
 * Orquesta la inicialización de todos los módulos.
 * Sigue el principio de Inversión de Dependencias:
 * main conoce los módulos, los módulos no se conocen entre sí.
 */

(function ForjaApp() {
  'use strict';

  /**
   * Inicializar todos los módulos cuando el DOM está listo
   */
  function bootstrap() {
    // Cursor glow (sólo desktop)
    if (typeof ForjaCursor !== 'undefined') {
      ForjaCursor.init();
    }

    // Parallax del hero
    if (typeof FerroconParallax !== 'undefined') {
      FerroconParallax.init();
    }

    // Navegación
    if (typeof FerroconNav !== 'undefined') {
      FerroconNav.init();
    }

    // Animaciones GSAP / fallback
    if (typeof ForjaAnimations !== 'undefined') {
      ForjaAnimations.init();
    }

    // Interacción Formulario Lead Gen
    initLeadForm();
  }

  function initLeadForm() {
    const form = document.getElementById('lead-form');
    if(!form) return;

    // --- FORM PROGRESS BAR ---
    const inputs = form.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], input[type="tel"]');
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('form-progress-bar');
    const progressText = document.getElementById('form-progress-text');

    function updateProgress() {
      let totalFields = 4; // Nombre, Correo, Edad, al menos 1 interés
      let filledFields = 0;

      if (document.getElementById('f-name').value.trim() !== '') filledFields++;
      if (document.getElementById('f-email') && document.getElementById('f-email').value.trim() !== '') filledFields++;
      if (document.getElementById('f-age').value.trim() !== '') filledFields++;
      
      let hasInterest = Array.from(checkboxes).some(cb => cb.checked);
      if (hasInterest) filledFields++;

      let percentage = Math.min((filledFields / totalFields) * 100, 100);
      
      if(progressBar) progressBar.style.width = percentage + '%';
      if(progressText) progressText.innerText = Math.round(percentage) + '% COMPLETADO';
    }

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        updateProgress();
        validateField(input);
      });
      input.addEventListener('blur', () => validateField(input));
    });
    checkboxes.forEach(cb => cb.addEventListener('change', updateProgress));
    
    function validateField(input) {
      if (input.value.trim() === '') {
        input.classList.remove('is-valid');
        if(input.hasAttribute('required')) input.classList.add('is-invalid');
      } else {
        if(input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if(emailRegex.test(input.value)) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
          } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
          }
        } else {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }
      }
    }
    // --- END PROGRESS BAR ---

    // --- 3D TILT EFFECT ON FORM ---
    form.addEventListener('mousemove', (e) => {
      const rect = form.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const tiltX = (y - centerY) / 30; // Ajusta el divisor para más o menos efecto
      const tiltY = (centerX - x) / 30;
      
      form.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    
    form.addEventListener('mouseleave', () => {
      form.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      form.style.transition = 'transform 0.5s ease-out';
    });
    
    form.addEventListener('mouseenter', () => {
      form.style.transition = 'none'; // Quitar transición al mover para que sea fluido
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Evitar recarga de página
      
      const btn = document.getElementById('submit-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>Procesando...</span>';
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';

  const formData = new FormData(form);

// Prueba local (Live Server)
const submitRequest = Promise.resolve({
  ok: true
});
      submitRequest
        .then(response => {
          if (response && !response.ok) throw new Error('Error al enviar el formulario');
          
          const formContent = document.getElementById('form-content');
          const successEl = document.getElementById('form-success');
          
          // Mantener altura pero ocultar interactivamente y visualmente
          formContent.style.opacity = '0';
          formContent.style.pointerEvents = 'none';

          // --- GOOGLE ANALYTICS 4 ---
          // Enviamos el evento de conversión directamente a GA4
          if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
              'form_name': 'Captación Ferretería',
              'lead_type': 'Descuento_10%',
            });
          }
          
          setTimeout(() => {
            successEl.classList.remove('hidden');
            
            // Resetear el formulario después de 5 segundos
            setTimeout(() => {
              // Ocultar mensaje de éxito
              successEl.classList.add('hidden');
              
              // Limpiar formulario y resetear estados
              form.reset();
              updateProgress(); // Volver la barra a 0
              inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
              });
              btn.innerHTML = originalText;
              btn.style.opacity = '1';
              btn.style.pointerEvents = 'auto';
              
              // Volver a mostrar el contenido del formulario
              setTimeout(() => {
                formContent.style.opacity = '1';
                formContent.style.pointerEvents = 'auto';
              }, 300);
              
            }, 5000); // 5 segundos mostrando el mensaje de éxito
            
          }, 300); // esperar transición
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Hubo un problema de conexión al enviar el formulario. Por favor, intenta nuevamente.');
          btn.innerHTML = originalText;
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        });
    });
  }

  /**
   * Esperar al DOMContentLoaded
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    // DOM ya está listo (defer scripts)
    bootstrap();
  }

})();
