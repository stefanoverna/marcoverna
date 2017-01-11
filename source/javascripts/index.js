var FldGrd = require('fld-grd');
var baguetteBox = require('./baguettebox');
var fontFit = require('font-fit');
require('konamize');

window.konamize({
  code: [70, 69, 83, 83, 79],
  callback: function() { 
    var el = document.createElement('div');
    el.classList.add('easter');
    document.body.appendChild(el);
  }
});

var fldGrd = new FldGrd(document.querySelector('.gallery'), {
  rowHeight: 290,
  dataWidth: 'data-width',
  dataHeight: 'data-height',
});

fldGrd.update();

baguetteBox.run('.gallery', {
  overlayBackgroundColor: 'white',
  filter: /dato-images/,
});

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

function fitTitle() {
  var title = document.querySelector('.main-nav__title');

  var result = fontFit({
    text: title.textContent,
    font: 'bold 24px sans-serif',
    space: title.clientWidth,
    min: 20,
    max: 80
  });

  title.style.fontSize = result.fontSize + 'px';
}

fitTitle();

window.addEventListener('resize', fitTitle);
