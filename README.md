# fork

[![build
status](https://secure.travis-ci.org/jcrugzz/fork.png)](http://travis-ci.org/jcrugzz/fork)

A simple module that gives a clean `request`/`response` api for dealing with
a [`child_process`][child_process] that you want to [`fork`][fork]. It comes with built
in retry support using [`back`][back] for backoff to try and ensure determinism.
Works best when used with [`forkee`][forkee] for the child process.

## install

`npm install fork --save`

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
  .fork(message)
  .on('error', function(err) { console.error(err) })
  .on('retry', function () { console.log('retrying')})
  .on('response', function (message) { console.dir(message) });

//
// If the `forkee` child process sends an event, it gets emit on the `fork` instance.
// If the forkee instance sent a `website:fetched` message
//
fork.on('website:fetched', function (message) {
  // Do something with `message` object like log it or dispatch to an external
  // service
});

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
[forkee]: https://github.com/jcrugzz/forkee
