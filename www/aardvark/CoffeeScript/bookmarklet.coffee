makeTemplate = (elem) ->
  te = (if (window.opener) then window.opener.TemplateEditor else TemplateEditor)
  new te(elem, document)

showHtml = (elem) ->

root = exports ? this  # aardvark needs to be global
root.aardvark = 
  isBookmarklet: true
  resourcePrefix: "http://localhost/aardvark/"
  srcFiles: [ "CoffeeScript/build/aardvarkStrings.js",
              "CoffeeScript/build/aardvarkUtils.js", 
              "aardvarkDBox.js", 
              "CoffeeScript/build/aardvarkCommands.js", 
              "CoffeeScript/build/aardvarkMain.js" ]
  #-----------------------------------------------------------------------------
  # onload function for script elements
  loadObject: (obj) ->
    c = 0

    for x of obj
      aardvark[x] = obj[x]  if aardvark[x] == undefined
      c++
    
    @objectsLeftToLoad = @srcFiles.length  if @objectsLeftToLoad == undefined
    @objectsLeftToLoad--
    
    if @objectsLeftToLoad < 1
      # add anything here you want to happen when it is loaded
      # copy our own functions etc over aardvark's
    
      # start aardvark and show its help tip
      @start()
      @showHelpTip 0

      # add our custom commands
      # aardvark.addCommand ("examine", MyFunctions.browseElement);
      # add our custom commands
      aardvark.addCommand "make template", makeTemplate

# load the aardvark code from karmatics.com
(->
  ### leave commented out if you wish to have it load a new
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

  ###  

  # anti caching....dev only (leave empty string otherwise)
  ensureFresh = "?" + Math.round(Math.random() * 100)
  i = 0
  
  while i < aardvark.srcFiles.length
    scriptElem = document.createElement("script")
    scriptElem.isAardvark = true
    scriptElem.src = 
      (if (aardvark.srcFiles[i].indexOf("http://") == 0) 
      then aardvark.srcFiles[i] 
      else aardvark.resourcePrefix + aardvark.srcFiles[i]) + ensureFresh
    document.body.appendChild scriptElem
    i++
)()
