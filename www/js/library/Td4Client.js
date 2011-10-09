Td4Client = {

showObjectAsJson : function (o){
  setTimeout(function() {
    if (typeof(o) == 'string')
      o = [o];
    var s = JSON.stringify (o);
    s = PrettyCode.formatJson(s)
    PrettyCode.insertCode (s, null, Td4Client.codeDiv);
  }, 20);
},
  
makeUi : function (serverPath, formDescription, serverSideFunction) {  
  this.inputForm = new GenericInputForm(formDescription);
  
  with(DomGenerator) {
    var d = DIV ({className:"td4Container"},
      DIV (this.inputForm.element),
      DIV ({className:"lineno"},
        "echo only: ",
        this.echoOnlyCb = INPUT ({type:"checkbox"})
      ),
      INPUT({type: "submit", className: "button", onclick: function () {
        var inputData = Td4Client.inputForm.getValues();
        if (Td4Client.echoOnlyCb.checked) {
          Td4Client.showObjectAsJson(inputData);
        }
        else {
          inputData.functionToRun = serverSideFunction.toString();
          inputData.handlerName = 'td4';
          JsonPClient.send(
             serverPath + "jsonP",
              inputData,
              Td4Client.showObjectAsJson
              );
        }
        }}),
      BR (),
      this.codeDiv = DIV ()
    );
  }
return d;
}

};