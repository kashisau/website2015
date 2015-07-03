/**
 * Development Build Gulp task
 *
 * Holds the development functions of building the web application without
 * much regard for optimisation or deployment.
 */

'use strict';
var APP_NAME = "Kashi's website",
    REPO_SRC_URL = 'https://bitbucket.org/KashmaNiaC/website2015-placeholder/raw/master/source/scripts/';

var requireDir = require('require-dir'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    debug = require('gulp-debug'),
    args = require('yargs').argv,
    gulpif = require('gulp-if'),
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
        return runSequence('build:clean', 'build:js-concat', callback);

    return runSequence('build:js-concat', callback);
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
gulp.task('build:js-concat', function() {
    return gulp.src('./source/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('script-all.js'))

        // Production only
        .pipe(gulpif(production, uglify()))
        // Production only
        .pipe(gulpif(production, rename({ suffix: '.min' })))

        // Development sourcemapping
        .pipe(gulpif(development, sourcemaps.write('./',
            {
                includeContent: false,
                sourceRoot: '../source/scripts/'
            }
        )))

        // Production sourcemapping
        .pipe(gulpif(production, sourcemaps.write('./',
            {
                includeContent: false,
                sourceRoot: REPO_SRC_URL,
            }
        )))

        // Development write
        .pipe(gulpif(development, gulp.dest('./build/')))

        // Production write
        .pipe(gulpif(production, gulp.dest('./production/')));
});