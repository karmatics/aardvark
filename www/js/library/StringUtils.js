StringUtils = {

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
  }
};
