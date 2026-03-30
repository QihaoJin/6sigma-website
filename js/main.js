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
    updateModalLang(lang);
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

  // --- Modals (close on overlay click + language swap) ---
  const modalContent = {
    en: {
      privacy: `<h2>Privacy Policy</h2>
        <p><strong>Last Updated: March 30, 2026</strong></p>
        <p>6 Sigma Limited operates <a href="https://6sigma-ai.com">6sigma-ai.com</a> and is developing the AuraPals AI companion products. This Privacy Policy explains how we collect, use, and protect information when you visit our website or join our waitlist.</p>
        <p style="background:#f5f5f7;padding:12px 16px;border-radius:10px;font-size:13px;"><strong>Note for Parents:</strong> Our products are designed for children, but we do not knowingly collect personal information from children under 13 without parental consent. Our waitlist is intended for adults.</p>
        <p><strong>1. Information We Collect</strong></p>
        <p>When you join our waitlist, we collect your <strong>email address</strong> to notify you about product updates, launch dates, and exclusive offers. We do not collect payment information, voice data, or child-related data at this stage.</p>
        <p><strong>2. How We Use Your Information</strong></p>
        <ul><li>Manage and communicate with our waitlist</li><li>Improve our website and product development</li><li>Comply with legal obligations</li></ul>
        <p>We never sell your personal information to third parties.</p>
        <p><strong>3. Data Sharing</strong></p>
        <p>We do not share your data with third parties except with service providers under strict confidentiality agreements, or if required by law.</p>
        <p><strong>4. Data Security</strong></p>
        <p>We take reasonable measures to protect your information from unauthorized access. However, no method of transmission over the Internet is 100% secure.</p>
        <p><strong>5. Children's Privacy</strong></p>
        <p>Our website and waitlist are not directed to children under 13. If we later launch a product that collects data from children, we will implement verifiable parental consent in compliance with applicable laws including COPPA.</p>
        <p><strong>6. Your Rights</strong></p>
        <p>You may unsubscribe at any time. To request access, correction, or deletion of your information, email <a href="mailto:Aria@6sigma-ai.com">Aria@6sigma-ai.com</a>.</p>
        <p style="font-size:12px;color:#86868b;margin-top:16px;">&copy; 2026 6 Sigma Limited. All rights reserved.</p>`,
      terms: `<h2>Terms of Use</h2>
        <p><strong>Last Updated: March 30, 2026</strong></p>
        <p>These Terms of Use govern your access to <a href="https://6sigma-ai.com">6sigma-ai.com</a>. By using the Site, you agree to these Terms.</p>
        <p style="background:#f5f5f7;padding:12px 16px;border-radius:10px;font-size:13px;"><strong>Pre-Launch Notice:</strong> AuraPals is currently in development. All product features, pricing, and availability are subject to change. The waitlist does not constitute a binding purchase commitment.</p>
        <p><strong>1. Use of the Site</strong></p>
        <p>You may use the Site for informational purposes and to join our waitlist. You must be at least 18 years old (or have parental consent).</p>
        <p><strong>2. Waitlist</strong></p>
        <p>Joining the waitlist does not guarantee you will receive a product or any specific offer. You may unsubscribe at any time.</p>
        <p><strong>3. Intellectual Property</strong></p>
        <p>All content on this Site is the property of 6 Sigma Limited and is protected by copyright, trademark, and other intellectual property laws.</p>
        <p><strong>4. No Warranties</strong></p>
        <p>The Site and all information are provided on an "as is" and "as available" basis.</p>
        <p><strong>5. Limitation of Liability</strong></p>
        <p>To the fullest extent permitted by law, 6 Sigma Limited shall not be liable for any damages arising from your use of the Site.</p>
        <p><strong>6. Governing Law</strong></p>
        <p>These Terms are governed by the laws of Hong Kong SAR.</p>
        <p><strong>7. Contact</strong></p>
        <p>Questions? Email <a href="mailto:Angela@6sigma-ai.com">Angela@6sigma-ai.com</a></p>
        <p style="font-size:12px;color:#86868b;margin-top:16px;">&copy; 2026 6 Sigma Limited. All rights reserved.</p>`,
      contact: `<h2>Contact Us</h2>
        <p>We'd love to hear from you.</p>
        <div style="display:flex;gap:16px;margin:24px 0;flex-wrap:wrap;">
          <a href="mailto:Angela@6sigma-ai.com" style="flex:1;min-width:200px;display:block;padding:20px;background:#f5f5f7;border-radius:16px;text-align:center;text-decoration:none;">
            <div style="font-size:32px;margin-bottom:8px;">&#9993;</div>
            <div style="font-size:15px;font-weight:600;color:#1d1d1f;">Angela</div>
            <div style="font-size:13px;color:#86868b;margin-top:4px;">Angela@6sigma-ai.com</div>
          </a>
          <a href="mailto:Aria@6sigma-ai.com" style="flex:1;min-width:200px;display:block;padding:20px;background:#f5f5f7;border-radius:16px;text-align:center;text-decoration:none;">
            <div style="font-size:32px;margin-bottom:8px;">&#9993;</div>
            <div style="font-size:15px;font-weight:600;color:#1d1d1f;">Aria</div>
            <div style="font-size:13px;color:#86868b;margin-top:4px;">Aria@6sigma-ai.com</div>
          </a>
        </div>
        <div style="border-top:1px solid rgba(0,0,0,.06);padding-top:16px;margin-top:8px;">
          <p style="font-size:14px;color:#86868b;"><strong style="color:#1d1d1f;">6 Sigma Limited</strong><br>Unit 1603, 16/F The L. Plaza<br>367-375 Queen's Road Central<br>Sheung Wan, Hong Kong</p>
        </div>`
    },
    zh: {
      privacy: `<h2>隱私政策</h2>
        <p><strong>最後更新：2026 年 3 月 30 日</strong></p>
        <p>6 Sigma Limited 營運 <a href="https://6sigma-ai.com">6sigma-ai.com</a>，並正在開發 AuraPals AI 陪伴產品。本隱私政策說明我們在您訪問網站或加入等候名單時，如何收集、使用和保護資訊。</p>
        <p style="background:#f5f5f7;padding:12px 16px;border-radius:10px;font-size:13px;"><strong>致家長：</strong>我們的產品專為兒童設計，但在未經家長同意的情況下，我們不會刻意收集 13 歲以下兒童的個人資訊。等候名單僅面向成人。</p>
        <p><strong>1. 我們收集的資訊</strong></p>
        <p>加入等候名單時，我們會收集您的<strong>電子郵件地址</strong>，用於通知產品更新、上市日期和獨家優惠。我們目前不收集付款資訊、語音數據或兒童相關數據。</p>
        <p><strong>2. 資訊用途</strong></p>
        <ul><li>管理等候名單並與您溝通</li><li>改善網站和產品開發</li><li>遵守法律義務</li></ul>
        <p>我們絕不會將您的個人資訊出售給第三方。</p>
        <p><strong>3. 數據共享</strong></p>
        <p>除在嚴格保密協議下協助我們運營的服務提供商，或法律要求外，我們不會與第三方共享您的數據。</p>
        <p><strong>4. 數據安全</strong></p>
        <p>我們採取合理措施保護您的資訊免受未授權存取。但網絡傳輸無法保證 100% 安全。</p>
        <p><strong>5. 兒童隱私</strong></p>
        <p>本網站和等候名單不面向 13 歲以下兒童。若日後產品需收集兒童數據，我們將依據適用法律（包括 COPPA）實施可驗證的家長同意機制。</p>
        <p><strong>6. 您的權利</strong></p>
        <p>您可隨時取消訂閱。如需查閱、更正或刪除資訊，請發送郵件至 <a href="mailto:Aria@6sigma-ai.com">Aria@6sigma-ai.com</a>。</p>
        <p style="font-size:12px;color:#86868b;margin-top:16px;">&copy; 2026 6 Sigma Limited. 保留所有權利。</p>`,
      terms: `<h2>使用條款</h2>
        <p><strong>最後更新：2026 年 3 月 30 日</strong></p>
        <p>本使用條款管轄您對 <a href="https://6sigma-ai.com">6sigma-ai.com</a> 的存取和使用。使用本網站即表示您同意本條款。</p>
        <p style="background:#f5f5f7;padding:12px 16px;border-radius:10px;font-size:13px;"><strong>上市前聲明：</strong>AuraPals 目前處於開發階段。所有產品功能、定價和供應情況均可能變更。加入等候名單不構成具約束力的購買承諾。</p>
        <p><strong>1. 網站使用</strong></p>
        <p>您可出於資訊目的使用本網站並加入等候名單。加入等候名單需年滿 18 歲（或取得家長同意）。</p>
        <p><strong>2. 等候名單</strong></p>
        <p>加入等候名單不保證您將收到產品或任何特定優惠。您可隨時取消訂閱。</p>
        <p><strong>3. 知識產權</strong></p>
        <p>本網站所有內容——包括 AuraPals 名稱和標誌、文字、圖形和設計——均為 6 Sigma Limited 所有，受版權、商標及其他知識產權法保護。</p>
        <p><strong>4. 免責聲明</strong></p>
        <p>本網站及所有資訊按「現狀」和「可用」基礎提供。</p>
        <p><strong>5. 責任限制</strong></p>
        <p>在法律允許的最大範圍內，6 Sigma Limited 不對您使用本網站產生的任何損害承擔責任。</p>
        <p><strong>6. 適用法律</strong></p>
        <p>本條款受香港特別行政區法律管轄。</p>
        <p><strong>7. 聯繫方式</strong></p>
        <p>如有疑問，請發送郵件至 <a href="mailto:Angela@6sigma-ai.com">Angela@6sigma-ai.com</a></p>
        <p style="font-size:12px;color:#86868b;margin-top:16px;">&copy; 2026 6 Sigma Limited. 保留所有權利。</p>`,
      contact: `<h2>聯繫我們</h2>
        <p>期待您的來信。</p>
        <div style="display:flex;gap:16px;margin:24px 0;flex-wrap:wrap;">
          <a href="mailto:Angela@6sigma-ai.com" style="flex:1;min-width:200px;display:block;padding:20px;background:#f5f5f7;border-radius:16px;text-align:center;text-decoration:none;">
            <div style="font-size:32px;margin-bottom:8px;">&#9993;</div>
            <div style="font-size:15px;font-weight:600;color:#1d1d1f;">Angela</div>
            <div style="font-size:13px;color:#86868b;margin-top:4px;">Angela@6sigma-ai.com</div>
          </a>
          <a href="mailto:Aria@6sigma-ai.com" style="flex:1;min-width:200px;display:block;padding:20px;background:#f5f5f7;border-radius:16px;text-align:center;text-decoration:none;">
            <div style="font-size:32px;margin-bottom:8px;">&#9993;</div>
            <div style="font-size:15px;font-weight:600;color:#1d1d1f;">Aria</div>
            <div style="font-size:13px;color:#86868b;margin-top:4px;">Aria@6sigma-ai.com</div>
          </a>
        </div>
        <div style="border-top:1px solid rgba(0,0,0,.06);padding-top:16px;margin-top:8px;">
          <p style="font-size:14px;color:#86868b;"><strong style="color:#1d1d1f;">6 Sigma Limited</strong><br>香港上環皇后大道中 367-375 號<br>The L. Plaza 16 樓 1603 室</p>
        </div>`
    }
  };

  function updateModalLang(lang) {
    const mc = modalContent[lang] || modalContent.en;
    const ids = { 'modal-privacy': 'privacy', 'modal-terms': 'terms', 'modal-contact': 'contact' };
    for (const [id, key] of Object.entries(ids)) {
      const el = document.getElementById(id);
      if (el) {
        const box = el.querySelector('.modal-box');
        const closeBtn = '<button class="modal-close" onclick="this.parentElement.parentElement.classList.remove(\'open\')">&times;</button>';
        if (box) box.innerHTML = closeBtn + mc[key];
      }
    }
  }

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
