
  function Ajax(url, cb, eb) {
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
  };

