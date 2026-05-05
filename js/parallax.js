/**
 * parallax.js — Efecto parallax en la sección hero.
 *
 * Usa GSAP + ScrollTrigger si están disponibles.
 * Fallback a requestAnimationFrame nativo si GSAP no carga.
 *
 * Responsabilidad única: Gestionar el parallax del hero.
 */

var FerroconParallax = (function () {
  'use strict';

  var heroBg = null;
  var rafId  = null;

  // Intensidad del parallax (fracción del scroll)
  var PARALLAX_STRENGTH = 0.4;

  /**
   * Implementación nativa con rAF (fallback)
   */
  function nativeParallax() {
    function update() {
      if (!heroBg) return;
      var scrollY = window.pageYOffset;
      var offset  = scrollY * PARALLAX_STRENGTH;
      heroBg.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
    }

    function onScroll() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /**
   * Implementación con GSAP ScrollTrigger (preferida)
   */
  function gsapParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // GSAP no cargó, usar nativo
      nativeParallax();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(heroBg, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
  }

  /**
   * Inicializar
   */
  function init() {
    heroBg = document.getElementById('hero-bg');
    if (!heroBg) return;

    // Preferir GSAP si está disponible
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsapParallax();
    } else {
      // Esperar a que GSAP cargue (está defer)
      var attempts = 0;
      var checkGSAP = setInterval(function () {
        attempts++;
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          clearInterval(checkGSAP);
          gsapParallax();
        } else if (attempts > 20) {
          // Timeout: usar nativo
          clearInterval(checkGSAP);
          nativeParallax();
        }
      }, 100);
    }
  }

  /**
   * Destruir
   */
  function destroy() {
    window.removeEventListener('scroll', nativeParallax);
    if (rafId) cancelAnimationFrame(rafId);
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    }
  }

  return { init: init, destroy: destroy };
})();
