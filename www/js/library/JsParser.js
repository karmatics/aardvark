
/**
 * @fileoverview
 * Provides a heuristic to guess whether a forward slash ('/') that does not
 * start a comment starts a regular expression or a division operator.
 *
 * @author Mike Samuel <mikesamuel@gmail.com>
 */

var REGEXP_PRECEDER_TOKEN_RE = new RegExp(
  "^(?:"  // Match the whole tokens below
    + "break"
    + "|case"
    + "|continue"
    + "|delete"
    + "|do"
    + "|else"
    + "|finally"
    + "|in"
    + "|instanceof"
    + "|return"
    + "|throw"
    + "|try"
    + "|typeof"
    + "|void"
    // Binary operators which cannot be followed by a division operator.
    + "|[+]"  // Match + but not ++.  += is handled below.
    + "|-"    // Match - but not --.  -= is handled below.
    + "|[.]"    // Match . but not a number with a trailing decimal.
    + "|[/]"  // Match /, but not a regexp.  /= is handled below.
    + "|,"    // Second binary operand cannot start a division.
    + "|[*]"  // Ditto binary operand.
  + ")$"
  // Or match a token that ends with one of the characters below to match
  // a variety of punctuation tokens.
  // Some of the single char tokens could go above, but putting them below
  // allows closure-compiler's regex optimizer to do a better job.
  // The right column explains why the terminal character to the left can only
  // precede a regexp.
  + "|["
    + "!"  // !           prefix operator operand cannot start with a division
    + "%"  // %           second binary operand cannot start with a division
    + "&"  // &, &&       ditto binary operand
    + "("  // (           expression cannot start with a division
    + ":"  // :           property value, labelled statement, and operand of ?:
           //             cannot start with a division
    + ";"  // ;           statement & for condition cannot start with division
    + "<"  // <, <<, <<   ditto binary operand
    // !=, !==, %=, &&=, &=, *=, +=, -=, /=, <<=, <=, =, ==, ===, >=, >>=, >>>=,
    // ^=, |=, ||=
    // All are binary operands (assignment ops or comparisons) whose right
    // operand cannot start with a division operator
    + "="
    + ">"  // >, >>, >>>  ditto binary operand
    + "?"  // ?           expression in ?: cannot start with a division operator
    + "["  // [           first array value & key expression cannot start with
           //             a division
    + "^"  // ^           ditto binary operand
    + "{"  // {           statement in block and object property key cannot start
           //             with a division
    + "|"  // |, ||       ditto binary operand
    + "}"  // }           PROBLEMATIC: could be an object literal divided or
           //             a block.  More likely to be start of a statement after
           //             a block which cannot start with a /.
    + "~"  // ~           ditto binary operand
  + "]$"
  // The exclusion of ++ and -- from the above is also problematic.
  // Both are prefix and postfix operators.
  // Given that there is rarely a good reason to increment a regular expression
  // and good reason to have a post-increment operator as the left operand of
  // a division (x++ / y) this pattern treats ++ and -- as division preceders.
  );


/**
 * True iff a slash after the given run of non-whitespace tokens
 * starts a regular expression instead of a div operator : (/ or /=).
 * <p>
 * This fails on some valid but nonsensical JavaScript programs like
 * {@code x = ++/foo/i} which is quite different than
 * {@code x++/foo/i}, but is not known to fail on any known useful
 * programs.  It is based on the draft
 * <a href="http://www.mozilla.org/js/language/js20-2000-07/rationale/syntax.html">JavaScript 2.0
 * lexical grammar</a> and requires one token of lookbehind.
 *
 * @param {string} preceder The non-whitespace, non comment token preceding
 *    the slash.
 */
function guessNextIsRegexp(preceder) {
  return REGEXP_PRECEDER_TOKEN_RE.test(preceder);
}

var JsParser = {
  
  //----------------------------------------------------------
  // given a long string and an array of short strings,
  // find the first occurance of one of the short ones in
  // the long one.  Return the stringNo (index into the array)
  // and character index in an object
  findFirstFromSetOfStrings : function (searchStrings,
    string, startIndex, endIndex) {
    var nSS = searchStrings.length;
    var min = Infinity, best = -1;
    
    for (var i=0; i<nSS; i++) {
      var ind = string.indexOf(searchStrings[i], startIndex);
      if (ind != -1 && ind < min && ind < endIndex) {
        min = ind;
        best = i;
      }
    }
    return (best == -1) ?
      null : {stringNo: best, index: min};
  },
  
  //----------------------------------------------------------
  // returns object with array of quoted sections (with the type --
  // single or double -- the start and end character index in the 
  // string, the endComment string, and the string itself minus the 
  // comment string)
  findQuotesAndComments : function (string) {
      function stripWhitespace (string) {
        var len = string.length;
        var i = 0;
        for (i=0; i<len; i++) {
          var ch = string.charAt(i);
          if (ch != ' ' && ch != '\t')
          break;
        }
        return string.substring(i);
      };
    string = stripWhitespace(string);
    var startPoint = 0, endPoint = string.length;
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
          var out = {
            endComment: string.substring (r.index),
            string: string.substring(0, r.index),
            quotes: quotes
          };
          return out;
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
  // neither comments nor quotes (so things like braces and parens are
  // actually braces and parens, not just something in a comment or quote)
  processCodeSpanForDelims : function (codeSpan, string, delimTracker) {
    var startPoint = codeSpan.start, end = codeSpan.end, r;
    
    if(this.debug)
      Logger.write(codeSpan.spanNo + ": " + "\"" + 
          string.substring(codeSpan.start, codeSpan.end) + "\"");

    while ((r = this.findFirstFromSetOfStrings (delimTracker.delims,
          string, startPoint, end)) != null) {
      if (r.stringNo%2==0) {
        if(this.debug)
          Logger.write(delimTracker.delims[r.stringNo] + " (even)");
        var currDelim = {
          type: r.stringNo,
          startIndex: r.index,
          startLineNo: codeSpan.lineNo,
          children: [],
          parent: (delimTracker.stackLen>0) ?
          delimTracker.stack[delimTracker.stackLen-1] :
          delimTracker
        };
        currDelim.parent.children.push (currDelim);
        delimTracker.stack[delimTracker.stackLen] = currDelim;
        delimTracker.stackLen++;
      }
      else {
        if (this.debug)
          Logger.write(delimTracker.delims[r.stringNo] + " (odd)");
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
    if(this.debug) {
      Logger.write("--------- " + lineNo + " ----------");
    }
    var codeSpan;
    var indent = delimTracker.stackLen;
    var lineData = this.findQuotesAndComments (inString);
    if(this.debug) {
      for (var i=0; i<lineData.quotes.length; i++) {
        var item = lineData.quotes[i];
        Logger.write(item.type + ": [" + lineData.string.substring(item.start, item.end) + "]");
      }
    }

    lineData.indent = indent;
    var q = lineData.quotes, index = 0, codeSpans = [];
    for (var j=0; j<q.length; j++) {
      codeSpan = {lineNo: lineNo, spanNo: j,
        start: index, end: q[j].start, which: 1};
      this.processCodeSpanForDelims (codeSpan, lineData.string, delimTracker);
      codeSpans.push (codeSpan);
      index = q[j].end;
    }
    codeSpan = {lineNo: lineNo, spanNo: q.length,
      start: index, end: lineData.string.length, which: 2};
    this.processCodeSpanForDelims (codeSpan, lineData.string, delimTracker);
    codeSpans.push (codeSpan);
    lineData.codeSpans = codeSpans;
    return lineData;
  },
  
  //----------------------------------------------------------
  processJs : function (lines, debug) {
    if (debug)
      this.debug = true;
    JsParser.lines = [];
    JsParser.delimTracker = {
      stack: [],
      stackLen: 0,
      errors: [],
      children: [], // root delimeter objects
      delims: ["{", "}", "[", "]", "(", ")"],
      count:  [0, 0, 0, 0, 0, 0]};	
    for (var i=0; i<lines.length; i++) {
      var lineData = JsParser.processLine (lines[i],
        JsParser.delimTracker, i);
      JsParser.lines.push (lineData);
    }
    delete JsParser.delimTracker.stack;
    delete JsParser.delimTracker.stackLen;
    for (var i=0; i<this.lines.length; i++) {
      var str = this.lines[i].string;
      if (str.length > 0) {
        var first = str[0];
        if (first==')' || first==']' ||  first=='}') {
          this.lines[i].indent--;
        }
        else if (i>0) {
          var prevString = this.lines[i-1].string;
          var keys = ['if', 'for', 'else', 'while'];
          var alnum = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_";
          var found = false;
          for (var j=0; j<keys.length; j++) {
            if (prevString.indexOf(keys[j]) == 0 && 
              alnum.indexOf(prevString[keys[j].length]) == -1 && 
              this.lines[i-1].indent == this.lines[i].indent
            )
            this.lines[i].indent++;
            found = true;
          }
        }
      }
    }
    this.debug = false;
  },
  
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
  
  //----------------------------------------------------------
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
        if (name.length > 0) {
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
        JsParser.processJs(a);
        for (var i=0; i<JsParser.lines.length; i++) {
          var line = JsParser.lines[i];
          if (line.endComment)
            evString += makeIndent(line.indent) + line.string + line.endComment + '\n';
          else
            evString += makeIndent(line.indent) + line.string + '\n';
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
  },
  
  //------------------------------------------
  getLineOffsets : function (snippet, lineNo) {
    var count = 0;
    for (var i=0; i<snippet.files.length; i++)
      count += 1 + snippet.files[i].length;
    if (snippet.hereDocs.length > 0) {
      for (var i=0; i<snippet.hereDocs.length; i++) {
        var hd = snippet.hereDocs[i];
        count += 5 + hd.name.length;
        for (var j=0; j<hd.lines.length; j++)
          count += hd.lines[j].length + 1;
      }
      count += 6;
    }
    outStringArray.push(snippet.evString);
    return outStringArray.join('\n');
  }
};
