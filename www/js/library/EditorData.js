EditorData = {

//----------------------------------------
listeners : [],
namedItems: [],

setData: function (data) {
    if (typeof (data) == "string")
      data = eval(data);
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
updateByName : function (nameOfItem, js, mode) {
  var item = this.getByName(nameOfItem);
  if (item) {
    item.js = js;
    }
  else {
    this.namedItems.push({
        js: js,
        mode: mode,
        name: nameOfItem
        });
     this.alertListeners ();
     }
  },

//----------------------------------------
deleteByName : function (nameOfItem) {
  var list = [], count = 0;
  
  for (var i=0; i<this.namedItems.length; i++) {
    if (this.namedItems[i].name != nameOfItem)
        list.push (this.namedItems[i]);
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
  
 saveToRemoteStorage : function () {
  if (window.snippetData) {
    RemoteStorage.setParams (snippetData[0], snippetData[1]);
    RemoteStorage.putData(GeneralUtils.objectToJs (this.namedItems), false, snippetData[2],
      function (response) {
        Logger.write(response.status);
        });
    }
 }
};

