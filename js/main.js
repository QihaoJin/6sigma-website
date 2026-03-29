/* ============================================================
   6 Sigma AI — Main JS
   Nav, scroll animations, language switch, form handling
   ============================================================ */

(function () {
  'use strict';

  // --- Language ---
  let currentLang = localStorage.getItem('lang') || 'en';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    const t = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key] !== undefined) {
        if (el.tagName === 'INPUT' && el.placeholder !== undefined && key.includes('placeholder')) {
          el.placeholder = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });
    // Update lang button text
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) langBtn.textContent = lang === 'en' ? '繁中' : 'EN';
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  }

  function toggleLang() {
    applyLang(currentLang === 'en' ? 'zh' : 'en');
  }

  // --- Mobile nav ---
  function setupNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => links.classList.remove('open'));
      });
    }
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) langBtn.addEventListener('click', toggleLang);

    // Highlight active nav link
    const path = window.location.pathname.replace(/\/$/, '');
    document.querySelectorAll('.nav-links a[href]').forEach(a => {
      const href = a.getAttribute('href').replace(/\/$/, '');
      if (path === href || (path === '' && href === 'index.html') ||
          path.endsWith(href)) {
        a.classList.add('active');
      }
    });
  }

  // --- Scroll fade-in ---
  function setupScrollAnimations() {
    const els = document.querySelectorAll('.fade-in');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
  }

  // --- Email subscribe form ---
  function setupForms() {
    document.querySelectorAll('.subscribe-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const successEl = form.nextElementSibling;
        if (!input || !input.value) return;

        // TODO: integrate with real email service (Mailchimp, SendGrid, etc.)
        console.log('[Subscribe]', input.value);

        input.value = '';
        if (successEl && successEl.classList.contains('subscribe-success')) {
          successEl.classList.add('show');
          setTimeout(() => successEl.classList.remove('show'), 5000);
        }
      });
    });
  }

  // --- FAQ accordion ---
  function setupFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q');
      if (q) {
        q.addEventListener('click', () => {
          item.classList.toggle('open');
        });
      }
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    applyLang(currentLang);
    setupScrollAnimations();
    setupForms();
    setupFAQ();
  });
})();
