var _fs = require('fs');
var _fileTools = require("./FileTools");
var _remoteStoragePath = '../remotestoredata/';
var _clientCodePath = '../www/js/library/';

module.exports = {
  //-----------------------------------------
  getMetaData: function (user, cb) {
    _fs.readFile(_remoteStoragePath + user + '/meta.js', 'utf8',
       function (err, fileData) {
        if (err) {
          cb(null);
        }
        else {
          try {
            var settings = JSON.parse(fileData);
          } catch (e) {
            cb(null);
            return;
          }
          cb(settings);
       }
      });
  },
  
  //-----------------------------------------
  getAllInGroup: function (q, data) {
    var files;
    var latest = 0;
    var meta = null;
    var filesPath = _remoteStoragePath + data.user + '/' + data.snippetSet;
    this.getMetaData(data.user, function (metaData){
      if (metaData) {
         if (data.password === metaData.readPw ||
              data.password === metaData.writePw) {
            return _fileTools.getFileTree(filesPath, treeHandler, null, 0);
          } else {
            q.write({'err': 'bad password'});
          }
        } else {
          q.write({'err': 'no such directory'});
        }
      });
      
    return;
    
    function treeHandler (tree) {
      if (tree) {
        files = tree.files;
        var numLeft = files.length;
        for (var i=0; i<files.length; i++) {
          var name = files[i].name;
          _fs.readFile(filesPath + '/' + name, 'utf8',
            (function (loopIndex) {
              return function (err, fileData) {
                if (err) {
                  files[loopIndex].contents = {};
                }
                else {
                  files[loopIndex].contents = JSON.parse(fileData);
                  var t = Date.parse(files[loopIndex].status.mtime)/1000;
                  if (t > latest)
                    latest = t;
                }
              numLeft--;
              if (numLeft === 0)
                complete();
              }
            })(i));
          }
        }
      else
        q.write({err: "not found"});
    }
    
    function complete () {
      var settings = {};
      outArray = [];
      for (var i=0; i<files.length; i++) {
        var f = files[i];
        var num = parseInt(f.name);
        if (isNaN(num)) {
          // shouldn't happen
        }
        else {
          f.contents.num = num;
          outArray.push(f.contents)
        }
      }
      q.write ({snippets: outArray, modified: latest});
    }
  },
  
  //-----------------------------------------
  saveSingleItem: function (q, data) {
    var max = 0;
    var filesPath = _remoteStoragePath + data.user + '/' + data.snippetSet;
    this.getMetaData(data.user, function (metaData){
      if (metaData) {
         if (data.password === metaData.writePw) {
             complete();
          } else {
            q.write({'err': 'bad password'});
          }
        } else {
          q.write({'err': 'no such directory'});
        }
      });

    return;

    function complete () {
      if (data.snippet.num) {
        writeToFile (data.snippet);
      } else {
        _fileTools.getFileTree(filesPath, fileTreeHandler, null, 0);
      }
    }
    
    function writeToFile(snippet) {
      var name = filesPath + '/' + snippet.num + ".js";
      
      if (snippet.js) {
        _fs.writeFile(name, JSON.stringify(snippet), function (err) {
            if (err)
              q.write({error: "couldn't write file " + name});
            else
              q.write({snippetNum: snippet.num});
            });
      } else {
        _fs.unlink(name);
        q.write({deleted: snippet.num});
      }
    }

    function fileTreeHandler(tree) {
      if (tree) {
        numLeft = tree.files.length;
        for (var i=0; i<numLeft; i++) {
          var name = tree.files[i].name;
          var num = parseInt(name);
          if (num > max)
            max = num;
        }
      data.snippet.num = max+1;
      writeToFile (data.snippet);
      }
      else {
         q.write({error: "can't find directory " + snippetPath});
      }
    }
  }
};
