SimplePath = {
  
  getElementsByPathSelector: function (parent, pathSelector) {
   var out = [];

   var e, count = 1, cn = parent.childNodes;
    for (var i=0; i<cn.length; i++) {
      if (pathSelector.type == cn[i].tagName) {
        if (!pathSelector.num ||
            count == pathSelector.num) {
          out.push(cn[i]);
        }
        count++;
      }
   }
   return out;
  },
  
  combinePaths: function (path1, path2) {
    var len1 = path1.length, len2 = path2.length;

    if (len1 < len2) {
      var t = len2;
      len2 = len1;
      len1 = t;
      t = path2;
      path2 = path1;
      path1 = t;
    }; 
   for (var i=0; i<len2; i++) {
    if(path1[i].type != path2[i].type)
      return null;
    if(path1[i].num != path2[i].num)
      path1[i].num = 0;
   }
  if (len1 != len2) {
    path1[len2-1].doCallback = true;
    //Logger.write("asdfasdf");
    //Logger.write(path1[len2-1]);
    }
  return path1;
  },
  
  getElementsByPath : function(path, parent, cb) {
   if (parent == null)
    parent = document.getElementsByTagName('html')[0];
  
   var depth = 0;
   var maxDepth = path.length-1;
  
   function process (p, path, d) {
     var a = SimplePath.getElementsByPathSelector(p, path[d]);
     if (d == maxDepth) {
       for (var i=0; i<a.length; i++)
         cb (a[i], d);
     }
     else {
       for (var i=0; i<a.length; i++) {
         if (path[d].doCallback)
          cb (a[i], d);
         process(a[i], path, d+1);
         }
     }
   }
   process (parent, path, 0)
  },
  
  getPath : function (elem, ancestor) {
   if(ancestor == null)
    ancestor = document.getElementsByTagName('html')[0];
   var path=[];
   while(elem.parentNode) {
    if(elem === ancestor)
      return path.reverse();
    var item = {type: elem.tagName, num: this.whichChildOfType(elem)};
    if (elem.className && elem.className != '')
      item.class = elem.className;
    if (elem.id && elem.id != '')
      item.id = elem.id;
    path.push(item)
    elem=elem.parentNode;
   }
  return path.reverse();
  },
  
  whichChildOfType : function (elem) {
    var parent = elem.parentNode;
    if (parent) {
     count = 1;
     for (var i=0; i<parent.childNodes.length; i++) {
      if (parent.childNodes[i] === elem)
       return count;
      if (parent.childNodes[i].tagName == elem.tagName)
        count++;
      }
     }
   return -1; 
  },
  
  pathFromEditor : function(which) {
    var curr, ioBox = null;
    var count = 0;
    for (var i=1; i<1000; i++) {
      if ((curr = window["io" + i]) != null) {
        if(curr.isPathBox) {
          count++;
          if(which==null) {
            if (count > 1)
              return null;
            ioBox = curr;
          }
          else {
            if(which == count)
              return JSON.parse(curr.value);
          }
        }
      }
     }
    if (count == 1) {
      return JSON.parse(ioBox.value);
    }
    return null;
  },
  
  getColor : function (id) {
    if(this.colors[id] == undefined)
      this.colors[id] = Math.round(Math.random()*255) + ',' +
        Math.round(Math.random()*255) + ',' + 
        Math.round(Math.random()*255);
    return this.colors[id];
  },  
  
  hiliteElem : function (elem, id) {
    
    var color = this.getColor(id);
    elem.style.border = '2px dashed rgb(' + color + ')';
    elem.style.background = 'rgba(' + color + ',.2)';
    this.hilitedElements.push(elem);
  },
  
  clearColors : function () {
    this.colors = {};
  },

  clearHilited : function () {
    for (var i=0; i<this.hilitedElements.length; i++) {
      var s = this.hilitedElements[i].style;
      s.border = '';
      s.background = '';
    }
    this.hilitedElements = [];
  },

  colors : {},
  hilitedElements : [],
  
  openEditor : function (elem) {
    var io = Logger.makeIoBox();
    io.isPathBox = true;
    io.value = Logger.formatJson(JSON.stringify(SimplePath.getPath(elem)));
  }
  
};
