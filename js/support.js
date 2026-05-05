/**
 * support.js — Detección de características del navegador y polyfills.
 * Carga SÍNCRONA (sin defer) para aplicar correcciones antes del render.
 *
 * Responsabilidad única: Compatibilidad con navegadores antiguos.
 */

(function ForjaBrowserSupport() {
  'use strict';

  /* ─── 1. Detección de CSS Custom Properties ─── */
  var supportsCSSVars = window.CSS && window.CSS.supports &&
    window.CSS.supports('color', 'var(--test)');

  if (!supportsCSSVars) {
    // CSS vars no disponibles — insertar estilos de fallback directamente
    var fallbackStyle = document.createElement('style');
    fallbackStyle.textContent = [
      'body { font-family: Arial, Helvetica, sans-serif; background: #0f1117; color: #eceff5; }',
      '.site-header { background: rgba(15,17,23,0.95); }',
      '.nav__logo-text { color: #eceff5; font-size: 1.5rem; font-weight: 900; }',
      '.nav__logo-mark { color: #e8881a; }',
      '.btn--primary { background: #e8881a; color: #0f1117; padding: 12px 28px; border-radius: 999px; font-weight: 700; }',
      '.btn--ghost { border: 2px solid #2a3047; color: #eceff5; padding: 12px 28px; border-radius: 999px; }',
      '.hero { min-height: 100vh; display: flex; align-items: center; background: #0f1117; }',
      '.hero__title { font-size: 3rem; font-weight: 900; color: #eceff5; }',
      '.hero__title-accent { color: #e8881a; }',
      '.cat-card, .feat-item, .testimonial { background: #1d2333; border: 1px solid #2a3047; border-radius: 12px; padding: 2rem; margin: 0.5rem; }',
      '#cursor-glow { display: none; }',
    ].join('\n');
    document.head.appendChild(fallbackStyle);
    document.documentElement.setAttribute('data-no-css-vars', 'true');
  }

  /* ─── 2. Detección de IntersectionObserver ─── */
  if (!('IntersectionObserver' in window)) {
    // Polyfill ligero: revelar todos los elementos inmediatamente
    document.addEventListener('DOMContentLoaded', function () {
      var hidden = document.querySelectorAll('.reveal-up, .reveal-right');
      for (var i = 0; i < hidden.length; i++) {
        hidden[i].style.opacity = '1';
        hidden[i].style.transform = 'none';
      }
    });
    window.__forjaNoIO = true;
  }

  /* ─── 3. Detección de GSAP (carga async) ─── */
  window.__forjaGSAPReady = false;

  /* ─── 4. Smooth scroll polyfill para Safari antiguo ─── */
  if (!('scrollBehavior' in document.documentElement.style)) {
    // Scroll suave manual para anclas
    document.addEventListener('DOMContentLoaded', function () {
      var links = document.querySelectorAll('a[href^="#"]');
      links.forEach(function (link) {
        link.addEventListener('click', function (e) {
          var targetId = this.getAttribute('href').slice(1);
          var target = document.getElementById(targetId);
          if (!target) return;
          e.preventDefault();
          var start = window.pageYOffset;
          var end = target.getBoundingClientRect().top + start;
          var duration = 600;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            // easeInOutCubic
            var ease = progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            window.scrollTo(0, start + (end - start) * ease);
            if (elapsed < duration) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      });
    });
  }

  /* ─── 5. Detección de requestAnimationFrame ─── */
  window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (cb) { return setTimeout(cb, 16); };

  window.cancelAnimationFrame = window.cancelAnimationFrame ||
    function (id) { clearTimeout(id); };

  /* ─── 6. Marcar capacidades en el DOM para CSS targeting ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.documentElement;
    var supportsOKLCH = CSS && CSS.supports && CSS.supports('color', 'oklch(50% 0.2 250)');
    if (!supportsOKLCH) root.setAttribute('data-no-oklch', 'true');

    var supportsGrid = CSS && CSS.supports && CSS.supports('display', 'grid');
    if (!supportsGrid) root.setAttribute('data-no-grid', 'true');

    var supportsBackdrop = CSS && CSS.supports && CSS.supports('backdrop-filter', 'blur(1px)');
    if (!supportsBackdrop) root.setAttribute('data-no-backdrop', 'true');
  });

})();
