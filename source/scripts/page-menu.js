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
        mainBody: '.Main:not(.Main--sectionMenu)',
        landingLogo: '.Landing .LogoName',
        pageMenu: '.PageMenu',
        pageLinks: '.PageMenu ul a',
        closeBtn: '.PageMenu-closeBtn',
        pageSections: '[id]'
	},
    _pageSectionMap = [],
    _windowHeightDiv2 = 0,
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

        _controls.window.on('scroll', PageMenuAPI.trackPageSections);
        _controls.window.on('resize', PageMenuAPI.updatePageSectionMap);
        _controls.closeBtn.on('click', PageMenuAPI.close);
        _controls.pageLinks.on('click', _toggleMenu);
        
        _controls.window.on('load', PageMenuAPI.updatePageSectionMap);
    }
    
    /**
     * Probes the DOM for the rendered positions of each section within the
     * page. Each section and its offset are stored in the page section map
     * property, which is then used by the page tracking method to determine
     * which page section is currently in view. 
     */
    PageMenuAPI.updatePageSectionMap = function() {
        var sections = _controls.pageSections;
        _pageSectionMap = [];
        
        _windowHeightDiv2 = window.innerHeight / 2;
        
        sections.each((index, section) => {
            if (section.clientHeight === 0) return;
            section = _controls.pageSections.eq(
                    _controls.pageSections.index(section)
                );

            _pageSectionMap.push(
                {
                    section: section,
                    top: section.offset().top - _windowHeightDiv2
                }
            );
        });
    }
    
    /**
     * Tracks the window's scroll position, using the resultant scroll position
     * to determine which page section is currently visible in the viewport.
     * This method is optimised to listen for scroll events.
     */
    PageMenuAPI.trackPageSections = function() {
        var scrollTop = _controls.window.scrollTop(),
            section = lastSection(_pageSectionMap.slice());
        
        if (section === undefined) return;
        
        var pageLink = _controls.pageLinks.filter(
                '[href="#' + section.attr('id') + '"]'),
            pageLinkIndex = _controls.pageLinks.index(pageLink),
            pageLinksTotal = _controls.pageLinks.length,
            pageMenu = _controls.pageMenu.get(0),
            itemClass = x => "item-" + x + "-is-active";
        
        _controls.pageLinks.removeClass('is-active');
        pageLink.addClass('is-active');
        
        if (!pageMenu.classList.contains('PageMenu--open')) {
            for (var i = 0; i < pageLinksTotal; i++)
                pageMenu.classList.remove(itemClass(i));

            pageMenu.classList.add(itemClass(pageLinkIndex));
        }

        function lastSection(sections) {
            var section = sections.shift();
            
            if (section === undefined) return;
            if (section.top >= scrollTop) return;
            if (sections.length === 0) return section.section;
            
            if (section.top < scrollTop)
                return lastSection(sections) || section.section;
        }
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
        
        if (menuOpening) {
            PageMenuAPI.open();
            return false;
        }
        
        PageMenuAPI.close();
        PageMenuAPI.scrollTo(pageLink);
        
        return false;
    }
    
    /**
     * Scrolls the page to the destination specified in the internalLink href.
     */
    PageMenuAPI.scrollTo = function(internalLink) {
        var linkTarget = (internalLink.prop("id"))? internalLink
                : $(internalLink.prop("hash"));
        
        if (!linkTarget.length) return false;
        
        _controls.scrollBody.stop(true, false).animate({
            scrollTop: linkTarget.offset().top
        },
        {
            duration: 600,
            // Smooth out the scroll transition with my favourite trig function:
            step: (xi, fxTween) => {
                var x0 = fxTween.start,
                    xn = fxTween.end,
                    xd = xn - x0,
                    i = fxTween.pos,
                    sinePos = x0 + xd * Math.sin(Math.PI/2 * i);

                fxTween.now = sinePos;
            }
        });
    }
    
    /**
     * Opens the page menu.
     */
    PageMenuAPI.open = function() {
        var pageMenu = _controls.pageMenu;
        
        _controls.mainBody.on('click', PageMenuAPI.close);
        
        pageMenu.addClass('PageMenu--open');
        _controls.body.addClass('PageMenu-is-open');
        
        return false;
    }
    
    /**
     * Closes the page menu.
     */
    PageMenuAPI.close = function() {
        var pageMenu = _controls.pageMenu;
        
        _controls.mainBody.off('click', PageMenuAPI.close);
        
        pageMenu.removeClass('PageMenu--open');
        _controls.body.removeClass('PageMenu-is-open');
        
        return false;
    }

	$(document).ready(_init);
	
	return PageMenuAPI;
}();