(function() {
  aardvark.loadObject({
    setElementStyleDefault: function(elem, bgColor) {
      var s;
      s = elem.style;
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
      return s.paddingRight = "5px";
    },
    getPos: function(elem) {
      var leftX, leftY, originalElement, pos;
      pos = {};
      originalElement = elem;
      leftX = 0;
      leftY = 0;
      if (elem.offsetParent) {
        while (elem.offsetParent) {
          leftX += elem.offsetLeft;
          leftY += elem.offsetTop;
          if (elem !== originalElement && elem !== document.body && elem !== document.documentElement) {
            leftX -= elem.scrollLeft;
            leftY -= elem.scrollTop;
          }
          elem = elem.offsetParent;
        }
      } else if (elem.x) {
        leftX += elem.x;
        leftY += elem.y;
      }
      pos.x = leftX;
      pos.y = leftY;
      return pos;
    },
    setAardvarkElem: function(elem) {
      var i, _results;
      if (elem.nodeType === 1) {
        i = 0;
        _results = [];
        while (i < elem.childNodes.length) {
          elem.isAardvark = true;
          this.setAardvarkElem(elem.childNodes.item(i));
          _results.push(i++);
        }
        return _results;
      }
    },
    setHandler: function(obj, eventName, code) {
      if (aardvark.doc.all) {
        return obj.attachEvent("on" + eventName, code);
      } else {
        return obj.addEventListener(eventName, code, false);
      }
    },
    moveElem: function(o, x, y) {
      o = o.style;
      if (aardvark.doc.all) {
        o.pixelLeft = x;
        return o.pixelTop = y;
      } else {
        o.left = x + "px";
        return o.top = y + "px";
      }
    },
    getElemFromEvent: function(evt) {
      if (evt.target) {
        return evt.target;
      } else {
        return evt.srcElement;
      }
    },
    getWindowDimensions: function() {
      var out;
      out = {};
      if (aardvark.window.pageXOffset) {
        out.scrollX = aardvark.window.pageXOffset;
        out.scrollY = aardvark.window.pageYOffset;
      } else if (aardvark.doc.documentElement) {
        out.scrollX = aardvark.doc.body.scrollLeft + aardvark.doc.documentElement.scrollLeft;
        out.scrollY = aardvark.doc.body.scrollTop + aardvark.doc.documentElement.scrollTop;
      } else if (aardvark.doc.body.scrollLeft >= 0) {
        out.scrollX = aardvark.doc.body.scrollLeft;
        out.scrollY = aardvark.doc.body.scrollTop;
      }
      if (aardvark.doc.compatMode === "BackCompat") {
        out.width = aardvark.doc.body.clientWidth;
        out.height = aardvark.doc.body.clientHeight;
      } else {
        out.width = aardvark.doc.documentElement.clientWidth;
        out.height = aardvark.doc.documentElement.clientHeight;
      }
      return out;
    },
    leafElems: {
      IMG: true,
      HR: true,
      BR: true,
      INPUT: true
    },
    getOuterHtml: function(node) {
      var i, isLeaf, str;
      str = "";
      switch (node.nodeType) {
        case 1:
          isLeaf = node.childNodes.length === 0 && aardvark.leafElems[node.nodeName];
          str += "<" + node.nodeName.toLowerCase() + " ";
          i = 0;
          while (i < node.attributes.length) {
            if ((node.attributes.item(i).nodeValue != null) && node.attributes.item(i).nodeValue !== "") {
              str += node.attributes.item(i).nodeName + "='" + node.attributes.item(i).nodeValue + "' ";
            }
            i++;
          }
          if (isLeaf) {
            str += " />";
          } else {
            str += ">";
            i = 0;
            while (i < node.childNodes.length) {
              str += aardvark.getOuterHtml(node.childNodes.item(i));
              i++;
            }
            str += "</" + node.nodeName.toLowerCase() + ">";
          }
          break;
        case 3:
          str += node.nodeValue;
      }
      return str;
    },
    createCSSRule: function(selector, declaration) {
      var a, i, isIE, last_style_node, style_node, ua, _results;
      ua = navigator.userAgent.toLowerCase();
      isIE = (/msie/.test(ua)) && !(/opera/.test(ua)) && (/win/.test(ua));
      style_node = aardvark.doc.createElement("style");
      style_node.setAttribute("type", "text/css");
      style_node.setAttribute("media", "screen");
      style_node.isAardvark = true;
      if (!isIE) {
        style_node.appendChild(aardvark.doc.createTextNode(selector + " {" + declaration + "}"));
      }
      aardvark.doc.getElementsByTagName("head")[0].appendChild(style_node);
      if (isIE && aardvark.doc.styleSheets && aardvark.doc.styleSheets.length > 0) {
        last_style_node = aardvark.doc.styleSheets[aardvark.doc.styleSheets.length - 1];
        if (typeof last_style_node.addRule === "object") {
          a = selector.split(",");
          i = 0;
          _results = [];
          while (i < a.length) {
            last_style_node.addRule(a[i], declaration);
            _results.push(i++);
          }
          return _results;
        }
      }
    },
    trimSpaces: function(s) {
      while (s.charAt(0) === " ") {
        s = s.substring(1);
      }
      while (s.charAt(s.length - 1) === " ") {
        s = s.substring(0, s.length - 1);
      }
      return s;
    },
    escapeForJavascript: function(s) {
      return s.replace(new RegExp("\n", "g"), " ").replace(new RegExp("\t", "g"), " ").replace(new RegExp("\"", "g"), "\\\"").replace(new RegExp("'", "g"), "\\'").replace(new RegExp("<", "g"), "&lt;").replace(new RegExp(">", "g"), "&gt;");
    }
  });
}).call(this);
