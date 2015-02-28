#Migrating to Amazon Web Services
##Another year, another website

![banana.jpg](banana.jpg "Some banana")
I'm shifting away from CPanel; and with it a lot of the cruft that traditional web development seems to invite.
In particular, I'm moving away from PHP (or .NET/Java/Python) and really focusing on the front-end (UX) and production (infrastructure) aspects, in order to get familiar with the *new guard*.

###Node.js for static HTML

HTML generators take the idea of a CMS or blogging system and strip them down to the bare essentials. This is good for two reasons. Firstly, it means that if a developer wants to add functionality, he or she gets to build it *up* rather than retro-fit it into a more comprehensive system.

The second reason is that it keeps things simple and maintains a separation of concerns. It goes back to the old adage of doing one thing and doing it well, rather than a one-size-fits-all approach to a problem.

So whenever I have an update to the site, I just generate it again (with the new updates) and initiate the (automated) **deployment process**.

###Deploying static HTML

In the old days I would (S)FTP the updated files, or if it were a content change there'd be some interface to manage content through the browser; or if it were really fancy I'd use a DVCS for site updates and debug anything that proved to be difficult.

Instead, I have set up a series of tasks that processes the generated files and distributes them to various Amazon S3 buckets. One of the perks of this is that the necessary processing is done just once.

Images are resized into the correct set of dimensions once, individual pages are templated into their corresponding structures just once; and things like cache-control can be better managed as the build system is precisely aware of the last change.

###Amazon Web Services, Google App Engine, Windows Azure, ...

Those are some of the big-names in cloud services. Despite their dominance there's a handful of other popular cloud compute/storage providers such as [Heroku](http://heroku.com), *et. al.*

[Windows Azure](http://azure.microsoft.com) was my preferred provider as they have the most datacentres in Australia (finally); but I wanted SSL functionality and Azure's minimum web hosting plan with HTTPS support is relatively high.

[Amazon Web Services](http://aws.amazon.com) was my next preference and they had what I wanted for a reasonable price (< $10 a month) so I got set up with S3 and CloudFront. I even migrated my DNS hosting to Route 53 for simplicity.