(function() {
  var makeTemplate, root, showHtml;
  makeTemplate = function(elem) {
    var te;
    te = (window.opener ? window.opener.TemplateEditor : TemplateEditor);
    return new te(elem, document);
  };
  showHtml = function(elem) {};
  root = typeof exports !== "undefined" && exports !== null ? exports : this;
  root.aardvark = {
    isBookmarklet: true,
    resourcePrefix: "http://localhost/aardvark/",
    srcFiles: ["CoffeeScript/build/aardvarkStrings.js", "CoffeeScript/build/aardvarkUtils.js", "aardvarkDBox.js", "CoffeeScript/build/aardvarkCommands.js", "CoffeeScript/build/aardvarkMain.js"],
    loadObject: function(obj) {
      var c, x;
      c = 0;
      for (x in obj) {
        if (aardvark[x] === void 0) {
          aardvark[x] = obj[x];
        }
        c++;
      }
      if (this.objectsLeftToLoad === void 0) {
        this.objectsLeftToLoad = this.srcFiles.length;
      }
      this.objectsLeftToLoad--;
      if (this.objectsLeftToLoad < 1) {
        this.start();
        this.showHelpTip(0);
        return aardvark.addCommand("make template", makeTemplate);
      }
    }
  };
  (function() {
    /* leave commented out if you wish to have it load a new
        copy each time (for dev purposes...no need to refresh page)
    
    #------- CoffeeScript -------
    if (window.aardvark)
      aardvark.start
      return
    
    //------- JavaScript --------
    if (window.aardvark) {
      aardvark.start ();
      return;
    }
    
    */
    var ensureFresh, i, scriptElem, _results;
    ensureFresh = "?" + Math.round(Math.random() * 100);
    i = 0;
    _results = [];
    while (i < aardvark.srcFiles.length) {
      scriptElem = document.createElement("script");
      scriptElem.isAardvark = true;
      scriptElem.src = (aardvark.srcFiles[i].indexOf("http://") === 0 ? aardvark.srcFiles[i] : aardvark.resourcePrefix + aardvark.srcFiles[i]) + ensureFresh;
      document.body.appendChild(scriptElem);
      _results.push(i++);
    }
    return _results;
  })();
}).call(this);
