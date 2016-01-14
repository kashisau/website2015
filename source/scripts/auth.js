/**
 * Front-end authenticator
 * 
 * In order for this website to interface with the API server the client must
 * be authenticated to an appropriate level by the server. This library is used
 * to automatically gather an authentication token and make it available to
 * other modules of the front-end.
 * 
 * This client assumes that tokens are assigned as HTTPonly cookies and thus
 * only the server may read and verify auth token information.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.0.2
 */
/** Namespacing */
var com = com || {};
com.kashis = com.kashis || {};
com.kashis.fed = com.kashis.fed || {};

/** Payload */
com.kashis.fed.auth = function(){
	
	var AuthAPI = {},
		$ = jQuery;
	
	var API_SERVER_URL = 'http://localhost:3000/v1',
		PATH_AUTH_TOKEN = '/auth/tokens.json';
		
	var _controls = {
			body: 'body'
		},
		_tokenUpdateSubscribers = [],
		_authToken,
        _tokenLookupXhr;
	
	/**
	 * Initialising method that gathers all of the controls on the page and
	 * performs an initial lookup to see if there's an authentication token
	 * available.
	 */
	function _init() {
		for (var control in _controls)
			if (_controls.hasOwnProperty(control))
				_controls[control] = $(_controls[control]);
                
        AuthAPI.getTokenStatus(_processTokenLookup);
	}
    
    function _processTokenLookup(err, tokenData) {
        if (typeof(err) !== "undefined") {
            switch (err.name) {
                case "auth_token_expired":
                    // Refesh the current token.
                    break;
                case "auth_token_revoked":
                    // Display a security warning.
                    break;

                case "auth_token_missing":
                    // Get a new token.
                case "auth_token_invalid":
                    // Get a new set of tokens.
                case "auth_refresh_token_inalid":
                    // Get a new set of tokens.
                default:
                    // Same as above.
                    
            }
            return;
        }
        
        console.log(tokenData);
    }
	
    /**
     * This method produces a HTTP GET request to the API server to check if
     * an authentication token has been issued and if so retrieve some data
     * about the token (such as issue date, accessLevel, etc.).
     * @param {Function({Error}, {Result})} A callback function that accepts
     *                                      two parameters for continuation.
     */
	AuthAPI.getTokenStatus = function(callback) {
        // Cancel any concurrent calls to perform this lookup.
        if (typeof(_tokenLookupXhr) !== "undefined")
            return callback(
                    new Error("There is already an authentication " +
                    "being processed.")
                );

        _tokenLookupXhr = $.ajax({
            url: API_SERVER_URL + PATH_AUTH_TOKEN
        });

        _tokenLookupXhr.done(lookupSuccessCallback);
        _tokenLookupXhr.fail(lookupFailCallback);
        
        function lookupSuccessCallback(jqXhr) {
            return callback(null, xhXhr.responseJSON);
        }
        
        function lookupFailCallback(jqXhr) {
            var response = jqXhr.responseJSON,
                errors = response.errors,
                error;
            
            while (error = errors.pop())
                callback(error);

            return;
        }
    }
    
	$(document).ready(_init);
	
	return AuthAPI;

}();