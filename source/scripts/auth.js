/**
 * Front-end authenticator library
 * 
 * This is a common libray that's used to acquire and maintain a set of valid
 * authentication tokens from the API server (github.com/kashisau/api-server/).
 * 
 * Beginning v0.3.0 of the API server (and v0.5.0 of the Auth module) client
 * authentication began implementing OAuth2 compatible token issuance with both
 * long-life renew tokens and temporal auth tokens.
 * 
 * Renew tokens are stored in localStorage. Promises are the main vehicle for
 * asynchronous method defferal (beware of browser compatibility in DEV).
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
 * @typedef TokenPair
 * @type Object
 * @property {string} renew The renew token as a JWT-encoded string.
 * @property {string} renew A corresponding auth token as a JWT-encoded string.
 */

/* Payload */
com.kashis.fed.auth = function(){
	
	var AuthAPI = {},
		$ = jQuery;
	
	var API_SERVER_URL = 'http://localhost:3000/v1',
		PATH_AUTH_TOKEN = '/auth/tokens';
		
	var _controls = {
			body: 'body'
		};
	
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

        // Find any existing tokens
        var renewToken = localStorage.getItem('renewToken'),
            authToken = localStorage.getItem('authToken');
        
        _validateRenewToken({renew: renewToken, auth: authToken})
            .then(_validateAuthToken)
            .catch(_replaceTokens)
            .then(_saveTokens);
    }
    
    /**
     * Takes a renew token and checks its validity with the API server.
     * @param {TokenPair} tokenPair The renew and auth token pair as JWT
     *                              strings.
     * @return {Promise.<TokenPair>}    Implements the Promise object,
     *                                  returning the same TokenPair if
     *                                  fulfilled.
     */
    function _validateRenewToken(tokenPair) {
        return new Promise(
            function(resolve, reject) {
                if (!tokenPair.renew) {
                    var missingError = new Error("Missing renew token.");
                    missingError.name = "renew_token_missing";
                    return reject(missingError);
                }

                var renewToken = tokenPair.renew;

                $.ajax({
                    url: API_SERVER_URL + PATH_AUTH_TOKEN + '/bearer',
                    accepts: "application/json",
                    method: "get",
                    headers: {
                        'Authorization': 'Bearer ' + renewToken
                    }
                }).done(function (res) {
                    var token = res.data.token,
                        tokenValid = res.data.validity;

                    if (token.type !== "renew") return reject(
                        () => {
                            var e = new Error("Wrong token type");
                            e.name = "renew_token_invalid";
                            return e;
                        });
                    if (!tokenValid) return reject(
                        () => {
                            var e = new Error("Token invalid");
                            e.name = "renew_token_invalid";
                            return e;
                        });

                    return resolve(tokenPair);
                }).fail(function (jxXhr, httpStatus, error) {
                    var serverResponse = jxXhr.responseJSON.errors[0],
                        serverError = new Error(serverResponse.message);
                        
                    serverError.name = serverResponse.name;
                    return reject(serverError);
                });
            }
        );
    
    }
    
    /**
     * Validates the auth token with the API server, throwing an error if no
     * valid auth token exists.
     * @param {TokenPair} tokenPair A TokenPair object (containing the renew
     *                              and auth JWT) used for validation.
     * @param {number} minAccessLevel   (Optional) minimum access level for
     *                                  the token. Default 0.
     */
    function _validateAuthToken(tokenPair, minAccessLevel) {
        return new Promise(
            function(resolve, reject) {
                if (!tokenPair.renew) {
                    var missingError = new Error("Missing renew token.");
                    missingError.name = "renew_token_missing";
                    return reject(missingError);
                }
                if (!tokenPair.auth) {
                    var missingError = new Error("Missing auth token.");
                    missingError.name = "auth_token_missing";
                    missingError.renewToken = tokenPair.renew;
                    return reject(missingError);
                }

                var authToken = tokenPair.auth,
                    minAccessLevel = minAccessLevel || 0;

                $.ajax({
                    url: API_SERVER_URL + PATH_AUTH_TOKEN + '/bearer',
                    accepts: "application/json",
                    method: "get",
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                }).done(function (res) {
                    var token = res.data.token,
                        tokenValid = res.data.validity;

                    if (token.type !== "auth") return reject(
                        () => {
                            var e = new Error("Wrong token type");
                            e.name = "auth_token_invalid";
                            return e;
                        });
                    if (!tokenValid) return reject(
                        () => {
                            var e = new Error("Token invalid");
                            e.name = "auth_token_invalid";
                            e.renewToken = tokenPair.renew;
                            return e;
                        });
                    if (!token.accessLevel < minAccessLevel) return reject(
                        () => {
                            var e = new Error("Insufficient access level");
                            e.name = "auth_token_insufficient_access";
                            return e;
                        }
                    );

                    return resolve(tokenPair);
                }).fail(function (jxXhr, httpStatus, error) {
                    var serverResponse = jxXhr.responseJSON.errors[0],
                        serverError = new Error(serverResponse.message);
                        
                    serverError.name = serverResponse.name;
                    return reject(serverError);
                });
            }
        );
    }
    
    /**
     * Applies to the API server for a new set of authentication tokens for
     * future use. This method may be used in a token validation chain to
     * resolve any expired token errors, replacing the necessary token with a
     * new one.
     * @param {Error} validationError   (Optional) Error object thrown during
     *                                  stored renew token validation.
     * @return {Promise.<TokenPair>}    Implements a Promise which resolves the
     *                                  a new token pair if fulfilled.
     */
    function _replaceTokens(validationError) { 
        return new Promise(
            function(resolve, reject) {
                // Remove any obsolete tokens from the localStorage.
                if (typeof(validationError) !== "undefined")
                    switch(validationError.name) {
                        case "renew_token_missing":
                        case "renew_token_invalid":
                        case "renew_token_expired":
                            localStorage.removeItem("renewToken");
                            return resolve(AuthAPI.newTokenPair());
                        case "auth_token_missing":
                        case "auth_token_expired":
                        case "renew_token_invalid":
                            localStorage.removeItem("authToken");
                            return resolve(
                                AuthAPI.refreshAuthToken(validationError.renewToken)
                            );
                    }
                // Unexpected error.
                reject(validationError);                
            }
        );
    };
    
    /**
     * Stores the validated renew an auth tokens in the localStorage so that
     * they're available for future requests.
     * @return {Promise.<TokenPair>}    The token pair as supplied to the
     *                                  method initially.
     */    
    function _saveTokens(tokenPair) {
        return new Promise(function (resolve, reject) {
            if (!tokenPair.renew) return reject(() => {
                var e = new Error("Missing renew token.");
                e.name = "renew_token_missing";
                return e;
            });
            if (!tokenPair.auth) return reject(() => {
                var e = new Error("Missing renew token.");
                e.name = "renew_token_missing";
                return e;
            });
            
            localStorage.setItem("renewToken", tokenPair.renew);
            localStorage.setItem("renewToken", tokenPair.renew);
            
            resolve(tokenPair);
        });
    }
    
    /**
     * A Promise generator that resolved a valid auth token that can be used to
     * authenticate a request made to the server. This method may be modified
     * with an optional accessLevel, which sets the minimum token accessLevel
     * required to proceed.
     * @param {number} accessLevel  (Optional) minimum accessLevel that the
     *                              succeeding command expects. Default 0.
     * @return {Promise.<string>}   Returns a valid authentication token that
     *                              may be used by the Authorization header for
     *                              the request that follows.
     */
    AuthAPI.getAuth = function(accessLevel) {
        return new Promise(function(resolve, reject) {
            var tokenPair = { 
                    renew: localStorage.getItem('renew'),
                    auth: localStorage.getItem('renew')
                };

            _validateAuthToken(tokenPair, accessLevel)
                .catch(AuthAPI.refreshAuthToken)
                .then(returnAuthToken)
                .catch(function() {
                    reject(() => {
                        var e = Error("Error gaining authentication");
                        e.name = "auth_failure";
                        return e;
                        }
                    );
                });
            
            /**
             * Supplies the authentication token to our requesting party.
             */
            function returnAuthToken(tokenPair) {
                resolve(tokenPair.auth);
            }
        });
    }
    
    /**
     * Applies to the API server for a new auth token that can be used to 
     * authenticate API calls. This method returns a Promise object resolving
     * a renew, auth token pair.
     * @param {string} renewToken   The renew token with which to apply for a
     *                              new authentication token.
     * @return {Promise.<TokenPair>}    Returns an authentication token pair
     *                                  containing the original renew token and
     *                                  a new auth token.
     */
    AuthAPI.refreshAuthToken = function(renewToken) {
        return new Promise(function(resolve, reject) {
            var renewToken = renewToken || localStorage.getItem('renewToken'),
                tokenPair = { renew: renewToken };
            
            if (!renewToken)
                return resolve(AuthAPI.newTokenPair);
            
            $.ajax({
                url: API_SERVER_URL + PATH_AUTH_TOKEN,
                accepts: "application/json",
                method: "put",
                headers: {
                    'Authorization': 'Bearer ' + renewToken
                }
            }).done(function(response) {
                var tokenPair = response.data;

                localStorage.setItem('renewToken', tokenPair.renew);
                localStorage.setItem('authToken', tokenPair.auth);

                return resolve(tokenPair);
            }).fail(function(jqXhr, httpStatus, error) {
                console.log(httpStatus);
                return reject(error);
            });
            
        });       
    }
    
    /**
     * Applies to the API server for a new auth token that can be used to 
     * authenticate API calls. This method returns a Promise object resolving
     * a renew, auth token pair.
     * @param {string} apiKey   (Optional) API key with which to identify the
     *                          generated token pair. If valid, the tokens will
     *                          have a corresponding AccessLevel of 1 (see the
     *                          apiKeySecret param for AccessLevel 2 tokens).
     * @param {string} apiKeySecret (Optional) secret key corresponding to the
     *                              API key, if supplied. If the apiKeySecret
     *                              is also supplied (and valid) then a token
     *                              pair of AccessLevel 2 is generated.
     * @return {Promise.<TokenPair>}    Returns an authentication token pair
     *                                  containing the original renew token and
     *                                  a newly issued auth token.
     */
    AuthAPI.newTokenPair = function(apiKey, apiKeySecret) {
        return new Promise(
            function(resolve, reject) {
                $.ajax({
                    url: API_SERVER_URL + PATH_AUTH_TOKEN,
                    method: 'post'
                }).done(function(response) {
                    var tokens = response.data;

                    localStorage.setItem('renewToken', tokens.renew);
                    localStorage.setItem('authToken', tokens.auth);

                    return resolve(tokens);
                }).fail(function(jqXhr, httpStatus, error) {
                    console.log(httpStatus);
                    return reject(error);
                });
            }
        )
    }
    
	$(document).ready(_init);
	
	return AuthAPI;

}();