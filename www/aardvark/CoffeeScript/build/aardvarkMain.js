(function() {
  aardvark.loadObject({
    showHelpTip: function() {
      var dbox;
      dbox = new AardvarkDBox("#fff2db", false, true, true);
      dbox.innerContainer.innerHTML = "<p style='clear: both; margin: 3px 0 0 0;'><img src='" + this.resourcePrefix + "aardvarkhelp.gif' style=' float: right; margin: 0 0 0px 0'>" + this.strings.initialTipText + "</p>";
      dbox.innerContainer.style.width = "14em";
      dbox.innerContainer.style.height = "54px";
      dbox.show();
      setTimeout("aardvark.killDbox(" + dbox.id + ")", 2000);
      return true;
    },
    makeElems: function() {
      var be, d, i, s;
      this.borderElems = [];
      i = 0;
      while (i < 4) {
        d = this.doc.createElement("DIV");
        s = d.style;
        s.display = "none";
        s.overflow = "hidden";
        s.position = "absolute";
        s.height = "2px";
        s.width = "2px";
        s.top = "20px";
        s.left = "20px";
        s.zIndex = "5000";
        d.isAardvark = true;
        this.borderElems[i] = d;
        this.doc.body.appendChild(d);
        i++;
      }
      be = this.borderElems;
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
      d = this.doc.createElement("DIV");
      this.setElementStyleDefault(d, "#fff0cc");
      d.isAardvark = true;
      d.isLabel = true;
      d.style.borderTopWidth = "0";
      d.style.MozBorderRadiusBottomleft = "6px";
      d.style.MozBorderRadiusBottomright = "6px";
      d.style.WebkitBorderBottomLeftRadius = "6px";
      d.style.WebkitBorderBottomRightRadius = "6px";
      d.style.zIndex = "5005";
      d.style.visibility = "hidden";
      this.doc.body.appendChild(d);
      this.labelElem = d;
      d = this.doc.createElement("DIV");
      this.setElementStyleDefault(d, "#dfd");
      d.isAardvark = true;
      d.isKeybox = true;
      d.style.backgroundColor = "#cfc";
      d.style.zIndex = "5008";
      this.doc.body.appendChild(d);
      return this.keyboxElem = d;
    },
    showBoxAndLabel: function(elem, string) {
      var dims, pos, y;
      pos = this.getPos(elem);
      dims = this.getWindowDimensions();
      y = pos.y;
      this.moveElem(this.borderElems[0], pos.x, y);
      this.borderElems[0].style.width = elem.offsetWidth + "px";
      this.borderElems[0].style.display = "";
      this.moveElem(this.borderElems[1], pos.x, y + elem.offsetHeight - 2);
      this.borderElems[1].style.width = (elem.offsetWidth + 2) + "px";
      this.borderElems[1].style.display = "";
      this.moveElem(this.borderElems[2], pos.x, y);
      this.borderElems[2].style.height = elem.offsetHeight + "px";
      this.borderElems[2].style.display = "";
      this.moveElem(this.borderElems[3], pos.x + elem.offsetWidth - 2, y);
      this.borderElems[3].style.height = elem.offsetHeight + "px";
      this.borderElems[3].style.display = "";
      y += elem.offsetHeight + 2;
      this.labelElem.innerHTML = string;
      this.labelElem.style.display = "";
      if ((y + this.labelElem.offsetHeight) >= dims.scrollY + dims.height) {
        this.labelElem.style.borderTopWidth = "1px";
        this.labelElem.style.MozBorderRadiusTopleft = "6px";
        this.labelElem.style.MozBorderRadiusTopright = "6px";
        this.labelElem.style.WebkitBorderTopLeftRadius = "6px";
        this.labelElem.style.WebkitBorderTopRightRadius = "6px";
        this.labelDrawnHigh = true;
        y = (dims.scrollY + dims.height) - this.labelElem.offsetHeight;
      } else if (this.labelElem.offsetWidth > elem.offsetWidth) {
        this.labelElem.style.borderTopWidth = "1px";
        this.labelElem.style.MozBorderRadiusTopright = "6px";
        this.labelElem.style.WebkitBorderTopRightRadius = "6px";
        this.labelDrawnHigh = true;
      } else if (this.labelDrawnHigh) {
        this.labelElem.style.borderTopWidth = "0";
        this.labelElem.style.MozBorderRadiusTopleft = "";
        this.labelElem.style.MozBorderRadiusTopright = "";
        this.labelElem.style.WebkitBorderTopLeftRadius = "";
        this.labelElem.style.WebkitBorderTopRightRadius = "";
        delete this.labelDrawnHigh;
      }
      this.moveElem(this.labelElem, pos.x + 2, y);
      return this.labelElem.style.visibility = "visible";
    },
    removeBoxFromBody: function() {
      var i;
      if (this.labelElem) {
        this.doc.body.removeChild(this.labelElem);
        this.labelElem = null;
      }
      if (this.keyboxElem) {
        this.doc.body.removeChild(this.keyboxElem);
        this.keyboxElem = null;
      }
      if (this.borderElems != null) {
        i = 0;
        while (i < 4) {
          this.doc.body.removeChild(this.borderElems[i]);
          i++;
        }
        return this.borderElems = null;
      }
    },
    clearBox: function() {
      var i;
      this.selectedElem = null;
      if (this.borderElems != null) {
        i = 0;
        while (i < 4) {
          this.borderElems[i].style.display = "none";
          i++;
        }
        this.labelElem.style.display = "none";
        return this.labelElem.style.visibility = "hidden";
      }
    },
    hideKeybox: function() {
      this.keyboxElem.style.display = "none";
      return this.keyboxTimeoutHandle = null;
    },
    showKeybox: function(command) {
      var dims, s1, s2, x, y;
      if (this.keyboxElem == null) {
        return;
      }
      if (command.keyOffset >= 0) {
        s1 = command.name.substring(0, command.keyOffset);
        s2 = command.name.substring(command.keyOffset + 1);
        this.keyboxElem.innerHTML = s1 + "<b style='font-size:2em;'>" + command.name.charAt(command.keyOffset) + "</b>" + s2;
      } else {
        this.keyboxElem.innerHTML = command.name;
      }
      dims = this.getWindowDimensions();
      y = dims.scrollY + this.mousePosY + 10;
      if (y < 0) {
        y = 0;
      } else {
        if (y > (dims.scrollY + dims.height) - 30) {
          y = (dims.scrollY + dims.height) - 60;
        }
      }
      x = this.mousePosX + 10;
      if (x < 0) {
        x = 0;
      } else {
        if (x > (dims.scrollX + dims.width) - 60) {
          x = (dims.scrollX + dims.width) - 100;
        }
      }
      this.moveElem(this.keyboxElem, x, y);
      this.keyboxElem.style.display = "";
      if (this.keyboxTimeoutHandle) {
        clearTimeout(this.keyboxTimeoutHandle);
      }
      return this.keyboxTimeoutHandle = setTimeout("aardvark.hideKeybox()", 400);
    },
    validIfBlockElements: {
      SPAN: 1,
      A: 1
    },
    validIfNotInlineElements: {
      UL: 1,
      LI: 1,
      OL: 1,
      PRE: 1,
      CODE: 1
    },
    alwaysValidElements: {
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
    findValidElement: function(elem) {
      while (elem) {
        if (this.alwaysValidElements[elem.tagName]) {
          return elem;
        } else if (this.validIfBlockElements[elem.tagName]) {
          if (this.doc.defaultView) {
            if (this.doc.defaultView.getComputedStyle(elem, null).getPropertyValue("display") === "block") {
              return elem;
            }
          } else {
            if (elem.currentStyle ? elem.currentStyle["display"] === "block" : void 0) {
              return elem;
            }
          }
        } else if (this.validIfNotInlineElements[elem.tagName]) {
          if (this.doc.defaultView) {
            if (this.doc.defaultView.getComputedStyle(elem, null).getPropertyValue("display") !== "inline") {
              return elem;
            }
          } else {
            if (!(elem.currentStyle ? elem.currentStyle["display"] === "inline" : void 0)) {
              return elem;
            }
          }
        }
        elem = elem.parentNode;
      }
      return elem;
    },
    makeElementLabelString: function(elem) {
      var s;
      s = "<b style='color:#000'>" + elem.tagName.toLowerCase() + "</b>";
      if (elem.id !== "") {
        s += ", id: " + elem.id;
      }
      if (elem.className !== "") {
        s += ", class: " + elem.className;
      }
      return s;
    },
    mouseUp: function(evt) {
      if (aardvark.dragElement) {
        delete aardvark.dragElement;
        delete aardvark.dragClickX;
        delete aardvark.dragClickY;
        delete aardvark.dragStartPos;
      }
      return false;
    },
    mouseMove: function(evt) {
      if (!evt) {
        evt = aardvark.window.event;
      }
      if (aardvark.mousePosX === evt.clientX && aardvark.mousePosY === evt.clientY) {
        aardvark.mouseMoved = false;
        return;
      }
      aardvark.mousePosX = evt.clientX;
      aardvark.mousePosY = evt.clientY;
      if (aardvark.dragElement) {
        aardvark.moveElem(aardvark.dragElement, (aardvark.mousePosX - aardvark.dragClickX) + aardvark.dragStartPos.x, (aardvark.mousePosY - aardvark.dragClickY) + aardvark.dragStartPos.y);
        aardvark.mouseMoved = false;
        return true;
      }
      aardvark.mouseMoved = true;
      return false;
    },
    mouseOver: function(evt) {
      var e, elem, foundIt;
      if (!evt) {
        evt = aardvark.window.event;
      }
      if (!aardvark.mouseMoved) {
        return;
      }
      elem = aardvark.getElemFromEvent(evt);
      if (elem == null) {
        aardvark.clearBox();
        return;
      }
      elem = aardvark.findValidElement(elem);
      if (elem == null) {
        aardvark.clearBox();
        return;
      }
      if (elem.isAardvark) {
        if (elem.isKeybox) {
          aardvark.hideKeybox();
        } else if (elem.isLabel) {
          aardvark.clearBox();
        } else {
          aardvark.isOnAardvarkElem = true;
        }
        return;
      }
      if (aardvark.isOnAardvarkElem && aardvark.didWider) {
        e = elem;
        foundIt = false;
        while ((e = e.parentNode) != null) {
          if (e === aardvark.selectedElem) {
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
      if (elem === aardvark.selectedElem) {
        return;
      }
      aardvark.widerStack = null;
      aardvark.selectedElem = elem;
      aardvark.showBoxAndLabel(elem, aardvark.makeElementLabelString(elem));
      return aardvark.mouseMoved = false;
    },
    keyDown: function(evt) {
      var c, command, keyCode;
      if (!evt) {
        evt = aardvark.window.event;
      }
      if (evt.ctrlKey || evt.metaKey || evt.altKey) {
        return true;
      }
      keyCode = (evt.keyCode ? evt.keyCode : (evt.charCode ? evt.charCode : (evt.which ? evt.which : 0)));
      c = String.fromCharCode(keyCode).toLowerCase();
      command = aardvark.getByKey(c);
      if (command) {
        if (command.noElementNeeded) {
          if (command.func.call(aardvark) === true) {
            aardvark.showKeybox(command);
          }
        } else {
          if (aardvark.selectedElem && (command.func.call(aardvark, aardvark.selectedElem) === true)) {
            aardvark.showKeybox(command);
          }
        }
      }
      if (c < "a" || c > "z") {
        return true;
      }
      if (evt.preventDefault) {
        evt.preventDefault();
      } else {
        evt.returnValue = false;
      }
      return false;
    },
    start: function() {
      var diff, t;
      this.loadCommands();
      if (this.isBookmarklet) {
        this.window = window;
        this.doc = document;
      } else {
        this.doc = (gContextMenu ? gContextMenu.target.ownerDocument : window._content.document);
        this.window = window._content;
      }
      if (this.doc.aardvarkRunning) {
        this.quit();
      } else {
        this.makeElems();
        this.selectedElem = null;
        this.doc.aardvarkRunning = true;
        if (this.doc.all) {
          this.doc.attachEvent("onmouseover", this.mouseOver);
          this.doc.attachEvent("onmousemove", this.mouseMove);
          this.doc.attachEvent("onmouseup", this.mouseUp);
          this.doc.attachEvent("onkeypress", this.keyDown);
        } else {
          this.doc.addEventListener("mouseover", this.mouseOver, false);
          this.doc.addEventListener("mouseup", this.mouseUp, false);
          this.doc.addEventListener("mousemove", this.mouseMove, false);
          this.doc.addEventListener("keypress", this.keyDown, false);
        }
        if (!this.isBookmarklet) {
          t = new Date().getTime() / (1000 * 60);
          diff = t - this.tipLastShown;
          if (diff > 60) {
            this.tipLastShown = Math.round(t);
            this.prefManager.setIntPref("extensions.aardvark@rob.brown.tipLastShown", this.tipLastShown);
            return this.showHelpTip();
          }
        }
      }
    }
  });
}).call(this);
