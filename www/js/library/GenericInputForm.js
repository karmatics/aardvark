var GenericInputForm = {  
  // pass in description (data structure) and it creates 
  // object with member "element" that can be added to document
  constructor: function (description) {
    this.description = description;
    var tbody, table;
      with (DomGenerator) {
        table = TABLE ({className:"inputItems"},
          tbody = TBODY (
            )
          );
        }
    
    for (var i in description) {
      var format = description[i].format;
      var row = null, isBig;
      if (format === 'textinput')
        row = this.buildTextInput (i, description[i], (description[i].multiline != null));
      else if (format === 'checkbox')
        row = this.buildCheckbox (i, description[i]);
      if (row) {
        tbody.appendChild(row.elem);
        description[i].row = row;
        };
      }

    this.element = table;
    },

  prototype : {

    //--------------------------------------------------
    buildTextInput : function (name, definition, isBig) {
      var out = {}, selectElem, thirdTd;
      with (DomGenerator) {
          out.elem = TR (
              TD ({className:"label"},
                name + ": "
              ),
              TD (
                out.input = (isBig) ?
                    TEXTAREA ({className:"text"}) :
                    INPUT ({className:"text", type:"text"})
              ),
              thirdTd = TD ()
           );
      if (definition.samples) {
        selectElem = SELECT ({className:"sel"},
                  OPTION ());
        var samples = definition.samples;
        for (var i = 0; i<samples.length; i++) {
          var n = samples[i];
          if (typeof(n) === "number") {
            }
          if (typeof(n) !== "string") {
            n = PrettyCode.formatJson(JSON.stringify(n));
            }
          selectElem.appendChild (OPTION ({value:n},
                   ((n.length > 50)? n.substring(0, 40) + '...' : n)));
          thirdTd.appendChild(selectElem);
          selectElem.onchange = function () {
            out.input.value = selectElem.value;  
            }       
          }
         }
       else {
          thirdTd.innerHTML = ' ';
        }
       }
      return out;
      },
  
    //--------------------------------------------------
    buildCheckbox : function (name, definition) {
      var out = {}, selectElem, thirdTd;
      with (DomGenerator) {
          out.elem = TR (
              TD ({className:"label"},
                name + ": "
              ),
              TD (
                out.input = INPUT ({className:"text", type:"checkbox"})
              ),
              thirdTd = TD (' ')
              );
      
        }
      return out;
      },    

    // return the values the user has entered (empty ones will be null)
    getValues : function (format) {
      try {
        var out = {}, value;
        for (var i in this.description) {
          var item = this.description[i];

          if (item.row) {
            var v = item.row.input.value;
            if (v == '')
              v = null;
            if (item.format === 'checkbox') {
               out[i] = (v === 'on')?true:false;
            }
            else if (v == null) {
              out[i] = (item.defaultValue !== undefined) ? item.defaultValue : null;
            }
            else {
              if (item.evaluate) {
                eval( 'out[i] = (' + v + ')' ); 
              }
              else if (item.type === 'int') {
                out[i] = parseInt(v);
              }
              else if (item.type === 'float') {
                out[i] = parseFloat(v);
              }
              else {
                out[i] = v;
              }
            }
          
          }
          else {
            out[i] = null; // todo: send default value?
          }
        }
      return out;
      }
    catch (e) {
      alert ("error: " + JSON.stringify(e));
      return null;
      } 
    }
   }

  
  };
  
// init ------------------------
(function (name) {
  var module = window[name];
  var constructor = window[name] = module.constructor;
  for (var j in module)
    constructor[j] = module[j];
  constructor.classObject = module;
  })("GenericInputForm");
 