// Reveal ao rolar, parallax e contador.
// Tudo desliga com prefers-reduced-motion. Parallax também desliga abaixo de 768px.
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wideScreen = window.matchMedia('(min-width: 768px)');
  const hasObserver = 'IntersectionObserver' in window;

  /* Reveal */

  const STAGGER_MS = 80;
  const revealItems = [...document.querySelectorAll('.reveal')];

  // Irmãos que revelam juntos (cards, passos, números) entram em sequência.
  revealItems.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const index = siblings.indexOf(el);
    if (siblings.length > 1 && index > 0) el.style.setProperty('--reveal-delay', `${Math.min(index, 5) * STAGGER_MS}ms`);
  });

  if (reducedMotion.matches || !hasObserver) {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        revealObserver.unobserve(el);
        // Terminada a entrada, a classe sai para não prender transform e transição (ex.: hover dos cards).
        el.addEventListener('transitionend', function done(event) {
          if (event.target !== el) return;
          el.removeEventListener('transitionend', done);
          el.classList.remove('reveal', 'is-visible');
          el.style.removeProperty('--reveal-delay');
        });
        el.classList.add('is-visible');
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((el) => revealObserver.observe(el));
  }

  /* Parallax */

  const DEFAULT_RANGE = 48;
  const layers = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
    el,
    factor: Math.min(Math.max(parseFloat(el.dataset.parallax) || 0, 0.08), 0.25),
    section: el.closest('section'),
    range: DEFAULT_RANGE,
  }));
  let parallaxOn = false;
  let frame = 0;

  // Camadas maiores que o contêiner (fundos) podem andar até a sobra que têm.
  function measure() {
    layers.forEach((layer) => {
      const slack = (layer.el.offsetHeight - layer.el.parentElement.clientHeight) / 2;
      layer.range = slack > 4 ? slack : DEFAULT_RANGE;
    });
  }

  function update() {
    frame = 0;
    const viewportCenter = window.innerHeight / 2;
    layers.forEach(({ el, factor, section, range }) => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const distance = rect.top + rect.height / 2 - viewportCenter;
      const y = Math.max(-range, Math.min(range, -distance * factor));
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    });
  }

  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  function setParallax() {
    const shouldRun = layers.length > 0 && !reducedMotion.matches && wideScreen.matches;
    if (shouldRun === parallaxOn) return;
    parallaxOn = shouldRun;
    if (shouldRun) {
      layers.forEach(({ el }) => { el.style.willChange = 'transform'; });
      measure();
      update();
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', measure);
    } else {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', measure);
      layers.forEach(({ el }) => {
        el.style.transform = '';
        el.style.willChange = '';
      });
    }
  }

  setParallax();
  reducedMotion.addEventListener('change', setParallax);
  wideScreen.addEventListener('change', setParallax);

  /* Contador */

  const counters = [...document.querySelectorAll('[data-count-to]')];
  const DURATION = 1400;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function count(el) {
    const target = parseInt(el.dataset.countTo, 10);
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      el.textContent = String(Math.round(target * easeOut(t)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if (counters.length && hasObserver && !reducedMotion.matches) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        count(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => {
      el.textContent = '0';
      counterObserver.observe(el);
    });
  }
})();
