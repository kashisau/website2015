# Kashi's Website 2015

This project contains the source code and gulp build process for my 2015 portfolio website. The website is built using terse derivatives of native HTML5 languages (such as Jade, SASS, etc.) and the various build processes coordinate the compilation of this source into native HTML, and further apply optimisations for production readying and deployment. 

## Static front-end

This website contains some interactive features that pass data between client and server however there is a complete seperation between content served to a user's browser and dyanmic data injected onto the page using AJAX. The goal of this approach is to maximise the availability and simplyfy the deployment process for changes to the front-end.

The corresponding project which will provide data integration is called API-server, and is also hosted alongside this repository.

## Process: build and deployment

Gulp tasks coordinate the build process and seperately, optimisation for production along with deployment to Amazon Web Services (AWS).

A development server hosts the latest release version of this project (a link should be available on the repository page where the project is hosted). The final target for version 1.0 releases (and beyond) is [kashis.com.au](https://kashis.com.au)

## Required tools

The output of the build process is native HTML, CSS and JavaScript and thus can be stored as local files, uploaded to a HTTP server or distributed to a cloud service for high availability.

The repository does not include any compiled code and thus the required tools for building the website must be installed on the target machine. [Node.js](http://nodejs.org/) `v5.0.0` or greater should be used for the compilation process and once installed, `npm install` will install all the requisite packages on your local machine.

# License

This project is both a learning opportunity for myself and also functions as a method to demonstrate my technical aptitude in current front-end development trends. As such it uses a license that makes copying, distribution, modification and publication permissable; however reserving the rights to use my trademarks (after all, it is _my_ portfolio).

Copyright 2015 Kashi Samaraweera

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.