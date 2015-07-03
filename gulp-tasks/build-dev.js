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
    runSequence = require('run-sequence'),
    lazypipe = require('lazypipe');

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
        return runSequence('build:clean', 'build:js', callback);

    return runSequence('build:js', callback);
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

/*
 * JavaScript
 */

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
gulp.task('build:js', function() {
    return gulp.src('./source/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('script-all.js'))

        // Development
        .pipe(gulpif(development, jsConcatAndWrite()))
        // Production
        .pipe(gulpif(production, jsMinifyAndWrite()))
});

/* Lazy pipes for JavaScript */
/**
 * This lazypipe function concatenates all of the JavaScript source files into
 * a single file (without minification) and produces a corresponding sourcemap
 * that references the project directory.
 *
 * This is typically used for development builds of the client-side JavaScript.
 */
var jsConcatAndWrite = lazypipe()
        .pipe(concat, 'script-all.js')
        .pipe(sourcemaps.write, './',
            {
                includeContent: false,
                sourceRoot: '../source/scripts/'
            }
        )
        .pipe(gulp.dest, './build/');

/**
 * This lazypipe function concatenates and minifies all of the JavaScript
 * source files into a single minified file, complete with sourcemaps.
 * The sourcemaps point to the public repository so that they can be accessed
 * without the development files present (i.e., when investigating the
 * JavaScript over the WWW).
 */
var jsMinifyAndWrite = lazypipe()
        .pipe(uglify)
        .pipe(rename, { suffix:'.min' })
        .pipe(sourcemaps.write, './',
            {
                includeContent: false,
                sourceRoot: REPO_SRC_URL
            }
        )
        .pipe(gulp.dest, './production/');

/*
 * END JavaScript
 */