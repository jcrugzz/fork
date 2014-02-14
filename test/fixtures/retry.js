
var forkee = require('forkee');

forkee()
  .on('request', function (message, callback) {
    callback(new Error('wooooo nelly'));
});
