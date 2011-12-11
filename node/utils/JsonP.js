var _jsonAccumulator = {};

module.exports = {
  processRequest : function (q) {
    if (q.params.d && q.params.i) {
      var item, id = parseInt(q.params.i);
      if(_jsonAccumulator[id] === undefined) {
        _jsonAccumulator[id] = {
          expected: parseInt(q.params.n),
          count: 0,
          data: [],
          timestamp: new Date()
          };
        }
      item = _jsonAccumulator[id];
      item.count++;
      item.data[parseInt(q.params.c)] = q.params.d;
      if (item.count == item.expected) {
        var dataString = item.data.join('');
        data = JSON.parse(dataString);
        if(data == null) {
          dataString = dataString.replace(
            /(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
          data = JSON.parse(dataString);
          }
        q.write = function (o) {
          q.response.writeHead(200, {'Content-Type': 'text/javascript'});
          q.response.end("JsonPClient.serverCallback(" + id + "," + JSON.stringify(o) + ");");
          delete(_jsonAccumulator[id]);
          };
        return data;
      }
      else {
        q.response.writeHead(200, {'Content-Type': 'text/javascript'});
        // empty javascript response (since this is not the final
        // request of a multipart request
        q.response.end("");
        return null;
      }
    }
  // something wrong happened
  q.response.writeHead(200, {'Content-Type': 'text/javascript'});
  q.response.end("JsonPClient.serverCallback(" + id + ", null);");
  return null
  },
  
  clearExpired : function () {
    // todo
  }
};
