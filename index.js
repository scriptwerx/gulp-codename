'use strict';

var gutil = require('gulp-util'),
  through = require('through2'),
  jeditor = require("gulp-json-editor");

module.exports = function () {

  return through.obj(function (file, options, callback) {

    var codenames,
      patchnames;

    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-codename', 'Streaming not supported.')));
      return callback();
    }

    // @TODO: Untested - load custom codenames
    if (options && options.hasOwnProperty('codenames')) {

      try {
        codenames = JSON.parse(fs.readFileSync(options.codenames, 'utf8'));
      }
      catch (err) {
        this.emit('error', new gutil.PluginError('gulp-codename', 'Unable to load supplied codenames file.'));
        return callback();
      }
    }
    else {
      var nameData = JSON.parse(fs.readFileSync('codenames.json', 'utf8'));
      codenames = nameData.codeNames;
      patchnames = nameData.patchNames;
    }

    function getVersionData (ver) {
      var versionData = ver.split (".");
      return versionData.concat (versionData.pop ().split ("-"));
    }

    function getCodeName (ver) {
      var versionData = getVersionData (ver),
        major = codenames.hasOwnProperty (versionData[0]) ? codenames[versionData[0]] : undefined;
      return major !== undefined && major.hasOwnProperty (versionData[1]) ? major[versionData[1]] : "";
    }

    function getPatchName (ver) {
      var versionData = getVersionData (ver);
      return patchnames.hasOwnProperty (versionData[2]) ? patchnames[versionData[2]] : "";
    }

    try {

      var pkg = JSON.parse(fs.readFileSync(file, 'utf8'));

      file = file.pipe(jeditor({
        'codename': getCodeName (pkg.version),
        'patchname': getPatchName (pkg.version)
      }, {
        'indent_char': '\t',
        'indent_size': 1
      }));
    }
    catch (err) {
      this.emit('error', new gutil.PluginError('gulp-codename', err, { fileName: file.path }));
    }

    this.push(file);
    callback();
  });
};
