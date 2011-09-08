ParseCss = {
path : "http://www.exxonmobil.com",
newPath: "filesFromCss/",
lines: null,
uniqueItems : {},


fixUrl : function (o) {
 if (o.url.charAt(0) == "'" && o.url.charAt(o.url.length-1) == "'")
  o.url = o.url.substring(1, o.url.length-1);
 if (o.url.indexOf(this.path) == 0)
  o.url = o.url.substring(this.path.length);
 if (o.url.indexOf("../") == 0)
  o.url = o.url.substring(2);

 var file;
 var i;
 if ((i = o.url.lastIndexOf("/")) != -1)
  file = o.url.substring(i+1);
 else
  file = o.url;
 o.file = file; 
 if (this.uniqueItems[o.url] == null)
  this.uniqueItems[o.url] = o;
 },



extractUrlStrings : function (fullText) {
this.lines =  fullText.split("\n");

var start = "url(";
var end = ")";

for (var i=0; i<this.lines.length; i++) {
 s = this.lines[i];
 var index1, index2 ;

 if ((index1 = s.indexOf(start))!= -1 &&  (index2 = s.indexOf(end, index1)) != -1)
   this.lines[i] = {
    start: s.substring (0, index1+start.length),
    url: s.substring (index1+start.length, index2),
    end: s.substring (index2)
    };
   }
 }
}

var count1 = 0, count2 = 0;
ParseCss.extractUrlStrings(ta1.value);
//Logger.write(ParseCss.lines)
for (var i=0; i<ParseCss.lines.length; i++) {
 if (typeof(ParseCss.lines[i]) != "string") {
   count1++;
   ParseCss.fixUrl(ParseCss.lines[i]);
   }
 }
var s = "";
for (var i in ParseCss.uniqueItems) {
   count2++;
   s += "wget " + ParseCss.path + i + " -O " + ParseCss.uniqueItems[i].file + "\n";
   }
ta2.value = s;

var s = "";
for (var i=0; i<ParseCss.lines.length; i++) {
 if (typeof(ParseCss.lines[i]) == "string")
  s += ParseCss.lines[i] + "\n";
 else
    s += ParseCss.lines[i].start + ParseCss.newPath + ParseCss.lines[i].file + ParseCss.lines[i].end + "\n";
 }
ta3.value = s;


Logger.write (count1 + " " + count2)