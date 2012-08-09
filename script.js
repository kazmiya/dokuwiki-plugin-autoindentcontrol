/**
 * AutoIndentControl Plugin for DokuWiki / script.js
 *
 * Provides a toggle switch to control auto-indent function in edit window.
 *
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author  Kazutaka Miyasaka <kazmiya@gmail.com>
 */

(function() {
    if (typeof JSINFO !== 'object' || !JSINFO.plugin_autoindentcontrol) {
        return;
    }

    // compatibility check
    if (
        typeof DEPRECATED === 'function' ||
        typeof addInitEvent === 'undefined'
    ) {
        // for DokuWiki Angua or later
        jQuery(_Angua);
    } else {
        // for DokuWiki Anteater or earlier
        addInitEvent(_Anteater);
    }

    /**
     * for DokuWiki Angua
     */
    function _Angua() {
    }

    /**
     * for DokuWiki Anteater or earlier
     */
    function _Anteater() {
        var editor, auto, userOFF;

        // check if we are in edit window
        editor = $('wiki__text');

        if (!editor || editor.readOnly) {
            return;
        }

        auto = JSINFO.plugin_autoindentcontrol;
        auto.enabled = true;

        // init toggle button
        if (auto.showToggle) {
            initAutoIndentControl();
        }

        // set initial state of auto-indent functoinality
        userOFF = DokuCookie.getValue('autoIndentOFF');

        if (
            (!auto.showToggle && auto.defaultOFF) ||
            (auto.showToggle &&
                (userOFF || isUndefined(userOFF) && auto.defaultOFF)
            )
        ) {
            toggleAutoIndent();
        }

        /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

        /**
         * Initializes auto-indent control button
         */
        function initAutoIndentControl() {
            var resizer, button;

            resizer = $('size__ctl');

            if (!resizer) {
                return;
            }

            // create a toggle button to control auto-indent function
            button = document.createElement('div');
            button.id = 'plugin__autoindentcontrol__switch';
            button.title = 'Auto-Indent: ON';
            button.innerHTML = '<span>Auto-Indent: ON</span>';
            button.className = 'autoIndentON';

            // insert toggle button
            resizer.parentNode.insertBefore(button, resizer.nextSibling);

            addEvent(button, 'click', toggleAutoIndent);
        }

        /**
         * Toggles auto-indent functionality
         */
        function toggleAutoIndent() {
            var type, guid, func, button, onoff;

            type = (is_opera && !auto.isLemming) ? 'keypress' : 'keydown';

            // handle events on edit window
            if (auto.enabled) {
                auto.enabled = false;

                if (editor.events) {
                    for (guid in editor.events[type]) {
                        func = editor.events[type][guid].toString();

                        if (func.match(/^function\s+keyHandler\b/)) {
                            removeEvent(editor, type, editor.events[type][guid]);
                        }
                    }
                }
            } else {
                auto.enabled = true;
                addEvent(editor, type, keyHandler);
            }

            button = $('plugin__autoindentcontrol__switch');

            // switch toggle button
            if (button) {
                onoff = auto.enabled ? 'ON' : 'OFF';

                button.title = 'Auto-Indent: ' + onoff;
                button.innerHTML = '<span>Auto-Indent: ' + onoff + '</span>';
                button.className = 'autoIndent' + onoff;
                DokuCookie.setValue('autoIndentOFF', auto.enabled ? '' : 1);
            }
        }
    }
})();
