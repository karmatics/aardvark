{"js":"function getTextAndUrl(elem) {\n  var out = {text:elem.textContent || elem.innerText};\n  var urls = [];\n  \n  var a;\n  \n  if (elem.tagName == 'IMG') {\n    if (elem.src)\n      urls.push(elem.src);\n  }\n  else {\n    a = elem.getElementsByTagName('img');\n    for (var i=0; i<a.length; i++)\n      if(a[i].src)\n    urls.push(a[i].src);\n  }\n  if (elem.tagName == 'A') {\n    if (elem.href)\n      urls.push(elem.href);\n  }\n  else {\n    a = elem.getElementsByTagName('a');\n    for (var i=0; i<a.length; i++)\n      if (a[i].href)\n    urls.push(a[i].href);\n  }\n  if(urls.length > 0){\n    if(urls.length == 1)\n      out.url = urls[0];\n    else\n      out.urls = urls; \n  }\n  return out;\n}\n\nvar color = Math.round(Math.random()*255)+','+\nMath.round(Math.random()*255)+','+\nMath.round(Math.random()*255);\n\nSimplePath.getElementsByPath(\n  aardvark.pathFromEditor(),\n  null, \n  function (elem, i) {\n    elem.style.border = '2px dashed rgb('+color+')';\n    elem.style.background = 'rgba('+color+',.2)'\n    log(getTextAndUrl(elem));\n  }\n);\n\n\n\n\n\n","name":"get elems by path","num":21}