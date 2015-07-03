/**
 * JavaScript build tasks
 *
 * This set of tasks pertains to the build process for JavaScript for both
 * development and production builds. It has been abstracted out from the
 * build process main task.
 *
 * @author Kashi Samaraweera <kashi@kashisam.com.au>
 */

/**
 * Concatenates and (optionally) minifies the JavaScript contained in the
 * source directory into a single file. This method uses the --production
 * argument (via CLI) to distinguish between a minified and non-minified build
 * of the scripts used.
 *
 * Sourcemapping is also handled by this method, which will reference the local
 * sources folder in a development build; or the public repository for the
 * production build of the site.
 */
module.exports = function(gulp, plugins, production) {
    return function () {
        var lazypipe = require('lazypipe');
        var development = !production;
        var REPO_SRC_URL = 'https://bitbucket.org/KashmaNiaC/website2015-placeholder/raw/master/source/scripts/';

        /* Lazy pipes for JavaScript */
        /**
         * This lazypipe function concatenates all of the JavaScript source files into
         * a single file (without minification) and produces a corresponding sourcemap
         * that references the project directory.
         *
         * This is typically used for development builds of the client-side JavaScript.
         */
        var jsConcatAndWrite = lazypipe()
            .pipe(plugins.concat, 'script-all.js')
            .pipe(plugins.sourcemaps.write, './',
            {
                includeContent: false,
                sourceRoot: '../source/scripts/'
            }
        )
            .pipe(gulp.dest, './build/');

        /**
         * This lazypipe function concatenates and minifies all of the JavaScript
         * source files into a single minified file, complete with sourcemaps.
         * The sourcemaps point to the public repository so that they can be accessed
         * without the development files present (i.e., when investigating the
         * JavaScript over the WWW).
         */
        var jsMinifyAndWrite = lazypipe()
            .pipe(plugins.uglify)
            .pipe(plugins.rename, { suffix:'.min' })
            .pipe(plugins.sourcemaps.write, './',
            {
                includeContent: false,
                sourceRoot: REPO_SRC_URL
            }
        )
        .pipe(gulp.dest, './production/');


        gulp.src('./source/scripts/*.js')
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.concat('script-all.js'))

            // Development
            .pipe(plugins.if(development, jsConcatAndWrite()))
            // Production
            .pipe(plugins.if(production, jsMinifyAndWrite()));
    };
};