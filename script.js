/* ============================================================
   Carbook — Landing page interactions
   - 8-hour rolling countdown timer (auto-resets, never finishes)
   - Razorpay Standard Checkout integration (modal)
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     RAZORPAY CONFIG  ← REPLACE THE KEY BELOW
     ------------------------------------------------------------
     1. Sign up at https://dashboard.razorpay.com
     2. Settings → API Keys → Generate Test/Live key
     3. Paste your KEY ID below (starts with "rzp_test_" or "rzp_live_")
     4. NEVER paste your "Key Secret" here — it must stay server-side.
        The Key ID is the only thing that goes in client-side code.
     5. In the Razorpay dashboard, enable "Auto-capture" so payments
        are captured automatically without a backend.
     ============================================================ */
  const RAZORPAY_KEY_ID = 'REPLACE_WITH_YOUR_RAZORPAY_KEY_ID';
  const PLAN_AMOUNT_PAISE = 29900;        // ₹299 (Razorpay uses paise)
  const PLAN_NAME         = 'Carbook';
  const PLAN_DESCRIPTION  = 'Dealer Membership — First Month';
  const THEME_COLOR       = '#EC4899';

  // ====================== COUNTDOWN TIMER ======================
  const STORAGE_KEY = 'carbook_offer_end';
  const TIMER_MS    = 8 * 60 * 60 * 1000; // 8 hours

  function getEndTime() {
    let end = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (!end || isNaN(end) || end < Date.now()) {
      end = Date.now() + TIMER_MS;
      localStorage.setItem(STORAGE_KEY, String(end));
    }
    return end;
  }
  let endTime = getEndTime();

  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    let ms = endTime - Date.now();
    // Auto-reset when expired so the timer never ends.
    if (ms <= 0) {
      endTime = Date.now() + TIMER_MS;
      localStorage.setItem(STORAGE_KEY, String(endTime));
      ms = endTime - Date.now();
    }
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);

    document.querySelectorAll('.countdown').forEach((el) => {
      el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    });
    const hh = document.querySelector('.unit .hh');
    const mm = document.querySelector('.unit .mm');
    const ss = document.querySelector('.unit .ss');
    if (hh) hh.textContent = pad(h);
    if (mm) mm.textContent = pad(m);
    if (ss) ss.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  // ====================== RAZORPAY CHECKOUT ======================
  function openCheckout() {
    if (typeof Razorpay === 'undefined') {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }
    if (RAZORPAY_KEY_ID.indexOf('REPLACE_WITH') === 0) {
      alert('⚠️ Razorpay key not configured yet.\n\nOpen script.js and replace RAZORPAY_KEY_ID with your actual key.');
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: PLAN_AMOUNT_PAISE,
      currency: 'INR',
      name: PLAN_NAME,
      description: PLAN_DESCRIPTION,
      image: '', // optional: your logo URL
      handler: function (response) {
        // Successful payment — redirect to thank-you with the Razorpay payment ID
        const id = encodeURIComponent(response.razorpay_payment_id || '');
        window.location.href = 'thank-you.html?payment_id=' + id;
      },
      prefill: {
        // Optional: pre-fill if you have user data
        // name: '',
        // email: '',
        // contact: ''
      },
      notes: {
        plan: 'first_month_299'
      },
      theme: {
        color: THEME_COLOR
      },
      modal: {
        ondismiss: function () {
          // User closed the modal without paying — nothing to do
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function (response) {
      const code = (response.error && response.error.code) || 'unknown';
      const desc = (response.error && response.error.description) || 'Payment failed.';
      alert('Payment failed (' + code + '): ' + desc + '\nPlease try again.');
    });
    rzp.open();
  }

  // Wire every CTA marked .js-pay to open the checkout modal
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.js-pay');
    if (!trigger) return;
    e.preventDefault();
    openCheckout();
  });
})();
