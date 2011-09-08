var serverSettings = {
  userId: 501,
  port: 80,
  fileServer: {
    path: "../www/",
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
 