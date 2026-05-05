/**
 * nav.js — Comportamiento de la navegación.
 *
 * Responsabilidades:
 *  1. Aplicar clase is-scrolled al header en scroll
 *  2. Toggle del menú móvil (hamburger)
 *  3. Cerrar menú al seleccionar un link
 *  4. Actualizar aria-expanded correctamente
 */

var FerroconNav = (function () {
  'use strict';

  var header    = null;
  var toggle    = null;
  var menu      = null;
  var navLinks  = null;
  var isOpen    = false;

  /**
   * Actualizar estado del header según el scroll
   */
  function handleScroll() {
    if (!header) return;
    var scrolled = window.pageYOffset > 40;
    header.classList.toggle('is-scrolled', scrolled);
  }

  /**
   * Abrir o cerrar el menú móvil
   */
  function toggleMenu(forceClose) {
    if (forceClose === true) {
      isOpen = false;
    } else {
      isOpen = !isOpen;
    }

    menu   && menu.classList.toggle('is-open', isOpen);
    toggle && toggle.setAttribute('aria-expanded', String(isOpen));

    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  /**
   * Inicializar
   */
  function init() {
    header   = document.querySelector('.site-header');
    toggle   = document.getElementById('nav-toggle');
    menu     = document.getElementById('nav-menu');
    navLinks = menu ? menu.querySelectorAll('.nav__link') : [];

    // Scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Estado inicial

    // Toggle hamburger
    toggle && toggle.addEventListener('click', function () {
      toggleMenu();
    });

    // Cerrar menú al clicar un link
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggleMenu(true);
      });
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        toggleMenu(true);
        toggle && toggle.focus();
      }
    });

    // Actualizar año en footer
    var yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  return { init: init };
})();
