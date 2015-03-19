/* jshint node: true */

var fs = require('fs'),
  gutil = require('gulp-util'),
  _ = require('lodash'),
  path = require('path'),
  through = require('through2'),
  detectIndent = require('detect-indent');

var File = gutil.File,
  PluginError = gutil.PluginError;

module.exports = function(options) {

  options = _.extend({
    codenames: void 0,
    patchname: true
  }, options);

  if (options.codenames) {
    options.codenames = path.resolve(process.cwd() + path.sep + options.codenames);
  }
  else {
    options.codenames = path.resolve(__dirname + path.sep + 'codenames.json');
  }

  return through.obj(function(file, encoding, callback) {

    console.log('OINK:', options.codenames);

    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new gutil.PluginError('gulp-codename', 'Streaming not supported'));
    }

    var json = file.contents.toString('utf8'),
      indent = detectIndent(json),
      target,
      codenames,
      versionSplit,
      patchSplit;

    try {
      target = JSON.parse(json);
    }
    catch (e) {
      return callback(new gutil.PluginError('gulp-codename', 'Problem parsing input JSON file', { fileName: file.path, showStack: true }));
    }

    if (!target.version) {
      return callback(new gutil.PluginError('gulp-codename', 'No version.'));
    }
    else {

      try {
        codenames = JSON.parse(fs.readFileSync(options.codenames, 'utf8'));
      }
      catch (e) {
        return callback(new gutil.PluginError('gulp-codename', 'Problem parsing codenames JSON file', { fileName: options.codenames, showStack: true }));
      }

      if (!codenames.codeNames) {
        return callback(new gutil.PluginError('gulp-codename', 'No codenames found.'));
      }

      if (options.patchname && !codenames.patchNames) {
        return callback(new gutil.PluginError('gulp-codename', 'No patch names found.'));
      }

      versionSplit = target.version.split('.');
      patchSplit = versionSplit[2].split('-');

      var newCodename = codenames.codeNames[versionSplit[0]][versionSplit[1]];
      target.codename = newCodename;
      gutil.log('Codename ' + gutil.colors.magenta(target.codename) + ' to: ' + gutil.colors.cyan(newCodename));

      if (options.patchname) {
        var newPatchname = codenames.patchNames[patchSplit[0]];
        target.patchname = newPatchname;
        gutil.log('Patch name ' + gutil.colors.magenta(target.patchname) + ' to: ' + gutil.colors.cyan(newPatchname));
      }

      file.contents = new Buffer(JSON.stringify(target, null, indent.indent));
    }

    callback(null, file);
  });

};
/* jshint node: false */