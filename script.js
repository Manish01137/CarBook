/* ============================================================
   Carbook — Landing page interactions
   - 24-hour rolling countdown timer (localStorage)
   - Live "dealer just joined" sales toasts
   ============================================================ */

(function () {
  'use strict';

  // ====================== COUNTDOWN TIMER ======================
  const STORAGE_KEY = 'carbook_offer_end';
  const ONE_DAY_MS  = 24 * 60 * 60 * 1000;

  function getEndTime() {
    let end = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (!end || isNaN(end) || end < Date.now()) {
      end = Date.now() + ONE_DAY_MS;
      localStorage.setItem(STORAGE_KEY, String(end));
    }
    return end;
  }
  let endTime = getEndTime();

  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    let ms = endTime - Date.now();
    if (ms <= 0) {
      endTime = Date.now() + ONE_DAY_MS;
      localStorage.setItem(STORAGE_KEY, String(endTime));
      ms = endTime - Date.now();
    }
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);

    // simple text version (announce bar, sticky bar, final-cta)
    document.querySelectorAll('.countdown').forEach((el) => {
      el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    });

    // big segmented timer (pricing section)
    const hh = document.querySelector('.unit .hh');
    const mm = document.querySelector('.unit .mm');
    const ss = document.querySelector('.unit .ss');
    if (hh) hh.textContent = pad(h);
    if (mm) mm.textContent = pad(m);
    if (ss) ss.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  // ====================== LIVE SALES TOASTS ======================
  const dealers = [
    { name: 'Rahul Patel',   loc: 'Ahmedabad',  img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Vikram Shah',   loc: 'Surat',      img: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'Mehul Joshi',   loc: 'Vadodara',   img: 'https://randomuser.me/api/portraits/men/52.jpg' },
    { name: 'Anjali Mehta',  loc: 'Rajkot',     img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Bhavesh Trivedi', loc: 'Gandhinagar', img: 'https://randomuser.me/api/portraits/men/67.jpg' },
    { name: 'Suresh Desai',  loc: 'Anand',      img: 'https://randomuser.me/api/portraits/men/76.jpg' },
    { name: 'Kavita Joshi',  loc: 'Bhavnagar',  img: 'https://randomuser.me/api/portraits/women/22.jpg' },
    { name: 'Nikhil Modi',   loc: 'Junagadh',   img: 'https://randomuser.me/api/portraits/men/24.jpg' },
    { name: 'Pooja Shah',    loc: 'Mehsana',    img: 'https://randomuser.me/api/portraits/women/57.jpg' },
    { name: 'Hardik Pandya', loc: 'Jamnagar',   img: 'https://randomuser.me/api/portraits/men/19.jpg' },
  ];
  const minsAgo = () => Math.floor(Math.random() * 18) + 1;

  const host = document.getElementById('toastHost');
  function showToast() {
    if (!host) return;
    const d = dealers[Math.floor(Math.random() * dealers.length)];
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `
      <img src="${d.img}" alt="" />
      <div>
        <div><strong>${d.name}</strong> from ${d.loc} just joined</div>
        <small>${minsAgo()} minutes ago · Carbook Membership</small>
      </div>`;
    host.appendChild(t);
    // auto-dismiss
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => t.remove(), 350);
    }, 5000);
  }
  // First toast 4s after load, then every 9-15s
  setTimeout(() => {
    showToast();
    setInterval(showToast, 9000 + Math.random() * 6000);
  }, 4000);

  // ====================== HEADER OFFSET FOR ANCHORS ======================
  // smooth-scrolling already handled via CSS; nothing else required.
})();
