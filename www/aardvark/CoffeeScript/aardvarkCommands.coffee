aardvark.loadObject 
  keyCommands: []
  loadCommands: ->
    return  if @keyCommands.length > 0
    keyCommands = [ [ "wider", @wider ], [ "narrower", @narrower ], [ "undo", @undo, true ], [ "quit", @quit, true ], [ "remove", @removeElement ], [ "kill", @rip, null, "extension" ], [ "isolate", @isolateElement ], [ "black on white", @blackOnWhite ], [ "deWidthify", @deWidthify ], [ "colorize", @colorize ], [ "view source", @viewSource ], [ "javascript", @makeJavascript ], [ "paste", @paste ], [ "help", @showMenu, true ], [ "xpath", @getElementXPath ], [ "global", @makeGlobalFromElement ] ]
    i = 0
    
    while i < keyCommands.length
      @addCommand.apply this, keyCommands[i]
      i++
  
  addCommand: (name, func, noElementNeeded, mode, keystroke) ->
    if @isBookmarklet
      return  if mode == "extension"
    else
      return  if mode == "bookmarklet"
    name = @strings[name]  if @strings[name] and @strings[name] != ""
    if keystroke
      keyOffset = -1
    else
      keyOffset = name.indexOf("&")
      unless keyOffset == -1
        keystroke = name.charAt(keyOffset + 1)
        name = name.substring(0, keyOffset) + name.substring(keyOffset + 1)
      else
        keystroke = name.charAt(0)
        keyOffset = 0
    command = 
      name: name
      keystroke: keystroke
      keyOffset: keyOffset
      func: func
    
    command.noElementNeeded = true  if noElementNeeded
    @keyCommands.push command
  
  rip: (elem) ->
    if window.RemoveItPermanently
      RemoveItPermanently.doRipNode elem
    else
      dbox = new AardvarkDBox("#fff", true)
      dbox.innerContainer.innerHTML = @strings.ripHelp
      dbox.show()
    true
  
  wider: (elem) ->
    if elem and elem.parentNode
      newElem = @findValidElement(elem.parentNode)
      return false  unless newElem
      if @widerStack and @widerStack.length > 0 and @widerStack[@widerStack.length - 1] == elem
        @widerStack.push newElem
      else
        @widerStack = [ elem, newElem ]
      @selectedElem = newElem
      @showBoxAndLabel newElem, @makeElementLabelString(newElem)
      @didWider = true
      return true
    false
  
  narrower: (elem) ->
    if elem
      if @widerStack and @widerStack.length > 1 and @widerStack[@widerStack.length - 1] == elem
        @widerStack.pop()
        newElem = @widerStack[@widerStack.length - 1]
        @selectedElem = newElem
        @showBoxAndLabel newElem, @makeElementLabelString(newElem)
        @didWider = true
        return true
    false
  
  quit: ->
    @doc.aardvarkRunning = false
    if @doc.all
      @doc.detachEvent "onmouseover", @mouseOver
      @doc.detachEvent "onmousemove", @mouseMove
      @doc.detachEvent "onkeypress", @keyDown
      @doc.detachEvent "onmouseup", @mouseUp, false
    else
      @doc.removeEventListener "mouseover", @mouseOver, false
      @doc.removeEventListener "mousemove", @mouseMove, false
      @doc.removeEventListener "mouseup", @mouseUp, false
      @doc.removeEventListener "keypress", @keyDown, false
    @removeBoxFromBody()
    delete (@selectedElem)
    
    delete (@widerStack)  if @widerStack
    true
  
  suspend: ->
    if @doc.all
      @doc.detachEvent "onmouseover", @mouseOver
      @doc.detachEvent "onkeypress", @keyDown
    else
      @doc.removeEventListener "mouseover", @mouseOver, false
      @doc.removeEventListener "keypress", @keyDown, false
    true
  
  resume: ->
    if @doc.all
      @doc.attachEvent "onmouseover", @mouseOver
      @doc.attachEvent "onkeypress", @keyDown
    else
      @doc.addEventListener "mouseover", @mouseOver, false
      @doc.addEventListener "keypress", @keyDown, false
    true
  
  viewSource: (elem) ->
    dbox = new AardvarkDBox("#fff", true, false, false, @strings.viewHtmlSource, true)
    v = @getOuterHtmlFormatted(elem, 0)
    dbox.innerContainer.innerHTML = v
    unless @doc.didViewSourceDboxCss
      @createCSSRule "div.aardvarkdbox div", "font-size: 13px; margin: 0; padding: 0;"
      @createCSSRule "div.aardvarkdbox div.vsblock", "font-size: 13px; border: 1px solid #ccc; border-right: 0;margin: -1px 0 -1px 1em; padding: 0;"
      @createCSSRule "div.aardvarkdbox div.vsline", "font-size: 13px; border-right: 0;margin: 0 0 0 .6em;text-indent: -.6em; padding: 0;"
      @createCSSRule "div.aardvarkdbox div.vsindent", "font-size: 13px; border-right: 0;margin: 0 0 0 1.6em;text-indent: -.6em; padding: 0;"
      @createCSSRule "div.aardvarkdbox span.tag", "color: #c00;font-weight:bold;"
      @createCSSRule "div.aardvarkdbox span.pname", "color: #080;font-weight: bold;"
      @createCSSRule "div.aardvarkdbox span.pval", "color:#00a;font-weight: bold;"
      @createCSSRule "div.aardvarkdbox span.aname", "color: #050;font-style: italic;font-weight: normal;"
      @createCSSRule "div.aardvarkdbox span.aval", "color:#007;font-style: italic;font-weight: normal;"
      @doc.didViewSourceDboxCss = true
    dbox.show()
    true
  
  colorize: (elem) ->
    elem.style.backgroundColor = "#" + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16) + Math.floor(Math.random() * 16).toString(16)
    elem.style.backgroundImage = ""
    true
  
  removeElement: (elem) ->
    if elem.parentNode?
      tmpUndoData = 
        next: @undoData
        mode: "R"
        elem: elem
        parent: elem.parentNode
        nextSibling: elem.nextSibling
      
      @undoData = tmpUndoData
      elem.parentNode.removeChild elem
      @clearBox()
      return true
    false
  
  paste: (o) ->
    if o.parentNode?
      if @undoData.mode == "R"
        e = @undoData.elem
        if e.nodeName == "TR" and o.nodeName != "TR"
          t = @doc.createElement("TABLE")
          tb = @doc.createElement("TBODY")
          t.appendChild tb
          tb.appendChild e
          e = t
        else if e.nodeName == "TD" and o.nodeName != "TD"
          t2 = @doc.createElement("DIV")
          len = e.childNodes.length
          a = []
          i = 0
          while i < len
            a[i] = e.childNodes.item(i)
            i++
          i = 0
          while i < len
            e.removeChild a[i]
            t2.appendChild e
            i++
          t2.appendChild e
          e = t2
        if o.nodeName == "TD" and e.nodeName != "TD"
          o.insertBefore e, o.firstChild
        else if o.nodeName == "TR" and e.nodeName != "TR"
          o.insertBefore e, o.firstChild.firstChild
        else
          o.parentNode.insertBefore e, o
        @clearBox()
        @undoData = @undoData.next
    true
  
  isolateElement: (o) ->
    if o.parentNode?
      @clearBox()
      
      if document.all
        if o.tagName == "TR" or o.tagName == "TD"
          t = @doc.createElement("TABLE")
          tb = @doc.createElement("TBODY")
          t.appendChild tb
          if o.tagName == "TD"
            tr = @doc.createElement("TR")
            td = @doc.createElement("TD")
            td.innerHTML = o.innerHTML
            tr.appendChild td
            tb.appendChild tr
          else
            tr = @doc.createElement("TR")
            len = o.childNodes.length
            i = 0
            
            while i < len
              td = o.childNodes.item(i)
              if td.nodeName == "TD"
                newTd = @doc.createElement("TD")
                newTd.innerHTML = td.innerHTML
                tr.appendChild newTd
              i++
            tb.appendChild tr
          clone = t
        else
          div = document.createElement("DIV")
          div.innerHTML = o.outerHTML
          clone = div.firstChild
      else
        clone = o.cloneNode(true)
      clone.style.textAlign = ""
      clone.style.cssFloat = "none"
      clone.style.styleFloat = "none"
      clone.style.position = ""
      clone.style.padding = "5px"
      clone.style.margin = "5px"
      if clone.tagName == "TR" or clone.tagName == "TD"
        if clone.tagName == "TD"
          tr = @doc.createElement("TR")
          tr.appendChild clone
          clone = tr
        t = @doc.createElement("TABLE")
        tb = @doc.createElement("TBODY")
        t.appendChild tb
        tb.appendChild clone
        clone = t
      tmpUndoData = []
      len = @doc.body.childNodes.length
      count = 0
      i = 0
      while i < len
        e = @doc.body.childNodes.item(i)
        unless e.isAardvark
          tmpUndoData[count] = e
          count++
        i++
      tmpUndoData.numElems = count
      i = count - 1
      while i >= 0
        @doc.body.removeChild tmpUndoData[i]
        i--
      tmpUndoData.mode = "I"
      tmpUndoData.bg = @doc.body.style.background
      tmpUndoData.bgc = @doc.body.style.backgroundColor
      tmpUndoData.bgi = @doc.body.style.backgroundImage
      tmpUndoData.m = @doc.body.style.margin
      tmpUndoData.ta = @doc.body.style.textAlign
      tmpUndoData.next = @undoData
      @undoData = tmpUndoData
      @doc.body.style.width = "100%"
      @doc.body.style.background = "none"
      @doc.body.style.backgroundColor = "white"
      @doc.body.style.backgroundImage = "none"
      @doc.body.style.textAlign = "left"
      @doc.body.appendChild clone
      @window.scroll 0, 0
    true
  
  deWidthify: (node, skipClear) ->
    switch node.nodeType
      when 1
        unless node.tagName == "IMG"
          node.style.width = "auto"
          node.width = null  if node.width
        isLeaf = (node.childNodes.length == 0 and @leafElems[node.nodeName])
        unless isLeaf
          i = 0
          
          while i < node.childNodes.length
            @deWidthify node.childNodes.item(i)
            i++
    @clearBox()  unless skipClear
    true
  
  blackOnWhite: (node, isLink) ->
    switch node.nodeType
      when 1
        unless node.tagName == "IMG"
          isLink = true  if node.tagName == "A"
          node.style.color = "#000"
          node.style.textDecoration = "underline"  if isLink
          node.style.backgroundColor = "#fff"
          node.style.fontFamily = "arial"
          node.style.fontSize = "13px"
          node.style.textAlign = "left"
          node.align = "left"
          node.style.backgroundImage = ""
          isLeaf = (node.childNodes.length == 0 and @leafElems[node.nodeName])
          unless isLeaf
            i = 0
            
            while i < node.childNodes.length
              @blackOnWhite node.childNodes.item(i), isLink
              i++
    true
  
  getOuterHtmlFormatted: (node, indent) ->
    str = ""
    return "<pre>" + node.outerHTML.replace(/\</g, "&lt;").replace(/\>/g, "&gt;") + "</pre>"  if @doc.all
    switch node.nodeType
      when 1
        break  if node.style.display == "none"
        isLeaf = (node.childNodes.length == 0 and @leafElems[node.nodeName])
        isTbody = (node.nodeName == "TBODY" and node.attributes.length == 0)
        if isTbody
          i = 0
          
          while i < node.childNodes.length
            str += @getOuterHtmlFormatted(node.childNodes.item(i), indent)
            i++
        else
          if isLeaf
            str += "\n<div class='vsindent'>\n"
          else if indent > 0
            str += "\n<div class='vsblock' style=''>\n<div class='vsline'>\n"
          else
            str += "\n<div class='vsline'>\n"
          str += "&lt;<span class='tag'>" + node.nodeName.toLowerCase() + "</span>"
          i = 0
          
          while i < node.attributes.length
            if node.attributes.item(i).nodeValue? and node.attributes.item(i).nodeValue != ""
              str += " <span class='pname'>"
              str += node.attributes.item(i).nodeName
              if node.attributes.item(i).nodeName == "style"
                styles = ""
                a = node.attributes.item(i).nodeValue.split(";")
                j = 0
                
                while j < a.length
                  pair = a[j].split(":")
                  if pair.length == 2
                    s = @trimSpaces(pair[0])
                    styles += "; <span class='aname'>" + s + "</span>: <span class='aval'>" + @trimSpaces(pair[1]) + "</span>"
                  j++
                styles = styles.substring(2)
                str += "</span>=\"" + styles + "\""
              else
                str += "</span>=\"<span class='pval'>" + node.attributes.item(i).nodeValue + "</span>\""
            i++
          if isLeaf
            str += " /&gt;\n</div>\n"
          else
            str += "&gt;\n</div>\n"
            i = 0
            
            while i < node.childNodes.length
              str += @getOuterHtmlFormatted(node.childNodes.item(i), indent + 1)
              i++
            str += "\n<div class='vsline'>\n&lt;/<span class='tag'>" + node.nodeName.toLowerCase() + "</span>&gt;\n</div>\n</div>\n"
      when 3
        v = node.nodeValue
        v = v.replace("<", "&amp;lt;").replace(">", "&amp;gt;")
        v = @trimSpaces(v)
        str += "<div class='vsindent'>" + v + "</div>"  if v != "" and v != "\n" and v != "\r\n" and v.charCodeAt(0) != 160
      when 4
        str += "<div class='vsindent'>&lt;![CDATA[" + node.nodeValue + "]]></div>"
      when 5
        str += "&amp;" + node.nodeName + ";<br>"
      when 8
        str += "<div class='vsindent'>&lt;!--" + node.nodeValue + "--></div>"
    str
  
  camelCaseProps: 
    colspan: "colSpan"
    rowspan: "rowSpan"
    accesskey: "accessKey"
    class: "className"
    for: "htmlFor"
    tabindex: "tabIndex"
    maxlength: "maxLength"
    readonly: "readOnly"
    frameborder: "frameBorder"
    cellspacing: "cellSpacing"
    cellpadding: "cellPadding"
  
  domJavascript: (node, indent) ->
    indentStr = ""
    c = 0
    
    while c < indent
      indentStr += "  "
      c++
    switch node.nodeType
      when 1
        break  if node.style.display == "none"
        isLeaf = (node.childNodes.length == 0 and @leafElems[node.nodeName])
        children = ""
        numChildren = 0
        useInnerHTML = false
        unless isLeaf
          i = 0
          
          while i < node.childNodes.length
            t = @domJavascript(node.childNodes.item(i), indent + 1)
            if t == "useInnerHTML"
              useInnerHTML = true
              break
            if t
              children += indentStr + "  " + t + ",\n"
              numChildren++
            i++
          children = children.substring(0, children.length - 2) + "\n"  if numChildren and not useInnerHTML
        properties = ""
        styles = ""
        numProps = 0
        sCount = 0
        i = 0
        
        while i < node.attributes.length
          if node.attributes.item(i).nodeValue? and node.attributes.item(i).nodeValue != ""
            n = node.attributes.item(i).nodeName
            v = node.attributes.item(i).nodeValue
            switch n
              when "style"
                a = node.attributes.item(i).nodeValue.split(";")
                j = 0
                
                while j < a.length
                  pair = a[j].split(":")
                  if pair.length == 2
                    s = @trimSpaces(pair[0])
                    until (index = s.indexOf("-")) == -1
                      s = s.substring(0, index) + s.charAt(index + 1).toUpperCase() + s.substring(index + 2)
                    if s == "float"
                      styles += ", <span style='color:#060; font-style:italic'>styleFloat</span>: \"<span style='color:#008;font-style:italic'>" + @trimSpaces(pair[1]) + "</span>\", <span style='color:#060; font-style:italic'>cssFloat</span>: \"<span style='color:#008;font-style:italic'>" + @trimSpaces(pair[1]) + "</span>\""
                    else
                      styles += ", <span style='color:#060; font-style:italic'>" + s + "</span>: \"<span style='color:#008;font-style:italic'>" + @trimSpaces(pair[1]) + "</span>\""
                    sCount++
                  j++
                styles = styles.substring(2)
                break
              else
                n = newIn  if (newIn = @camelCaseProps[n])?
                properties += ", <span style='color:#080;font-weight: bold'>" + n + "</span>:\"<span style='color:#00b;font-weight: bold'>" + v + "</span>\""
                numProps++
                break
          i++
        if useInnerHTML
          ih = node.innerHTML
          unless (index = ih.indexOf("useInnerHTML")) == -1
            ih = ih.substring(index + "useInnerHTML".length)
            ih = ih.substring(index + 3)  if index = ih.indexOf("->") != -1
          properties += ", <span style='color:#080;font-weight: bold'>innerHTML</span>:\"<span style='color:#00b;font-weight: bold'>" + @escapeForJavascript(ih) + "</span>\""
          numProps++
          numChildren = 0
        unless styles == ""
          properties = "{<span style='color:#080;font-weight: bold'>style</span>:{" + styles + "}" + properties + "}"
          numProps++
        else
          properties = "{" + properties.substring(2) + "}"
        str = "<span style='color:red;font-weight:bold'>" + node.nodeName + "</span> ("
        if numChildren
          if numProps
            return str + properties + ",\n" + children + indentStr + ")"
          else
            return str + "\n" + children + indentStr + ")"
        else if numProps
          return str + properties + ")"
        else
          return str + ")"
      when 3
        n = node.nodeValue
        n = @escapeForJavascript(n)  unless node.nodeValue == ""
        n = @trimSpaces(n)
        return "\"<b>" + n + "</b>\""  if n.length > 0
      # when 4  # CDATA_SECTION_NODE       
      # when 5  # ENTITY_REFERENCE_NODE
      when 8
        return "useInnerHTML"  unless node.nodeValue.indexOf("useInnerHTML") == -1
    null
  
  makeJavascript: (elem) ->
    dbox = new AardvarkDBox("#fff", true, false, false, @strings.javascriptDomCode, true)
    dbox.innerContainer.innerHTML = "<pre style=\"margin:3; width: 97%\">" + @domJavascript(elem, 0) + "</pre><br>"
    dbox.show()
    true
  
  undo: ->
    return false  unless @undoData?
    @clearBox()
    ud = @undoData
    switch ud.mode
      when "I"
        a = []
        len = @doc.body.childNodes.length
        count = 0
        i = 0
        while i < len
          e = @doc.body.childNodes.item(i)
          unless e.isAardvark
            a[count] = e
            count++
          i++
        i = count - 1
        while i >= 0
          @doc.body.removeChild a[i]
          i--
        len = @undoData.numElems
        i = 0
        while i < len
          @doc.body.appendChild @undoData[i]
          i++
        @doc.body.style.background = @undoData.bg
        @doc.body.style.backgroundColor = @undoData.bgc
        @doc.body.style.backgroundImage = @undoData.bgi
        @doc.body.style.margin = @undoData.m
        @doc.body.style.textAlign = @undoData.ta
        break
      when "R"
        if ud.nextSibling
          ud.parent.insertBefore ud.elem, ud.nextSibling
        else
          ud.parent.appendChild ud.elem
        break
      else
        return false
    @undoData = @undoData.next
    true
  
  showMenu: ->
    if @helpBoxId?
      if @killDbox(@helpBoxId) == true
        delete (@helpBoxId)
        
        return
    s = "<table style='margin:5px 10px 0 10px'>"
    i = 0
    
    while i < @keyCommands.length
      s += "<tr><td style='padding: 3px 7px; border: 1px solid black; font-family: courier; font-weight: bold;" + "background-color: #fff'>" + @keyCommands[i].keystroke + "</td><td style='padding: 3px 7px; font-size: .9em;  text-align: left;'>" + @keyCommands[i].name + "</td></tr>"
      i++
    s += "</table><br>" + @strings.karmaticsPlug
    dbox = new AardvarkDBox("#fff2db", true, true, true, @strings.aardvarkKeystrokes)
    dbox.innerContainer.innerHTML = s
    dbox.show()
    @helpBoxId = dbox.id
    true
  
  getByKey: (key) ->
    s = key + " - "
    i = 0
    
    while i < @keyCommands.length
      s += @keyCommands[i].keystroke
      return @keyCommands[i]  if @keyCommands[i].keystroke == key
      i++
    null
  
  getElementXPath: (elem) ->
    path = ""
    while elem and elem.nodeType == 1
      index = 1
      sib = elem.previousSibling
      
      while sib
        index++  if sib.nodeType == 1 and sib.tagName == elem.tagName
        sib = sib.previousSibling
      xname = "xhtml:" + elem.tagName.toLowerCase()
      if elem.id
        xname += "[@id='" + elem.id + "']"
      else
        xname += "[" + index + "]"  if index > 1
      path = "/" + xname + path
      elem = elem.parentNode
    dbox = new AardvarkDBox("#fff", true, false, false, "xPath", true)
    dbox.innerContainer.innerHTML = "<pre wrap=\"virtual\" style=\"margin:3; width: 97%\">" + path + "</pre><br>"
    dbox.show()
  
  makeGlobalFromElement: (elem) ->
    if @isBookmarklet
      i = 1
      
      while i < 100
        if @window["elem" + i] == undefined
          @window["elem" + i] = elem
          elem.tree = @tree
          dbox = new AardvarkDBox("#feb", false, true, true)
          dbox.innerContainer.innerHTML = "<p style='color: #000; margin: 3px 0 0 0;'>global variable \"<b>elem" + i + "</b>\" created</p>"
          dbox.show()
          setTimeout "aardvark.killDbox(" + dbox.id + ")", 2000
          return true
        i++
    else
      unless @doc.aardvarkElemNum?
        @doc.aardvarkElemNum = 1
      else
        @doc.aardvarkElemNum++
      removeId = false
      if not elem.id? or elem.id == ""
        elem.id = "aardvarkTmpId" + @doc.aardvarkElemNum
        removeId = true
      s = "window.elem" + @doc.aardvarkElemNum + "= document.getElementById('" + elem.id + "');\n"
      s += "document.getElementById('" + elem.id + "').id = '';"  if removeId
      dbox = new AardvarkDBox("#feb", false, true, true)
      dbox.innerContainer.innerHTML = "<p style='color: #000; margin: 3px 0 0 0;'>global variable \"<b>elem" + @doc.aardvarkElemNum + "</b>\" created</p>"
      dbox.show()
      setTimeout "aardvark.killDbox(" + dbox.id + ")", 2000
      scriptElem = @doc.createElement("script")
      scriptElem.type = "text/javascript"
      scriptElem.appendChild @doc.createTextNode(s)
      h = @doc.getElementsByTagName("head")[0]
      h.appendChild scriptElem
      return true
    false
  
  getNextElement: ->
    @index++
    if @index < @list.length
      @depth = @list[@index].depth
      return @list[@index].elem
    null
  
  tree: ->
    t = 
      list: [elem: this, depth: 0]
      index: -1
      depth: 0
      next: aardvark.getNextElement
    aardvark.addChildren this, t, 1
    t
  
  addChildren: (elem, t, depth) ->
    i = 0
    
    while i < elem.childNodes.length
      child = elem.childNodes[i]
      if child.nodeType == 1
        t.list.push 
          elem: child
          depth: depth
        
        aardvark.addChildren child, t, depth + 1  if child.childNodes.length != 0 and not aardvark.leafElems[child.nodeName]
      i++
