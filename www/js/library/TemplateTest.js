var templates = [];
var comments = [];
var attributes = [];

TemplateExtractor = {

parseComment : function (o, string) {
  var i = string.indexOf("#");
  if (i == 0) {
    o.type = "start";
    o.name = string.substring(1);
    }
  else if (i == string.length-1) {
    o.type = "end";
    o.name = string.substring(0, i);
    }
  else
    return false;
  return true;
  },

extractTemplates : function (node, indent) {
  switch (node.nodeType) {
    case 1: // ELEMENT_NODE
      for (var i=0; i<node.attributes.length; i++) {
        var v;
        if ((v = node.attributes.item(i).nodeValue) != null) { 
          if (node.attributes.item(i).nodeName == "template") {
            var item = {elem: node};

            var a = v.split("(");
            if (a.length == 2) {
              item.name = a[0];
              var a2 = a[1].split(")");
              item.params = a2[0].split(',');
              templates.push(item);
              node.templateDef = item;
              node.removeAttribute('template');
              }
            else {
              Logger.write("err: " + v);
              }
            }
          else if (v.indexOf("[") != -1) {
             attributes.push({elem: node, attr: node.attributes.item(i), indent: indent});
            }
          }
        }
      for (var i=0; i<node.childNodes.length; i++)
        extractTemplates(node.childNodes.item(i), indent+1);
      break;
        
    case 8: // COMMENT_NODE
      {
      var item = {comment: node, val: node.nodeValue, indent: indent};
      if (parseComment(item, node.nodeValue) == true) {
        var tmpNode = node;
        while (tmpNode.parentNode != null) {
          tmpNode = tmpNode.parentNode;
          if (tmpNode.templateDef != null) {
            // todo: check params for match
            tmpNode.templateDef[item.name] = item;      
            }
          }
        comments.push(item);
        }
      break;
      }
    },  
  
delims : {
  start1: "#$@%",
  end1:   "@!#@", 
  start2: "&#$@", 
  end2 :  "&$@#"
  },

replaceAttributeTags : function (attribute, tags, stripOnly) {
  var s = attribute.nodeValue, n = '', pos = 0;
  for (var i=0; i<tags.length; i++) {
   tag = tags[i];
   n += s.substring(pos, tag.s);
   if (!stripOnly) {
    if(tag.isEnd) {
     n +=  this.delims.end1 + tag.name + this.delims.end2;
     }
    else {
     n += this.delims.start1 + tag.name + this.delims.start2;
     }
    }
   pos = tags[i].e;
   }
  attribute.nodeValue = n;
  },
  
findAttributeTags : function (s) {
  var tags = [], len = s.length;
  var pos = 0;
  while(pos < len) {
    var i1 = s.indexOf('[', pos);
    if (i1 != -1) {
      var i2 = s.indexOf(']', i1+1);
      if (i2 != -1) {
        var item = {s: i1, e: i2+1};
        if (s.charAt(i1+1) == '#') {
          item.name = s.substring(i1+2, i2);
          tags.push(item);
          }
        else if (s.charAt(i2-1) == '#') {
          item.isEnd = true;
          item.name = s.substring(i1+1, i2-1);
          tags.push(item);
          }
        pos = i2+1;
        }
      else {
        break;
        }
      }
    else {
      break;
      }
    }

  var newTags = [];
  
  for (var i=0; i<tags.length; i++) {
    tag = tags[i];
    if (tag.isEnd) {
      if(i==0)
        newTags.push ({name: tag.name, s: 0, e: 0});
      else if (tags[i-1].isEnd != null)
        newTags.push ({name: tag.name, s: tags[i-1].e, e: tags[i-1].e});
      newTags.push(tag); 
      }
     else { // start tag
      newTags.push(tag); 
      if(i==tags.length-1)
        newTags.push ({name: tag.name, s: s.length, e: s.length, isEnd: true});
      else if (i>0 && tags[i-1].isEnd == null)
        newTags.push ({name: tags[i-1].name, s: tag.s, e: tag.s, isEnd: true});
      }
    }
  return newTags;
  } 
};

/*
extractTemplates(document.body, 0);

for (var i=0; i<templates.length; i++) {
  Logger.write ("---------\n" + templates[i].elem.tagName + " " + templates[i].name);
  Logger.write (templates[i].params);
  }
Logger.write ("---------\n");
for (var i=0; i<comments.length; i++) {
  var e = comments[i].comment;
  var n = document.createTextNode("****" + comments[i].name + '(' + comments[i].type + ")****");
  e.parentNode.replaceChild(n, e);  
// Logger.write ("comment: " + comments[i].val);
  }
for (var i=0; i<attributes.length; i++) {
  Logger.write ("attribute: " + attributes[i].elem.tagName + " " + attributes[i].attr.nodeValue);
  }
*/