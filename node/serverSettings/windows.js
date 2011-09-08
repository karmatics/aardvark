var serverSettings = {
  userId: 501,
  port: 8001,
  proxy: {
    port: 80,
    address: "localhost",
    print: true
  }
};
for (var i in serverSettings)
  exports[i] = serverSettings[i];
 