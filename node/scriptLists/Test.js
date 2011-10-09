var _fs = require('fs');
var _path = require('path');
var _fileTools = require('../utils/FileTools');
var _mkDirP = require('mkdirp');
      

module.exports = {
  jsonGetScripts: {
    crash : function (q) {
      var r;
      r.bleh = x;
      q.write('hi!');
      },

    showMod : function (q) {
      var x = [];
      var mod = require(q.params.mod);
      if (mod != null) {
        for (var i in mod) {
          if (typeof(mod[i]) == 'function') {
            var s = mod[i].toString();
            var index;
            if ((index = s.indexOf('function')) == 0)
              index = 9;
            else
              index = 0;
            if ((index2 = s.indexOf(')', index)) != -1)
              x.push(i + ": " + s.substring(index, index2+1));
          }
        }
      }
      q.write(x);
      return;
    }, 

    md : function (q) {
      _mkdirp(q.params.d, "0777", function (e) {
          q.write("coolio!")
        });    
    },

    runChildProcess: function (q) {
      if (q.getCookies().letmein != "opensesame") {
        q.write(s + 'gimme a cookie!' + e);
        return;
      }

      var ChildProcess = require('child_process');
      ChildProcess.exec(q.params.command, function (error, stdout, stderr) {
          q.write(stdout);
        });
    },

    runCode: function (q) {
      var output = 'test';
      try {
        eval("output = (function(){" + q.params.code + "}());");
        if (output != null) q.write(output);
      }
      catch (e) {
        q.write(e);
      }
    },
    
    test: function(q) {
      var gd = q.getGlobalData();
      var now = new Date().getTime();
      q.write("app has been running for " + ((now - gd.appStartTime)/1000) + " seconds");
      }
  }
};
