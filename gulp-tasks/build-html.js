/**
 * HTML build tasks
 *
 * This module manages the build process for the HTML content of this website.
 * It has been designed around the use of Jade, allowing for compilation to
 * plain old HTML using this script.
 *
 * @author Kashi Samaraweera <kashi.samaraweera@ward6.com.au>
 */

/**
 * Compiles the Jade source files into HTML, maintaining the relative structure
 * of the web site. Source-mapping of HTML is not yet possible so this method
 * does not provide it.
 */
module.exports = function(gulp, plugins, production) {
    return function () {
        var lazypipe = require('lazypipe');
        var development = !production;

        /* Lazy pipes for HTML */
        /**
         * This lazypipe function processes the Jade files and outputs HTML,
         * preserving the directory structures for the following stream.
         */
        var htmlJadeCompile = lazypipe()
            .pipe(plugins.jade, {locals: { production: production }});

        /**
         * This lazypipe function prettifies a HTML document so that it is
         * easier to read in plain-text.
         */
        var htmlPrettify = lazypipe()
            .pipe(plugins.prettify);

        /**
         * This lazypipe function minifies a HTML document so that it minimises
         * the footprint of each page.
         */
        var minifyHtml = lazypipe()
            .pipe(plugins.minifyHtml);

        var rewriteAssetUrls = lazypipe()
            .pipe(plugins.replace, '"assets/', '"../source/assets/');

        return gulp.src(['./source/**/*.jade', '!./source/_**/*'])
            .pipe(htmlJadeCompile())
            // Development
            .pipe(plugins.if(development, rewriteAssetUrls()))
            .pipe(plugins.if(development, htmlPrettify()))
            .pipe(plugins.if(development, gulp.dest('./build/')))
            // Production
            .pipe(plugins.if(production, minifyHtml()))
            .pipe(plugins.if(production, gulp.dest('./production/')));
    };
};