
var EE = require('events').EventEmitter;
var util = require('util');
var cp = require('child_process');
var back = require('back');

module.exports = Fork;

util.inherits(Fork, EE);

//
// Here we accept the fullPath of the process we are going to
// fork and the options object to pass to it. The only conventions we will use
// here is an error message property if something within the child_process goes
// wrong but it is not completely fatal
//
function Fork(options) {
  if (!(this instanceof Fork)) return new Fork(options);
  EE.call(this);
  options = options || {};

  this.path = typeof options != 'string'
    ? options.path
    : options;

  if (!this.path) {
    throw new Error('Must provide a path to process to fork');
  }
  this.retries = options.retries || 0;
  this.backoff = options.backoff || false;
  this.killTimer = options.killTimer || 100;
  //
  // Use a boolean and hack the setTimeout delay in order to make
  // the backoff optional
  //
  this.attempt = {};
  this.attempt.retries = this.retries;
  this.attempt.minDelay = options.backoff ? false : 1;
  this.attempt.maxDelay = options.backoff ? false : 1;
  //
  // Remark: This is the path to the process we are forking
  //
  this.returned = false;

  this._retry = this.retries != 0;
  return this;
}

Fork.prototype.start =
Fork.prototype.fork = function (message, callback) {

  this.message = this.message || message;
  if (callback && typeof callback == 'function') {
    this._callback = callback;
  }
  //
  // Fork Process
  //
  this.process = cp.fork(this.path);
  //
  // Setup the listeners
  //
  this.process.on('error', this.onError.bind(this));
  this.process.on('exit', this.onExit.bind(this));
  this.process.on('message', this.onMessage.bind(this));

  this.process.send(this.message);
  return this;
};

Fork.prototype.onMessage = function (message) {
  this.returned = true;
  if (message.error) {
    return this.onError(message.error);
  }
  return !this._callback
    ? this.emit('response', message)
    : this._callback(null, message);
};

Fork.prototype.onExit = function (code, signal) {
  if (!this.returned) {
    code = code || signal;
    return this.onError(new Error('Child process exited with code ' + code));
  }
};
//
// We always cleanup and retry if configured to do so
//
Fork.prototype.onError = function (err) {
  this.cleanup();
  return this._retry
    ? this.retry(err)
    : this.dispatchError(err);
};

Fork.prototype.retry = function (err) {
  return back(function (fail) {
    if (fail) {
      return this.dispatchError(err);
    }
    this.emit('retry', this.attempt);
    this.fork();
  }.bind(this), this.attempt);
}

Fork.prototype.dispatchError = function (err) {
  return !this._callback
    ? this.emit('error', err)
    : this._callback(err)
}

//
// TODO: We should be durable here and ensure the process gets killed
//
Fork.prototype.cleanup = function () {
  this.process.disconnect();
  this.returned = false;
  //
  // Hmm should we just kill the process instead?
  //

};

