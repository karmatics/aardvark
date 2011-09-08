var _fs = require('fs');
var _path = require('path');

module.exports = {

  htmlScripts: {
    saveTaskList : function (q) {
      var taskList =  require('../utils/TaskList');
      taskList.saveFile(q);
    }
  },

  jsonPScripts: {
  },

  jsonGetScripts: {

    getTaskList : function (q) {
      var taskList =  require('../utils/TaskList');
      taskList.sendJsonToClient(q);
    },
    
    getFile: function (q) {
      _fs.readFile(q.params.filename, 'utf8', function (err, data) {
          if (err) {
            q.write(err.toString());
          }
          else {
            q.write({
                data: data
              });
          }
        });
    },
    showParams: function (q) {
      q.params.cookies = q.getCookies();
      q.write(q.params);
    },

    showEnv: function (q) {
      q.write({
          cwd: process.cwd()
          
        });
    },

    moveFileOrDir: function (q) {
      var oldname = q.params.oldname;
      var newname = q.params.newname;
      var parentDirs = _path.dirname(newname);

      if (q.getCookies().letmein != "opensesame") {
        q.write('gimme a cookie!');
        return;
      }

      _fs.stat(oldname, function (err, stats) {
          if (err) {
            q.write("Couldn't stat " + oldname + " : " + err.toString());
          }
          else {
            _makeDirectory(parentDirs, function (err) {
                if (err) {
                  q.write("Couldn't make new path " + parentDirs + " : " + err.toString());
                }
                else {
                  _fs.rename(oldname, newname, function (err) {
                      if (err) {
                        q.write("Couldn't move " + oldname + " to " + newname + " : " + err.toString());
                      }
                      else {
                        q.write("Moved " + oldname + " to " + newname);
                      }
                    });
                }
              });
          }
        });
    }
  }
};
