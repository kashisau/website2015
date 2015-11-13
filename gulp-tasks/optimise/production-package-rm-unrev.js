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
 * To be run **after** the revisioning process, this method will delete the
 * original (unrevisioned) files from the production directory.
 */
module.exports = function(gulp, plugins, production) {
    return function () {
        var fs = require('fs'),
            revisioned = JSON.parse(fs.readFileSync('./build/rev-manifest.json')),
            revisionedFiles = [];

        for (var i in revisioned) {
            if (revisioned.hasOwnProperty(i)) {
                revisionedFiles.push('./production/' + i);
                revisionedFiles.push('./production/' + i + '.map');
            }
        }

        return gulp.src(revisionedFiles)
            .pipe(plugins.clean());
    };
};