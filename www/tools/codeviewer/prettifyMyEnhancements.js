PrettyCode = {

//----------------------------------------------
// XHR callback
// load the file into the container
insertCode : function (string, params, args) {
  var container = document.getElementById (args.elemId);
  var prettyOutput = prettyPrintOne (string.replace(new RegExp("<", "g"), '&lt;')); 
  var stringArray = prettyOutput.split (PrettyCode.splitString), outString = "";
  var indentArray = [];
  var indentString = "&nbsp; ";
  var indentStringLen = indentString.length;
  var nLines = stringArray.length, i;
  
  for (i=0; i<nLines; i++) {
    var s = stringArray[i];
    var index = 0; 
        
    while (s.indexOf(indentString, index) == index)
        index += indentStringLen;
    if (index)
        stringArray[i] = s.substring (index);
    indentArray[i] = index / indentStringLen;
    }
  for (i=0; i<nLines; i++) {
    if (i%2 ==0)
      outString += "<tr class='oddrow'>"
    else
      outString += "<tr>"
    outString += "<td class='lineno'>" + (i+1) + "</td><td  class='code'  style='padding-left:" + (40+indentArray[i]*15) + "px'>" + stringArray[i] + "<br></td></tr>"; 
    }
  container.innerHTML = "<table class='code'><tbody>" + outString + "</table>";
  },

//----------------------------------------------
// remove or add line numbers
checkboxChanged : function () {
  // todo: clean this crap with id's up
  var cb = document.getElementById("linenocheckbox");
  var a = document.getElementsByTagName ("TD");
  var count = 1;
  if (cb.checked==true) {
    for (var i=0; i<a.length; i++)
      if (a[i].className == "lineno")
        a[i].innerHTML = "";
    }
  else {
    for (var i=0; i<a.length; i++)
      if (a[i].className == "lineno")
        a[i].innerHTML = count++;
    }
  },

//----------------------------------------------
selectFile : function (val) {
  PrettyCode.xhrGet (val, PrettyCode.insertCode, {}, {elemId: "codediv"});
  },

//----------------------------------------------
xhrGet : function (url, callbackFunction, params, callbackParams, errorFunction) {
  var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");
  request.open("GET", url, true);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
        if (request.status == 200) {
          if (request.responseText) {
            callbackFunction(request.responseText, params, callbackParams);
            }
        }
      else {
          if (request.responseText && errorFunction) {
            errorFunction(request.responseText, params, request.status);
            }
          }
      }
    };
  var postString = "";
  
  if (typeof(params) == "string")
      postString = params;
  else {
      for (var i in params)
        postString += i + "=" + escape (params[i]) + "&";
      }
  request.send(postString);
  }
}

