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
    REPO_SRC_URL = 'https://bitbucket.org/KashmaNiaC/website2015-placeholder/raw/master/source/scripts/';

var requireDir = require('require-dir'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    plugins = require('gulp-load-plugins')({lazy:false}),
    args = require('yargs').argv,
    runSequence = require('run-sequence');

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
        return runSequence('build:clean', 'build:ext:js', callback);

    return runSequence('build:ext:js', callback);
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

    return gulp.src(['./build','./published', './.sass-cache'], {read: false})
        .pipe(clean())
        .on('error', function(e) {
            gutil.beep().log('Error: ' + e.toString())
        }
    );
});

gulp.task('build:ext:js', require('./build-js.js')(gulp, plugins, production));