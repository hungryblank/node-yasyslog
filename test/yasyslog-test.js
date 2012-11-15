'use strict';

var syslog = require('../lib/node-yasyslog');
var buster = require('buster');
var dgram = require('dgram');

buster.testCase('Payload', {
  'should set priority': function() {
    assert.match(
      syslog.payload(syslog.FACILITIES.LOG_KERN, syslog.SEVERITIES.LOG_EMERG, 'name', 'myMessage'),
      /^<0>/
    );
    assert.match(
      syslog.payload(syslog.FACILITIES.LOG_USER, syslog.SEVERITIES.LOG_ALERT, 'name', 'myMessage'),
      /^<9>/
    );
  },
  'should contain a date': function() {
    assert.match(
      syslog.payload(syslog.FACILITIES.LOG_KERN, syslog.SEVERITIES.LOG_EMERG, 'name', 'myMessage'),
        /^<\d{1,2}>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{0,3}Z/
    );
  },
});

buster.testCase('Client', {
  setUp: function() {
    var port = 10514;
    this.client = new syslog.Client({port: port});
    this.listener = dgram.createSocket('udp4');
    this.listener.bind(port, '127.0.0.1');
  },
  tearDown: function() {
    this.client.close();
    this.listener.close();
  },
  'should deliver message': function(done) {
    var self = this;
    this.listener.on('message', function(message) {
      assert.match(message, /myMessage$/);
      done();
    });
    self.client.error('myMessage');
  },
});
