/**
 * Revision mapping build tasks
 * 
 * This method works on production builds to re-map assets that were renamed
 * during the optimisation phase.
 * 
 * @author Kashi Samaraweera
 * @version 0.1.0
 */

module.exports = function(gulp, plugins, buildOptions) {
    return function() {
        var production = buildOptions.PRODUCTION,
        development = !buildOptions.DEVELOPMENT;

        if (!production) return;
        
        return gulp.src([
            'production/**/*.css',
            'production/**/*.js',
            'production/**/*.html'
        ])
        .pipe(
            plugins.revReplace(
                {manifest: gulp.src('./build/asset-rev-manifest.json')}
            )
        )
        .pipe(plugins.revReplace(
                {manifest: gulp.src('./build/source-rev-manifest.json')}
            )
        )
        .pipe(gulp.dest('./production')); 

    }
}