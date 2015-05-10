var Forkee = require('forkee');

var forked = new Forkee()
  .on('request', function (message, callback) {
    setImmediate(callback, new Error('Whatever'));
  });
