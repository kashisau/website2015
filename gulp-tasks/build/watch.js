/**
 * Gulp watch tasks
 * 
 * This method may be used to watch changes to the source folder of the web
 * project, compiling assets as they change. This method uses the other sub-
 * components of the build gulp tasks along with BrowserSync to keep everything
 * in motion.
 * 
 * @author Kashi Samaraweera
 * @version 0.1.0
 */
module.exports = function(gulp, plugins, buildOptions) {
    return function() {
        var gulpRun = require('run-sequence'),
            browserSync = buildOptions.browserSync;

        // 1. a. Initialise BrowserSync
        browserSync.init({
            server: {
                baseDir: './build'
            }
        });

        // 1. b. Perform initial build
        gulpRun(['build']);
        
        // 2. a. Watch HTML changes
        gulp.watch(
            './source/**/*.jade',
            ['build-html']
        );
        
        // 2. b. Watch JavaScript (client-side) changes
       gulp.watch(
            './source/scripts/**/*.js',
            ['build-scripts']
        );
        
        // 2. c. Watch SASS changes
        gulp.watch(
            [
                './source/styles/**/*.scss',
                './source/styles/**/*.sass'
            ],
            ['build-styles']
        );

    }
}