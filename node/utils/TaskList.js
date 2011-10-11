var _fs = require('fs');

module.exports = {

  usernameList: {
    rob: 'echidna',
    mark: 'wallaby',
    mike: 'kangaroo'
  },

  getFilename: function (name) {
    var dir = '../www/docs/';
    var alnum = "abcdefghijklmnopqrstuvwxyz1234567890";
    var len = name.length;
    var noDotAllowed = true;
    for (var i=0; i<len; i++) {
      var c = name[i];
      if(alnum.indexOf(c.toLowerCase()) != -1) {
        noDotAllowed = false;
      }
      else if (c == '.') {
        if(noDotAllowed)
          return null;
        noDotAllowed = true;
      }
      else {
        return null;
      }  
    }
  return dir + name;
  },
    
  getAuthUser : function (q) {
    var user = q.getCookies().taskuser;
    var pass = q.getCookies().taskpass;
    console.log(user + " " + pass);
    if (user && pass) {
      if (pass == this.usernameList[user])
        return user;
    }
    return null;
  },

  saveFile : function (q) {
    var user;
    if ((user = this.getAuthUser(q)) == null) {
      q.write("not authorized");
      return;
    }
    var self = this;
    var count = 1;
    var file = self.getFilename(q.params.file);
      if (file == null) {
        q.write("err: no filename");
        return;
      }
    var saveOldFileAndWriteNewOne = function () {
      _fs.stat(file + '-' + count, function (err, stats) {
          if (!err) {
            count++;
            saveOldFileAndWriteNewOne();
          }
          else {
            console.log(file + "-" + count)
            _fs.rename(file, file + "-" + count, function (err) {
                _fs.writeFile(file, '#' + user + '\n' + q.params.contents, function () {
                    q.write('thank you!');    
                  });
              });
          }
        });
    }
    saveOldFileAndWriteNewOne();
  },

  sendJsonToClient : function (q) {
    var user;
    if ((user = this.getAuthUser(q)) == null) {
      q.write({err: "not authorized"});
      return;
    }
    var file = this.getFilename(q.params.file)
    if (file == null) {
      q.write({err: "no file: " + file});
      return;
    }
      
    _fs.readFile(file, 'utf8', function (err, data) {
        if (err)
          q.write({err: "can't read file " + file});
        else {
          var i = data.indexOf("\n");
          if (i!= -1 && data[0] == '#')
            data = data.substring(i+1);
          q.write ({contents: data});    
        }
      });
  }
};
