(function() {
  aardvark.loadObject({
    keyCommands: [],
    loadCommands: function() {
      var i, keyCommands, _results;
      if (this.keyCommands.length > 0) {
        return;
      }
      keyCommands = [["wider", this.wider], ["narrower", this.narrower], ["undo", this.undo, true], ["quit", this.quit, true], ["remove", this.removeElement], ["kill", this.rip, null, "extension"], ["isolate", this.isolateElement], ["black on white", this.blackOnWhite], ["deWidthify", this.deWidthify], ["colorize", this.colorize], ["view source", this.viewSource], ["javascript", this.makeJavascript], ["paste", this.paste], ["help", this.showMenu, true], ["xpath", this.getElementXPath], ["global", this.makeGlobalFromElement]];
      i = 0;
      _results = [];
      while (i < keyCommands.length) {
        this.addCommand.apply(this, keyCommands[i]);
        _results.push(i++);
      }
      return _results;
    },
    addCommand: function(name, func, noElementNeeded, mode, keystroke) {
      var command, keyOffset;
      if (this.isBookmarklet) {
        if (mode === "extension") {
          return;
        }
      } else {
        if (mode === "bookmarklet") {
          return;
        }
      }
      if (this.strings[name] && this.strings[name] !== "") {
        name = this.strings[name];
      }
      if (keystroke) {
        keyOffset = -1;
      } else {
        keyOffset = name.indexOf("&");
        if (keyOffset !== -1) {
          keystroke = name.charAt(keyOffset + 1);
          name = name.substring(0, keyOffset) + name.substring(keyOffset + 1);
        } else {
          keystroke = name.charAt(0);
          keyOffset = 0;
        }
      }
      command = {
        name: name,
        keystroke: keystroke,
        keyOffset: keyOffset,
        func: func
      };
      if (noElementNeeded) {
        command.noElementNeeded = true;
      }
      return this.keyCommands.push(command);
    },
    rip: function(elem) {
      var dbox;
      if (window.RemoveItPermanently) {
        RemoveItPermanently.doRipNode(elem);
      } else {
        dbox = new AardvarkDBox("#fff", true);
        dbox.innerContainer.innerHTML = this.strings.ripHelp;
        dbox.show();
      }
      return true;
    },
    wider: function(elem) {
      var newElem;
      if (elem && elem.parentNode) {
        newElem = this.findValidElement(elem.parentNode);
        if (!newElem) {
          return false;
        }
        if (this.widerStack && this.widerStack.length > 0 && this.widerStack[this.widerStack.length - 1] === elem) {
          this.widerStack.push(newElem);
        } else {
          this.widerStack = [elem, newElem];
        }
        this.selectedElem = newElem;
        this.showBoxAndLabel(newElem, this.makeElementLabelString(newElem));
        this.didWider = true;
        return true;
      }
      return false;
    },
    narrower: function(elem) {
      var newElem;
      if (elem) {
        if (this.widerStack && this.widerStack.length > 1 && this.widerStack[this.widerStack.length - 1] === elem) {
          this.widerStack.pop();
          newElem = this.widerStack[this.widerStack.length - 1];
          this.selectedElem = newElem;
          this.showBoxAndLabel(newElem, this.makeElementLabelString(newElem));
          this.didWider = true;
          return true;
        }
      }
      return false;
    },
    quit: function() {
      this.doc.aardvarkRunning = false;
      if (this.doc.all) {
        this.doc.detachEvent("onmouseover", this.mouseOver);
        this.doc.detachEvent("onmousemove", this.mouseMove);
        this.doc.detachEvent("onkeypress", this.keyDown);
        this.doc.detachEvent("onmouseup", this.mouseUp, false);
      } else {
        this.doc.removeEventListener("mouseover", this.mouseOver, false);
        this.doc.removeEventListener("mousemove", this.mouseMove, false);
        this.doc.removeEventListener("mouseup", this.mouseUp, false);
        this.doc.removeEventListener("keypress", this.keyDown, false);
      }
      this.removeBoxFromBody();
      delete this.selectedElem;
      if (this.widerStack) {
        delete this.widerStack;
      }
      return true;
    },
    suspend: function() {
      if (this.doc.all) {
        this.doc.detachEvent("onmouseover", this.mouseOver);
        this.doc.detachEvent("onkeypress", this.keyDown);
      } else {
        this.doc.removeEventListener("mouseover", this.mouseOver, false);
        this.doc.removeEventListener("keypress", this.keyDown, false);
      }
      return true;
    },
    resume: function() {
      if (this.doc.all) {
        this.doc.attachEvent("onmouseover", this.mouseOver);
        this.doc.attachEvent("onkeypress", this.keyDown);
      } else {
        this.doc.addEventListener("mouseover", this.mouseOver, false);
        this.doc.addEventListener("keypress", this.keyDown, false);
      }
      return true;
    },
    viewSource: function(elem) {
      var dbox, v;
      dbox = new AardvarkDBox("#fff", true, false, false, this.strings.viewHtmlSource, true);
      v = this.getOuterHtmlFormatted(elem, 0);
      dbox.innerContainer.innerHTML = v;
      if (!this.doc.didViewSourceDboxCss) {
        this.createCSSRule("div.aardvarkdbox div", "font-size: 13px; margin: 0; padding: 0;");
        this.createCSSRule("div.aardvarkdbox div.vsblock", "font-size: 13px; border: 1px solid #ccc; border-right: 0;margin: -1px 0 -1px 1em; padding: 0;");
        this.createCSSRule("div.aardvarkdbox div.vsline", "font-size: 13px; border-right: 0;margin: 0 0 0 .6em;text-indent: -.6em; padding: 0;");
        this.createCSSRule("div.aardvarkdbox div.vsindent", "font-size: 13px; border-right: 0;margin: 0 0 0 1.6em;text-indent: -.6em; padding: 0;");
        this.createCSSRule("div.aardvarkdbox span.tag", "color: #c00;font-weight:bold;");
        this.createCSSRule("div.aardvarkdbox span.pname", "color: #080;font-weight: bold;");
        this.createCSSRule("div.aardvarkdbox span.pval", "color:#00a;font-weight: bold;");
        this.createCSSRule("div.aardvarkdbox span.aname", "color: #050;font-style: italic;font-weight: normal;");
        this.createCSSRule("div.aardvarkdbox span.aval", "color:#007;font-style: italic;font-weight: normal;");
        this.doc.didViewSourceDboxCss = true;
      }
      dbox.show();
      return true;
    },
    colorize: function(elem) {
      elem.style.backgroundColor = "#" + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16);
      elem.style.backgroundImage = "";
      return true;
    },
    removeElement: function(elem) {
      var tmpUndoData;
      if (elem.parentNode != null) {
        tmpUndoData = {
          next: this.undoData,
          mode: "R",
          elem: elem,
          parent: elem.parentNode,
          nextSibling: elem.nextSibling
        };
        this.undoData = tmpUndoData;
        elem.parentNode.removeChild(elem);
        this.clearBox();
        return true;
      }
      return false;
    },
    paste: function(o) {
      var a, e, i, len, t, t2, tb;
      if (o.parentNode != null) {
        if (this.undoData.mode === "R") {
          e = this.undoData.elem;
          if (e.nodeName === "TR" && o.nodeName !== "TR") {
            t = this.doc.createElement("TABLE");
            tb = this.doc.createElement("TBODY");
            t.appendChild(tb);
            tb.appendChild(e);
            e = t;
          } else if (e.nodeName === "TD" && o.nodeName !== "TD") {
            t2 = this.doc.createElement("DIV");
            len = e.childNodes.length;
            a = [];
            i = 0;
            while (i < len) {
              a[i] = e.childNodes.item(i);
              i++;
            }
            i = 0;
            while (i < len) {
              e.removeChild(a[i]);
              t2.appendChild(e);
              i++;
            }
            t2.appendChild(e);
            e = t2;
          }
          if (o.nodeName === "TD" && e.nodeName !== "TD") {
            o.insertBefore(e, o.firstChild);
          } else if (o.nodeName === "TR" && e.nodeName !== "TR") {
            o.insertBefore(e, o.firstChild.firstChild);
          } else {
            o.parentNode.insertBefore(e, o);
          }
          this.clearBox();
          this.undoData = this.undoData.next;
        }
      }
      return true;
    },
    isolateElement: function(o) {
      var clone, count, div, e, i, len, newTd, t, tb, td, tmpUndoData, tr;
      if (o.parentNode != null) {
        this.clearBox();
        if (document.all) {
          if (o.tagName === "TR" || o.tagName === "TD") {
            t = this.doc.createElement("TABLE");
            tb = this.doc.createElement("TBODY");
            t.appendChild(tb);
            if (o.tagName === "TD") {
              tr = this.doc.createElement("TR");
              td = this.doc.createElement("TD");
              td.innerHTML = o.innerHTML;
              tr.appendChild(td);
              tb.appendChild(tr);
            } else {
              tr = this.doc.createElement("TR");
              len = o.childNodes.length;
              i = 0;
              while (i < len) {
                td = o.childNodes.item(i);
                if (td.nodeName === "TD") {
                  newTd = this.doc.createElement("TD");
                  newTd.innerHTML = td.innerHTML;
                  tr.appendChild(newTd);
                }
                i++;
              }
              tb.appendChild(tr);
            }
            clone = t;
          } else {
            div = document.createElement("DIV");
            div.innerHTML = o.outerHTML;
            clone = div.firstChild;
          }
        } else {
          clone = o.cloneNode(true);
        }
        clone.style.textAlign = "";
        clone.style.cssFloat = "none";
        clone.style.styleFloat = "none";
        clone.style.position = "";
        clone.style.padding = "5px";
        clone.style.margin = "5px";
        if (clone.tagName === "TR" || clone.tagName === "TD") {
          if (clone.tagName === "TD") {
            tr = this.doc.createElement("TR");
            tr.appendChild(clone);
            clone = tr;
          }
          t = this.doc.createElement("TABLE");
          tb = this.doc.createElement("TBODY");
          t.appendChild(tb);
          tb.appendChild(clone);
          clone = t;
        }
        tmpUndoData = [];
        len = this.doc.body.childNodes.length;
        count = 0;
        i = 0;
        while (i < len) {
          e = this.doc.body.childNodes.item(i);
          if (!e.isAardvark) {
            tmpUndoData[count] = e;
            count++;
          }
          i++;
        }
        tmpUndoData.numElems = count;
        i = count - 1;
        while (i >= 0) {
          this.doc.body.removeChild(tmpUndoData[i]);
          i--;
        }
        tmpUndoData.mode = "I";
        tmpUndoData.bg = this.doc.body.style.background;
        tmpUndoData.bgc = this.doc.body.style.backgroundColor;
        tmpUndoData.bgi = this.doc.body.style.backgroundImage;
        tmpUndoData.m = this.doc.body.style.margin;
        tmpUndoData.ta = this.doc.body.style.textAlign;
        tmpUndoData.next = this.undoData;
        this.undoData = tmpUndoData;
        this.doc.body.style.width = "100%";
        this.doc.body.style.background = "none";
        this.doc.body.style.backgroundColor = "white";
        this.doc.body.style.backgroundImage = "none";
        this.doc.body.style.textAlign = "left";
        this.doc.body.appendChild(clone);
        this.window.scroll(0, 0);
      }
      return true;
    },
    deWidthify: function(node, skipClear) {
      var i, isLeaf;
      switch (node.nodeType) {
        case 1:
          if (node.tagName !== "IMG") {
            node.style.width = "auto";
            if (node.width) {
              node.width = null;
            }
          }
          isLeaf = node.childNodes.length === 0 && this.leafElems[node.nodeName];
          if (!isLeaf) {
            i = 0;
            while (i < node.childNodes.length) {
              this.deWidthify(node.childNodes.item(i));
              i++;
            }
          }
      }
      if (!skipClear) {
        this.clearBox();
      }
      return true;
    },
    blackOnWhite: function(node, isLink) {
      var i, isLeaf;
      switch (node.nodeType) {
        case 1:
          if (node.tagName !== "IMG") {
            if (node.tagName === "A") {
              isLink = true;
            }
            node.style.color = "#000";
            if (isLink) {
              node.style.textDecoration = "underline";
            }
            node.style.backgroundColor = "#fff";
            node.style.fontFamily = "arial";
            node.style.fontSize = "13px";
            node.style.textAlign = "left";
            node.align = "left";
            node.style.backgroundImage = "";
            isLeaf = node.childNodes.length === 0 && this.leafElems[node.nodeName];
            if (!isLeaf) {
              i = 0;
              while (i < node.childNodes.length) {
                this.blackOnWhite(node.childNodes.item(i), isLink);
                i++;
              }
            }
          }
      }
      return true;
    },
    getOuterHtmlFormatted: function(node, indent) {
      var a, i, isLeaf, isTbody, j, pair, s, str, styles, v;
      str = "";
      if (this.doc.all) {
        return "<pre>" + node.outerHTML.replace(/\</g, "&lt;").replace(/\>/g, "&gt;") + "</pre>";
      }
      switch (node.nodeType) {
        case 1:
          if (node.style.display === "none") {
            break;
          }
          isLeaf = node.childNodes.length === 0 && this.leafElems[node.nodeName];
          isTbody = node.nodeName === "TBODY" && node.attributes.length === 0;
          if (isTbody) {
            i = 0;
            while (i < node.childNodes.length) {
              str += this.getOuterHtmlFormatted(node.childNodes.item(i), indent);
              i++;
            }
          } else {
            if (isLeaf) {
              str += "\n<div class='vsindent'>\n";
            } else if (indent > 0) {
              str += "\n<div class='vsblock' style=''>\n<div class='vsline'>\n";
            } else {
              str += "\n<div class='vsline'>\n";
            }
            str += "&lt;<span class='tag'>" + node.nodeName.toLowerCase() + "</span>";
            i = 0;
            while (i < node.attributes.length) {
              if ((node.attributes.item(i).nodeValue != null) && node.attributes.item(i).nodeValue !== "") {
                str += " <span class='pname'>";
                str += node.attributes.item(i).nodeName;
                if (node.attributes.item(i).nodeName === "style") {
                  styles = "";
                  a = node.attributes.item(i).nodeValue.split(";");
                  j = 0;
                  while (j < a.length) {
                    pair = a[j].split(":");
                    if (pair.length === 2) {
                      s = this.trimSpaces(pair[0]);
                      styles += "; <span class='aname'>" + s + "</span>: <span class='aval'>" + this.trimSpaces(pair[1]) + "</span>";
                    }
                    j++;
                  }
                  styles = styles.substring(2);
                  str += "</span>=\"" + styles + "\"";
                } else {
                  str += "</span>=\"<span class='pval'>" + node.attributes.item(i).nodeValue + "</span>\"";
                }
              }
              i++;
            }
            if (isLeaf) {
              str += " /&gt;\n</div>\n";
            } else {
              str += "&gt;\n</div>\n";
              i = 0;
              while (i < node.childNodes.length) {
                str += this.getOuterHtmlFormatted(node.childNodes.item(i), indent + 1);
                i++;
              }
              str += "\n<div class='vsline'>\n&lt;/<span class='tag'>" + node.nodeName.toLowerCase() + "</span>&gt;\n</div>\n</div>\n";
            }
          }
          break;
        case 3:
          v = node.nodeValue;
          v = v.replace("<", "&amp;lt;").replace(">", "&amp;gt;");
          v = this.trimSpaces(v);
          if (v !== "" && v !== "\n" && v !== "\r\n" && v.charCodeAt(0) !== 160) {
            str += "<div class='vsindent'>" + v + "</div>";
          }
          break;
        case 4:
          str += "<div class='vsindent'>&lt;![CDATA[" + node.nodeValue + "]]></div>";
          break;
        case 5:
          str += "&amp;" + node.nodeName + ";<br>";
          break;
        case 8:
          str += "<div class='vsindent'>&lt;!--" + node.nodeValue + "--></div>";
      }
      return str;
    },
    camelCaseProps: {
      colspan: "colSpan",
      rowspan: "rowSpan",
      accesskey: "accessKey",
      "class": "className",
      "for": "htmlFor",
      tabindex: "tabIndex",
      maxlength: "maxLength",
      readonly: "readOnly",
      frameborder: "frameBorder",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding"
    },
    domJavascript: function(node, indent) {
      var a, c, children, i, ih, indentStr, index, isLeaf, j, n, newIn, numChildren, numProps, pair, properties, s, sCount, str, styles, t, useInnerHTML, v;
      indentStr = "";
      c = 0;
      while (c < indent) {
        indentStr += "  ";
        c++;
      }
      switch (node.nodeType) {
        case 1:
          if (node.style.display === "none") {
            break;
          }
          isLeaf = node.childNodes.length === 0 && this.leafElems[node.nodeName];
          children = "";
          numChildren = 0;
          useInnerHTML = false;
          if (!isLeaf) {
            i = 0;
            while (i < node.childNodes.length) {
              t = this.domJavascript(node.childNodes.item(i), indent + 1);
              if (t === "useInnerHTML") {
                useInnerHTML = true;
                break;
              }
              if (t) {
                children += indentStr + "  " + t + ",\n";
                numChildren++;
              }
              i++;
            }
            if (numChildren && !useInnerHTML) {
              children = children.substring(0, children.length - 2) + "\n";
            }
          }
          properties = "";
          styles = "";
          numProps = 0;
          sCount = 0;
          i = 0;
          while (i < node.attributes.length) {
            if ((node.attributes.item(i).nodeValue != null) && node.attributes.item(i).nodeValue !== "") {
              n = node.attributes.item(i).nodeName;
              v = node.attributes.item(i).nodeValue;
              switch (n) {
                case "style":
                  a = node.attributes.item(i).nodeValue.split(";");
                  j = 0;
                  while (j < a.length) {
                    pair = a[j].split(":");
                    if (pair.length === 2) {
                      s = this.trimSpaces(pair[0]);
                      while ((index = s.indexOf("-")) !== -1) {
                        s = s.substring(0, index) + s.charAt(index + 1).toUpperCase() + s.substring(index + 2);
                      }
                      if (s === "float") {
                        styles += ", <span style='color:#060; font-style:italic'>styleFloat</span>: \"<span style='color:#008;font-style:italic'>" + this.trimSpaces(pair[1]) + "</span>\", <span style='color:#060; font-style:italic'>cssFloat</span>: \"<span style='color:#008;font-style:italic'>" + this.trimSpaces(pair[1]) + "</span>\"";
                      } else {
                        styles += ", <span style='color:#060; font-style:italic'>" + s + "</span>: \"<span style='color:#008;font-style:italic'>" + this.trimSpaces(pair[1]) + "</span>\"";
                      }
                      sCount++;
                    }
                    j++;
                  }
                  styles = styles.substring(2);
                  break;
                default:
                  if ((newIn = this.camelCaseProps[n]) != null) {
                    n = newIn;
                  }
                  properties += ", <span style='color:#080;font-weight: bold'>" + n + "</span>:\"<span style='color:#00b;font-weight: bold'>" + v + "</span>\"";
                  numProps++;
                  break;
              }
            }
            i++;
          }
          if (useInnerHTML) {
            ih = node.innerHTML;
            if ((index = ih.indexOf("useInnerHTML")) !== -1) {
              ih = ih.substring(index + "useInnerHTML".length);
              if (index = ih.indexOf("->") !== -1) {
                ih = ih.substring(index + 3);
              }
            }
            properties += ", <span style='color:#080;font-weight: bold'>innerHTML</span>:\"<span style='color:#00b;font-weight: bold'>" + this.escapeForJavascript(ih) + "</span>\"";
            numProps++;
            numChildren = 0;
          }
          if (styles !== "") {
            properties = "{<span style='color:#080;font-weight: bold'>style</span>:{" + styles + "}" + properties + "}";
            numProps++;
          } else {
            properties = "{" + properties.substring(2) + "}";
          }
          str = "<span style='color:red;font-weight:bold'>" + node.nodeName + "</span> (";
          if (numChildren) {
            if (numProps) {
              return str + properties + ",\n" + children + indentStr + ")";
            } else {
              return str + "\n" + children + indentStr + ")";
            }
          } else if (numProps) {
            return str + properties + ")";
          } else {
            return str + ")";
          }
          break;
        case 3:
          n = node.nodeValue;
          if (node.nodeValue !== "") {
            n = this.escapeForJavascript(n);
          }
          n = this.trimSpaces(n);
          if (n.length > 0) {
            return "\"<b>" + n + "</b>\"";
          }
          break;
        case 8:
          if (node.nodeValue.indexOf("useInnerHTML") !== -1) {
            return "useInnerHTML";
          }
      }
      return null;
    },
    makeJavascript: function(elem) {
      var dbox;
      dbox = new AardvarkDBox("#fff", true, false, false, this.strings.javascriptDomCode, true);
      dbox.innerContainer.innerHTML = "<pre style=\"margin:3; width: 97%\">" + this.domJavascript(elem, 0) + "</pre><br>";
      dbox.show();
      return true;
    },
    undo: function() {
      var a, count, e, i, len, ud;
      if (this.undoData == null) {
        return false;
      }
      this.clearBox();
      ud = this.undoData;
      switch (ud.mode) {
        case "I":
          a = [];
          len = this.doc.body.childNodes.length;
          count = 0;
          i = 0;
          while (i < len) {
            e = this.doc.body.childNodes.item(i);
            if (!e.isAardvark) {
              a[count] = e;
              count++;
            }
            i++;
          }
          i = count - 1;
          while (i >= 0) {
            this.doc.body.removeChild(a[i]);
            i--;
          }
          len = this.undoData.numElems;
          i = 0;
          while (i < len) {
            this.doc.body.appendChild(this.undoData[i]);
            i++;
          }
          this.doc.body.style.background = this.undoData.bg;
          this.doc.body.style.backgroundColor = this.undoData.bgc;
          this.doc.body.style.backgroundImage = this.undoData.bgi;
          this.doc.body.style.margin = this.undoData.m;
          this.doc.body.style.textAlign = this.undoData.ta;
          break;
        case "R":
          if (ud.nextSibling) {
            ud.parent.insertBefore(ud.elem, ud.nextSibling);
          } else {
            ud.parent.appendChild(ud.elem);
          }
          break;
        default:
          return false;
      }
      this.undoData = this.undoData.next;
      return true;
    },
    showMenu: function() {
      var dbox, i, s;
      if (this.helpBoxId != null) {
        if (this.killDbox(this.helpBoxId) === true) {
          delete this.helpBoxId;
          return;
        }
      }
      s = "<table style='margin:5px 10px 0 10px'>";
      i = 0;
      while (i < this.keyCommands.length) {
        s += "<tr><td style='padding: 3px 7px; border: 1px solid black; font-family: courier; font-weight: bold;" + "background-color: #fff'>" + this.keyCommands[i].keystroke + "</td><td style='padding: 3px 7px; font-size: .9em;  text-align: left;'>" + this.keyCommands[i].name + "</td></tr>";
        i++;
      }
      s += "</table><br>" + this.strings.karmaticsPlug;
      dbox = new AardvarkDBox("#fff2db", true, true, true, this.strings.aardvarkKeystrokes);
      dbox.innerContainer.innerHTML = s;
      dbox.show();
      this.helpBoxId = dbox.id;
      return true;
    },
    getByKey: function(key) {
      var i, s;
      s = key + " - ";
      i = 0;
      while (i < this.keyCommands.length) {
        s += this.keyCommands[i].keystroke;
        if (this.keyCommands[i].keystroke === key) {
          return this.keyCommands[i];
        }
        i++;
      }
      return null;
    },
    getElementXPath: function(elem) {
      var dbox, index, path, sib, xname;
      path = "";
      while (elem && elem.nodeType === 1) {
        index = 1;
        sib = elem.previousSibling;
        while (sib) {
          if (sib.nodeType === 1 && sib.tagName === elem.tagName) {
            index++;
          }
          sib = sib.previousSibling;
        }
        xname = "xhtml:" + elem.tagName.toLowerCase();
        if (elem.id) {
          xname += "[@id='" + elem.id + "']";
        } else {
          if (index > 1) {
            xname += "[" + index + "]";
          }
        }
        path = "/" + xname + path;
        elem = elem.parentNode;
      }
      dbox = new AardvarkDBox("#fff", true, false, false, "xPath", true);
      dbox.innerContainer.innerHTML = "<pre wrap=\"virtual\" style=\"margin:3; width: 97%\">" + path + "</pre><br>";
      return dbox.show();
    },
    makeGlobalFromElement: function(elem) {
      var dbox, h, i, removeId, s, scriptElem;
      if (this.isBookmarklet) {
        i = 1;
        while (i < 100) {
          if (this.window["elem" + i] === void 0) {
            this.window["elem" + i] = elem;
            elem.tree = this.tree;
            dbox = new AardvarkDBox("#feb", false, true, true);
            dbox.innerContainer.innerHTML = "<p style='color: #000; margin: 3px 0 0 0;'>global variable \"<b>elem" + i + "</b>\" created</p>";
            dbox.show();
            setTimeout("aardvark.killDbox(" + dbox.id + ")", 2000);
            return true;
          }
          i++;
        }
      } else {
        if (this.doc.aardvarkElemNum == null) {
          this.doc.aardvarkElemNum = 1;
        } else {
          this.doc.aardvarkElemNum++;
        }
        removeId = false;
        if (!(elem.id != null) || elem.id === "") {
          elem.id = "aardvarkTmpId" + this.doc.aardvarkElemNum;
          removeId = true;
        }
        s = "window.elem" + this.doc.aardvarkElemNum + "= document.getElementById('" + elem.id + "');\n";
        if (removeId) {
          s += "document.getElementById('" + elem.id + "').id = '';";
        }
        dbox = new AardvarkDBox("#feb", false, true, true);
        dbox.innerContainer.innerHTML = "<p style='color: #000; margin: 3px 0 0 0;'>global variable \"<b>elem" + this.doc.aardvarkElemNum + "</b>\" created</p>";
        dbox.show();
        setTimeout("aardvark.killDbox(" + dbox.id + ")", 2000);
        scriptElem = this.doc.createElement("script");
        scriptElem.type = "text/javascript";
        scriptElem.appendChild(this.doc.createTextNode(s));
        h = this.doc.getElementsByTagName("head")[0];
        h.appendChild(scriptElem);
        return true;
      }
      return false;
    },
    getNextElement: function() {
      this.index++;
      if (this.index < this.list.length) {
        this.depth = this.list[this.index].depth;
        return this.list[this.index].elem;
      }
      return null;
    },
    tree: function() {
      var t;
      t = {
        list: [
          {
            elem: this,
            depth: 0
          }
        ],
        index: -1,
        depth: 0,
        next: aardvark.getNextElement
      };
      aardvark.addChildren(this, t, 1);
      return t;
    },
    addChildren: function(elem, t, depth) {
      var child, i, _results;
      i = 0;
      _results = [];
      while (i < elem.childNodes.length) {
        child = elem.childNodes[i];
        if (child.nodeType === 1) {
          t.list.push({
            elem: child,
            depth: depth
          });
          if (child.childNodes.length !== 0 && !aardvark.leafElems[child.nodeName]) {
            aardvark.addChildren(child, t, depth + 1);
          }
        }
        _results.push(i++);
      }
      return _results;
    }
  });
}).call(this);
