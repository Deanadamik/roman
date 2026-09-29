(function () {
  'use strict';
  const card = document.getElementById('questionCard');
  const cardStage = document.getElementById('cardStage');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const celebration = document.getElementById('celebration');
  const app = document.getElementById('app');
  const decorHearts = document.getElementById('decorHearts');
  const decorStars = document.getElementById('decorStars');
  const confettiRoot = document.getElementById('confetti');
  const floatHearts = document.getElementById('floatHearts');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastPosition = { x: 0, y: 0 };
  let moveCount = 0;
  const HEART_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  const STAR_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/></svg>';
  function initDecorations() {
    const heartCount = reducedMotion ? 6 : 14;
    const starCount = reducedMotion ? 8 : 18;
    for (let i = 0; i < heartCount; i += 1) {
      const el = document.createElement('span');
      el.className = 'particle';
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.setProperty('--dur', `${10 + Math.random() * 8}s`);
      el.style.setProperty('--delay', `${Math.random() * 5}s`);
      el.innerHTML = HEART_SVG;
      decorHearts.appendChild(el);
    }
    for (let i = 0; i < starCount; i += 1) {
      const el = document.createElement('span');
      el.className = 'particle';
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.setProperty('--dur', `${4 + Math.random() * 6}s`);
      el.style.setProperty('--delay', `${Math.random() * 4}s`);
      el.innerHTML = STAR_SVG;
      decorStars.appendChild(el);
    }
  }
  function getSafeBounds() {
    const stageRect = cardStage.getBoundingClientRect();
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const margin = 12;
    const maxX = Math.max(0, stageRect.width / 2 - cardWidth / 2 - margin);
    const maxY = Math.max(0, stageRect.height / 2 - cardHeight / 2 - margin);
    return { maxX, maxY, cardWidth, cardHeight };
  }
  function pickNewOffset(bounds, prev) {
    const { maxX, maxY } = bounds;
    if (maxX < 4 && maxY < 4) {
      const jitter = reducedMotion ? 4 : 12 + Math.random() * 20;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(angle) * jitter,
        y: Math.sin(angle) * jitter,
      };
    }
    const minDist = reducedMotion ? 24 : 48;
    let attempts = 0;
    let x;
    let y;
    do {
      const angle = Math.random() * Math.PI * 2;
      const dist = minDist + Math.random() * (Math.min(maxX, maxY) * 0.85 || minDist);
      x = Math.cos(angle) * Math.min(dist, maxX);
      y = Math.sin(angle) * Math.min(dist, maxY);
      x = Math.max(-maxX, Math.min(maxX, x));
      y = Math.max(-maxY, Math.min(maxY, y));
      attempts += 1;
    } while (
      attempts < 12 &&
      Math.hypot(x - prev.x, y - prev.y) < minDist * 0.5
    );
    return { x, y };
  }
  function applyCardTransform(x, y) {
    const transform = `translate(${x}px, ${y}px)`;
    card.style.transform = transform;
    card.style.setProperty('--card-transform', transform);
  }
  function moveCard() {
    const bounds = getSafeBounds();
    const next = pickNewOffset(bounds, lastPosition);
    lastPosition = next;
    moveCount += 1;
    applyCardTransform(next.x, next.y);
    if (!reducedMotion) {
      card.classList.remove('card--wiggle');
      void card.offsetWidth;
      card.classList.add('card--wiggle');
    }
  }
  function onNoClick(event) {
    event.preventDefault();
    event.stopPropagation();
    moveCard();
  }
  function spawnConfetti() {
    if (reducedMotion) return;
    const colors = ['#f48fb1', '#ce93d8', '#ffab91', '#ffc1e3', '#b39ddb'];
    const count = 36;
    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty('--fall-dur', `${2.2 + Math.random() * 2}s`);
      piece.style.setProperty('--fall-delay', `${Math.random() * 0.6}s`);
      confettiRoot.appendChild(piece);
    }
  }
  function spawnFloatingHearts() {
    const count = reducedMotion ? 4 : 10;
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement('span');
      el.className = 'fh';
      el.style.left = `${10 + Math.random() * 80}%`;
      el.style.bottom = `${5 + Math.random() * 20}%`;
      el.style.setProperty('--fh-dur', `${4 + Math.random() * 4}s`);
      el.style.setProperty('--fh-delay', `${Math.random() * 2}s`);
      el.innerHTML = HEART_SVG.replace('16', '20').replace('16', '20');
      floatHearts.appendChild(el);
    }
  }
  function showCelebration() {
    card.classList.add('card--exiting');
    const exitMs = reducedMotion ? 150 : 450;
    window.setTimeout(() => {
      app.classList.add('app--celebrating');
      celebration.hidden = false;
      celebration.classList.add('celebration--visible');
      spawnConfetti();
      spawnFloatingHearts();
    }, exitMs);
  }
  function onYesClick() {
    btnYes.disabled = true;
    btnNo.disabled = true;
    showCelebration();
  }
  function initEvents() {
    btnNo.addEventListener('click', onNoClick);
    btnYes.addEventListener('click', onYesClick);
    window.addEventListener(
      'resize',
      debounce(() => {
        const bounds = getSafeBounds();
        lastPosition.x = Math.max(-bounds.maxX, Math.min(bounds.maxX, lastPosition.x));
        lastPosition.y = Math.max(-bounds.maxY, Math.min(bounds.maxY, lastPosition.y));
        applyCardTransform(lastPosition.x, lastPosition.y);
      }, 150)
    );
    card.addEventListener('animationend', (e) => {
      if (e.animationName === 'card-wiggle') {
        card.classList.remove('card--wiggle');
      }
    });
  }
  function debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }
  function init() {
    initDecorations();
    initEvents();
    applyCardTransform(0, 0);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
