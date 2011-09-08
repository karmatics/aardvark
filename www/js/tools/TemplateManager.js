TemplateManager = {

  editWin: null,
  templateDefs: null,
  templates: null,

  //-------------------------------------
  openEditWin : function (file) {
    this.editWin = window.open(file, "bleh");
    },

  //-------------------------------------
  getSaveHtmlData : function () {
    if(this.editWin) {
      if (this.editWin.tp)
        this.editWin.tp.hide();
      var d = this.editWin.document;
      var a = d.getElementsByTagName("style");
      for (var i=a.length-1; i>=0; i--) {
        if (a[i].isAardvark)
          a[i].parentNode.removeChild(a[i]);
        }
      a = d.getElementsByTagName("script");
      for (var i=a.length-1; i>=0; i--) {
        if (a[i].isAardvark)
          a[i].parentNode.removeChild(a[i]);
        }
      var p = this.editWin.document.getElementsByTagName("html");
      return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n' + TemplateUtils.addClosingSlashes(p[0].innerHTML) + "\n\n</html>";
      }
    return null;
    },

  //-------------------------------------
  getSavePhpData : function () {
    var s = "<?php\n";
    for (var i in this.templates){
      s += TemplateOutput.makePhpFunctionString (i, this.templates[i]) + "\n";
      }
    s += "\n?>";
    return s;
    },

  processTemplateDefs : function (templateDefs) {
    this.templateDefs = templateDefs;
    var errs = [];
    var t = TemplateUtils.extractAllTemplates(templateDefs, this.editWin.document, errs);
    if (errs.length > 0) {
      Logger.write (errs);
      this.templates = null;
      }
    else {
      SharedWMITools.makeIoBox().value = ServerComm.objectToJs(t);
      this.templates = t;
      }
    },
  //-------------------------------------
  readFilename : function (which) {
    var s = this.inputItems[which].value;
    Cookie.setCookie ("input" + which, s, "/", 20);
    return s;
    },
    
  //-------------------------------------
  loadItem : function (which) {
    var f = this.readFilename (which);  
    var ind = f.lastIndexOf(".");
    if (ind == -1)
      return;

    var isRel = (f.indexOf("/")==0 || f.indexOf("http:")==0) ? false : true;
    var ext = f.substring (ind+1);
    f += "?x=" + Math.round(Math.random()*10000);

    switch (ext) {
      case "css":
        if (isRel)
          f = "../design/resources/" + f;
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.type = 'text/css';
        link.href = f; 
        document.body.appendChild(link);
        break;    
      case "js":
        if (isRel)
          f = "../design/" + f;
        var s = document.createElement('script');
        s.src = f;
        document.body.appendChild(s);
        break;
      case "html":
        if (isRel)
          f = "../design/" + f;
        this.editWin = window.open(f, "bleh");
        break;
      }    
    },

  //------------------------------------
	openDialogBox : function  () {
   	var pw = new PopupWindow("template controls", "tcontrols");
   	var self = this;
   	this.inputItems = [];
   	with (DomGenerator) {
      for (var i=0; i<7; i++) {
        pw.contentElem.appendChild (DIV(
            this.inputItems[i] = INPUT ({type:"text", className: "text", value:Cookie.getCookie("input" + i)}),
            INPUT ({type: "button", className: "button", onclick: (function (item){return function(){self.loadItem(item)};})(i), value: "load"})
            ));
        }
      pw.contentElem.appendChild (DIV({style:{clear: "both", width: "0", height: "0", margin:"0"}}));
      }
    this.inputItems[0].value = "../loyalty_templates.html";
    this.inputItems[1].value = "../loyalty/resources/templates.js";
    pw.show();
	  }
}

