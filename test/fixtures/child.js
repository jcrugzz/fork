
var Forkee = require('forkee');

var f = new Forkee()
  .on('request', function (message, callback) {
    callback(null, message);
  });
