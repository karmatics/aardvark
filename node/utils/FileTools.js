var _fs = require('fs');

module.exports = {

  //----------------------------------------
  getFileTree : function (root, cb, dirCb, maxDepth) {
    var out = {name: root, files: [], subDirs: []};
    var count = 0; 
    var doDir = function (path, depth, p) {
      count++;
      _fs.readdir(path, function (err, files){
        if (!err) {
          for (var i=0; i<files.length; i++) {
            if (files[i].charAt(0) != '.') { // skip hidden files
              count++;
              // wrap inside a closure for correct indexing
              _fs.stat(path + '/' + files[i], 
                (function(filename, p){
                  return function (err, fileInfo) {
                    if (!err) {
                      if (fileInfo.isDirectory()) {
                        var dir = {
                          name: filename,
                          files: [],
                          subDirs: [],
                          status: fileInfo,
                          parent: p
                          };
                        p.subDirs.push(dir);
                        if (dirCb && dirCb(dir) == false)
                          dir.blocked = true;               
                        else if (maxDepth!=null && depth>= maxDepth)
                          dir.blocked = true;
                        else
                          doDir(path + '/' + filename, depth+1, dir);
                        }
                      else {
                        p.files.push({
                          name: filename,
                          status: fileInfo
                          });
                        }
                      count--;
                      if(count==0) {
                        cb(out);
                        }
                      }
                    };
                  })(files[i], p));
              }
            }
          }
        count--;
        });
      }
    doDir(root, 0, out);
    },

  //----------------------------------------
  // todo: user specified function(s) for sorting
  sortFileTree : function (root) {
    var sortFunc = function (a, b) {
      return a.name.localeCompare(b.name);
      };
    root.files.sort(sortFunc);  
    root.subDirs.sort(sortFunc);
    for (var i=0; i<root.subDirs.length; i++) {
      this.sortFileTree (root.subDirs[i]);
      }
    },
    
  //----------------------------------------
  getPath : function (dir, file, rootPath) {
    var a = [];
    while (true) {
      if (dir.parent === undefined) {
        if (rootPath)
          a.push(rootPath);
        else
          a.push(dir.name);
        a.reverse();
        if (file)
          a.push (file.name);
        return a;
        }
      else {
        a.push (dir.name);
        dir = dir.parent;
        }
      }
    },
    
  //----------------------------------------
  // todo: flags for files only and dirs only
  walkFileTree : function (parentDir, cb) {
    for (var i=0; i<parentDir.files.length; i++) {
      cb(parentDir, parentDir.files[i]);
      }
    for (var i=0; i<parentDir.subDirs.length; i++) {
      cb(parentDir.subDirs[i]);
      this.walkFileTree (parentDir.subDirs[i], cb);
      }
    },
    
  //----------------------------------------
  // todo: flags for files only and dirs only
  getTreeIterator : function (dir) {
    var a = [], i = 0;
    this.walkFileTree (dir, function (dir, file){
      a.push ((file)?[dir, file]:[dir]);
      });
    return function () {
      var item = a[i];
      i++;
      return item;
      }
    },

  //----------------------------------------
  optimizeReplaceList : function (startList) {
    var re = [];
    for (var i=0, ii=startList.length; i<ii; i++) {
      var item = startList[i];
      re[i] = [
        new RegExp(
          ((item[3] == true) ? '\b'+item[0]+'\b' : item[0]),
          ((item[2] == null) ? 'g' : 'g'+item[2]) ),
        item[1]
      ];
    }
    return {optimized: true, list: re};
  },
  
  //----------------------------------------
  modifyText : function (text, replaceList, perLineCb) {
    var optList;
    if (replaceList) {
      if (!replaceList.optimized)
        replaceList = this.optimizeReplaceList(replaceList);
      optList = replaceList.list;
      }
    else {
      optList = {length: 0};
      }
    var sa = text.split('\n'), saNew = [];
    for (var j=0; j<sa.length; j++) {
      var line = sa[j];
      if (perLineCb)
        line = perLineCb(line, j);
      if(line != null) {
        for (var i=0; i<optList.length; i++)
          line = line.replace(optList[i][0], optList[i][1]);
        saNew.push(line);
      }
    }
    return saNew.join('\n');
  },
  
  //----------------------------------------
  modifyFile : function (
    inPath,
    outPath, // null to use in path (todo)
    preserveTimestamp, // bool (todo)
    append, // bool (true to append to existing file)
    replaceList, // array of search/replace pairs
    lineCb, // called once per line (or null)
    doneCb // call when done, pass err if any
    ) {
      var self = this;
      _fs.readFile(inPath, 'utf8', function (err, data) {
          if (err) {
            doneCb(err.toString());
          }
          else {
            var newText = self.modifyText (data, replaceList, lineCb);
            if (append) {
              _fs.open(outPath, 'a+', function (err, file) {
                if (err) {
                  doneCb(err.toString());
                  }
                else {
                  _fs.write(file, new Buffer(newText), 0, newText.length, function (err, written) {
                      if (err) {
                        doneCb(err.toString());
                      }
                      else {
                        _fs.close(file, doneCb);
                      }
                    });
                  }
                }
              );
              }
           else 
             _fs.writeFile(outPath, newText, doneCb);
          }
      });
    }


};
