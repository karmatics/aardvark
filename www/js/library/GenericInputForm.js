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
      if (format == 'string' || format == 'bigstring')
        row = this.buildStringInput (i, description[i], (format == 'bigstring'));
      else if (format == 'bool')
        row = this.buildBooleanInput (i, description[i]);
      if (row) {
        tbody.appendChild(row.elem);
        description[i].row = row;
        };
      }

    this.element = table;
    },

  prototype : {

    //--------------------------------------------------
    buildStringInput : function (name, definition, isBig) {
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
          if (typeof(n) != "string")
            n = GenericInputForm.formatJson(JSON.stringify(n));            
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
    buildBooleanInput : function (name, definition) {
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
      var out = {};
      for (var i in this.description) {
        var item = this.description[i];
        if (item.row) {
          var v = item.row.input.value;
          if (v == '')
            v = null;
          if (v != null) {
            if (item.json)
              out[i] = eval( '(' + v + ')' );  
            else 
              out[i] = v;
            }
          }
        else {
          // out[i] = {}; // todo: send default value?
          }
        }
      if (format=='urlencode')
        return encodeURIComponent(JSON.stringify(out));
      else if (format=='json')
        return (JSON.stringify(out));
      else 
        return out;
      }
    },

  // formatJson() :: formats and indents JSON string
  // todo: move somewhere else for general use
  // from http://ketanjetty.com/coldfusion/javascript/format-json/
  formatJson : function (val) {
    var inQuotes = false;
  
    var retval = '';
    var str = val;
    var pos = 0;
    var strLen = str.length;
    var indentStr = ' ';
    var newLine = '\n';
    var char = '';
    
    for (var i=0; i<strLen; i++) {
      char = str.substring(i,i+1);

      if (char == '"') {
        inQuotes = !inQuotes;
        }      
      
      if (!inQuotes && (char == '}' || char == ']')) {
        retval = retval + newLine;
        pos = pos - 1;
        
        for (var j=0; j<pos; j++) {
          retval = retval + indentStr;
        }
      }
      
      retval = retval + char;	
      
      if (!inQuotes && (char == '{' || char == '[' || char == ',')) {
        retval = retval + newLine;
        
        if (char == '{' || char == '[') {
          pos = pos + 1;
        }
        
        for (var k=0; k<pos; k++) {
          retval = retval + indentStr;
        }
      }
    }
    return retval;
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
 