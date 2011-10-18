var ServerComm = {
  
  //--------------------------------------------
  objectToJs : function (o, stack, limit, html) {
    try {
      if (stack == null)
        stack = [];
      if (limit == null)
        limit = 5;    
      var s;
      var count = 0, i;
      var indentString = "";
      for (i=0; i<stack.length; i++) {
        indentString += " ";
      }
      
      var isArray = true;
      for (i in o) {
        if (o.hasOwnProperty(i)) {
          if (parseInt(i) != count) {
            isArray = false;
            break;
          }
          count++;
        }
      }
      
      if (isArray && (!o || o.length == null || o.length != count))
        isArray = false;
      
      var leadBrace, trailingBrace;
      if (isArray) {
        leadBrace = " [";
        trailingBrace = "]";
      }
      else {
        leadBrace = " {";
        trailingBrace = "}";
      }
      
      s = leadBrace + "\n";
      
      for (i in o) {
        if (o.hasOwnProperty(i)) {
          objName = ((isArray) ? "" : ('"'+ i + '" : '));
          //if (i.charAt(0) != '_') 
          {
            switch (typeof(o[i])) {
              case "function":
              s += indentString +  objName + "\"(function)\",\n";
              break;
              case "object":
              if (stack.length > limit)
                s += indentString + objName + "\"(too deeply nested)\",\n";
              else if (o[i] == null)
                s +=  indentString + objName + "null,\n";
              else if (o[i].tagName)
                s +=  indentString + objName + "\"(" + o[i].tagName + " element)\",\n";
              else {
                var found = false;
                for (var m=0; m<stack.length; m++) {
                  if (o == stack[m]) {
                    s +=  indentString + objName + "\"(object is in stack)\",\n";
                    found = true;
                    break;
                  }
                }
                if (found == false) {
                  stack.push(o);
                  s += indentString + objName + this.objectToJs (o[i], stack, limit) + ",\n";
                  stack.pop();
                }
              }
              break;
              case "string": {
                var string = o[i];
                var m = {
                  '\b': '\\b',
                  '\t': '\\t',
                  '\n': '\\n',
                  '\f': '\\f',
                  '\r': '\\r',
                  '"' : '\\"',
                  '\\': '\\\\'
                };
                if (html) {
                  m['<'] = "&lt;";
                }          
                s += indentString + objName + '"';
                var len = string.length;
                for (var i=0; i<len; i++) {
                  var c = string.charAt(i);
                  if (m[c])
                    s += m[c];
                  else
                    s += c;
                }
                s += "\",\n";
              }
              break;
              default:
              s += indentString + objName + o[i] + ",\n";
            }
          }
        }
      }
      s = this.stripComma(s) + indentString + trailingBrace;
      return s;
    }
    catch (e) {
      return "exception!"
    }
  },
  
  
  //--------------------------------------------
  moduleToString : function (o) {
    var s;
    var count = 0, i;
    
    var isArray = true;
    for (i in o) {
      if (o.hasOwnProperty(i)) {
        if (parseInt(i) != count) {
          isArray = false;
          break;
        }
        count++;
      }
    }
    
    if (isArray && (!o || o.length == null || o.length != count))
      isArray = false;
    
    var leadBrace, trailingBrace;
    if (isArray) {
      leadBrace = "[";
      trailingBrace = "]";
    }
    else {
      leadBrace = "{";
      trailingBrace = "}";
    }
    
    s = leadBrace + "\n";
    
    for (i in o) {
      if (o.hasOwnProperty(i)) {
        objName = ((isArray) ? "" : (i + ": "));
        {
          switch (typeof(o[i])) {
            case "function":
            s += objName + o[i].toString() + ",\n";
            break;
            case "object":
            if (o[i] == null)
              s += objName + "null,\n";
            else {
              s +=  objName + this.moduleToString(o[i]) + ",\n";
            }
            break;
            case "string": {
              var string = o[i];
              var m = {
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"' : '\\"',
                '\\': '\\\\'
              };
              s += objName + '"';
              var len = string.length;
              for (var i=0; i<len; i++) {
                var c = string.charAt(i);
                if (m[c])
                  s += m[c];
                else
                  s += c;
              }
              s += "\",\n";
            }
            break;
            default:
            s += indentString + objName + o[i] + ",\n";
          }
        }
      }
    }
    s = this.stripComma(s) + trailingBrace;
    return s;
  },
  
  //--------------------------------------------
  stripComma : function (s) {
    var i = s.length-1, count = 0;
    
    while (s.charAt(i) == '\n') {
      i--;
      count++;
    }
    if (s.charAt(i) == ',')
      s = s.substring (0, i);
    for (i=0; i<count; i++)
      s += "\n";
    return s;
  },
  
  //------------------------------------------------------
  xhrPost : function (url, params, callback) {
    var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (request.status == 200) {
          if (request.responseText)
            callback (request.responseText, params);
        }
        else {
          // if (request.responseText) {
          //   callback (request.responseText, params, request.status);
          // }
        }
      }
    };
    var postString = "";
    
    if (typeof(params) == "string")
      postString = params;
    else {
      for (var i in params)
        postString += i + "=" + encodeURIComponent(params[i]) + "&";
    }
    request.send(postString);
  },
  
  //----------------------------------------------
  xhrGet : function (url, callbackFunction) {
    var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP.3.0");
    request.open("GET", url, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
    request.onreadystatechange = function() {
      if (request.readyState == 4)
        callbackFunction((request.status == 200)?request.responseText:null);
    };
    request.send(null);
  },
  
  //------------------------------------------------
  fetchJsonData : function (
    script,
    input,
    more,
    callback
  ) {
    var callbackData = {
      scriptElem: document.createElement("script"),
      // params: params,
      more: more
    };
    
    for (var i=0; ; i++) {
      var name = "xCallback" + i;
      if (window[name] == null) {
        callbackData.callbackName = name;
        break;
      }
      if (i == 9999) {
        callback ({error: "too many requests at once"}, callbackData.more);
        return;
      }
    }
    callbackData.scriptElem.src = script + "?cc=" + Math.random() + "&callback=" + callbackData.callbackName;
    for (var i in input) {
      var s, item = input[i];
      switch (typeof(item)){
        case 'string':
        s = item;
        break;
        case 'number':
        case 'boolean':
        s = item.toString();
        break;
        case 'object':
        s = encodeURIComponent(JSON.stringify(item));
        break;
        default:
        s = '';
      }
      callbackData.scriptElem.src += "&" + i + "=" + s;
    }
    window[callbackData.callbackName] = function (response) {
      callback (response, callbackData.more);
      document.body.removeChild(callbackData.scriptElem);
      window[callbackData.callbackName] = null;
    };
    document.body.appendChild(callbackData.scriptElem);
  }
};
