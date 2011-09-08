var _fs = require('fs');

/**
 * Offers functionality similar to mkdir -p
 *
 * Asynchronous operation. No arguments other than a possible error
 * are given to the completion callback.
 */
module.exports = makeDirectory;

function makeDirectory(path, mode, callback, position) {
  if (typeof mode == "function") position = callback, callback = mode, mode = 0750;
  mode = mode || 0750;
  position = position || 0;
  var parts = require('path').normalize(path).split('/');
  if (parts[0] == '') {
    parts[1] = '/' + parts[1];
    parts = parts.slice(1, parts.length);
  }

  console.log (parts);
  if (position >= parts.length) {
    if (callback) {
      return callback();
    } else {
      return true;
    }
  }

  var directory = parts.slice(0, position + 1).join('/');
  _fs.stat(directory, function(err) {
    if (err === null) {
      makeDirectory(path, mode, callback, position + 1);
    } else {
      _fs.mkdir(directory, mode, function (err) {
        if (err) {
          if (callback) {
            return callback(err);
          } else {
            throw err;
          }
        } else {
          makeDirectory(path, mode, callback, position + 1);
        }
      });
      console.log(err);
    }
  });
}
