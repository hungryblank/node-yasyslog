'use strict';

var months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

function pad(number, prefix) {
  if (!prefix) prefix = '0';
  return (number < 10) ? (prefix + number) : number;
}

module.exports = timestamp;
function timestamp(date) {
  if (!date) date = new Date();
  var month = months[date.getMonth()];
  var day = pad(date.getDate(), ' ');
  var seconds = pad(date.getSeconds());
  var minutes = pad(date.getMinutes());
  var hours = pad(date.getHours());
  return month + ' ' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}
