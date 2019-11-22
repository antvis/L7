'use strict';

var allSettled = require('../');
var test = require('tape');
var runTests = require('./tests');

test('as a function', function (t) {
	t.test('bad Promise/this value', function (st) {
		st['throws'](function () { allSettled(undefined); }, TypeError, 'undefined is not an object');
		st['throws'](function () { allSettled(null); }, TypeError, 'null is not an object');
		st.end();
	});

	runTests(allSettled, t);

	t.end();
});
