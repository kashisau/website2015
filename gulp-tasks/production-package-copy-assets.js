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
 * Copies assets from the source directory into the production directory where
 * the asset has changed.
 */
module.exports = function(gulp, plugins, production) {
    return function () {
        var lazypipe = require('lazypipe'),
            revDel = require('rev-del'),
            development = !production;

        var revisionAssets = lazypipe()
            .pipe(plugins.rev);

        return gulp.src(
            [
                './source/assets/**/*'
            ]
        )
            .pipe(plugins.rev())
            .pipe(gulp.dest('./production/assets/'))
            .pipe(plugins.rev.manifest({path:'rev-asset-manifest.json'}))
            .pipe(gulp.dest('./build/'));
    };
};