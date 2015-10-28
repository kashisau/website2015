/**
 * Development Build Gulp tasks
 *
 * Holds the development functions of building the web application without
 * much regard for optimisation or deployment.
 *
 * @author Kashi Samaraweera <kashi@kashisam.com.au>
 */
'use strict';
var APP_NAME = "Kashi's website",
    REPO_SRC_URL = 'https://bitbucket.org/KashiS/website2015-placeholder/raw/master/source/scripts/';

var requireDir = require('require-dir'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    plugins = require('gulp-load-plugins')({lazy:false}),
    args = require('yargs').argv,
    runSequence = require('run-sequence'),
    webserver = require('gulp-webserver'),
    watch = require('gulp-watch');

var production = !!(args.production),
    development = !production,
    rebuild = !!(args.clean);

/**
 * Gulp task dev:build
 *
 * This performs a full-build (or rebuild) of the website, clearing out any
 * published assets.
 */
gulp.task('build', function(callback) {
    if (production) gutil.log(gutil.colors.white.bgGreen("PRODUCTION"),
        "Running production build on", APP_NAME, "...");
    else gutil.log(gutil.colors.white.bgYellow("DEVELOPMENT"),
        "Running development build on", APP_NAME, "...");

    if (production || rebuild)
        return runSequence(
            'build:clean',
            [
                'build:ext:assets',
                'build:ext:css',
                'build:ext:js',
                'build:ext:html'
            ],
            'production:ext:packageAssets',
            'production:ext:packageCopyAssets',
            'production:ext:packageRewrite',
            'production:ext:packageRemoveUnrevisioned',
            callback
        );

    return runSequence(
        ['build:ext:assets', 'build:ext:css', 'build:ext:js', 'build:ext:html'], callback);
});

/**
 * Clears the previous output from disk as well as any temporary directories
 * used during the build process.
 */
gulp.task('build:clean', function() {
    gutil
        .log(gutil.colors.white.bgRed('CLEAN'),
            gutil.colors.white.bgYellow('DEVELOPMENT'),
            'Removing build directory...')
        .log(gutil.colors.white.bgRed('CLEAN'),
            gutil.colors.white.bgGreen('PRODUCTION'),
            'Removing production directory...');

    return gulp.src(
        [
            './build/**/*.js',
            './build/**/*.css',
            './build/**/*.map',
            './build/**/*.html',
            './production/**/*.js',
            './production/**/*.css',
            './production/**/*.map',
            './production/**/*.html',
            './production/assets/',
            './.sass-cache'
        ], {read: false})
        .pipe(clean())
        .on('error', function(e) {
            gutil.beep().log('Error: ' + e.toString())
        }
    );
});

gulp.task('watch', function() {
    gutil.log(gutil.colors.white.bgYellow('DEVELOPMENT'), "Watching development build " +
        "for changes");

    return runSequence(
        ['build:ext:css', 'build:ext:js', 'build:ext:html'],
        [
            'build:webserver',
            'build:rebuildCSSOnDemand',
            'build:rebuildJSOnDemand',
            'build:rebuildHTMLOnDemand'
        ]
    );
});

gulp.task('build:webserver', function() {
    gulp.src('./build/')
        .pipe(webserver({
            livereload: true,
            open: "/",
            host: "localhost"
        }));
});

gulp.task('build:rebuildCSSOnDemand', function() {
    watch(['./source/styles/**/*.scss'], function() {
        return runSequence('build:ext:css');
    });
});

gulp.task('build:rebuildJSOnDemand', function() {
    watch(['./source/scripts/**/*.js'], function() {
        return runSequence('build:ext:js');
    });
});

gulp.task('build:rebuildHTMLOnDemand', function() {
    watch(['./source/**/*.jade'], function() {
        return runSequence('build:ext:html');
    });
});
gulp.task('build:ext:assets', require('./build-assets.js')(gulp, plugins, production));
gulp.task('build:ext:js', require('./build-js.js')(gulp, plugins, production));
gulp.task('build:ext:css', require('./build-css.js')(gulp, plugins, production));
gulp.task('build:ext:html', require('./build-html.js')(gulp, plugins, production));
gulp.task('production:ext:packageAssets', require('./production-package-assets.js')(gulp, plugins, production));
gulp.task('production:ext:packageRewrite', require('./production-package-rewrite.js')(gulp, plugins, production));
gulp.task('production:ext:packageRemoveUnrevisioned', require('./production-package-rm-unrev.js')(gulp, plugins, production));
gulp.task('production:ext:packageCopyAssets', require('./production-package-copy-assets.js')(gulp, plugins, production));
gulp.task('production:ext:deploy', require('./production-deploy.js')(gulp, plugins, production));