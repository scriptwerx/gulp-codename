/* jshint node: true */

var fs = require('fs'),
  gutil = require('gulp-util'),
  _ = require('lodash'),
  path = require('path'),
  through = require('through2'),
  detectIndent = require('detect-indent');

module.exports = function(options) {

  // Extend the default options with user supplied (if any).
  options = _.extend({
    codenames: void 0,
    patchname: true
  }, options);

  // Configure the relevant codenames JSON path (default/user supplied).
  options.codenames = options.codenames ? path.resolve(process.cwd() + path.sep + options.codenames) : path.resolve(__dirname + path.sep + 'codenames.json');

  // Do it.
  return through.obj(function(file, encoding, callback) {

    // Basic initial checks.
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new gutil.PluginError('gulp-codename', 'Streaming not supported'));
    }

    // Setup / declare
    var json = file.contents.toString('utf8'),
      indent = detectIndent(json),
      target,
      codenames,
      versionSplit,
      patchSplit;

    // Parse the input file or die
    try {
      target = JSON.parse(json);
    }
    catch (e) {
      return callback(new gutil.PluginError('gulp-codename', 'Problem parsing input JSON file', { fileName: file.path, showStack: true }));
    }

    // Check for version string
    if (!target.version) {
      return callback(new gutil.PluginError('gulp-codename', 'No version.'));
    }

    // Parse the codenames JSON or die
    try {
      codenames = JSON.parse(fs.readFileSync(options.codenames, 'utf8'));
    }
    catch (e) {
      return callback(new gutil.PluginError('gulp-codename', 'Problem parsing codenames JSON file', { fileName: options.codenames, showStack: true }));
    }

    // Check for codenames and patch names (if applicable)
    if (!codenames.codenames) {
      return callback(new gutil.PluginError('gulp-codename', 'No codenames found.'));
    }
    if (options.patchname && !codenames.patchnames) {
      return callback(new gutil.PluginError('gulp-codename', 'No patch names found.'));
    }

    // Get the version and patch
    versionSplit = target.version.split('.');
    patchSplit = versionSplit[2].split('-');

    // Very basic validation; this really shouldn't be needed.
    if (versionSplit.length !== 3) {
      return callback(new gutil.PluginError('gulp-codename', 'Version mismatch - MUST BE "MAJOR.MINOR.PATCH-BUILD" e.g. "1.2.3-4".'));
    }

    // Get the codename from the codenames JSON Object.
    var newCodename = codenames.codenames[versionSplit[0]][versionSplit[1]];

    // Check for availability and log.
    if (!newCodename) {
      gutil.log(gutil.colors.magenta('Codename unavailable for current version: ' + target.version));
    }
    else if (target.codename !== newCodename) {
      gutil.log('Codename changed from "' + gutil.colors.magenta(target.codename) + '" to: "' + gutil.colors.cyan(newCodename) + '"');
    }
    else {
      gutil.log('Codename is "' + gutil.colors.cyan(target.codename) + '"');
    }

    // Set or retain the codename
    target.codename = newCodename || target.codename;

    // If we need to set a patch name...
    if (options.patchname) {

      // Get the patch name from the codenames JSON Object.
      var newPatchname = codenames.patchnames[patchSplit[0]];

      // Check for availability and log.
      if (!newPatchname) {
        gutil.log(gutil.colors.magenta('Patch name unavailable for current version: ' + target.version));
      }
      else if (target.patchname !== newPatchname) {
        gutil.log('Patch name changed from "' + gutil.colors.magenta(target.patchname) + '" to: "' + gutil.colors.cyan(newPatchname) + '"');
      }
      else {
        gutil.log('Patch name is "' + gutil.colors.cyan(target.patchname) + '"');
      }

      // Set or clear the patch name
      target.patchname = newPatchname || '';
    }

    // Update the file contents to be passed through.
    file.contents = new Buffer(JSON.stringify(target, null, indent.indent));

    // Callback
    callback(null, file);
  });

};
/* jshint node: false */