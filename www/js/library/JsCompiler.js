var JsCompiler = {

isNonSymbolChar : function (c) {
return ("abcdefghijklmnopqrstuvwxyz1234567890_$".indexOf(c.toLowerCase()) == -1);
},

replaceSymbol : function (symbol, newSymbol, string) {
  var strlen = string.length;
  var symlen = symbol.length;
  var start = 0;
  var a = [];
  while (start < strlen) {
    var i = string.indexOf(symbol, start);
    if (i == -1)
      break;
    a.push(i);
    start = i + symlen;
    }
 var b = [];
 for (var i=0; i<a.length; i++) {
  var index = a[i]; 
  if ((index == 0 || isNonSymbolChar(string.charAt(index-1))) &&
    ((index+symlen == strlen) || isNonSymbolChar(string.charAt(index+symlen))))
    b.push(index);
  }
 var outString = string.substring(0, b[0]);
 for (var i =0; i<b.length; i++) {
  outString += newSymbol + string.substring(b[i]+symlen, b[i+1])
  }
 return outString;
 }
};
