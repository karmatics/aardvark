aardvark.loadObject ({

//-------------------------------------------------
showHelpTip : function () {
var dbox = new AardvarkDBox ("#fff2db", false, true, true);
dbox.innerContainer.innerHTML = "<p style='clear: both; margin: 3px 0 0 0;'><img src='" +  this.resourcePrefix + "aardvarkhelp.gif' style=' float: right; margin: 0 0 0px 0'>" + this.strings.initialTipText + "</p>";
dbox.innerContainer.style.width = "14em";
dbox.innerContainer.style.height = "54px";
dbox.show ();
setTimeout ("aardvark.killDbox(" + dbox.id + ")", 2000);
return true;
},

//-------------------------------------------------
// create the box and tag etc (done once and saved)
makeElems : function () {
this.borderElems = [];
var d, i, s;

for (i=0; i<4; i++) {
  d = this.doc.createElement ("DIV");
  s = d.style;
  s.display = "none";
  s.overflow = "hidden";
  s.position = "absolute";
  s.height = "2px";
  s.width = "2px";
  s.top = "20px";
  s.left = "20px";
  s.zIndex = "5000";
  d.isAardvark = true; // mark as ours
  this.borderElems[i] = d;
  this.doc.body.appendChild (d);
  }
var be = this.borderElems;
be[0].style.borderTopWidth = "2px";
be[0].style.borderTopColor = "#f00";
be[0].style.borderTopStyle = "solid";
be[1].style.borderBottomWidth = "2px";
be[1].style.borderBottomColor = "#f00";
be[1].style.borderBottomStyle = "solid";
be[2].style.borderLeftWidth = "2px";
be[2].style.borderLeftColor = "#f00";
be[2].style.borderLeftStyle = "solid";
be[3].style.borderRightWidth = "2px";
be[3].style.borderRightColor = "#f00";
be[3].style.borderRightStyle = "solid";

d = this.doc.createElement ("DIV");
this.setElementStyleDefault (d, "#fff0cc");
d.isAardvark = true; // mark as ours
d.isLabel = true; // 
d.style.borderTopWidth = "0";
d.style.MozBorderRadiusBottomleft = "6px";
d.style.MozBorderRadiusBottomright = "6px";
d.style.WebkitBorderBottomLeftRadius = "6px";
d.style.WebkitBorderBottomRightRadius = "6px";
d.style.zIndex = "5005";
d.style.visibility = "hidden";
this.doc.body.appendChild (d);
this.labelElem = d;

d = this.doc.createElement ("DIV");
this.setElementStyleDefault (d, "#dfd");
d.isAardvark = true; // mark as ours
d.isKeybox = true; // 
d.style.backgroundColor = "#cfc";
d.style.zIndex = "5008";
this.doc.body.appendChild (d);
this.keyboxElem = d;
},

//-------------------------------------------------
// show the red box around the element, and display
// the string in the little tag
showBoxAndLabel : function (elem, string) {
var pos = this.getPos(elem)
var dims = this.getWindowDimensions ();
var y = pos.y;

this.moveElem (this.borderElems[0], pos.x, y);
this.borderElems[0].style.width = elem.offsetWidth + "px";
this.borderElems[0].style.display = "";

this.moveElem (this.borderElems[1], pos.x, y+elem.offsetHeight-2);
this.borderElems[1].style.width = (elem.offsetWidth + 2)  + "px";
this.borderElems[1].style.display = "";

this.moveElem (this.borderElems[2], pos.x, y);
this.borderElems[2].style.height = elem.offsetHeight  + "px";
this.borderElems[2].style.display = "";

this.moveElem (this.borderElems[3], pos.x+elem.offsetWidth-2, y);
this.borderElems[3].style.height = elem.offsetHeight + "px";
this.borderElems[3].style.display = "";

y += elem.offsetHeight + 2;

this.labelElem.innerHTML = string;
this.labelElem.style.display = '';

// adjust the label as necessary to make sure it is within screen and
// the border is pretty
if ((y + this.labelElem.offsetHeight) >= dims.scrollY + dims.height) {
  this.labelElem.style.borderTopWidth = "1px";
  this.labelElem.style.MozBorderRadiusTopleft = "6px";
  this.labelElem.style.MozBorderRadiusTopright = "6px";
  this.labelElem.style.WebkitBorderTopLeftRadius = "6px";
  this.labelElem.style.WebkitBorderTopRightRadius = "6px";
  this.labelDrawnHigh = true;
  y = (dims.scrollY + dims.height) - this.labelElem.offsetHeight;
  }
else if (this.labelElem.offsetWidth > elem.offsetWidth) {
  this.labelElem.style.borderTopWidth = "1px";
  this.labelElem.style.MozBorderRadiusTopright = "6px";
  this.labelElem.style.WebkitBorderTopRightRadius = "6px";
  this.labelDrawnHigh = true;
  }
else if (this.labelDrawnHigh) {
  this.labelElem.style.borderTopWidth = "0";
  this.labelElem.style.MozBorderRadiusTopleft = "";
  this.labelElem.style.MozBorderRadiusTopright = "";
  this.labelElem.style.WebkitBorderTopLeftRadius = "";
  this.labelElem.style.WebkitBorderTopRightRadius = "";
  delete (this.labelDrawnHigh); 
  }
this.moveElem (this.labelElem, pos.x+2, y);
this.labelElem.style.visibility = "visible";
},

//-------------------------------------------------
removeBoxFromBody : function () {
if (this.labelElem) {
  this.doc.body.removeChild(this.labelElem);
  this.labelElem = null;
  }
if (this.keyboxElem) {
  this.doc.body.removeChild(this.keyboxElem);
  this.keyboxElem = null;
  }
if (this.borderElems != null) {
  for (var i=0; i<4; i++)
    this.doc.body.removeChild(this.borderElems[i]);
  this.borderElems = null;
  }
},

//-------------------------------------------------
// remove the red box and tag
clearBox : function () {
this.selectedElem = null;
if (this.borderElems != null) {
  for (var i=0; i<4; i++)
    this.borderElems[i].style.display = "none";
  this.labelElem.style.display = "none";
  this.labelElem.style.visibility = "hidden";
  }
},

//-------------------------------------------------
hideKeybox : function () {
this.keyboxElem.style.display = "none";
this.keyboxTimeoutHandle = null;
},

//-------------------------------------------------
showKeybox : function (command){
if (this.keyboxElem == null)
  return;
  
if (command.keyOffset >= 0) {
  var s1 = command.name.substring(0, command.keyOffset);
  var s2 = command.name.substring(command.keyOffset+1);
  
  this.keyboxElem.innerHTML = s1 + "<b style='font-size:2em;'>" +
      command.name.charAt(command.keyOffset) + "</b>" + s2;
  }
else {
  this.keyboxElem.innerHTML = command.name;
  }
  
var dims = this.getWindowDimensions ();
var y = dims.scrollY + this.mousePosY + 10;
if (y < 0)
  y = 0;
else if (y > (dims.scrollY + dims.height) - 30)
  y = (dims.scrollY + dims.height) - 60;
var x = this.mousePosX + 10;
if (x < 0)
  x = 0;
else if (x > (dims.scrollX + dims.width) - 60)
  x = (dims.scrollX + dims.width) - 100;

this.moveElem (this.keyboxElem, x, y);
this.keyboxElem.style.display = "";
if (this.keyboxTimeoutHandle)
  clearTimeout (this.keyboxTimeoutHandle);
this.keyboxTimeoutHandle = setTimeout ("aardvark.hideKeybox()", 400);
},

validIfBlockElements : {
  SPAN: 1,
  A: 1
  },

validIfNotInlineElements : {
  UL: 1,
  LI: 1,
  OL: 1,
  PRE: 1,
  CODE: 1
  },

alwaysValidElements : {
  DIV: 1,
  IFRAME: 1,
  OBJECT: 1,
  APPLET: 1,
  BLOCKQUOTE: 1,
  H1: 1,
  H2: 1,
  H3: 1,
  FORM: 1,
  P: 1,
  TABLE: 1,
  TD: 1,
  TH: 1,
  TR: 1,
  IMG: 1
  },

//-------------------------------------------------
// given an element, walk upwards to find the first
// valid selectable element
findValidElement : function (elem) {
while (elem) {
  if (this.alwaysValidElements[elem.tagName])
    return elem;
  else if (this.validIfBlockElements[elem.tagName]) {
    if (this.doc.defaultView) {
      if (this.doc.defaultView.getComputedStyle
            (elem, null).getPropertyValue("display") == 'block')
        return elem;
      }
    else if (elem.currentStyle){
      if (elem.currentStyle["display"] == 'block')
        return elem;   
      }
    }
  else if (this.validIfNotInlineElements[elem.tagName]){
    if (this.doc.defaultView) {
      if (this.doc.defaultView.getComputedStyle
            (elem, null).getPropertyValue("display") != 'inline')
        return elem;
      }
    else if (elem.currentStyle) {
      if (elem.currentStyle["display"] != 'inline')
        return elem;   
      }
    }
  elem = elem.parentNode;
  }
return elem;
},

//-------------------------------------------------
makeElementLabelString : function (elem) {
var s = "<b style='color:#000'>" + elem.tagName.toLowerCase() + "</b>";
if (elem.id != '')
  s += ", id: " + elem.id;
if (elem.className != '')
  s += ", class: " + elem.className;
return s;
},

//-------------------------------------------------
mouseUp : function (evt) {
// todo: remove all this when we replace dlogbox with our popupwindow
if (aardvark.dragElement) {
  delete aardvark.dragElement;
  delete aardvark.dragClickX;
  delete aardvark.dragClickY;
  delete aardvark.dragStartPos;
  }
return false;
},

// the following three functions are the main event handlers
// note: "this" does not point to aardvark.main in these
//-------------------------------------------------
mouseMove : function (evt) {
if (!evt)
  evt = aardvark.window.event;

if (aardvark.mousePosX == evt.clientX &&
      aardvark.mousePosY == evt.clientY) {
  aardvark.mouseMoved = false;
  return;
  }

// todo: remove all this when we replace dlogbox with our popupwindow
aardvark.mousePosX  = evt.clientX;
aardvark.mousePosY = evt.clientY;

if (aardvark.dragElement) {
  aardvark.moveElem (aardvark.dragElement, 
      (aardvark.mousePosX - aardvark.dragClickX) + aardvark.dragStartPos.x,
      (aardvark.mousePosY - aardvark.dragClickY) + aardvark.dragStartPos.y);
  aardvark.mouseMoved = false;
  return true;
  }

// if it hasn't actually moved (for instance, if something 
// changed under it causing a mouseover), we want to know that
aardvark.mouseMoved = true;
return false;
},
 
//-------------------------------------------------
mouseOver : function (evt) {
if (!evt)
  evt = aardvark.window.event;

if (!aardvark.mouseMoved)
  return;

var elem = aardvark.getElemFromEvent (evt);
if (elem == null) {
  aardvark.clearBox ();
  return;
  }
elem = aardvark.findValidElement (elem);

if (elem == null) {
  aardvark.clearBox();
  return;
  }
  
// note: this assumes that:
// 1. our display elements would be selectable types, and
// 2. elements inside display elements would not
if (elem.isAardvark) {
  if (elem.isKeybox)
    aardvark.hideKeybox();
  else if (elem.isLabel)
    aardvark.clearBox();
  else
    aardvark.isOnAardvarkElem = true;
  return;
  }

// this prevents it from snapping back to another element
// if you do a "wider" or "narrower" while on top of one
// of the border lines.  not fond of this, but its about
// the best i can do
if (aardvark.isOnAardvarkElem && aardvark.didWider) {
  var e = elem, foundIt = false;
  while ((e = e.parentNode) != null) {
    if (e == aardvark.selectedElem) {
      foundIt = true;
      break;
      }
    }
  if (foundIt) {
    aardvark.isOnAardvarkElem = false;
    return;
    }
  }
aardvark.isOnAardvarkElem = false;
aardvark.didWider = false;
  
if (elem == aardvark.selectedElem)
  return;
aardvark.widerStack = null;
aardvark.selectedElem = elem;
aardvark.showBoxAndLabel (elem, aardvark.makeElementLabelString (elem));
aardvark.mouseMoved = false;
},

//-------------------------------------------------
keyDown : function (evt) {
if (!evt)
  evt = aardvark.window.event;
var c;

if (evt.ctrlKey || evt.metaKey || evt.altKey)
  return true;

var keyCode = evt.keyCode ? evt.keyCode :
      evt.charCode ? evt.charCode :
      evt.which ? evt.which : 0;
c = String.fromCharCode(keyCode).toLowerCase();
var command = aardvark.getByKey(c);

if (command) {
  if (command.noElementNeeded) {
    if (command.func.call (aardvark) == true)
      aardvark.showKeybox (command);
    }
  else {
    if (aardvark.selectedElem && 
        (command.func.call (aardvark, aardvark.selectedElem) == true))
      aardvark.showKeybox (command);
    }
  }
if (c < 'a' || c > 'z')
  return true;
if (evt.preventDefault)
  evt.preventDefault ();
else
  evt.returnValue = false; 
return false;
},

//-------------------------------------------------
// this is the main entry point when starting aardvark
start : function () {
this.loadCommands();

if (this.isBookmarklet) {
  this.window = window;
  this.doc = document;
  }
else {
  this.doc = ((gContextMenu) ? gContextMenu.target.ownerDocument : window._content.document);
  this.window = window._content;
  }

if (this.doc.aardvarkRunning) {
  this.quit();
  return;
  }
else {
  this.makeElems (); 
  this.selectedElem = null;
  
  // need this to be page specific (for extension)...if you 
  // change the page, aardvark will not be running
  this.doc.aardvarkRunning = true;
  
  if (this.doc.all) {
    this.doc.attachEvent ("onmouseover", this.mouseOver);
    this.doc.attachEvent ("onmousemove", this.mouseMove);
    this.doc.attachEvent ("onmouseup", this.mouseUp);
    this.doc.attachEvent ("onkeypress", this.keyDown);
    }
  else {
    this.doc.addEventListener ("mouseover", this.mouseOver, false);
    this.doc.addEventListener ("mouseup", this.mouseUp, false);
    this.doc.addEventListener ("mousemove", this.mouseMove, false);
    this.doc.addEventListener ("keypress", this.keyDown, false);
    }

  // show tip if its been more than an hour
  if (!this.isBookmarklet) {
    var t = new Date().getTime()/(1000*60);
    var diff = t - this.tipLastShown;
    if (diff > 60) { // more than an hour
      this.tipLastShown = Math.round(t);
      this.prefManager.setIntPref("extensions.aardvark@rob.brown.tipLastShown",
        this.tipLastShown);
      this.showHelpTip();
      } 
    }
  } 
}
});