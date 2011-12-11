PopupWindow = {
  zIndex: 25000,
  
  constructor: function (title, name, isResizable, windowCallback) {
    this.title = title;
    this.name = name;
    this.isResizable = isResizable;
    this.windowCallback = windowCallback;
    
    if(PopupWindow.displayedList == null) {
      PopupWindow.displayedList = new NamedItemList();
    }
    
    var resizeElem, moveElem, killbox, cornerTD;
    with (DomGenerator) {
      this.element = 
      TABLE({className: "rjbwindow", style: {zIndex: PopupWindow.zIndex++}},
        TBODY(
          TR(
            moveElem =
            TD({className: "dragbar"},
              DIV({className: "rjbtitle"},
                this.title
              )
            ),
            TD({className: "killbox"},
              killbox = DIV({className: "killbox"})
            )
          ),
          TR(
            TD(
              this.contentElem = DIV({className: "content"})
            ),
            TD()
          ),
          TR(
            TD(),
            ((this.isResizable) ? TD({className: "cornerdragger"},
                resizeElem = DIV({className: "cornerdragger"})) : 
              TD())
          )));
    }
    var self = this;
    killbox.onclick = function(){self.kill()};
    Callbacks.setMouseCallback (moveElem,
      {func:PopupWindow.mouseHandlers.drag, thisObject:this, params:[{isResize: false}]}, 
      {draggable: true, blockSelect: true});
    if (this.isResizable) {
      Callbacks.setMouseCallback (resizeElem,
        {func:PopupWindow.mouseHandlers.drag,
          thisObject:this, params:[{isResize: true}]}, {draggable: true, blockSelect: true});
      if (this.width)
        this.contentElem.style.width = this.width + 'px';
      if (this.height)
        this.contentElem.style.height = this.height + 'px';
    }
  },
  
  prototype : {
    
    /*moveToFront : function () {
      var doMove = false;
      var elem = this.element;
      var dims = DomUtils.getWindowDimensions ();
      var pos =  DomUtils.getPos (elem);
      if (pos.x + elem.offsetWidth > dims.width) {
        pos.x = dims.width-elem.offsetWidth;
        doMove = true;
      }
      if (pos.y + elem.offsetHeight > dims.height) {
        pos.y = dims.height-elem.offsetHeight;
        doMove = true;
      }
      if (pos.x < dims.scrollX) {
        pos.x = dims.scrollX + 4;
        doMove = true;
      }
      if (pos.y < dims.scrollY) {
        pos.y = dims.scrollY + 4;
        doMove = true;
      }
      
      if (doMove)
        DomUtils.moveElem (elem, pos.x, pos.y);
      this.element.style.zIndex = PopupWindow.zIndex++;  
      if (this.windowCallback != null)
        this.windowCallback ("tofront", this);
    },*/
    
    //----------------------------------------------------
    // todo:  make it try to avoid covering parent element
    // (or, is this a bad idea?)
    show : function (parentElement) {
      if (this.element == null || this.isShown)
        return;
      
      this.isShown = true; 
      var dims = DomUtils.getWindowDimensions ();
      var elem = this.element;
      DomUtils.moveElem (elem, -10000, -10000);
      document.body.appendChild (elem);
      var x = dims.scrollX + (dims.width-elem.offsetWidth)/2, 
      y = dims.scrollY + (dims.height-elem.offsetHeight)/2;
      var w=0, h=0;
      if (this.name) {
        var lastPopupWindow = PopupWindow.displayedList.getLastAdded (this.name);
        if (lastPopupWindow) {
          pos = DomUtils.getPos (lastPopupWindow.element);
          x = pos.x + 20;
          y = pos.y + 20;
        }
        else {
          var s = Cookie.getCookie(this.name + "-pos");
          if (s && s.length > 3) {
            var a = s.split(",");
            x = parseInt(a[0]);
            y = parseInt(a[1]);
            if (a.length == 4) {
              w = parseInt(a[2]);
              h = parseInt(a[3]);
            }
          } 
        }
        PopupWindow.displayedList.insert (this.name, this);
      }
      if (w > 0) {
        this.element.style.width = (w+5)+"px";
        this.contentElem.style.width = w+"px";
        this.contentElem.style.height = h+"px";
        if (this.windowCallback != null)
          this.windowCallback ("resize", this);
      }
      
      if (x + elem.offsetWidth > dims.width)
        x = dims.width-elem.offsetWidth;
      if (y + elem.offsetHeight > dims.height)
        y = dims.height-elem.offsetHeight;
      if (x < dims.scrollX)
        x = dims.scrollX + 4;
      if (y < dims.scrollY)
        y = dims.scrollY + 4;
      DomUtils.moveElem (elem, x, y);
    },
    
    //----------------------------------------------------
    kill : function () {
      if (this.windowCallback) {
        if (this.windowCallback("kill", this) == true)
          return;
      }
      delete this.isShown;
      this.element.parentNode.removeChild(this.element);
      delete (this.element);
      if (PopupWindow.displayedList)
        PopupWindow.displayedList.remove (this.name, this);
    }
  },
  
  mouseHandlers : {
    
    //----------------------------------------------------
    drag : function (args, type, elem, event) {
      switch (type) {
        case "click":
          this.element.style.zIndex = PopupWindow.zIndex++;
          if (this.windowCallback != null)
            this.windowCallback ("tofront", this);
          break;
        
        case "startdrag":
          this.startMousePos = DomUtils.getMousePosFromEvent(event);
          if (args.isResize) {
            this.startElemDims = {w:this.element.offsetWidth, 
              h: this.element.offsetHeight, 
              wDelta: this.element.offsetWidth - this.contentElem.offsetWidth,
              hDelta : this.element.offsetHeight - this.contentElem.offsetHeight};
          }
          else
            this.startElemPos = DomUtils.getPos(this.element);
          this.element.style.zIndex = PopupWindow.zIndex++;
          if (this.windowCallback != null)
            this.windowCallback ("tofront", this);
          
          break;

        case "drag":
          var pos = DomUtils.getMousePosFromEvent(event);
          var diffX = pos.x - this.startMousePos.x,
          diffY = pos.y - this.startMousePos.y;
          if (args.isResize) {
            var w = this.startElemDims.w + diffX, h  = this.startElemDims.h + diffY;
            if (w > 10)
              this.element.style.width = w + "px";
            if (h > 10)
              this.element.style.height = h + "px";
            this.contentElem.style.width = (w-(this.startElemDims.wDelta+10))+"px";
            
            this.contentElem.style.height = (h-(this.startElemDims.hDelta+10))+"px";
            
            if (this.windowCallback)
              this.windowCallback ("resize", this);
          }
          else {
            var x = this.startElemPos.x+diffX, y = this.startElemPos.y+diffY;
            if (x < 0)
              x = 0;
            if (y < 0)
              y = 0;
            DomUtils.moveElem(this.element, x, y);
          }
          break;

        case "enddrag":
          if (this.name) {
            //if (!args.isResize) { //
            {
              var pos = DomUtils.getPos (this.element);
              var s = pos.x + "," + pos.y;
              if (this.isResizable)
                s += "," + this.contentElem.offsetWidth + "," + this.contentElem.offsetHeight;
              Cookie.setCookie(this.name + "-pos",  s, "/", 5);
            }
          }
          delete (this.offsetPos);
          break;

        case "over":
          DomUtils.modifyClassName (elem, true, "hilite");
          break;

        case "out":
          DomUtils.modifyClassName (elem, false, "hilite");
          break;
      }
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
  })("PopupWindow");
