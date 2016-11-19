var FldGrd = require('fld-grd');
var baguetteBox = require('./baguettebox');

var fldGrd = new FldGrd(document.querySelector('.gallery'), {
  rowHeight: 250,
  dataWidth: 'data-width',
  dataHeight: 'data-height',
});

fldGrd.update();

baguetteBox.run('.gallery', {
  overlayBackgroundColor: 'white',
});

[].forEach.call(document.querySelectorAll('.js-toggle'), function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.main-nav').classList.toggle('is-active');
  });
});
