LocalizeEditor = {
  list: null,
  lang: "en",
  langs: ["en", "es", "fr"],

  rowClicked : function () {
    var d = LocalizeEditor.getByElement(this);
    if (d) {
      if (d.item.expandoBox)
        LocalizeEditor.closeExpandoBox(d.item);
      else
        LocalizeEditor.openExpandoBox(d.item, d.sublist);
      }
    },
    
  getIndex : function (item, sublist) {
    for (var i=0; i<sublist.length; i++)
      if (sublist[i] == item)
        return i;
    return -1; 
    },
    
  getAncestorOfTagType : function (e, type) {
    while (e.parentNode && e.tagName != type)
      e = e.parentNode;
    return e; 
    },
 
  getByElement : function (elem) {
    var tr = this.getAncestorOfTagType(elem, "TR");
    var tbody = this.getAncestorOfTagType(elem, "TBODY");
    
    for (var i in this.list) {
      var sublist = this.list[i];
      if (sublist && sublist.tbody == tbody) {
        for (var j=0; j<sublist.length; j++) {
          if (tr == sublist[j].tr)
            return {sublist: sublist, item: sublist[j]};
          }
        }
      }
    },
    
  closeExpandoBox : function (item) { 
    if (item.tweener) {
      item.tweener.isReversed = true;
      item.tweener.run();
      }
    },

  deleteItem : function (item, sublist, isFinal) {
    if (item.isNew) {
      sublist.splice (this.getIndex(item, sublist), 1);    
      if (item.expandoBox)
        this.closeExpandoBox(item);
      sublist.tbody.removeChild(item.tr);
      item.expandoBox.firstChild.firstChild.firstChild.style.backgroundColor = "#b44";
      item.tr.style.backgroundColor = "#faa";
      return;
      }
    else if (confirm("Really delete item $" + item.name + "?")) {
      sublist.splice (this.getIndex(item, sublist), 1);    
      item.expandoBox.firstChild.firstChild.firstChild.style.backgroundColor = "#b44";
      item.tr.style.backgroundColor = "#faa";
      
      this.setChanged (item);
      item.isDeleted = true;
      if (item.expandoBox)
        this.closeExpandoBox(item);
      }
    },

  openExpandoBox : function (item, sublist) {
    var table = this.getAncestorOfTagType(item.tr, "TABLE");
    var tas = [], innerTb;
    var expandoDiv, containerDiv;
    var self = this;
    with (DomGenerator) {
      item.expandoBox = TR ({className: "expando"},
            TD ({colSpan: "2", className: "expando"},
              containerDiv = DIV ({className: "expandoContainer", style: {width: (table.offsetWidth-5)+"px", height: "0"}},
                expandoDiv = DIV ({className: "expando", style: {visibility: "hidden", width: (table.offsetWidth-26)+"px"}},
                  TABLE (
                    TBODY (
                      TR(
                        TD({style: {width: "110px", verticalAlign: "top"}},
                            item.nameInput = INPUT({style: {width: "80px"}, type: "text", className: "expando", value: item.name})),
                        TD({style: {width: (table.offsetWidth-200) + "px"}},
                          TABLE(
                            innerTb = TBODY()
                            )
                          ),
                         TD({style: {width: "80px", verticalAlign: "bottom"}}, 
                          DIV ({className: "delete",  onclick: function (){self.deleteItem(item, sublist, false)}}, "X"),
                          INPUT({style: {width: "70px"}, onclick: function (){
                              self.saveItemChanges(item, sublist, tas);
                              }, type: "button", value: "ok"}),
                          BR (),
                          INPUT({style: {width: "70px"}, onclick:function (){
                            self.closeExpandoBox(item);
                            }, type: "button", value: "cancel"})
                          )
                        )
                      )
                    )
                  )
                )
              )
            );
              
        for (var i=0; i<this.langs.length; i++) {
          innerTb.appendChild (
            TR(
              TD({className: "tatitle"}, this.langs[i]),
              TD(
              tas[i] = TEXTAREA ({spellcheck:((i==0)?"true":""), 
                  style: {width: (table.offsetWidth-260)+"px"}, value: item[this.langs[i]]})
                )
              ))
          };
      DomUtils.insertAfter (item.expandoBox, item.tr);
      if (item.tweener) {
        item.tweener.run();
        }
      else {
        item.tweener = new Tweener (
            function (tweener, state){
                self.openTweenerCallback(item, containerDiv, expandoDiv, tweener, state);
                },
              250,
              25,
              {
                h: [0, expandoDiv.offsetHeight+10],
                m: [-expandoDiv.offsetHeight, 0]
              },
            Tweener.tweenFuncs.easeInQuad
            );
        item.tweener.run();
        }
      }
    },

  openTweenerCallback : function (item, containerElem, expandoDiv, tweener, state) {
    switch (state) {
      case "initial":
        if (tweener.isReversed) {
          }
        else {
          expandoDiv.style.visibility = '';
          }
        expandoDiv.style.position = 'relative';
        expandoDiv.style.top = tweener.values.m + "px";
        break;
      case "intermediate":
        expandoDiv.style.top = tweener.values.m + "px";
        containerElem.style.height = tweener.values.h + "px";
        break;
      case "final":
      case "stoppedearly":
        expandoDiv.style.position = '';
        if (tweener.isReversed) {
          item.expandoBox.parentNode.removeChild (item.expandoBox);
          delete item.expandoBox;
          delete item.tweener;
          if (item.isDeleted)
            item.tr.parentNode.removeChild(item.tr);
          } 
        else {
          expandoDiv.style.position = '';
          expandoDiv.style.top = "";
          containerElem.style.height = "";
          }
        break;
      }
    },

  setChanged : function (item) {
    if (item) {
      item.changed = true;
      if (item.isNew)
         delete item.isNew;
      }
    if (!this.saveButton) {
      var self = this;
      with (DomGenerator) {
        this.saveButton = DIV ({className:"saveform"},
          INPUT ({type:"button", value:"save changes",
              onclick: function () {
                self.submitChangesToServer();
                }})
        );
       document.body.appendChild (this.saveButton);
       }
      }
    },
    
  processSavedResponse : function (text) {
    if (text.indexOf ("success") != -1) {
      if (this.saveButton) {
        this.saveButton.parentNode.removeChild (this.saveButton);
        delete this.saveButton;
        }
      for (var i in this.list) {
        var sublist = this.list[i];
        for (var j=0; j<sublist.length; j++) {
          var item = sublist[j];
          if (item.changed) {
            delete item.changed;
            this.rebuildItemRow(item);
            }
          }
        }
      }
    else {
      Logger.write(text);
      }
    },
    
  rebuildItemRow : function (item) {
    var oldTr = item.tr;
    this.buildRow (item);
    oldTr.parentNode.replaceChild (item.tr, oldTr);
    },  
    
  submitChangesToServer : function () {
/*    var d = document.createElement("textarea");
    d.value = this.buildJsonString();
    d.style.width = "500px";
    d.style.height = "500px";
    document.body.appendChild(d); 
    document.title = d.value.length + ""; */
    
    ServerComm.xhrPost ("manage_localization.php",
        {newdata: this.buildJsonString()},
        function (text) { LocalizeEditor.processSavedResponse(text); });
    },

  saveItemChanges: function (item, sublist, textAreaElems) {
    for (var i=0; i<textAreaElems.length; i++) {
      if (item[this.langs[i]] != textAreaElems[i].value) {
        item[this.langs[i]] = textAreaElems[i].value;
        this.setChanged (item);
        }
      }
    if (item.name != item.nameInput.value) {
     item.name = item.nameInput.value;
     this.setChanged (item);
     }
    if (item.changed) {
      this.rebuildItemRow(item);
      this.closeExpandoBox(item);
      }
    },
    
  buildTable : function (name, sublist) {
    with (DomGenerator) {
      var t, d = DIV ({className: 'tablecontainer'},
            DIV ({className: 'title'}, name),
            t = TABLE ({className:"pretty"},
              sublist.tbody = TBODY (
                TR (
                  TH (
                    "php variable"
                  ),
                  TH (
                    "string (" + this.lang + ")"
                  )
                )
              )
            )
          );
      sublist.container = d;
      for (var j=0; j<sublist.length; j++) {
        var item= sublist[j];
        sublist.tbody.appendChild(this.buildRow(item));  
        }
      var self = this;
      sublist.tbody.appendChild(
        TR (
            TD ({colSpan: "2", className: "bottom"}, 
              DIV ({onclick: function () {self.addNewItem (sublist);},
                  className: "add"}, "+")
            )
          )
        );  
      return d;
      }
    },
    
  addNewItem: function  (sublist) {
    var item = {name: "", en: "", es: "", fr: "", isNew: true};
    sublist.push (item);
    var tr = this.buildRow(item);
    sublist.tbody.insertBefore (tr, sublist.tbody.lastChild);
    this.openExpandoBox (item, sublist, sublist.length-1);
    },

  buildRow : function (item) {
    with (DomGenerator) {
      var tr = TR ({className: "clickable" + ((item.changed)?" modified":"")},
            TD ({className: "leftcol"},
              item.name
            ),
            TD ({className: "rightcol"},
              item[this.lang]
            )
          )
      tr.onclick = this.rowClicked;
      item.tr = tr;
      return item.tr;
      }  
    },

  buildAllTables : function(list, lang) {
    this.list = list;
    this.lang = lang;
    var c = document.getElementById("container");
    var t;
    with (DomGenerator) {
      for (var i in this.list) {
        var sublist = this.list[i];
        if (sublist) {
          var d = this.buildTable(i, sublist);
          c.appendChild(d);
          //if (t.offsetWidth < 550) {
          //  t.style.width = "550px";
          //  }
          }
        }
      }
    },

  buildJsonString: function() {
    var s = "{\n";
    for (var i in this.list) {
      var sublist = this.list[i];
      s += " \"" + i + "\": [\n"
      for (var j=0; j<sublist.length; j++) {
        var item = sublist[j];
        s += "  {\n  \"name\": \"" + item.name + "\",\n";
        s += "  \"en\": \"" + SharedWMITools.escapeStringForJson(item.en) + "\",\n";
        s += "  \"es\": \"" + SharedWMITools.escapeStringForJson(item.es) + "\",\n";
        s += "  \"fr\": \"" + SharedWMITools.escapeStringForJson(item.fr) + "\"\n  },\n";
        } 
      s = s.substring(0, s.length-2) + "\n ],\n";
      }
    s = s.substring(0, s.length-2) + "\n}";
    return s;
    },
    
  convertLocalizeFuncs : function (clearFirst, whichList, string) {
    var newList = LocalizeConverter.buildListFromLocalizeFunctions (string);
    this.updateSublist (whichList, newList, clearFirst);
    },

  updateSublist : function (which, newList, clearFirst) {
    var orig = null, sublist = this.list[which];
    if (sublist == null) {
      sublist = this.list[which] = newList;
      }
    else {
      orig = sublist.container;
      if (clearFirst) {
        var tb = sublist.tbody;
        sublist = LocalizeEditor.list["_filters"] = newList;
        sublist.tbody = tb;
        sublist.container = orig;
        }
      else {
        for (var j=0; j<newList.length; j++)
          sublist.push(newList[j]);
        }
      }
    var newTable = this.buildTable (which, sublist);
    if (orig)
      orig.parentNode.replaceChild (newTable, orig);
    else
      document.getElementById("container").appendChild (newTable);
    this.setChanged(null);
    }
};
