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

    // call a function that delivers its result via a simple return value 
    testDoSomething : function (q) {
      q.write(_bp.doSomething(q.params.input));
    },

    // call a function that delivers its result via a callback 
    testDoSomething2 : function (q) {
      _bp.doSomething2(q.params.input, function(str){
          q.write(str);
        });
    },

    showDir: function (q) {
      var t1 = new Date().getTime();
      if (q.params.dirname != null) {
        var mask = null;
        if (q.params.mask) {
          mask = {};
          mask[q.params.mask] = true;
        }
        var dirCb = null;
        if (q.params.block) {
          var a = q.params.block.split(",");
          var block = {};
          for (var i=0; i<a.length; i++)
            block[a[i]] = true;
          dirCb = function (d) {
            return (block[d.name] === undefined);
          }
        }
        
        function makeDateTimeString (d) {
          var month = d.getMonth();
          var day	= d.getDate();
          var year = d.getYear();
          
          var hour = d.getHours();
          var minute = d.getMinutes();
          var ap = "am";
          
          if(hour > 11) {
            ap = "pm";
            if(hour	 > 12) 
              hour = hour - 12;
            }
          else if(hour == 0)
            hour = 12;			
          
          var dateStr = hour + ((minute < 10)?":0":":") + minute + ap;
          
          //if(month != this.thisMonth || day != this.today || year != this.thisYear)
            {
            dateStr += " " + (month+1) + "/" + day;
          
            if(year != this.thisYear) {
              year = (year%100);
              dateStr += ((year < 10)?"/0":"/") + year
              }
            }
          return dateStr;
          }

        var handlerCb = function (tree) {
          var t2 = new Date().getTime()
          // sort files and subdirs alphabetically
          _fileTools.sortFileTree(tree);

          var a = [];

          // function to convert dir and (optional) file into
          // string, and add it to array
          var addItemString = function (dir, file, isIter) {
            var path = _fileTools.getPath(dir, file,  ((isIter)?"blah":null));
            var s = path.join('/');
            if (file)
              s += " size: " + file.status.size + ", last modified: " + 
              
              makeDateTimeString(new Date(file.status.mtime));
            else
              s += " (" + dir.files.length + " files, " + dir.subDirs.length + " subdirs)";
            a.push(s);
          }

          // using iterator is good when we need it sequential,
          // but each file may spawn an an asynch action
          if (q.params.doIterator) {
            var getNext = _fileTools.getTreeIterator(tree);
            var item;
            var addNext = function () {
              var item = getNext();
              if (item) {
                addItemString(item[0], item[1], true);
                setTimeout(addNext, 100);
              }
              else {
                a.push(new Date().getTime() - t2, t2-t1);
                q.write(a);
              }
            };
            addNext();
          }
          // non-iterator is best when we know we want to do something
          // immediate per file
          else {
            _fileTools.walkFileTree(tree, function (dir, file) {
                addItemString(dir, file);
              });
            a.push(t2-t1, new Date().getTime() - t2);
            q.write(a);
          }
        };


        var maxDepth = ((q.params.maxdepth)?parseInt(q.params.maxdepth):null);
        // get the file tree as a nested data structure
        _fileTools.getFileTree(q.params.dirname, handlerCb, dirCb, maxDepth);
      }
      else q.write("no dir");
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
