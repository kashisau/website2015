/**
 * Asset copying build tasks
 *
 * Copies any assets that should be left as-is (i.e., those assets in the
 * source directory). Copying assets will flatten any directory structures that
 * are in place, so take note of conflicting names.
 *
 * @author Kashi Samaraweera <kashi.samaraweera@ward6.com.au>
 */

/**
 * Copies assets from the source/assets directory into the build directory.
 */
module.exports = function(gulp, plugins, production) {
    return function () {
        var lazypipe = require('lazypipe');
        var development = !production;
        var REPO_SRC_URL = 'https://bitbucket.org/KashiS/website2015-placeholder/raw/master/source/scripts/';

        return gulp.src(['./source/assets/**/*'])
            .pipe(gulp.dest('./build/'));
    };
};