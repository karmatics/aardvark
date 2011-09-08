aardvark.loadObject

  #-----------------------------------------------------------------------------
  setElementStyleDefault: (elem, bgColor) ->
    s = elem.style
    s.display = "none"
    s.backgroundColor = bgColor
    s.borderColor = "black"
    s.borderWidth = "1px 2px 2px 1px"
    s.borderStyle = "solid"
    s.fontFamily = "arial"
    s.textAlign = "left"
    s.color = "#000"
    s.fontSize = "12px"
    s.position = "absolute"
    s.paddingTop = "2px"
    s.paddingBottom = "2px"
    s.paddingLeft = "5px"
    s.paddingRight = "5px"
  
  #-----------------------------------------------------------------------------
  getPos: (elem) ->
    pos = {}
    originalElement = elem
    leftX = 0
    leftY = 0
    if elem.offsetParent
      while elem.offsetParent
        leftX += elem.offsetLeft
        leftY += elem.offsetTop
        if elem != originalElement and elem != document.body and elem != document.documentElement
          leftX -= elem.scrollLeft
          leftY -= elem.scrollTop
        elem = elem.offsetParent
    else if elem.x
      leftX += elem.x
      leftY += elem.y
    pos.x = leftX
    pos.y = leftY
    pos
  
  #-----------------------------------------------------------------------------
  setAardvarkElem: (elem) ->
    if elem.nodeType == 1  #ELEMENT NODE
      i = 0
      
      while i < elem.childNodes.length
        elem.isAardvark = true
        @setAardvarkElem elem.childNodes.item(i)
        i++
  
  #-----------------------------------------------------------------------------
  setHandler: (obj, eventName, code) ->
    if aardvark.doc.all
      obj.attachEvent "on" + eventName, code
    else
      obj.addEventListener eventName, code, false
  
  #-----------------------------------------------------------------------------
  # move a div (or whatever) to an x y location
  moveElem: (o, x, y) ->
    o = o.style
    if aardvark.doc.all
      o.pixelLeft = x
      o.pixelTop = y
    else
      o.left = x + "px"
      o.top = y + "px"
  
  #-----------------------------------------------------------------------------
  getElemFromEvent: (evt) ->
    (if (evt.target) then evt.target else evt.srcElement)
  
  #-----------------------------------------------------------------------------
  getWindowDimensions: ->
    out = {}
    if aardvark.window.pageXOffset
      out.scrollX = aardvark.window.pageXOffset
      out.scrollY = aardvark.window.pageYOffset
    else if aardvark.doc.documentElement
      out.scrollX = aardvark.doc.body.scrollLeft + aardvark.doc.documentElement.scrollLeft
      out.scrollY = aardvark.doc.body.scrollTop + aardvark.doc.documentElement.scrollTop
    else if aardvark.doc.body.scrollLeft >= 0
      out.scrollX = aardvark.doc.body.scrollLeft
      out.scrollY = aardvark.doc.body.scrollTop
    if aardvark.doc.compatMode == "BackCompat"
      out.width = aardvark.doc.body.clientWidth
      out.height = aardvark.doc.body.clientHeight
    else
      out.width = aardvark.doc.documentElement.clientWidth
      out.height = aardvark.doc.documentElement.clientHeight
    out
  
  leafElems:
    IMG: true
    HR: true
    BR: true
    INPUT: true

  #-----------------------------------------------------------------------------
  # generate "outerHTML" for an element
  # this doesn't work on IE, but its got its own outerHTML property
  getOuterHtml: (node) ->
    str = ""
    switch node.nodeType
      when 1
        isLeaf = (node.childNodes.length == 0 and aardvark.leafElems[node.nodeName])
        str += "<" + node.nodeName.toLowerCase() + " "
        i = 0
        
        while i < node.attributes.length
          str += node.attributes.item(i).nodeName + "='" + node.attributes.item(i).nodeValue + "' "  if node.attributes.item(i).nodeValue? and node.attributes.item(i).nodeValue != ""
          i++
        if isLeaf
          str += " />"
        else
          str += ">"
          i = 0
          
          while i < node.childNodes.length
            str += aardvark.getOuterHtml(node.childNodes.item(i))
            i++
          str += "</" + node.nodeName.toLowerCase() + ">"
      when 3  #TEXT_NODE
        str += node.nodeValue
    str
  
  #-----------------------------------------------------------------------------
  # borrowed from somewhere
  createCSSRule: (selector, declaration) ->
    # test for IE (can i just use "aardvark.doc.all"?)
    ua = navigator.userAgent.toLowerCase()
    isIE = (/msie/.test(ua)) and not (/opera/.test(ua)) and (/win/.test(ua))

    # create the style node for all browsers
    style_node = aardvark.doc.createElement("style")
    style_node.setAttribute "type", "text/css"
    style_node.setAttribute "media", "screen"
    style_node.isAardvark = true

    # append a rule for good browsers
    style_node.appendChild aardvark.doc.createTextNode(selector + " {" + declaration + "}")  unless isIE
    
    # use alternative methods for IE
    aardvark.doc.getElementsByTagName("head")[0].appendChild style_node
    if isIE and aardvark.doc.styleSheets and aardvark.doc.styleSheets.length > 0
      last_style_node = aardvark.doc.styleSheets[aardvark.doc.styleSheets.length - 1]
      if typeof (last_style_node.addRule) == "object"
        a = selector.split(",")
        i = 0
        
        while i < a.length
          last_style_node.addRule a[i], declaration
          i++
  
  #-----------------------------------------------------------------------------
  trimSpaces: (s) ->
    while s.charAt(0) == " "
      s = s.substring(1)
    while s.charAt(s.length - 1) == " "
      s = s.substring(0, s.length - 1)
    s
  
  #-----------------------------------------------------------------------------
  escapeForJavascript: (s) ->
    s.replace(new RegExp("\n", "g"), " ").replace(new RegExp("\t", "g"), " ").replace(new RegExp("\"", "g"), "\\\"").replace(new RegExp("'", "g"), "\\'").replace(new RegExp("<", "g"), "&lt;").replace new RegExp(">", "g"), "&gt;"
