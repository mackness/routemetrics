
function Ajax() {
  this.get = function(url, cb, eb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      if (xhr.status === 200) {
        cb(JSON.parse(xhr.responseText));
      }
      else {
        eb(JSON.parse(xhr.status));
      }
    };
    xhr.send();
  }
  this.post = function(url, cb, eb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      if (xhr.status === 200) {
        cb(JSON.parse(xhr.responseText));
      }
      else {
        eb(JSON.parse(xhr.status));
      }
    };
    xhr.send();
  }
};

// var xhr = new XMLHttpRequest();
// xhr.open('POST', '/my/url', true);
// xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
// xhr.send(data);