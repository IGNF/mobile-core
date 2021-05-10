/** @module Dialog
 */
import _T from './i18n'

/** 
 * @classdesc
 * Dialogues pour l'application 
 * @constructor
 */
function Dialog() {
  var self = this;
  // Constructor
  var _back = $('<div>').attr("data-role","backDialog").appendTo("body");
  var _dlg = $('<form>').attr("data-role","dialog").appendTo("body").hide();
  var _cbox = $("<i>").addClass("fa fa-close")
    .attr("data-role","closebox")
    .appendTo(_dlg)
    .on ("click",function(e) {
      e.stopPropagation();
      e.preventDefault();
      self.close();
    });
  var _icon = $("<div>").addClass("icon").appendTo(_dlg);
  var _title = $("<div>").addClass("title").appendTo(_dlg);
  var _content = $("<div>").addClass("content").appendTo(_dlg);
  var _buttons = $("<div>").addClass("buttons").appendTo(_dlg);
  var _timeout = null;

  _back.on('click', () => {
   if (this._closeBack) this.close(); 
  })

  // Prevent submission (prevent change page)
  _dlg.on('submit', function(e) { e.preventDefault(); })

  /** A dialog is shown on the app
   * @method Dialog.isOpen
   * @return {bool} true if a dialog is shown
   */
  this.isOpen = function() {
    return (_dlg && _dlg.hasClass("visible"));
  };

  /** Close the dialog 
   * @method Dialog.close
   * @param {*} id action id
   * @return {bool} true if a dialog is closed
   */
  this.close = function (id) {
    if (!this.isOpen()) return false;
    _dlg.removeClass('visible');
    $(":focus", _dlg).blur();
    _back.hide();
    if (_timeout) clearTimeout(_timeout);
    _timeout = setTimeout (function(){ _dlg.hide(); }, 200);
    if (this._callback) this._callback(id);
    return true;
  };

  /** Show last dialog once again */
  this.replay = this.reShow = function () {
    this.show(null, {
      callback: this._callback,
      closeBack: this._closeBack,
      anim: false
    })
  };

  /** Show a new dialog 
   * @method Dialog.show
   * @param {html} content a jQuery objet that contents the dialog
   * @param {options} options
   *	 @param {bool} options.closeBox has a close box
   *	 @param {bool} options.closeBack close on click on back
   *	 @param {string} options.title title of the dialog
   *	 @param {Array<String>} options.buttons list of button to show 
   *	 @param {function} options.callback callback function with index of pressed button as argument
   *	 @param {String} options.className dialog class for css 
   */
  this.show = function (content, options) {
    if (!options) options={};
    var self = this;
    if (_timeout) clearTimeout(_timeout);
    this._callback = options.callback;
    this._closeBack = options.closeBack;
    
    if (content) {
      const addButton = function(id, text) {
        return $("<input>").val(text)
          .attr('type', id=='submit' ? 'submit':'button')
          .attr("data-role","dialogBt")
          .prependTo(_buttons)
          .on ("click",function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).css('display')!='none') {
              self.close(id);
            }
          });
      }

      if (options.closeBox) _cbox.show();
      else _cbox.hide();
      if (options.icon) _icon.html(options.icon).show();
      else _icon.hide();
      if (options.title) _title.html(options.title).show();
      else _title.hide();
      if (options.noClose && _dlg.hasClass('visible')) {
        _dlg.removeClass().addClass('visible');
      } else {
        _dlg.removeClass();
      }
      _dlg.addClass(options.className||options.classe);
      
      _buttons.html("");
      if (options.buttons) {
        let i;
        if (options.buttons.length) {
          for (i=0; i<options.buttons.length; i++) {
            addButton (i+1, options.buttons[i]);
          }
        } else {
          for (i in options.buttons) {
            addButton (i, options.buttons[i]);
          }
        }
      }
      else addButton(1, _T("annuler"));

      _content.html(content);
      $("<i>").addClass("showerror")
        .click(function() { $(".error", _content).toggle(); })
        .insertBefore($('.error', _content));
    }

    if (options.anim === false) _dlg.addClass('noanim visible');
    else _dlg.removeClass('noanim');

    // Show dialog
    _back.show();
    _dlg.show();
    _timeout = setTimeout (function(){ _dlg.addClass('visible'); }, 200);

    return _content.get(0);
  }
};

export default Dialog
