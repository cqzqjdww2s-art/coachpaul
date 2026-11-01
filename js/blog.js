(function(){
  /* hamburger-menu */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function(){
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  /* zoekfilter */
  var input = document.getElementById('zoek');
  var cards = [].slice.call(document.querySelectorAll('#grid .feature, #shelf .item'));
  if (input) {
    input.addEventListener('input', function(){
      var q = input.value.trim().toLowerCase();
      cards.forEach(function(c){
        var hay = (c.textContent + ' ' + (c.dataset.zoek || '')).toLowerCase();
        c.style.display = !q || hay.indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }
})();
