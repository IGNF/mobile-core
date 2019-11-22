import element from 'ol-ext/util/element'

/* Information notification
 */
let _notinfo=null;

/** Show notification information on top of the screen
 * @param {String} title notification title, false to close all notifications
 * @param {String} msg notification
 * @param {*} options
 *  @param {string} options.className CSS class name for the notification
 *  @param {string} options.iconName icon class name
 *  @param {html|undefined} options.icon html icon string
 *  @param {function|undefined} options.onclose callback function when notification is closed
 */
const notinfo = function(title, msg, options) {
  if (title===false) {
    _notinfo.querySelectorAll('.closebox').forEach((elt) => {
      elt.click();
    });
    return;
  }
  options = options||{};
  if (!_notinfo) {
    _notinfo = element.create('DIV', {
      'data-role': 'notinfo',
      parent: document.body
    })
  }

  var info = element.create('DIV', {
    parent: _notinfo
  });
  if (options.className) info.addClass(options.className);
  element.create('DIV', {
    className: 'closebox',
    click: () => {
      info.classList.remove('visible');
      setTimeout (function(){ info.parentNode.removeChild(info); }, 200);
      if (options.onclose) options.onclose();
    },
    parent: info
  });
  let icon;
  if (options.iconName) {
    icon = '<i class="fa '+options.iconName+'"></i>';
  } else {
    icon = options.icon || '<i class="fa fa-comments-o"></i>';
  }
  element.create('DIV', {
    className: 'icon',
    html: icon,
    parent: info
  });
  element.create('DIV', {
    className: 'title',
    html: title,
    parent: info
  });
  element.create('DIV', {
    html: msg,
    parent: info
  });
  setTimeout (function(){ info.classList.add('visible'); }, 200);
}

export default notinfo
