/* =========================================================
   FORGE by Roxten Studios — interactions
   Change the program name in ONE place: PROGRAM_NAME below.
   ========================================================= */
(() => {
  const PROGRAM_NAME = 'FORGE';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
  };

  // ---------- Program name ----------
  $$('[data-name]').forEach(el => { el.textContent = PROGRAM_NAME; });
  document.title = document.title.replace(/^[^—]+/, PROGRAM_NAME + ' ');
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  if (!hasGsap) document.documentElement.classList.remove('js');
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  // ---------- Smooth scroll ----------
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const scrollToEl = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  window.forge = { scrollTo: scrollToEl, name: PROGRAM_NAME };

  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    closeMenu();
    scrollToEl(el);
  }));

  // ---------- Mobile menu ----------
  const burger = $('#burger');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    burger?.setAttribute('aria-expanded', 'false');
    $('#menu')?.setAttribute('aria-hidden', 'true');
    lenis?.start();
  }
  burger?.addEventListener('click', () => {
    const open = !document.body.classList.contains('menu-open');
    if (!open) return closeMenu();
    document.body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    $('#menu').setAttribute('aria-hidden', 'false');
    lenis?.stop();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // ---------- Nav state ----------
  const nav = $('#nav');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > 500 && y > lastY + 2 && !document.body.classList.contains('menu-open'));
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });

  const navLinks = $$('.nav__links a');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['concept', 'bring', 'process', 'model', 'faq'].forEach(id => { const s = $('#' + id); s && secObs.observe(s); });

  // Dark-section awareness (cursor + frame colour)
  const darkObs = new IntersectionObserver(entries => {
    entries.forEach(en => en.target._dark = en.isIntersecting);
    document.body.classList.toggle('on-dark', $$('.process, .apply, .footer').some(s => s._dark));
  }, { rootMargin: '-50% 0px -50% 0px' });
  $$('.process, .apply, .footer').forEach(s => darkObs.observe(s));

  // ---------- Pointer: spotlight, cursor, magnetic ----------
  const root = document.documentElement;
  const cursor = $('.cursor');
  if (fine && !reduce) {
    // "Selection" cursor: blueprint guides + x/y readout; snaps a selection frame around anything you can act on.
    document.body.classList.add('has-cursor');
    const lx = $('.cursor__x'), ly = $('.cursor__y'), box = $('.cursor__box'), pt = $('.cursor__pt'), tag = $('.cursor__tag');
    const pad = 7, idle = 18;
    let mx = innerWidth / 2, my = innerHeight / 2;
    let bx = mx, by = my, bw = idle, bh = idle, tx = mx, ty = my;
    let target = null, label = '';
    const labelFor = el => {
      if (el.closest('.morph__frame')) return 'drag ⟷';
      const s = el.closest('summary'); if (s) return s.parentElement.open ? 'close −' : 'expand +';
      if (el.closest('.choice, .pill, .consent')) return 'select';
      if (el.closest('#nextBtn')) return el.closest('#nextBtn').textContent.includes('Submit') ? 'submit ✓' : 'next →';
      if (el.closest('#prevBtn')) return '← back';
      if (el.closest('.switch button')) return 'switch';
      if (el.closest('#burger')) return 'menu';
      if (el.closest('#prompt button')) return 'build →';
      const a = el.closest('a'); if (a) {
        const h = a.getAttribute('href') || '';
        if (h === '#apply' || h.startsWith('apply.html')) return 'apply →';
        if (h === '#top') return 'top ↑';
        if (h.startsWith('#')) return 'go ↓';
        return 'open ↗';
      }
      return 'click';
    };
    const SEL = 'a, button, .choice, .pill, .consent, summary, .morph__frame';
    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      root.style.setProperty('--mx', mx + 'px');
      root.style.setProperty('--my', my + 'px');
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target;
      const isText = !!t.closest('input:not([type=radio]):not([type=checkbox]), textarea');
      cursor.classList.toggle('is-text', isText);
      const hit = isText ? null : t.closest(SEL);
      target = hit && !hit.disabled ? hit : null;
      if (target) label = labelFor(target);
      cursor.classList.toggle('is-hover', !!target);
    });
    addEventListener('pointerdown', () => { cursor.classList.add('is-down'); if (target) label = labelFor(target); });
    addEventListener('pointerup', () => { cursor.classList.remove('is-down'); setTimeout(() => { if (target) label = labelFor(target); }, 60); });
    document.addEventListener('pointerleave', () => cursor.style.opacity = 0);
    document.addEventListener('pointerenter', () => cursor.style.opacity = 1);

    const lerp = (a, b, k) => a + (b - a) * k;
    const loop = () => {
      let gx, gy, gw, gh;
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect();
        gx = r.left - pad; gy = r.top - pad; gw = r.width + pad * 2; gh = r.height + pad * 2;
      } else { gx = mx - idle / 2; gy = my - idle / 2; gw = idle; gh = idle; }
      const k = target ? .22 : .35;
      bx = lerp(bx, gx, k); by = lerp(by, gy, k); bw = lerp(bw, gw, k); bh = lerp(bh, gh, k);
      box.style.transform = `translate(${bx}px, ${by}px)`;
      box.style.width = bw + 'px'; box.style.height = bh + 'px';
      lx.style.transform = `translateY(${my}px)`;
      ly.style.transform = `translateX(${mx}px)`;
      pt.style.transform = `translate(${mx}px, ${my}px)`;
      // tag: coords when idle, action label when snapped (pinned to the frame's top-left corner)
      if (target) { tx = lerp(tx, bx, .3); ty = lerp(ty, by - 24, .3); tag.textContent = label; }
      else {
        tx = lerp(tx, mx + 16, .5); ty = lerp(ty, my + 14, .5);
        tag.textContent = '';
      }
      tag.style.transform = `translate(${tx}px, ${ty}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .25, y = (e.clientY - r.top - r.height / 2) * .35;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), color .4s';
        el.style.transform = '';
        setTimeout(() => el.style.transition = '', 600);
      });
    });
  }

  // ---------- Optional images: hide a slot until its file exists (add ?slots to the URL to see every slot) ----------
  if (/[?&]slots\b/.test(location.search)) root.classList.add('show-slots');
  const markMissing = img => img.closest('[data-slot]')?.classList.add('is-missing');
  $$('img[data-optional]').forEach(img => {
    if (img.complete && img.naturalWidth === 0) markMissing(img);
    img.addEventListener('error', () => markMissing(img));
    img.addEventListener('load', () => img.closest('[data-slot]')?.classList.remove('is-missing'));
    img.loading = 'eager'; // tiny files; load now so empty slots never flash
  });
  // "Who can apply": a picture follows the cursor over each row (desktop, only rows whose image exists)
  const whoFloat = $('.who__float');
  if (whoFloat && fine && !reduce) {
    const ok = new Map();
    $$('.who__list li[data-img]').forEach(li => {
      const probe = new Image();
      probe.onload = () => ok.set(li, li.dataset.img);
      probe.src = li.dataset.img;
      li.addEventListener('mouseenter', () => { const src = ok.get(li); if (!src) return; whoFloat.src = src; whoFloat.classList.add('is-on'); });
      li.addEventListener('mouseleave', () => whoFloat.classList.remove('is-on'));
      li.addEventListener('mousemove', e => { whoFloat.style.left = e.clientX + 'px'; whoFloat.style.top = e.clientY + 'px'; });
    });
  }

  // ---------- Hero morph: napkin sketch -> live product ----------
  const morph = $('#morph');
  const frame = $('.morph__frame', morph);
  const handle = $('#morphHandle');
  let pos = 100, tweenId = 0, userTook = false, built = false;
  const setPos = (p) => {
    pos = Math.max(0, Math.min(100, p));
    morph.style.setProperty('--pos', pos + '%');
    handle.setAttribute('aria-valuenow', Math.round(pos));
  };
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const tweenPos = (to, dur) => new Promise(res => {
    const id = ++tweenId, from = pos, t0 = performance.now();
    const step = now => {
      if (id !== tweenId) return res(false);
      const t = Math.min(1, (now - t0) / dur);
      setPos(from + (to - from) * easeInOut(t));
      t < 1 ? requestAnimationFrame(step) : res(true);
    };
    requestAnimationFrame(step);
  });
  const wait = ms => new Promise(r => setTimeout(r, ms));

  const countUp = () => {
    $$('[data-count]', morph).forEach(el => {
      const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
      const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      const fmt = v => pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-IN')) + suf;
      if (reduce) { el.textContent = fmt(end); return; }
      const t0 = performance.now(), dur = 1600;
      const step = now => {
        const t = Math.min(1, (now - t0) / dur);
        el.textContent = fmt(end * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };
  const markBuilt = () => { if (built) return; built = true; morph.classList.add('is-built'); countUp(); };

  const drawSketch = () => {
    const strokes = $$('.sk-ink > *, .sk-note > *', morph);
    morph.classList.add('is-drawing');
    strokes.forEach((s, i) => { s.style.transitionDelay = (i * 0.045) + 's'; });
    requestAnimationFrame(() => morph.classList.add('is-drawn'));
    return wait(strokes.length * 45 + 700);
  };

  const playMorph = async () => {
    if (reduce) { morph.classList.add('is-drawn'); setPos(50); markBuilt(); return; }
    await drawSketch();
    await wait(450);
    if (userTook) return markBuilt();
    const ok = await tweenPos(14, 1700);
    markBuilt();
    if (ok && !userTook) { await wait(500); await tweenPos(52, 1000); }
  };

  // Drag / click
  const posFromEvent = e => {
    const r = frame.getBoundingClientRect();
    return (e.clientX - r.left) / r.width * 100;
  };
  let dragging = false, startX = 0, startY = 0, decided = false;
  frame.addEventListener('pointerdown', e => {
    dragging = true; decided = e.pointerType === 'mouse'; startX = e.clientX; startY = e.clientY;
    if (decided) { userTook = true; tweenId++; markBuilt(); morph.classList.add('is-drag'); frame.setPointerCapture(e.pointerId); setPos(posFromEvent(e)); }
  });
  frame.addEventListener('pointermove', e => {
    if (!dragging) return;
    if (!decided) { // touch: only take over for horizontal swipes so page scroll still works
      const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
      if (dx < 6 && dy < 6) return;
      if (dy > dx) { dragging = false; return; }
      decided = true; userTook = true; tweenId++; markBuilt(); morph.classList.add('is-drag');
      try { frame.setPointerCapture(e.pointerId); } catch {}
    }
    setPos(posFromEvent(e));
  });
  const endDrag = () => { dragging = false; morph.classList.remove('is-drag'); };
  frame.addEventListener('pointerup', endDrag);
  frame.addEventListener('pointercancel', endDrag);
  handle.addEventListener('keydown', e => {
    const k = e.key; let p = pos;
    if (k === 'ArrowLeft' || k === 'ArrowDown') p -= 5;
    else if (k === 'ArrowRight' || k === 'ArrowUp') p += 5;
    else if (k === 'Home') p = 0; else if (k === 'End') p = 100; else return;
    e.preventDefault(); userTook = true; tweenId++; markBuilt(); setPos(p);
  });

  // Idea input -> sketch title, product title, URL slug
  const input = $('#ideaInput');
  const ideaTitle = $('[data-idea-title]', morph), ideaSketch = $('[data-idea-sketch]', morph), slugEl = $('[data-slug]', morph);
  const trunc = (s, n) => s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
  input?.addEventListener('input', () => {
    const v = input.value.trim();
    ideaTitle.textContent = v || 'Your big idea';
    ideaSketch.textContent = v ? trunc(v.toLowerCase(), 26) : 'your big idea';
    slugEl.textContent = (v.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 16)) || 'yourventure';
  });
  $('#prompt')?.addEventListener('submit', async e => {
    e.preventDefault();
    const v = input.value.trim();
    if (v) {
      store.set('forge_pitch', v);
      document.dispatchEvent(new CustomEvent('forge:pitch', { detail: v }));
    }
    userTook = true;
    if (!reduce) { await tweenPos(100, 350); markBuilt(); await tweenPos(0, 700); }
    setTimeout(() => { location.href = 'apply.html'; }, 250);
  });

  // Launch card mirrors the hero idea
  const launchTitle = $('[data-launch-title]');
  const setLaunch = v => { if (!launchTitle) return; launchTitle.textContent = v || 'Untitled venture'; launchTitle.classList.toggle('is-set', !!v); };
  input?.addEventListener('input', () => setLaunch(input.value.trim()));
  setLaunch(store.get('forge_pitch') || '');

  // ---------- Model switcher ----------
  const switcher = $('#switcher');
  if (switcher) {
    const compare = $('.compare', switcher);
    const setMode = (mode) => {
      if (switcher.dataset.mode === mode) return;
      switcher.dataset.mode = mode;
      $$('.switch button', switcher).forEach(b => b.setAttribute('aria-selected', b.dataset.mode === mode));
      $$('.compare__v', compare).forEach((v, i) => {
        setTimeout(() => {
          v.classList.remove('swap'); void v.offsetWidth; v.classList.add('swap');
          setTimeout(() => { v.textContent = v.dataset[mode]; }, 250);
        }, i * 60);
      });
    };
    switcher.dataset.mode = 'forge';
    $$('.switch button', switcher).forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  }


  // ---------- "What we bring" cards ----------
  const cards = $$('.panel');
  // cursor spotlight inside each card
  cards.forEach(card => card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--px', (e.clientX - r.left) + 'px');
    card.style.setProperty('--py', (e.clientY - r.top) + 'px');
  }));
  // file labels type themselves in when the cards come into view
  const typeObs = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    typeObs.unobserve(en.target);
    if (reduce) return;
    const el = en.target, full = el.textContent; let n = 0;
    el.textContent = ''; el.classList.add('is-typing');
    const delay = cards.indexOf(el.closest('.panel')) * 180;
    setTimeout(() => {
      const t = setInterval(() => {
        el.textContent = full.slice(0, ++n);
        if (n >= full.length) { clearInterval(t); setTimeout(() => el.classList.remove('is-typing'), 900); }
      }, 45);
    }, delay);
  }), { rootMargin: '0px 0px -15% 0px' });
  $$('.panel__file').forEach(f => typeObs.observe(f));
  // phone carousel pager
  const strip = $('#panels'), pNow = $('#panelsNow'), pBar = $('#panelsBar');
  const syncPager = () => {
    const max = strip.scrollWidth - strip.clientWidth;
    if (max <= 0) return;
    const p = strip.scrollLeft / max;
    pBar.style.transform = `scaleX(${.25 + p * .75})`;
    pNow.textContent = String(Math.min(cards.length, Math.round(p * (cards.length - 1)) + 1)).padStart(2, '0');
  };
  strip?.addEventListener('scroll', syncPager, { passive: true });

  // ---------- In-view classes (marks, strikes) ----------
  const inObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const delay = +(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('in'), delay);
      inObs.unobserve(el);
    });
  }, { rootMargin: '0px 0px -18% 0px' });
  $$('.strike').forEach((s, i, arr) => {
    const sibs = $$('.strike', s.parentElement);
    s.dataset.delay = sibs.indexOf(s) * 260;
    inObs.observe(s);
  });
  $$('mark').forEach(m => inObs.observe(m));

  // ---------- Manifesto word split ----------
  const mani = $('[data-words]');
  if (mani) {
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(mani);
  }

  // ---------- Process steps ----------
  const steps = $$('.step');
  const stepNum = $('#stepNum');
  const pBars = $$('#processBar span');
  let curStep = -1;
  const setStep = (i) => {
    if (i === curStep) return;
    const dir = i > curStep ? 1 : -1;
    curStep = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    pBars.forEach((b, k) => b.classList.toggle('on', k <= i));
    const txt = String(i + 1).padStart(2, '0');
    if (hasGsap && !reduce) {
      gsap.timeline()
        .to(stepNum, { yPercent: -100 * dir, opacity: 0, duration: .25, ease: 'power2.in' })
        .add(() => { stepNum.textContent = txt; })
        .fromTo(stepNum, { yPercent: 100 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: 'power3.out' });
    } else stepNum.textContent = txt;
  };
  const phone = matchMedia('(max-width: 720px)');
  const stepObs = new IntersectionObserver(entries => {
    if (phone.matches) return; // phones use the swipe row below
    entries.forEach(en => { if (en.isIntersecting) setStep(steps.indexOf(en.target)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => stepObs.observe(s));
  if (!hasGsap || reduce) steps.forEach(s => s.classList.add('is-active'));
  // phone: steps are a horizontal swipe row with its own pager
  const stepRow = $('#steps'), sNow = $('#stepsNow'), sBar = $('#stepsBar');
  stepRow?.addEventListener('scroll', () => {
    const max = stepRow.scrollWidth - stepRow.clientWidth;
    if (max <= 0) return;
    const p = stepRow.scrollLeft / max;
    sBar.style.transform = `scaleX(${1 / 6 + p * 5 / 6})`;
    sNow.textContent = String(Math.round(p * (steps.length - 1)) + 1).padStart(2, '0');
  }, { passive: true });

  // ---------- Loader + GSAP choreography ----------
  const loader = $('#loader');
  const heroIntro = () => {
    if (!hasGsap) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__line1 .reveal-up', { yPercent: 110, duration: 1.2 })
      .from('.hero__line2 .clip:first-child .reveal-up', { yPercent: 110, duration: 1.2 }, '<.12')
      .from('.hero__slab', { scaleX: 0, duration: 1, ease: 'expo.inOut' }, '<.1')
      .from('.hero__product .reveal-up', { yPercent: 110, duration: 1.2 }, '<.3')
      .from('.morph__frame', { y: 70, opacity: 0, rotate: 1.5, duration: 1.4 }, '<-.4')
      .from('.hero__meta, .hero__lede, .prompt, .hero__foot', { y: 24, opacity: 0, stagger: .08, duration: 1 }, '<-.2')
      .from('.hero__line', { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, '<');
  };

  // FORGE full form: two lines, each sized to exactly the width of the word above/below it
  const fitLines = (group, x, width, y0, gap) => {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = '100px Anton';
    let y = y0;
    $$('text', group).forEach((t, k) => {
      const m = ctx.measureText(t.textContent);
      const size = 100 * width / (m.width || 1);
      y += (k ? gap : 0) + (m.actualBoundingBoxAscent || 74) * size / 100;
      Object.entries({ x, y, 'font-size': size.toFixed(2), textLength: width, lengthAdjust: 'spacingAndGlyphs' }).forEach(([a, v]) => t.setAttribute(a, v));
    });
    return y;
  };
  const footFull = $('.footer__full');
  if (footFull) (document.fonts?.load('100px Anton') || Promise.resolve()).catch(() => {}).then(() => {
    const bottom = fitLines($('g', footFull), 0, 1000, 0, 22);
    footFull.setAttribute('viewBox', `0 0 1000 ${Math.ceil(bottom + 4)}`);
  });

  // Intro: the program in four seconds. Blueprint guides draw in, FORGE is sketched like a napkin idea,
  // a lime scanner builds it into solid type, a slab stamps it live — then the grid paper itself
  // dissolves square by square in a lime ripple from the centre, revealing the site.
  const runLoader = () => new Promise(async resolve => {
    // once per visit: a refresh (same tab session) goes straight to the site
    if (!hasGsap || reduce || store.get('forge_booted')) { loader?.remove(); return resolve(); }
    store.set('forge_booted', '1');
    try { history.scrollRestoration = 'manual'; } catch {}
    scrollTo(0, 0);
    lenis?.stop();
    const NS = 'http://www.w3.org/2000/svg';
    const svg = $('.intro__svg', loader), sketch = $('.intro__sketch', loader), solid = $('.intro__solid', loader);
    const guides = $('.intro__guides', loader), slab = $('#introSlab'), scan = $('#introScan'), clip = $('#introClipRect');
    const pct = $('#introPct'), stage = $('#introStage'), stageName = $('#introStageName'), bl = $('.intro__bl', loader);
    const note = $('.intro__note', loader), screen = $('#introScreen'), tab = $('.intro__tab', loader), bar = $('.intro__bar', loader);
    gsap.set(bar, { y: 150 }); // the screen's bar stays out of sight until it's time to roll up

    // wait (briefly) for Anton so the guides land on the real letter shapes
    await Promise.race([document.fonts?.load('300px Anton').catch(() => {}), new Promise(r => setTimeout(r, 1200))]);
    const base = 330, ctx = document.createElement('canvas').getContext('2d');
    ctx.font = '300px Anton';
    const cap = Math.min(290, Math.max(180, ctx.measureText('FORGE').actualBoundingBoxAscent || 250));
    const top = base - cap, left = 500 - 390, right = 500 + 390;
    const fullBottom = fitLines($('.intro__full', loader), left, right - left, base + 52, 0);
    svg.setAttribute('viewBox', `0 0 1000 ${Math.ceil(fullBottom + 12)}`);

    const line = (x1, y1, x2, y2, cls = '') => { const l = document.createElementNS(NS, 'line'); Object.entries({ x1, y1, x2, y2 }).forEach(([k, v]) => l.setAttribute(k, v)); if (cls) l.setAttribute('class', cls); guides.appendChild(l); return l; };
    const label = (x, y, t, anchor = 'start') => { const e = document.createElementNS(NS, 'text'); e.setAttribute('x', x); e.setAttribute('y', y); e.setAttribute('text-anchor', anchor); e.textContent = t; guides.appendChild(e); return e; };
    const hLines = [line(-60, top, 1060, top), line(-60, base, 1060, base)];
    const vLines = [line(left, top - 60, left, base + 50), line(right, top - 60, right, base + 50)];
    const ticks = [line(left, base + 34, right, base + 34, 'tick'), line(left, base + 26, left, base + 42, 'tick'), line(right, base + 26, right, base + 42, 'tick')];
    const labels = [label(left, top - 18, 'FORGE / 01'), label(500, base + 70, 'idea → product', 'middle')];

    gsap.set(slab, { attr: { x: left - 60, y: top - 24, width: right - left + 120, height: cap + 48 }, scaleX: 0, skewX: -8, transformOrigin: '0% 50%' });
    gsap.set(scan, { attr: { y: top - 40, height: cap + 80 }, opacity: 0 });
    gsap.set(hLines, { scaleX: 0, transformOrigin: '0% 50%' });
    gsap.set(vLines, { scaleY: 0, transformOrigin: '50% 0%' });
    gsap.set([...ticks, ...labels], { opacity: 0 });

    const setStage = (v, name, cls) => () => { stage.textContent = v; stageName.textContent = name; bl.classList.remove('is-build', 'is-live'); if (cls) bl.classList.add(cls); };
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.intro__hud > span', { opacity: 0, y: 10, stagger: .06, duration: .7 }, 0)
      .to({ v: 0 }, { v: 100, duration: 3.1, ease: 'power2.inOut', onUpdate() { pct.textContent = String(Math.round(this.targets()[0].v)).padStart(3, '0'); } }, .1)

      // 1. blueprint
      .to(hLines, { scaleX: 1, duration: .9, stagger: .12, ease: 'expo.inOut' }, .15)
      .to(vLines, { scaleY: 1, duration: .8, stagger: .1, ease: 'expo.inOut' }, .35)
      .to([...ticks, ...labels], { opacity: 1, duration: .5, stagger: .05 }, .7)

      // 2. sketch — drawn by hand, a little wobbly
      .to(sketch, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, .55)
      .to('.intro__note path', { strokeDashoffset: 0, duration: .5, stagger: .2, ease: 'power2.out' }, 1.4)
      .from('.intro__note text', { opacity: 0, y: 8, rotate: -4, transformOrigin: '50% 50%', duration: .5 }, 1.3)

      // 3. build — a scanner passes and leaves solid type behind it
      .call(setStage('v0.5', 'build', 'is-build'), null, 2.05)
      .to(scan, { opacity: 1, duration: .12 }, 2.05)
      .to({ p: 60 }, { p: 960, duration: .85, ease: 'power3.inOut', onUpdate() { const p = this.targets()[0].p; clip.setAttribute('width', p); scan.setAttribute('x', p - 6); } }, 2.05)
      .to(scan, { opacity: 0, duration: .2 }, 2.85)
      .to(sketch, { opacity: 0, duration: .4 }, 2.6)
      .to([note, guides], { opacity: 0, duration: .45, ease: 'power2.out' }, 2.55)

      // 4. launch — the slab stamps in behind the word
      .call(setStage('v1.0', 'launch', 'is-live'), null, 2.95)
      .fromTo('.intro__full', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .7 }, 3.05)
      .to(slab, { scaleX: 1, duration: .55, ease: 'expo.inOut' }, 2.9)
      .fromTo(svg, { scale: 1 }, { keyframes: { scale: [1.035, 1] }, duration: .45, ease: 'power2.out' }, 3.35)

      // 5. projector screen: tug it down a little… let go… it rolls up and away
      .addLabel('out', 4.5)
      .call(() => { scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true, force: true }); }, null, 'out')
      .to(bar, { y: 0, duration: .6, ease: 'power3.out' }, 'out')          // the bar rises into view from below
      .addLabel('tug', 'out+=.65')
      .to(tab, { scaleY: 1.5, duration: .3, ease: 'power2.out' }, 'tug')
      .to(screen, { y: () => Math.min(56, innerHeight * .06), duration: .6, ease: 'power2.inOut' }, 'tug')
      .to(tab, { scaleY: 1, duration: .4, ease: 'back.out(3)' }, 'tug+=.7')
      .to(screen, { y: () => -innerHeight - 220, duration: 1, ease: 'power3.in' }, 'tug+=.75')
      .call(resolve, null, 'tug+=1.25')
      .call(() => { loader.remove(); lenis?.start(); }, null, 'tug+=1.8');

    // impatient? click or press any key to fast-forward
    const skip = () => { tl.timeScale(3); removeEventListener('keydown', skip); };
    loader.addEventListener('click', skip, { once: true });
    addEventListener('keydown', skip);
  });

  let started = false;
  const start = () => { if (started) return; started = true; heroIntro(); setTimeout(playMorph, hasGsap && !reduce ? 700 : 0); };
  runLoader().then(start);

  if (!hasGsap) return;

  // Manifesto scrub
  const words = $$('.manifesto__text .w');
  if (words.length && !reduce) {
    ScrollTrigger.create({
      trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: self => {
        const p = self.progress * words.length;
        words.forEach((w, i) => w.style.setProperty('--o', Math.min(1, Math.max(.14, p - i + .14))));
      },
    });
  } else words.forEach(w => w.style.setProperty('--o', 1));

  if (reduce) return;

  // Generic section reveals
  const rise = (sel, opts = {}) => $$(sel).forEach(el => gsap.from(el, {
    y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', ...opts,
    scrollTrigger: { trigger: el, start: 'top 88%' },
  }));
  rise('.section .tag, .process .tag, .apply .tag');
  rise('.h2, .apply__title, .diff__are, .diff__not', { y: 80 });
  rise('.lede, .switcher, .manifesto__sig, .apply__lede, .apply__meta, .fine, .diff__cols, .need');
  gsap.from('.launch', { y: 100, opacity: 0, rotate: 4, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.launch', start: 'top 90%' } });
  // cards: fan in, then drift at different speeds while scrolling (desktop) so the row never feels static
  gsap.fromTo('.panel', { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, transformOrigin: '50% 100%', stagger: .1, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.panels', start: 'top 85%' } });
  gsap.matchMedia().add('(min-width: 1081px)', () => {
    [0, 70, 20, 90].forEach((d, i) => {
      gsap.fromTo(cards[i], { y: d }, { y: -d * .4, ease: 'none', scrollTrigger: { trigger: '.panels', start: 'top bottom', end: 'bottom top', scrub: .6 } });
    });
  });
  gsap.from('.who__list li', { y: 40, opacity: 0, stagger: .07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.who__list', start: 'top 85%' } });
  gsap.from('.faq details', { y: 30, opacity: 0, stagger: .06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.faq__list', start: 'top 85%' } });

  // Equation cards slide in and meet
  gsap.from('.eq-card--rx', { xPercent: -30, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.equation', start: 'top 80%' } });
  gsap.from('.eq-card--you', { xPercent: 30, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.equation', start: 'top 80%' } });
  gsap.from('.eq-op', { scale: 0, rotate: -180, duration: 1.1, ease: 'back.out(2)', scrollTrigger: { trigger: '.equation', start: 'top 70%' } });
  gsap.from('.eq-card li', { x: -20, opacity: 0, stagger: .05, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.equation', start: 'top 70%' } });
  gsap.from('.result', { clipPath: 'inset(0 100% 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.result', start: 'top 85%' } });

  // Marquee skew on scroll velocity
  const track = $$('.marquee__seq');
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate: self => gsap.to(track, { skewX: gsap.utils.clamp(-12, 12, self.getVelocity() / -200), duration: .4, overwrite: true }),
  });

  gsap.fromTo('.mani-fig', { y: 60 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: .6 } });
  // Hero scene subtle scroll-away
  gsap.to('.morph', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Final title
  gsap.from('.final__title > span', { yPercent: 100, opacity: 0, stagger: .12, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.final', start: 'top 75%' } });
  gsap.from('.final__kicker, .final .btn', { y: 30, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.final', start: 'top 70%' } });
  gsap.fromTo('.footer__big', { yPercent: 30 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
