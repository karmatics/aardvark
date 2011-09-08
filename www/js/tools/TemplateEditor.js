TemplateEditor = {

load : function (elem, doc) {
  

  },

constructor: function (elem, doc) {
  this.doc = doc;
  this.elem = elem;
  
  this.def = {};
  this.defName = "";
  this.varName = "";
  this.currVar = {};
  var pw = new PopupWindow("template edit", "templateedit", true);
  pw.contentElem.style.width = "700px";
  pw.contentElem.style.height = "300px";
  var self = this;
  with (DomGenerator) {
    var t = TEXTAREA (
        { style: { 
          clear: "both",
          spellCheck: "",
          margin:"3px",
          resize: "none",
          width: "400px",
          height: "200px",
          fontFamily: "courier new"
          }});
    if (elem) {
//t.value = TemplateUtils.getElementHtmlPretty(elem, true, doc);
        var s = TemplateUtils.getElementHtml(elem, true, doc);
//        elem.innerHTML = s;
        t.value = s;
      }
    pw.contentElem.appendChild(t);
    t.addEventListener ("keypress",
      function (evt){
        return self.keystrokeHandler(evt);
        }, false);
    this.t1 = t;
    t = TEXTAREA (
        { style: { 
          clear: "both",
          spellCheck: "",
          margin:"3px",
          resize: "none",
          width: "400px",
          height: "200px",
          fontFamily: "courier new"
          }});
    pw.contentElem.appendChild(t);
    this.t2 = t;

    var input = DomGenerator.INPUT (
        { 
        type: "text",
        style: { 
          clear: "both",
          cssFloat: "left",
          styleFloat: "left",
          margin: "2px 3px",
          padding: "3px",
          border: "1px solid black",
          margin:"0px",
          width:"100px"
          }});
    pw.contentElem.appendChild(input);
    this.t3 = input;

    input = DomGenerator.INPUT (
        {
        type: "text",
        style: { 
          margin: "2px 3px",
          styleFloat: "left",
          padding: "3px",
          border: "1px solid black",
          margin:"0px",
          width:"100px"
          }});
    pw.contentElem.appendChild(input);
    this.t4 = input;
    this.pw = pw; 
    pw.show();
    this.textArea = t;
    this.adjustSizes();
    pw.windowCallback = function (type, win) {
      switch (type) {
        case "resize":
          self.adjustSizes();
          break;
         case "kill":
           break;
        }
      }
    var attr;
    if ((attr = elem.getAttribute("wmitemplate")) != null) {
      this.t3.value = attr;
      if (TemplateManager.templateDefs[attr]) {
       this.defName = attr;
       this.def = TemplateManager.templateDefs[attr];
       this.t2.value = this.defName + ": " + ServerComm.objectToJs(this.def, [{}], 5) + ",\n";
       }
      }
    }
  },

prototype : {
 adjustSizes : function () {
  var ce = this.pw.contentElem;
  var h = this.pw.contentElem.offsetHeight;
  var w = this.pw.contentElem.offsetWidth;
  this.t1.style.width = (ce.offsetWidth - 25) + "px";
  this.t2.style.width = (ce.offsetWidth - 25) + "px";
  this.t1.style.height = ((ce.offsetHeight/2) - 35) + "px";
  this.t2.style.height = ((ce.offsetHeight/2) - 35) + "px";
  },
  
 rangeStrings : ["outer","main", "inner"],
 
 grabText : function (which, start, end) {
  var defName = this.t3.value;
  var varName = this.t4.value;
  
  if (varName == "" || defName == "") {
    alert ("please enter definition name and variable name");
    return;
    }
  if (defName != this.defName) {
    this.defName = defName;
    this.def = {};
    this.varName = "";
    }
  if (varName != this.varName) {
    this.varName = varName;
    this.currVar = {};  
    }
  var cv = this.currVar;
  cv[this.rangeStrings[which]] = {start: start, end: end};
  
  if (!cv.outer)
    cv.outer = cv.main;
  if (!cv.main)
    cv.main = cv.outer;
  
  if (!cv.main)
    return;
  var orig = this.t1.value;
  
  var newString;
  if (cv.inner) {
    newString = orig.substring(cv.outer.start, cv.main.start) + '|' + 
      orig.substring(cv.main.start, cv.inner.start) +
      '...' +  
      orig.substring(cv.inner.end, cv.main.end) + '|' +
      orig.substring(cv.main.end, cv.outer.end);      
    }
  else {
    newString = orig.substring(cv.outer.start, cv.main.start) + '|' + 
      orig.substring(cv.main.start, cv.main.end) + '|' +
      orig.substring(cv.main.end, cv.outer.end);      
    };
  
  //this.t2.value = newString;
  
  this.def[varName] = newString;
  
  this.t2.value = defName + ": " + ServerComm.objectToJs(this.def, [{}], 5) + ",\n";
  
  if (this.t3.value != "")
    this.elem.setAttribute ("wmiTemplate", this.t3.value);
  
  /*(this.t1.value).substring(
        this.t1.selectionStart,
        this.t1.selectionEnd); */
  }, 
 
 keystrokeHandler : function (evt) {
  if (!evt)
    evt = window.event;
  var c;
  
  if (evt.ctrlKey || evt.metaKey || evt.altKey)
    return true;
  
  var keyCode = evt.keyCode ? evt.keyCode :
        evt.charCode ? evt.charCode :
        evt.which ? evt.which : 0;
  c = String.fromCharCode(keyCode).toLowerCase();
  var chars = "123";
  var whichChar = chars.indexOf(c);
  if (whichChar != -1) {
    this.grabText (whichChar, this.t1.selectionStart, this.t1.selectionEnd);
    if (evt.preventDefault)
      evt.preventDefault ();
    else
      evt.returnValue = false; 
    return false;
    }
  else
    return true;
  }
 }
};

// init ------------------------
(function (name) {
  var module = window[name];
  var constructor = window[name] = module.constructor;
  for (var j in module)
    constructor[j] = module[j];
  constructor.classObject = module;
  })("TemplateEditor");
