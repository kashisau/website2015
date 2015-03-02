
/**
 * Include Gulp & tools we'll use
 */
var gulp = require('gulp'),
    jade = require('gulp-jade'),
    changed = require('gulp-changed'),
    rimraf = require('gulp-rimraf'),
    sass = require('gulp-ruby-sass'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    rework = require('gulp-rework'),
    markdown = require('gulp-markdown'),
    reworkPlugins = {
        // Rework plugins required for SuitCSS. This excludes testing plugins.
        // See https://github.com/suitcss/rework-suit
        vars: require('rework-vars'),
        customMedia: require('rework-custom-media'),
        calc: require('rework-calc')
    };


/**
 * Our default list of tasks.
 *
 * Gulp traditionally runs all tasks in parallel, which creates race conditions
 * and can upset some of the processes that take place. In order to circumvent
 * such issues, we arbitrate which tasks must run in sequence and which may run
 * asynchronously. Hence below you'll find the use of runSequeunce.
 */
gulp.task(
    'default',
    function() {
        runSequence(
            // 1. Ensure the clean function is completely finished.
            'clean',
            // 2. Arrange files into the build folder, copy assets and processes CSS/HTML
            [
                'assets',
                'arrange-js-assets',
                'arrange-css-assets',
                'jade',
                'sass',
                'js:common',
                'js:other'
            ],
            // 3. Finalise the CSS (including processing of imports).
            'css'
        );
    }
);

/**
 * Removes all files that were built or have been used during the build phase.
 */
gulp.task('clean', function() {
    return gulp.src(
        // Select ALL files in the published and build folder EXCEPT the gitignore(s).
        [
            'published/**/*.js',
            'published/**/*.css',
            'published/**/*.html',
            '!.gitignore'
        ],
        // Don't bother reading them into memory (saves time & money)
        {read: false}
    )
    // Delete the targeted files
    .pipe(rimraf());
    return;
});

/**
 * Compiles the markdown articles found in the articles directory into HTML
 * snippets. These snippets are then injected into the targeted layout and
 * finally rendered as HTML by the Jade compiler.
 */
gulp.task('articles', function () {
    return gulp.src(
        [
            'articles/**/*.md'
        ]
    )
    .pipe(markdown())
    .pipe(rename(function (path) {
        var layoutName = new String(path.basename);
            articleDir = new String(path.dirname);

        // Steal the directory name, assign it to the filename
        path.dirname = "";
        path.basename = articleDir + "_" + layoutName;
        path.extname = ".html";
    }))
    .pipe(gulp.dest('build/articles'));
});

/**
 * Compiles the Jade files into HTML, placing them immediately into the
 * published folder within their respective subfolders.
 * This task will retain any folder structure you have implemented in the
 * source with respect to jade files. Any files or folders prefixed with
 * underscores (_) will not be compiled into HTML directly (and thus indicate
 * that they are either layout files or partials).
 */
gulp.task('jade', function() {
  return gulp.src(
        [
            // Grab all *.jade files in all subdirectories,
            'source/**/*.jade',
            // except for files beginning with underscores (_)
            '!source/**/_*',
            // (and) except for folders beginning with underscores(_)
            '!source/_**/',
            // and QUnit test files (identified by having qunit in its filename).
            '!source/**/*qunit*'
        ]
    )
    // Parse them with Jade to churn out native HTML.
    .pipe(jade())
    .pipe(gulp.dest('published/'))
});

/**
 * Copies library CSS into the build folder so that they may be assembled
 * during subsequent steps.
 */
gulp.task('arrange-css-assets', function() {
    return gulp.src(['source/**/*.css', 'libraries/css/**/*.css'])
        .pipe(changed('build/css/'))
        .pipe(gulp.dest('build/css/'));
});

/**
 * Copies library scripts into the published folder.
 */
gulp.task('arrange-js-assets', function() {
    return gulp.src(['libraries/script/**/*.js'])
        .pipe(rename({dirname: ''}))
        .pipe(changed('published/'))
        .pipe(gulp.dest('published/'));
});

/**
 * Simply grabs static assets in the assets folder and copies them (faithful
 * to their existing directory structure) to the published folder.
 */
gulp.task('assets', function() {
    return gulp.src(
            [
                'assets/**/*.*'
            ]
        )
        // Remove any directories and sub-directories.
        .pipe(rename({dirname: ''}))
        // Only target those that have changed compared to those in the published folder.
        .pipe(changed('published/'))
        // Output the files
        .pipe(gulp.dest('published/'));
});

/**
 * Processes SASS files (and we're using SASS and SCSS interchangeably here).
 * This will furnish our stylsheets with native CSS, and import any SASS
 * dependencies. Importantly, native CSS imports will not be processed in this
 * step (see task 'css' instead).
 */
gulp.task('sass', function() {
    // Parse the SASS into native CSS.
    return sass(
        // Within our source directory, ANY .scss file in any subfolder
        'source/style/',
        { style: 'expanded' }
    )
    // Output the files to the build folder.
    .pipe(gulp.dest('build/'));
});

/**
 * Manages the CSS compliation and processing.
 */
gulp.task('css', function() {
    return gulp.src(
        [
            // Take everything we've arranged into our build folder
            'build/**/*.css'
        ]
    )
    // Process the @import statements (doesn't really minify much).
    .pipe(
        minifycss({
            "root": "**//*",
            "processImport": true,
            "noRebase": true,
            "keepBreaks": true,
            "noAdvanced": true,
            "keepSpecialComments": true
        })
    )
    // Combine everything into one file
    .pipe(concat('style.css'))
    // Use some process our CSS using rework CSS
    .pipe(
        // This is a wrapper for rework plugins, allowing us to use rework
        // functions within our gulp file (traditionally incompatible).
        rework(
            // Support for custom media (@custom-media) pseudo-CSS instructions
            reworkPlugins.vars,
            reworkPlugins.customMedia,
            reworkPlugins.calc
        )
    )
    // Now, we minify (for reals this time)
    .pipe(minifycss({"noRebase": true}))
    // Just to make it painfully obvious
    .pipe(rename({suffix: '.min'}))
    // Output the concatenated, imported, compiled, reworked and minified CSS.
    .pipe(gulp.dest('published/'));
});

/**
 * Assemble and minify the common javascript used throughout the edetailer.
 * This method will organise all common libraries into a single file for all
 * eDetailer pages.
 * */
gulp.task('js:common', function() {
    return gulp.src(
        [
            // We look in a specific folder here (and not its subfolders).
            'source/scripts/common/**/*.js'
        ]
    )
    // Concatenate all common JS into a single file (NOT minify -- for debugging).
    .pipe(concat('common.js'))
    // Write this common.js file to the published folder.
    .pipe(gulp.dest('published/'));
});

/**
 * Copies accross javascript files that are specific to a page, or otherwise
 * should not be bundled for all pages.
 */
gulp.task('js:other', function() {
   return gulp.src(
    [
       // We look in a specific folder here (and not its subfolders).
       'source/script/discrete/**/*.js'
    ]
    )
    // Remove any directories and sub-directories.
    .pipe(rename({dirname: ''}))
    // Output each file separately into the published folder.
    .pipe(gulp.dest('published/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['source/**/*','assets/**/*', 'libraries/**/*'], ['default']);
});
