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
  
  // you can use the return value, or, if preferred, use the callback
  getElementsByPath : function(path, parent, cb) {
   var count = 0;
   if(parent == null)
    parent = document.getElementsByTagName('html')[0];
  
   var depth = 0;
   var final = [];
   var maxDepth = path.length-1;
  
   function process (p, path, d) {
     var a = SimplePath.getElementsByPathSelector(p, path[d]);
     if (d == maxDepth) {
       for (var i=0; i<a.length; i++) {
         final.push(a[i]);
         if (cb)
           cb (a[i], count);         
         count++;
         }
     }
     else {
       for (var i=0; i<a.length; i++)
         process(a[i], path, d+1);
     }
   }
   process (parent, path, 0)
   return final;
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
  }
};
