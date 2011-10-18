NamedItemList = {
  
  constructor:function () {
    this.list = {};
  },
  
  prototype : {
    
    insert : function (name, object) {
      this.list[name] = {next: this.list[name], object: object};
    },
    
    remove : function (name, object) {  
      var nl = this.list[name];
      if (nl == null)
        return;
      if (nl.object == object) {
        if (nl.next == null)
          delete this.list[name];
        else 
          this.list[name] = nl.next;
        return;
      }
      while (nl.next != null) {
        if (nl.next.object == object) {
          nl.next = nl.next.next;
          return;
        }
        nl = nl.next;
      }
    },
    
    getLastAdded : function (name) {
      var nl = this.list[name];
      if (nl == null)
        return null;
      return nl.object;
    }
  }
  
};

// init ------------------------
(function (name, module) {
    var constructor = window[name] = module.constructor;
    for (var j in module)
      constructor[j] = module[j];
  })("NamedItemList", NamedItemList);



