const MINUTES = { focus: 25, short: 5, long: 15 };
const today = () => new Date().toISOString().slice(0, 10);
const db = store('focus', { day: today(), done: 0, tasks: [{ id: 1, t: 'Review pull request', x: false }] });
let s = db.get(), mode = 'focus', left = MINUTES.focus * 60, end = 0, tick = null;
if (s.day !== today()) { s.day = today(); s.done = 0; }

const fmt = n => String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0');

function beep() {
  try { const a = new AudioContext(), o = a.createOscillator(); o.connect(a.destination); o.frequency.value = 660; o.start(); o.stop(a.currentTime + .25); } catch { /* audio blocked */ }
}
function show() {
  $('#time').textContent = fmt(left);
  $('#count').textContent = s.done;
  $('#go').textContent = tick ? 'Pause' : 'Start';
  $('#ring').style.setProperty('--p', 100 - left / (MINUTES[mode] * 60) * 100);
  document.title = (tick ? fmt(left) + ' | ' : '') + 'Focus Timer';
  document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode));
}
function stop() { clearInterval(tick); tick = null; }
function finish() {
  stop(); beep();
  if (mode === 'focus') { s.done++; db.set(s); }
  $('#msg').textContent = mode === 'focus' ? 'Session complete. Take a break.' : 'Break over. Back to it.';
}
function toggle() {
  if (tick) { stop(); return show(); }
  $('#msg').textContent = '';
  end = Date.now() + left * 1000;
  tick = setInterval(() => { left = Math.max(0, Math.round((end - Date.now()) / 1000)); if (!left) finish(); show(); }, 250);
  show();
}
function setMode(m) { stop(); mode = m; left = MINUTES[m] * 60; $('#msg').textContent = ''; show(); }

function drawTasks() {
  $('#tasks').innerHTML = s.tasks.length
    ? s.tasks.map(k => `<li class="${k.x ? 'done' : ''}"><label><input type="checkbox" data-c="${k.id}" ${k.x ? 'checked' : ''}> ${esc(k.t)}</label><button class="ghost sm" data-d="${k.id}">Delete</button></li>`).join('')
    : '<li class="empty">No tasks yet.</li>';
}
const saveTasks = () => { db.set(s); drawTasks(); };

$('#go').onclick = toggle;
$('#reset').onclick = () => setMode(mode);
document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => setMode(b.dataset.mode));
$('#f').onsubmit = e => { e.preventDefault(); const t = $('#t').value.trim(); if (!t) return; s.tasks.push({ id: Date.now(), t, x: false }); e.target.reset(); saveTasks(); };
$('#tasks').onclick = e => { const id = e.target.dataset.d; if (id) { s.tasks = s.tasks.filter(k => k.id != id); saveTasks(); } };
$('#tasks').onchange = e => { const id = e.target.dataset.c; if (id) { s.tasks.find(k => k.id == id).x = e.target.checked; saveTasks(); } };
show(); drawTasks();
