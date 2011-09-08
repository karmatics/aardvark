var _jsonAccumulator = {};

module.exports = {
  process : function (q) {
    if (q.params.data && q.params.id) {
      var item, id = parseInt(q.params.id);
      if(_jsonAccumulator[id] === undefined) {
        _jsonAccumulator[id] = {
          expected: parseInt(q.params.nc),
          count: 0,
          data: []
          };
        }
      item = _jsonAccumulator[id];
      item.count++;
      item.data[parseInt(q.params.chunk)] = q.params.data;
      if (item.count == item.expected) {
        var data = item.data.join('');
        data = JSON.parse(data);
        
        q.write = function (o) {
          q.response.writeHead(200, {'Content-Type': 'text/javascript'});
          q.response.end("JsonPClient.serverCallback(" + id + "," + JSON.stringify(o) + ");");
          delete(_jsonAccumulator[id]);
          };
        return data;
      }
      else {
        q.response.writeHead(200, {'Content-Type': 'text/javascript'});
        q.response.end("");
        return null;
      }
    }
  q.response.writeHead(200, {'Content-Type': 'text/javascript'});
  q.response.end("JsonPClient.serverCallback(" + id + ", null);");
  return null
  }
};
