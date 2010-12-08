/**
 * AutoIndentControl Plugin for DokuWiki / script.js
 * 
 * Toggles the auto-indent feature in the edit window
 * 
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author  Kazutaka Miyasaka <kazmiya@gmail.com>
 */

addInitEvent(function() {
    if (typeof JSINFO !== 'object' || !JSINFO.plugin_autoindentcontrol) return;

    // edit window exists and is editable?
    var field = $('wiki__text');
    if (!field || field.readOnly) return;

    var auto = JSINFO.plugin_autoindentcontrol;
    auto.enabled = true;

    if (auto.showToggle) auto.initIndentCtl();
    var userOFF = DokuCookie.getValue('autoIndentOFF');

    if ((auto.showToggle && (userOFF || isUndefined(userOFF) && auto.defaultOFF))
            || (!auto.showToggle && auto.defaultOFF)) auto.toggle();
});

if (typeof JSINFO === 'object' && JSINFO.plugin_autoindentcontrol) {
    JSINFO.plugin_autoindentcontrol.toggle = function() {
        var field = $('wiki__text');
        if (!field) return;

        var auto = JSINFO.plugin_autoindentcontrol;
        var ctl = $('plugin__autoindentcontrol__indentctl');

        if (auto.enabled) {
            // enabled => disable
            var events = field.events;
            if (!events) return;
            if (!auto.isLemming && is_opera) {
                for (var $$guid in events.keypress) {
                    if (events.keypress[$$guid].toString().match(/^function\s+keyHandler\b/)) {
                        removeEvent(field, 'keypress', events.keypress[$$guid]);
                    }
                }
            } else {
                for (var $$guid in events.keydown) {
                    if (events.keydown[$$guid].toString().match(/^function\s+keyHandler\b/)) {
                        removeEvent(field, 'keydown', events.keydown[$$guid]);
                    }
                }
            }
            if (ctl) {
                ctl.title = 'Auto-Indent: OFF';
                ctl.innerHTML = '<span>Auto-Indent: OFF</span>';
                ctl.className = 'autoindentoff';
                DokuCookie.setValue('autoIndentOFF', 1);
            }
            auto.enabled = false;
        } else {
            // disabled => enable
            if (!auto.isLemming && is_opera) {
                addEvent(field, 'keypress', keyHandler);
            } else {
                addEvent(field, 'keydown', keyHandler);
            }
            if (ctl) {
                ctl.title = 'Auto-Indent: ON';
                ctl.innerHTML = '<span>Auto-Indent: ON</span>';
                ctl.className = 'autoindenton';
                DokuCookie.setValue('autoIndentOFF', '');
            }
            auto.enabled = true;
        }
    };

    JSINFO.plugin_autoindentcontrol.initIndentCtl = function() {
        var sizeCtl = $('size__ctl');
        if (!sizeCtl) return;

        var ctl = document.createElement('div');
        ctl.id = 'plugin__autoindentcontrol__indentctl';
        ctl.title = 'Auto-Indent: ON';
        ctl.innerHTML = '<span>Auto-Indent: ON</span>';
        ctl.className = 'autoindenton';
        sizeCtl.parentNode.insertBefore(ctl, sizeCtl.nextSibling);

        addEvent(ctl, 'click', JSINFO.plugin_autoindentcontrol.toggle);
    };
}
