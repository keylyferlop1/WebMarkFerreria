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
  if (!form) return;

  const inputs = form.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="tel"], input[type="date"]'
  );

  const progressBar = document.getElementById('form-progress-bar');
  const progressText = document.getElementById('form-progress-text');

  function updateProgress() {

    let totalFields = 4;
    let filledFields = 0;

    const name = document.getElementById('f-name');
    const email = document.getElementById('f-email');
    const phone = document.getElementById('f-phone');
    const edad = document.getElementById('f-edad');

    if (name && name.value.trim() !== '') filledFields++;
    if (email && email.value.trim() !== '') filledFields++;
    if (phone && phone.value.trim() !== '') filledFields++;
    if (edad && edad.value.trim() !== '') filledFields++;

    const percentage = (filledFields / totalFields) * 100;

    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }

    if (progressText) {
      progressText.textContent =
        Math.round(percentage) + '% COMPLETADO';
    }
  }

  function validateField(input) {

    if (!input.hasAttribute('required')) return;

    if (input.value.trim() === '') {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return;
    }

    if (input.type === 'email') {

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailRegex.test(input.value)) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
      }

      return;
    }

    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  }

  inputs.forEach(input => {

    input.addEventListener('input', () => {
      updateProgress();
      validateField(input);
    });

    input.addEventListener('blur', () => {
      validateField(input);
    });

  });

  updateProgress();

  form.addEventListener('mousemove', (e) => {

    const rect = form.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = (y - centerY) / 30;
    const tiltY = (centerX - x) / 30;

    form.style.transform =
      `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

  });

  form.addEventListener('mouseleave', () => {
    form.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    form.style.transition = 'transform 0.5s ease-out';
  });

  form.addEventListener('mouseenter', () => {
    form.style.transition = 'none';
  });

  form.addEventListener('submit', () => {

    const btn = document.getElementById('submit-btn');

    if (!btn) return;

    btn.innerHTML = '<span>Procesando...</span>';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

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
