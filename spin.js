const PRIZES = [
  { label: 'Heart 15 ⭐',    color: '#000', img: 'gif/heart15.gif', weight: 44 },
  { label: 'Trophy 100 ⭐',     color: '#000',img: 'gif/trophy100.gif', weight: 1 },
  { label: 'Diamond Ring 100 ⭐',       color: '#000', img: 'gif/ring100.gif', weight: 1  },
  { label: 'Cake 50 ⭐',color: '#000', img: 'gif/cake50.gif', weight: 10  },
  { label: 'Teddy 15 ⭐', color: '#000', img: 'gif/bear15.gif', weight: 44  },
];

/* ===========================
   Параметры анимации / полосы
   =========================== */
const ITEM_WIDTH = 100;      // совпадает с .item width в CSS
const GAP = 5;              // совпадает с gap в .strip
const FULL_W = ITEM_WIDTH + GAP;
const REPEAT = 40;          // повторов набора — большой запас
const BASE_ROTATIONS = 4;   // минимальное число "витков" вперед от текущей позиции
const DURATION = 6500;      // длительность анимации
const strip = document.getElementById('strip');
const viewport = document.getElementById('viewport');
const btn = document.getElementById('spin');
const resultEl = document.getElementById('result');

let totalItems = PRIZES.length * REPEAT;

/* ===========================
   Постройка ленты
   =========================== */
function buildStrip(){
  strip.innerHTML = '';
  for(let r=0;r<REPEAT;r++){
    for(const p of PRIZES){
      const el = document.createElement('div');
      el.className = 'item';
      const img = document.createElement('img');
img.src = p.img;
img.alt = p.label;
img.style.width = '70px';
img.style.height = '70px';
img.style.objectFit = 'cover';
img.style.borderRadius = '8px';
el.appendChild(img);
      strip.appendChild(el);
    }
  }
  // стартовое смещение
  strip.style.transform = 'translateX(0px)';
  strip.dataset.x = '0';
}
buildStrip();

/* ===========================
   Помощники
   =========================== */
function weightedChoice(list){
  const total = list.reduce((s,a)=>s + Math.max(0, a.weight || 0), 0);
  if(total <= 0) return null;
  let r = Math.random() * total, acc = 0;
  for(let i=0;i<list.length;i++){
    acc += list[i].weight;
    if(r < acc) return i;
  }
  return list.length - 1;
}
function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

/* ===========================
   Основной spin — теперь устойчиво к повторным нажатиям
   =========================== */
btn.addEventListener('click', () => {
  if(btn.disabled) return;
  btn.disabled = true;
  resultEl.textContent = 'Processing...';

  const choice = weightedChoice(PRIZES);
  if(choice === null){
    resultEl.textContent = 'Error: no prizes';
    btn.disabled = false;
    return;
  }

  // текущее смещение (в px)
  const from = parseFloat(strip.dataset.x || '0');
  const vpCenter = viewport.clientWidth / 2;

  // индекс предмета, который сейчас находится по центру (приблизительно)
  const currentCenterIndex = Math.round(( -from + vpCenter - ITEM_WIDTH/2 ) / FULL_W);

  // вычислим целевой "повтор" так, чтобы целевой индекс был ПЕРЕД текущим (вперед по ленте)
  let baseRepeat = Math.floor(currentCenterIndex / PRIZES.length);
  let targetRepeat = baseRepeat + BASE_ROTATIONS + 1; // гарантируем движение вперед

  let targetIndex = targetRepeat * PRIZES.length + choice;

  // защита: если мы вышли за пределы построенной ленты -> fallback в середину
  const maxSafeIndex = totalItems - PRIZES.length - 1;
  if(targetIndex > maxSafeIndex){
    targetRepeat = Math.floor(REPEAT / 2);
    targetIndex = targetRepeat * PRIZES.length + choice;
    // если всё равно <= current, подвинем чуть вперед (но не выше maxSafeIndex)
    if(targetIndex <= currentCenterIndex){
      targetIndex = Math.min(maxSafeIndex, currentCenterIndex + PRIZES.length);
    }
  }

  // координата выбранного элемента относительно начала strip
  const elementX = targetIndex * FULL_W;
  // целевой translateX — так, чтобы элемент оказался по центру viewport
  const targetTranslate = vpCenter - elementX - (ITEM_WIDTH/2);

  // если по какой-то причине целевая позиция совпадает с текущей (эфемерный случай) — добавим ещё полный виток
  let final = targetTranslate;
  if(Math.abs(final - from) < 0.5){
    const loopW = PRIZES.length * FULL_W;
    final -= loopW * (1 + Math.floor(Math.random() * 3)); // один-два-три доп. витка
  }

  // анимируем вручную (rAF)
  const start = performance.now();
  function raf(now){
    const t = Math.min(1, (now - start) / DURATION);
    const eased = easeOutCubic(t);
    const cur = from + (final - from) * eased;
    strip.style.transform = `translateX(${cur}px)`;
    if(t < 1){
      requestAnimationFrame(raf);
    } else {
      // зафиксируем позицию и отрендерим результат
      strip.style.transform = `translateX(${final}px)`;
      strip.dataset.x = String(final);
      // Покажем победу
      const prize = PRIZES[choice];
      resultEl.textContent = `Your prize is: ${prize.label} `;
      btn.disabled = false;

      // Дополнительно: если мы подошли слишком близко к концу ленты в пикселях,
      // можно "нормализовать" позицию (опционально). Пропускаю для простоты.
    }
  }
  requestAnimationFrame(raf);
});

/* ================
   Обработка ресайза: пересчитать центр (не обязательно)
   ================ */
window.addEventListener('resize', ()=>{
  // ничего критичного — но можно поправить позиционирование при сильном ресайзе
  // простая стратегия: перестроить ленту и сбросить translate, если очень маленький экран
  // (оставлю без агрессивных действий — обычно не нужно)
});