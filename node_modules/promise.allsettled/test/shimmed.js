'use strict';

var allSettled = require('../');
allSettled.shim();

var test = require('tape');

var runTests = require('./builtin');

test('shimmed', function (t) {
	runTests(t);

	t.end();
});
