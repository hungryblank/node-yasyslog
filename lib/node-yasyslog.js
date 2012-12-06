'use strict';

var dgram = require('dgram');
var os = require('os');
var timestamp = require('./rfc3164timestamp');

var RFC3164 = 'RFC3164' in process.env || false;

var severities = {
  LOG_EMERG:   0, // system is unusable
  LOG_ALERT:   1, // action must be taken immediately
  LOG_CRIT:    2, // critical conditions
  LOG_ERROR:   3, // error conditions
  LOG_WARNING: 4, // warning conditions
  LOG_NOTICE:  5, // normal but significant condition
  LOG_INFO:    6, // informational
  LOG_DEBUG:   7  // debug-level messages
};

exports.SEVERITIES = severities;

var facilities = {
  LOG_KERN:   0 << 3,
  LOG_USER:   1 << 3,
  LOG_MAIL:   2 << 3,
  LOG_DAEMON: 3 << 3,
  LOG_AUTH:   4 << 3,
  LOG_SYSLOG: 5 << 3,
  LOG_LPR:    6 << 3,
  LOG_NEWS:   7 << 3,
  LOG_UUCP:   8 << 3,
  LOG_LOCAL0: 16 << 3,
  LOG_LOCAL1: 17 << 3,
  LOG_LOCAL2: 18 << 3,
  LOG_LOCAL3: 19 << 3,
  LOG_LOCAL4: 20 << 3,
  LOG_LOCAL5: 21 << 3,
  LOG_LOCAL6: 22 << 3,
  LOG_LOCAL7: 23 << 3,
};

exports.FACILITIES = facilities;

var hostname = os.hostname();

var payload = function(severity, facility, name, logMessage) {
  var messagePriority = '<' + (facility + severity) + '>';
  return messagePriority + [
    RFC3164 ? timestamp() : (new Date()).toISOString(),
    hostname,
    name,
    logMessage.trim()
  ].join(' ');
};

exports.payload = payload;

var defaults = {
  port: 514,
  host: '127.0.0.1',
  facility: facilities.LOG_USER
};

var Client = function(options) {
  this.options = options || {};
  if (! ('name' in this.options)) {
    this.options.name = process.title || process.argv.join(' ');
  }
  for (var k in defaults) {
    if (this.options[k] === undefined) {
      this.options[k] = defaults[k];
    }
  }
  this.host = this.options.host;
  this.port = this.options.port;
  this.name = this.options.name + '[' + process.pid + ']:';
  this.facility = this.options.facility;
  this.socket = dgram.createSocket('udp4');
};

Client.prototype.rawLog = function(severity, message, callback) {
  var buffer = new Buffer(payload(severity, this.facility, this.name, message), 'utf-8');
  this.socket.send(buffer, 0, buffer.length, this.port, this.host, callback);
};

Client.prototype.emerg = function(message, callback) {
  this.rawLog(severities.LOG_EMERG, message, callback);
};

Client.prototype.alert = function(message, callback) {
  this.rawLog(severities.LOG_ALERT, message, callback);
};

Client.prototype.crit = function(message, callback) {
  this.rawLog(severities.LOG_CRIT, message, callback);
};

Client.prototype.error = function(message, callback) {
  this.rawLog(severities.LOG_ERROR, message, callback);
};

Client.prototype.warning = function(message, callback) {
  this.rawLog(severities.LOG_WARNING, message, callback);
};

Client.prototype.notice = function(message, callback) {
  this.rawLog(severities.LOG_NOTICE, message, callback);
};

Client.prototype.info = function(message, callback) {
  this.rawLog(severities.LOG_INFO, message, callback);
};

Client.prototype.debug = function(message, callback) {
  this.rawLog(severities.LOG_DEBUG, message, callback);
};

Client.prototype.close = function() {
  this.socket.close();
};

exports.Client = Client;
