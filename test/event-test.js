var test = require('tape');
var path = require('path');
var Fork = require('..');
var child = path.join(__dirname, 'fixtures', 'event.js');

test('test that notify works properly in the child and that the child responds', function (t) {
  t.plan(2);
  var fork = new Fork(child)
    .fork({ action: 'start', payload: 'here' })
    .on('error', function (err) { t.fail(err); })
    .on('what', function (msg) {
      t.deepEqual(msg, { hello: 'there' }, 'successful `what` event');
    })
    .on('response', function (msg) {
      t.deepEqual(msg, { we: 'are', done: 'now' }, 'Successful response returned');
    });
});
