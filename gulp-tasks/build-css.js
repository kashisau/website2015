/**
 * CSS build tasks
 *
 * Manages the stylesheet compilation for the website, performing any CSS pre-
 * processing and post-processing and allowing for concatenation and
 * minification for building.
 *
 * @author Kashi Samaraweera <kashi.samaraweera@ward6.com.au>
 */
/**
 * Compiles, concatenates and (optionally) minifies the CSS from the sources
 * that are contained in the source directory.
 *
 * SASS is compile into CSS before imports are processed and all CSS is
 * concatenated into a single file. Once concatenated, a production build can
 * minify the contained CSS.
 *
 * Sourcemapping is also handled by this method, which will reference the local
 * sources folder in a development build; or the public repository for the
 * production build of the site.
 */
module.exports = function(gulp, plugins, production) {
    return function () {
        var lazypipe = require('lazypipe'),
            reworkCustomMedia = require('rework-custom-media');

        var development = !production;
        var REPO_SRC_URL = 'https://bitbucket.org/KashmaNiaC/website2015-placeholder/raw/master/source/styles/';

        /* Lazy pipes for CSS */
        /**
         * This lazypipe function will compile all root sass files into
         * CSS-native. These will then be made available to stream to a further
         * destination.
         */
        var cssCompileSass = lazypipe()
            .pipe(plugins.sass);

        /**
         * This lazypipe function adds in browser-specific prefixes to CSS keys
         * to support older or non-conforming browsers. This will return the
         * stream for further piping.
         */
        var cssAutoprefix = lazypipe()
            .pipe(plugins.autoprefixer, {
                browsers: ['last 2 versions']
            });

        /**
         * This lazypipe function concatenates all of the stylsheet files into
         * a single file (without minification), passing on the stream for
         * further piping.
         */
        var cssConcat = lazypipe()
            .pipe(plugins.concat, 'styles-all.css');

        /**
         * This lazypipe function minifies native CSS and changes the output
         * filename by prepending the extension with .min. This returns the
         * stream for further piping.
         */
        var cssMinify = lazypipe()
            .pipe(plugins.minifyCss)
            .pipe(plugins.rename, { suffix:'.min' });

        /**
         * Performs CSS post-processing for Rework (library)
         */
        var cssRework = lazypipe()
            .pipe(plugins.rework, reworkCustomMedia());

        /**
         * Re-writes URLs for assets so that they're accessible from the build
         * directory.
         */
        var rewriteAssetUrls = lazypipe()
            .pipe(plugins.replace, '../assets/', '../source/assets/');

        /**
         * Re-writes URLs for assets so that they're accessible from the build
         * directory.
         */
        var rewriteAssetUrlsProduction = lazypipe()
            .pipe(plugins.replace, '../assets/', 'assets/');

        return gulp.src(['./source/styles/*.scss', './source/styles/*.sass', '!./_**'])
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.plumber())
            .pipe(cssCompileSass())
            .pipe(cssConcat())
            .pipe(cssAutoprefix())
            .pipe(cssRework())
            // Development
            .pipe(plugins.if(development, rewriteAssetUrls()))
            .pipe(plugins.if(development, plugins.sourcemaps.write(
               './',
               {
                   includeContent: false,
                   sourceRoot: '../source/styles/'
                }
            )))
            .pipe(plugins.if(development, gulp.dest('./build/')))
            // Production
            .pipe(plugins.if(production, cssMinify()))
            .pipe(plugins.if(production, rewriteAssetUrlsProduction()))
            // Development
            .pipe(plugins.if(production, plugins.sourcemaps.write(
                './',
                {
                    includeContent: false,
                    sourceRoot: REPO_SRC_URL
                }
            )))
            .pipe(plugins.if(production, gulp.dest('./production/')))
            .pipe(plugins.plumber.stop());
    };
};