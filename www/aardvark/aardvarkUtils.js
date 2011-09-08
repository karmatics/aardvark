aardvark.loadObject ({
//-----------------------------------------------------
setElementStyleDefault : function (elem, bgColor) {
  var s = elem.style;
  s.display = "none";
  s.backgroundColor = bgColor;
  s.borderColor = "black";
  s.borderWidth = "1px 2px 2px 1px";
  s.borderStyle = "solid";
  s.fontFamily = "arial";
  s.textAlign = "left";
  s.color = "#000";
  s.fontSize = "12px";
  s.position = "absolute";
  s.paddingTop = "2px";
  s.paddingBottom = "2px";
  s.paddingLeft = "5px";
  s.paddingRight = "5px";
  },

//-----------------------------------------------------
getPos : function (elem) {
  var pos = {};
  var originalElement = elem;
  var leftX = 0;
  var leftY = 0;
  if (elem.offsetParent) {
    while (elem.offsetParent) {
      leftX += elem.offsetLeft;
      leftY += elem.offsetTop;
      
      if (elem != originalElement && elem != document.body && elem != document.documentElement) {
        leftX -= elem.scrollLeft;
        leftY -= elem.scrollTop;
        }
      elem = elem.offsetParent;
      }
    }
  else if (elem.x) {
    leftX += elem.x;
    leftY += elem.y;
    }
  pos.x = leftX;
  pos.y = leftY;
  return pos;
  },

setAardvarkElem : function (elem) {
  if (elem.nodeType == 1) { // ELEMENT_NODE
    for (var i=0; i<elem.childNodes.length; i++) {
      elem.isAardvark = true;
      this.setAardvarkElem(elem.childNodes.item(i));
      }
    }
  },

//-----------------------------------------------------
setHandler : function(obj, eventName, code) {
  if (aardvark.doc.all)
    obj.attachEvent ("on" + eventName, code);
  else
    obj.addEventListener (eventName, code, false);
  },

//-----------------------------------------------------
// move a div (or whatever) to an x y location
moveElem : function (o, x, y) {
  o = o.style;
  
  if (aardvark.doc.all) {
    o.pixelLeft=x;
    o.pixelTop=y;
    }
  else {
    o.left=x + "px";
    o.top=y + "px";     
    }
  },

//-------------------------------------------------
getElemFromEvent : function (evt) {
  return ((evt.target) ? evt.target : evt.srcElement);
  },

//-------------------------------------------------
getWindowDimensions : function () {
  var out = {};
  
  if (aardvark.window.pageXOffset) {
    out.scrollX = aardvark.window.pageXOffset;
    out.scrollY = aardvark.window.pageYOffset;
    }
  else if (aardvark.doc.documentElement) {
    out.scrollX = aardvark.doc.body.scrollLeft + 
          aardvark.doc.documentElement.scrollLeft; 
    out.scrollY = aardvark.doc.body.scrollTop +
          aardvark.doc.documentElement.scrollTop;
    }
  else if (aardvark.doc.body.scrollLeft >= 0) {
    out.scrollX = aardvark.doc.body.scrollLeft;
    out.scrollY = aardvark.doc.body.scrollTop;
    }
  if (aardvark.doc.compatMode == "BackCompat") {
    out.width = aardvark.doc.body.clientWidth;
    out.height = aardvark.doc.body.clientHeight;
    }
  else {
    out.width = aardvark.doc.documentElement.clientWidth;
    out.height = aardvark.doc.documentElement.clientHeight;
    }
  return out;
  },

leafElems : {IMG:true, HR:true, BR:true, INPUT:true},

//--------------------------------------------------------
// generate "outerHTML" for an element
// this doesn't work on IE, but its got its own outerHTML property
getOuterHtml : function (node) {
  var str = "";
  
  switch (node.nodeType) {
    case 1: { // ELEMENT_NODE
      var isLeaf = (node.childNodes.length == 0 && aardvark.leafElems[node.nodeName]);
  
      str += "<" + node.nodeName.toLowerCase() + " ";
      for (var i=0; i<node.attributes.length; i++) {
        if (node.attributes.item(i).nodeValue != null &&
          node.attributes.item(i).nodeValue != '') {
          str += node.attributes.item(i).nodeName +
            "='" + 
            node.attributes.item(i).nodeValue +
            "' ";
          }
        }
      if (isLeaf)
        str += " />";
      else {
        str += ">";
        
        for (var i=0; i<node.childNodes.length; i++)
          str += aardvark.getOuterHtml(node.childNodes.item(i));
        
        str += "</" +
          node.nodeName.toLowerCase() + ">"
        }
      }
      break;
        
    case 3: //TEXT_NODE
      str += node.nodeValue;
      break;
    }
  return str;
  },


// borrowed from somewhere
createCSSRule : function (selector, declaration) {
  // test for IE (can i just use "aardvark.doc.all"?)
  var ua = navigator.userAgent.toLowerCase();
  var isIE = (/msie/.test(ua)) && !(/opera/.test(ua)) && (/win/.test(ua));
  
  // create the style node for all browsers
  var style_node = aardvark.doc.createElement("style");
  style_node.setAttribute("type", "text/css");
  style_node.setAttribute("media", "screen");
  style_node.isAardvark = true;
  
  // append a rule for good browsers
  if (!isIE)
    style_node.appendChild(aardvark.doc.createTextNode(selector + " {" + declaration + "}"));
  
  // append the style node
  aardvark.doc.getElementsByTagName("head")[0].appendChild(style_node);
  
  // use alternative methods for IE
  if (isIE && aardvark.doc.styleSheets && aardvark.doc.styleSheets.length > 0) {
    var last_style_node = aardvark.doc.styleSheets[aardvark.doc.styleSheets.length - 1];
    if (typeof(last_style_node.addRule) == "object"){
      var a = selector.split (",");
      for (var i=0; i<a.length; i++) {
        last_style_node.addRule(a[i], declaration);
        }
      }
    }
  },

trimSpaces : function (s) {
  while (s.charAt(0) == ' ')
    s = s.substring(1);
  while (s.charAt(s.length-1) == ' ')
    s = s.substring(0, s.length-1);
  return s;
  },

escapeForJavascript : function (s) {
  return s.replace(new RegExp("\n", "g"), " ").replace(new RegExp("\t", "g"), " ").replace(new RegExp("\"", "g"), "\\\"").replace(new RegExp("\'", "g"), "\\'").replace(new RegExp("<", "g"), "&lt;").replace(new RegExp(">", "g"), "&gt;");
  }
});
