<?php
/**
 * AutoIndentControl Plugin for DokuWiki / action.php
 *
 * @license GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author  Kazutaka Miyasaka <kazmiya@gmail.com>
 */

// must be run within DokuWiki
if (!defined('DOKU_INC')) {
    die();
}

if (!defined('DOKU_PLUGIN')) {
    define('DOKU_PLUGIN', DOKU_INC . 'lib/plugins/');
}

require_once DOKU_PLUGIN . 'action.php';

class action_plugin_autoindentcontrol extends DokuWiki_Action_Plugin
{
    /**
     * Returns some info
     */
    function getInfo()
    {
        return confToHash(DOKU_PLUGIN . 'autoindentcontrol/plugin.info.txt');
    }

    /**
     * Registers an event handler
     */
    function register(&$controller)
    {
        $controller->register_hook(
            'DOKUWIKI_STARTED', 'AFTER', $this, 'exportToJSINFO'
        );
    }

    /**
     * Exports configuration settings to $JSINFO
     */
    function exportToJSINFO(&$event)
    {
        global $JSINFO;

        $JSINFO['plugin_autoindentcontrol'] = array(
            'defaultOFF' => (boolean) !$this->getConf('default_behavior'),
            'showToggle' => (boolean) $this->getConf('show_toggle_switch'),
            'isLemming'  => (boolean) !function_exists('valid_input_set'),
        );
    }
}
