# Node Yet Another Syslog

Node module to work with system log `syslog` daemon on unix systems.

At the moment only the UDP transport is implemented

## Motivation

Have a pure node syslog module with no native extensions

## Usage

```js
var syslog = require('yasyslog');

//plain and simple, log on LOG_USER localhost
var client= new syslog.Client();

client.info('this is an info level log entry');

// sample with some custom configuration
var clientSeven = new syslog.Client({
  host: '192.168.0.1',
  port: 5541,
  facility: syslog.FACILITIES.LOG_LOCAL7
})

clientSeven.emerg('this is an emergency');

//logging to an arbitrary severity

clientSeven.rawLog(syslog.SEVERITIES.LOG_CRIT, 'critical condition');
```

## Credits

This project uses code from
- https://github.com/cloudhead/node-syslog
- https://github.com/cboebel/NodeSyslogUDP
