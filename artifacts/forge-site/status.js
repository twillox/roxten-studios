/* =========================================================
   FORGE application status — reads one record from "venture_status"
   by its private code (?t=…). The record holds no contact details;
   the admin panel updates its status.
   ========================================================= */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBFMvIFGiU3GzJCIuUF4E37GwtZ6Hv3RDA',
  authDomain: 'roxten-studios.firebaseapp.com',
  projectId: 'roxten-studios',
  storageBucket: 'roxten-studios.firebasestorage.app',
  messagingSenderId: '390135535276',
  appId: '1:390135535276:web:dda05b5eacecabd6053109',
};
const STATUS_COLLECTION = 'venture_status';
const MINE_KEY = 'forge_my_apps';

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const TOKEN_RE = /^[a-z0-9]{20,64}$/;

const STATES = {
  new:         { step: 0, title: 'RECEIVED.',      lede: n => `Thanks${n}. Your brief is in our queue. Every application is read by a person on our team.` },
  reviewing:   { step: 1, title: 'IN REVIEW.',     lede: n => `Our team is reading your brief now${n}. We look at the idea, the problem and how you'd commit to it.` },
  shortlisted: { step: 2, title: 'SHORTLISTED.',   lede: n => `Good news${n}. Your idea made the shortlist. Expect us to reach out on your email or phone to set up a discovery call.` },
  accepted:    { step: 3, title: 'ACCEPTED.',      lede: n => `Welcome to FORGE${n}. We'd like to build this with you. We'll be in touch with next steps.` },
  rejected:    { step: 3, title: 'NOT THIS TIME.', lede: n => `Thank you for trusting us with your idea${n}. We can't take it forward in this round, but that isn't a verdict on you. You're welcome to apply again with a new idea or as this one grows.` },
};
const STEPS = ['Received', 'In review', 'Shortlisted', 'Decision'];

const fmt = v => {
  const d = v?.toDate ? v.toDate() : null;
  return d ? d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';
};

function show(view) {
  document.querySelectorAll('.st-view').forEach(v => { v.hidden = v.dataset.view !== view; });
}

function readMine() {
  try { return JSON.parse(localStorage.getItem(MINE_KEY) || '[]').filter(x => x && TOKEN_RE.test(x.t)); } catch { return []; }
}
function remember(t, d) {
  try {
    const list = readMine().filter(x => x.t !== t);
    list.unshift({ t, ref: d.ref || '', pitch: (d.pitch || '').slice(0, 140), at: Date.now() });
    localStorage.setItem(MINE_KEY, JSON.stringify(list.slice(0, 10)));
  } catch {}
}

function renderFound(d) {
  const st = STATES[d.status] || STATES.new;
  const n = d.first ? ', ' + d.first : '';
  $('#stRef').textContent = 'REF ' + (d.ref || '—');
  $('#stCreated').textContent = fmt(d.createdAt);
  $('#stUpdated').textContent = fmt(d.updatedAt || d.createdAt);
  const title = $('#stTitle');
  title.innerHTML = d.status === 'accepted' ? '<span class="slab">ACCEPTED.</span>' : esc(st.title);
  title.dataset.status = d.status || 'new';
  $('#stLede').textContent = st.lede(n);

  const last = d.status === 'rejected' ? 'Closed' : d.status === 'accepted' ? 'Accepted' : 'Decision';
  $('#stTrack').innerHTML = STEPS.map((label, i) => {
    const cls = i < st.step ? 'is-done' : i === st.step ? 'is-now' : '';
    const text = i === 3 ? last : label;
    return `<li class="${cls}${i === 3 && d.status === 'rejected' ? ' is-closed' : ''}"${i === st.step ? ' aria-current="step"' : ''}><i></i><span class="mono">0${i + 1}</span><b>${esc(text)}</b></li>`;
  }).join('');

  $('#stPitch').textContent = d.pitch || 'Untitled venture';
  const rows = [
    ['Profile', d.profile],
    ['Stage', d.stage],
    ['Build', Array.isArray(d.needs) ? d.needs.join(', ') : ''],
    ['Time / week', d.commitment],
    ['Application', d.track === 'quick' ? 'Quick pitch' : 'Full application'],
  ].filter(([, v]) => v);
  $('#stRows').innerHTML = rows.map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${esc(v)}</dd></div>`).join('');
  document.title = `${st.title.replace('.', '')} — FORGE application ${d.ref || ''}`.trim();
  show('found');
}

function renderLookup(notFound) {
  if (notFound) {
    $('#lookupK').textContent = 'Link not found';
    $('#lookupTitle').innerHTML = 'WE COULDN\'T<br/><span class="slab">FIND THAT.</span>';
    $('#lookupLede').textContent = 'Check that you copied the whole link, or paste it again below.';
  }
  const mine = readMine();
  $('#mine').hidden = !mine.length;
  $('#mineList').innerHTML = mine.map(x => `<li><a href="status.html?t=${x.t}"><span class="mono">${esc(x.ref || 'Application')}</span><b>${esc(x.pitch || 'Untitled venture')}</b><i>→</i></a></li>`).join('');
  show('lookup');
}

$('#lookupForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#lookupInput').value.trim();
  const m = v.match(/[?&]t=([a-z0-9]+)/i);
  const t = (m ? m[1] : v).toLowerCase();
  if (TOKEN_RE.test(t)) location.search = '?t=' + t;
  else { $('#lookupInput').focus(); $('#lookupInput').classList.add('is-bad'); }
});
$('#lookupInput').addEventListener('input', e => e.target.classList.remove('is-bad'));

async function load() {
  const t = (new URLSearchParams(location.search).get('t') || '').toLowerCase();
  if (!TOKEN_RE.test(t)) return renderLookup(false);
  try {
    const [{ initializeApp, getApps }, { getFirestore, doc, getDoc }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'),
    ]);
    const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
    const snap = await getDoc(doc(getFirestore(app), STATUS_COLLECTION, t));
    if (!snap.exists()) return renderLookup(true);
    remember(t, snap.data());
    renderFound(snap.data());
  } catch (err) {
    console.error('[status] lookup failed', err);
    renderLookup(true);
  }
}
load();
