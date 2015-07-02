/**
 * Gulp Script for Kashi's Website 2015
 *
 * This is the build-script for a web application that broken into separate
 * front-end and back-end parts. This is the front-end project, which accepts
 * and sends requests to a REST server for data communication.
 *
 * This build script is used to manage the development and deployment processes
 * that are used for the site.
 *
 * (c) Kashi Samaraweera 2015
 */

'use strict';
var APP_NAME = "Kashi's website";

var requireDir = require('require-dir'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    tasks = requireDir('./gulp-tasks');

gulp.task('default', function() {
    return gutil.log('Gulp is up and running!');
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
        .pipe(clean());

    return gutil.log('Removed.');
});