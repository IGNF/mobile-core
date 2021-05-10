/**
  @brief: Cordova web application 
  @author: Jean-Marc Viglino (ign.fr)
  @copyright: 2015-2020
  
  @require: JQuery
*/

import CordovApp from './CordovApp'
import Dialog from '../Dialog'
import _T from '../i18n'

/** Application Dialog
* @member {Dialog}
*/
CordovApp.prototype.dialog = new Dialog();
const dialog = CordovApp.prototype.dialog;

/* Internal dialog 
 * @private
 */
var _internalDialog = new Dialog();

/** Select dialog
* @param {Object|false|undefined} choice list of choice key/value or false to close the dialog or undefined to reopen previous one
* @param {String} selected key of selected item
* @param {function} callback function(key) return the selected key
* @param {Object} options (dialog options
*	 @param {boolean} options.search add a search input
*/
CordovApp.prototype.selectDialog = function(choice, valdef, cback, options) {
  // Open existing dialog
  if (!choice) {
    if (choice===false) _internalDialog.close;
    else _internalDialog.show(null);
    return;
  }
  // New dialog
  if (!options) options = {};
  if (!options.listClass) options.listClass = {};
  if (typeof(cback) != "function") cback = function(c){ console.log(c); };
  var content = $("<div>");
  var ul = $("<ul>").attr("data-role","select").appendTo(content);
  var nb = 0;
  var selected = false;
  for (var i in choice) {
    nb++;
    $("<li>").html(choice[i])
      .data("item",i)
      .addClass(i==valdef ? "selected" : "")
      .addClass(options.listClass[i]||'')
      .on("click", function(e) {
        e.stopPropagation();
        e.preventDefault();
        $("li", this.parent).removeClass("selected");
        $(this).addClass("selected");
        if (!options.confirm) {
          _internalDialog.close();
          cback($(this).data('item'));
        }
        else selected = $(this).data('item');
      })
      .appendTo(ul);
  }
  // Filter option
  if (nb > (options.search ? 0:20)) {
    $('<i class="clear-input">').prependTo(content);
    $('<input type="text">')
      .addClass("search")
      .attr("placeholder","filtrer...")
      .on("keyup change", function() {
        var filter = new RegExp($(this).val(), "i");
        $("li", ul).each(function() {
          if (!filter) {
            $(this).show();
          } else {
            if (filter.test($(this).text())) $(this).show();
            else $(this).hide();
          }
        });

      })
      .prependTo(content);
    $('<i class="search-input">').prependTo(content);
  }
  if (options.confirm) {
    options.buttons = { ok: "ok", cancel:"annuler" };
    options.callback = function (bt) {
      if (selected && bt=="ok") cback(selected);
    }
  }
  _internalDialog.show(content, options);
};
const selectDialog = CordovApp.prototype.selectDialog;

/** Prompt dialog
 * @param {String} Prompt
 * @param {String} default value
 * @param {function} callback function(val) returned value
 * @param {Object} Dialog param
 */
CordovApp.prototype.prompt = function(prompt, val, cback, options) {
  if (!options) options = {};
  if (typeof(cback)!="function") cback=function(c){console.log(c);};
  var content = $("<div>");
  var input = $("<input>")
    .attr({type: options.type || 'text', placeholder:options.placeholder})
    .appendTo(content);
  $("<i>").addClass("clear-input").appendTo(content);
  options.callback = function(b) {
    if (b=="submit") cback(input.val());
    else cback(val);
  }
  options.title = prompt;
  options.buttons = { cancel:"Annuler", submit:"OK" };
  _internalDialog.show(content, options);
  input.focus().val(val || "");
};
const promptDlg = CordovApp.prototype.prompt;

/** Prompt dialog
 * @param {String} Prompt
 * @param {String} default value
 * @param {function} callback function(val) returned value
 * @param {Object} Dialog param
 */
CordovApp.prototype.dateDlg = function(prompt, val, cback, options) {
  const date = val ? new Date(val) : new Date();

  const getDate = function() {
    let d;
    const h = $('li', dday).outerHeight()
    // Check date
    var date = new Date();
    date.setFullYear(Math.round(dyear.scrollTop() / h)+1900);
    date.setMonth(Math.round(dmonth.scrollTop() / h));
    // Show date / month / year
    $('li', dday).show();
    date.setDate(29);
    if (date.getMonth() !== Math.round(dmonth.scrollTop() / h)) {
      $('li', dday)[28].style.display = 'none'
      $('li', dday)[29].style.display = 'none'
      $('li', dday)[30].style.display = 'none'
    } else {
      date.setDate(30);
      if (date.getMonth() !== Math.round(dmonth.scrollTop() / h)) {
        $('li', dday)[29].style.display = 'none'
        $('li', dday)[30].style.display = 'none'
      } else {
        date.setDate(31);
        if (date.getMonth() !== Math.round(dmonth.scrollTop() / h)) {
          $('li', dday)[30].style.display = 'none'
        }
      }
    }
    // get Date
    date.setFullYear(Math.round(dyear.scrollTop() / h)+1900);
    date.setMonth(Math.round(dmonth.scrollTop() / h));
    date.setDate(Math.round(dday.scrollTop() / h)+1);
    return date;
  }

  const onscroll = function(div) {
    const h = $('li', div).outerHeight()
    const dt = Math.round(div.scrollTop() / h);
    div.scrollTop(dt * h);
    getDate();
  }
  const setVal = function(div, val) {
    setTimeout(() => {
      const h = $('li', div).outerHeight()
      div.scrollTop((val-1) * h);
    }, 100);
  }

  if (typeof(cback)!="function") cback = function(c){ console.log(c); };
  const content = $("<div>").addClass('dateDlg');
  const delay = 300;

  // Day
  var dday = $('<ul>').addClass('day').appendTo(content);
  let scrollDay;
  dday.on('scroll', () => {
    window.clearTimeout( scrollDay );
    scrollDay = setTimeout(() => { onscroll(dday) }, delay);
  })
  dday.on('touchend', () => { 
    onscroll(dday);
  });
  for (let k=1; k<=31; k++) {
    $('<li>').text(k).appendTo(dday);
  }
  setVal(dday, date.getDate());

  // Month
  var dmonth = $('<ul>').addClass('month').appendTo(content);
  let scrollMonth;
  dmonth.on('scroll', () => {
    window.clearTimeout( scrollMonth );
    scrollMonth = setTimeout(() => { onscroll(dmonth) }, delay);
  });
  dmonth.on('touchend', () => { 
    onscroll(dmonth);
  });
  ['JAN','FEV','MARS','AVR','MAI','JUIN', 'JUIL', 'AOUT', 'SEPT', 'OCT', 'NOV', 'DEC'].forEach((a) => {
    $('<li>').text(a).appendTo(dmonth);
  });
  setVal(dmonth, date.getMonth()+1);

  // Year
  var dyear = $('<ul>').addClass('year').appendTo(content);
  let scrollYear;
  dyear.on('scroll', () => {
    window.clearTimeout( scrollYear );
    scrollYear = setTimeout(() => { onscroll(dyear) }, delay);
  });
  dyear.on('touchend', () => { 
    onscroll(dyear);
  });
  for (let k=1900; k<=2020; k++) {
    $('<li>').text(k).appendTo(dyear);
  }
  setVal(dyear, date.getFullYear() - 1899);

  if (!options) options = {};
  options.title = prompt;
  options.buttons = { cancel:"Annuler", submit:"OK" };
  options.callback = function(b) {
    if (b=="submit") cback(getDate());
    else cback(val);
  }
  _internalDialog.show(content, options);
};
const dateDlg = CordovApp.prototype.dateDlg;

/** Show an alert
*	@param {String} message to alert
*	@param {String} title for the dialod
*/
CordovApp.prototype.alert = function (what, titre, classe) {
  _internalDialog.show(what||"oops", {
    title: titre||_T("ALERTE"),
    buttons: ["OK"],
    classe: classe||"alert"
  });
};
const alertDlg = CordovApp.prototype.alert;

/** Show a message 
*	@param {String} message to alert
*	@param {String} title for the dialod
*	@param {Array<String>} list of button labels
*	@param {function} callback function with index of pressed button as argument
*/
CordovApp.prototype.message = function (message, titre, boutons, callback, classe) {
  _internalDialog.show(message||"...", {
    title: titre||_T("MESSAGE"),
    callback: callback,
    buttons: boutons||{ cancel:'ok' },
    classe: classe||"message"
  });
};
const messageDlg = CordovApp.prototype.message

/** A dialog is open
*/
CordovApp.prototype.hasDialog = function() {
  return ( dialog.isOpen() || _internalDialog.isOpen() );
};

/** Close first open dialog
*/
CordovApp.prototype.closeDialog = function() {
  if (_internalDialog.isOpen()) {
    return _internalDialog.close();
  } else {
    return dialog.close();
  }
};


/* Notification
 * @private
 */
var _notification=null;
var _timeout = null;

/** Show a notification on the bottom of the screen
* @param {String} notification
* @param {Number|String} duration (number in ms or a string "1s"/"1000ms") before the notification vanish (0 close the notificatoin), default 3s
* @param {boolean} noreplace true to avaoid replacing existing notification, default false
*/
CordovApp.prototype.notification = function(msg, duration, noreplace) {
  if (!_notification) {
    _notification = $("<div>").attr("data-role","notification").appendTo("body");
  }

  if (noreplace && _notification.hasClass('visible')) return;

  if (!msg && !duration) {
    if (_timeout) clearTimeout(_timeout);
    _notification.removeClass('visible'); 
    _notification.hide();
    return;
  }
  
  if (typeof(duration)=="string") {
    if (/ms$/.test(duration)) duration = parseFloat(duration);
    else if (/s$/.test(duration)) duration = parseFloat(duration)*1000;
  }
  if (typeof(duration)!="number") duration=0;
  duration = duration ? Math.max(duration,500) : 3000;

  _notification.html($("<div>").html(msg)).show();
  setTimeout (function(){ _notification.addClass('visible'); }, 200);
  if (_timeout) clearTimeout(_timeout);
  _timeout = setTimeout (function() {
    _notification.removeClass('visible'); 
    setTimeout (function(){ _notification.hide(); }, 200);
  }, duration);
};
const notification = CordovApp.prototype.notification;

/** Check if a notification is visible
 * @return {boolean}
 */
CordovApp.prototype.isNotification = function() {
  return _notification.hasClass('visible');
};

import notinfo from'./notinfo'

/** Show notification information on top of the screen
 * @param {String} title notification title
 * @param {String} msg notification
 * @param {*} options
 *	@param {string} options.className CSS class name for the notification
 *	@param {html|undefined} options.icon
 *	@param {function|undefined} options.onclose callback function when notification is closed
 */
CordovApp.prototype.notinfo = notinfo;

/* Wait dialog
 * @private
 */
var _wait=null, _wback=null, _message=null, _pourcent=null, _waitButtons=null;
var _wtimeout = null;

/** Wait dialog
 * @param {String|boolean|*} msg message to show or false to hide the dialog or options to set new options
 * @param {*} options
 *  @param {boolean} options.anim false to prevent animation (to chain dialogs), default true
 *  @param {string} option.className
 *  @param {number} options.pourcent
 *  @param {*} options.buttons a list a key / action
 */
CordovApp.prototype.wait = function(msg, options) {
  if (options===false) options = { anim:false };
  if (!options) {
    if (msg !== false && typeof(msg) !== 'string') {
      options = msg || {};
      msg = '';
    } else {
      options = {};
    }
  }
  if (!_wait) {
    _wback = $('<div>').attr('data-role','backDialog').appendTo('body');
    _wait = $('<div>').attr('id','wait').attr('data-role','dialog').appendTo('body');
    var spin = $('<i>').addClass("fa fa-spinner fa-pulse")
            .appendTo(_wait);
    _message = $('<div>').addClass('message').insertAfter(spin);
    var pc = $('<div>').addClass('pourcent').appendTo(_wait);
    _pourcent = $('<div>').appendTo(pc);
    _waitButtons = $('<div>').addClass('buttons').appendTo(_wait)
  }
  if (_wtimeout) clearTimeout(_wtimeout);
  if (msg !== false) {
    _wback.show();
    _wait.show();
    if (msg) _message.html(msg);
    if (!_wait.hasClass('visible')) {
      _wait.removeClass();
      if (options.anim===false) _wait.addClass('visible noanim');
      else _wtimeout = setTimeout (function() { _wait.addClass('visible'); }, 200);
    }
    else _wait.removeClass().addClass('visible');
    if (options.pourcent!==undefined) {
      _pourcent.css('width',options.pourcent+'%').parent().show();
    } else {
      _pourcent.parent().hide();
    }
    if (msg || options.buttons) {
      _waitButtons.html('');
      if (options.buttons) {
        for (let b in options.buttons) {
          $('<button>').text(b).click(options.buttons[b]).appendTo(_waitButtons);
        }
      }
    }
    if (options.className) _wait.addClass(options.className);
  } else  {
    _wback.hide();
    _wait.removeClass('visible');
    if (options.anim===false) _wait.hide();
    else _wtimeout = setTimeout (function(){ _wait.hide(); }, 200);
  }
}
const waitDlg = CordovApp.prototype.wait;

/** Wait is on */
CordovApp.prototype.isWaiting = function() {
  return _wback ? _wback.css("display")!="none" : false;
  //return _wait.hasClass('visible');
}

/** Show a dialog
 *  @param {string} name  
 */
CordovApp.prototype.showDialog = function(name, options) {
  options = options || {};
  return dialog.show (CordovApp.template(name), {
    title: options.title, 
    className: options.className,
    anim: options.anim,
    buttons: options.buttons || { cancel:'ok' },
    callback: options.callback
  });
};

export {dialog}
export {selectDialog}
export {promptDlg};
export {dateDlg};
export {alertDlg};
export {messageDlg};
export {waitDlg};
export {notification};

const hasDialog = CordovApp.prototype.hasDialog;
export { hasDialog }
const closeDialog = CordovApp.prototype.closeDialog;
export { closeDialog }

export default Dialog;
