(function () {

var Modules = [
  {
  name: "PopupWindow",
  dependencies: [
    "Callbacks",
    "DomUtils",
    "DomGenerator",
    "NamedItemList",
    "Cookie"
    ]
  }
 ];
 
for (var i=0; i<Modules.length; i++) {
  var item = Modules[i];
  var tmp = window[item.name];
  var module = window[item.name] = tmp.constructor;
  for (var j in tmp)
    module[j] = tmp[j];
  var dep = item.dependencies;
  for (var j=0; j<dep.length; j++)
    module.prototype[dep[j]] = window[dep[j]];
  module.prototype.classObject = module;
  }
 })();