/**
 * JavaScript build tasks
 *
 * This set of tasks pertains to the build process for JavaScript for both
 * development and production builds. It has been abstracted out from the
 * build process main task.
 *
 * @author Kashi Samaraweera <kashi.samaraweera@ward6.com.au>
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
module.exports = function(gulp, plugins, buildOptions) {
    return function () {
        var lazypipe = require('lazypipe');
        var production = buildOptions.PRODUCTION,
            development = !!buildOptions.DEVELOPMENT;


        /* Lazy pipes for JavaScript */
        /**
         * This lazypipe function concatenates all of the JavaScript source files into
         * a single file (without minification), passing on the stream for further
         * piping.
         */
        var jsConcat = lazypipe()
            .pipe(plugins.concat, 'scripts-all.js');

        /**
         * This lazypipe function concatenates and minifies all of the JavaScript
         * source files into a single minified file, passing on the output
         * stream for the next pipe.
         */
        var jsMinify = lazypipe()
            .pipe(plugins.uglify)
            .pipe(plugins.rename, { suffix:'.min' });

        /** BrowserSync controls. Used by the gulp watch function **/
        var bs = buildOptions.browserSync.stream !== undefined,
            bsFunc = buildOptions.browserSync.stream ||
                function () { return; };

        return gulp.src('./source/scripts/**/*.js')
            .pipe(plugins.sourcemaps.init())
            //.pipe(plugins.concat('scripts-all.js'))
            // Development
            .pipe(jsConcat())
            .pipe(plugins.if(development, plugins.sourcemaps.write(
                './',
                {
                    includeContent: false,
                    sourceRoot: '../source/scripts/'
                }
            )))
            .pipe(plugins.if(development, gulp.dest('./build/')))
            .pipe(plugins.if(bs, bsFunc()))
            // Production
            // .pipe(plugins.if(production, jsMinify()))
            // .pipe(plugins.if(production, plugins.sourcemaps.write(
            //     './',
            //     {
            //         includeContent: false,
            //         sourceRoot: REPO_SRC_URL
            //     }
            // )))
            // .pipe(plugins.if(production, gulp.dest('./production/')));
    };
};