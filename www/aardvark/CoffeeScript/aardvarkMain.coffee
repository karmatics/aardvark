aardvark.loadObject

  #-----------------------------------------------------------------------------
  showHelpTip: ->
    dbox = new AardvarkDBox("#fff2db", false, true, true)
    dbox.innerContainer.innerHTML = "<p style='clear: both; margin: 3px 0 0 0;'><img src='" + @resourcePrefix + "aardvarkhelp.gif' style=' float: right; margin: 0 0 0px 0'>" + @strings.initialTipText + "</p>"
    dbox.innerContainer.style.width = "14em"
    dbox.innerContainer.style.height = "54px"
    dbox.show()
    setTimeout "aardvark.killDbox(" + dbox.id + ")", 2000
    true
  
  #-----------------------------------------------------------------------------
  # create the box and tag etc (done once and saved)
  makeElems: ->
    @borderElems = []
    
    i = 0
    while i < 4
      d = @doc.createElement("DIV")
      s = d.style
      s.display = "none"
      s.overflow = "hidden"
      s.position = "absolute"
      s.height = "2px"
      s.width = "2px"
      s.top = "20px"
      s.left = "20px"
      s.zIndex = "5000"
      d.isAardvark = true
      @borderElems[i] = d
      @doc.body.appendChild d
      i++

    be = @borderElems
    be[0].style.borderTopWidth = "2px"
    be[0].style.borderTopColor = "#f00"
    be[0].style.borderTopStyle = "solid"
    be[1].style.borderBottomWidth = "2px"
    be[1].style.borderBottomColor = "#f00"
    be[1].style.borderBottomStyle = "solid"
    be[2].style.borderLeftWidth = "2px"
    be[2].style.borderLeftColor = "#f00"
    be[2].style.borderLeftStyle = "solid"
    be[3].style.borderRightWidth = "2px"
    be[3].style.borderRightColor = "#f00"
    be[3].style.borderRightStyle = "solid"

    d = @doc.createElement("DIV")
    @setElementStyleDefault d, "#fff0cc"
    d.isAardvark = true  #mark as ours
    d.isLabel = true
    d.style.borderTopWidth = "0"
    d.style.MozBorderRadiusBottomleft = "6px"
    d.style.MozBorderRadiusBottomright = "6px"
    d.style.WebkitBorderBottomLeftRadius = "6px"
    d.style.WebkitBorderBottomRightRadius = "6px"
    d.style.zIndex = "5005"
    d.style.visibility = "hidden"
    @doc.body.appendChild d
    @labelElem = d

    d = @doc.createElement("DIV")
    @setElementStyleDefault d, "#dfd"
    d.isAardvark = true  #mark as ours
    d.isKeybox = true
    d.style.backgroundColor = "#cfc"
    d.style.zIndex = "5008"
    @doc.body.appendChild d
    @keyboxElem = d
  
  #-----------------------------------------------------------------------------
  # show the red box around the element, and display
  # the string in the little tag
  showBoxAndLabel: (elem, string) ->
    pos = @getPos(elem)
    dims = @getWindowDimensions()
    y = pos.y

    @moveElem @borderElems[0], pos.x, y
    @borderElems[0].style.width = elem.offsetWidth + "px"
    @borderElems[0].style.display = ""

    @moveElem @borderElems[1], pos.x, y + elem.offsetHeight - 2
    @borderElems[1].style.width = (elem.offsetWidth + 2) + "px"
    @borderElems[1].style.display = ""

    @moveElem @borderElems[2], pos.x, y
    @borderElems[2].style.height = elem.offsetHeight + "px"
    @borderElems[2].style.display = ""

    @moveElem @borderElems[3], pos.x + elem.offsetWidth - 2, y
    @borderElems[3].style.height = elem.offsetHeight + "px"
    @borderElems[3].style.display = ""

    y += elem.offsetHeight + 2

    @labelElem.innerHTML = string
    @labelElem.style.display = ""

    # adjust the label as necessary to make sure it is within screen and
    # the border is pretty
    if (y + @labelElem.offsetHeight) >= dims.scrollY + dims.height
      @labelElem.style.borderTopWidth = "1px"
      @labelElem.style.MozBorderRadiusTopleft = "6px"
      @labelElem.style.MozBorderRadiusTopright = "6px"
      @labelElem.style.WebkitBorderTopLeftRadius = "6px"
      @labelElem.style.WebkitBorderTopRightRadius = "6px"
      @labelDrawnHigh = true
      y = (dims.scrollY + dims.height) - @labelElem.offsetHeight
    else if @labelElem.offsetWidth > elem.offsetWidth
      @labelElem.style.borderTopWidth = "1px"
      @labelElem.style.MozBorderRadiusTopright = "6px"
      @labelElem.style.WebkitBorderTopRightRadius = "6px"
      @labelDrawnHigh = true
    else if @labelDrawnHigh
      @labelElem.style.borderTopWidth = "0"
      @labelElem.style.MozBorderRadiusTopleft = ""
      @labelElem.style.MozBorderRadiusTopright = ""
      @labelElem.style.WebkitBorderTopLeftRadius = ""
      @labelElem.style.WebkitBorderTopRightRadius = ""
      delete (@labelDrawnHigh)
    @moveElem @labelElem, pos.x + 2, y
    @labelElem.style.visibility = "visible"
  
  #-----------------------------------------------------------------------------
  removeBoxFromBody: ->
    if @labelElem
      @doc.body.removeChild @labelElem
      @labelElem = null
    if @keyboxElem
      @doc.body.removeChild @keyboxElem
      @keyboxElem = null
    if @borderElems?
      i = 0
      while i < 4
        @doc.body.removeChild @borderElems[i]
        i++
      @borderElems = null
  
  #-----------------------------------------------------------------------------
  # remove the red box and tag
  clearBox: ->
    @selectedElem = null
    if @borderElems?
      i = 0
      while i < 4
        @borderElems[i].style.display = "none"
        i++
      @labelElem.style.display = "none"
      @labelElem.style.visibility = "hidden"
  
  #-----------------------------------------------------------------------------
  hideKeybox: ->
    @keyboxElem.style.display = "none"
    @keyboxTimeoutHandle = null
  
  #-----------------------------------------------------------------------------
  showKeybox: (command) ->
    return  unless @keyboxElem?

    if command.keyOffset >= 0
      s1 = command.name.substring(0, command.keyOffset)
      s2 = command.name.substring(command.keyOffset + 1)
      @keyboxElem.innerHTML = s1 + "<b style='font-size:2em;'>" + command.name.charAt(command.keyOffset) + "</b>" + s2
    else
      @keyboxElem.innerHTML = command.name

    dims = @getWindowDimensions()
    y = dims.scrollY + @mousePosY + 10
    if y < 0
      y = 0
    else y = (dims.scrollY + dims.height) - 60  if y > (dims.scrollY + dims.height) - 30
    x = @mousePosX + 10
    if x < 0
      x = 0
    else x = (dims.scrollX + dims.width) - 100  if x > (dims.scrollX + dims.width) - 60

    @moveElem @keyboxElem, x, y
    @keyboxElem.style.display = ""
    clearTimeout @keyboxTimeoutHandle  if @keyboxTimeoutHandle
    @keyboxTimeoutHandle = setTimeout("aardvark.hideKeybox()", 400)
  
  validIfBlockElements: 
    SPAN: 1
    A: 1
  
  validIfNotInlineElements: 
    UL: 1
    LI: 1
    OL: 1
    PRE: 1
    CODE: 1
  
  alwaysValidElements: 
    DIV: 1
    IFRAME: 1
    OBJECT: 1
    APPLET: 1
    BLOCKQUOTE: 1
    H1: 1
    H2: 1
    H3: 1
    FORM: 1
    P: 1
    TABLE: 1
    TD: 1
    TH: 1
    TR: 1
    IMG: 1
  
  #-----------------------------------------------------------------------------
  # given an element, walk upwards to find the first
  # valid selectable element
  findValidElement: (elem) ->
    while elem
      if @alwaysValidElements[elem.tagName]
        return elem
      else if @validIfBlockElements[elem.tagName]
        if @doc.defaultView
          return elem  if @doc.defaultView.getComputedStyle(elem, null).getPropertyValue("display") == "block"
        else return elem  if elem.currentStyle["display"] == "block"  if elem.currentStyle
      else if @validIfNotInlineElements[elem.tagName]
        if @doc.defaultView
          return elem  unless @doc.defaultView.getComputedStyle(elem, null).getPropertyValue("display") == "inline"
        else return elem  unless elem.currentStyle["display"] == "inline"  if elem.currentStyle
      elem = elem.parentNode
    elem
  
  #-----------------------------------------------------------------------------
  makeElementLabelString: (elem) ->
    s = "<b style='color:#000'>" + elem.tagName.toLowerCase() + "</b>"
    s += ", id: " + elem.id  unless elem.id == ""
    s += ", class: " + elem.className  unless elem.className == ""
    s
  
  #-----------------------------------------------------------------------------
  mouseUp: (evt) ->
  # todo: remove all this when we replace dlogbox with our popupwindow
    if aardvark.dragElement
      delete aardvark.dragElement
      delete aardvark.dragClickX
      delete aardvark.dragClickY
      delete aardvark.dragStartPos
    false
  
  # the following three functions are the main event handlers
  # note: "this" does not point to aardvark.main in these
  #-----------------------------------------------------------------------------
  mouseMove: (evt) ->
    evt = aardvark.window.event  unless evt

    if aardvark.mousePosX == evt.clientX and aardvark.mousePosY == evt.clientY
      aardvark.mouseMoved = false
      return

    # todo: remove all this when we replace dlogbox with our popupwindow
    aardvark.mousePosX = evt.clientX
    aardvark.mousePosY = evt.clientY

    if aardvark.dragElement
      aardvark.moveElem aardvark.dragElement, (aardvark.mousePosX - aardvark.dragClickX) + aardvark.dragStartPos.x, (aardvark.mousePosY - aardvark.dragClickY) + aardvark.dragStartPos.y
      aardvark.mouseMoved = false
      return true

    # if it hasn't actually moved (for instance, if something 
    # changed under it causing a mouseover), we want to know that
    aardvark.mouseMoved = true
    false
  
  #-----------------------------------------------------------------------------
  mouseOver: (evt) ->
    evt = aardvark.window.event  unless evt

    return  unless aardvark.mouseMoved

    elem = aardvark.getElemFromEvent(evt)
    unless elem?
      aardvark.clearBox()
      return
    elem = aardvark.findValidElement(elem)

    unless elem?
      aardvark.clearBox()
      return

    # note: this assumes that:
    # 1. our display elements would be selectable types, and
    # 2. elements inside display elements would not
    if elem.isAardvark
      if elem.isKeybox
        aardvark.hideKeybox()
      else if elem.isLabel
        aardvark.clearBox()
      else
        aardvark.isOnAardvarkElem = true
      return

    # this prevents it from snapping back to another element
    # if you do a "wider" or "narrower" while on top of one
    # of the border lines.  not fond of this, but its about
    # the best i can do
    if aardvark.isOnAardvarkElem and aardvark.didWider
      e = elem
      foundIt = false
      while (e = e.parentNode)?
        if e == aardvark.selectedElem
          foundIt = true
          break
      if foundIt
        aardvark.isOnAardvarkElem = false
        return
    aardvark.isOnAardvarkElem = false
    aardvark.didWider = false

    return  if elem == aardvark.selectedElem
    aardvark.widerStack = null
    aardvark.selectedElem = elem
    aardvark.showBoxAndLabel elem, aardvark.makeElementLabelString(elem)
    aardvark.mouseMoved = false
  
  #-----------------------------------------------------------------------------
  keyDown: (evt) ->
    evt = aardvark.window.event  unless evt
    
    return true  if evt.ctrlKey or evt.metaKey or evt.altKey

    keyCode = (if evt.keyCode then evt.keyCode else (if evt.charCode then evt.charCode else (if evt.which then evt.which else 0)))
    c = String.fromCharCode(keyCode).toLowerCase()
    command = aardvark.getByKey(c)

    if command
      if command.noElementNeeded
        aardvark.showKeybox command  if command.func.call(aardvark) == true
      else
        aardvark.showKeybox command  if aardvark.selectedElem and (command.func.call(aardvark, aardvark.selectedElem) == true)
    return true  if c < "a" or c > "z"
    if evt.preventDefault
      evt.preventDefault()
    else
      evt.returnValue = false
    false
  
  #-----------------------------------------------------------------------------
  # this is the main entry point when starting aardvark
  start: ->
    @loadCommands()
    
    if @isBookmarklet
      @window = window
      @doc = document
    else
      @doc = (if (gContextMenu) then gContextMenu.target.ownerDocument else window._content.document)
      @window = window._content
    
    if @doc.aardvarkRunning
      @quit()
      return
    else
      @makeElems()
      @selectedElem = null
      
      # need this to be page specific (for extension)...if you 
      # change the page, aardvark will not be running
      @doc.aardvarkRunning = true
      
      if @doc.all
        @doc.attachEvent "onmouseover", @mouseOver
        @doc.attachEvent "onmousemove", @mouseMove
        @doc.attachEvent "onmouseup", @mouseUp
        @doc.attachEvent "onkeypress", @keyDown
      else
        @doc.addEventListener "mouseover", @mouseOver, false
        @doc.addEventListener "mouseup", @mouseUp, false
        @doc.addEventListener "mousemove", @mouseMove, false
        @doc.addEventListener "keypress", @keyDown, false

      # show tip if its been more than an hour
      unless @isBookmarklet
        t = new Date().getTime() / (1000 * 60)
        diff = t - @tipLastShown
        if diff > 60  #more than an hour
          @tipLastShown = Math.round(t)
          @prefManager.setIntPref "extensions.aardvark@rob.brown.tipLastShown", @tipLastShown
          @showHelpTip()
