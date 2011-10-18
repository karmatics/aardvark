CssUtils = {
  
  applyStyleData : function (cssArray) {
    var cssNode = document.createElement("style");
    cssNode.setAttribute("type", "text/css");
    cssNode.setAttribute("media", "screen");
    
    var isIE = (document.all!==undefined);
    
    if (!isIE) { 
      for (var i=0; i<cssArray.length; i+=2)
        cssNode.appendChild(document.createTextNode(cssArray[i] + " {" + cssArray[i+1] + "}"));
    }
    else {
      for (var i=0;i<cssArray.length;i+=2) {
        var a = cssArray[i].split(",");
        for (var j=0; j<a.length; j++) {
          cssNode.addRule(a[j], cssArray[i+1]);
        }
      }
    }
    document.getElementsByTagName("head")[0].appendChild(cssNode);
  }
};

//-------------------------------------------
function cssConvert (inputString) {
  var out = [];
  var index = 0;
  var inComments = false;
  
  var getStringTilComment = function () {
    var i = inputString.indexOf("/*", index);
    if (i==-1) {
      out.push(inputString.substring(index));
      index = -1;
    }
    else {
      out.push(inputString.substring(index, i));
      index = i+2;
    }
  }
  
  var getCloseComment = function () {
    var i = inputString.indexOf("*/", index);
    if (i==-1) {
      index = -1;
      // error?
    }
    else {
      index = i+2;
    }
  }
  
  
  while (index != -1) {
    getStringTilComment();
    if (index == -1)
      break;
    getCloseComment();
  }
  
  var s = out.join(' ');
  var a = s.split(new RegExp("[ \\t\\n\\x0B\\f\\r]"));
  var a3 = [];
  for (var i=0; i<a.length; i++)
    if(a[i].length > 0)
  a3.push(a[i]);
  
  a = a3.join(' ');
  var state = 0;
  
  var rules = [], currRule = {selector: '', declaration: ''};;
  
  var appendRule = function (s) {
    while (s[0] == ' ')
      s = s.substring(1);
    while (s[s.length-1] == ' ')
      s = s.substring(0, s.length-1);
    rules.push(s);
  };
  
  
  for (i=0; i< a.length; i++) {
    var c = a[i];
    
    switch (state) {
      case 0: {
        if (c == "{")
          state = 1;
        else
          currRule.selector += c;
        break;
      }
      case 1: {
        if (c == "}") {
          appendRule(currRule.selector);
          appendRule(currRule.declaration);
          currRule = {selector: '', declaration: ''};
          state = 0;
        }
        else
          currRule.declaration += c;
        break;
      }
      case 2: { // handle comments?
        break;
      }
    }
  }
  return rules;
}
