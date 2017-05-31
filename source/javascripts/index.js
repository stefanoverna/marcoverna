var FldGrd = require('fld-grd');
var baguetteBox = require('./baguettebox');

var gallery = document.querySelector('.gallery');

if (gallery) {
  var fldGrd = new FldGrd(document.querySelector('.gallery'), {
    rowHeight: 300,
    dataWidth: 'data-width',
    dataHeight: 'data-height',
  });

  fldGrd.update();

  baguetteBox.run('.gallery', {
    overlayBackgroundColor: 'white',
    filter: /datocms-assets/,
  });
}

[].forEach.call(document.querySelectorAll('.js-toggle'), function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    var nav = document.querySelector('.main-nav');

    if (nav.classList.contains('is-active')) {
      nav.classList.remove('is-active-after');
      setTimeout(function() {
        nav.classList.remove('is-active');
      }, 200);
    } else {
      nav.classList.add('is-active');
      setTimeout(function() {
        nav.classList.add('is-active-after');
      }, 0);
    }

    fitTitle();
  });
});

window.addEventListener('resize', fitTitle);
