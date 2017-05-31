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

var form = document.getElementById('js-contact-form');

if (form) {
  var emailTo = form.getAttribute('data-email');

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();

    var fields = ['email', 'name', 'phone', 'message'];
    var requiredFields = ['email', 'name', 'message'];

    var button = form.querySelector('button');

    var fieldInputs = fields.reduce(function(acc, field) {
      acc[field] = form.querySelector('[name=' + field + ']');
      return acc;
    }, {});

    var formData = fields.reduce(function(acc, field) {
      acc[field] = fieldInputs[field].value.trim();
      return acc;
    }, {});

    var isInvalid = false;

    for (var field in formData) {
      var value = formData[field];
      var isValid = requiredFields.indexOf(field) === -1 || value;
      var parent = fieldInputs[field].parentElement;

      parent.classList.toggle('form__field--invalid', !isValid);
      if (isValid) {
        var error = parent.querySelector('.form__error');
        if (error) {
          parent.removeChild(error);
        }
      } else {
        isInvalid = true;
        var error = document.createElement('div');
        error.classList.add('form__error');
        error.textContent = 'This field is required!';
        parent.appendChild(error);
      }
    }

    if (isInvalid) {
      alert('Some mandatory field are not filled in: please check the form!');
      return;
    }

    fields.forEach(function(field) {
      fieldInputs[field].disabled = true;
    });
    button.disabled = true;

    var request = new XMLHttpRequest();

    request.open('POST', 'https://formspree.io/' + emailTo, true);

    request.onload = function() {
      alert('Request has been sent successfully! You will receive a reply as soon as possible!');
      button.disabled = false;
      fields.forEach(function(field) {
        fieldInputs[field].value = '';
        fieldInputs[field].disabled = false;
      });
    };

    request.onerror = function(e) {
      alert('Ouch! Abbiamo avuto un problema nell\'inviare la richiesta... :/');
      button.disabled = false;
    };

    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(formData));
  });
}
