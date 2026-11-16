/* =========================================================
   FORGE application — one question per screen, live venture brief,
   autosaved draft, review, then Firestore ("venture_applications").
   Field names match the admin panel + firestore.rules.
   ========================================================= */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBFMvIFGiU3GzJCIuUF4E37GwtZ6Hv3RDA',
  authDomain: 'roxten-studios.firebaseapp.com',
  projectId: 'roxten-studios',
  storageBucket: 'roxten-studios.firebasestorage.app',
  messagingSenderId: '390135535276',
  appId: '1:390135535276:web:dda05b5eacecabd6053109',
};
const COLLECTION = 'venture_applications';
const PROGRAM = 'FORGE';
const DRAFT_KEY = 'forge_draft_v2';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const first = () => (data.name || '').trim().split(/\s+/)[0] || '';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(hover: none)').matches;

const SECTIONS = { you: 'You', profile: 'Profile', idea: 'Idea', stage: 'Stage', commit: 'Commitment', review: 'Review' };

const QUESTIONS = [
  { id: 'name', sec: 'you', type: 'text', required: true, max: 100, autocomplete: 'name',
    title: () => 'Let\'s start with you. <em>What\'s your name?</em>', placeholder: 'Type your full name' },
  { id: 'email', sec: 'you', type: 'email', required: true, max: 190, autocomplete: 'email',
    title: () => `Nice to meet you${first() ? ', ' + esc(first()) : ''}. <em>Your email?</em>`, placeholder: 'you@email.com' },
  { id: 'phone', sec: 'you', type: 'tel', required: true, max: 30, autocomplete: 'tel',
    title: () => 'Best number to reach you?', sub: 'WhatsApp works great.', placeholder: '+91 98765 43210' },
  { id: 'city', sec: 'you', type: 'text', max: 80, autocomplete: 'address-level2',
    title: () => 'Which city are you building from?', placeholder: 'e.g. Hyderabad' },
  { id: 'link', sec: 'you', type: 'url', max: 300,
    title: () => 'Got a LinkedIn or website?', sub: 'Optional — it helps us get to know you.', placeholder: 'linkedin.com/in/you' },
  { id: 'profile', sec: 'profile', type: 'choice', required: true, grid: true,
    title: () => 'Which best describes you?',
    options: [
      { v: 'Individual with a startup idea', b: 'Individual', s: 'with a promising startup idea' },
      { v: 'First-time entrepreneur', b: 'First-timer', s: 'starting my first venture' },
      { v: 'Early-stage startup', b: 'Early-stage startup', s: 'needing technical execution' },
      { v: 'Founder with validated idea, no dev team', b: 'Validated idea', s: 'but no development team' },
      { v: 'Existing business', b: 'Existing business', s: 'building or transforming a digital product' },
    ] },
  { id: 'pitch', sec: 'idea', type: 'text', required: true, max: 140,
    title: () => 'Now the fun part. <em>Your idea, in one line.</em>', sub: 'Keep it simple — what is it?', placeholder: 'e.g. A platform that connects home chefs with office lunch orders' },
  { id: 'problem', sec: 'idea', type: 'textarea', required: true, max: 1200,
    title: () => 'What problem does it solve — <em>and for whom?</em>', sub: 'Who has this problem, and how do they deal with it today?', placeholder: 'Write freely…' },
  { id: 'audience', sec: 'idea', type: 'text', max: 200,
    title: () => 'Who will use it first?', placeholder: 'e.g. Small restaurant owners in tier-2 cities' },
  { id: 'stage', sec: 'stage', type: 'choice', required: true,
    title: () => 'Where is it today?',
    options: [
      { v: 'Just an idea', b: 'Just an idea', s: 'it lives in my head and my notes' },
      { v: 'Researched / validated', b: 'Researched / validated', s: 'I\'ve talked to potential users' },
      { v: 'Prototype or MVP', b: 'Prototype / MVP', s: 'something early already exists' },
      { v: 'Live with users', b: 'Live with users', s: 'people are already using it' },
    ] },
  { id: 'needs', sec: 'stage', type: 'multi', grid: true,
    title: () => 'What needs to be built?', sub: 'Pick all that apply.',
    options: [
      { v: 'Website', b: 'Website' }, { v: 'Mobile app', b: 'Mobile app' }, { v: 'Web platform / SaaS', b: 'Web platform / SaaS' },
      { v: 'Backend / APIs', b: 'Backend / APIs' }, { v: 'Branding', b: 'Branding' }, { v: 'Not sure yet', b: 'Not sure yet' },
    ] },
  { id: 'commitment', sec: 'commit', type: 'choice', required: true, grid: true,
    title: () => 'How much time can you give it each week?',
    options: [{ v: 'Under 10 hrs', b: 'Under 10 hrs' }, { v: '10–20 hrs', b: '10–20 hrs' }, { v: '20–40 hrs', b: '20–40 hrs' }, { v: 'Full-time', b: 'Full-time' }] },
  { id: 'why', sec: 'commit', type: 'textarea', required: true, max: 1200,
    title: () => `Why you${first() ? ', ' + esc(first()) : ''} — <em>and why now?</em>`, sub: 'What makes you the right person to build this?', placeholder: 'Write freely…' },
  { id: 'revshare', sec: 'commit', type: 'choice', required: true,
    title: () => 'We build in exchange for an agreed share of future earnings — <em>not upfront fees.</em> Open to that?',
    options: [{ v: 'Yes', b: 'Yes, absolutely' }, { v: 'Want to know more', b: 'I\'d like to know more first' }] },
  { id: 'review', sec: 'review', type: 'review', title: () => 'Here\'s your <em>venture brief.</em>', sub: 'Check everything, then send it over.' },
];

// Two ways in: the full application (strongest case) or a quick 4-question pitch.
const QUICK_IDS = ['name', 'email', 'phone', 'pitch'];
const QUICK = [...QUESTIONS.filter(q => QUICK_IDS.includes(q.id)), QUESTIONS[QUESTIONS.length - 1]];
let QS = QUESTIONS;
const useTrack = t => { QS = t === 'quick' ? QUICK : QUESTIONS; };

// ---------- State ----------
let data = {};
try { data = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}'); } catch {}
data.needs = Array.isArray(data.needs) ? data.needs : [];
try { const p = sessionStorage.getItem('forge_pitch'); if (p && !data.pitch) data.pitch = p.slice(0, 140); } catch {}
let cur = 0, busy = false;

const host = $('#qHost');
const saveNote = $('#saveNote');
let saveT;
function save() {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, consent: undefined })); } catch {}
  clearTimeout(saveT);
  saveNote.textContent = 'Saved ✓'; saveNote.classList.add('is-saved');
  saveT = setTimeout(() => { saveNote.textContent = 'Progress saves automatically'; saveNote.classList.remove('is-saved'); }, 1400);
}

// ---------- Rendering ----------
function control(q) {
  const v = data[q.id];
  if (q.type === 'textarea') {
    return `<div class="q__field"><textarea class="q__input q__input--area" id="qi" rows="3" maxlength="${q.max}" placeholder="${esc(q.placeholder)}">${esc(v)}</textarea><span class="q__count">${(v || '').length} / ${q.max}</span></div>`;
  }
  if (q.type === 'choice' || q.type === 'multi') {
    const on = o => q.type === 'multi' ? data.needs.includes(o.v) : v === o.v;
    return `<div class="opts${q.grid ? ' opts--grid' : ''}" role="${q.type === 'multi' ? 'group' : 'radiogroup'}">` + q.options.map((o, i) =>
      `<button type="button" class="opt${on(o) ? ' is-on' : ''}" data-v="${esc(o.v)}" role="${q.type === 'multi' ? 'checkbox' : 'radio'}" aria-checked="${on(o)}"><kbd>${String.fromCharCode(65 + i)}</kbd><span><b>${esc(o.b)}</b>${o.s ? `<small>${esc(o.s)}</small>` : ''}</span><i>✓</i></button>`
    ).join('') + '</div>';
  }
  if (q.type === 'review') {
    const rows = QS.filter(x => x.type !== 'review').map(x => {
      const val = x.id === 'needs' ? data.needs.join(', ') : data[x.id];
      const label = { name: 'Name', email: 'Email', phone: 'Phone', city: 'City', link: 'Link', profile: 'Profile', pitch: 'Pitch', problem: 'Problem', audience: 'First users', stage: 'Stage', needs: 'Build', commitment: 'Time / week', why: 'Why you', revshare: 'Revenue share' }[x.id];
      return `<div class="review__row"><dt>${label}</dt><dd class="${val ? '' : 'is-blank'}">${val ? esc(val) : '—'}</dd><button type="button" class="review__edit" data-jump="${QS.indexOf(x)}">Edit</button></div>`;
    }).join('');
    return `<dl class="review">${rows}</dl>
      ${QS === QUICK ? `<button type="button" class="upgrade" data-upgrade><span><b>Want a stronger case?</b> Add ${QUESTIONS.length - QUICK.length} more answers — about 2 minutes.</span><i>→</i></button>` : ''}
      <label class="consent"><input type="checkbox" id="consent" ${data.consent ? 'checked' : ''} /><span>I agree that Roxten Studios may contact me about this application.</span></label>`;
  }
  const type = q.type === 'url' ? 'text' : q.type;
  const mode = q.type === 'url' ? ' inputmode="url"' : '';
  return `<div class="q__field"><input class="q__input" id="qi" type="${type}"${mode} maxlength="${q.max}" autocomplete="${q.autocomplete || 'off'}" placeholder="${esc(q.placeholder)}" value="${esc(v)}" />${q.id === 'pitch' ? `<span class="q__count">${(v || '').length} / ${q.max}</span>` : ''}</div>`;
}

function okLabel(q) {
  if (q.type === 'review') return '<span>Submit application</span><b>→</b>';
  return '<span>OK</span><b>✓</b>';
}

function build(i) {
  const q = QS[i];
  const n = QS.filter(x => x.type !== 'review').length;
  const el = document.createElement('div');
  el.className = 'q';
  el.dataset.type = q.type;
  el.innerHTML = `
    <p class="q__num mono"><span>${q.type === 'review' ? '✓' : String(i + 1).padStart(2, '0')}</span> → ${SECTIONS[q.sec]}${q.type !== 'review' ? ` · ${i + 1} of ${n}` : ''}</p>
    <h1 class="q__title">${q.title()}</h1>
    ${q.sub ? `<p class="q__sub">${q.sub}</p>` : ''}
    ${control(q)}
    <p class="q__err" role="alert"></p>
    <div class="q__actions">
      ${q.type === 'choice' ? '' : `<button type="button" class="btn ${q.type === 'review' ? 'btn--lime btn--xl' : 'btn--ink'}" data-ok>${okLabel(q)}</button>`}
      ${!q.required && q.type !== 'review' && q.type !== 'choice' ? '<button type="button" class="q__skip" data-skip>Skip</button>' : ''}
    </div>`;
  return el;
}

function buildTrack() {
  const el = document.createElement('div');
  el.className = 'q q--track';
  const full = QUESTIONS.length - 1, quick = QUICK.length - 1;
  const card = (key, v, rec, name, meta, desc, bars) => `
    <button type="button" class="track${data.track === v ? ' is-on' : ''}" data-track="${v}" role="radio" aria-checked="${data.track === v}">
      ${rec ? '<span class="track__rec mono">Recommended</span>' : ''}
      <span class="track__top"><kbd>${key}</kbd><span class="mono track__meta">${meta}</span></span>
      <b class="track__name">${name}</b>
      <span class="track__desc">${desc}</span>
      <span class="track__power"><span class="mono">Selection strength</span><span class="track__bars">${[1, 2, 3, 4, 5].map(n => `<i class="${n <= bars ? 'on' : ''}"></i>`).join('')}</span></span>
    </button>`;
  el.innerHTML = `
    <p class="q__num mono"><span>00</span> → Before we begin</p>
    <h1 class="q__title">How would you like to <em>pitch it?</em></h1>
    <p class="q__sub">The more we understand your idea, the stronger your case for selection. Short on time? A quick pitch works too — we'll follow up for the rest.</p>
    <div class="tracks" role="radiogroup">
      ${card('A', 'full', true, 'Full application', `${full} questions · ~3 min`, 'Give us the full picture — the problem, your stage, your commitment. Your best shot at being shortlisted.', 5)}
      ${card('B', 'quick', false, 'Quick pitch', `${quick} questions · ~1 min`, 'Just you and the idea, short and clear. Add more detail later, or when we reach out.', 2)}
    </div>
    <p class="q__err" role="alert"></p>
`;
  $$('[data-track]', el).forEach(b => b.addEventListener('click', () => chooseTrack(b.dataset.track, b)));
  return el;
}

function chooseTrack(t, btn) {
  data.track = t;
  useTrack(t);
  save();
  $$('[data-track]').forEach(b => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
  updateBrief();
  if (busy) return;
  busy = true;
  setTimeout(() => { busy = false; go(0); }, reduce ? 0 : 450);
}

function show(i, back = false) {
  const old = host.querySelector('.q:not(.q--out):not(.q--out-back)');
  const el = i === -1 ? buildTrack() : build(i);
  if (old) {
    old.classList.add(back ? 'q--out-back' : 'q--out');
    setTimeout(() => old.remove(), reduce ? 0 : 460);
  }
  el.classList.add(back ? 'q--in-back' : 'q--in');
  host.appendChild(el);
  cur = i;
  if (i >= 0) wire(el, QS[i]);
  updateChrome();
  const inp = el.querySelector('#qi');
  if (inp && !touch) setTimeout(() => { inp.focus({ preventScroll: true }); const L = inp.value.length; try { inp.setSelectionRange(L, L); } catch {} }, reduce ? 0 : 380);
  else if (!touch) setTimeout(() => el.querySelector('.track.is-on, .track, .opt.is-on, .opt, [data-ok]')?.focus({ preventScroll: true }), reduce ? 0 : 380);
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  try { history.replaceState(null, '', i === -1 ? '#start' : `#q${i + 1}`); } catch {}
}

function wire(el, q) {
  const inp = el.querySelector('#qi');
  if (inp) {
    if (inp.tagName === 'TEXTAREA') autosize(inp);
    inp.addEventListener('input', () => {
      data[q.id] = inp.value;
      el.classList.remove('is-invalid'); el.querySelector('.q__err').textContent = '';
      const c = el.querySelector('.q__count'); if (c) c.textContent = `${inp.value.length} / ${q.max}`;
      if (inp.tagName === 'TEXTAREA') autosize(inp);
      updateBrief(); clearTimeout(inp._t); inp._t = setTimeout(save, 350);
    });
  }
  $$('.opt', el).forEach(btn => btn.addEventListener('click', () => pick(q, btn)));
  el.querySelector('[data-ok]')?.addEventListener('click', next);
  el.querySelector('[data-skip]')?.addEventListener('click', () => { data[q.id] = ''; save(); go(cur + 1); });
  $$('[data-jump]', el).forEach(b => b.addEventListener('click', () => { returnToReview = true; go(+b.dataset.jump, true); }));
  el.querySelector('[data-upgrade]')?.addEventListener('click', () => {
    data.track = 'full'; useTrack('full'); save(); updateBrief();
    const k = QS.findIndex(x => x.type !== 'review' && (x.id === 'needs' ? !data.needs.length : !String(data[x.id] || '').trim()));
    go(k === -1 ? QS.length - 1 : k);
  });
  el.querySelector('#consent')?.addEventListener('change', e => { data.consent = e.target.checked; el.querySelector('.q__err').textContent = ''; });
}

function autosize(t) { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 320) + 'px'; }

let returnToReview = false;
function pick(q, btn) {
  const v = btn.dataset.v;
  const el = btn.closest('.q');
  el.querySelector('.q__err').textContent = '';
  if (q.type === 'multi') {
    const i = data.needs.indexOf(v);
    if (i > -1) data.needs.splice(i, 1); else data.needs.push(v);
    btn.classList.toggle('is-on'); btn.setAttribute('aria-checked', btn.classList.contains('is-on'));
    updateBrief(); save();
    return;
  }
  data[q.id] = v;
  $$('.opt', el).forEach(o => { const on = o === btn; o.classList.toggle('is-on', on); o.setAttribute('aria-checked', on); });
  btn.classList.remove('flash'); void btn.offsetWidth; btn.classList.add('flash');
  updateBrief(); save();
  if (busy) return;
  busy = true;
  setTimeout(() => { busy = false; go(cur + 1); }, reduce ? 0 : 420);
}

// ---------- Validation + navigation ----------
function validate(q) {
  const v = String(data[q.id] ?? '').trim();
  if (q.type === 'review') return data.consent ? '' : 'Please tick the box so we can contact you.';
  if (q.type === 'multi') return '';
  if (q.required && !v) return q.type === 'choice' ? 'Please choose an option.' : 'This one is required.';
  if (!v) return '';
  if (q.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'That email doesn\'t look right.';
  if (q.type === 'tel' && v.replace(/\D/g, '').length < 8) return 'Please enter a valid phone number.';
  if (q.type === 'url') {
    if (/^https?:\/\/\S+\.\S+/.test(v)) return '';
    if (/^[\w.-]+\.\w{2,}(\/\S*)?$/.test(v)) { data[q.id] = 'https://' + v; return ''; }
    return 'Please enter a full link, or skip.';
  }
  return '';
}

function next() {
  if (cur === -1) { if (data.track) go(0); else { const el = host.querySelector('.q--track'); el.querySelector('.q__err').textContent = 'Choose one to begin.'; } return; }
  const q = QS[cur];
  if (typeof data[q.id] === 'string') data[q.id] = data[q.id].trim();
  const err = validate(q);
  const el = host.querySelector('.q:not(.q--out):not(.q--out-back)');
  if (err) {
    el.classList.add('is-invalid');
    el.querySelector('.q__err').textContent = err;
    el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 360, easing: 'ease-out' });
    return;
  }
  save();
  if (q.type === 'review') return submit(el);
  go(returnToReview ? QS.length - 1 : cur + 1);
}

function go(i, back = false) {
  if (i < -1 || i >= QS.length) return;
  if (i === QS.length - 1) returnToReview = false;
  // never jump past an unanswered required question
  if (!back && i > cur) {
    for (let k = 0; k < i; k++) {
      const q = QS[k];
      if (q.required && validate(q)) { i = k; break; }
    }
  }
  show(i, back || i < cur);
}

// ---------- Chrome: progress, sections, counters ----------
const secOrder = ['you', 'profile', 'idea', 'stage', 'commit'];
function updateChrome() {
  $$('#secs li').forEach(li => { li.hidden = !QS.some(x => x.sec === li.dataset.sec); });
  if (cur === -1) {
    $('#progress').style.transform = 'scaleX(0)';
    $('#qNow').textContent = '00'; $('#qTotal').textContent = data.track === 'quick' ? String(QUICK.length - 1) : String(QUESTIONS.length - 1);
    $$('#secs li').forEach(li => li.classList.remove('is-on', 'is-done'));
    $('#prevQ').disabled = true; $('#nextQ').disabled = !data.track;
    return;
  }
  const q = QS[cur];
  const total = QS.length - 1;
  $('#progress').style.transform = `scaleX(${Math.min(1, cur / total)})`;
  $('#qNow').textContent = q.type === 'review' ? '✓' : String(cur + 1).padStart(2, '0');
  $('#qTotal').textContent = String(total);
  const si = secOrder.indexOf(q.sec);
  $$('#secs li').forEach((li, k) => {
    li.classList.toggle('is-on', k === si);
    li.classList.toggle('is-done', si === -1 ? true : k < si);
  });
  $('#prevQ').disabled = false; // from question 1, back returns to the full/quick choice
  $('#nextQ').disabled = cur >= QS.length - 1;
}

// ---------- Live brief ----------
const BRIEF_FIELDS = ['name', 'email', 'phone', 'profile', 'pitch', 'problem', 'audience', 'stage', 'needs', 'commitment', 'why', 'revshare'];
function setRow(key, html) {
  const row = $(`[data-row="${key}"]`); const dd = $(`[data-b="${key}"]`);
  if (!row || !dd) return;
  const empty = !html;
  if (dd.innerHTML !== (html || '')) dd.innerHTML = html || '';
  row.classList.toggle('is-empty', empty);
}
function updateBrief() {
  const title = $('[data-b="pitch"]');
  const pitch = (data.pitch || '').trim();
  title.textContent = pitch || 'Untitled venture';
  title.classList.toggle('is-empty', !pitch);
  const founder = [data.name, data.city].map(s => (s || '').trim()).filter(Boolean).join(' · ');
  setRow('founder', esc(founder));
  setRow('profile', esc(data.profile));
  const prob = (data.problem || '').trim();
  setRow('problem', esc(prob.length > 110 ? prob.slice(0, 108) + '…' : prob));
  setRow('audience', esc(data.audience));
  setRow('stage', esc(data.stage));
  setRow('needs', data.needs.map(n => `<span class="chip">${esc(n)}</span>`).join(''));
  setRow('commitment', esc(data.commitment));
  const fields = QS === QUICK ? QUICK_IDS : BRIEF_FIELDS;
  const filled = fields.filter(k => k === 'needs' ? data.needs.length : String(data[k] || '').trim()).length;
  const pct = Math.round(filled / fields.length * 100);
  $('#briefPct').textContent = pct;
  $('#briefMeter').style.transform = `scaleX(${pct / 100})`;
}

// ---------- Keyboard ----------
document.addEventListener('keydown', e => {
  if ($('#done').classList.contains('is-open')) return;
  if (cur === -1) {
    if (/^[ab]$/i.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); $$('[data-track]')[e.key.toLowerCase() === 'a' ? 0 : 1].click(); }
    else if (e.key === 'Enter' && data.track) { e.preventDefault(); go(0); }
    return;
  }
  const q = QS[cur];
  const t = e.target instanceof Element ? e.target : document.body;
  const inText = t.matches('input:not([type=checkbox]), textarea');
  if (e.key === 'Enter' && !e.shiftKey && !t.matches('button, a')) {
    if (t.matches('input[type=checkbox]')) return;
    e.preventDefault(); next(); return;
  }
  if (!inText && (q.type === 'choice' || q.type === 'multi') && /^[a-z]$/i.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
    const btn = $$('.q:not(.q--out):not(.q--out-back) .opt')[e.key.toUpperCase().charCodeAt(0) - 65];
    if (btn) { e.preventDefault(); btn.click(); }
  }
});
$('#prevQ').addEventListener('click', () => go(cur - 1, true));
$('#nextQ').addEventListener('click', next);
$('#flow').addEventListener('submit', e => e.preventDefault());

// ---------- Submit ----------
let fb = null;
async function getDb() {
  if (fb) return fb;
  const [{ initializeApp, getApps }, fs] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'),
  ]);
  const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
  fb = { db: fs.getFirestore(app), ...fs };
  return fb;
}
const refId = () => 'RX-' + Date.now().toString(36).slice(-4).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase();

async function submit(el) {
  const btn = el.querySelector('[data-ok]');
  const errEl = el.querySelector('.q__err');
  const ref = refId();
  if ($('.hp').value) return done(ref, btn); // bot honeypot: pretend success
  btn.classList.add('is-loading'); btn.disabled = true;
  btn.innerHTML = '<span>Sending</span><b>◌</b>';
  const payload = {
    name: data.name || '', email: data.email || '', phone: data.phone || '', city: data.city || '', link: data.link || '',
    profile: data.profile || '', pitch: (data.pitch || '').slice(0, 140), problem: (data.problem || '').slice(0, 1200),
    audience: data.audience || '', stage: data.stage || '', needs: data.needs, commitment: data.commitment || '',
    why: (data.why || '').slice(0, 1200), revshare: data.revshare || '', consent: true,
    ref, track: data.track === 'quick' ? 'quick' : 'full', program: PROGRAM, status: 'new', source: location.hostname || 'local', userAgent: navigator.userAgent.slice(0, 200),
  };
  try {
    const { db, collection, addDoc, serverTimestamp } = await getDb();
    await Promise.race([
      addDoc(collection(db, COLLECTION), { ...payload, createdAt: serverTimestamp() }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000)),
    ]);
    try { localStorage.removeItem(DRAFT_KEY); sessionStorage.removeItem('forge_pitch'); } catch {}
    done(ref, btn);
  } catch (err) {
    console.error('[apply] submit failed', err);
    errEl.textContent = 'Something went wrong while sending. Your answers are saved — please try again in a moment.';
    btn.classList.remove('is-loading'); btn.disabled = false;
    btn.innerHTML = '<span>Try again</span><b>→</b>';
  }
}

function done(ref, btn) {
  const brief = $('#brief');
  brief.classList.add('is-built');
  $('#briefStamp').textContent = 'Submitted ✓';
  $('#progress').style.transform = 'scaleX(1)';
  $('#doneRef').textContent = 'REF ' + ref;
  $('#doneName').textContent = first() ? ', ' + first() : '';
  const r = btn?.getBoundingClientRect();
  const doneEl = $('#done');
  if (r) { doneEl.style.setProperty('--cx', (r.left + r.width / 2) + 'px'); doneEl.style.setProperty('--cy', (r.top + r.height / 2) + 'px'); }
  setTimeout(() => {
    doneEl.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => doneEl.classList.add('is-open')));
    try { history.replaceState(null, '', '#done'); } catch {}
  }, reduce ? 0 : 700);
}

// ---------- Init ----------
updateBrief();
const startAt = () => {
  const m = location.hash.match(/^#q(\d+)$/);
  const want = m ? Math.min(QS.length, +m[1]) - 1 : 0;
  // resume at the first unanswered required question, but not beyond what was asked for
  let k = 0;
  while (k < want && !(QS[k].required && validate(QS[k]))) k++;
  return k;
};
if (data.track) { useTrack(data.track); updateBrief(); show(location.hash === '#start' ? -1 : startAt()); }
else show(-1);
