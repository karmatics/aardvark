var _fs = require('fs');
var _path = require('path');
var _mkdirp = require('mkdirp');

var _fileTools = require('../utils/FileTools');

module.exports = {

  htmlScripts: {
      
    createFile: function (q) {
      var s = '<html><body><b>';
      var e = '</b><br></body></html>';

      if (q.getCookies().letmein != "opensesame") {
        q.write(s + 'gimme a cookie!' + e);
        return;
      }
      var filename = _path.basename(q.params.filename);
      var directories = _path.dirname(q.params.filename);
      var timestamp = parseInt(q.params.timestamp);

      function done(err) {
        console.log ('done');
        if (err) {
          q.write(s + 'Error setting mtime: ' + err.toString() + e);
        }
        else {
          q.write(s + 'Created dirs: ' + directories + '<br> Created file: ' + filename + ' with mtime: ' + timestamp + e);
        }
      }

      function makeDateTimeString(dateMilliseconds) {
        var d = new Date(dateMilliseconds);

        var month = d.getMonth() + 1;
        var day = d.getDate();
        var year = d.getFullYear();

        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();

        var dateStr = year + ((month < 10) ? "0" : "") + month + ((day < 10) ? "0" : "") + day;

        dateStr += ((hour < 10) ? "0" : "") + hour + ((minute < 10) ? "0" : "") + minute + '.' + ((second < 10) ? "0" : "") + second;
        return dateStr;
      }


      function doTimestamp(err) {
        console.log ('do timestamp');

        if (err) {
          q.write(s + 'Error in writeFile: ' + err.toString() + e);
        }
        else {
          // child.exec for touch
          require('child_process').exec("touch -m -t " + makeDateTimeString(timestamp) + " " + q.params.filename, done);
        }
      }

      function doFile(err) {
        console.log ('do file');
        if (err) {
          q.write(s + 'Error in makeDirectory: ' + err.toString() + e);
        }
        else {
          _fs.writeFile(q.params.filename, q.params.contents, doTimestamp);
        }
      }

      if (filename.length != 0) {
        _makeDirectory(directories, doFile);
      }
      else {
        q.write(s + 'No filename!' + e);
      }
    },

    //  "static" : function (q) {
    //    if (q.params.filename != null) { 
    //     _fs.readFile(q.params.filename, function (err, data) {
    //        if (err)
    //          q.write("<b>" + err.toString()+"</b>");
    //        else
    //          q.write(data);
    //        });
    //      }  
    //   },

  },

  jsonPScripts: {
    td4 : function (q, data) {
      if (data.functionToRun) {
        try {
          var func;
          var vm = require('vm');
          console.log(data.functionToRun);
          var sandbox = {require: require, script: null};
          vm.runInNewContext("script = " + data.functionToRun + ";", sandbox, "seeifitworks.js");
          sandbox.script(q, data);
          delete (global.td4Script);
        }
        catch (e) {
          q.write({error: e});
          }
        }
      }
    },
  
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

    testFileMod: function (q) {
      var t1 = new Date().getTime();
      _fileTools.modifyFile(
        '/Users/rob/scratch/both.css',
        '/Users/rob/scratch/both2.css',
        false,
        false,
        [
          ['cssreferenced/', ''],
          ['\t', ' '],
          ['{ ', '{'],
          ['  {', '{'],
          [' {', '{'],
          [': ', ':']
        ],
        function (s, lineNo) {
          if(s.indexOf('/* ---') == 0)
            return null;
          var index = 0;
          var c;
          while ((c = s.charAt(index)) == ' ' || c == '\t') {
            index++;
          };
          var indexE = s.length;
          while (indexE>0 && ((c = s.charAt(indexE-1)) == ' ' || c == '\t' )) {
            indexE--;
          };
          s = s.substring(index, indexE);

          if (s.length == 0) 
            return null;
          return s;
        },
        function (err) {
          if (err)
            q.write(err);
          else {
            var t2 = new Date().getTime();
            q.write('coolio ' + (t2-t1));
          }
        }
      );
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
