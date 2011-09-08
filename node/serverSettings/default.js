var serverSettings = {
  userId: 501,
  port: 80,
  /*proxy: {
    port: 81,
    address: "localhost",
    print: true,
    extensions: ["php"]
  }, */
  fileServer: {
    path: "../",
    specificFiles: [

    ]
  },
  scriptLists : [
    "Production",
    "Test"
  ]
};
for (var i in serverSettings)
  exports[i] = serverSettings[i];
  