/**
 * Optimisation pipeline for CSS build
 * 
 * This module exports a lazypipe object that handles the optimisation tasks
 * for stylsheets used by the website.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
module.exports = function(gulp, plugins, buildOptions) {
    var lazypipe = require('lazypipe');

    return lazypipe()
        .pipe(plugins.minifyCss)
        .pipe(plugins.rename, { suffix: '.min' });
}