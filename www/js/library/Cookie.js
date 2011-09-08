var Cookie = {

//--------------------------------------------------------------
getCookie: function(name) {
  if(name.length > 0 && document.cookie.length > 0) {
    var begin = document.cookie.indexOf(name+"="); 
    if(begin != -1) {
      begin += name.length+1; 
      var end = document.cookie.indexOf(";", begin);
      if(end == -1)
        end = document.cookie.length;
      return unescape(document.cookie.substring(begin, end));
      }
    }
  return null;
  },

//--------------------------------------------------------------
setCookie : function(cookieName, cookieValue, path, nDays) {
  var today = new Date();
  var expire = new Date();
  expire.setTime(today.getTime() + 3600000*24*nDays);
  document.cookie = cookieName + "=" + escape(cookieValue) +
    ((path) ? "; path=" + path : "") +			
    ";expires=" + expire.toGMTString();
  },

//--------------------------------------------------------------
deleteCookie : function(name, path) {
  this.setCookie(name, "", path, -1);
  }
};
