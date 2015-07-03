/**
 * Production Deploy Gulp task
 *
 * Deploys the web application to the production server (s).
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
gulp.task('prod:deploy', function() {
    return gutil.log('Performing full (re-)build of', APP_NAME, '...');
});