/**
 * Gulp Script for Kashi's Website 2015
 *
 * This is a simple bootstrapper for the modularised build tasks contained in
 * the gulp-tasks directory of this project. Gulp is used for the build process
 * of rendering the native HTML, CSS & JavaScript from terse derivitives (such
 * as Jade, SASS, etc.) that extend productivity of front-end development.
 * 
 * This project does not contain any back-end software (instead see the api-
 * server project on BitBucket/GitHub), but does implement API methods of the
 * server within the client-side JavaScript of this project (/source/scripts).
 *
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

'use strict';
// Load our app's package file where we'll find some basic information.
var packageFile = require('./package.json');

// Set some global variables which come in handy during subsequent scripts.
var APP_NAME = packageFile.name,
    REPO_URL = packageFile.repository.url;

// Load each of the Gulp JavaScript files from the gulp-tasks directory.
var requireDir = require('require-dir'),
    gulp = require('gulp'),
    tasks = requireDir('./gulp-tasks'); 