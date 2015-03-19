# [gulp-codename](id:mainTitle)

[![Build Status](https://travis-ci.org/scriptwerx/gulp-codename.svg?branch=master)](https://travis-ci.org/scriptwerx/gulp-codename) [![GitHub version][badge-github-version-image] ][badge-npm-url] ![Progress](http://progressed.io/bar/50)

[![NPM][badge-npm-image]][badge-npm-url]

Utility to include a codename for your application based on version (up-to v10.X.X-X).

This works great alongside version bump utility: [gulp-bump][] for keeping your version numbers and names up-to-date with each build.

Included codenames and patch names created with the help of the excellent [codenamegenerator.com][] website.

## Getting started

This plugin requires [gulp][].

Once you're familiar with that process, you may install this plugin with this command:


```shell
npm install gulp-codename --save-dev
```

Once the plugin has been installed, it may be enabled inside your gulpfile with this line of JavaScript:

```javascript
var codename = require('gulp-codename');
```

The project follows the [SemVer][] guidelines for version numbers; specifically following: `1.2.3-1` being `MAJOR.MINOR.PATCH-BUILD`.

**N.B. The supplied codenames and patch names only include support for single-digit numbers used for minor and patch of the *version* field (and major up to 10) - you must supply your own custom codenames and patch names if you can't handle this restriction (but that's a lot of names)!**

## The "codename" task

### Overview
In your project's gulpfile.js, add a section named `codename`.

```javascript
gulp.task('codename', function() {
  return gulp.src('./package.json')
    .pipe(codename())
    .pipe(gulp.dest('./'));
});
```

**codename** allows to set the codename and patch name based on the version number of the configuration file (package.json) in your project. Only JSON files are supported, and each file **must** have a `version` field compliant to [SemVer][] guidelines; specifically following: `1.2.3-1` being `MAJOR.MINOR.PATCH-BUILD`.

**Remember: The supplied codenames and patch names only include support for single-digit numbers used for minor and patch of the *version* field (and major up to 10) - you must supply your own custom codenames and patch names if you can't handle this restriction (but that's a lot of names)!**

### Example JSON

**codename** is designed to update your *package.json*, *manifest.json* or any other JSON file with a *"version"* field (configured as noted above).

An example of a *manifest.json* file is below:

```json
{
	"name": "My Test Application",
	"version": "1.3.2-16",
	"codename": "",
	"patchname": "",
	"description": "A test application for me."
}
```

Once **codename** has been used (with patch names enabled); the *manifest.json* file would be updated automatically as follows:

```json
{
	"name": "My Test Application",
	"version": "1.3.2-16",
	"codename": "Honiara Nimitz",
	"patchname": "Ithomiid",
	"description": "A test application for me."
}
```

### Options

options.* | Type | Default | Description
---|:---:|:---:|---
patch|`Boolean`|`false`|Generate a name for the *patch* version as well as the main codename.
codenames|`File`|`undefined`|Use a custom JSON file for codenames.

#### Default Options
Running the task in this way, the `codename` and `patchname` fields of each source file will be automatically changed to the correct codename and patch name for the build release.

```javascript
gulp.task('codename', function() {
  return gulp.src('./package.json')
    .pipe(codename())
    .pipe(gulp.dest('./'));
});
```

#### Custom Options
Running the task in this way, the `codename` field of each source file will be changed to the correct codename but patch name will not be included.

The names contained within the user-supplied *myCodenames.json* file will be used.

```javascript
gulp.task('codename', function() {
  return gulp.src('./package.json')
    .pipe(codename({
    	codenames: 'myCodenames.json',
    	patchname: false
    }))
    .pipe(gulp.dest('./'));
});
```

#### Use with gulp-bump

You can add the codename task alongside your bump task as follows:

```javascript
gulp.task('bump', function() {
  return gulp.src('./package.json')
    .pipe(bump({ type: 'patch' }))
    .pipe(codename())
    .pipe(gulp.dest('./'))
});
```

## Contributing

Any contribution to improve the project and/or expand it is welcome.

If you're interested in contributing to this project, take care to maintain the existing coding style.

To contribute:

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

Add unit tests for any new or changed functionality. Lint and test your code using [gulp][].

## Changelog

Changes, bug fixes and enhancements made to gulp-codename.

### gulp-codename v0.0.7

**"Perseus Amber" (Malbrouck)**

* Corrected README.md.
* Included "gulpfriendly" within package.json.

### gulp-codename v0.0.6

**"Perseus Amber" (Anoa)**

* Ignores unsupported 2-digit version numbers (e.g. "v.0.10.0") - unless custom JSON is used and includes support for this.
* Codename unaltered if unavailable for current version.
* Patch name cleared if unavailable for current version.


### gulp-codename v0.0.5

**"Perseus Amber" (Uromastix)**

* Updated log output.


### gulp-codename v0.0.4

**"Perseus Amber" (Tayra)**

* Removed debug log.
* Updated README.md detailing use alongside bump task.


### gulp-codename v0.0.3

**"Perseus Amber" (Pangolin)**

* Fixed problem with loading the codenames.json file.


### gulp-codename v0.0.2 (Deleted)

**"Perseus Amber" (Ithomiid)**

* Fixed README.md


### gulp-codename v0.0.1 (Deleted)

**"Perseus Amber" (Saiga)**

* Initial commit


## License
See the [LICENSE][] distributed with the project.


&nbsp;
___

[badge-github-version-image]: https://badge.fury.io/js/gulp-codename.svg
[badge-gulp-image]: https://cdn.gulpjs.com/builtwith.png
[badge-gulp-url]: http://gulpjs.com/
[badge-npm-image]: https://nodei.co/npm/gulp-codename.png?downloads=true
[badge-npm-url]: https://npmjs.org/package/gulp-codename
[gulp]: http://gulpjs.com/
[gulp-bump]: https://www.npmjs.com/package/gulp-bump
[SemVer]: http://semver.org/
[LICENSE]: https://github.com/scriptwerx/gulp-codename/blob/master/LICENSE-MIT
[codenamegenerator.com]: http://www.codenamegenerator.com
