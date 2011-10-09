serverSideFunction = function (q, inputData) {
  var _fileTools = require("./examples/FileTools");
    var t1 = new Date().getTime();
    if (inputData.dirname != null) {
      var dirCb = null;
      if (inputData.block) {
        var a = inputData.block.split(",");
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
        if (inputData.doIterator) {
          var getNext = _fileTools.getTreeIterator(tree);
          var item;
          var addNext = function () {
            var item = getNext();
            if (item) {
              addItemString(item[0], item[1], true);
              setTimeout(addNext, 100);
            }
            else {
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
          q.write(a);
        }
      };


      var maxDepth = ((inputData.maxdepth)?parseInt(inputData.maxdepth):null);
      // get the file tree as a nested data structure
      _fileTools.getFileTree(inputData.dirname, handlerCb, dirCb, maxDepth);
    }
    else q.write("no dir");
  }
