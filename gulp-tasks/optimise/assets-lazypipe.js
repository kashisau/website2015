/**
 * Optimisation pipeline for build
 * 
 * This file exports a lazypipe instance that contains optiomsation procedures
 * for assets that are ready to be deployed.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

module.exports = function(gulp, plugins, buildOptions) {
    var lazypipe = require('lazypipe');

    return lazypipe()
        .pipe(plugins.imagemin, {progressive: true});
}