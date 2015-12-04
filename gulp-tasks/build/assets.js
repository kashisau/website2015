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
module.exports = function(gulp, plugins, buildOptions) {
    return function () {
        var production = buildOptions.PRODUCTION,
            development = !buildOptions.DEVELOPMENT;

        var assetOptimisationPipe = 
            require('../optimise/assets-lazypipe.js')
                (gulp, plugins, buildOptions),
            imageFilter = plugins.filter(
                    ["**/*.{jpg,gif,png,svg}", "!assets/fonts/**/*"],
                    { restore: true }
            ),
            revisionFilter = plugins.filter(
                    ["**/*", "!**/favicon.ico", "!**/*.mp4", "!fonts/**/*"],
                    { restore: true }
            );
            
        return gulp.src(['./source/assets/**/*'])
            .pipe(gulp.dest('./build/'))
            // Target the images used by the site.
            .pipe(plugins.if(production, imageFilter))
            .pipe(plugins.if(
                production,
                assetOptimisationPipe()
                ))
            // Replace the assets that were filtered out
            .pipe(plugins.if(production, imageFilter.restore))
            // Target the assets that should be revisioned
            .pipe(plugins.if(production, revisionFilter))
            .pipe(plugins.if(
                production,
                plugins.rev()
                )
            )
            // Replace the assets that were filtered out
            .pipe(plugins.if(production, revisionFilter.restore))
            // Output our production-ready files
            .pipe(plugins.if(
                production,
                gulp.dest('./production/')
            ))
            .pipe(plugins.if(
                production,
                plugins.rev.manifest("asset-rev-manifest.json")
            ))
            // Writes the rev manifest file (keep the production dir clean)
            .pipe(plugins.if(
                production,
                gulp.dest('./build/')
            ));
    };
};