var Forkee = require('forkee');

var forked = new Forkee()
  .on('request', function (message, callback) {
    this.notify('what', { hello: 'there' });
    setImmediate(callback, null, { we: 'are', done: 'now' });
  });
