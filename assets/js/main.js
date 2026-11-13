(() => {
  const nav = document.getElementById('menu');
  const burger = document.querySelector('.burger');
  const links = [...nav.querySelectorAll('a[href^="#"]')];

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = map.get(e.target.id);
      if (link && e.isIntersecting) {
        links.forEach(l => l.classList.remove('on'));
        link.classList.add('on');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
