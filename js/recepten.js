(function(){
  var btns = [].slice.call(document.querySelectorAll('.fbtn'));
  var cards = [].slice.call(document.querySelectorAll('#grid .recept'));
  btns.forEach(function(b){
    b.addEventListener('click', function(){
      btns.forEach(function(x){ x.classList.toggle('on', x === b); });
      var f = b.dataset.f;
      cards.forEach(function(c){
        c.style.display = (f === 'alles' || c.dataset.cat === f) ? '' : 'none';
      });
    });
  });
})();
