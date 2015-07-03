# Kashi's Website 2015 (front-end)

This is the site-generator for Kashi Samaraweera's porfolio website for 2015.
The aim here is to create a site-generator mechanism using Gulp as a scripting
tool for the _build_ process.

This allows the use of terse and superset languages that compile into 
plain-old-HTML/CSS/JavaScript for basic web hosting.

## Front-end / Back-end seperation

As a portfolio site, most of the content will be fixed; but there will be some
data going back and forth. Examples include a secure _Work_ section and contact
form for the site. This will be handled by a separate application that exposes
an API to this front-end site.

## Early days

This is still very much in development; and thus won't be functional for a
little while. At present, the Gulp-process is being worked out so that actual
development can commence in a few weeks' time.

## Required tools

[Gulp](http://gulpjs.com/) runs on the [Node.js](http://nodejs.org/) virtual
environment. This build is being developed against Node `v0.12.5` on both
Windows (x86) and Mac OS X.