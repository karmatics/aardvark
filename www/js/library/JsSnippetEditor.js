JsSnippetEditor = {
  jsLoaded : [],
  sharedVariables : {},
  savedSnippets : [],
  loginData: null,

  constructor: function (remoteSaveData) {
    if (remoteSaveData) {
      JsSnippetEditor.remoteSaveData = remoteSaveData;
      JsonPClient.send(
        remoteSaveData.url + "getSnippets", 
        {
          user: remoteSaveData.user,
          password: remoteSaveData.pw,
          group: remoteSaveData.group
        },
        function (response) {
          if(response) {
            response.snippets.sort (function (a,b) {
                return a.num - b.num;
              });
            JsSnippetEditor.setData(response.snippets);
          }
          else {
            alert ("failed to get snippets: " + response.status);
          };
        }
      );
    }
    var self = this;
    this.window = new PopupWindow (
      "Snippet Editor",
      "jsedit",
      true,
      function(type, pw){self.windowCallback(type, pw);}
    );
    this.window.jsEdit = this;
    var mainElem, runButton, deleteButton, saveButton;
    with (DomGenerator) {
      mainElem = TABLE ({className: "th_jsbox"}, TBODY (
          TR (
            TD (
              DIV (
                this.textArea = TEXTAREA ({style: {width: "350px", height: "150px"}, spellcheck: false})
              )
            )  
          ),
          TR (
            TD (
              this.cPanelDiv = DIV (
                DIV (
                  this.nameSelectElem = SELECT ()
                ),
                DIV (
                  runButton = INPUT ({type: "button", className: "button", value: "run", 
                      style: {cssFloat: "right", styleFloat: "right"}}),
                  saveButton = INPUT ({type: "button",  className: "button", value: "save"}),
                  this.deleteButton = INPUT ({ className: "button", type: "button", value: "delete"}),
                  this.nameInputElem = INPUT ({type: "text", className: "text", value: ""})
                )
              )
            )
          )
        ));
    }
    this.window.contentElem.appendChild (mainElem);
    this.window.contentElem.style.backgroundColor = "#888";
    this.window.contentElem.style.borderColor = "#444";
    this.nameOfItem = "";
    
    this.nameSelectElem.onchange = function() { self.nameSelectHandler();};
    runButton.onclick = function(type, elem, event) {self.runButtonHandler();};
    saveButton.onclick = function() {self.saveButtonHandler ();};
    this.deleteButton.onclick = function() {self.deleteButtonHandler();};
    this.textArea.onkeydown = function() {self.textAreaKeyDownHandler();};
    this.textArea.onfocus = function() {self.setAsTopItem();};
    DomUtils.addPropertyToElementAndChildren (this.window.element, "isAardvark", true);
    this.populateNameMenu(JsSnippetEditor.selectedItem);
    this.getDataBasedOnGui ();
    this.setNameInputVisibility ();
    JsSnippetEditor.addListener(this);
    this.setAsTopItem();
    this.window.show ();
    
    var f = function (s) {
        var log = function (x, maxDepth) {
          Logger.write (x, null, null, maxDepth);
        };
        var g = JsSnippetEditor.sharedVariables;
        with (DomGenerator) {
          splitter();
        }
      };

    var a = f.toString().split("splitter();");
    JsSnippetEditor.fs = {
      part1: a[0],
      part2: a[1],
      offset: a[0].split('\n').length
    };
  },
  
  open : function (remoteSaveData) {
    return new JsSnippetEditor(remoteSaveData);
  },
  
  getLastFocused : function (openIfNone) {
    var item = PopupWindow.displayedList.list.jsedit;
    var latest = 0, best = null;
    while (item) {
      var jse = item.object;
      if ((jse = jse.jsEdit) != null) {
        if (jse.focusedAt > latest) {
          latest = jse.focusedAt;
          best = jse;
        }
      }
      item = item.next;
    }
    if (best == null && openIfNone) {
      return this.open();
    }
    return best;    
  },

  prepParse: function () {
    var currHash = window.location.hash;
    if (currHash[0] == '#')
      currHash = currHash.substring(1);
    var num = this.savedSnippets.length;
    this.savedSnippets.push({bleh: 'blah'}); 
    window.location.hash = "snippet_" + num;    
    this.currHash = currHash;
  },
  
  completeParse: function (currHash) {
    if (this.currHash != null) {
      if (this.currHash == '') {
        if ("pushState" in history)
          history.pushState("", null, window.location.pathname);
        else
          window.location.hash = '';
      }
      else
        window.location.hash = this.currHash;
      this.currHash = null;
    }
  },

  onerrorFunction : function (error, file, lineNo) {
    Logger.write("error " + file + "\nline " + (lineNo-JsSnippetEditor.fs.offset) + "\n" + error);
    this.completeParse();
  },
  
  prototype : {
    evaluateCode : function(snippet) {
      window.onerror = JsSnippetEditor.onerrorFunction;
      var s = document.createElement('script'),
          str = 'runFunction = ' + 
            JsSnippetEditor.fs.part1 + 
            snippet.evString +
            JsSnippetEditor.fs.part2 + ";";
      s.appendChild(document.createTextNode(
            str
            ));
      
      JsSnippetEditor.prepParse();
      document.body.appendChild(s);
      JsSnippetEditor.completeParse();
      window.onerror = null;
      
      for (var i=0; i<snippet.hereDocs.length; i++) {
        var hd = snippet.hereDocs[i];
        JsSnippetEditor.makeVariableByPath (hd.name, hd.lines.join('\n'));
      }
        //Logger.write();
      
      try {
        runFunction();
      } catch (e) {
        JsSnippetEditor.completeParse();
        var stack = e.stack;
        if (stack) {
          var a = stack.split('\n');
          if (e.message)
            Logger.write(e.message);
          for (var i=0; i<a.length; i++) {
            if(a[i].indexOf('evaluateCode')!= -1) 
              break;
            Logger.write(a[i]);
          }
        } else {
          Logger.write(e);
        }    
      }
    },
 
 
    populateNameMenu : function (selectedItem) {
      var selElem = this.nameSelectElem;
      var haveSelected = false;
      var j, len = selElem.childNodes.length;
      for (j=len-1; j >= 0; j--)
        selElem.removeChild(selElem.childNodes[j]);
      
      var opt, namedItemIndex,  found = false;
      var names = JsSnippetEditor.getNames ();
      for (var i=0; i<names.length; i++) {
        opt = DomGenerator.OPTION ({value: names[i]}, names[i]);
        if (names[i] == selectedItem) {
          opt.selected = "selected";
          haveSelected = true;
        }
        this.nameSelectElem.appendChild (opt);
        
      }
      opt = DomGenerator.OPTION ({value: "_new_"}, "--- new ---");
      if (haveSelected == false)
        opt.selected = "selected";
      this.nameSelectElem.appendChild (opt);
      this.setNameInputVisibility ();
    },
    
    setNameInputVisibility : function () {
      if (this.nameSelectElem.value == "_new_") {
        this.nameInputElem.value = "";
        this.nameInputElem.style.display = "";
        this.deleteButton.style.display = "none";
      }
      else {
        this.nameInputElem.style.display = "none";
        this.deleteButton.style.display = "";
      }
    },
    
    getDataBasedOnGui : function (nameOfItem) {
      var n = this.nameSelectElem.value;
      if (n == "_new_") {
        this.textArea.value = "";
      }
      else {
        var item = JsSnippetEditor.getByName (n);
        if (item) {
          this.textArea.value = item.js;
          this.nameOfItem = nameOfItem;
        }
        else {
          this.textArea.value = "";
        }
      }
      JsSnippetEditor.selectedItem = n;
      this.setNameInputVisibility();
    },
    
    editorListUpdated : function () {
      var selElem = this.nameSelectElem;
      var val = selElem.value;
      if (val == "_new_" && this.nameInputElem.value.length > 0)
        val = this.nameInputElem.value;
      this.populateNameMenu ();
      if (JsSnippetEditor.getByName (val) == null)
        this.textArea.value = "";
      else
        this.nameSelectElem.value = val;
      JsSnippetEditor.selectedItem = this.nameSelectElem.value;
    },
    
    //-----------------------------------
    windowCallback : function (type, pw) {
      if (type == "kill") {
        JsSnippetEditor.removeListener(this);
      }
      else if (type == "resize") {
        this.textArea.style.width = (pw.contentElem.offsetWidth-24) + "px";
        this.textArea.style.height = (pw.contentElem.offsetHeight-
          (this.cPanelDiv.offsetHeight + 26)) + "px";
      }
      else if (type == 'tofront') {
        this.setAsTopItem();
      }
    },
    
    //-------------------------------------------
    setAsTopItem : function (evt) {
      this.focusedAt = new Date().getTime();
    },

    //-------------------------------------------
    textAreaKeyDownHandler : function (evt) {
      if (!evt)
        evt = window.event;
      var code = 0;
      
      if(evt.keyCode != 0)
        code = evt.keyCode;
      else if(evt.which != 0)
        code = evt.which;
      else if(evt.charCode != 0)
        code = evt.charCode;
      
      var map = {9: true, 13: true, 36: true, 35: true};
      
      if (map[code]) {
        if (evt.preventDefault)
          evt.preventDefault();
        if (evt.stopPropagation)
          evt.stopPropagation();
        
        var start = DomUtils.getSelectionStart(this.textArea),
        end = DomUtils.getSelectionEnd(this.textArea);
        var s1 = this.textArea.value.substring (0, start),
        s2 = this.textArea.value.substring (end);
        
        var insert = "";
        switch (code) {
          case 9: // tab
            insert = "  ";
            start += insert.length;
            end = start;
            break;
          case 13: // enter
            insert = "\n";
            var a = s1.split("\n");
            if (a.length > 0) {
              var t = a[a.length-1];
              var i = 0, c;
              while (t.charAt(i) == ' ') {
                insert += ' ';
                i++;
              }
            }
            start += insert.length;
            end = start;
            break;
          case 35: // end
            var a = s2.split("\n");
            if (a.length > 0) {
              var t = a[0];
              start += t.length;
              end = start;
            }
            
            break;
          case 36: // home
            var a = s1.split("\n");
            if (a.length > 0) {
              var t = a[a.length-1];
              start -= t.length;
              end = start;
            }
            break;
        }
        this.textArea.value = s1 + insert + s2;
        this.textArea.setSelectionRange(start,end);
      }
    },
    
    //-----------------------------------------
    nameSelectHandler : function () {
      this.getDataBasedOnGui ();
    },
    
    //----------------------------------
    loadJsFiles : function (files, callback, defaultPath) {
      var count = 0;
      var loadedCount = 0;
      
      for (var i=0; i<files.length; i++) {
        (function (which) {
            var url = defaultPath + files[which] + ".js";
            // if (!JsSnippetEditor.jsLoaded[url])
            {
              var s = document.createElement('script');
              s.src = url + "?" + Math.floor(Math.random()*200);
              count++;
              s.onload = function () {
                JsSnippetEditor.jsLoaded[url] = true;
                loadedCount++;
                if (count === loadedCount)
                  callback(files, count);
              };
              document.body.appendChild(s);
            }
          })(i);
      }
      if (count == 0)
        callback(files, count);
    },

  //-----------------------------------------
  runButtonHandler : function () {
    var result = null, self = this;
    var snippet = JsParser.parseSnippet(this.textArea.value);
    if (snippet.error) {
      Logger.write(snippet.error);
      return;
      }
    this.textArea.value = JsParser.getFullSnippetString(snippet);

    if (snippet.files.length!=0) {
      this.loadJsFiles(snippet.files, function (f,c) {
          self.evaluateCode(snippet);
        },
      JsSnippetEditor.remoteSaveData.url + "js/library/");
    }
    else {
      this.evaluateCode(snippet);
    }
  },
  
  //--------------------------------------------
  saveButtonHandler : function () {
    var n = this.nameSelectElem.value;
    if (n == "_new_") {
      n = this.nameInputElem.value;
      if (n == "") {
        alert ("please supply a name");
        return;
      }
    }
    JsSnippetEditor.updateByName (n, this.textArea.value);
    this.setNameInputVisibility();
    },
  
  //---------------------------------------------
  deleteButtonHandler : function () {
    JsSnippetEditor.deleteByName (this.nameSelectElem.value); 
    },

  hiliteLine : function (lineNo) {
    var snippet = 
    JsParser.parseSnippet(this.textArea.value);
  },
  
  //---------------------------------------------
  addHereDocVar : function (s, contents) {
    var snippet = JsParser.parseSnippet(this.textArea.value);
    if (snippet.error) {
      Logger.write (err);
      return;
    } else {
      var hd = snippet.hereDocs, l = hd.length;
      var count = 0, lastIndex = -1;
      var sa = s.split('*');
      if (sa.length == 2) {
        while (true) {
          found = false;
          var name = sa[0] + count + sa[1];
          for (var i=0; i<l; i++) {
            var item = hd[i];
            if(item.name == name) {
              lastIndex = i;
              found = true;
              break;
            }
          }
          if (!found) {
            if (lastIndex != -1)
              hd.splice (lastIndex+1, 0, {name: name, lines: contents});
            else
              hd.push ({name: name, lines: contents});
            
            this.textArea.value = JsParser.getFullSnippetString(snippet);
            return;
          }
          count++;
        }
      }
    }
  }
  },
  
  //----------------------------------------
  listeners : [],
  
  namedItems : [],
  
  setData : function (data) {
    this.namedItems = data;
    this.alertListeners();
  },
  
  //-----------------------------------------------
  // must have function "editorListUpdated"
  addListener : function (item) {
    for (var i=0; i<this.listeners.length; i++)
      if (this.listeners[i] == item)
    return;
    this.listeners.push(item);
  },
  
  //-----------------------------------------------
  removeListener : function (item) {
    var newList = [];
    for (var i=0; i<this.listeners.length; i++)
      if (this.listeners[i] != item)
    newList.push(this.listeners[i]);
    this.listeners = newList;
  },
  
  //-----------------------------------------------
  // must have function "editorListUpdated"
  alertListeners : function () {
    for (var i=0; i<this.listeners.length; i++)
      if (this.listeners[i].editorListUpdated)
    this.listeners[i].editorListUpdated();
  },
  
  //----------------------------------------
  getByName : function (nameOfItem) {
    for (var i=0; i<this.namedItems.length; i++) {
      if (this.namedItems[i].name == nameOfItem)
        return this.namedItems[i];
    }
    return null;
  },
  
  //----------------------------------------
  updateByName : function (nameOfItem, js) {
    var item = this.getByName(nameOfItem);
    if (item) {
      item.js = js;
    }
    else {
      item = {
        js: js,
        name: nameOfItem
      };
      this.namedItems.push(item);
      this.alertListeners ();
    }
    JsonPClient.send(
      JsSnippetEditor.remoteSaveData.url + "saveSnippet",
      {
        user: JsSnippetEditor.remoteSaveData.user,
        group: JsSnippetEditor.remoteSaveData.group,
        password: JsSnippetEditor.remoteSaveData.pw,
        snippet: item
      },
      function (response) {
        if (response.snippetNum)
          item.num = response.snippetNum
      }
    );
  },
  
  //----------------------------------------
  deleteByName : function (nameOfItem) {
    var list = [], count = 0;
    
    for (var i=0; i<this.namedItems.length; i++) {
      if (this.namedItems[i].name == nameOfItem) {
        this.namedItems[i].js = null;
        JsonPClient.send(
          JsSnippetEditor.remoteSaveData.url + "saveSnippet",
          {
            user: JsSnippetEditor.remoteSaveData.user,
            group: JsSnippetEditor.remoteSaveData.group,
            password: JsSnippetEditor.remoteSaveData.pw,
            snippet : this.namedItems[i]
          },
          function(){}
        );
      }
      else {
        list.push (this.namedItems[i]);
      }
    }
    this.namedItems = list;
    this.alertListeners ();
  },
  
  
  //----------------------------------------
  getNames : function () {
    var a = [];
    for (var i=0; i<this.namedItems.length; i++)
      a.push (this.namedItems[i].name);
    return a;
  },
  
  //----------------------------------------
  findChars: function (charList, string) {
    var out = [];
    for (var i=0; i<charList.length; i++) {
      var c = charList[i];
      var index = 0;
      while ((index = string.indexOf(c, index)) != -1) {
        out.push({which: c, index: index});
        index++; 
        
      }
    } 
    out.sort(function(a,b) {
        return a.index - b.index;
      });
    return out;
  },

  //----------------------------------------
  isIntegerString: function(s) {
    var l = s.length;
    for (var i=0; i<l; i++) {
      if(!JsParser.isDigit(s[i]))
        return false;
    }
    return true;
  },

  //----------------------------------------
  makeVariableByPath: function (s, value) {
    try {
      var path = [];
      s = '{' + s + '}';
      var chars = JsSnippetEditor.findChars("[].{}", s);
      var numSpans = chars.length-1;
      
      for (var i=0; i<numSpans; i++) {
        var prev = chars[i], next = chars[i+1];
        var type = 'error';
        if (prev.which == '[') {
          if(next.which == ']')
            type = 'arraymember';
        }
        else if (prev.which == '.' || prev.which == '{') {
          type = 'member';
        }
        if (type != 'error') {
          var varName = s.substring(prev.index+1, next.index);
          var isInt = false, isPush = false;
          if (type == 'arraymember') {
            var quotes = JsSnippetEditor.findChars("'\"", varName);
            if (quotes.length == 2) {
              varName = varName.substring(quotes[0].index+1, quotes[1].index+1);
            }
            else if (JsSnippetEditor.isIntegerString(varName)) {
              isInt = true;
            }
          }
          
          if (varName.length == 0) {
            if(type=='arraymember') {
              isInt = true;
              isPush = true;
            }
            else {
              continue;  
            }
          }
          path.push({
              name: varName,
              type: type,
              isInt: isInt,
              isPush: isPush
            });
        }
      }
      var curr = window, item;
      
      for (var i=0; i<path.length-1; i++) {
        item = path[i];
        if (i==0 && item.name == 'g') {
          if (JsSnippetEditor.sharedVariables == null)
            JsSnippetEditor.sharedVariables = {};
          curr = JsSnippetEditor.sharedVariables;
        }
        else {
          if (curr[item.name]) {
            curr = curr[item.name];
          }
          else {
            var next = path[i+1];
            if(item.isPush && curr.length !== undefined)
              curr = curr[curr.length] = (next.isInt)?[]:{};
            else
              curr = curr[item.name] = (next.isInt)?[]:{};
          }
        }
      }
      item = path[path.length-1]
      if (item.isPush && curr.length !== undefined)
        curr[curr.length] = value;
      else
        curr[item.name] = value;
    }
  catch (e) {
    Logger.write(e + "bad here doc");
  }
}
};



// init ------------------------
(function (name) {
  var module = window[name];
  var constructor = window[name] = module.constructor;
  for (var j in module)
    constructor[j] = module[j];
  })("JsSnippetEditor");
