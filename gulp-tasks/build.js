'use strict';
/**
 * Build tasks
 * 
 * This gulp file will load the subtasks from the build folder, facilitating
 * a build sequence for the HTML, CSS and JavaScript contained in the source
 * directory of the project.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */
var packageFile = require('../package.json');

var BUILD_OPTIONS = {
        APP_NAME: packageFile.name,
        REPO_URL: packageFile.repository.url,
        PRODUCTION: !!(process.env.NODE_ENV === "PRODUCTION"),
        DEVELOPMENT: !!(process.env.NODE_ENV === "DEVELOPMENT")
    };

var gulp = require('gulp'),
    gulpRun = require('run-sequence'),
    plugins = require('gulp-load-plugins')();

gulp.task(
    'build',
    function() {       
        var gutil = plugins.util,
            logColour = (BUILD_OPTIONS.PRODUCTION)? gutil.colors.black.bgRed
                : gutil.colors.black.bgYellow;

        gutil.log(
            logColour(
                (BUILD_OPTIONS.PRODUCTION? 'PRODUCTION' : 'DEVELOPMENT'),
                'BUILD'
            )
        );
        
        return gulpRun(
            [
                'build-assets',
                'build-styles',
                'build-scripts',
                'build-html'
            ],
            'revision-mapping',
            'revision-cleanup'
        );
    }
);

// Task definition
gulp.task(
    'build-assets',
    require('./build/assets.js')(gulp, plugins, BUILD_OPTIONS)
);
// Task definition
gulp.task(
    'build-styles',
    require('./build/styles.js')(gulp, plugins, BUILD_OPTIONS)
);
// Task definition
gulp.task(
    'build-scripts',
    require('./build/scripts.js')(gulp, plugins, BUILD_OPTIONS)
);
// Task definition
gulp.task(
    'build-html',
    require('./build/html.js')(gulp, plugins, BUILD_OPTIONS)
);

gulp.task(
    'revision-mapping',
    require('./build/revision-mapping.js')(gulp, plugins, BUILD_OPTIONS)
);

gulp.task(
    'revision-cleanup',
    require('./build/revision-cleanup.js')(gulp, plugins, BUILD_OPTIONS)
);