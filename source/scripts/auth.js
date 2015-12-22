/**
 * Front-end authenticator
 * 
 * In order for this website to interface with the API server the client must
 * be authenticated to an appropriate level by the server. This library is used
 * to automatically gather an authentication token and make it available to
 * other modules of the front-end.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.0.1
 */
/** Namespacing */
var com = com || {};
com.kashis = com.kashis || {};
com.kashis.client = com.kashis.client || {};

/** Payload */
com.kashis.client.auth = function(){
	
	var AuthAPI = {},
		$ = jQuery;
	
	var API_SERVER_URL = 'http://localhost:3000/v1',
		PATH_AUTH_TOKEN = '/auth/tokens.json';
		
	var _controls = {
			body: 'body'
		},
		_tokenUpdateSubscribers = [],
		_authToken;
	
	/**
	 * Initialising method that gathers all of the controls on the page and
	 * performs an initial lookup to see if there's an authentication token
	 * available.
	 */
	function _init() {
		for (var control in _controls)
			if (_controls.hasOwnProperty(control))
				_controls[control] = $(_controls[control]);

		_authToken = _controls.body.data('authenticationToken');

        if (typeof(_authToken) === "undefined")
            _authToken = localStorage.getItem('auth-token');

		_tokenUpdateSubscribers.push([this, AuthAPI.storeAuthToken]);
        
        if (typeof(_authToken) === "undefined")
			_authToken = _newAuthToken();
	}
	
	/**
	 * Default method for requesting a new authentication token from the API
	 * server. This method will request just a basic authentication token
	 * without using any special privileges.
	 * @returns string	Returns the server-generated authentication token as a
	 * 					JWT string.
	 */
	function _newAuthToken() {
		var tokenRequestUrl = API_SERVER_URL + PATH_AUTH_TOKEN;
		_controls.body.removeData('authToken');
		$.ajax({
			url: tokenRequestUrl,
			method: 'post',
			error: _newAuthTokenError,
			success: _newAuthTokenSuccess
		});
	}
	
	/**
	 * Error handling callback method for the authentication token request.
	 * @param jqXhr object	jQuery's AJAX request object.
	 * @param textStatus string	The AJAX error's status code (HTTP status).
	 * @param errorMessage string	The actual error message supplied by the
	 * 								server responding to the request.
	 */
	function _newAuthTokenError(jqXhr, textStatus, errorMessage) {
		console.log('Error requesting a new authentication token: ' +
			textStatus + ': ' + errorMessage);
	}
	
	/**
	 * New authentication token callback for when the server responds with an
	 * authentication token for use. This method will process the response and
	 * save the generated token as a data attribute of the body.
	 */
	function _newAuthTokenSuccess(response, textStatus, jqXhr) {
		var tokenString = response.data.token,
			subscribers = _tokenUpdateSubscribers,
			subscriberCount = subscribers.length || 0;
		
		_controls.body.data('authToken', tokenString);
		for (var i = 0; i < subscriberCount; i++) {
			console.log('iterating through the list of subscribers to the new token notifier.');
			var subscriber = subscribers[i],
				context = subscriber[0],
				callee = subscriber[1];

			callee.apply(context, [tokenString]);
		}
	}
	
	/**
	 * Stores the authentication token given via parameter. This method should
	 * invoked after the server has responded with an appropriate
	 * authentication token.
	 * @param authToken string	The authentication token that should be stored
	 * 							in the current context.
	 */
	AuthAPI.storeAuthToken = function(authToken) {
		_controls.body.data('authToken', authToken);
        localStorage.setItem('auth-token', authToken);
	}
	
	/**
	 * Allows other modules to subscribe to changes to the authentication token
	 * when updates occur either by means of the authentication library (front-
	 * end) or when explicitly requesting a new token.
	 * The supplied function will be executed every time the authentication
	 * token is rotated or refreshed.
	 * @param tokenUpdateCallback function(string)	The callback function to
	 * 												apply when the token is
	 * 												updated or changed.
	 * @param callbackContext {*}	(Optional) context in which to execute the
	 * 								supplied callback method. Default Window.
	 */
	AuthAPI.observeTokenChanges = function(tokenUpdateCallback,
		callbackContext) {
		var callbackContext = callbackContext || Window;
		_tokenUpdateSubscribers.push([callbackContext, tokenUpdateCallback]);
	}
	
	/**
	 * Retrieves the current authentication token that has been assigned to 
	 * the client, or requests a new one from the server.
	 * This method takes an optional set of parameters that may be used with
	 * the API token request to issue a token with greater privileges.
	 * @param authTokenCallback function(string)	A function that will be
	 * 												called once an
	 * 												authentication token has
	 * 												been initialised.
	 * @param authSettings {*}	(Optional) set of parametres that can be
	 * 							supplied to the API server when requesting a
	 * 							new authentication token.
	 */
	AuthAPI.getAuthenticationToken = function(authTokenCallback, 
		authSettings) {
		
	}
	// 2. Request a new auth token
	
	// 3. Save the auth token for local availability
	
	// 4. Notify subscribers of authentication token availability
	
	// a. (Optional) allow requests for credentialled authentication tokens.

	$(document).ready(_init);
	
	return AuthAPI;

}();