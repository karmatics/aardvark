var Callbacks = {
  // this should be obsoleted as soon as I redo the
  // dragging in a better way
  
  //-------------------------------------------
  setMouseCallback : function(elem, callback, moreParams) {
    elem.mouseCallback = {callback: callback};
    elem.onmouseover = Callbacks.mouseCallbacks.over;
    elem.onmouseout = Callbacks.mouseCallbacks.out;
    
    if (moreParams && moreParams.draggable) {
      elem.onmousedown = Callbacks.mouseCallbacks.startdrag;
      if (moreParams.blockSelect)
        elem.mouseCallback.blockSelect = true;
    }
    else 
      elem.onclick = Callbacks.mouseCallbacks.click;
  },
  
  //-------------------------------------------------
  // cross-browser event handling with listeners (if available)
  setListener : function(element, eventType, handler) {
    if(element.addEventListener) {
      element.addEventListener(eventType, handler, false);
      return true;
    }
    else if(element.attachEvent) {
      element.attachEvent('on' + eventType, handler);
      return true;
    }
  },
  
  //-------------------------------------------------
  cancelListener : function(element, eventType, handler) {
    if(element.removeEventListener) {
      element.removeEventListener(eventType, handler, false);
      return true;
    }
    else if(element.detachEvent) {
      element.detachEvent('on' + eventType, handler);
      return true;
    }
  },
  
  //-------------------------------------------
  mouseCallbacks : {
    dragElement : null,
    
    click : function(evt) {
      var o = this.mouseCallback;
      return Callbacks.doCallback (o.callback, "click",  ((evt)?evt:window.event));
    },
    
    startdrag : function(evt) {
      Callbacks.mouseCallbacks.dragElement = this;
      Callbacks.setListener (document, "mousemove",
        Callbacks.mouseCallbacks.drag, true);
      Callbacks.setListener (document, "mouseup",
        Callbacks.mouseCallbacks.enddrag, true);
      var o = this.mouseCallback;
      if (!evt)
        evt = window.event;
      if (o.blockSelect) {
        if (document.all)
          evt.cancelBubble = true;
        else
          evt.preventDefault();
      }
      return Callbacks.doCallback (o.callback, "startdrag", this, evt);
    },
    
    drag : function(evt) {
      var elem = Callbacks.mouseCallbacks.dragElement;
      var o = elem.mouseCallback;
      if (!evt)
        evt = window.event;
      if (evt.preventDefault) {
        if (document.all)
          evt.cancelBubble = true;
        else
          evt.preventDefault();
      }
      return Callbacks.doCallback (o.callback, "drag", elem, evt);
    },
    
    enddrag : function(evt) {
      var elem = Callbacks.mouseCallbacks.dragElement;
      var o = elem.mouseCallback;
      Callbacks.cancelListener (document, "mousemove",
        Callbacks.mouseCallbacks.drag);
      Callbacks.cancelListener (document, "mouseup",
        Callbacks.mouseCallbacks.enddrag);
      if (o.queueOverOut)
        Callbacks.doCallback (o.callback,
        (o.queueOverOut==1)?"over":"out", this, ((evt)?evt:window.event));
      delete (Callbacks.mouseCallbacks.dragElement);
      return Callbacks.doCallback (o.callback,
        "enddrag", elem, ((evt)?evt:window.event));
  },
  
  over : function(evt) {
    var o = this.mouseCallback;
    if (Callbacks.mouseCallbacks.dragElement == this)
      o.queueOverOut = 1;
    else {
      delete (o.queueOverOut);
      return Callbacks.doCallback (o.callback, "over", this, ((evt)?evt:window.event));
    }
  },
  
  out : function(evt) {
    var o = this.mouseCallback;
    if (Callbacks.mouseCallbacks.dragElement == this)
      o.queueOverOut = 2;
    else {
      delete (o.queueOverOut);
      return Callbacks.doCallback (o.callback, "out", this, ((evt)?evt:window.event))
    }
  }
},

//------------------------------------------------
// doCallback 
doCallback : function (callback) {
  var ret;
  try {
    var i, a = [];
    if (callback.params) {
      for (i=0; i < callback.params.length; i++)
        a.push(callback.params[i]);
    }
    for (i=1; i < arguments.length; i++)
      a.push(arguments[i]);
    ret = callback.func.apply (callback.thisObject, a);
  }
  catch (e) {
    if (window.Logger != null) {
      if (e.stack != null) {
        var x = e.stack.split("\n");
        e.stack = x;
      };
      Logger.write (e);
    }
    return;
  }
  if (callback.returnValue != null) // forced return value
    return callback.returnValue;
  return ret;
}

};