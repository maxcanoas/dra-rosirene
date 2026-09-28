// Menu, header, accordion, rolagem e formulário.
// Script clássico com defer (não é ES module) para funcionar abrindo o arquivo direto no navegador.
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => (reducedMotion.matches ? 'auto' : 'smooth');

  function focusWithoutScroll(el) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  /* Header e botões flutuantes */

  const header = document.querySelector('[data-header]');
  const toTop = document.querySelector('[data-to-top]');
  const whatsFloat = document.querySelector('[data-whats-float]');
  const hero = document.querySelector('.hero, [data-hero]');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    header?.classList.toggle('is-compact', y > 24);
    toTop?.classList.toggle('is-visible', y > 800);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  // O flutuante só aparece depois do topo, para não repetir os botões da primeira tela.
  if (whatsFloat) {
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        whatsFloat.classList.toggle('is-visible', !entry.isIntersecting);
      }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
    } else {
      whatsFloat.classList.add('is-visible');
    }
  }

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    const brand = document.querySelector('.brand');
    if (brand) brand.focus({ preventScroll: true });
  });

  /* Menu mobile */

  const menu = document.querySelector('[data-menu]');
  const openButton = document.querySelector('[data-menu-open]');

  if (menu && openButton) {
    const panel = menu.querySelector('.mobile-menu__panel');
    let lastFocus = null;

    const focusables = () => [...panel.querySelectorAll('a[href], button:not([disabled])')];

    function openMenu() {
      lastFocus = document.activeElement;
      menu.hidden = false;
      document.body.classList.add('is-locked');
      openButton.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => {
        menu.classList.add('is-open');
        focusables()[0]?.focus();
      });
    }

    function closeMenu({ restoreFocus = true } = {}) {
      if (menu.hidden) return;
      menu.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      openButton.setAttribute('aria-expanded', 'false');
      const hide = () => { menu.hidden = true; };
      if (reducedMotion.matches) hide();
      else panel.addEventListener('transitionend', hide, { once: true });
      if (restoreFocus) lastFocus?.focus();
    }

    openButton.addEventListener('click', openMenu);
    menu.querySelectorAll('[data-menu-close]').forEach((el) => el.addEventListener('click', () => closeMenu()));
    menu.querySelectorAll('.mobile-menu__list a').forEach((a) => {
      a.addEventListener('click', () => closeMenu({ restoreFocus: false }));
    });

    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    // Se a tela crescer até o menu horizontal com o painel aberto, fecha o painel.
    window.matchMedia('(min-width: 1200px)').addEventListener('change', (e) => {
      if (e.matches) closeMenu({ restoreFocus: false });
    });
  }

  /* Âncoras na mesma página: rolagem suave e foco na seção de destino */

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    settleOn(target);
    history.pushState(null, '', '#' + id);
    focusWithoutScroll(target);
  });

  // Seções com content-visibility só revelam a altura real quando chegam perto da tela.
  // No primeiro salto longo o destino pode ficar deslocado; ao fim da rolagem, reajusta.
  function settleOn(target) {
    const realign = () => target.scrollIntoView({ behavior: 'auto', block: 'start' });
    if (!('onscrollend' in window)) {
      setTimeout(realign, 900);
      return;
    }
    window.addEventListener('scrollend', realign, { once: true });
    // Se não houve rolagem, o ouvinte não pode ficar esperando a próxima rolagem do usuário.
    setTimeout(() => window.removeEventListener('scrollend', realign), 2500);
  }

  // Chegando de outra página com âncora (ex.: index.html#contato).
  if (location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      window.addEventListener('load', () => {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        settleOn(target);
      }, { once: true });
    }
  }

  /* Link ativo no menu da home */

  const navLinks = [...document.querySelectorAll('.site-nav__link[href^="#"]')];
  const sections = [...document.querySelectorAll('[data-section]')];

  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    const setActive = (id) => {
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => observer.observe(s));
  }

  /* Accordion: um item aberto por vez */

  document.querySelectorAll('[data-accordion]').forEach((accordion) => {
    const triggers = [...accordion.querySelectorAll('.accordion__trigger')];

    const setOpen = (trigger, open) => {
      trigger.setAttribute('aria-expanded', String(open));
      document.getElementById(trigger.getAttribute('aria-controls'))?.classList.toggle('is-open', open);
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
        triggers.forEach((t) => setOpen(t, false));
        if (willOpen) setOpen(trigger, true);
      });
    });
  });

  /* Formulário de contato (protótipo: não envia, só confirma) */

  const form = document.querySelector('[data-contact-form]');

  if (form) {
    form.noValidate = true;
    const success = form.querySelector('.contact-form__success');

    const rules = {
      nome: (v) => v.trim().length >= 2,
      telefone: (v) => v.replace(/\D/g, '').length >= 10,
    };

    function validateField(input) {
      const ok = rules[input.name](input.value);
      const error = document.getElementById(input.getAttribute('aria-describedby'));
      input.setAttribute('aria-invalid', String(!ok));
      if (error) error.hidden = ok;
      return ok;
    }

    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      input.addEventListener('blur', () => {
        if (input.value) validateField(input);
      });
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const invalid = Object.keys(rules)
        .map((name) => form.elements[name])
        .filter((input) => !validateField(input));

      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      form.classList.add('is-sent');
      success.hidden = false;
      success.focus();
      form.reset();
    });
  }
})();
