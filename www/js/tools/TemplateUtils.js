TemplateUtils = {

 //-------------------------------------
 getElementHtml: function (elem, clean, doc) {
  if(doc == null)
    doc = document;
  var clone = elem.cloneNode(true);
  var parent = elem.parentNode;
  if (clean) {
    // temp add elem to document so css stuff is correct
    // while determining if we can rip out whitespace
    var oldNode = parent.replaceChild(clone, elem);
    
    this.stripUnneededTextNodes(clone);
    clone.removeAttribute("wmitemplate");
    parent.replaceChild(elem, clone);
    }
  var p = doc.createElement (parent.tagName);
  p.appendChild(clone);
  return this.addClosingSlashes(p.innerHTML);
  },


 //-------------------------------------
 getElementHtmlPretty: function (elem, clean, doc) {
  if(doc == null)
    doc = document;
  var clone = elem.cloneNode(true);
  var parent = elem.parentNode;
  if (clean) {
    // temp add elem to document so css stuff is correct
    // while determining if we can rip out whitespace
    var oldNode = parent.replaceChild(clone, elem);
    
    this.stripUnneededTextNodesNew(clone);
    clone.removeAttribute("wmitemplate");
    parent.replaceChild(elem, clone);
    }
  var p = doc.createElement (parent.tagName);
  p.appendChild(clone);
  return this.addClosingSlashes(p.innerHTML);
  },


 //---------------------------
 fuzzyIndexOf : function (needle, haystack, start) {
  if(start==null)
    start = 0;
  var nLen = needle.length, hLen = haystack.length,
    firstChar = needle.charAt(0);
  var h1 = start, h2 = 0, nI; 
  for (var h1=0; h1<hLen; h1++){
    if (haystack.charAt(h1) == firstChar) {
      var a = [h1];
      nI = 1;
      for (var h2=h1+1; h2<hLen; h2++){
        var c = haystack.charAt(h2);
        var nc = needle.charAt(nI);
        if (c == nc || (nc == "'" && c == '"')) {
          a.push(h2);
          nI++;
          }
        else if (c == ' ' || c == '\t' || c == '\n') {
          }
        else {
          break; 
          }
        if (nI == nLen)
          return a;
        }
      }
    }
  return null; 
  },

 //---------------------------
 stripUnneededTextNodes: function (elem, doc) {
  if(doc == null)
    doc = document;
    
  var array = [];
  var recurse = function (node, depth, array, doc, thisFunc) {
    if(doc == null)
      doc = document;
    switch (node.nodeType) {
      case 1: {
        var display = doc.defaultView.getComputedStyle (node, null).display;
        array.push ({type: "startelem", tag: node.tagName, display: display, depth: depth});
  
        if (node.childNodes && node.childNodes.length != 0) {
           for (var i=0; i<node.childNodes.length; i++)
              thisFunc(node.childNodes.item(i), depth+1, array, doc, thisFunc);
          }
        array.push ({type: "endelem", tag: node.tagName, display: display, depth: depth});
        }
        break;
        
      case 3: {
        var newVal = node.nodeValue.replace(/\s+/g, ' ');
        node.nodeValue = newVal;
        if (newVal == ' ')
          array.push ({type: "whitespace", node: node, depth: depth});
        else if (newVal == '')
          array.push ({type: "emptytext", depth: depth});
        else
          array.push ({type: "text", node: node, display: "inline", depth: depth});
        }
        break;
      }
    };
  recurse(elem, 1, array, doc, recurse);
  for (var i=1; i<array.length-1; i++) {
    if (array[i].type == "whitespace") {
      if (array[i-1].display == "inline" && array[i+1].display == "inline") {
        array[i].node.nodeValue = ' ';
        }
      else {
        array[i].node.nodeValue = '';
        array[i].killed = true;
        }          
      delete array[i].node;
      }
    else if (array[i].type == "text") {
      var val = array[i].node.nodeValue;
      if (val.charAt(0) == ' ' && array[i-1].display != "inline") {
        array[i].node.nodeValue = val = val.substring(1);
        }
      if (val.charAt(val.length-1) == ' ' && array[i+1].display != "inline") {
        array[i].node.nodeValue = val.substring(0, val.length-1);
        }
      delete array[i].node;
      }
    }
  },

 //---------------------------
 stripUnneededTextNodesNew: function (elem, doc) {
  if(doc == null)
    doc = document;
    
  var array = [];
  var recurse = function (node, depth, array, doc, thisFunc) {
    if(doc == null)
      doc = document;
    switch (node.nodeType) {
      case 1: {
        var display = doc.defaultView.getComputedStyle (node, null).display;
        array.push ({type: "startelem", node: node, tag: node.tagName, display: display, depth: depth});
  
        if (node.childNodes && node.childNodes.length != 0) {
           for (var i=0; i<node.childNodes.length; i++)
              thisFunc(node.childNodes.item(i), depth+1, array, doc, thisFunc);
          }
        array.push ({type: "endelem", tag: node.tagName, display: display, depth: depth});
        }
        break;
        
      case 3: {
        var newVal = node.nodeValue.replace(/\s+/g, ' ');
        node.nodeValue = newVal;
        if (newVal == ' ')
          array.push ({type: "whitespace", node: node, depth: depth});
        else if (newVal == '')
          array.push ({type: "emptytext", depth: depth});
        else
          array.push ({type: "text", node: node, display: "inline", depth: depth});
        }
        break;
      }
    };
  recurse(elem, 1, array, doc, recurse);
  
  for (var i=1; i<array.length-1; i++) {
    if (array[i].type == "whitespace") {
      if (array[i-1].display == "inline" && array[i+1].display == "inline") {
        array[i].node.nodeValue = ' ';
        }
      else {
        array[i].node.nodeValue = '';
        array[i].killed = true;
        }          
      delete array[i].node;
      }
    else if (array[i].type == "text") {
      var val = array[i].node.nodeValue;
      if (val.charAt(0) == ' ' && array[i-1].display != "inline") {
        array[i].node.nodeValue = val = val.substring(1);
        }
      if (val.charAt(val.length-1) == ' ' && array[i+1].display != "inline") {
        array[i].node.nodeValue = val.substring(0, val.length-1);
        }
      delete array[i].node;
      }
    }
 
  
  
  /*for (var i=1; i<array.length-1; i++) {
    if (array[i].type == "startelem" && array[i].display != "inline" && array[i].depth > 0) {
      var e = array[i].node;
      var p = e.parentNode;
      var s = '\n';
      var d = array[i].depth;
      //alert(array[i].depth);
      for (var j=0; j<array[i].depth; j++)
        s += ' ';
      p.insertBefore(doc.createTextNode(s), e);
      if(e.nextSibling)
        p.insertBefore(doc.createTextNode('\n'), e.nextSibling);
      }
    } */
  
  },
  
 removeComments: function (node){
    var i=0, cNodes=node.childNodes, t;
    while((t=cNodes.item(i++)))
        switch(t.nodeType){
            case 1:
                this.removeComments(t);
                break;
            case 8:
                node.removeChild(t);
                i--;
        }
  },

 //------------------------------------
 buildVarSelectorFromString : function (selString) {
    var pipe1 = selString.indexOf ("|");
    var startEllipsis = selString.indexOf("...", pipe1+1);
    var pipe2;
    if (startEllipsis != -1) {
      var endEllipsis = startEllipsis + 1;
      while (selString.charAt(endEllipsis) == '.')
        endEllipsis++;
      pipe2 = selString.indexOf("|", endEllipsis);
      return {
        s1 : selString.substring(0, pipe1) + selString.substring(pipe1+1, startEllipsis),
        s2: selString.substring(endEllipsis, pipe2) + selString.substring(pipe2+1),
        i1 : pipe1,
        i2 : pipe2 - endEllipsis
        };
      }
    else {
      pipe2 = selString.indexOf("|", pipe1+1);
      return {
        s : selString.substring(0, pipe1) + selString.substring(pipe1+1, pipe2) + selString.substring(pipe2+1),
        i1 : pipe1,
        i2 : pipe2
        };
      }
    },

  //------------------------------------
  // given a "sel" structure and an html string, find 
  // start and end indices for that variable 
  findIndicesForTemplateVarExp : function (sel, string) {
	  if (sel.s) {
	    var i = this.fuzzyIndexOf(sel.s, string);
      if (i == -1)
        return {err: 1};
      return {s: i+sel.i1, e: i+sel.i2-1};
      }
	  else {
      var i1 = this.fuzzyIndexOf(sel.s1, string);
      if (i1 == -1)
        return {err: 2};
      var i2 = this.fuzzyIndexOf(sel.s2, string, i1);
      if (i2 == -1)
        return {err: 3};
      return {s: i1+sel.i1, e: i2+sel.i2};
      }
    },
    
 //------------------------------------
  // given a "sel" structure and an html string, find 
  // start and end indices for that variable 
  findIndicesForTemplateVar : function (sel, string) {
	  if (sel.s) {
	    var i = string.indexOf(sel.s);
      if (i == -1)
        return {err: 1};
      return {s: i+sel.i1, e: i+sel.i2-1};
      }
	  else {
      var i1 = string.indexOf(sel.s1);
      if (i1 == -1)
        return {err: 2};
      var i2 = string.indexOf(sel.s2, i1);
      if (i2 == -1)
        return {err: 3};
      return {s: i1+sel.i1, e: i2+sel.i2};
      }
    },
    
  //------------------------------------
  getAllByClassAndTag: function (className, tagName, which) {
    if(which == null)
      which = document;
    var a1 = which.getElementsByTagName(tagName), a2 = [];
    for (var i=0; i<a1.length; i++) {
      var item = a1[i];
      if (item.className.indexOf(className) != -1)
       a2.push(item);
      }
    return a2;
    },
  
  //----------------------------------------
  replaceItems : function (doc) { 
    var a = this.getAllByClassAndTag ("callout top", "DIV", doc);
    if (a.length == 1) {
     var orig = a[0];
    
     var a = this.getAllByClassAndTag ("rounded_callout", "DIV", doc);
     for (var i=0; i < a.length; i++) {
      var item = a[i];
      var clone = orig.cloneNode(true);
      var x = this.getAllByClassAndTag ("content", "DIV", clone);
      x[0].innerHTML = item.innerHTML; 
      clone.className = clone.className + " " +
          item.className.replace ("rounded_callout", "");
      item.parentNode.replaceChild(clone, item);
      }
     }
   },
   
  //----------------------------------------
  replaceItems2 : function (doc) { 
    var a = this.getAllByClassAndTag ("subnav", "DIV", doc);
    if (a.length > 1) {
     for (var i=1; i < a.length; i++) {
      var item = a[i];
      var e = document.createElement ("div");
      e.className = "menu_placeholder";
      e.innerHTML = "(nav menu)";
      
      //e = a[0].cloneNode(true);
      item.parentNode.replaceChild(e, item);
      }
     }
   }, 
   
  //-------------------------------------
  extractTemplate: function (template, name, def, elem, errs) {
    var positions = [];
    var names = [];
    template.html = this.getElementHtml(elem, true, TemplateManager.editWin.document);
    var count = 0;
    for (var tVarName in def) {
      var tVarDef = def[tVarName];
      var sel = this.buildVarSelectorFromString (tVarDef); 
      // Logger.write (tVarName);
      // Logger.write (sel);
      var indices = this.findIndicesForTemplateVar(sel, template.html);
      if(indices.err == null) {
        indices.nameIndex = positions.length;
        names.push(tVarName);
        positions.push(indices);
        }
      else  {
        errs.push({err: indices.err, templateName: name, varName: tVarName, sel: sel});
        }
      count++;
      }
    positions.sort (function (a, b) {
        return a.s - b.s;
        });
    template.names = names;
    template.positions = positions;
    // Logger.write (tVarName);
    // Logger.write (sel);
//    if (count == 0)
 //     Logger.write(template);
    template.count = count;
    return null; // success
    },
  
  //-------------------------------------
  extractAllTemplates : function (tDefs, doc, errs) {
    var templates = {};
    for (var i in tDefs) {
      templates[i] = {}; // this keeps them in the same order
      }
    var d = doc;
    var a = d.getElementsByTagName("*");
    for (var i=0; i<a.length; i++) {
     var tName;
     if ((tName = a[i].getAttribute("wmitemplate")) != null) {
      if (templates[tName] != null) {
        this.extractTemplate (templates[tName], tName, tDefs[tName], a[i], errs);
        } 
      }
     }
    return templates;
    },
    
  //-----------------------------------------
  // todo: greater than in quotes
  addClosingSlashes : function (htmlString) {
    var elemTypes = [
      "area", "base", "br", "col", "embed", 
      "hr", "img", "input", "link", "meta", "param"
      ];
    var inString, outString = htmlString;
    for (var i=0; i<elemTypes.length; i++) {
      var index1 = 0, index2;
      inString = outString;
      outString = '';
      while ((index1 = inString.indexOf("<" + elemTypes[i])) != -1) {
        if ((index2 = inString.indexOf(">", index1)) != -1) {
          if (inString.charAt(index2-1) == '/') 
            outString += inString.substring(0, index2) + ">";
          else
            outString += inString.substring(0, index2) + " />";
          inString = inString.substring(index2+1);
          }
        else {
          break;      
          }
        }
      outString += inString;
      }
    return outString;
    },
    
    
  makeGreekText: function (words, sentences, paragraphs) {
    var w = "lorem ipsum dolor sit amet consectetaur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum et harumd und lookum like Greek to me dereud facilis est er expedit distinct nam liber te conscient to factor tum poen legum odioque civiuda";
    var s = "", a = w.split(" "), len = a.length; 
    // = Math.round(Math.random() * 3) + 1
    
    if (words == null)
      words = 5;
    
    if (sentences == null)
      sentences = 1;
    
    if (paragraphs == null)
      paragraphs = 1;
    
    for (var i=0; i<paragraphs; i++) {
       var sents = sentences; // Math.round (Math.random()*sentences) + 1;
       for (var j=0; j<sents; j++) {
          w = Math.floor(Math.random()*words) || 1;
          var t = a[Math.round (Math.random()*(len-0.5))];
          s += t.charAt(0).toUpperCase() + t.substring (1) + " ";
          for (var k=1; k<w; k++) {
             s += a[Math.round (Math.random()*(len-0.5))] + " "; 
             }
          s +=a[Math.round (Math.random()*(len-0.5))] + ((sentences==1)?"":".  ");     
          }
       s = s.substring(0, s.length-2) + "<br><br>";
       }
    return s.substring(0, s.length-8);
    }  
};


