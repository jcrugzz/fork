var test = require('tape');
var path = require('path');
var Fork = require('..');
var child = path.join(__dirname, 'fixtures', 'error.js');

test('Handle errors and send the right properties', function (t) {
  t.plan(3);
  var fork = new Fork(child)
    .fork({ does: 'not', matter: 'much' })
    .on('error', function (err) {
      t.ok(err.child, 'has child prop');
      t.ok(err.stack, 'has stack');
      t.equals(err.message, 'Whatever', 'message is correct');
    });
});
