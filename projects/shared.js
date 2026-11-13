const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = (key, fallback) => ({
  get() { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } },
  set(v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable */ } }
});
