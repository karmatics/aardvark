RemoteStorage = {
  // api
 
  // setParams (user, password, url) 
  //
  // Call this first to set url, username, and password.
  // Only needs to be done once per page (or refresh), unless you need to change it.
  // 
  // If user doesn't exist, first time trying to put data will create
  //  that user, this will fail if user exists and password doesn't match.
  //
  // Url is for the php program that handles data storage, if null it uses the default 
  //  (http://www.karmatics.com/phpstuff/remotestore.php)
  //
  // No return value
  //
  setParams: function (user, password, url) {
    if (user)
      this.user = user;
    if (password)
      this.password = password;
    if (url)
      this.url = url;
    },
 
  // putData (data, append, name, callback) {
  //
  // save some data (as much as you need), associated with 
  //  a particular name.  User and password must be set first
  //
  // callback function will be called when complete.  This will
  //  have one parameter, a response object, which has a member
  //  "status" which will be "ok", "bad password" or "can't create file"
  //
  // if "append" is "y", this will append to existing data 
  //  rather than overwriting
  // 
  putData: function (data, append, name, callback) {
    var id = this.getAvailableId();
    var url, baseUrl = this.buildUrl ("put", name, callback, id);
    
    var escapedData = escape(data).replace(/\+/g, '%2B').
      replace(/\%20/g, '+').replace(/\"/g,'%22').
      replace(/\'/g, '%27').
      replace(new RegExp("/", "g"), '%2F');
    
    var request = {callback: callback};
    var len = baseUrl.length;
    if (data.length > (2000-baseUrl.length)) {
      var a = this.chopUpUrlEncodedString (escapedData, (2000-baseUrl.length), (2000-baseUrl.length));
      // Logger.write(data.length + " " + len + " " + a.length);
      url = baseUrl + "&data=" + a[0];
      if (append)
         url += "&append=y";
      request.dataArray = a;
      request.curr = 1;
      request.baseUrl = baseUrl;
      }
    else {
     url = baseUrl +  "&data=" + escapedData;
     }
    this.requestList[id] = request;
    this.sendRequest(url);
    },

  // putData (name, callback)
  //
  // retrieve data by its name.  username and password must be set first
  // 
  // callback function will be called when complete.  This will
  //  have one parameter, a response object, which has a member
  //  "status" which will be "ok", "not found" or "bad password"
  // 
  // If status is "ok", there will be a member "text" which will be
  //  the data
  //
  getData: function (name, callback) {
    var id = this.getAvailableId();
    var url = this.buildUrl ("get", name, callback, id);
    this.requestList[id] = {callback: callback};
    this.sendRequest(url);
    },
    
  // deleteData (name, callback)
  //
  // delete data by its name.  username and password must be set first
  // 
  // callback function will be called when complete.  This will
  //  have one parameter, a response object, which has a member
  //  "status" which will be "ok", "not found" or "bad password"
  // 
  deleteData: function (name, callback) {
    var id = this.getAvailableId();
    var url = this.buildUrl ("delete", name, callback, id);
    this.requestList[id] = {callback: callback};
    this.sendRequest(url);
    },

 // implementation: below here is not for public consumption
 user: null,
 password: null,
 url: "http://localhost/tools/remotestore.php",

 jsonCallback: function (response) {
  var request, id = response.id;
  if ((request = this.requestList[id]) != null) {
    if (request.dataArray && (request.curr < request.dataArray.length)) {
      var url = request.baseUrl + "&data=" + request.dataArray[request.curr] + "&append=y";
      request.curr++;
      this.sendRequest(url);
      return;
      }
    request.callback(response);
    this.requestList[id] = null;
    for (var i=this.requestList.length-1; i>=0; i--) {
      if (this.requestList[i] == null)
        this.requestList.splice(i);
      else
        break;
      }
    }
  },
  
//---------------------------------------------
// break a string into an array of smaller strings.
// Doesn't break url encoding(avoids splitting
// "%23" type things)
chopUpUrlEncodedString : function
(
str, 
maxCharFirst,
maxCharOthers
) {
  var a = [];
  var count = 0;
  var maxChar = maxCharFirst;

  while(str.length > maxChar) {
  	var len = maxChar-1;
  	
  	if(str.charAt(maxChar-2) == '%')
  		len = maxChar-2;
  	if(str.charAt(maxChar-3) == '%')
  		len = maxChar-3;
  	
  	a[count] = str.substring(0, len);
  	str = str.substring(len);
  	count++;
  	maxChar = maxCharOthers;
  	}
  a[count] = str;
  return a;
  },

 requestList: [],

 
 sendRequest: function(url) {
  var se = document.createElement('script');
  se.src = url;
  //Logger.write (url)
  if (document.body)
    document.body.appendChild(se);
  else {
    var a = document.getElementsByTagName("head");
    if(a[0])
      a[0].appendChild(se);
    }
  },
  
 getAvailableId: function () {
   var id = 0;
   while (1) {
    if (this.requestList[id] == null) {
      return id;
      }
    id++;
    }
   },

 buildUrl: function (mode, name, callback, id) {
  return this.url + "?x=" +
    Math.floor(Math.random()*10000) + "&name=" + name + 
    "&user=" + this.user + "&password=" + this.password + 
    "&callback=RemoteStorage.jsonCallback&mode=" + mode + "&id=" + id;
  }
};
