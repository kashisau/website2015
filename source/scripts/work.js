/**
 * Kashi's Portfolio library
 * 
 * Provides access to Kashi Samaraweera's potfolio of web development works by
 * communicating with Kashi's API server (https://api.kashis.com.au). 
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

/* Namespacing */
var com = com || {};
com.kashis = com.kashis || {};
com.kashis.fed = com.kashis.fed || {};

/*Type definitions (for jsDoc) */

/**
 * @typedef Work
 * @type Object
 * @property {string} renew The renew token as a JWT-encoded string.
 * @property {string} renew A corresponding auth token as a JWT-encoded string.
 */

/* Payload */
com.kashis.fed.work = function(){
	
	var WorkAPI = {},
		$ = jQuery;
	
	var API_SERVER_URL = 'http://localhost:3000/v1',
		PATH_PORTFOLIO_WORK = '/portfolio/works';
		
	var _controls = {
			body: 'body'
		},
        auth = com.kashis.fed.auth,
        token = undefined;
	
    /**
     * Initialises our library with the API server. This method will bind DOM
     * elements to their respective variables as well as investigate the any
     * existing renew token for usage.
     */
	function _init() {
        // Bind our controls
        for (var control in _controls)
            if (_controls.hasOwnProperty(control))
                _controls[control] = $(_controls[control]);

         WorkAPI.retriveWorks();
    }
    
    /**
     * Retrieves a list of works from the server.
     */
    WorkAPI.retriveWorks = function() {
    }
    
	$(document).ready(_init);
	
	return WorkAPI;

}();