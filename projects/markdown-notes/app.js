const SAMPLE = '# Meeting notes\n\nWrite in **Markdown** and see it render *live*.\n\n- Headings, lists, and quotes\n- `inline code` and [links](https://developer.mozilla.org)\n\n> Notes save automatically in this browser.\n\n```js\nconst hello = "world";\n```\n';
const db = store('notes', { text: SAMPLE });

const inline = s => s
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

// All input is HTML-escaped first, so only the tags generated below can reach the DOM.
function render(src) {
  const code = [];
  const text = esc(src).replace(/```[^\n]*\n([\s\S]*?)```/g, (_, c) => { code.push(c.replace(/\n$/, '')); return `\n\n@@${code.length - 1}@@\n\n`; });
  return text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean).map(b => {
    let m;
    if ((m = b.match(/^@@(\d+)@@$/))) return `<pre><code>${code[m[1]]}</code></pre>`;
    if ((m = b.match(/^(#{1,3}) ([\s\S]*)$/))) return `<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`;
    if (b.split('\n').every(l => l.startsWith('- '))) return '<ul>' + b.split('\n').map(l => `<li>${inline(l.slice(2))}</li>`).join('') + '</ul>';
    if (b.startsWith('&gt; ')) return `<blockquote>${inline(b.replace(/^&gt; ?/gm, '').replace(/\n/g, '<br>'))}</blockquote>`;
    return `<p>${inline(b).replace(/\n/g, '<br>')}</p>`;
  }).join('');
}

function update() {
  const t = $('#src').value;
  $('#out').innerHTML = render(t);
  $('#count').textContent = `${t.trim() ? t.trim().split(/\s+/).length : 0} words, ${t.length} characters`;
  db.set({ text: t });
}
$('#src').value = db.get().text;
$('#src').addEventListener('input', update);
$('#reset').onclick = () => { $('#src').value = SAMPLE; update(); };
$('#dl').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([$('#src').value], { type: 'text/markdown' }));
  a.download = 'notes.md'; a.click(); URL.revokeObjectURL(a.href);
};
update();
