/**
 * SEKHAR ASSOCIATES LAW FIRM - DOODLE ANIMATIONS ENGINE
 * Provides interactive hand-drawn stroke draw-in on scroll, floating orbit parallax,
 * rotating circular seals, and golden ink cursor sparkles.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initDoodleScrollTriggers();
    initFloatingOrbitParallax();
    initGoldenInkTrail();
    initBadgeInteractions();
  });

  /**
   * 1. TRIGGER DOODLE PATH DRAWING ON SCROLL
   * Uses IntersectionObserver to smoothly draw in hand-drawn SVG lines, circles, and underlines.
   */
  function initDoodleScrollTriggers() {
    const doodleElements = document.querySelectorAll(
      '.doodle-highlight-wrap, .doodle-circle-wrap, .doodle-arrow-container, .doodle-underline-svg, .doodle-double-underline-svg, .doodle-circle-svg'
    );

    if (!doodleElements.length) return;

    // Use IntersectionObserver with progressive enhancement
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view', 'drawn');
              // Also add to any child doodle SVGs
              const childSvgs = entry.target.querySelectorAll('svg');
              childSvgs.forEach(svg => svg.classList.add('drawn'));
              obs.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -50px 0px',
          threshold: 0.15
        }
      );

      doodleElements.forEach(el => observer.observe(el));
    } else {
      // Fallback for older browsers
      doodleElements.forEach(el => el.classList.add('in-view', 'drawn'));
    }
  }

  /**
   * 2. FLOATING ORBIT PARALLAX (High Performance)
   * Makes floating legal doodle icons react to mouse movement with cached geometry & idle suspension.
   */
  function initFloatingOrbitParallax() {
    const orbitContainer = document.querySelector('.hm_bnr_infogrphcs') || document.querySelector('.hero-doodle-orbit');
    const floatingIcons = document.querySelectorAll('.floating-doodle-icon, .bnr_icn1, .bnr_icn2, .bnr_icn3');

    if (!orbitContainer || !floatingIcons.length) return;

    // Only apply on non-touch devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      let isRunning = false;

      // Cache center geometry to avoid layout thrashing
      let centerX = 0;
      let centerY = 0;
      let halfW = window.innerWidth / 2;
      let halfH = window.innerHeight / 2;

      function updateCenter() {
        const rect = orbitContainer.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        halfW = window.innerWidth / 2;
        halfH = window.innerHeight / 2;
      }
      updateCenter();
      window.addEventListener('resize', updateCenter, { passive: true });
      window.addEventListener('scroll', updateCenter, { passive: true });

      window.addEventListener('mousemove', function (e) {
        targetX = (e.clientX - centerX) / halfW;
        targetY = (e.clientY - centerY) / halfH;

        if (!isRunning) {
          isRunning = true;
          requestAnimationFrame(updateParallax);
        }
      }, { passive: true });

      function updateParallax() {
        const dx = targetX - mouseX;
        const dy = targetY - mouseY;

        mouseX += dx * 0.08;
        mouseY += dy * 0.08;

        floatingIcons.forEach((icon, index) => {
          const depth = (index + 1) * 10;
          const rotate = mouseX * (index % 2 === 0 ? 6 : -6);
          icon.style.transform = `translate3d(${mouseX * depth}px, ${mouseY * depth}px, 0px) rotate(${rotate}deg)`;
        });

        // Suspend RAF when motion difference is negligible
        if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
          requestAnimationFrame(updateParallax);
        } else {
          isRunning = false;
        }
      }
    }
  }

  /**
   * 3. GOLDEN INK CURSOR SPARKLE TRAIL (Throttled & Lightweight)
   */
  function initGoldenInkTrail() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let lastTime = 0;
    const darkSections = document.querySelectorAll('.hme_bnr__area, .our-serv, .asst-prtnr, .footer-main');
    if (!darkSections.length) return;

    darkSections.forEach(section => {
      section.addEventListener('mousemove', function (e) {
        const now = performance.now();
        if (now - lastTime < 120) return; // Cap at max ~8 particles/sec
        lastTime = now;

        createGoldenParticle(e.clientX, e.clientY);
      }, { passive: true });
    });

    function createGoldenParticle(x, y) {
      const particle = document.createElement('span');
      particle.className = 'golden-particle';
      const size = Math.random() * 4 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 700);
    }
  }

  /**
   * 4. ROTATING BADGE HOVER ACCELERATION & SOUNDLESS PULSE
   */
  function initBadgeInteractions() {
    const badges = document.querySelectorAll('.doodle-rotating-badge, .crcle_icn_abs, .text-rotte-animat');

    badges.forEach(badge => {
      badge.addEventListener('mouseenter', function () {
        const ring = this.querySelector('.badge-text-ring') || this.querySelector('.text-animat-img img') || this.querySelector('img');
        if (ring) {
          ring.style.animationDuration = '8s';
        }
      });

      badge.addEventListener('mouseleave', function () {
        const ring = this.querySelector('.badge-text-ring') || this.querySelector('.text-animat-img img') || this.querySelector('img');
        if (ring) {
          ring.style.animationDuration = '20s';
        }
      });
    });
  }

  // Export functions globally if needed
  window.SekharDoodles = {
    refresh: initDoodleScrollTriggers
  };

})();
