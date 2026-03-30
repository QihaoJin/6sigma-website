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
  // Google Sheets integration: set GOOGLE_SCRIPT_URL after deploying Apps Script
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxwQNZjrv3bifotktWGRIePYo0JalUB8scQR1fgZiI0_EIsbMNqnyBeVCTtXSt_Cu9B/exec';

  function setupForms() {
    document.querySelectorAll('.subscribe-form, .subscribe').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const btn = form.querySelector('button[type="submit"]');
        const successEl = form.nextElementSibling;
        if (!input || !input.value) return;

        const email = input.value;
        const origText = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = '...'; }

        try {
          if (GOOGLE_SCRIPT_URL) {
            await fetch(GOOGLE_SCRIPT_URL, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: email, timestamp: new Date().toISOString() })
            });
          }
          input.value = '';
          if (successEl) { successEl.classList.add('show'); setTimeout(() => successEl.classList.remove('show'), 5000); }
        } catch (err) {
          console.error('[Subscribe] Error:', err);
        }
        if (btn) { btn.disabled = false; btn.textContent = origText; }
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

  // --- Modals (close on overlay click) ---
  function setupModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    applyLang(currentLang);
    setupScrollAnimations();
    setupForms();
    setupFAQ();
    setupModals();
  });
})();
