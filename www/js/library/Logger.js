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
        { style: {
          spellCheck: "",
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
      }
    t.win = pw;
    t.focus();
    return t;
    }

  
};