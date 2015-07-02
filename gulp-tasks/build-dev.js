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
    clean = require('gulp-clean');


/**
 * Gulp task dev:build
 *
 * This performs a full-build (or rebuild) of the website, clearing out any
 * published assets.
 */
gulp.task('dev:build', function() {
    return gutil.log('Performing full (re-)build of', APP_NAME, '...');
});