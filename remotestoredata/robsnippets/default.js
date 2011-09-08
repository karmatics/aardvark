 [
 {
 "js" : "RemoteStorage.setParams (\"eve\", \"passwordforeve\");",
 "mode" : 0,
 "name" : "set params"
 },
 {
 "js" : "RemoteStorage.putData(elem1.innerHTML, true, \"somehtml\",\n function (response) {\n  log(response.status);\n  });",
 "mode" : 0,
 "name" : "put data"
 },
 {
 "js" : "RemoteStorage.getData(\"somehtml\",\n function (response) {\n  if(response.status == \"ok\")\n    elem1.innerHTML = response.text;\n  });\n",
 "mode" : 0,
 "name" : "get data"
 },
 {
 "js" : "var a = document.getElementsByTagName (\"button\");\nfor (var i=0; i<a.length; i++) {\n if (a[i].innerHTML.indexOf(\"Show all comments\") != -1)\n  a[i].click();\n }",
 "mode" : 0,
 "name" : "show all in disqus"
 },
 {
 "js" : "comments = [];\n\nvar commentsBlock = document.getElementById(\"dsq-comments\");\nvar tag = \"dsq-comment-\";\nvar tagLen = tag.length;\nvar depthTag = \"dsq-depth-\";\nvar depthTagLen = depthTag.length;\nvar a=commentsBlock.getElementsByTagName(\"li\");\nfor (var i=0; i<a.length; i++) {\n var c = a[i];\n if (c.id != null &&  c.id.indexOf(tag) == 0) {\n  var idInt = parseInt(c.id.substring(tagLen));\n  if (isNaN(idInt)) {\n    log (\"weird\");\n    }\n  else {\n    var index;\n    if (c.className != null && (index = c.className.indexOf(depthTaor (var j=0; j<tmp.length; j++){\n    var d = doc.createElement(\"DIV\");\n    d.appendChild(tmp[j]);\n    tmp[j] = d.innerHTML;\n    }\n  elems.push(tmp);\n  }\nLogger.write(elems);\n\n /*\n  e.style.backgroundColor = \"#\" + \n    Math.floor(Math.random()*16).toString(16) + \n    Math.floor(Math.random()*16).toString(16) + \n    Math.floor(Math.random()*16).toString(16);\n */\n",
 "mode" : 0,
 "name" : "readElems"
 },
 {
 "js" : "TemplateManager.openEditWin(\n \"../design/merged/loyalty.html\");\n",
 "mode" : 0,
 "name" : "open edit win"
 },
 {
 "js" : "var out = {};\n\nvar elems = document.getElementsByTagName('*');\nfor (var i = 0; i<elems.length; i++) {\n var elem = elems[i];\n var style = window.getComputedStyle(elem, null);\n var value = style.getPropertyValue(\"background-image\");\n if (value && value != \"\" && value != \"none\") {\n  if (value.indexOf(\"url(\") == 0) {\n    value = value.substring(4, value.length-1);\n    out[value] = true;\n    }\n  }\n }\n var htmlString = \"\";\nfor (var i in out)\n    htmlString += \"<img style='border:1px solid black; background-color: #f00' src='\" + i + \"' / > \" + i + \"<br>\";\n\nvar out = {};\n\nvar elems = document.getElementsByTagName('img');\nfor (var i = 0; i<elems.length; i++) {\n vg)) != -1)\n     depth = parseInt(c.className.substtcher.setActive(\"large\")",
 "mode" : 0,
 "name" : "ssset"
 },
 {
 "js" : "\ng_list = {};\n\n\nvar saveIt = function (str, ind, which, tagLen) {\n var name = str.substring(1, ind);\n var i = str.lastIndexOf(\"\\\"\");\n var val =str.substring(ind+tagLen, i);\n if (g_list[name] == null) {\n  g_list[name] = {};\n  }\n g_list[name][which] = val; \n};\n\n\nvar e = document.getElementById(\"ta1\");\nvar sa = e.value.split(\"\\n\");\nvar tags = [\"_en=\\\"\", \"_es=\\\"\", \"_fr=\\\"\"];\nfor(var k=0;k<sa.length;k++){\n var s = sa[k];\n if (s.charAt(0) == \"$\") {\n   for (var j=0; j<tags.length; j++) {\n    var index = s.indexOf(tags[j]);\n    if (index != -1) {\n      saveIt (s, index, j, tags[j].length);\n      break;\n      }\n    }\n }\n}\n\nalpha = \"abcdefghijklmnopqrstuvwxyz\";\nnum = \"0123456789_\";\n\n//var s = \"\";\nfor (var i in g_list) {\n var o = g_list[i];\n //s += \"{\" + o[0] + \"}\\n\";\n var t = (o[0]).toLowerCase().replace(/ /g, \"_\");\n var t2 = '', c;\n for (var j=0; j<t.length; j++) {\n  c = t.cring(index + depthTagLen));\n    else\n     depth = 0;\n    \n    comments.push ({elem: a[i], iar elem = elems[i];\n var value = elem.src;\n if (value && value != \"\" && value != \"none\") {\n  out[value] = true;\n  }\n }\nvar htmlString2 = \"\";\nfor (var i in out)\n    htmlString2 += \"<img style='border:1px solid black; background-color: #f00' src='\" + i + \"' / > \" + i + \"<br>\";\n\nvar d = document.createElement(\"div\");\n//d.style.position = \"absolute\";\n//d.style.top=\"5px\";\n//d.style.left=\"5px\";\n\nvar inner = document.createElement(\"div\");\ninner.style.border = \"1px solid black\";\ninner.style.padding = \"10px\";\ninner.style.backgroundColor = \"#ccc\";\ninner.innerHTML = \"<b>background images</b><br>\" + htmlString;\n\nd.appendChild (inner);\n\nvar inner = document.createElement(\"div\");\ninner.style.border = \"1px solid black\";\ninner.style.padding = \"10px\";\ninner.style.backgroundColor = \"#ccc\";\ninner.innerHTML = \"<b>images</b><br>\" + htmlString2;\n\nd.appendChild (inner);\n\ndocument.body.appendChild (d);\n",
 "mode" : 0,
 "name" : "writebgimages"
 },
 {
 "js" : "var delay = 2000;\nsetTimeout (function () {\nvar panel = document.getElementById(\"mainpanel\");\nvar c = document.getElementById(\"map_canvas\");\nif (c !=null)\n  c.innerHTML = \"\";\nvar a = panel.getElementsByTagName(\"object\");\nford: idInt, depth: depth});\n    }\n  }\n }\n",
 "mode" : 0,
 "name" : "scrape disqus comments"
 },
 {
 "js" : "var paginateElem = document.getElementById(\"dsq-pagination\");\nif (paginateElem)\n DISQUS.dtpl.actions.fire('thread.paginate', 2, paginateElem, 1000);",
 "mode" : 0,
 "name" : "show all disqus"
 },
 {
 "js" : "for (var i=0; i<comments.length; i++) {\n var c = comments[i];\n \n var d = DIV({style:{position: \"absolute\", color: \"#fc8\", fontWeight: \"bold\", backgroundColor: \"rgba(0,0,0,.8)\", \n   WebkitBorderRadius: \"4px\", padding: \"3px\", zIndex: \"100000\"}}, c.id +\n     \" depth: \" + c.depth);\n var header = document.getElementById(\"dsq-comment-header-\" + c.id);\n if (header)\n    header.insertBefore(d, header.firstChild);\n  }",
 "mode" : 0,
 "name" : "tag disqus comments"
 },
 {
 "js" : "var a =document.getElementsByTagName(\"iframe\");\nfor (var i=a.length-1; i>=0; i--)\n  a[i].parentNode.removeChild(a[i]);\na = document.getElementsByTagName(\"object\");\nfor (var i=a.length-1; i>=0; i--)\n  a[i].parentNode.removeChild(a[i]);",
 "mode" : 0,
 "name" : "kill flash"
 },
 {
 "js" : "var out = '';\nvar sa = document.getElementById (\"ta3\").value.split(\"\\n\");\nvar out = '';\nfor (var k=0; k<sa.tcher.setActive (var i=0; i<a.length; i++)\n a[i].parentNode.removeChild(a[i]);\nvar a = panel.getElementsByTagName(\"script\");\nfor (var i=0; i<a.length; i++)\n a[i].parentNode.removeChild(a[i]);\nvar a = panel.getElementsByTagName(\"img\");\nfor (var i=0; i<a.length; i++) {\n var e = a[i];\n var src = a[i].src;\n var index;\n if ((index = src.lastIndexOf(\"/\")) != -1)\n   a[i].src = \"resources\" + src.substring(index);\n }\nvar out = Logger.makeIoBox();\nout.value = panel.innerHTML;\n}, delay);\n",
 "mode" : 0,
 "name" : "get mainpanel"
 },
 {
 "js" : "var which = 1;\nvar mp = document.getElementById(\"mainpanel\");\nvar c = document.getElementById(\"map_canvas\");\nif (c)\n c.innerHMTL = '';\nvar h = document.getElementById(\"hiddenstuff\");\nvar a = [], count = 0;\nfor (var i=0; i<h.childNodes.length; i++) {\n if (h.childNodes[i].tagName == \"DIV\") {\n   count++;\n   if (count == which) {\n    mp.innerHTML = h.childNodes[i].innerHTML;\n    break;\n   }\n }\n}\n",
 "mode" : 0,
 "name" : "load panel"
 },
 {
 "js" : "var delay = 2000;\nsetTimeout (function () {\nvar out = {};\nvar elems = document.getElementsByTagName('*');\nfor (var i = 0; i<elems.length; i++) {\n var elem = elems[i];\n var style = window.getComputedStyle(elem, null);\n var value = style.getPro(\"large\")",
 "mode" : 0,
 "name" : "ssset"
 },
 {
 "js" : "// here we test the \"tweener\" by pulling out all the stops\n\nvar elem = DIV ({style:{border: \"1px solid #555\", zIndex: \"40000\", position: \"absolute\"}});\n\nvar myTweenerCallback = function (elem, tweener, state) {\n\n elem.style.top = tweener.values.y + \"px\";\n elem.style.left = tweener.values.x + \"px\";\n elem.style.width = elem.style.height = \n     tweener.values.s + \"px\";\n elem.style.WebkitBorderRadius = \n   elem.style.MozBorderRadius = \n  (tweener.values.r) + \"px\";\n elem.style.borderWidth = \n  (tweener.values.b) + \"px\";\n elem.style.backgroundColor = \"rgb(\" +\n   Math.floor(tweener.values.red) + \",\" + \n   Math.floor(tweener.values.green) + \",\" + \n   Math.floor(tweener.values.blue) + \")\";\n\n switch (state) {\n  case \"initial\":\n    document.body.appendChild (elem);\n    break;\n  case \"intermediate\":\n    break;\n  case \"final\":\n  case \"stoppedearly\":\n    if (this.isReversed)\n      document.body.removeChild(elem);\n    break;\n  }\n }\n\ntweener = new Tweener (\n function(tweener, state){\n   myTweenerCallback(elem, tweener, state)\n   },\n 4000,\n 240,\n   {\n    red: [150, 255],\n    green : [255, 150],\n    blue: [150, 0],\n    x: [100, 700, Tweener.tweenFuncs.backin],\n    y: [100, 450, Tweener.tpertyValue(\"background-image\");\n if (value && value != \"\" && value != \"none\") {\n  if (value.indexOf(\"url(\") == 0) {\n    value = value.substring(4, value.length-1);\n    out[value] = true;\n    }\n  }\n }\nvar htmlString = \"\";\nfor (var i in out)\n    htmlString += \"<img style='border:1px solid black; background-color: #f00' src='\" + i + \"' / > \" + i + \"<br>\";\n\nvar out = Logger.makeIoBox();\nout.value = htmlString;\n}, delay);",
 "mode" : 0,
 "name" : "bg images"
 },
 {
 "js" : "var stationInfo = {basicData: {}, hours: [], features: []};\n\nvar a = elem1.getElementsByTagName(\"div\");\nif(a.length > 1) {\nvar ss = a[0].innerHTML.replace(/\\n/g, '').split(\"<br>\");\nstationInfo.basicData.name = ss[1];\n\nss = a[1].innerHTML.replace(/\\n/g, '').split(\"<br>\");\nif (ss.length>0)\n  stationInfo.basicData.address1 = ss[0];\nif (ss.length>1)\n  stationInfo.basicData.address2 = ss[1];\nif (ss.length>2)\n  stationInfo.basicData.phone = ss[2];\nif (ss.length>3)\n  stationInfo.basicData.email = ss[3];\n}\n\n\nvar names = {Gasoline:1, \"Car Wash\":1, \n Repair:1, \"Convenience Store\":1,\n Restaurant:1, Inspections:1};\n\nvar labels = { Mon:1, Tue:1,\n  Wed:1, Thu:1, \n  Fri:1, Sat:1,\n  Sun:1, Daily:1}; \nweenFuncs.bounceout],\n    s: [20, 200, Tweener.tweenFuncs.expoin],\n    r: [0,120],\n    b: [1,6, Tweener.tweenFuncs.linear]\n    },\n Tweener.tweenFuncs.expoin \n );\n\ntweener.run();\n",
 "mode" : 0,
 "name" : "tweener"
 },
 {
 "js" : "tweener.toggleDirection ();",
 "mode" : 0,
 "name" : "tween2"
 },
 {
 "js" : "var a = document.getElementsByTagName (\"a\");\nfor (var i=0; i<a.length; i++) {\n var s = a[i].href; \n if (s.indexOf(\".jpg\") != -1 || s.indexOf(\".jpeg\") != -1) {\n  (function (src){\n   a[i].onclick = function() {\n    var img = document.createElement (\"IMG\");\n    img.src = src;\n    document.body.appendChild (img);\n    return false;\n    };\n  })(s);\n  }\n }",
 "mode" : 0,
 "name" : "pics"
 },
 {
 "js" : "var e = SharedWMITools.makeIoBox();\nvar s = \"JsTemplates = {\\n\";\nfor (var i in JsTemplates) {\n s += \" \" + i + \": \" + JsTemplates[i].toString() + \",\\n\";\n }\ne.value = s.substring(0, s.length-2) + \"\\n};\\n\";\ne = SharedWMITools.makeIoBox();\ne.value = TemplateLoader.makePhpFunctionStrings ()",
 "mode" : 0,
 "name" : "show functions"
 },
 {
 "js" : "var i=1, d;\nwhile ((d = document.getElementById(\"spacer_\" + i))!=null) {\nd.style.backgroundColor = \"#600\";\ni++\nvar t = elem2.tree(), e, mainArray = stationInfo.hours;\nstationInfo.hours = mainArray;\nvar currTopLevel = null;\nvar curr2ndLevel = null;\n\nwhile ((e=t.next()) != null) {\n var len;\n if (e.tagName == \"TD\") {\n  var s = e.innerHTML.replace(/&nbsp;/g, '');\n  var len = s.length;\n\n  if(len > 0 && s.indexOf(\"<\") == -1) {\n   if (names[s]) {\n     currTopLevel = [s, []];\n     mainArray.push (currTopLevel);\n     }\n   else if (labels[s]) {\n    curr2ndLevel = [s];\n    currTopLevel[1].push(curr2ndLevel);\n    }\n   else {\n    if(curr2ndLevel)\n      curr2ndLevel[1] = s;\n    else {\n      curr2ndLevel = [s];\n      currTopLevel[1].push(curr2ndLevel);\n      }  \n    curr2ndLevel = null; \n    }\n  }\n }\n}\n\nt = elem3.tree(), e, mainArray = [];\nstationInfo.features = mainArray;\n\nwhile ((e=t.next()) != null) {\n var len;\n\n if (e.tagName == \"LI\") {\n  var s = e.innerHTML.replace(/&nbsp;/g, '');\n  var len = s.length;\n  if(len > 0 && s.indexOf(\"<\") == -1) {\n    mainArray.push(s);\n  }\n}\n}\n\nlog(stationInfo);",
 "mode" : 0,
 "name" : "scrapehours"
 },
 {
 "js" : "\nvar arr = [], len = 20;\nfor (var i=0; i<len; i++) {\n  var t = {};\n  window[\"$msg\" + i] = t;\n  arr[i] = t;\n  }\neval (io1.value);\nvar newData = ;\nlog(d.innerHTML);\n}",
 "mode" : 0,
 "name" : "find spacers"
 },
 {
 "js" : "var e = SharedWMITools.makeIoBox();\ne.value =  elem1.innerHTML; ",
 "mode" : 0,
 "name" : "testsel"
 },
 {
 "js" : "var sel = {\n tagName: \"div\",\n which: 2,\n classString: \"\",\n }; \nTemplateManager.trySubElement(sel);\n",
 "mode" : 0,
 "name" : "get elem"
 },
 {
 "js" : "var cw = mywin.CrossWindow;\ncw.insertCalloutElem (\n elem, \n id, \n value\n );",
 "mode" : 0,
 "name" : "insert"
 },
 {
 "js" : "var src = \"js/library/JsParser.js\";\nvar s = document.createElement('script');\ns.src = src + \"?\" + Math.floor(Math.random()*200);\ndocument.body.appendChild(s);",
 "mode" : 0,
 "name" : "load js"
 },
 {
 "js" : "\nkeyDown = function (evt) {\nif (!evt)\n  evt = window.event;\nvar c;\n\nif (evt.ctrlKey || evt.metaKey || evt.altKey)\n  return true;\n\nvar keyCode = evt.keyCode ? evt.keyCode :\n      evt.charCode ? evt.charCode :\n      evt.which ? evt.which : 0;\nc = String.fromCharCode(keyCode).toLowerCase();\nlog(c);\nif (c < 'a' || c > 'z')\n  return true;\nif (evt.preventDefault)\n  evt.preventDefault ();\nelse\n  evt.returnValue = false; \nreturn false;\n}\n\nio1.addEventListener (\"keypress\", keyDown, false);\n",
 "mode" : 0,
 "name" : "convert lang vars"
 },
 {
 "js" : " document.getElementsByTagName(\"html\")[0].style.overflow = \"auto\";",
 "mode" : 0,
 "name" : "nyt"
 },
 {
 "js" : "var e = Logger.makeIoBox();\ne.value = document.getElementById(\"rightpanel\").innerHTML;",
 "mode" : 0,
 "name" : "getrightpanel"
 },
 {
 "js" : "out.value = ServerComm.moduleToString(Tweener)",
 "mode" : 0,
 "name" : "test moduletostring"
 },
 {
 "js" : "function poop (s) {\nreturn \"poop!\"\n\n} \n\n\nvar start = \"url(\";\nvar end = \")\";\nvar s = out.value;\nvar a = s.split(\"\\n\");\nfor (var i=0; i<a.length; i++) {\n s = a[i];\n var index1, index2 ;\n\n if ((index1 = s.indexOf(start))!= -1 &&  (index2 = s.indexOf(end, index1)) != -1)\n   inner = s.substring (index1+start.length, index2));\n    \n\n\n }",
 "mode" : 0,
 "name" : "extract css images"
 },
 {
 "js" : "var e = elem1;\ne.style.height = \"300px\";\ne.style.backgroundColor = \"#efe\";\ne.innerHTML = \"\"",
 "mode" : 0,
 "name" : "fix page"
 },
 {
 "js" : "function getNextDiv(e) {\n while ((e = e.nextSibling)!= null) {\n  if(e.tagName == \"DIV\")\n   return e;\n  }\n return null;\n}\n\nvar spacers = [];\nvar doc = TemplateManager.editWin.document;\nvar e, c=1;\nwhile((e = doc.getElementById(\"spacer_\" + c)) != null) {\n spacers.push(e);\n c++;\n }\n\nelems = [];\n\nfor (var i=0; i<spacers.length-1; i++) {\n  var tmp = [];\n  var e = spacers[i]; \n  Logger.write(e.innerHTML)\n  while ((e = getNextDiv(e)) != null && e != spacers[i+1])\n    tmp.push(e); \n  \n  fc = needle.charAt(nI);\n      if (c == nc || (nc == \"'\" && c == '\"')) {\n        a.push(h2);\n        nI++;\n        }\n      else if (c == ' ' || c == '\\t' || c == '\\n') {\n        }\n      else {\n        break; \n        }\n      if (nI == nLen)\n        return a;\n      }\n    }\n  }\nreturn null; \n}\n\nlog (fuzzyIndexOf(\"test\", \"asdfte s\\ntasdf\"));",
 "mode" : 0,
 "name" : "indexof"
 },
 {
 "js" : "log(test);",
 "mode" : 0,
 "name" : "showx"
 },
 {
 "js" : "WebLocator.build();\nWebLocator.buildDirectionsForm()",
 "mode" : 0,
 "name" : "buildlocator"
 },
 {
 "js" : "WebLocator.setDirectionsMode()",
 "mode" : 0,
 "name" : "buildsearch"
 },
 {
 "js" : "Locator.searchForAddress(\"76 gladys st sf ca\");",
 "mode" : 0,
 "name" : "searchforaddress"
 },
 {
 "js" : "Locator.directionsQuery(Locator.getAddress(1), Locator.getAddress(2))",
 "mode" : 0,
 "name" : "dir query"
 },
 {
 "js" : "CalcTape.recalculateResult(0)",
 "mode" : 0,
 "name" : "recalc"
 },
 {
 "js" : "\n\n\n\n\nshowJson = function (a) {\n var newArray = [];\n var curr = null;\n for (var i=0; i<a.length; i++) {\n   var s = a[i];\n   if ((ind = s.indexOf(':')) != -1) {\n     if (curr == null)\n  or (var j=0; j<tmp.length; j++){\n    var d = doc.createElement(\"DIV\");\n    d.appendChild(tmp[j]);\n    tmp[j] = d.innerHTML;\n    }\n  elems.push(tmp);\n  }\nLogger.write(elems);\n\n /*\n  e.style.backgroundColor = \"#\" + \n    Math.floor(Math.random()*16).toString(16) + \n    Math.floor(Math.random()*16).toString(16) + \n    Math.floor(Math.random()*16).toString(16);\n */\n",
 "mode" : 0,
 "name" : "readElems"
 },
 {
 "js" : "TemplateManager.openEditWin(\n \"../design/merged/loyalty.html\");\n",
 "mode" : 0,
 "name" : "open edit win"
 },
 {
 "js" : "var out = {};\n\nvar elems = document.getElementsByTagName('*');\nfor (var i = 0; i<elems.length; i++) {\n var elem = elems[i];\n var style = window.getComputedStyle(elem, null);\n var value = style.getPropertyValue(\"background-image\");\n if (value && value != \"\" && value != \"none\") {\n  if (value.indexOf(\"url(\") == 0) {\n    value = value.substring(4, value.length-1);\n    out[value] = true;\n    }\n  }\n }\n var htmlString = \"\";\nfor (var i in out)\n    htmlString += \"<img style='border:1px solid black; background-color: #f00' src='\" + i + \"' / > \" + i + \"<br>\";\n\nvar out = {};\n\nvar elems = document.getElementsByTagName('img');\nfor (var i = 0; i<elems.length; i++) {\n v     curr = {};\n     curr[s.substring(0, ind)] = s.substring(ind+2);   \n     }\n   else if (s.indexOf('---') == 0) {\n     if (curr != null)\n       newArray.push(curr);\n     curr = null;\n     }\n   }\n if (curr != null)\n   newArray.push(curr);\n var b = document.getElementById('bleh');\n var a = newArray;\n for (var i=0; i<a.length; i++) {\n   var item = a[i];\n   with (DomGenerator) {\n     var d = DIV({className: 'taskBox'});\n     for (var j in item) {\n        d.appendChild (P(DIV(j), item[j]));\n       }\n     b.appendChild(d);\n     }\n   }\n }\n\nvar src = \"../data/tasks.php?callback=showJson\"; \nvar s = document.createElement('script');\ns.src = src\ndocument.body.appendChild(s);\n",
 "mode" : 0,
 "name" : "showtasks"
 },
 {
 "js" : "var container = document.getElementById(\"mainDiv\");\ncontainer.innerHTML = '';\nCalcTape.list = [];\nCalcTape.initializeList();\ncontainer.appendChild (CalcTape.table);",
 "mode" : 0,
 "name" : "clearCalc"
 },
 {
 "js" : "Locator.searchForAddress(\"dayton,oh\")",
 "mode" : 0,
 "name" : "search address"
 },
 {
 "js" : "WebLocator.toggleMapSize()",
 "mode" : 0,
 "name" : "size map"
 },
 {
 "js" : "\nLogger.write (Locator.getSidebarArray(false))",
 "mode" : 0,
 "name" : "showSidebar"
 },
 {
 "js" : "Locatorar elem = elems[i];\n var value = elem.src;\n if (value && value != \"\" && value != \"none\") {\n  out[value] = true;\n  }\n }\nvar htmlString2 = \"\";\nfor (var i in out)\n    htmlString2 += \"<img style='border:1px solid black; background-color: #f00' src='\" + i + \"' / > \" + i + \"<br>\";\n\nvar d = document.createElement(\"div\");\n//d.style.position = \"absolute\";\n//d.style.top=\"5px\";\n//d.style.left=\"5px\";\n\nvar inner = document.createElement(\"div\");\ninner.style.border = \"1px solid black\";\ninner.style.padding = \"10px\";\ninner.style.backgroundColor = \"#ccc\";\ninner.innerHTML = \"<b>background images</b><br>\" + htmlString;\n\nd.appendChild (inner);\n\nvar inner = document.createElement(\"div\");\ninner.style.border = \"1px solid black\";\ninner.style.padding = \"10px\";\ninner.style.backgroundColor = \"#ccc\";\ninner.innerHTML = \"<b>images</b><br>\" + htmlString2;\n\nd.appendChild (inner);\n\ndocument.body.appendChild (d);\n",
 "mode" : 0,
 "name" : "writebgimages"
 },
 {
 "js" : "var delay = 2000;\nsetTimeout (function () {\nvar panel = document.getElementById(\"mainpanel\");\nvar c = document.getElementById(\"map_canvas\");\nif (c !=null)\n  c.innerHTML = \"\";\nvar a = panel.getElementsByTagName(\"object\");\nfor.synchSidebar(true);",
 "mode" : 0,
 "name" : "synch sidebar"
 },
 {
 "js" : "globalObj[1].stat.dev = \"asdfasdfasdf\";\nshowObj(globalObj)",
 "mode" : 0,
 "name" : "testdir"
 },
 {
 "js" : "var newObj = [], o = globalObj;\nfor (var i=0; i<globalObj.length; i++)\n if (o[i].name.indexOf('js')!=-1)\n   newObj.push(o[i]);\nshowObj(newObj)",
 "mode" : 0,
 "name" : "removenonjs"
 },
 {
 "js" : "(function(){\nvar genPath = function (path, depth) {\n  var s = '';\n  for (var i= 0; i<depth; i++)\n    s += '/' + path[i];\n  return s;\n  };\n\nvar path = [];\n\nvar show = function(a) {\n for (var i=0; i<a.length; i++) {\n   var item = a[i];\n   path[item.depth] = item.name; \n   if (item.children) \n     Logger.write(genPath(path, item.depth) + \"/<span style='color:#080; font-weight: bold'>\" + item.name + \"</span>\");\n   else\n     Logger.write(genPath(path, item.depth) + \n         \"/<span style='color:#800'>\" + item.name + \"</span>\");\n   if (item.children) {\n     show(item.children);\n     }\n   }\n}\nvar a = globalObj;\nshow(a);\n})();\n",
 "mode" : 0,
 "name" : "resurseFileTree"
 },
 {
 "js" : "ServerComm.xhrGet(\"/createFile\", {\n  filename: \"/Users/rob/whatever/blah/\" + fileInfo.name, (var i=0; i<a.length; i++)\n a[i].parentNode.removeChild(a[i]);\nvar a = panel.getElementsByTagName(\"script\");\nfor (var i=0; i<a.length; i++)\n a[i].parentNode.removeChild(a[i]);\nvar a = panel.getElementsByTagName(\"img\");\nfor (var i=0; i<a.length; i++) {\n var e = a[i];\n var src = a[i].src;\n var index;\n if ((index = src.lastIndexOf(\"/\")) != -1)\n   a[i].src = \"resources\" + src.substring(index);\n }\nvar out = Logger.makeIoBox();\nout.value = panel.innerHTML;\n}, delay);\n",
 "mode" : 0,
 "name" : "get mainpanel"
 },
 {
 "js" : "var which = 1;\nvar mp = document.getElementById(\"mainpanel\");\nvar c = document.getElementById(\"map_canvas\");\nif (c)\n c.innerHMTL = '';\nvar h = document.getElementById(\"hiddenstuff\");\nvar a = [], count = 0;\nfor (var i=0; i<h.childNodes.length; i++) {\n if (h.childNodes[i].tagName == \"DIV\") {\n   count++;\n   if (count == which) {\n    mp.innerHTML = h.childNodes[i].innerHTML;\n    break;\n   }\n }\n}\n",
 "mode" : 0,
 "name" : "load panel"
 },
 {
 "js" : "var delay = 2000;\nsetTimeout (function () {\nvar out = {};\nvar elems = document.getElementsByTagName('*');\nfor (var i = 0; i<elems.length; i++) {\n var elem = elems[i];\n var style = window.getComputedStyle(elem, null);\n var value = style.getPropertyValue(\"background-image\");\n if (value && value != \"\" && value != \"none\") {\n  if (value.indexOf(\"url(\") == 0) {\n    value = value.substring(4, value.length-1);\n    out[value] = true;\n    }\n  }\n }\nvar htmlString = \"\";\nfor (var i in out)\n    htmlString += \"<img style='border:1px solid black; background-color: #f00' src='\" + i + \"' / > \" + i + \"<br>\";\n\nvar out = Logger.makeIoBox();\nout.value = htmlString;\n}, delay);",
 "mode" : 0,
 "name" : "bg images"
 },
 {
 "js" : "var stationInfo = {basicData: {}, hours: [], features: []};\n\nvar a = elem1.getElementsByTagName(\"div\");\nif(a.length > 1) {\nvar ss = a[0].innerHTML.replace(/\\n/g, '').split(\"<br>\");\nstationInfo.basicData.name = ss[1];\n\nss = a[1].innerHTML.replace(/\\n/g, '').split(\"<br>\");\nif (ss.length>0)\n  stationInfo.basicData.address1 = ss[0];\nif (ss.length>1)\n  stationInfo.basicData.address2 = ss[1];\nif (ss.length>2)\n  stationInfo.basicData.phone = ss[2];\nif (ss.length>3)\n  stationInfo.basicData.email = ss[3];\n}\n\n\nvar names = {Gasoline:1, \"Car Wash\":1, \n Repair:1, \"Convenience Store\":1,\n Restaurant:1, Inspections:1};\n\nvar labels = { Mon:1, Tue:1,\n  Wed:1, Thu:1, \n  Fri:1, Sat:1,\n  Sun:1, Daily:1}; \n\n  timestamp: fileInfo.modTime+1000000,\n  contents:  \"thiasdfasdf asdf asdf asdf asdf asdf astest\"\n  }, function (data) {\n    Logger.write(data)});\n\nvar fileInfo = globalObj[1].children[0].children[1];\nlog (fileInfo)\nServerComm.xhrPost(\"/createFile\", {\n  filename: \"/Users/rob/whatever/blah/\" + fileInfo.name,\n  timestamp: fileInfo.modTime+1000000,\n  contents:  \"thiasdfasdf asdf asdf asdf asdf asdf astest\"\n  }, function (data) {\n    Logger.write(data)}); ",
 "mode" : 0,
 "name" : "postfile"
 },
 {
 "js" : "function getItem (fields, arr, itemNo) {\n  var item = arr[itemNo];\n  if (!item)\n    return null;\n  var ret = {};\n  for (var i=0, len = fields.length; i < len; i++)\n    ret[fields[i]] = item[i]\n  return ret;\n  }\n  \nvar t;\neval (\"t = \" +  document.getElementById(id='hiddenta').value + \";\");\nvar f = t.fields;\nvar d = t.data;\n\nvar item = getItem (f, d, 2);\nlog(item.latitude);",
 "mode" : 0,
 "name" : "compactJson"
 },
 {
 "js" : "var src = \"../js/tools/SharedWMITools.js\";\nvar s = document.createElement('script');\ns.src = src + \"?\" + Math.floor(Math.random()*200);\ns.onload = function () {var e = SharedWMITools.makeIoBox();}\ndocument.body.appendChild(s);\n",
 "mode" : 0,
 "name" : "iobox"
 },
 {
 "js" : "var a = document.getElementsByTagName(\"area\");\nfor (var i in a) {\n  if (a[i].coords) {\n  var a2 = a[i].coords.split(\",\");\n  for (var j=0; j<a2.length; j++) { \n  if (a2[j])\n    a2[j] = Math.round(parseInt(a\nvar t = elem2.tree(), e, mainArray = stationInfo.hours;\nstationInfo.hours = mainArray;\nvar currTopLevel = null;\nvar curr2ndLevel = null;\n\nwhile ((e=t.next()) != null) {\n var len;\n if (e.tagName == \"TD\") {\n  var s = e.innerHTML.replace(/&nbsp;/g, '');\n  var len = s.length;\n\n  if(len > 0 && s.indexOf(\"<\") == -1) {\n   if (names[s]) {\n     currTopLevel = [s, []];\n     mainArray.push (currTopLevel);\n     }\n   else if (labels[s]) {\n    curr2ndLevel = [s];\n    currTopLevel[1].push(curr2ndLevel);\n    }\n   else {\n    if(curr2ndLevel)\n      curr2ndLevel[1] = s;\n    else {\n      curr2ndLevel = [s];\n      currTopLevel[1].push(curr2ndLevel);\n      }  \n    curr2ndLevel = null; \n    }\n  }\n }\n}\n\nt = elem3.tree(), e, mainArray = [];\nstationInfo.features = mainArray;\n\nwhile ((e=t.next()) != null) {\n var len;\n\n if (e.tagName == \"LI\") {\n  var s = e.innerHTML.replace(/&nbsp;/g, '');\n  var len = s.length;\n  if(len > 0 && s.indexOf(\"<\") == -1) {\n    mainArray.push(s);\n  }\n}\n}\n\nlog(stationInfo);",
 "mode" : 0,
 "name" : "scrapehours"
 },
 {
 "js" : "\nvar arr = [], len = 20;\nfor (var i=0; i<len; i++) {\n  var t = {};\n  window[\"$msg\" + i] = t;\n  arr[i] = t;\n  }\neval (io1.value);\nvar newData = 2[j].split(' ').join(''))/2);\n    }\n   a[i].coords = a2.join(','); \n   //log (a2)\n  \n   }\n  }\n",
 "mode" : 0,
 "name" : "mapresize"
 },
 {
 "js" : "var list = globalObj;\nnewList = [];\nfor (var i=0; i<list.length; i++) {\n  var item = list[i];\n  if (item.name.lastIndexOf(\".php\") != -1)\n    newList.push(item);\n  }\n//log(newList);\nfor (var i=0; i<newList.length; i++) {\nvar item = newList[i];\nitem.params = [];\nServerComm.fetchJsonData(\"../getFile\",\n  {\n  filename: \"/Users/rob/www/\" + item.name\n  },\n  {\n  foo: item\n  },\n  function (response, more) {\n    Logger.write(item);\n    var a = response.data.split(\"\\n\");\n    more.foo.params = [];\n    for (var j=0; j<a.length; j++) {\n      var s = a[j];\n      if (s.indexOf(\"=>\") != -1) {\n        s = s.replace(\"=>\", \":\");\n        while (s.charAt(s.length-1) == ' ' ||\n          s.charAt(s.length-1) == ',')\n        s = s.substring(0, s.length-1);\n        more.foo.params.push(s);   \n        }\n      }   \n    }\n  );\n}\n",
 "mode" : 0,
 "name" : "dolist"
 },
 {
 "js" : "ServerComm.fetchJsonData(\n  \"php/unitTest.php\",\n  {\n   input: {stuff: \"asdfasdfasdf\"},\n   testname: \"testUnitTest\"\n  },\n  {},\n  function (output) {\n    if (output.html) {\n      var h = output.html;\n      for (var i in h) {\n        var e;\n        if ((e = document.getElementById(i)) != null) {\n          e.innerHTML = h[i];\n          }\n        }\n      }\n    }\n  );",
 "mode" : 0,
 "name" : "uiUnitTest"
 },
 {
 "js" : "Cookie.setCookie(\"taskuser\", \"blah\", \"/\", 5);",
 "mode" : 0,
 "name" : "authcookie"
 },
 {
 "js" : "UnitTest.makePopupTest('bannerUnitTest');",
 "mode" : 0,
 "name" : "popup unit test"
 },
 {
 "js" : "var src = \"../js/library/JsParser.js\";\nvar s = document.createElement('script');\ns.src = src + \"?\" + Math.floor(Math.random()*200);\ndocument.body.appendChild(s);\n",
 "mode" : 0,
 "name" : "loaduitester"
 },
 {
 "js" : "dataCallback = function (o) {\nvar x = {};\n  for (var i in o[\"59385\"]) {\n    var item =  o[\"59385\"][i];\n    x[item.estorenum] = 59385;\n    }\n Logger.write(x);\n }\n\nvar src = \"http://localhost/loyalty/dummyDb/stationsByProgram.js\";\nvar s = document.createElement('script');\ns.src = src + \"?\" + Math.floor(Math.random()*200);\ndocument.body.appendChild(s);",
 "mode" : 0,
 "name" : "fakedb"
 },
 {
 "js" : "var elem=elem1.getElementsByTagName('input')[0];\nlog(elem.value)\nelem.onfocus = function () {\n  if (elem.value =='return and earn card number') {\n    elem.value = '';\n    elem.style.color = '#000';\n    elem.style.fontStyle = 'normal';\n    }\n  }",
 "mode" : 0,
 "name" : "cardnoinputjs"
 },
 {
 "js" : "JsParser.process('');",
 "mode" : 0,
 "name" : "jsparse"
 },
 {
 "js" : "var showD = function (d, depth) {\n  var indent = '';\n  for (x=0; x<depth; x++)\n    indent += \" \"\n  if (d.children) {\n    for (var i=0; i<d.children.length; i++) {\n      var c = d.children[i];    \n      Logger.write(indent + c.type + \" \" + c.startIndex + \" \" + \n        c.startLineNo + \" \" + c.endIndex + \" \" + c.endLineNo);\n      showD(c, depth+1)\n      }\n    }\n  }\nshowD(JsParser.delimTracker, 0);",
 "mode" : 0,
 "name" : "showdelims"
 },
 {
 "js" : "var a = document.getElementsByTagName ('*');\nvar len = a.length;\nvar b = [];\nfor (var i=0; i<len; i++) {\n  var e = a[i];\n  var s = null;\n  if (e.innerHTML.length > 100) { \n  if (e.id != null && e.id.length > 0)\n    s = e.id;\n  if (e.className != null && e.className.length > 0) {\n    if (s)\n      s += \" (\" + e.className + \")\";\n    else\n      s = \"(\" + e.className + \")\";\n    }\n    \n  if (s) {\n    var c = document.createComment (s);\n    e.parentNode.insertBefore(c, e.nextSibling);  \n   }\n   }\n  }\n",
 "mode" : 0,
 "name" : "add comments"
 },
 {
 "js" : "function fnCleanTree(node){\n    var\n        i=0,\n        cNodes=node.childNodes,\n        t;\n    while((t=cNodes.item(i++)))\n        switch(t.nodeType){\n            case 1: // Element Node\n                fnCleanTree(t);\n                break;\n            case 8: // Comment Node (and Text Node without non-whitespace content)\n                node.removeChild(t);\n                i--;\n        }\n}\nfnCleanTree(document.body)",
 "mode" : 0,
 "name" : "clean comments"
 },
 {
 "js" : "\nfor (var i=0; i<templates.length; i++)\n  Logger.write (\"template \" + templates[i].node.tagName + \" \" + templates[i].attr.nodeValue);\nfor (var i=0; i<comments.length; i++) {\n  n = comments[i];\n  Logger.write (\"comment \" + n.val + \"  isPrev: \" + n.isPrev + \" type: \" + n.el.nodeType);\n  }\nfor (var i=0; i<attributes.length; i++) {\n  var a = attributes[i].attr;\n  Logger.write (\"attribute \" + attributes[i].node.tagName + \" \" + a.nodeValue);\n  attributes[i].attr.nodeValue = attributes[i].attr.nodeValue.replace(/#1#/g, '')\n  }\n  \n",
 "mode" : 0,
 "name" : "walkDom"
 },
 {
 "js" : "var s = CookieUtils.get(\"mapstate\");\nvar a = s.split('|');\nvar centerStrings = a[0].split(',');\nvar pt = new _m.LatLng(parseFloat(centerStrings[0]), parseFloat(centerStrings[1]));\n\nLocator.map.setCenter(pt);\nLocator.map.setZoom(parseInt(a[1]));",
 "mode" : 0,
 "name" : "show map cookie"
 },
 {
 "js" : "var src = \"../js/templateTest.js\";\nvar s = document.createElement('script');\ns.src = src + \"?\" + Math.floor(Math.random()*200);\ndocument.body.appendChild(s);\n",
 "mode" : 0,
 "name" : "convert templates"
 },
 {
 "js" : "var makeReplacers = function (rep) {\n  var re = [];\n  for (var i=0, ii=rep.length; i<ii; i++) {\n    var item = rep[i];\n    re[i] = [\n      new RegExp(\n        ((item[3] == true) ? '\\b'+item[0]+'\\b' : item[0]),\n        ((item[2] == null) ? 'g' : 'g'+item[2]) ),\n      item[1]\n      ];\n    }\n  return re;\n  }\n\nvar modifyText = function (text, reList, cb) {\n  var sa = text.split('\\n'), saNew = [];\n  for (var j=0; j<sa.length; j++) {\n    var line = sa[j];\n    if (cb)\n      line = cb(line, j);\n    if(line != null) {\n      for (var i=0; i<reList.length; i++)\n        line = line.replace(reList[i][0], reList[i][1]);\n    saNew.push(line);\n    }  \n  }\n  return saNew.join('\\n');\n}\n\nio2.value = modifyText(io1.value, \n   makeReplacers([\n     ['fucking', \"freakin'\", 'i'],\n     ['shit', 'poo'],\n     ['peacock', 'urinepenis']\n     ]),\n   function (s, lineNo) {\n     if(s.indexOf('/**/') == 0)\n       return null;\n     if(s.indexOf('blah') != -1)\n       return \"the whole line has been replaced!\";\n     return s;\n     }   \n   );\n ",
 "mode" : 0,
 "name" : "modify text"
 },
 {
 "js" : "var s = io1.value;\n\nvar f = function (s) {\n  var a = [], len = s.length;\n  var pos = 0;\n  while(pos < len) {\n    var i1 = s.indexOf('[', pos);\n    if (i1 != -1) {\n      var i2 = s.indexOf(']', i1+1);\n      if (i2 != -1) {\n        var item = {s: i1, e: i2+1};\n        if (s.charAt(i1+1) == '#') {\n          item.name = s.substring(i1+2, i2-1);\n          a.push(item);\n          }\n        else if (s.charAt(i2-1) == '#') {\n          item.isEnd = true;\n          item.name = s.substring(i1+1, i2-2);\n          a.push(item);\n          }\n        pos = i2+1;\n        }\n      else {\n        return a;\n        }\n      }\n    else {\n      return a;\n      }\n    }\n  return a;\n  } \n  \nvar o = f(s);\nLogger.write(o);\n",
 "mode" : 0,
 "name" : "extract attribute modifiers"
 },
 {
 "js" : "var p = new PopupWindow(\"test\")\np.show();\nrender = function (s) {p.contentElem.innerHTML = s;};",
 "mode" : 0,
 "name" : "render to window"
 },
 {
 "js" : "io2.value = JsParser.processJs(io1.value);",
 "mode" : 0,
 "name" : "parseJs"
 },
 {
 "js" : "elem1.contentEditable = 'true';",
 "mode" : 0,
 "name" : "editable"
 },
 {
 "js" : "var out = [];\nvar a = elem1.getElementsByTagName('tr');\nfor (var i=0; i<a.length; i++) {\n var tds =  a[i].getElementsByTagName('td');\n var o = {issue: tds[0].innerHTML, details: tds[2].innerHTML};\n out.push (o)\n }\nvar s = '';\nfor (var i=0; i<out.length; i++) {\ns += \"------------------------------------------\\nissue: \" + out[i].issue + \"\\ndetails: \" + out[i].details); \n}\nio1.value = s;",
 "mode" : 0,
 "name" : "get issues"
 },
 {
 "js" : "trimWhiteSpace = function (s) {\nvar c, i;\nvar ws = '\\n\\r\\t ';\nfor (i=0; i<s.length; i++) {\n c = s[i];\n if (ws.indexOf(c) == -1) {\n  break;\n  }\n }\ns = s.substring(i);\n\nfor (i=s.length-1; i>=0; i--) {\n c = s[i];\n if (ws.indexOf(c) == -1) {\n  break;\n  }\n }\ns = s.substring(0,i+1);\nreturn s;\n}\n\nvar result = [];\n\n    (function findTextNodes(current) {\n        for(var i = 0; i < current.childNodes.length; i++) {\n            var child = current.childNodes[i];\n            if(child.nodeType == 3) {\n                var s = trimWhiteSpace(child.nodeValue);\n                if (s.length > 0 && s != ' ') result.push(s);\n            }\n            else {\n                findTextNodes(child);\n            }\n        }\n    })(document.body);\n Logger.write(result)",
 "mode" : 0,
 "name" : "showTextNodes"
 },
 {
 "js" : "log(document.cookie);\nCookie.setCookie('mapstate', '', null, -1);\nCookie.setCookie('PHPSESSID', '', null, -1);\nlog(document.cookie);",
 "mode" : 0,
 "name" : "clear cookie"
 }
]