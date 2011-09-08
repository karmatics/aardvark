TogglePanel = {

constructor: function (targetPanel, name) {
  this.separatorName = "wmiseparator";
  this.targetPanel = document.getElementById(targetPanel);
  this.name = name;
  this.read();
  this.buildElem(true);  
 },
 
prototype: {
  read : function () {
    this.list = [];
    var curr = [];
    this.list.push(curr);
    for (var i=0; i<this.targetPanel.childNodes.length; i++) {
      var elem = this.targetPanel.childNodes[i];
      if (elem.tagName == "HR" && elem.className && elem.className.indexOf("wmiseparator") == 0) {
        curr = [];
        this.list.push(curr);
        }
      else
        curr.push(elem);
      }
  },
    
  buildElem: function (append) {
    this.items = [];
    var html = "";
    var d = document.createElement("div");
    this.element = d;
    d.className = "toggleBox";
    
    for (var i=0; i<this.list.length; i++)
      html += "<div class='toggleItem'>" + (i+1) + "</div>";
    html += "<div class='toggleItem' style='background-color: #ffa'>All</div>";
    d.innerHTML = html;
    for (var i=0; i<d.childNodes.length; i++) {
      var a = d.childNodes[i];
      this.items.push(a);
      a.onclick = (function(which, self){
         return function () {
          self.swapPanel(which);
          }
        })(i, this);
      }
    if (append)
      document.body.appendChild(this.element);
    },

  hide: function() {
    this.addAll();
    if (this.element && this.element.parentNode)
      this.element.parentNode.removeChild(this.element);
    },
    
  removeElemChildren : function (elem) {
    var len = elem.childNodes.length;
    for (var i = len-1; i>=0; i--)
      elem.removeChild (elem.childNodes[i]);
    },  
    
  swapPanel: function (which) {
    var elems, target, src, len;
    for (var i=0; i<this.items.length; i++)
      this.items[i].style.backgroundColor = (i==which)?"#ffa":"";
    elems = [];
    target = this.targetPanel;
    this.removeElemChildren(target);
    //target.innerHTML = '';
    src = this.list[which];
    if (src == null) {
     this.addAll();
     return;
     }
    len = src.length;
    for (var i=0; i<len; i++) {
      target.appendChild(src[i]);
      }
    },
   
   addAll : function () {
    this.removeElemChildren(this.targetPanel);
//    this.targetPanel.innerHTML = "";
    for (var i=0; i<this.list.length; i++) {
      if (i > 0) {
        var sep = document.createElement("hr");
        sep.className = "wmiseparator xxxxxxxxxxxx xxxxxxxxxxxxx xxxxxxxxxxxxxxx xxxxxxxxxxxxx";
        this.targetPanel.appendChild (sep);
        }      
      var sublist = this.list[i];
      for (var j=0; j<sublist.length; j++)
        this.targetPanel.appendChild(sublist[j]);
      }
    },
    
  dup : function (which) {
    var src = this.list[which], dest = [];
    for (var i=0; i<src.length; i++)
      dest.push (src[i].cloneNode(true));
    this.list.push(dest);
    this.hide();
    this.buildElem(true);
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
  })("TogglePanel");

