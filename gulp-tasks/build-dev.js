/**
 * Development Build Gulp task
 *
 * Holds the development functions of building the web application without
 * much regard for optimisation or deployment.
 */

'use strict';
var APP_NAME = "Kashi's website";

var requireDir = require('require-dir'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    debug = require('gulp-debug');

/**
 * Gulp task dev:build
 *
 * This performs a full-build (or rebuild) of the website, clearing out any
 * published assets.
 */
gulp.task('dev:build', function() {
    return gutil.log('Performing full (re-)build of', APP_NAME, '...');
});

/**
 * Clears the previous output from disk as well as any temporary directories
 * used during the build process.
 */
gulp.task('dev:clean', function() {
    gutil
        .log('Removing build directory...')
        .log('Removing published directory...');

    gulp.src(['./build','./published', './.sass-cache'], {read: false})
        .pipe(clean())
        .on('error', function(e) {
            gutil.beep().log('Error: ' + e.toString())
        }
    );

    return gutil.log('Removed.');
});

/**
 * Monitors for updated files and performs a rebuild of only the effected.
 */
gulp.task('dev:build-changed', function() {

});

/**
 * Takes all of the (client-side) JavaScript and concatenates it into a single
 * javascript file, outputting it into the build folder.
 */
gulp.task('dev:js-concat', function() {
    return gulp.src('./source/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(debug())
        .pipe(concat('script-all.js'))
        .pipe(sourcemaps.write('./', { includeContent: false, sourceRoot: '../source/scripts/'}))
        .pipe(gulp.dest('./build/'));
});