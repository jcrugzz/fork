
var test = require('tape');
var path = require('path');
var fork = require('../fork');
var child = path.join(__dirname, 'fixtures', 'retry.js');

test('test request response when using 2 retries functionality and failing child process', function (t) {
  t.plan(3);

  var message = { action: 'woooo', doc: 'document' };
  fork({
    path: child,
    retries: 2
  })
  .fork(message)
  .on('error', function (err) {
    t.ok(err, 'Failed after attempting retry with ' + err.message);
    t.end();
  })
  .on('retry', function (yo) { t.ok(yo, 'retry attempt') })
  .on('response', function (msg) {
    t.fail(msg, 'We should not receive a message with a determinstically failing child process');
    t.end();
  })
});

test('retry twice with backoff enabled', function (t) {
  t.plan(3);

  var message = { action: 'woooo', doc: 'document' };
  fork({
    path: child,
    retries: 2,
    backoff: true
  })
  .fork(message)
  .on('error', function (err) {
    t.ok(err, 'Failed after attempting retry with ' + err.message);
    t.end();
  })
  .on('retry', function (yo) { t.ok(yo, 'retry attempt') })
  .on('response', function (msg) {
    t.fail(msg, 'We should not receive a message with a determinstically failing child process');
    t.end();
  })
});
