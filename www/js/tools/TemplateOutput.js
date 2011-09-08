TemplateOutput = {
  
  //-------------------------------------------
  makePhpFunctionString : function (name, template) {
    var s = '';
    var names = [];
    
    s += "function template_" + name + " (";
    if (template.names == null) {
      Logger.write(name);
      Logger.write(template);
      }
    for (var i=0; i<template.names.length; i++)
     s += "$" + template.names[i] + ", ";
    if (template.names.length>0)
      s = s.substring (0, s.length-2);
    s += ") {\n  return ";
    
    var start = 0;
    for (var i =0; i<template.positions.length; i++) {
      s +=  SharedWMITools.escapeStringForPhp(template.html.substring(start, template.positions[i].s)) + " .\n    $" +
        template.names[template.positions[i].nameIndex] + " .\n    ";
      start = template.positions[i].e;
      }
    s += SharedWMITools.escapeStringForPhp(template.html.substring(start)) + ";"; 
    s += "\n  }\n";
      return s;
    },
    
  //-------------------------------------------
  makeJsFunctionString : function (template) {
    var count = 0;
    
    var s = "function (";

    for (var i=0; i<template.names.length; i++)
      s += template.names[i] + ", ";
    s = s.substring (0, s.length-2) + ") {\n  return ";

    var start = 0;
    for (var i =0; i<template.positions.length; i++) {
      s += "\"" + SharedWMITools.escapeStringForJson(
        template.html.substring(start, template.positions[i].s)) +
        "\" + \n    " + 
        template.names[template.positions[i].nameIndex] + " +\n   ";
      start = template.positions[i].e;
      }
    s += "\"" + SharedWMITools.escapeStringForJson(
        template.html.substring(start)) + "\";"; 
    return s + "\n  }";
    },

  //-------------------------------------------
  makeString : function (template) {
    if (arguments.length >= template.sa.length) {
      var s = '';
      var sa = template.sa;
      for (var i=0; i<sa.length-1; i++)
        s += sa[i] + arguments[i+1];
      s += sa[i];
      return s;
      }
    return null; 
    },

  //-----------------------------------------
  makeJsFunctions : function (templateFuncs) {
    for (var i in this.list) {
       var s = this.makeFunctionString(this.list[i])
       var f;
       eval("f=" + s);
       templateFuncs[i] = f;
       }
    },

  //-------------------------------------------
  buildJsonString: function(name, template) {
      var sa = template.sa;
      s = " \"" + i + "\": [\n"
      for (var j=0; j<sa.length; j++)
        s += "\"" + SharedWMITools.escapeStringForJson(sa[j]) + "\",\n";
      s = s.substring(0, s.length-2) + "\n]";
      return s;
    }   
};



