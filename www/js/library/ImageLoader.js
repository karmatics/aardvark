ImageLoader = {
  maxChecks: 1000,
  list: [],
  intervalHandle : null,
  
  loadImage : function (url, callback) {
    var img = new Image ();
    img.src = url;
    if (img.width && img.height) {
      callback (img.width, img.height, url, 0);
    }
    else {
      var obj = {image: img, url: url, callback: callback, checks: 1};
      var i;
      for (i=0; i < this.list.length; i++)	{
        if (this.list[i] == null)
          break;
      }
      this.list[i] = obj;
      if (!this.intervalHandle)
        this.intervalHandle = setInterval(this.interval, 30);
    }
  },
  
  // called by setInterval  
  interval : function () {
    var count = 0;
    var list = ImageLoader.list, item;
    for (var i=0; i<list.length; i++) {
      item = list[i];
      if (item != null) {
        if (item.image.width && item.image.height) {
          item.callback (item.image.width, item.image.height, item.url, item.checks);
          ImageLoader.list[i] = null;
        }
        else if (item.checks > ImageLoader.maxChecks) {
          item.callback (0, 0, item.url, item.checks);
          ImageLoader.list[i] = null;
        }
        else {
          count++;
          item.checks++;
        }
      }
    }
    if (count == 0) {
      ImageLoader.list = [];
      clearInterval (ImageLoader.intervalHandle);
      delete ImageLoader.intervalHandle;
    }
  }
};

/* var callback = function (s, width, height, url, checks) {
  Logger.write ("w: " + width + 
    ", h:" + height + 
    ", url:" + url + ", s:" + s +
    ", checks:" + checks);
var img = document.createElement("IMG");
img.src = url;
img.style.cssFloat = "left";
img.style.styleFloat = "left";
img.style.width = "100px";
img.style.height = ((height/width)*100) + "px";
document.body.appendChild (img);
};

ImageLoader.loadImage ({func: callback, params: ["poo!"]},  "http://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Caerulea3_crop.jpg/800px-Caerulea3_crop.jpg");

ImageLoader.loadImage ({func: callback, params: ["poo!"]},  "http://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Calliphora_sp_Portrait.jpg/402px-Calliphora_sp_Portrait.jpg");
*/