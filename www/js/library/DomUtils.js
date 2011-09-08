var DomUtils = {

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
var w = window, d = document;
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
    evt = window.event;
  return ((evt.target) ? evt.target : evt.srcElement);
  },

//-------------------------------------------------
getMousePosFromEvent : function (evt) {
  if (!evt)
    evt = window.event;
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
		var r = document.selection.createRange().duplicate();
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
		var r = document.selection.createRange().duplicate();
		r.moveStart('character', -elem.value.length);
		return r.text.length;
	  }
	else
	  return elem.selectionEnd;
  }
};
