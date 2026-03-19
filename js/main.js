/* ============================================================
   PluggedInBC — Main JavaScript
   main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. STICKY HEADER SHADOW
     ---------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     2. MOBILE MENU TOGGLE
     ---------------------------------------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     3. MOBILE DROPDOWN TOGGLES
     ---------------------------------------------------------- */
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const dropdown = document.getElementById(targetId);
      if (dropdown) {
        dropdown.classList.toggle('open');
      }
    });
  });

  /* ----------------------------------------------------------
     4. DESKTOP DROPDOWN — close on outside click / Escape
     ---------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-dropdown.open').forEach(el => {
        el.classList.remove('open');
      });
    }
  });

  /* ----------------------------------------------------------
     5. ACTIVE NAV LINK
     ---------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     6. COUNTER ANIMATION
     ---------------------------------------------------------- */
  function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 2000; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      if (Number.isInteger(target)) {
        element.textContent = prefix + current.toLocaleString() + suffix;
      } else {
        element.textContent = prefix + (eased * target).toFixed(0) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // Intersection Observer for counters
  const counterElements = document.querySelectorAll('[data-counter]');
  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  /* ----------------------------------------------------------
     7. SMOOTH SCROLL — all anchor links
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = header ? header.offsetHeight : 0;
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     8. CONTACT FORM VALIDATION & SUCCESS
     ---------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      this.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      this.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));

      // Required fields
      const requiredFields = this.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          const errorEl = field.parentElement.querySelector('.form-error');
          if (errorEl) errorEl.classList.add('visible');
        }
      });

      // Email validation
      const emailField = this.querySelector('input[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          isValid = false;
          emailField.classList.add('error');
          const errorEl = emailField.parentElement.querySelector('.form-error');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid email address.';
            errorEl.classList.add('visible');
          }
        }
      }

      if (isValid) {
        // Hide form, show success
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('visible');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // Scroll to first error
        const firstError = this.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
    });

    // Live validation — remove error class on input
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', function () {
        if (this.classList.contains('error') && this.value.trim()) {
          this.classList.remove('error');
          const errorEl = this.parentElement.querySelector('.form-error');
          if (errorEl) errorEl.classList.remove('visible');
        }
      });
    });
  }

  /* ----------------------------------------------------------
     9. PARTNER INQUIRY FORM VALIDATION
     ---------------------------------------------------------- */
  const partnerForm = document.getElementById('partner-form');
  const partnerSuccess = document.getElementById('partner-form-success');

  if (partnerForm) {
    partnerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      this.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      this.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));

      const requiredFields = this.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          const errorEl = field.parentElement.querySelector('.form-error');
          if (errorEl) errorEl.classList.add('visible');
        }
      });

      if (isValid) {
        partnerForm.style.display = 'none';
        if (partnerSuccess) {
          partnerSuccess.classList.add('visible');
          partnerSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  /* ----------------------------------------------------------
     10. FAQ ACCORDION
     ---------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

      // Open clicked (if it wasn't already open)
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  /* ----------------------------------------------------------
     11. SCROLL REVEAL — subtle fade-in on scroll
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     12. WINDOW RESIZE — close mobile menu on expand
     ---------------------------------------------------------- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        if (navToggle) navToggle.classList.remove('open');
        if (mobileNav) mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    }, 100);
  });

})();
