(function () {
  const tgWebApp = window.Telegram && window.Telegram.WebApp;
  const isTelegram = tgWebApp && tgWebApp.initData;



  const tg = tgWebApp;
  tg.expand();

  // Получаем цвета темы Telegram
  const bgColor = tg.themeParams?.bg_color || "#131825";

  // Применяем цвета к телу и main
document.body.style.backgroundColor = bgColor;

const headerHeight = 60; // пример, можно настроить под свой header

const mainEl = document.querySelector("main");
if (mainEl) {
    mainEl.style.paddingTop = headerHeight + "px"; // чтобы main не перекрывался
    mainEl.style.minHeight = `calc(100vh - ${headerHeight}px)`; 
}

  // Получаем данные пользователя
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

    // Отображение звезд и баланса (по умолчанию 0, можно обновлять через API)
    const starsEarnedEl = document.getElementById('stars-earned');
    const starsBalanceEl = document.getElementById('stars-balance');
    if (starsEarnedEl) starsEarnedEl.textContent = '0 Stars earned';
    if (starsBalanceEl) starsBalanceEl.textContent = '0 stars';
  }
})();
