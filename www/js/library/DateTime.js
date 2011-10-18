var DateTime = {
  //--------------------------------------------------------------
  makeDateTimeString: function(dateSeconds) {
    var d = new Date(dateSeconds*1000);
    
    var month = d.getMonth();
    var day	= d.getDate();
    var year = d.getYear();
    
    var hour = d.getHours();
    var minute = d.getMinutes();
    var ap = "am";
    
    if(hour > 11) {
      ap = "pm";
      if(hour	 > 12) 
        hour = hour - 12;
    }
    else if(hour == 0)
      hour = 12;			
    
    var dateStr = hour + ((minute < 10)?":0":":") + minute + ap;
    
    if(month != this.thisMonth || day != this.today || year != this.thisYear) {
      dateStr += " " + (month+1) + "/" + day;
      
      if(year != this.thisYear) {
        year = (year%100);
        dateStr += ((year < 10)?"/0":"/") + year
      }
    }
    return dateStr;
  },
  
  //--------------------------------------------------------------
  makeDateString: function(dateSeconds) {
    var d = new Date(dateSeconds*1000);
    
    var month = d.getMonth();
    var day	= d.getDate();
    var year = d.getYear();
    
    var dateStr = (month+1) + "/" + day;
    year = (year%100);
    dateStr += ((year < 10)?"/0":"/") + year
    return dateStr;
  },
  
  //--------------------------------------------------------------
  makeDateTimeStringSeconds: function(dateSeconds) {
    var d = new Date(dateSeconds*1000);
    
    var month = d.getMonth();
    var day	= d.getDate();
    var year = d.getYear();
    
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var ap = "am";
    
    if(hour > 11) {
      ap = "pm";
      if(hour	 > 12) 
        hour = hour - 12;
    }
    else if(hour == 0)
      hour = 12;			
    
    var dateStr = (month+1) + "/" + day;
    year = (year%100);
    dateStr += ((year < 10)?"/0":"/") + year
    
    dateStr += " " + hour + ((minute < 10)?":0":":") + minute + ((second < 10)?":0":":") + second + ap;
    return dateStr;
  },
  
  //--------------------------------------------------------------
  getCurrDate: function() {
    var now = new Date();
    this.thisMonth = now.getMonth();
    this.today		 = now.getDate();
    this.thisYear	 = now.getYear();
  }
};
