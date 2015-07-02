/**
 * Production Build Gulp task
 *
 * These tasks take the output of the dev build and optimise it for production.
 */

'use strict';
var APP_NAME = "Kashi's website";

var requireDir = require('require-dir'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require("gulp-rename");


/**
 * Gulp task dev:build
 *
 * This performs a full-build (or rebuild) of the website, clearing out any
 * published assets.
 */
gulp.task('prod:package', function() {
    return gutil.log('Performing full (re-)build of', APP_NAME, '...');
});

/**
 * Takes all of the (client-side) JavaScript and concatenates it into a single
 * javascript file, outputting it into the build folder as a minified,
 * source-mapped script file.
 */
gulp.task('prod:js-minify', function() {
    return gulp.src('./source/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('script-all.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./',
            {
                includeContent: false,
                sourceRoot: 'https://bitbucket.org/KashmaNiaC/website2015-placeholder/src/source/scripts/',
            }
        ))
        .pipe(gulp.dest('./production/'));
});