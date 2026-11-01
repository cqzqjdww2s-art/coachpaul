(function(){
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* onthullingen */
  var els = [].slice.call(document.querySelectorAll('.reveal'));
  var show = function(el){ el.classList.add('in'); };
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(show);
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function(el){ io.observe(el); });
  }

  /* sectievideo's: laden en spelen zodra ze in beeld komen, pauzeren erbuiten */
  var vids = [].slice.call(document.querySelectorAll('video.lazyvid'));
  if (!reduce && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src && v.dataset.src) { v.src = v.dataset.src; }
          if (v.play) { v.play().catch(function(){}); }
        } else if (v.pause) { v.pause(); }
      });
    }, { rootMargin: '200px 0px' });
    vids.forEach(function(v){ vio.observe(v); });
  }
  if (reduce) {
    document.querySelectorAll('video[autoplay]').forEach(function(v){
      v.removeAttribute('autoplay'); v.pause();
    });
  }

  /* productbalk: actieve sectie markeren */
  var anchors = [].slice.call(document.querySelectorAll('.ln-anchors a[href^="#"]'));
  var secs = anchors.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  var tick = false;
  var spy = function(){
    tick = false;
    var mid = (window.innerHeight || 800) * .38, id = '';
    secs.forEach(function(s){
      if (!s) return;
      var r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) id = s.id;
    });
    anchors.forEach(function(a){
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  };
  var onS = function(){ if (!tick) { tick = true; window.requestAnimationFrame(spy); } };
  window.addEventListener('scroll', onS, { passive: true });
  window.addEventListener('resize', onS, { passive: true });
  spy();
})();
