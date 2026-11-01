(function(){
  var root = document.documentElement;
  root.classList.add('js');

  /* mobiel menu */
  var btn = document.getElementById('menuBtn');
  var header = document.querySelector('header.site');
  if (btn && header) {
    btn.addEventListener('click', function(){
      var open = header.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Sluit' : 'Menu';
    });
    document.querySelectorAll('.mobile-panel a').forEach(function(a){
      a.addEventListener('click', function(){
        header.classList.remove('open');
        btn.setAttribute('aria-expanded','false');
        btn.textContent = 'Menu';
      });
    });
  }

  /* navigatiecapsule: verdicht bij scrollen, wisselt thema boven fotobanden, markeert actieve sectie */
  var navSections = [].slice.call(document.querySelectorAll('main > section'));
  var navLinks = [].slice.call(document.querySelectorAll('.nav-links a'));
  var navTick = false;
  var navUpdate = function(){
    navTick = false;
    if (!header) return;
    header.classList.toggle('scrolled', (window.scrollY || 0) > 10);
    var probe = header.getBoundingClientRect().bottom - 18;
    var dark = false, activeId = '';
    var mid = (window.innerHeight || 800) * 0.4;
    for (var i = 0; i < navSections.length; i++) {
      var r = navSections[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) dark = navSections[i].classList.contains('photo-band');
      if (r.top <= mid && r.bottom > mid && navSections[i].id) activeId = navSections[i].id;
    }
    header.classList.toggle('nav-dark', dark);
    navLinks.forEach(function(a){
      a.classList.toggle('active', a.getAttribute('href') === '#' + activeId);
    });
  };
  var onNav = function(){
    if (!navTick) { navTick = true; window.requestAnimationFrame(navUpdate); }
  };
  window.addEventListener('scroll', onNav, { passive: true });
  window.addEventListener('resize', onNav, { passive: true });
  onNav();

  /* staande hero-video op telefoons (zoals future.co mobiel) */
  var hv = document.getElementById('heroVideo');
  if (hv && hv.dataset.portraitSrc && window.matchMedia && window.matchMedia('(max-aspect-ratio: 4/5)').matches) {
    hv.src = hv.dataset.portraitSrc;
    hv.load();
    if (hv.play) { hv.play().catch(function(){}); }
  }

  /* kaartenrij: pijlknoppen + slepen met de muis (zoals hun Swiper) */
  var cardsEl = document.querySelector('.cards');
  if (cardsEl) {
    var red = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    [].slice.call(document.querySelectorAll('.cbtn')).forEach(function(b){
      b.addEventListener('click', function(){
        var card = cardsEl.querySelector('.card');
        var step = card ? card.getBoundingClientRect().width + 16 : 320;
        cardsEl.scrollBy({ left: step * (parseInt(b.dataset.dir, 10) || 1), behavior: red ? 'auto' : 'smooth' });
      });
    });
    if (window.matchMedia && window.matchMedia('(pointer:fine)').matches) {
      var down = false, sx = 0, sl = 0, moved = false;
      cardsEl.addEventListener('pointerdown', function(e){
        down = true; moved = false; sx = e.clientX; sl = cardsEl.scrollLeft;
        cardsEl.setPointerCapture(e.pointerId);
      });
      cardsEl.addEventListener('pointermove', function(e){
        if (!down) return;
        var dx = e.clientX - sx;
        if (Math.abs(dx) > 4) { moved = true; cardsEl.classList.add('dragging'); }
        if (moved) cardsEl.scrollLeft = sl - dx;
      });
      var endDrag = function(){ down = false; cardsEl.classList.remove('dragging'); };
      cardsEl.addEventListener('pointerup', endDrag);
      cardsEl.addEventListener('pointercancel', endDrag);
    }
  }

  /* rustige fade-ins bij scrollen */
  var els = [].slice.call(document.querySelectorAll('.reveal'));
  var show = function(el){ el.classList.add('in'); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    document.querySelectorAll('video[autoplay]').forEach(function(v){
      v.removeAttribute('autoplay'); v.pause();
    });
  }
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(show);
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function(el){ io.observe(el); });

  /* telefoon: parallax bij het scrollen + subtiele 3D-tilt richting je muis */
  var heroPhone = document.querySelector('.phone--hero');
  var hero = document.querySelector('.hero');
  if (heroPhone && hero) {
    var ty = 0, rx = 0, ry = 0, raf = false;
    var apply = function(){
      raf = false;
      heroPhone.style.transform =
        'translateY(' + ty.toFixed(1) + 'px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    };
    var ask = function(){ if (!raf) { raf = true; window.requestAnimationFrame(apply); } };
    var onScrollPh = function(){
      var r = hero.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, -r.top / (r.height * 0.8)));
      ty = -170 * p; ask();
    };
    window.addEventListener('scroll', onScrollPh, { passive: true });
    window.addEventListener('resize', onScrollPh, { passive: true });
    onScrollPh();
    if (window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      hero.addEventListener('pointermove', function(e){
        var r = hero.getBoundingClientRect();
        ry = ((e.clientX - r.left) / r.width - .5) * 7;
        rx = (.5 - (e.clientY - r.top) / r.height) * 5;
        ask();
      });
      hero.addEventListener('pointerleave', function(){ rx = 0; ry = 0; ask(); });
    }
  }
})();
