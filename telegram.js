(function () {
  const tgWebApp = window.Telegram && window.Telegram.WebApp;
  const isTelegram = tgWebApp && tgWebApp.initData;

  if (!isTelegram) {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.title = 'Доступ запрещён';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = [
      'min-height:100vh',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:20px',
      'margin:0',
      'background:#0f1724',
      'color:#fff',
      'font-family:sans-serif',
      'text-align:center'
    ].join(';');
    wrapper.innerHTML = `
      <div>
        <h1 style="margin-bottom:8px;font-size:20px">Этот мини‑апп доступен только через Telegram</h1>
        <p style="opacity:0.85;margin-bottom:18px">Откройте мини‑апп через Telegram.</p>
      </div>
    `;
    
    document.body.appendChild(wrapper);
    return;
  }

  const tg = tgWebApp;
  tg.expand();

  const headerHeight = 60;
  const mainEl = document.querySelector("main");
  if (mainEl) {
    mainEl.style.paddingTop = headerHeight + "px";
    mainEl.style.paddingBottom = "0px"; // для футера
  }

  const user = tg.initDataUnsafe?.user;
  if (user) {
    const nameEl = document.getElementById('name');
    if (nameEl) nameEl.textContent = user.first_name || 'User';

    const avatarEl = document.getElementById('avatar');
    if (avatarEl) {
      if (user.photo_url) {
        avatarEl.src = user.photo_url;
      } else if (user.username) {
        avatarEl.src = `https://t.me/i/userpic/320/${user.username}.jpg`;
      }
    }

    const starsEarnedEl = document.getElementById('stars-earned');
    const starsBalanceEl = document.getElementById('stars-balance');
    if (starsEarnedEl) starsEarnedEl.textContent = '0 Stars earned';
    if (starsBalanceEl) starsBalanceEl.textContent = '0 stars';
  }
})();
