var JsParser = {
  
  //----------------------------------------------------------
  getIndent : function (string) {
    var indent = 0;
    var len = string.length;
    var i = 0;
    for (i=0; i<len; i++) {
      var ch = string.charAt(i);
      if (ch == ' ')
        indent++;
      else if (ch == '\t') {
        if (i%2 == 0)
          indent += 2;
        else
          indent ++;
      }
      else
        break;
    }
    return {indent: indent, string: string.substring(i)};
  },
  
  //----------------------------------------------------------
  // given a long string and an array of short strings,
  // find the first occurance of one of the short ones in
  // the long one.  Return the stringNo (index into the array)
  // and character index in an object
  findFirstFromSetOfStrings : function (searchStrings,
    string, startIndex, endIndex) {
    var nSS = searchStrings.length;
    var min = 10000, best = -1;
    
    for (var i=0; i<nSS; i++) {
      var ind = string.indexOf(searchStrings[i], startIndex);
      if (ind != -1 && ind < min) {
        min = ind;
        best = i;
      }
    }
    return ((best == -1 || (endIndex && min >= endIndex)) ?
      null : {stringNo: best, index: min});
  },
  
  //----------------------------------------------------------
  // returns object with array of quoted sections (with the type --
  // single or double -- the start and end character index in the 
  // string, the endComment string, and the string itself minus the 
  // comment string)
  findQuotesAndComments : function (string, startPoint, endPoint) {
    var state = 0, quotes= [], r;
    var searchStrings = [
      ["\"", "'", "//", "\\\"", "\\\'"], // 0: non quote
      ["'",  "\\'" ],     // 1: in single quote
      ["\"", "\\\""]      // 2: in double quote
    ];
    var currQuote = null;
    var foundString;
    while ((r = this.findFirstFromSetOfStrings (
          searchStrings[state],
          string, startPoint, endPoint)) != null) {
      foundString = searchStrings[state][r.stringNo]; 
      switch (state) {
        case 0:
        if (r.stringNo == 0) {
          currQuote = {
            type : "double",
            start : r.index
          }
          state = 2;
        }
        else if (r.stringNo == 1) {
          currQuote = {
            type : "single",
            start : r.index
          }
          state = 1;
        }
        else if (r.stringNo == 2) {
          if (currQuote)
            Logger.write ("error: " + string);       
          return {
            endComment: string.substring (r.index),
            string: string.substring(0, r.index),
            quotes: quotes
          };
        }
        break;
        case 1:
        case 2:
        if (r.stringNo == 0) {
          currQuote.end = r.index + 1;
          quotes.push(currQuote);
          state = 0;
          currQuote = null;
        }
        break;
      }
      startPoint = r.index + foundString.length;
    }
    if (currQuote)
      Logger.write ("error: " + string); 
    return {
      string: string,
      quotes: quotes
    };
  },
  
  //----------------------------------------------------------
  // a partial line, which is known to be js code,
  // neither comments nor quotes (so things like braces and parent are
  // actually braces and parens, not just something in a comment or quote)
  processCodeSpanForDelims : function (codeSpan, lineData, delimTracker) {
    var string = lineData.string;
    var startPoint = codeSpan.start, end = codeSpan.end, r;
    
    while ((r = this.findFirstFromSetOfStrings (delimTracker.delims,
          string, startPoint, end)) != null) {
      if (r.stringNo%2==0) {
        var currDelim = {
          type: r.stringNo,
          startIndex: r.index,
          startLineNo: codeSpan.lineNo,
          children: [],
          parent: (delimTracker.stackLen>0) ?
          delimTracker.stack[delimTracker.stackLen-1] :
          delimTracker
        }
        currDelim.parent.children.push (currDelim);
        delimTracker.stack[delimTracker.stackLen] = currDelim;
        delimTracker.stackLen++;
      }
      else {
        if (delimTracker.stackLen>0) {
          delimTracker.stackLen--; 
          if (delimTracker.stack[delimTracker.stackLen].type != r.stringNo-1) {
            Logger.write ("error: " + codeSpan.lineNo + ", t1:" +
              delimTracker.stack[delimTracker.stackLen].type + ", t2:" + (r.stringNo-1) +
              ", " + delimTracker.stackLen + ", [" + string + "]"  +
              delimTracker.stack[delimTracker.stackLen].startLineNo + ", " +
              delimTracker.stack[delimTracker.stackLen].startIndex);
          }
          delimTracker.stack[delimTracker.stackLen].endIndex = r.index;
          delimTracker.stack[delimTracker.stackLen].endLineNo = codeSpan.lineNo;
        } else {
          Logger.write("uh oh neg stack!");
        }
      }
      delimTracker.count[r.stringNo]++;
      startPoint = r.index + delimTracker.delims[r.stringNo].length;
    }
  },
  
  //----------------------------------------------------------
  processLine : function (inString, delimTracker, lineNo) {
    var indent = this.getIndent(inString), codeSpan;
    var newIndent = delimTracker.stackLen;
    var lineData = this.findQuotesAndComments (indent.string);
    lineData.newIndent = newIndent;
    var q = lineData.quotes, index = 0, codeSpans = [];
    for (var j=0; j<q.length; j++) {
      codeSpan = {lineNo: lineNo, spanNo: j,
        start: index, end: q[j].start};
      this.processCodeSpanForDelims (codeSpan, lineData, delimTracker);
      codeSpans.push (codeSpan);
      index = q[j].end;
    }
    codeSpan = {lineNo: lineNo, spanNo: q.length, 
      start: index, end: null};
    this.processCodeSpanForDelims (codeSpan, lineData, delimTracker);
    codeSpans.push (codeSpan);
    lineData.codeSpans = codeSpans;
    lineData.indent = indent.indent;
    return lineData;	
  },
  
  //----------------------------------------------------------
  processJs : function (text) {
    var spaces = ' ', s = '';
    for (i=0; i<200; i++)
      spaces += ' ';
    JsParser.lines = [];
    JsParser.delimTracker = {
      stack: [],
      stackLen: 0,
      errors: [],
      children: [], // root delimeter objects
      delims: ["{", "}", "[", "]", "(", ")"],
      count:  [0, 0, 0, 0, 0, 0]};	
    var a = text.split("\n");
    for (var i=0; i<a.length; i++) {
      var lineData = JsParser.processLine (a[i],
        JsParser.delimTracker, i);
      JsParser.lines.push (lineData);
    }
    
    delete JsParser.delimTracker.stack;
    delete JsParser.delimTracker.stackLen;
    var currIndent = 0;
    for (var i=0; i<this.lines.length; i++) {
      var str = this.lines[i].string;
      if (str.length == 0) {
        if (this.lines[i].endComment)
          s += spaces.substring(0, currIndent*2) + this.lines[i].endComment;
        s += '\n';
      }
      else {
        var first = str[0];
        // todo: loop
        if (first==')' || first==']' ||  first=='}') {
          this.lines[i].newIndent--;
        }
        else if (i>0) {
          var prevString = this.lines[i-1].string;
          var keys = ['if', 'for', 'else', 'while'];
          var alnum = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_";
          var found = false;
          for (var j=0; j<keys.length; j++) {
            if (prevString.indexOf(keys[j]) == 0 && 
              alnum.indexOf(prevString[keys[j].length]) == -1 && 
              this.lines[i-1].newIndent == this.lines[i].newIndent
            )
            this.lines[i].newIndent++;
            found = true;
          }
        }
        s += spaces.substring(0, currIndent*2) + str;
        if (this.lines[i].endComment)
          s += ' ' + this.lines[i].endComment;
        s += '\n';
      }
      //this.lines[i].newIndent = currIndent;
    }
    // Logger.write (this.lines)
    // Logger.write(JsParser.delimTracker, 0,0, 100);
    /*var s = "";
    var cc = JsParser.delimTracker.children[0].children;
    for (var i=0; i<cc.length; i++) {
      var cb = cc[i];
      Logger.write (i + " sln:" + cb.startLineNo + ", si:" + cb.startIndex + ", eln:" +
        cb.endLineNo + ", ei:" + cb.endIndex);
    }*/
    //		Logger.write (JsParser.delimTracker.stack.length);
    return s; //JsParser.show ();
  },
  
  /*
  //----------------------------------------------------------
  show : function () {
    var s = "";
    for (var i=0; i<this.lines.length; i++) {
      line = this.lines[i];
      //for (x=0; x<line.indent; x++)
      //		s += "-"
      for (var j=0; j<line.codeSpans.length; j++) {
        var c = line.codeSpans[j];
        s += this.cleanSubstring (line.string, c.start, c.end);
        var q = line.quotes[j];
        if (q)
          s += "<b style='color:#a00'>" +
        this.cleanSubstring (line.string, q.start, q.end) + "</b>";
      }
      if (line.endComment)
        s += "<b style='color:#080'>" +
      this.cleanSubstring (line.endComment, 0) + "</b>";
      s += "<br>";
    }
    return s;
  },
  
  //----------------------------------------------------------
  buildString : function () {
    var s = "";
    for (var i=0; i<this.lines.length; i++) {
      line = this.lines[i];
      for (var j=0; j<line.codeSpans.length; j++) {
        var c = line.codeSpans[j];
        s += this.cleanSubstring (line.string, c.start, c.end);
        var q = line.quotes[j];
        if (q)
          s += this.cleanSubstring (line.string, q.start, q.end);
      }
      if (line.endComment)
        s += this.cleanSubstring (line.endComment, 0);
      s += "\n";
    }
    return s;
  },
  
  //----------------------------------------------------------
  cleanSubstring : function (string, start, end) {
    var s;
    if (end == null)
      s = string.substring(start)
    else
      s = string.substring(start, end);
    return s.replace(new RegExp("<", "g"), '&lt;').
    replace(new RegExp(">", "g"), '&gt;');
  },
  */
  //----------------------------------------------------------
  isAlnum : function (s) {
    var len = s.length;
    for (var i=0; i<len; i++) {
      if (this.isAlpha(s, i) == false && this.isDigit(s, i) == false)
        return false;
    }
    return true;
  },
  
  //----------------------------------------------------------
  isDigit : function(s, index) {
    var myCharCode = s.charCodeAt(index);
    if((myCharCode > 47) && (myCharCode <  58))
      return true;
    return false;
  },
  
  //----------------------------------------------------------
  isAlpha:function (s, index) {
    var myCharCode = s.charCodeAt(index);
    
    if(((myCharCode > 64) && (myCharCode <  91)) ||
      ((myCharCode > 96) && (myCharCode < 123)))
    return true;
    
    return false;
  },
  
  parseSnippet : function (val) {
    var indentStr = '                             ';
    function makeIndent(n) {
      return indentStr.substring(0, n*2);
    };
    var evString = '';
    var hereDocs = [];
    var files = [];
    var currHereDoc = null;
    
    function checkForHereDoc (s) {
      if (s.indexOf('---') == 0) {
        var haveName = false, name = '';
        
        for (var i=0; i<s.length; i++ ) {
          var c = s[i];
          if (c == '-' || c == ' ') {
            if (name.length)
              break;
          } else {
            name += c;
          } 
        }
        if (name.length>0) {
          currHereDoc = {name: name, lines: []};
          hereDocs.push(currHereDoc);
        } else {
          currHereDoc = null;
        }
        return true;
      }
      return false; 
    };
    
    var a = val.split('\n');
    for (var i=0; i<a.length; i++) {
      var s = a[i];
      if (checkForHereDoc(s)) {
      }
      else if (currHereDoc) {
        currHereDoc.lines.push(s);
      }
      else if (s[0] == '#') {
        files.push(s.substring(1));
      }
      else if (s.length == 0) {
      }
      else {
        a.splice(0, i);
        JsParser.processJs(a.join('\n'));
        for (var i=0; i<JsParser.lines.length; i++) {
          var line = JsParser.lines[i];
          if (line.endComment)
            evString += makeIndent(line.newIndent) + line.string + line.endComment + '\n';
          else
            evString += makeIndent(line.newIndent) + line.string + '\n';
        }
        break;
      }
    }
    return {evString: evString.substring(0, evString.length-1), files: files, hereDocs: hereDocs}
  },
  
  //------------------------------------------
  getFullSnippetString : function (snippet) {
    var outStringArray = [];
    for (var i=0; i<snippet.files.length; i++)
      outStringArray.push("#" + snippet.files[i]);
    if (snippet.hereDocs.length > 0) {
      for (var i=0; i<snippet.hereDocs.length; i++) {
        var hd = snippet.hereDocs[i];
        outStringArray.push("--- " + hd.name);
        for (var j=0; j<hd.lines.length; j++)
          outStringArray.push(hd.lines[j]);
      }
      outStringArray.push('-----');
    }
    outStringArray.push(snippet.evString);
    return outStringArray.join('\n');
  }
};
