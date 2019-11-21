var Rx = require('rx');
var fs = require('fs');
var read = Rx.Observable.fromNodeCallback(fs.readFile);

module.exports = read;
