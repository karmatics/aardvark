var _jsonAccumulator = {};

module.exports = {
  
  process : function (q) {
//    console.log("process " );
    q.response.writeHead(200, {
          'Content-Type': 'text/javascript'
        });
    if (q.params.data && q.params.id) {
      var item, id = parseInt(q.params.id);
      if(_jsonAccumulator[id] === undefined)
        _jsonAccumulator[id] = {
          expected: parseInt(q.params.nc),
          count: 0,
          data: []
          };
      item = _jsonAccumulator[id];
      item.count++;
//      console.log("count: " + item.count);
      item.data[parseInt(q.params.chunk)] = q.params.data;
      if (item.count == item.expected) {
        var data = JSON.parse(decodeURIComponent(item.data.join('')));
        if (data.test)
          console.log ('test is : ' + data.test);
        q.response.end("JsonPClient.serverCallback(" + JSON.stringify(data) + ")");
        delete(_jsonAccumulator[id]);
        return;
      }
      else {
        q.response.end("");
        return;
      }
    }
  q.response.end("'....'");
  }
};
