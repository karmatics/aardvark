var DomGenerator = 
{
  appendChildrenToElement: function(element, array) {
    for (var item=0; item < array.length; item++)
      element.appendChild (array[item]);
  },
  
  loadFunctions:  function ()  {
    var elemTypes = ['A', 'B', 'BIG', 'BLOCKQUOTE', 'BR', 'BUTTON', 'CAPTION', 'CANVAS', 'CENTER', 'CODE', 'DD', 'DIV', 'EM', 'EMBED', 'FIELDSET', 'FONT', 'FORM', 'HEAD', 'HR', 'I', 'IFRAME', 'IMG', 'INPUT', 'LABEL', 'LEGEND', 'LI', 'LINK', 'MAP', 'NOBR', 'OBJECT', 'OL', 'OPTION', 'P', 'PARAM', 'PRE', 'RT', 'RUBY', 'S', 'SELECT', 'SMALL', 'SPAN', 'STRIKE', 'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TEXTAREA', 'TFOOT', 'TH', 'THEAD', 'TR', 'UL', 'WBR', 'H1', 'H2', 'H3'];
    var dg = this;
    
    for (var x=0; x<elemTypes.length; x++) {
      (function () {
          var elemType = elemTypes[x];
          dg[elemType] = function() {
            var i, j, h, s, p, c, n = arguments.length,
            elem = document.createElement(elemType);
            for (i=0; i < n; i++) {
              c = arguments[i];
              if (c.tagName)
                elem.appendChild(c);
              else if (typeof(c) == "string")
                elem.appendChild(document.createTextNode(c));
              else if (c.html) {
                var d = document.createElement (elemType);
                d.innerHTML = c.html;
                var a = [], len = d.childNodes.length;
                for (j=len-1; j >= 0; j--)
                  a[j] = d.removeChild(d.childNodes[j]);
                for (j=0; j < len; j++)
                  elem.appendChild(a[j]);
              }
              else {
                if ((s = c.style) !== undefined)
                  for (h in s)
                elem.style[h] = s[h];
                for (h in c) {
                  p = c[h];
                  if (p != s)
                    elem[h] = p;
                }
              }
            }
            return elem;
          }
        })();
    }
  }
};

// init ----------------------
DomGenerator.loadFunctions();
