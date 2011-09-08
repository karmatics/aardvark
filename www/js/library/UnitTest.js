//todo: make a proper class with instances
UnitTest  = {
  inputForm: null,
  
  populateForm: function (name, elem) {
    var self = this;
    
    ServerComm.fetchJsonData(
      "loyalty/php/unitTest.php",
      {
       testname: name
      },
      {},
      function (output) {
        self.inputForm = new GenericInputForm (output);
        with (DomGenerator) {
          appendChildrenToElement (
            elem, [
            self.inputForm.element,
            INPUT ({
              type: 'button',
              value: "test",
              className: 'button',
              style: {cssFloat: 'right', styleFloat: 'right'},
              onclick: function() {
                self.runTest(name, self.inputForm.getValues());
                }
              }),
             BR ({style: {clear: "both"}})
             ]);
          }
        }
      );
    },
    
  runTest: function(name, input) {
    ServerComm.fetchJsonData(
      "loyalty/php/unitTest.php",
      {
       input: input,
       testname: name
      },
      {},
      function (output) {
        if (output.html) {
          var h = output.html;
          for (var i in h) {
            var e;
            if ((e = document.getElementById(i)) != null) {
              e.innerHTML = h[i];
              }
            }
          }
        else {
          Logger.write(output)
          }
        }
      );
    },
  makePopupTest : function(name) {
    var p = new PopupWindow("ui test: " + name, "uitest");
    this.populateForm(name, p.contentElem);
    p.show();
    }
    
 };
 
