'use strict';

var getPolyfill = require('./polyfill');
var shim = require('./shim');
var implementation = require('./implementation');

var bound = Function.call.bind(getPolyfill());

bound.shim = shim;
bound.getPolyfill = getPolyfill;
bound.implementation = implementation;

module.exports = bound;
