
var test = require('tape');
var path = require('path');
var Fork = require('../fork');
var child = path.join(__dirname, 'fixtures', 'child.js');


test('Test request response with child process', function (t) {
  t.plan(1);
  var message = { action: 'start', doc: 'document' };
  var fork = new Fork(child)
    .fork(message)
    .on('error', function (err) { t.fail(err) })
    .on('response', function (msg) {
      t.deepEqual(message, msg, 'Successful request -> response');
      t.end();
    });

});
