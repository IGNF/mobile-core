/* Gestion de l'aide
 */

import './help.css'
import CordovApp from './CordovApp'
import { wappStorage } from './CordovApp'

var helpDiv = $("<div>").attr("id", "help").appendTo("body");
// Close help on click if no closebox
helpDiv.on('click', () => {
  if (!helpDiv[0].querySelector('.close')) {
    nextHelp();
  }
});
var step = 0;
var _timeout;
var _current = "";
var _param = wappStorage('help') || {};

// Add associated css
$('<link/>', {
  rel: 'stylesheet', 
  href: './help/help.css'
}).appendTo('head');	

/* Save app parameters (to wappStorage)
 */
function saveParam(t) {
  if (t) _param[t] = true;
  wappStorage('help', _param);
};

/* Show next help on the page
 */
function nextHelp(s) {
  if (!helpDiv) return;
  if (s) step=s;
  else step++;
  if (_timeout) clearTimeout(_timeout);
  helpDiv.show();
  if (s || $('[data-role="content"].step_'+step, helpDiv).length) {
    _timeout = setTimeout(() => {
      helpDiv.removeClass().addClass('visible step step_'+step).addClass(_current);
    }, 200);
  } else {
    hideHelp();
  }
};

/* Callback function called when help is hidden */
let onHide;

/* Hide help */
function hideHelp() {
  if (!helpDiv) return;
  helpDiv.removeClass();
  _current = '';
  if (_timeout) clearTimeout(_timeout);
  _timeout = setTimeout(function(){ helpDiv.hide(); },500);
  if (onHide) onHide.call();
  onHide = null;
}

/* Show help using template
 * @param {string} template 
 * @param {function} callback a function executed after help is shown (onhide)
 */
function showHelp(template, callback) {
  if (template===_current && helpDiv.hasClass('visible')) return;
  if (typeof(callback) === 'function') onHide = callback; 
  // Deja fait !
  if (_param[template]) {
    hideHelp();
    return;
  }
  // Nouvel aide
  saveParam(template);
  CordovApp.template("./help/"+template, (t) => {
    if (!t || !t.length) {
      hideHelp();
      return;
    }

    _current = template;
    helpDiv.html('').removeClass().addClass('visible '+template).append(t).show();
    $('.close', t).on('click touchstart', function(e) {
      e.stopPropagation();
      e.preventDefault();
      hideHelp();
    });
    nextHelp(1);
  });
}

/** Show help on a specific page.    
 * Defaut behavior: show help on 'showpage' event, hide on 'hidepage' event or on 'menu' event
 * @namespace help
 */
var help = CordovApp.prototype.help = {
  /** Show help
   * @function help.showHelp
   * @param {string} name template name (in ./help directory)
   */
  show: showHelp,
  /** Hide help
   * @function help.hideHelp
   */
  hide: hideHelp,
  /** Show next help page
   * @function help.nextHelp
   * @param {number} n next help 
   */
  next: nextHelp,
  /** Reset help
   * @function help.reset
   */
  reset: (template) => {
    if (template) {
      delete _param[template];
    } else {
      _param={};
      saveParam();
    }
  },
  /** Help allready done on this template
   * @param {string} template
   * @return {boolean}
   */
  done: (template) => {
    return !!_param[template];
  },
  /** Fullscreen help 
   * @function help.fullscreen
   */
  fullscreen: (b) => {
    helpDiv.attr('data-fullscreen', b);
  }
};

// Handle events
$(document).on('showpage', function(e) {
  showHelp(e.page);
});
$(document).on('hidepage', function() {
  hideHelp();
});
$(document).on('menu', function(e) {
  if (e.show) showHelp('menu');
  else hideHelp();
});
$( document ).ready(function() {
  showHelp('main');
});

export {help}
export default CordovApp
