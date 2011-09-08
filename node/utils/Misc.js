var _fs = require('fs');
var _http = require("http");

module.exports = {

  proxy: function (path, request, response, settings) {
    if (settings.extensions) {
      var i, found = false,
          ext, a = settings.extensions,
          l = a.length;
      if ((i = path.lastIndexOf('.')) == -1) return false;
      ext = path.substring(i + 1);
      for (var j = 0; j < l; j++) {
        if (ext == a[j]) {
          found = true;
          break;
        }
      }
      if (!found) return false;
      if (settings.print) console.log(path);
    }
    var proxy = _http.createClient(settings.port, settings.address);
    var proxy_request = proxy.request(request.method, request.url, request.headers);
    proxy_request.on('response', function (proxy_response) {
      proxy_response.on('data', function (chunk) {
        response.write(chunk, 'binary');
      });
      proxy_response.on('end', function () {
        response.end();
      });
      response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });
    request.on('data', function (chunk) {
      proxy_request.write(chunk, 'binary');
    });
    request.on('end', function () {
      proxy_request.end();
    });
    return true;
  }
};
