var Tweener = {
  constructor: function (callback, time, numFrames, startEndValues, tweeningFunction) {
    this.callback = callback;
    this.tweeningFunction = tweeningFunction;
    this.startEndValues = startEndValues;
    this.time = time;
    this.numFrames = numFrames;
    var d = {};
    for (var i in startEndValues) {
      // this is lame but necessary, since the functions
      // don't deal with negatives properly.
      var item = startEndValues[i];
      var diff = item[1] - item[0];
      if (diff >= 0)
        d[i] = {val: diff};
      else
        d[i] = {val: -diff, isNeg: true};
      if (item[2] && typeof(item[2]) == "string")
        item2 = this.constructor.tweenFuncs[item[2]];
    }
    this.diffs = d;
    this.frameNo = 0;
    var v = {};
    for (var i in this.startEndValues) {
      v[i] = this.startEndValues[i][this.frameNo];
    }
    this.values = v;
  },
  tweenFuncs: {
    bounceout: function (x, t, b, c, d) {
      if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b;
      } else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
      } else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
      } else {
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
      }
    },
    linear: function (x, t, b, c, d) {
      return c*t/d + b;
    },
    expoin: function (x, t, b, c, d) {
      var flip = 1;
      if (c < 0) {
        flip *= -1;
        c *= -1;
      }
      return flip * (Math.exp(Math.log(c)/d * t)) + b;		
    },
    easeInQuad: function (x, t, b, c, d) {
      return c*(t/=d)*t + b;
    },
    backin: function (x, t, b, c, d) {
      var s=1.70158;
      return c*(t/=d)*t*((s+1)*t - s) + b;
    }
  },
  prototype: {
    timerFunction: function () {
      var v = this.values;
      for (var i in this.diffs) {
        var val;
        
        if (this.startEndValues[i][2])
          val = this.startEndValues[i][2] (0, this.frameNo, 0, this.diffs[i].val, this.numFrames); 
        else
          val = this.tweeningFunction (0, this.frameNo, 0, this.diffs[i].val, this.numFrames); 
        
        if (this.diffs[i].isNeg)
          v[i] = this.startEndValues[i][0] - val;
        else
          v[i] = this.startEndValues[i][0] + val;
      }
      if (this.isReversed && this.frameNo == 0) {
        this.callback (this, "final");
        delete this.timerHandle;
      }
      else if (!this.isReversed && this.frameNo == this.numFrames) {
        this.callback (this, "final");
        delete this.timerHandle;
      }
      else {  
        this.callback (this, "intermediate");
        if (this.isReversed)
          this.frameNo--;
        else
          this.frameNo++;
        this.setTimer();
      }
    },
    setTimer: function (delay) {
      var self = this;
      this.timerHandle = setTimeout(function(){
          self.timerFunction()
        }, Math.round(this.time/this.numFrames));
    },
    run: function () {
      if (this.timerHandle)
        return;
      this.frameNo = (this.isReversed)?this.numFrames:0;
      this.callback (this, "initial");
      this.frameNo =  (this.isReversed)?this.numFrames-1:1;
      this.setTimer ();
      return this;
    },
    terminate: function (doCallback) {
      if (this.timerHandle!=null) {
        clearTimeout(this.timerHandle);
        delete this.timerHandle;
      }
      if (doCallback) {
        var v = this.values;
        for (var i in this.startEndValues) {
          v[i] = this.tweeningFunction (0, this.frameNo, this.startEndValues[i][0], this.startEndValues[i][1], this.numFrames); 
        }
        this.callback (this, "stoppedearly");
      }
    },
    toggleDirection: function () {
      if (this.isReversed)
        delete this.isReversed;
      else
        this.isReversed = true;
      if (!this.timerHandle)
        this.run();
    },
    finishNow: function () {
      if (this.timerHandle!=null) {
        clearTimeout(this.timerHandle);
        delete this.timerHandle;
      }
      var v = {};
      for (var i in this.startEndValues)
        v[i] = this.startEndValues[i][1];
      this.values = v;
      this.frameNo = this.numFrames;
      this.callback (this, "final");
    }
  }
};

// init ------------------------
(function (name) {
    var module = window[name];
    var constructor = window[name] = module.constructor;
    for (var j in module)
      constructor[j] = module[j];
  })("Tweener");
