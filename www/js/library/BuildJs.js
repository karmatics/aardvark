
(function(){

var DomGenerator = 
{
appendChildrenToElement: function(element, array) {
  for (var item=0; item < array.length; item++)
      element.appendChild (array[item]);
  },

loadFunctions:  function (doc)  {
  var elemTypes = ['A','B','BIG','BLOCKQUOTE','BR','BUTTON','CAPTION','CANVAS',
      'CENTER','CODE','DD','DIV','EM','EMBED','FIELDSET','FONT','FORM',
      'HEAD','HR','I','IFRAME','IMG','INPUT','LABEL','LEGEND','LI',
      'LINK','MAP','NOBR','OBJECT','OL','OPTION','P','PARAM','PRE',
      'RT','RUBY','S','SELECT','SMALL','SPAN','STRIKE','STRONG','SUB',
      'SUP','TABLE','TBODY','TD','TEXTAREA','TFOOT','TH','THEAD','TR',
      'UL','WBR','H1','H2','H3'];
  var dg = this;
  if(doc == null) {
    doc = document;
    }
  for (var x=0; x<elemTypes.length; x++) {
    (function () {
      var elemType = elemTypes[x];
      dg[elemType] = function() {
        var i, j, h, s, p, c, n = arguments.length,
            elem = doc.createElement(elemType);
        for (i=0; i < n; i++) {
            c = arguments[i];
            if (c.tagName)
                elem.appendChild(c);
            else if (typeof(c) == "string")
                elem.appendChild(doc.createTextNode(c));
            else if (c.html) {
                var d = doc.createElement (elemType);
                d.innerHTML = c.html;
                var a = [], len = d.childNodes.length;
                for (j=len-1; j >= 0; j--)
                    a[j] = d.removeChild(d.childNodes[j]);
                for (j=0; j < len; j++)
                    elem.appendChild(a[j]);
                }
            else {
                if ((s = c.style) !== undefined)
                  for (h in s)
                    elem.style[h] = s[h];
                for (h in c) {
                  p = c[h];
                  if (p != s)
                    elem[h] = p;
                  }
                }
            }
        return elem;
        }
      })();
    }
  }
};

if (DomGenerator === window.DomGenerator)
  DomGenerator.loadFunctions();var Cookie = {

setWindow: function(win) {
  this.win = win;
  this.doc = win.document;
  },
  
//--------------------------------------------------------------
getCookie: function(name) {
  var d = (this.doc || document);
  if(name.length > 0 && d.cookie.length > 0) {
    var begin = d.cookie.indexOf(name+"="); 
    if(begin != -1) {
      begin += name.length+1; 
      var end = d.cookie.indexOf(";", begin);
      if(end == -1)
        end = d.cookie.length;
      return unescape(d.cookie.substring(begin, end));
      }
    }
  return null;
  },

//--------------------------------------------------------------
setCookie : function(cookieName, cookieValue, path, nDays) {
  var d = (this.doc || document);
  var today = new Date();
  var expire = new Date();
  expire.setTime(today.getTime() + 3600000*24*nDays);
  d.cookie = cookieName + "=" + escape(cookieValue) +
    ((path) ? "; path=" + path : "") +			
    ";expires=" + expire.toGMTString();
  },

//--------------------------------------------------------------
deleteCookie : function(name, path) {
  this.setCookie(name, "", path, -1);
  }
};

if (Cookie === window.Cookie)
  Cookie.setWindow(window);var DomUtils = {

setWindow: function(win) {
  this.win = win;
  this.doc = win.document;
  },

//-----------------------------------------------------
getPos: function(e) {
var x = 0;
var y = 0;
if(e.offsetParent) {
	while(e.offsetParent) {
		x += e.offsetLeft - e.scrollLeft;
		y += e.offsetTop - e.scrollTop;
		e = e.offsetParent;
		}
	}
else if(e.x) {
	x = e.x;
	y = e.y;
	}
return {x: x, y: y};
},

//-----------------------------------------------------
moveElem: function(elem, x, y) {
var s = elem.style;
s.left = x + 'px';
s.top = y + 'px';			
},

//-----------------------------------------------------
getWindowDimensions : function () {
var out = {};
var w = this.win, d = this.doc;
if (w.pageXOffset) {
	out.scrollX = w.pageXOffset;
	out.scrollY = w.pageYOffset;
	}
else if (d.documentElement) {
	out.scrollX = d.body.scrollLeft + d.documentElement.scrollLeft; 
	out.scrollY = d.body.scrollTop + d.documentElement.scrollTop;
	}
else if (d.body.scrollLeft >= 0) {
	out.scrollX = d.body.scrollLeft;
	out.scrollY = d.body.scrollTop;
	}

if (d.compatMode == "BackCompat") {
	out.width = d.body.clientWidth;
	out.height = d.body.clientHeight;
	}
else {
	out.width = d.documentElement.clientWidth;
	out.height = d.documentElement.clientHeight;
	}
return out;
},

//--------------------------------------------------------------
// get an element within another by its tag type and its classname
// (or partial classname, for instance if the classname is "whatever"
// you can get it by "what" but not "ever")
getDecendantElem : function (container, type, classname) {
if (container != null) {
	var i, e, len, elems = container.getElementsByTagName(type); 
	len = elems.length; 
	for (i = 0; i  <  len; i++) 
		{
		e = elems.item(i);
		if (e.className && e.className.indexOf(classname)==0)
			return e;
		}
	}
return null;
},

//--------------------------------------------------------------
insertAfter : function (element, prevElement) {
var parent = prevElement.parentNode;
if (parent.lastChild == prevElement)
	return parent.appendChild (element);
else
	return parent.insertBefore (element, prevElement.nextSibling);
},

//-------------------------------------------------
getElementFromEvent : function (evt) {
  if (!evt)
    evt = this.win.event;
  return ((evt.target) ? evt.target : evt.srcElement);
  },

//-------------------------------------------------
getMousePosFromEvent : function (evt) {
  if (!evt)
    evt = this.win.event;
  var pos = {};
  if (evt.x) {
      pos.x = evt.x;
      pos.y = evt.y;
      }
  else if (evt.pageX) {
      pos.x = evt.pageX;
      pos.y = evt.pageY;
      }
  return pos;
  },

//------------------------------------------------------
modifyClassName : function (elem, add, string) {
  var s = (elem.className) ? elem.className : "";
  var a = s.split(" ");
  if (add) {
    for (var i=0; i<a.length; i++) {
        if (a[i] == string) {
            return;
            }
        }
    s += " " + string;
    }
  else {
      s = "";
      for (var i=0; i<a.length; i++) {
          if (a[i] != string)
              s += a[i] + " "; 
          }
      }
  elem.className = s;
  },

//----------------------------------------------
addPropertyToElementAndChildren : function (elem, name, value) {
  elem[name] = value;
  if (elem.childNodes && elem.childNodes.length != 0) {
    for (var i=0; i<elem.childNodes.length; i++) {
      var child = elem.childNodes[i];
      if (child.nodeType == 1)
        this.addPropertyToElementAndChildren(child, name, value);
      }
    }
  },
  
//-------------------------------------------
getSelectionStart: function (elem) {
	if (elem.createTextRange) {
		var r = this.doc.selection.createRange().duplicate();
		r.moveEnd('character', elem.value.length);
		if (r.text == '')
		  return elem.value.length
		return elem.value.lastIndexOf(r.text);
	  }
	else
	  return elem.selectionStart;
  },

//-------------------------------------------
getSelectionEnd: function (elem) {
	if (elem.createTextRange) {
		var r = this.doc.selection.createRange().duplicate();
		r.moveStart('character', -elem.value.length);
		return r.text.length;
	  }
	else
	  return elem.selectionEnd;
  }
};

if (DomUtils === window.DomUtils)
  DomUtils.setWindow(window);
var Callbacks = {

callbackList : [],

//-------------------------------------------
setMouseCallback : function(elem, callback, moreParams) {
//todo: eliminate array support
elem.mouseCallback = {callback: (callback.func!=null) ? callback : 
		Callbacks.create.apply (null, callback)};
elem.onmouseover = Callbacks.mouseCallbacks.over;
elem.onmouseout = Callbacks.mouseCallbacks.out;

if (moreParams && moreParams.draggable) {
    elem.onmousedown = Callbacks.mouseCallbacks.startdrag;
    if (moreParams.blockSelect)
        elem.mouseCallback.blockSelect = true;
    }
else 
    elem.onclick = Callbacks.mouseCallbacks.click;
    
if (window.KarmaticsDebug)    
    Callbacks.callbackList.push ({
      callback: elem.mouseCallback.callback,
      type: "mouse",
      element: elem,
      elementType: elem.tagName
      });
return elem;
},

//-------------------------------------------
mouseCallbacks : {
 /* queuedMouseOver : null,
    queuedMouseOut : null,
    doQueuedMouseOver : function () {
    if (this.queuedMouseOver) {
    }    
    },
    doQueuedMouseOut : function () {
    if (this.queuedMouseOver) {
    }    
    },
 */
 dragElement : null,
 
 click : function(evt) {
  var o = this.mouseCallback;
  return Callbacks.doCallback (o.callback, "click",  ((evt)?evt:window.event));
	},
	
 startdrag : function(evt) {
  Callbacks.mouseCallbacks.dragElement = this;
  Callbacks.setListener (document, "mousemove",
      Callbacks.mouseCallbacks.drag, true);
  Callbacks.setListener (document, "mouseup",
      Callbacks.mouseCallbacks.enddrag, true);
 	var o = this.mouseCallback;
  if (!evt)
    evt = window.event;
 	if (o.blockSelect) {
    if (document.all)
 	    evt.cancelBubble = true;
    else
 	    evt.preventDefault();
 	  }
 	return Callbacks.doCallback (o.callback, "startdrag", this, evt);
	},
	
 drag : function(evt) {
  var elem = Callbacks.mouseCallbacks.dragElement;
  var o = elem.mouseCallback;
  if (!evt)
    evt = window.event;
  if (evt.preventDefault) {
    if (document.all)
      evt.cancelBubble = true;
    else
      evt.preventDefault();
    }
	return Callbacks.doCallback (o.callback, "drag", elem, evt);
	},
	
 enddrag : function(evt) {
  var elem = Callbacks.mouseCallbacks.dragElement;
  var o = elem.mouseCallback;
	Callbacks.cancelListener (document, "mousemove",
	      Callbacks.mouseCallbacks.drag);
  Callbacks.cancelListener (document, "mouseup",
        Callbacks.mouseCallbacks.enddrag);
	if (o.queueOverOut)
	    Callbacks.doCallback (o.callback,
	        (o.queueOverOut==1)?"over":"out", this, ((evt)?evt:window.event));
	delete (Callbacks.mouseCallbacks.dragElement);
  return Callbacks.doCallback (o.callback,
      "enddrag", elem, ((evt)?evt:window.event));
	},
	
 over : function(evt) {
  	var o = this.mouseCallback;
  	if (Callbacks.mouseCallbacks.dragElement == this)
  	    o.queueOverOut = 1;
  	else {
  	    delete (o.queueOverOut);
  	    return Callbacks.doCallback (o.callback, "over", this, ((evt)?evt:window.event));
  	    }
	},
	
 out : function(evt) {
  	var o = this.mouseCallback;
  	if (Callbacks.mouseCallbacks.dragElement == this)
  	    o.queueOverOut = 2;
  	else {
  	    delete (o.queueOverOut);
  	    return Callbacks.doCallback (o.callback, "out", this, ((evt)?evt:window.event))
  	    }
	}
 },
 
//-------------------------------------------------
// cross-browser event handling with listeners (if available)
setListener : function(element, eventType, handler) {
if(element.addEventListener) {
	element.addEventListener(eventType, handler, false);
	return true;
	}
else if(element.attachEvent) {
	element.attachEvent('on' + eventType, handler);
	return true;
	}
},

//-------------------------------------------------
cancelListener : function(element, eventType, handler) {
if(element.removeEventListener) {
	element.removeEventListener(eventType, handler, false);
	return true;
	}
else if(element.detachEvent) {
	element.detachEvent('on' + eventType, handler);
	return true;
	}
},
 
//------------------------------------------------
// doCallback 
doCallback : function (callback) {
var ret;
try {
    var i, a = [];
    if (callback.params) {
			for (i=0; i < callback.params.length; i++)
					a.push(callback.params[i]);
			}
    for (i=1; i < arguments.length; i++)
        a.push(arguments[i]);
    ret = callback.func.apply (callback.thisObject, a);
  }
catch (e) {
  if (window.Logger != null) {
    if (e.stack != null) {
      var x = e.stack.split("\n");
      e.stack = x;
      };
    Logger.write (e);
    }
  return;
  }
if (callback.returnValue != null) // forced return value
  return callback.returnValue;
return ret;
}
 
};var NamedItemList = function (){
  this.list = {};
  };

NamedItemList.prototype = {

  insert : function (name, object) {
    this.list[name] = {next: this.list[name], object: object};
    },

  remove : function (name, object) {  
    var nl = this.list[name];
    if (nl == null)
      return;
    if (nl.object == object) {
      if (nl.next == null)
        delete this.list[name];
      else 
        this.list[name] = nl.next;
      return;
      }
    while (nl.next != null) {
      if (nl.next.object == object) {
        nl.next = nl.next.next;
        return;
        }
      nl = nl.next;
      }
    },

  getLastAdded : function (name) {
    var nl = this.list[name];
    if (nl == null)
      return null;
    return nl.object;
    }
  };
PopupWindow = {
constructor: function (title, name, isResizable, windowCallback) {
  this.title = title;
  this.name = name;
  this.isResizable = isResizable;
  this.windowCallback = windowCallback;
  
  if(this.classObject.displayedList == null) {
    this.classObject.displayedList = new this.NamedItemList();
    }
  
  var resizeElem, moveElem, killbox, cornerTD;
  with (this.DomGenerator) {
    this.element = 
      TABLE({className: "rjbwindow", style: {zIndex: PopupWindow.zIndex++}},
        TBODY(
        TR(
          moveElem =
          TD({className: "dragbar"},
              DIV({className: "rjbtitle"},
              this.title
              )
          ),
          TD({className: "killbox"},
            killbox = DIV({className: "killbox"})
          )
        ),
        TR(
          TD(
            this.contentElem = DIV({className: "content"})
          ),
          TD()
        ),
        TR(
          TD(),
          ((this.isResizable) ? TD({className: "cornerdragger"},
              resizeElem = DIV({className: "cornerdragger"})) : 
                TD())
        )));
    }
  var self = this;
  killbox.onclick = function(){self.kill()};
  this.Callbacks.setMouseCallback (moveElem,
      {func:PopupWindow.mouseHandlers.drag, thisObject:this, params:[{isResize: false}]}, 
      {draggable: true, blockSelect: true});
  if (this.isResizable) {
    this.Callbacks.setMouseCallback (resizeElem,
          {func:PopupWindow.mouseHandlers.drag,
          thisObject:this, params:[{isResize: true}]}, {draggable: true, blockSelect: true});
    if (this.width)
        this.contentElem.style.width = this.width + 'px';
    if (this.height)
        this.contentElem.style.height = this.height + 'px';
    }
  },

prototype : {

  moveToFront : function () {
    var doMove = false;
    var elem = this.element;
    var dims = this.DomUtils.getWindowDimensions ();
    var pos =  this.DomUtils.getPos (elem);
    if (pos.x + elem.offsetWidth > dims.width) {
        pos.x = dims.width-elem.offsetWidth;
        doMove = true;
        }
    if (pos.y + elem.offsetHeight > dims.height) {
        pos.y = dims.height-elem.offsetHeight;
        doMove = true;
        }
    if (pos.x < dims.scrollX) {
        pos.x = dims.scrollX + 4;
        doMove = true;
        }
    if (pos.y < dims.scrollY) {
        pos.y = dims.scrollY + 4;
        doMove = true;
        }
    
    if (doMove)
      this.DomUtils.moveElem (elem, pos.x, pos.y);
    this.element.style.zIndex = PopupWindow.zIndex++;  
    },
  
  //----------------------------------------------------
  // todo:  make it try to avoid covering parent element
  // (or, is this a bad idea?)
  show : function (parentElement) {
    if (this.element == null || this.isShown)
      return;
      
    this.isShown = true; 
    var dims = this.DomUtils.getWindowDimensions ();
    var elem = this.element;
    this.DomUtils.moveElem (elem, -10000, -10000);
    document.body.appendChild (elem);
    var x = dims.scrollX + (dims.width-elem.offsetWidth)/2, 
        y = dims.scrollY + (dims.height-elem.offsetHeight)/2;
    var w=0, h=0;
    if (0) { //this.name) {
      var lastPopupWindow = this.classObject.displayedList.getLastAdded (this.name);
      if (lastPopupWindow) {
          pos = DomUtils.getPos (lastPopupWindow.element);
          x = pos.x + 20;
          y = pos.y + 20;
          }
    	else {
    	  var s = Cookie.getCookie(this.name + "-pos");
      	if (s && s.length > 3) {
      		var a = s.split(",");
      		x = parseInt(a[0]);
      		y = parseInt(a[1]);
      		/*if (a.length == 4) {
						w = parseInt(a[2]);
						h = parseInt(a[3]);
      			}*/
      		} 
        }
      this.classObject.displayedList.insert (this.name, this);
    	}
    if (w > 0) {
      this.element.style.width = (w+5)+"px";
    	this.contentElem.style.width = w+"px";
      this.contentElem.style.height = h+"px";
			if (this.windowCallback != null)
					this.windowCallback ("resize", this);
    	}

    if (x + elem.offsetWidth > dims.width)
        x = dims.width-elem.offsetWidth;
    if (y + elem.offsetHeight > dims.height)
        y = dims.height-elem.offsetHeight;
    if (x < dims.scrollX)
      x = dims.scrollX + 4;
    if (y < dims.scrollY)
      y = dims.scrollY + 4;
    this.DomUtils.moveElem (elem, x, y);
    },

  //----------------------------------------------------
  kill : function () {
      if (this.windowCallback) {
          if (this.windowCallback("kill", this) == true)
            return;
          }
      delete this.isShown;
      this.element.parentNode.removeChild(this.element);
      delete (this.element);
      if (this.classObject.displayedList)
        this.classObject.displayedList.remove (this.name, this);
      }
  },

mouseHandlers : {

  //----------------------------------------------------
  drag : function (args, type, elem, event) {
  switch (type) {
      case "click":
        this.element.style.zIndex = PopupWindow.zIndex++;
        break;

      case "startdrag":
          this.startMousePos = this.DomUtils.getMousePosFromEvent(event);
          if (args.isResize) {
              this.startElemDims = {w:this.element.offsetWidth, 
                  h: this.element.offsetHeight, 
                  wDelta: this.element.offsetWidth - this.contentElem.offsetWidth,
                  hDelta : this.element.offsetHeight - this.contentElem.offsetHeight};
              }
          else
              this.startElemPos = this.DomUtils.getPos(this.element);
          this.element.style.zIndex = PopupWindow.zIndex++;
          break;
      case "drag":
          var pos = this.DomUtils.getMousePosFromEvent(event);
          var diffX = pos.x - this.startMousePos.x,
              diffY = pos.y - this.startMousePos.y;
          if (args.isResize) {
              var w = this.startElemDims.w + diffX, h  = this.startElemDims.h + diffY;
              if (w > 10)
                  this.element.style.width = w + "px";
              if (h > 10)
                  this.element.style.height = h + "px";
              this.contentElem.style.width = (w-(this.startElemDims.wDelta+10))+"px";
              
              this.contentElem.style.height = (h-(this.startElemDims.hDelta+10))+"px";
              
              if (this.windowCallback)
                  this.windowCallback ("resize", this);
              }
          else {
              var x = this.startElemPos.x+diffX, y = this.startElemPos.y+diffY;
              if (x < 0)
                x = 0;
              if (y < 0)
                y = 0;
              this.DomUtils.moveElem(this.element, x, y);
              }
          break;
      case "enddrag":
          if (this.name) {
            //if (!args.isResize) { //
            	{
            	var pos = DomUtils.getPos (this.element);
            	var s = pos.x + "," + pos.y;
            	if (this.isResizable)
            			s += "," + this.contentElem.offsetWidth + "," + this.contentElem.offsetHeight;
  	          this.Cookie.setCookie(this.name + "-pos",  s, "/", 5);
  	          }
  	        }
          delete (this.offsetPos);
         	break;
      case "over":
          this.DomUtils.modifyClassName (elem, true, "hilite");
          break;
      case "out":
          this.DomUtils.modifyClassName (elem, false, "hilite");
          break;
      }
  return true;
  }
 }
}
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
for (i=0; i<stack.length; i++)
	indentString += " ";

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
   
s = indentString + leadBrace + "\n";

 for (i in o) {
  if (o.hasOwnProperty(i)) {
    objName = ((isArray) ? "" : (i + ": "));
    //if (i.charAt(0) != '_') 
      {
        switch (typeof(o[i])) {
          case "function":
            s += indentString + objName + "\"(function)\",\n";
            break;
          case "object":
            if (stack.length > limit)
              s +=  indentString + objName + "\"(too deeply nested)\",\n";
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
                  s +=  indentString + objName + this.objectToJs (o[i], stack, limit) + ",\n";
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
      //   }
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
}
};
//----------------------------------------------------
var Logger = {
queuedMessages : [],
window: null,
lineCount : 0,

//-----------------------------------
scrollToBottom : function () {
    if (this.window) {
        var e = this.window.textElem;
        if (e.scrollTop == this.window.lastScrollPos) {
            var h = e.offsetHeight;
            e.scrollTop = e.scrollHeight;
            this.window.lastScrollPos = e.scrollTop;
            }
        }
    },

//-----------------------------------
checkScroll : function () {
    if (this.window) {
        var e = this.window.textElem;
        if (e && e.scrollTop > (e.scrollHeight - e.offsetHeight)- 25)
            this.window.lastScrollPos = e.scrollTop;
        }
    },

//-----------------------------------
windowCallback : function (type) {
    if (type == "kill")
      this.window = null;
    else if (type == "resize") {
      this.window.textElem.style.width = (this.window.contentElem.offsetWidth-20) + "px";
      this.window.textElem.style.height = (this.window.contentElem.offsetHeight-20) + "px";
      }
    },

//-----------------------------------
open : function () {
    this.window =  new PopupWindow ("Messages",
      "messagelogger",
      true,
      function (type, win){Logger.windowCallback(type, win);}
      );
    
    this.window.logger = this;
    this.window.lineCount = 0,
    this.window.prevLineCount = 0;
    this.window.lastScrollPosition = 0;
      
    var dims = DomUtils.getWindowDimensions();
    
    this.window.textElem = DomGenerator.DIV (
            {className: "logfilecontainer"});
    this.window.contentElem.appendChild (this.window.textElem);
    DomUtils.addPropertyToElementAndChildren (this.window.element, "isAardvark", true);
    this.window.show ();    

    var msg;
    
    for (var i=0; i < this.queuedMessages.length; i++) {
        msg = this.queuedMessages[i];
        if (this.aboveThreshold (msg.level, msg.type))
            this.displayMessage (msg);
        }
    this.queuedMessages = [];
    },

//-----------------------------------
aboveThreshold : function (level, type) {
    if (!level)
        level = 5;
    if (!type)
        type = "generic";
    var threshold = (!window.Prefs || Prefs.logMsgThreshold==null ||
        Prefs.logMsgThreshold[type] == null)?
        ((type== "generic")?4:10) : Prefs.logMsgThreshold[type];
    return (level < threshold) ? false : true;    
    },

//-----------------------------------
displayMessage : function (msg) {
    this.checkScroll();
    var props = {innerHTML: msg.string,
              className: "logfileline" + (((this.lineCount%2)==0)?"":" oddLine")};
    this.window.textElem.appendChild ((msg.usePre)?DomGenerator.PRE(props):DomGenerator.DIV(props));
    this.lineCount++;
    this.scrollToBottom ();
    },

//-----------------------------------
write : function (data, level, type, limit) {
    if (!this.window && this.aboveThreshold (level, type))
        this.open ();
    if (this.window && !this.aboveThreshold (level, type))
        return;
    var d = {usePre: false};
    switch (typeof (data)) {
        case "string":
            d.string = data.replace(/\n/g, '<br>');
            break;
        case "number":
            d.string = data.toString();
            break;
        case "object":
            d.string = ServerComm.objectToJs(data, null, limit, true);
            d.usePre = true;
            break;
        default: 
            d.string = data.toString();
            return;
        }
    d.type = type;
    d.level = level;
    d.time = Math.round (new Date().getTime() / 1000);
    if (this.window) {
        this.displayMessage (d);
        }
    else {
        this.queuedMessages.push (d);
        }
  },

//-----------------------------------
clearOldMessages : function (ageSeconds) {
  var earliestTime = Math.round (new Date().getTime() / 1000) - ageSeconds;
  var a = this.queuedMessages, l = this.queuedMessages.length;
  if (l > 0 && a[0].time < earliestTime) {
      var newArray = [];
      for (var i =0; i<len; i++) {
        if (a[i].time > earliestTime)
            newArray.push(a[i]);
        }
      this.queuedMessages = newArray;
      }
  },

//-----------------------------------
forceToWindow : function  () {
  if (this.window && this.window.contentElem) {
    var dims = DomUtils.getWindowDimensions();
    if(this.window.textElem.offsetWidth > dims.width)
      this.window.textElem.style.width = (dims.width-100) + "px";
    if(this.window.textElem.offsetHeight > dims.height)
      this.window.textElem.style.height = (dims.height-100) + "px";
    }
  }
};RemoteStorage = {
  // api
 
  // setParams (user, password, url) 
  //
  // Call this first to set url, username, and password.
  // Only needs to be done once per page (or refresh), unless you need to change it.
  // 
  // If user doesn't exist, first time trying to put data will create
  //  that user, this will fail if user exists and password doesn't match.
  //
  // Url is for the php program that handles data storage, if null it uses the default 
  //  (http://www.karmatics.com/phpstuff/remotestore.php)
  //
  // No return value
  //
  setParams: function (user, password, url) {
    if (user)
      this.user = user;
    if (password)
      this.password = password;
    if (url)
      this.url = url;
    },
 
  // putData (data, append, name, callback) {
  //
  // save some data (as much as you need), associated with 
  //  a particular name.  User and password must be set first
  //
  // callback function will be called when complete.  This will
  //  have one parameter, a response object, which has a member
  //  "status" which will be "ok", "bad password" or "can't create file"
  //
  // if "append" is "y", this will append to existing data 
  //  rather than overwriting
  // 
  putData: function (data, append, name, callback) {
    var id = this.getAvailableId();
    var url, baseUrl = this.buildUrl ("put", name, callback, id);
    
    var escapedData = escape(data).replace(/\+/g, '%2B').
      replace(/\%20/g, '+').replace(/\"/g,'%22').
      replace(/\'/g, '%27').
      replace(new RegExp("/", "g"), '%2F');
    
    var request = {callback: callback};
    var len = baseUrl.length;
    if (data.length > (2000-baseUrl.length)) {
      var a = this.chopUpUrlEncodedString (escapedData, (2000-baseUrl.length), (2000-baseUrl.length));
      // Logger.write(data.length + " " + len + " " + a.length);
      url = baseUrl + "&data=" + a[0];
      if (append)
         url += "&append=y";
      request.dataArray = a;
      request.curr = 1;
      request.baseUrl = baseUrl;
      }
    else {
     url = baseUrl +  "&data=" + escapedData;
     }
    this.requestList[id] = request;
    this.sendRequest(url);
    },

  // putData (name, callback)
  //
  // retrieve data by its name.  username and password must be set first
  // 
  // callback function will be called when complete.  This will
  //  have one parameter, a response object, which has a member
  //  "status" which will be "ok", "not found" or "bad password"
  // 
  // If status is "ok", there will be a member "text" which will be
  //  the data
  //
  getData: function (name, callback) {
    var id = this.getAvailableId();
    var url = this.buildUrl ("get", name, callback, id);
    this.requestList[id] = {callback: callback};
    this.sendRequest(url);
    },
    
  // deleteData (name, callback)
  //
  // delete data by its name.  username and password must be set first
  // 
  // callback function will be called when complete.  This will
  //  have one parameter, a response object, which has a member
  //  "status" which will be "ok", "not found" or "bad password"
  // 
  deleteData: function (name, callback) {
    var id = this.getAvailableId();
    var url = this.buildUrl ("delete", name, callback, id);
    this.requestList[id] = {callback: callback};
    this.sendRequest(url);
    },

 // implementation: below here is not for public consumption
 user: null,
 password: null,
 url: "http://www.karmatics.com/phpstuff/remotestore.php",

 jsonCallback: function (response) {
  var request, id = response.id;
  if ((request = this.requestList[id]) != null) {
    if (request.dataArray && (request.curr < request.dataArray.length)) {
      var url = request.baseUrl + "&data=" + request.dataArray[request.curr] + "&append=y";
      request.curr++;
      this.sendRequest(url);
      return;
      }
    request.callback(response);
    this.requestList[id] = null;
    for (var i=this.requestList.length-1; i>=0; i--) {
      if (this.requestList[i] == null)
        this.requestList.splice(i);
      else
        break;
      }
    }
  },
  
//---------------------------------------------
// break a string into an array of smaller strings.
// Doesn't break url encoding(avoids splitting
// "%23" type things)
chopUpUrlEncodedString : function
(
str, 
maxCharFirst,
maxCharOthers
) {
  var a = [];
  var count = 0;
  var maxChar = maxCharFirst;

  while(str.length > maxChar) {
  	var len = maxChar-1;
  	
  	if(str.charAt(maxChar-2) == '%')
  		len = maxChar-2;
  	if(str.charAt(maxChar-3) == '%')
  		len = maxChar-3;
  	
  	a[count] = str.substring(0, len);
  	str = str.substring(len);
  	count++;
  	maxChar = maxCharOthers;
  	}
  a[count] = str;
  return a;
  },

 requestList: [],

 
 sendRequest: function(url) {
  var se = document.createElement('script');
  se.src = url;
  //Logger.write (url)
  if (document.body)
    document.body.appendChild(se);
  else {
    var a = document.getElementsByTagName("head");
    if(a[0])
      a[0].appendChild(se);
    }
  },
  
 getAvailableId: function () {
   var id = 0;
   while (1) {
    if (this.requestList[id] == null) {
      return id;
      }
    id++;
    }
   },

 buildUrl: function (mode, name, callback, id) {
  return this.url + "?x=" +
    Math.floor(Math.random()*10000) + "&name=" + name + 
    "&user=" + this.user + "&password=" + this.password + 
    "&callback=RemoteStorage.jsonCallback&mode=" + mode + "&id=" + id;
  }
}
JsSnippetEditor = function () {
    if (window.JsSnippetEditorRemoteData && !JsSnippetEditor.remoteSaveData) {
      JsSnippetEditor.remoteSaveData = JsSnippetEditorRemoteData;
      RemoteStorage.setParams(JsSnippetEditorRemoteData[0], JsSnippetEditorRemoteData[1]);
      RemoteStorage.getData(JsSnippetEditorRemoteData[2],
      function (response){
         if(response.status == "ok"){
           JsSnippetEditor.setData(response.text);
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
                this.textArea = TEXTAREA ({style: {width: "350px", height: "150px"}})
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
    };

JsSnippetEditor.prototype = {
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
      // Logger.write (this.nameSelectElem.value);
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
    
    if (code == 9) {
      if (evt.preventDefault)
        evt.preventDefault();
      if (evt.stopPropagation)
        evt.stopPropagation();
  
      var start = DomUtils.getSelectionStart(this.textArea), end = DomUtils.getSelectionEnd(this.textArea);
      var s1 = this.textArea.value.substring (0, start),
          s2 = this.textArea.value.substring (end);
      this.textArea.value = s1 + "  " + s2;
      this.textArea.setSelectionRange(end+2,end+2);    
      }
    },
      
  //-----------------------------------------
  nameSelectHandler : function () {
    this.getDataBasedOnGui ();
    },
  
  //-----------------------------------------
  runButtonHandler : function () {
    var result = null, evString;
    
    //evString = "result=(function editorFunc(){" + this.textArea.value + "})();"
    try {
        var log = function (x, y, z) {
          Logger.write (x, y, z);              
          };
        with (DomGenerator) {
          var editor = this;
          
          /*var scriptElem=document.createElement('script');
          scriptElem.appendChild (document.createTextNode(this.textArea.value));
          var b = document.body.appendChild(scriptElem);
          */
          
          eval(this.textArea.value); // evString);
          }
        if (result != null)
            Logger.write (result, 200);
        }
    catch (e) {
        if (Logger != null) {
          Logger.write ("message: <b>" + e.message + "</b>");
          Logger.write ("error: <b>" + e.nameOfItem + "</b>");
          Logger.write ("---------- <b>stack trace</b> ------");
          if (e.stack != null) {
            var x = e.stack.split("\n");
            for (var i=x.length-1; i>=0; i--){
                if (x[i].length > 0)
                    Logger.write("&nbsp;&nbsp;<b>" + x[i] + "</b>");
                }
            }
          }
        return;
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
    JsSnippetEditor.updateByName (n, this.textArea.value, 0);
    this.setNameInputVisibility();
    JsSnippetEditor.saveToRemoteStorage();
    },
  
  //---------------------------------------------
  deleteButtonHandler : function () {
    JsSnippetEditor.deleteByName (this.nameSelectElem.value); 
    }
  };

  
//----------------------------------------
JsSnippetEditor.listeners = [];

JsSnippetEditor.namedItems = [];

JsSnippetEditor.setData = function (data) {
    if (typeof (data) == "string")
      data = eval(data);
    this.namedItems = data;
    this.alertListeners();
  };

//-----------------------------------------------
// must have function "editorListUpdated"
JsSnippetEditor.addListener = function (item) {
  for (var i=0; i<this.listeners.length; i++)
      if (this.listeners[i] == item)
          return;
  this.listeners.push(item);
  };

//-----------------------------------------------
JsSnippetEditor.removeListener = function (item) {
  var newList = [];
  for (var i=0; i<this.listeners.length; i++)
      if (this.listeners[i] != item)
          newList.push(this.listeners[i]);
  this.listeners = newList;
  };
  
//-----------------------------------------------
// must have function "editorListUpdated"
JsSnippetEditor.alertListeners = function () {
  for (var i=0; i<this.listeners.length; i++)
      if (this.listeners[i].editorListUpdated)
          this.listeners[i].editorListUpdated();
  };

//----------------------------------------
JsSnippetEditor.getByName = function (nameOfItem) {
  for (var i=0; i<this.namedItems.length; i++) {
      if (this.namedItems[i].name == nameOfItem)
          return this.namedItems[i];
      }
  return null;
  };

//----------------------------------------
JsSnippetEditor.updateByName = function (nameOfItem, js, mode) {
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
  };

//----------------------------------------
JsSnippetEditor.deleteByName = function (nameOfItem) {
  var list = [], count = 0;
  
  for (var i=0; i<this.namedItems.length; i++) {
    if (this.namedItems[i].name != nameOfItem)
        list.push (this.namedItems[i]);
    }
  this.namedItems = list;
  this.alertListeners ();
  };


JsSnippetEditor.saveRemotely = function () {
  RemoteStorage.setParams(this.remoteSaveData[0],
    this.remoteSaveData[1]);
  RemoteStorage.putData(
   ServerComm.objectToJs(this.namedItems),
   false,
   this.remoteSaveData[2],
   function (response){
     if(response.status == "ok"){
       log ("done");
       }
     else {
       log("failed: " + response.status);
       };
     }
   );
};

//----------------------------------------
JsSnippetEditor.getNames = function () {
  var a = [];
  for (var i=0; i<this.namedItems.length; i++)
      a.push (this.namedItems[i].name);
  return a;
  };
  
JsSnippetEditor.saveToRemoteStorage = function () {
  RemoteStorage.setParams(JsSnippetEditor.remoteSaveData[0],
      JsSnippetEditor.remoteSaveData[1]);
  RemoteStorage.putData(
   ServerComm.objectToJs(JsSnippetEditor.namedItems),
   false,
   JsSnippetEditor.remoteSaveData[2],
   function (response){
     if(response.status == "ok"){
       }
     else {
       log("failed to save snippet data: " + response.status);
       };
     }
 );
  };
(function () {

var lib = "../js/rob_library/",
  tools = "rob_tools_library/";

var Modules = [
  {
  name: "PopupWindow",
  path: tools,
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
   window[item.name] = tmp.constructor;
   for (var j in tmp)
     window[item.name][j] = tmp[j];
   var dep = item.dependencies;
   for (var j=0; j<dep.length; j++)
     window[item.name].prototype[dep[j]] = window[dep[j]];
   window[item.name].prototype.classObject = window[item.name];
   }
 
 })();    window['DomGenerator'] = DomGenerator;
        window['Cookie'] = Cookie;
        window['DomUtils'] = DomUtils;
        window['Callbacks'] = Callbacks;
        window['NamedItemList'] = NamedItemList;
        window['PopupWindow'] = PopupWindow;
        window['ServerComm'] = ServerComm;
        window['Logger'] = Logger;
        window['RemoteStorage'] = RemoteStorage;
        window['JsSnippetEditor'] = JsSnippetEditor;
        window['JsCombiner'] = JsCombiner;
    }());
