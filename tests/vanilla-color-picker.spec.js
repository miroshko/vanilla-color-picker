define(['../src/vanilla-color-picker'], function(colorPicker) {
  describe('Color Picker library', function() {
    it('is included as requirejs module', function() {
      expect(colorPicker).toEqual(jasmine.any(Function));
    });

    it('doesn\'t expose global variables in require.js envirenment', function() {
      expect(window.vanillaColorPicker).not.toBeDefined();
    });
  });

  describe('Color picker initialized on an input', function() {
    var input, picker;

    beforeEach(function() {
      input = document.createElement('input');
      input.classList.add('input-nr1');
      document.body.appendChild(input);
      picker = colorPicker(input);
    });

    afterEach(function() {
      picker.destroyPicker();
      input.parentNode.removeChild(input);
    });

    it('is sucessfully initialized', function() {
      expect(picker).toEqual(jasmine.any(Object));
    });

    it('contains reference to the element', function() {
      expect(picker.elem).toEqual(input);
    });

    it('displays the picker on focus', function() {
      effroi.mouse.focus(input);
      expect(document.querySelectorAll('.vanilla-color-picker').length).toEqual(1);
    });

    it('displays the picker on click', function() {
      expect(document.querySelectorAll('.vanilla-color-picker').length).toEqual(0);
      effroi.mouse.focus(input);
      effroi.mouse.click(input);
      expect(document.querySelectorAll('.vanilla-color-picker').length).toEqual(1);
    });
  });

  describe('Color picker activated on an input', function() {
    var input, picker;

    beforeEach(function() {
      input = document.createElement('input');
      input.classList.add('input-nr1');
      document.body.appendChild(input);
      picker = colorPicker(input);
      effroi.mouse.focus(input);
      effroi.mouse.click(input);
      expect(document.querySelectorAll('.vanilla-color-picker').length).toEqual(1);
    });

    afterEach(function() {
      effroi.mouse.click(document.body);
      picker.destroyPicker();
      input.parentNode.removeChild(input);
    });

    it('hides the picker if clicked outside', function(done) {
      effroi.mouse.focus(document.body);
      effroi.mouse.click(document.body);
      setTimeout(function() {
        expect(document.querySelectorAll('.vanilla-color-picker').length).toEqual(0);
        done();
      }, 10);
    });

    it('hides the picker if esc is pressed', function(done) {
      expect(document.querySelectorAll('.vanilla-color-picker').length).toEqual(1);
      effroi.keyboard.hit(effroi.keyboard.ESC);
      setTimeout(function() {
        expect(document.querySelectorAll('.vanilla-color-picker').length).toEqual(0);
        done();
      }, 100);
    });

    it('changes the value of the input if clicked on a color', function() {
      var colorElem = document.querySelector('.vanilla-color-picker-single-color');
      var color = colorElem.dataset.color;
      effroi.mouse.click(colorElem);
      expect(input.value).toEqual(color);
    });


    it('is controlled with enter', function() {
      var colorElem = document.querySelectorAll('.vanilla-color-picker-single-color')[2];
      effroi.mouse.focus(colorElem);
      var color = colorElem.dataset.color;

      effroi.keyboard.down(effroi.keyboard.ENTER);
      expect(input.value).toEqual(color);
    });
  });

  fdescribe('Color pickers events', function() {
    var input, picker;
    beforeEach(function() {
      input = document.createElement('input');
      input.classList.add('input-nr1');
      document.body.appendChild(input);
      picker = colorPicker(input);
    });

    afterEach(function() {
      picker.destroyPicker();
      input.parentNode.removeChild(input);
    });

    it('pickerCreated is triggered', function(done) {
      picker.on('pickerCreated', function() {
        expect(true).toEqual(true);
        done();
      });
      effroi.mouse.focus(input);
      effroi.mouse.click(input);
    });

    it('colorChosen is triggered', function(done) {
      picker.on('colorChosen', function(color, elem) {
        expect(color).toEqual(expectedColor);
        expect(elem).toEqual(input);
        done();
      });
      effroi.mouse.focus(input);
      effroi.mouse.click(input);
      var colorElem = document.querySelector('.vanilla-color-picker-single-color');
      var expectedColor = colorElem.dataset.color;
      effroi.mouse.focus(colorElem);
      effroi.mouse.click(colorElem);
    });

    it('pickerClosed is triggered', function(done) {
      picker.on('pickerClosed', function() {
        expect(true).toEqual(true);
        done();
      });
      effroi.mouse.focus(input);
      effroi.mouse.click(input);
      effroi.keyboard.hit(effroi.keyboard.ESC);
    });
  });
});
