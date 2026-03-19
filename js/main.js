/* ============================================================
   PluggedInBC — Main JavaScript
   Features:
     - Mobile nav toggle
     - Scroll-based nav class
     - Counter animation (IntersectionObserver)
     - FAQ accordion
     - Form submission handler
     - Smooth scroll (CSS handles it; JS handles edge cases)
     - Active nav link highlighting
     - Animate-on-scroll elements
     - Newsletter form handler
   ============================================================ */

(function () {
  'use strict';

  /* ── Utility: DOM query helpers ─────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── 1. Mobile Nav Toggle ───────────────────────────────── */
  function initNav() {
    const nav       = $('#site-nav');
    const hamburger = $('.nav-hamburger');
    const navLinks  = $('.nav-links');

    if (!nav || !hamburger || !navLinks) return;

    // Toggle menu
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    $$('a', navLinks).forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Scroll-based nav styling
    function handleScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── 2. Active Nav Link ─────────────────────────────────── */
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a').forEach(link => {
      const href = (link.getAttribute('href') || '').split('/').pop();
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ── 3. Counter Animation ───────────────────────────────── */
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    function animateCounter(el) {
      const target   = parseFloat(el.dataset.count);
      const suffix   = el.dataset.suffix || '';
      const prefix   = el.dataset.prefix || '';
      const duration = 1800;
      const start    = performance.now();
      const isDecimal = target % 1 !== 0;

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOut(progress);
        const current  = target * eased;
        el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        el.classList.add('counting');
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
          el.classList.remove('counting');
        }
      }
      requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
  }

  /* ── 4. FAQ Accordion ───────────────────────────────────── */
  function initAccordion() {
    $$('.faq-item').forEach(item => {
      const question = $('.faq-question', item);
      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all items (single-open mode)
        $$('.faq-item.open').forEach(openItem => {
          if (openItem !== item) openItem.classList.remove('open');
        });

        item.classList.toggle('open', !isOpen);
      });

      // Keyboard accessibility
      question.setAttribute('tabindex', '0');
      question.setAttribute('role', 'button');
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  /* ── 5. Form Submission Handler ─────────────────────────── */
  function initForms() {
    // Main contact / intake form
    const contactForm = $('#contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const successMsg = $('#contact-success');
        contactForm.style.display = 'none';
        if (successMsg) successMsg.classList.add('show');
        window.scrollTo({ top: contactForm.parentElement.offsetTop - 100, behavior: 'smooth' });
      });
    }

    // Newsletter form
    $$('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('input', form);
        const btn   = $('button', form);
        if (btn) {
          btn.textContent = 'Subscribed!';
          btn.disabled = true;
          btn.style.background = '#4caf50';
          btn.style.borderColor = '#4caf50';
        }
        if (input) input.value = '';
      });
    });

    // Request workshop form
    const workshopReqForm = $('#workshop-request-form');
    if (workshopReqForm) {
      workshopReqForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const successMsg = $('#workshop-request-success');
        workshopReqForm.style.display = 'none';
        if (successMsg) successMsg.classList.add('show');
      });
    }

    // Partner contact form
    const partnerForm = $('#partner-form');
    if (partnerForm) {
      partnerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const successMsg = $('#partner-success');
        partnerForm.style.display = 'none';
        if (successMsg) successMsg.classList.add('show');
      });
    }
  }

  /* ── 6. Animate on Scroll ───────────────────────────────── */
  function initScrollAnimations() {
    const elements = $$('.animate-on-scroll');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
      observer.observe(el);
    });
  }

  /* ── 7. Smooth Scroll for Anchor Links ──────────────────── */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── 8. Initialize everything on DOM ready ──────────────── */
  function init() {
    initNav();
    initActiveNav();
    initCounters();
    initAccordion();
    initForms();
    initScrollAnimations();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
