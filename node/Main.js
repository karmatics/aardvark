var _misc = require('./utils/Misc');
var _jsonP = require('./utils/JsonP');
var _http = require("http");
var _nodeStatic = require('node-static');
var _queryString = require('querystring');
var _fileTools = require('./utils/FileTools');

var isRoot = function () {
  return (process.getuid)?(process.getuid()==0):true;
}

var currQ;

var serverSettings = null;

var scripts = {
  jsonGetScripts : {},
  jsonPScripts : {},
  htmlScripts: {}
  };

if (process.argv.length >= 3) {
  // get settings from file
  if (process.argv[2] && process.argv[2].indexOf(".js") != -1) {
    serverSettings = require("./serverSettings/" + process.argv[2]);
  }
}
if (serverSettings == null) {
  // default settings
  serverSettings = {
    port: isRoot() ? 80 : 8000,
    userId: 501,
    fileServer: {
      path: "./html"
    }
  };
}
else if (serverSettings.port < 1024 && !isRoot()) {
  console.error("Binding to ports less than 1024 requires root privileges.")
  process.exit(1);
}

// check to see if we're trying to run as root
// with no privileged user set.
else if (isRoot() && !serverSettings.userId) {
  console.error("Please provide a non-privileged user to bind as.")
  process.exit(1);
}

var sl = serverSettings.scriptLists || [];
for (var i=0; i<sl.length; i++)  {
  var list = require('./scriptLists/' +  sl[i]);  
  for (var j in list.htmlScripts) {
    scripts.htmlScripts[j] = list.htmlScripts[j];
  }
  for (var j in list.jsonPScripts) {
    scripts.jsonPScripts[j] = list.jsonPScripts[j];
  }
  for (var j in list.jsonGetScripts) {
    scripts.jsonGetScripts[j] = list.jsonGetScripts[j];
  }
}

// create server for static files
var fileServer = (serverSettings.fileServer) ? new(_nodeStatic.Server)((serverSettings.fileServer).path) : null;

process.on('uncaughtException',function(error){
    if (currQ) {
      if (error.stack) {
        error.stack = error.stack.split("\n");
        }
      currQ.write (error);
      }
    setTimeout(function (){process.exit(0);}, 100);
    });

var appStartTime = new Date().getTime();

var restartIfSourceFileChanged = function () {
  var validateDir = function (d) {
      return (d.name !== "node_modules");
  }
  var a = [];
  var handlerCb = function (tree) {
    _fileTools.walkFileTree(tree, function (dir, file) {
      if (file && file.name.indexOf('.js') != -1) {
        var t = Date.parse(file.status.mtime);
        if (t > appStartTime) {
          console.log("file changed: " + file.name + " " + t + " " + appStartTime);
          setTimeout(function (){process.exit(0);}, 100);
          }
        };
      });
  };
  _fileTools.getFileTree('.', handlerCb);
  };

setInterval(restartIfSourceFileChanged, 1500);

//------------------------------------------------------------
// once we know we have a post or a get, and have created a "query" 
// object, call this to dispatch to correct "script", static 
// file server, or proxy
var dispatchRequest = function (q) {
  var script;
  
  currQ = q;
  
  console.log('path: [' + q.path + ']');
  if ((script = scripts.htmlScripts[q.path]) != null) {  // "GET"
    q.write = function (text) {
      q.response.writeHead(200, {
          'Content-Type': 'text/html'
        });
      q.response.end(text);
    };
    script(q);
    console.log("html script: " + q.path);
  }
  else if (q.path === 'jsonP') {
    var inputData = _jsonP.process(q);
    if (inputData !== null) {
      if (inputData.scriptName != null && (script = scripts.jsonPScripts[inputData.scriptName]) != null) {
        script(q, inputData);
        }
      else {
        q.write({error: 'script not found'});
        }
      }
    }
  else if ((script = scripts.jsonGetScripts[q.path]) != null) {
    q.write = function (o) {
      q.response.writeHead(200, {
          'Content-Type': 'text/javascript'
        });
      q.response.end(q.params.callback + "(" + JSON.stringify(o) + ")");
    };
    script(q);
    console.log("json script: " + q.path);
  }
  else if (serverSettings.proxy && _misc.proxy(q.path, q.request, q.response, serverSettings.proxy) == true) {	    
    console.log("proxy: " + q.path);
  }
  else if (fileServer) {
    q.request.addListener('end', function () {
        fileServer.serve(q.request, q.response);
        console.log("file server: " + q.path);
      });
  }
  else {
    q.response.writeHead(404, {
        'Content-Type': 'text/html'
      });
    q.response.end("<html><body>404</body></html>");
    console.log("404: " + q.path);

  }
};

//------------------------------------------------------------
var handleServerRequest = function (request, response) {
  var Url = require('url');
  var url = Url.parse(request.url, true);
  var path = url.pathname.substring(1);
  var q = {
    path: path,
    getGlobalData: function () {
      return {
        appStartTime: appStartTime,
        serverSettings: serverSettings,
        currQ: currQ,
        fileServer: fileServer,
        scripts: scripts        
      };    
    },
    getCookies: function () {
      cookies = {};
      q.request.headers.cookie && q.request.headers.cookie.split(';').forEach(function (cookie) {
          var parts = cookie.split('=');
          cookies[parts[0].trim()] = (parts[1] || '').trim();
        });
      return cookies;
    },
    request: request,
    response: response
  };
  if (request.method === "POST") {
    var content = '';
    request.addListener('data', function (chunk) {
        content += chunk;
      });
    request.addListener('end', function () {
        q.params = _queryString.parse(content);
        dispatchRequest(q)
      });
  }
  else {
    q.params = url.query;
    dispatchRequest(q);
  }
};


_http.createServer(handleServerRequest).listen(serverSettings.port);
if (process.setuid)
  process.setuid(serverSettings.userId);
console.log('Server running: ' + JSON.stringify(serverSettings));

