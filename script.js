(function () {
  'use strict';

  const card = document.getElementById('questionCard');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const celebration = document.getElementById('celebration');
  const app = document.getElementById('app');
  const decorHearts = document.getElementById('decorHearts');
  const decorStars = document.getElementById('decorStars');
  const confettiRoot = document.getElementById('confetti');
  const floatHearts = document.getElementById('floatHearts');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let noBtnEscaped = false;
  let lastNoPosition = { x: 0, y: 0 };

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

  function getViewportMetrics() {
    const vv = window.visualViewport;
    return {
      width: vv ? vv.width : document.documentElement.clientWidth,
      height: vv ? vv.height : document.documentElement.clientHeight,
      offsetLeft: vv ? vv.offsetLeft : 0,
      offsetTop: vv ? vv.offsetTop : 0,
    };
  }

  function getNoButtonBounds() {
    const { width, height, offsetLeft, offsetTop } = getViewportMetrics();
    const btnW = btnNo.offsetWidth;
    const btnH = btnNo.offsetHeight;

    const minX = offsetLeft;
    const minY = offsetTop;
    const maxX = offsetLeft + width - btnW;
    const maxY = offsetTop + height - btnH;

    return { minX, minY, maxX, maxY };
  }

  function clampNoPosition(x, y) {
    const { minX, minY, maxX, maxY } = getNoButtonBounds();
    return {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y)),
    };
  }

  function pickNewNoPosition(bounds, prev) {
    const { minX, minY, maxX, maxY } = bounds;

    if (maxX < minX || maxY < minY) {
      return { x: minX, y: minY };
    }

    const minDist = reducedMotion ? 48 : 72 + Math.random() * 40;
    let attempts = 0;
    let x;
    let y;

    do {
      x = minX + Math.random() * (maxX - minX);
      y = minY + Math.random() * (maxY - minY);
      attempts += 1;
    } while (
      attempts < 16 &&
      Math.hypot(x - prev.x, y - prev.y) < minDist
    );

    return { x, y };
  }

  function applyNoPosition(x, y) {
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
  }

  function escapeNoButton() {
    if (noBtnEscaped) return;

    const rect = btnNo.getBoundingClientRect();
    const placeholder = document.createElement('span');
    placeholder.className = 'btn-no-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.style.width = `${rect.width}px`;
    placeholder.style.height = `${rect.height}px`;
    btnNo.parentNode.insertBefore(placeholder, btnNo);

    document.body.appendChild(btnNo);
    btnNo.classList.add('btn--no--escaped');
    applyNoPosition(rect.left, rect.top);

    noBtnEscaped = true;
    lastNoPosition = { x: rect.left, y: rect.top };
  }

  function moveNoButton() {
    if (!noBtnEscaped) {
      escapeNoButton();
    }

    const bounds = getNoButtonBounds();
    const next = pickNewNoPosition(bounds, lastNoPosition);
    lastNoPosition = next;
    applyNoPosition(next.x, next.y);

    if (!reducedMotion) {
      btnNo.classList.remove('btn--no--wiggle');
      void btnNo.offsetWidth;
      btnNo.classList.add('btn--no--wiggle');
    }
  }

  function onNoClick(event) {
    event.preventDefault();
    event.stopPropagation();
    moveNoButton();
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
    if (noBtnEscaped) {
      btnNo.hidden = true;
    }

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

  function onViewportChange() {
    if (!noBtnEscaped) return;
    const clamped = clampNoPosition(lastNoPosition.x, lastNoPosition.y);
    lastNoPosition = clamped;
    applyNoPosition(clamped.x, clamped.y);
  }

  function initEvents() {
    btnNo.addEventListener('click', onNoClick);
    btnYes.addEventListener('click', onYesClick);

    window.addEventListener('resize', debounce(onViewportChange, 150));

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', debounce(onViewportChange, 150));
      window.visualViewport.addEventListener('scroll', debounce(onViewportChange, 150));
    }

    btnNo.addEventListener('animationend', (e) => {
      if (e.animationName === 'btn-no-wiggle') {
        btnNo.classList.remove('btn--no--wiggle');
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
