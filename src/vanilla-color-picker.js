(function(global) {

  var basicCSS = '.vanilla-color-picker { display: inline-block; position: absolute; padding: 5px; background-color: #fff; box-shadow: 0 0 2px 0px rgba(0,0,0,0.5) } .vanilla-color-picker-single-color { display: inline-block; width: 20px; height: 20px; margin: 1px; border-radius: 2px; }';
  function singleColorTpl(color) {
    return '<div class="vanilla-color-picker-single-color" data-color="' + color + '" style="background-color:' + color + '"></div>';
  }
  var colors = ['red', 'yellow', 'green'];

  // 

  function addBasicStyling() {
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = basicCSS;
    global.document.head.appendChild(style);
    
  }

  function MessageMediator() {
    this.subscribers = {}
    this.on = function(eventName, callback) {
      this.subscribers[eventName] = this.subscribers[eventName] || [];
      this.subscribers[eventName].push(callback);
      return this;
    };

    this.emit = function(eventName) {
      var arguments_ = arguments;
      (this.subscribers[eventName] || []).forEach(function(callback) {
        callback.apply(null, Array.prototype.splice.call(arguments_, 1));
      });
    };
  }

  function SinglePicker(elem) {
    MessageMediator.apply(this);
    this.targetElem = elem;
    this.elem = null;
    var this_ = this;

    this._initialize = function() {
      this._createPickerElement();

      this._positionPickerElement();
      this._addEventListeners();
    };

    this.destroy = function() {
      try {
        this.elem.parentNode.removeChild(this.elem);
      }
      catch (e) {
        // http://stackoverflow.com/a/22934552
      }
    };

    this._positionPickerElement = function() {
      var left = this.targetElem.offsetLeft;
      var top = this.targetElem.offsetTop;
      var height = this.targetElem.offsetHeight;
      this.elem.style.left = left + 'px';
      this.elem.style.top = (top + height) + 'px';
    };

    this._onFocusLost = function() {
      this_.emit('lostFocus');
    };

    this._createPickerElement = function() {
      this.elem = document.createElement('div');
      this.elem.classList.add('vanilla-color-picker');
      for (var i = 0; i < colors.length; i++) {
        this.elem.innerHTML += singleColorTpl(colors[i]);
      }
      this.targetElem.parentNode.appendChild(this.elem);
      this.elem.setAttribute('tabindex', 1);
      this.elem.focus();
      this.elem.addEventListener('blur', this_._onFocusLost)
    };

    this._addEventListeners = function() {
      var _this = this;
      this.elem.addEventListener('click', function(e) {
        if (e.target.classList.contains('vanilla-color-picker-single-color')) {
          _this.emit('colorChosen', e.target.dataset.color); 
        }
      });
    };

    this._initialize()
  }

  function PickerHolder(elem) {
    MessageMediator.apply(this);
    this.elem = elem;
    this.currentPicker = null;
    var this_ = this;

    this._initialize = function() {
      this._addEventListeners();
    };

    this._addEventListeners = function() {
      this.elem.addEventListener('click', this._createPicker);
    };

    this._updateElemState = function(color) {
      this.elem.dataset.vanillaPickerColor = color;
      this.elem.value = color;
    };

    this._destroyPicker = function() {
      this_.currentPicker.destroy();
      this_.currentPicker = null;
      this_.emit('pickerDestroyed');
    }

    this._createPicker = function(e) {
      var elem = e.target;
      if (this_.currentPicker) {
        return;
      }
      this_.currentPicker = new SinglePicker(elem);
      this_.currentPicker.on('colorChosen', function(color) {
        this_._updateElemState(color);
        this_._destroyPicker();
        this_.emit('colorChosen', color, elem);
      });
      this_.currentPicker.on('lostFocus', function() {
        this_._destroyPicker();
      });
    };

    this._initialize();
  };

  function vanillaColorPicker(element) {
    // @todo: move from here
    addBasicStyling();
    return new PickerHolder(element);
  }

  global.vanillaColorPicker = vanillaColorPicker;
})(this || window);