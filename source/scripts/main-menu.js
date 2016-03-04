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
        window: window,
		body: 'body',
		main: '.Main',
		menu: '.MainMenu',
        menuLinks: '.MainMenu-menuLinks',
        linkListItems: '.MainMenu-menuLinks li',
        linkListLinks: '.MainMenu-menuLinks a',
		menuIcon: '.MainMenu-icon',
		menuToggleBtns: '.MainMenu-openBtn, .MainMenu-closeBtn',
        logo: 'a.LogoName',
        mmLlogo: '.MainMenu .LogoName',
        landingLogo: '.Landing .LogoName'
	},
    _menuDocked = false,
    _menuDockScrollThreshold = 0,
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
        _controls.linkListLinks.on('click', _navigate);
        
        function show(event) {
            _controls.menu.toggleClass('MainMenu--noLogotype');
            if (!event) return;
            event.preventDefault();
            event.stopPropagation();
        }
        _controls.mmLlogo.on('click', show);
        _controls.window.on('scroll', _updateMenuDock);
        
        _controls.window.on('resize', _resize);
    }
    
    /**
     * Triggered on scroll, this method checks to see if the menu should be
     * docked to the viewport based on how far the user has scrolled.
     */
    function _updateMenuDock() {
        var scroll = _controls.window.scrollTop(),
            threshold = scroll !== 0;
            
        if (threshold && _menuDocked === true) return;
        if (!threshold && _menuDocked === false) return;
        _menuDocked = threshold;
            
        window.requestAnimationFrame(() => {
            _controls.body.toggleClass('FloatingMenus', threshold);
        });
    }
    
    /**
     * Updates the menu docking threshold based on the new viewport dimensions.
     */
    function _resize() {
        _menuDockScrollThreshold = 100;//controls.window.get(0).innerHeight*.5;
        _updateMenuDock();
    }
    
    /**
     * Catches a main menu click for page navigation, allowing the webapp to
     * handle page transitions (build-up and teardowns).
     * @param {jqEvent} navEvent    The jQuery-wrapped event that triggered the
     *                              page navigation.
     */
    function _navigate(navEvent) {
        var link = $(navEvent.currentTarget),
            linkListItem = link.parents('li'),
            linkListItems = _controls.linkListItems,
            menu = _controls.menu;
        
        navEvent.stopPropagation();
        navEvent.preventDefault();
        
        //if (linkListItem.hasClass('is-active')) return false;

        linkListItems.removeClass('is-active');
        linkListItem.addClass('is-active');
        
        menu.removeClass('MainMenu--animateIn');
        menu.addClass('MainMenu--animateOut');
        
        menu.on('animationend', (e) => {
           document.location =  link.get(0).href;
        });
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
		var body = _controls.body,
            menu = _controls.menu,
			main = _controls.main,
			icon = _controls.menuIcon;

        window.requestAnimationFrame(() => {
            body.addClass('mainMenuOpen');
            menu.addClass('MainMenu--open');
            main.addClass('Main--mainMenuOpen');
            main.on('click', MainMenuAPI.close);
            
            icon
                .removeClass('MainMenu-openBtn')
                .addClass('MainMenu-closeBtn');
        });
	}
	
	/**
	 * Closes the main menu so that it transitions off-screen.
	 */
	MainMenuAPI.close = function() {
		var body = _controls.body,
            menu = _controls.menu,
			main = _controls.main,
			icon = _controls.menuIcon;

        window.requestAnimationFrame(() => {
            body.removeClass('mainMenuOpen');
            menu.removeClass('MainMenu--open');
            main.removeClass('Main--mainMenuOpen');
            main.off('click', MainMenuAPI.close);
            
            icon
                .removeClass('MainMenu-closeBtn')
                .addClass('MainMenu-openBtn');
        });
	}
	
	$(document).ready(_init);
	
	return MainMenuAPI;
}();