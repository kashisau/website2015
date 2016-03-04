/**
 * Page menu driver
 * 
 * Pages that are broken into document sections have a floating page menu that
 * users can navigate with between page sections. This object manages its
 * implementation.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
// namespacing
var com = com || {};
com.kashis = com.kashis || {};
com.kashis.fed = com.kashis.fed || {};

com.kashis.fed.PageMenu = function() {
	// External API
	var PageMenuAPI = {};
	
	/*
	 * Properties
	 */
	var _controls = {
        window: window,
        scrollBody: 'html, body',
		body: 'body',
		main: '.Main',
        landingLogo: '.Landing .LogoName',
        pageLinks: '.PageMenu a'
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

        _controls.window.on('scroll', _updateMenuDock);
        _controls.pageLinks.on('click', _toggleMenu);
    }
    
    /**
     * Triggered on scroll, this method checks to see if the menu should be
     * docked to the viewport based on how far the user has scrolled.
     */
    function _updateMenuDock() {
        var scroll = _controls.window.scrollTop();
    }
    
    /**
     * Handles page link clicks to coordinate the reveal and obscuring of the
     * page menu. This is an event handler that expects to be triggred by a
     * page menu item, beit either in its collapsed or expanded state.
     * 
     * If the pagemenu is currently collapsed, the navigation will be cancelled
     * immediately So that the menu can transition into its expanded state.
     * @param {jqEvent} toggleEvent The jQuery-wrapped Event object specifying
     *                              which page link was clicked.
     */
    function _toggleMenu(toggleEvent) {
        var pageMenu = _controls.pageLinks.parents('.PageMenu'),
            menuOpening = !pageMenu.hasClass('PageMenu--open'),
            pageLinks = _controls.pageLinks,
            pageLink = $(toggleEvent.currentTarget),
            pageLinkIndex;
        
        pageMenu.removeClass().addClass('PageMenu');
        pageMenu.toggleClass('PageMenu--open', menuOpening);
        _controls.body.toggleClass('PageMenu-is-open', menuOpening);
        
        // Opening the menu doesn't change the state of our page. Exit here.
        if (menuOpening) return false;

        pageLinkIndex = pageLinks.index(pageLink);
        pageMenu.removeClass();
        pageMenu.addClass(
            'PageMenu item-'
            + pageLinkIndex
            + '-is-active'
        );
        pageLinks.removeClass('is-active');
        pageLink.addClass('is-active');
        
        PageMenuAPI.goto(pageLink);
        return false;
    }
    
    /**
     * Scrolls the page to the destination specified in the internalLink href.
     */
    PageMenuAPI.goto = function(internalLink) {
        var linkTarget = (internalLink.prop("id"))? internalLink
                : $(internalLink.prop("hash"));
        
        if (!linkTarget.length) return false;
        
        _controls.scrollBody.stop(true, false).animate({
            scrollTop: linkTarget.offset().top
        },
        {
            duration: 800,
            step: (x, fxTween) => {
                var x0 = fxTween.start,
                    xn = fxTween.end,
                    xd = xn - x0,
                    pos = fxTween.pos,
                    sinePos = x0 + xd * Math.sin(Math.PI/2 * pos);

                fxTween.now = sinePos;
            }
        });
    }
    
    /**
     * Opens the page menu.
     */
    PageMenuAPI.open = function() {
        
    }
    
    /**
     * Closes the page menu.
     */
    PageMenuAPI.close = function() {
        
    }

	$(document).ready(_init);
	
	return PageMenuAPI;
}();