/**
 * Revision mapping build tasks (cleanup)
 * 
 * Removes the files that are identified in the production directory within the
 * revision manifest files _before_ the name conversion. This ensures that there
 * are no unnecessary files in the production directory.
 * 
 * @author Kashi Samaraweera
 * @version 0.1.0
 */
/**
 * To be run **after** the revisioning process, this method will delete the
 * original (unrevisioned) files from the production directory.
 */
module.exports = function(gulp, plugins, buildOptions) {
    return function () {
        var production = buildOptions.PRODUCTION,
            development = !buildOptions.DEVELOPMENT;

        if (!production) return;
        
        var fs = require('fs'),
            revManifests = [
                JSON.parse(fs.readFileSync('./build/asset-rev-manifest.json')),
                JSON.parse(fs.readFileSync('./build/source-rev-manifest.json'))
            ],
            obsFiles = [];

        for(var i = 0; i < revManifests.length; i++) {
            var manifest = revManifests[i];
            for (var preRevFilename in manifest) {
                if (manifest.hasOwnProperty(preRevFilename)) {
                    obsFiles.push("./production/" + preRevFilename);
                    obsFiles.push("./production/" + preRevFilename + ".map");
                }   
            }
        }

        return gulp.src(obsFiles, { read: false })
            .pipe(plugins.rimraf());
    };
};