# fork

A simple module that gives a clean `request`/`response` api for dealing with
a [`child_process`][child_process] that you want to [`fork`][fork]. It comes with built
in retry support using [`back`][back] for backoff to try and ensure determinism.

## Example Usage

```js
//
// This could also just be a path but we encourage module use :)
//
var childToFork = require.resolve('myChildProcModule');
var Fork = require('fork');
//
// Specify retries and backoff (useful for network based operations);
//
var message = { action: 'start', whatever: 'blahblah' };

var fork = new Fork({
  path: childToFork,
  retries: 3,
  backoff: true})
  .on('error', function(err) { console.error(err) })
  .on('retry', function () { console.log('retrying')})
  .on('response', function (message) { console.dir(message) })
  .fork(message);

//
// You can also use a simple callback api on the `start`/`fork` method!
//
var fork2 = new Fork(childToFork).start(message,
  function(err, returnMessage) {
  if (err) {
    return console.error(err);
  }
  console.dir(returnMessage);
});

```

[child_process]: http://nodejs.org/api/child_process.html
[fork]: http://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options
[back]: https://github.com/jcrugzz/back
