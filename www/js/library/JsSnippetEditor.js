JsSnippetEditor = {
  jsLoaded : [],
  globals : {},

  constructor: function (remoteSaveData) {
    if (remoteSaveData) {
      JsSnippetEditor.remoteSaveData = remoteSaveData;
      JsonPClient.send(
          remoteSaveData.url + "jsonP", 
            {
            handlerName: "getSnippets",
            user: remoteSaveData.user,
            snippetSet: remoteSaveData.group,
            password: remoteSaveData.pw
            },
            function (response){
               if(response){
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
    DomUtils.addPropertyToElementAndChildren (this.window.element, "isAardvark", true);
    this.populateNameMenu(JsSnippetEditor.selectedItem);
    this.getDataBasedOnGui ();
    this.setNameInputVisibility ();
    JsSnippetEditor.addListener(this);
    this.window.show ();
    
    var f = function (s) {
        var log = function (x, y, z) {
          Logger.write (x, y, z);
        };
        var g = JsSnippetEditor.globals;
        with (DomGenerator) {
          try { 
            var x = true;
          }
          catch (e) {
            JsSnippetEditor.processException(e);        
          }
        }
      };
    var a = f.toString().split("var x = true;");
    JsSnippetEditor.fs = {
      part1: a[0],
      part2: a[1],
      offset: a[0].split('\n').length
    };
    },

onerrorFunction : function (error, file, lineNo) {
    //if (file == 'document.location.href') {
      Logger.write("error, line " + (lineNo-JsSnippetEditor.fs.offset) + "\n" + error);
      //}
 },


 processException : function (e) {
    if (Logger != null) {
      if (e.stack) {
        var a = e.stack.split('\n');
        e.stack = [];
        for (var i=0; i<a.length; i++) {
          if(a[i].indexOf('evaluateCode')!= -1) 
            break;
          e.stack.push(a[i]);
        }
      }
      Logger.write (e);
    }
 }, 
 
 prototype : {
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
          //if (!JsSnippetEditor.jsLoaded[url])
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
    var result = null, evString, self = this;

    var a = this.textArea.value.split('\n');
    var files = [];
    for (var i=0; i<a.length; i++) {
      var s = a[i];
      if (s[0] == '#') {
        files.push(s.substring(1));
        }
      else {
        a.splice(0, i);
        break;
        }
      }
    evString = a.join('\n');
    
    var indentStr = '                             ';

    function makeIndent(n) {
     return indentStr.substring(0,n*2);
    };

    JsParser.processJs(evString);
    var s = '';
    for (var i=0; i<JsParser.lines.length; i++)
      s += makeIndent(JsParser.lines[i].newIndent) + JsParser.lines[i].string + '\n';
    
    this.textArea.value = s;
    
    if (files.length!=0) {
      this.loadJsFiles(files, function (f,c) {
          self.evaluateCode(evString);
        },
      JsSnippetEditor.remoteSaveData.url + "js/library/");    
    }
    else {
      this.evaluateCode(evString);
    }
  },
  
  evaluateCode : function(code) {
    var s = document.createElement('script');
    s.appendChild(document.createTextNode(
          '(' + 
          JsSnippetEditor.fs.part1 + 
          code +
          JsSnippetEditor.fs.part2 + 
          ')();'          
          ));
    window.onerror = JsSnippetEditor.onerrorFunction;
    document.body.appendChild(s);
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
    JsSnippetEditor.remoteSaveData.url + "jsonP",
      {
       handlerName: "saveSnippet",
       user: JsSnippetEditor.remoteSaveData.user,
       snippetSet: JsSnippetEditor.remoteSaveData.group,
       password: JsSnippetEditor.remoteSaveData.pw,
       snippet : item
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
       JsSnippetEditor.remoteSaveData.url + "jsonP",
        {
         handlerName: "saveSnippet",
         user: JsSnippetEditor.remoteSaveData.user,
         snippetSet: JsSnippetEditor.remoteSaveData.group,
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
  }
  };
 
// init ------------------------
(function (name) {
  var module = window[name];
  var constructor = window[name] = module.constructor;
  for (var j in module)
    constructor[j] = module[j];
  })("JsSnippetEditor");

  