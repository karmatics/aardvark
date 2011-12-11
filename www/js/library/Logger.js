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
    // console.log(DomUtils.getWindowDimensions());
    // console.log(DomUtils.getPos(this.window.element));
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
  clear : function (ageSeconds) {
    if (this.window) {
      while (this.window.textElem.lastChild)
     this.window.textElem.removeChild(this.window.textElem.lastChild);
     }
    /*
    
    var earliestTime = Math.round (new Date().getTime() / 1000) - ageSeconds;
    var a = this.queuedMessages, l = this.queuedMessages.length;
    if (l > 0 && a[0].time < earliestTime) {
      var newArray = [];
      for (var i =0; i<len; i++) {
        if (a[i].time > earliestTime)
          newArray.push(a[i]);
      }
      this.queuedMessages = newArray;
    } */
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
  },
  
  ioBoxes : {},
  
  getIoBox : function (num, create) {
    var count = 0;
    for (var i in ioBoxes) {
      count++;  
    }
    if(count ==1)
      return ioBoxes[i];
    if (count == 0 && create)
      return this.makeIoBox();
    return null;
  },
  
  //-------------------------------------------------
  makeIoBox : function () {
    var i;
    for (var i=1; i<1000; i++) {
      if (window["io" + i] == null) {
        break;
      }
    }
    var pw = new PopupWindow("text box [io" + i + "]", "io", true);
    var t = window["io"+i] = DomGenerator.TEXTAREA (
      {
        spellcheck: false,
        style: {
          margin:"0px 3px 3px 0px",
          backgroundColor: "rgba(0,0,0,.5)",
          color: "#0f0", 
          resize: "none",
          width:"100%",
          height:"100%" }});
    pw.contentElem.margin = "0";
    pw.contentElem.style.backgroundColor = "rgba(0,0,0,.6)";
    pw.contentElem.style.borderColor = "#000";
    pw.contentElem.appendChild(t);
    pw.contentElem.style.width = "400px";
    pw.contentElem.style.height = "200px";
    // pw.element.style.position = "fixed";
    pw.show();
    pw.windowCallback = function (type, win) {
      if (type == "kill")
        window["io"+i] = null;
      //delete (self.ioBoxes[i]);
    }
    t.win = pw;
    // this.ioBoxes[i] = t;
    t.focus();
    return t;
  },
  // formatJson() :: formats and indents JSON string
  // todo: move somewhere else for general use
  // from http://ketanjetty.com/coldfusion/javascript/format-json/
  formatJson : function (val) {
    var inQuotes = false;
    
    var retval = '';
    var str = val;
    var pos = 0;
    var strLen = str.length;
    var indentStr = ' ';
    var newLine = '\n';
    var char = '';
    
    for (var i=0; i<strLen; i++) {
      char = str.substring(i,i+1);
      
      if (char == '"') {
        inQuotes = !inQuotes;
      }      
      
      if (!inQuotes && (char == '}' || char == ']')) {
        retval = retval + newLine;
        pos = pos - 1;
        
        for (var j=0; j<pos; j++) {
          retval = retval + indentStr;
        }
      }
      
      retval = retval + char;	
      
      if (!inQuotes && (char == '{' || char == '[' || char == ',')) {
        retval = retval + newLine;
        
        if (char == '{' || char == '[') {
          pos = pos + 1;
        }
        
        for (var k=0; k<pos; k++) {
          retval = retval + indentStr;
        }
      }
    }
    return retval;
  }   
};
