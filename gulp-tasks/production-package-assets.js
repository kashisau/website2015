/**
 * Production packaging tasks
 *
 * These tasks will prepare assets for deployment to a production environment
 * beyond plaintext minification (such as when minifying CSS/JavaScript). Image
 * assets are re-compressed and revision information is embedded into the HTML
 *
 * @author Kashi Samaraweera <kashi.samaraweera@ward6.com.au>
 */

/**
 * This takes an already-rendered set of HTML/CSS/JavaScript along with binary
 * assets (images, etc.) and prepares them for final deployment. This includes
 * cache-busting techniques for plaintext files and lossless compression for
 * others.
 */
module.exports = function(gulp, plugins, production) {
    return function () {
        var lazypipe = require('lazypipe'),
            revDel = require('rev-del'),
            development = !production;

        return gulp.src(
                [
                    './production/**/*.map',
                    './production/**/*.css',
                    './production/**/*.js',
                    './production/**/*.{png|jpg|gif|svg}'
                ]
            )
            .pipe(plugins.rev())
            .pipe(gulp.dest('./production/'))
            .pipe(plugins.revNapkin())
            .pipe(plugins.rev.manifest({path:'rev-manifest.json'}))
            .pipe(gulp.dest('./build/'));
    };
};