const CUR = 'USD'; // change to your currency code, e.g. 'PHP'
const CATS = [['Food', '#ff4a1c'], ['Transport', '#0c0d10'], ['Bills', '#3b6cff'], ['Fun', '#f2b705'], ['Other', '#8a8f9c']];
const money = n => n.toLocaleString(undefined, { style: 'currency', currency: CUR });
const db = store('budget', { cap: 1000, items: [{ id: 1, d: 'Groceries', a: 84.5, c: 'Food' }, { id: 2, d: 'Monthly transit pass', a: 40, c: 'Transport' }, { id: 3, d: 'Internet', a: 55, c: 'Bills' }] });
let s = db.get();

$('#c').innerHTML = CATS.map(([n]) => `<option>${n}</option>`).join('');
$('#cap').value = s.cap;

function draw() {
  const total = s.items.reduce((t, i) => t + i.a, 0), left = s.cap - total;
  $('#stats').innerHTML = `<div><b>${money(total)}</b>spent</div><div><b>${money(s.cap)}</b>budget</div><div><b class="${left < 0 ? 'neg' : ''}">${money(left)}</b>${left < 0 ? 'over budget' : 'left'}</div>`;
  let acc = 0;
  const stops = CATS.map(([n, c]) => {
    const v = s.items.filter(i => i.c === n).reduce((t, i) => t + i.a, 0), from = acc;
    acc += total ? v / total * 100 : 0;
    return { n, c, v, from, to: acc };
  });
  $('#donut').style.background = total ? `conic-gradient(${stops.filter(x => x.v).map(x => `${x.c} ${x.from}% ${x.to}%`).join(',')})` : '';
  $('#total').textContent = money(total);
  $('#legend').innerHTML = stops.map(x => `<li><i style="background:${x.c}"></i>${x.n}<b>${money(x.v)}</b></li>`).join('');
  $('#items').innerHTML = s.items.length
    ? s.items.slice().reverse().map(i => `<li><span>${esc(i.d)} <small class="meta">${esc(i.c)}</small></span><span>${money(i.a)} <button class="ghost sm" data-del="${i.id}">Delete</button></span></li>`).join('')
    : '<li class="empty">No expenses yet.</li>';
}
const save = () => { db.set(s); draw(); };

$('#cap').oninput = e => { s.cap = Math.max(0, +e.target.value || 0); save(); };
$('#f').onsubmit = e => {
  e.preventDefault();
  const a = +$('#a').value, d = $('#d').value.trim();
  if (!d || !(a > 0)) return;
  s.items.push({ id: Date.now(), d, a, c: $('#c').value }); e.target.reset(); save();
};
$('#items').onclick = e => { const id = e.target.dataset.del; if (id) { s.items = s.items.filter(i => i.id != id); save(); } };
draw();
