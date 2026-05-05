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
