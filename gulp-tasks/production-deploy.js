/**
 * Production Deploy Gulp task
 *
 * Deploys the web application to the production server (which in our case is
 * Amazon Web Services). This task will copy files across to the S3 bucket,
 * and then invalidate the caches on the CloudFront instance for the files that
 * have been effected.
 */
module.exports = function(gulp, plugins, production) {
    return function () {
        var lazypipe = require('lazypipe');
        var development = !production;
        var awsConfig = require('../deployment-config/aws.json');

        /* Lazy pipes for JavaScript */
        var publisher = plugins.awspublish.create(awsConfig);
        var headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};

        console.log(awsConfig);
        return gulp.src('./production/**')
            .pipe(plugins.awspublish.gzip())
            .pipe(publisher.sync())
            .pipe(publisher.publish(headers))
            .pipe(publisher.cache())
            .pipe(plugins.awspublish.reporter())
            .pipe(plugins.cloudfront(awsConfig))
    };
};