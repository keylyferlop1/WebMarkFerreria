/**
 * animations.js — Animaciones GSAP de scroll y contadores.
 *
 * Responsabilidades:
 *  1. Reveal animations en scroll con ScrollTrigger
 *  2. Contadores animados de estadísticas
 *  3. Animaciones de entrada del hero
 *  4. Fallback con IntersectionObserver si GSAP no disponible
 */

var ForjaAnimations = (function () {
  'use strict';

  /* ─── Fallback: IntersectionObserver nativo ─── */
  function initFallbackObserver() {
    if (window.__forjaNoIO) return; // polyfill ya los reveló

    var options = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.reveal-up, .reveal-right').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─── Contadores animados ─── */
  function animateCounter(el) {
    var target  = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1800;
    var start    = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed  = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      var value = Math.floor(ease * target);
      el.textContent = value >= 1000
        ? value.toLocaleString('es-MX')
        : String(value);
      if (elapsed < duration) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('es-MX');
    }
    requestAnimationFrame(step);
  }

  /* ─── Init con GSAP ─── */
  function initWithGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      initFallbackObserver();
      initCountersFallback();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    var heroElements = gsap.utils.toArray('.hero .reveal-up');
    gsap.fromTo(heroElements, {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.18,
      ease: 'power3.out',
      delay: 0.3
    });

    /* Reveal scroll-triggered */
    gsap.utils.toArray('.reveal-up').forEach(function (el) {
      // Los del hero ya fueron animados arriba
      if (el.closest('.hero')) return;

      gsap.fromTo(el, {
        opacity: 0,
        y: 40
      }, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power2.out',
        delay: (parseInt(el.style.getPropertyValue('--i') || '0', 10)) * 0.1,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    gsap.utils.toArray('.reveal-right').forEach(function (el) {
      gsap.fromTo(el, {
        opacity: 0,
        x: -50
      }, {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      });
    });

    /* Contadores */
    document.querySelectorAll('.stat__number').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function () { animateCounter(el); }
      });
    });
  }

  /* Contadores sin GSAP */
  function initCountersFallback() {
    var counterEls = document.querySelectorAll('.stat__number');
    if (!('IntersectionObserver' in window)) {
      counterEls.forEach(function (el) { animateCounter(el); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterEls.forEach(function (el) { obs.observe(el); });
  }

  /* ─── Formulario: feedback visual ─── */
  function initForm() {
    var form = document.getElementById('contact-form');
    var btn  = document.getElementById('submit-btn');
    if (!form || !btn) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validación básica accesible
      var invalid = false;
      form.querySelectorAll('[required]').forEach(function (input) {
        if (!input.value.trim()) {
          input.style.borderColor = 'oklch(55% 0.2 25)';
          input.setAttribute('aria-invalid', 'true');
          invalid = true;
        } else {
          input.style.removeProperty('border-color');
          input.removeAttribute('aria-invalid');
        }
      });

      if (invalid) return;

      // Simular envío
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Enviando…';

      setTimeout(function () {
        btn.querySelector('span').textContent = '¡Mensaje enviado! ✓';
        btn.style.background = 'oklch(60% 0.18 145)';
        form.reset();
      }, 1500);
    });
  }

  /**
   * Inicializar — espera a que GSAP esté listo
   */
  function init() {
    var attempts = 0;
    var check = setInterval(function () {
      attempts++;
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        clearInterval(check);
        initWithGSAP();
      } else if (attempts > 25) {
        clearInterval(check);
        initFallbackObserver();
        initCountersFallback();
      }
    }, 80);

    initForm();
  }

  return { init: init };
})();
