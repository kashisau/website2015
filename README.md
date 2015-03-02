# Kashi's Website 2015 #

## Node.js static site
This is a simple pure HTML/CSS website that uses some of the cooler features of Node.js to cut down on as many repetitive tasks as possible.

## Who is this for?
Anyone really. I haven't yet put in any licence headers but it'll be one of the do-whatever-you-like-with-it style affairs. I'm using this as a chance to flesh out my knowledge of modern HTML and CSS tools and to get up to speed on the latest trends in FED.

## What's missing?
Design files aren't version controlled, nor are logos and other image assets. Partly because binary files don't really belong in VCS; and partly because there are so many other (read: better) resources for graphic design.

## How do I get started?
There are three things you'll need installed on your machine to build this site:

* Node (v0.10+)
* Ruby (v2.0+)
* SASS (v3.0+)

As long as each of these are installed (and their executables accessible globally) you can simply:

1. Clone this repo
2. Run `npm install` within the cloned directory to download and install all the Node dependencies
3. Run `gulp` to build the site (or `gulp watch` to auto-build when any changes are detected in the `./source/` folder).