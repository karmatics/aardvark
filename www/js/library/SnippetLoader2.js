(function (fileList, synchronous) {
  if (fileList) {
    var h = document.body;
    var ensureFresh = "?" + Math.round(Math.random()*100);
    for (var i=0; i<fileList.length; i++) {
      var item = fileList[i];
      var a = item.files.split (",");
      if (item.type == "css") {
        for (var j=0; j<a.length; j++) {
          var name = a[j], link = document.createElement('link');
          var url = item.path + "/" + name + ".css" + ensureFresh;
          if (synchronous) {
            document.write ("<link href='" + url + "' type='text/css' rel='stylesheet' />");
            }
          else {
            link.setAttribute('rel', 'stylesheet');
            link.type = 'text/css';
            link.href = item.path + "/" + name + ".css" + ensureFresh;
            h.appendChild(link);
            }
          }
        }
      else {
        for (var j=0; j<a.length; j++) {
          var name = a[j];
          var url = item.path + "/" + name + ".js" + ensureFresh;
          if (synchronous) {
            document.write ("<script src='" + url + "'></script>");
            }
          else {
            var scriptElem = document.createElement('script');
            scriptElem.src = url;
            h.appendChild(scriptElem);
            }
          }
        }
      }
    }
  var count = 1;
  var timer = function () {
        if (window.JsSnippetEditor && window.DomGenerator && window.GeneralUtils && window.NamedItemList && window.PopupWindow && window.Callbacks && window.RemoteStorage && document.body) {
          new JsSnippetEditor();
        }   
     else {
        setTimeout (timer, 40);
        count++;
        if (count > 100)
          alert(count);
        }
    };  
  setTimeout (timer, 30);  
  })([
    {
    path: "http://localhost/js/rob_library",
    files: "GeneralUtils,DomGenerator"
    },
    {
    path: "http://localhost/tools/rob_tools_library",
    files: "NamedItemList,PopupWindow,Callbacks,JsSnippetEditor,Logger,RemoteStorage"
    },
    {
    type: "css",
    path: "http://localhost/tools/rob_tools_library/includes",
    files: "PopupWindow"
    }   
  ]);
  