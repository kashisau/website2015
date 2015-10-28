/**
 * Main menu driver
 * 
 * Manages the main menu on Kashi's website, making sure the interface changes
 * to accomodate the options that the user is presented with.
 */
// namespacing
var com = com || {};
com.kashis = com.kashis || {};
com.kashis.fed = com.kashis.fed || {};

com.kashis.fed.MainMenu = function() {
	// External API
	var MainMenuAPI = {};
	
	/*
	 * Properties
	 */
	var _controls = {
		body: 'body',
		main: '.Main',
		menu: '.MainMenu',
		menuIcon: '.MainMenu-icon',
		menuToggleBtns: '.MainMenu-openBtn, .MainMenu-closeBtn'
	},
	$ = jQuery;
	
	/**
	 * This initilisation method gathers the controls on the page using jQuery,
	 * making them easily available to the other methods of this object.
	 * It also binds any event handlers that need to be put in place.
	 */
	function _init() {
		for (var control in _controls)
			if (_controls.hasOwnProperty(control))
				_controls[control] = $(_controls[control]);

		_controls.menuToggleBtns.on('click', _mainMenuToggle);
		_controls.body.removeClass('preload');
	}
	
	/**
	 * Event handling method for opening or closing the main menu for the site.
	 * This will attempt to resolve the intention (i.e., either opening or
	 * closing the main menu) and then call the public-facing method that
	 * corresponds to do the heavy lifting.
	 * @param toggleEvent Event	The event that is fired to initiate the opening
	 * 							or closing of the main menu.
	 * @returns boolean	Returns false to cancel whatever navigation that would
	 * 					otherwise take place (if any). 
	 */	
	function _mainMenuToggle(toggleEvent) {
		var triggerElement = $(toggleEvent.currentTarget),
			triggerOpen = !triggerElement.hasClass('MainMenu-closeBtn');
		
		toggleEvent.stopPropagation();
		toggleEvent.preventDefault();
		
		if (triggerOpen)
			MainMenuAPI.open();
		else
			MainMenuAPI.close();
		
		return false;
	}
	
	/**
	 * Opens the main menu so that it comes into view.
	 */
	MainMenuAPI.open = function() {
		var menu = _controls.menu,
			main = _controls.main,
			icon = _controls.menuIcon;

		menu.addClass('MainMenu--open');
		main.addClass('Main--mainMenuOpen');
		main.on('click', MainMenuAPI.close);
		
		icon
			.removeClass('MainMenu-openBtn')
			.addClass('MainMenu-closeBtn');
	}
	
	/**
	 * Closes the main menu so that it transitions off-screen.
	 */
	MainMenuAPI.close = function() {
		var menu = _controls.menu,
			main = _controls.main,
			icon = _controls.menuIcon;

		menu.removeClass('MainMenu--open');
		main.removeClass('Main--mainMenuOpen');
		main.off('click', MainMenuAPI.close);
		
		icon
			.removeClass('MainMenu-closeBtn')
			.addClass('MainMenu-openBtn');
	}
	
	$(document).ready(_init);
	
	return MainMenuAPI;
}();