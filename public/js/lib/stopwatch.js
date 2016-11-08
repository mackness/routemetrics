//thanks - http://codepen.io/d_panayotov/pen/jwJGF

  function Stopwatch(text) {

      this.text=text;

      var startAt = 0;
      var lapTime = 0;

      var now = function() {
          return (new Date()).getTime();
      };

      this.start = function() {
          startAt = startAt ? startAt : now();
          this.timer = setInterval(redirect, 100, this);
          function redirect(w) {
              w.update();
          }
      };

      this.stop = function() {
          lapTime = startAt ? lapTime + now() - startAt : lapTime;
          startAt = 0;
          clearInterval(this.timer);

      };

      this.reset = function() {
          lapTime = startAt = 0;
      };

      this.time = function() {
          return lapTime + (startAt ? now() - startAt : 0);
      };

      var pad = function(num, size) {
          var s = "0000" + num;
          return s.substr(s.length - size);
      }

      this.formattedTime = function() {
          var m = 0,
              s = 0,
              ms = 0;
          var newTime = this.time();

          newTime = newTime % (60 * 60 * 1000);
          m = Math.floor( newTime / (60 * 1000) );
          newTime = newTime % (60 * 1000);
          s = Math.floor( newTime / 1000 );
          ms = newTime % 1000;

          return pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
      };

      this.update =  function() {
          text.innerHTML = this.formattedTime();
      };
  };

