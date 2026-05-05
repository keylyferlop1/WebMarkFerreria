/**
 * cursor.js — Glow difuminado que sigue al cursor con delay.
 *
 * Usa lerp (interpolación lineal) para crear el efecto de "persecución"
 * con retraso. Los colores oklch vienen desde CSS variables.
 *
 * Responsabilidad única: Gestionar el cursor glow.
 */

var ForjaCursor = (function () {
  'use strict';

  var glow = null;

  // Posición objetivo (mouse real)
  var targetX = 0;
  var targetY = 0;

  // Posición actual del glow (lerpeada)
  var currentX = 0;
  var currentY = 0;

  // Factor de suavizado: más bajo = más delay (rango 0–1)
  var LERP_FACTOR = 0.07;

  var rafId = null;
  var isVisible = false;

  /**
   * Interpolación lineal
   */
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  /**
   * Loop de animación — se ejecuta cada frame
   */
  function animate() {
    currentX = lerp(currentX, targetX, LERP_FACTOR);
    currentY = lerp(currentY, targetY, LERP_FACTOR);

    if (glow) {
      glow.style.transform =
        'translate3d(' + (currentX - glow.offsetWidth  / 2) + 'px, ' +
                         (currentY - glow.offsetHeight / 2) + 'px, 0)';
    }

    rafId = requestAnimationFrame(animate);
  }

  /**
   * Manejar movimiento del mouse
   */
  function onMouseMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      glow && glow.classList.add('is-visible');
    }
  }

  /**
   * Cambiar tamaño/intensidad al pasar sobre elementos interactivos
   */
  function onMouseOver(e) {
    var target = e.target;
    var isInteractive =
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') ||
      target.closest('button');

    if (glow) {
      if (isInteractive) {
        glow.style.setProperty(
          '--clr-cursor-inner',
          'oklch(88% 0.16 52 / 0.75)'
        );
        glow.style.width  = '340px';
        glow.style.height = '340px';
      } else {
        glow.style.removeProperty('--clr-cursor-inner');
        glow.style.width  = '480px';
        glow.style.height = '480px';
      }
    }
  }

  /**
   * Ocultar glow cuando el mouse sale de la ventana
   */
  function onMouseLeave() {
    isVisible = false;
    glow && glow.classList.remove('is-visible');
  }

  /**
   * Inicializar
   */
  function init() {
    // No activar en dispositivos touch
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    glow = document.getElementById('cursor-glow');
    if (!glow) return;

    // Inicializar posición en el centro de la pantalla
    currentX = targetX = window.innerWidth  / 2;
    currentY = targetY = window.innerHeight / 2;

    document.addEventListener('mousemove',   onMouseMove,  { passive: true });
    document.addEventListener('mouseover',   onMouseOver,  { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    animate();
  }

  /**
   * Destruir — limpiar listeners y cancelar RAF
   */
  function destroy() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseover', onMouseOver);
    document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    if (rafId) cancelAnimationFrame(rafId);
  }

  return { init: init, destroy: destroy };
})();
