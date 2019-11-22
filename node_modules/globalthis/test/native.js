'use strict';

var test = require('tape');
var defineProperties = require('define-properties');
var isEnumerable = Object.prototype.propertyIsEnumerable;

var runTests = require('./tests');

test('native', function (t) {
	t.equal(typeof global, 'object', 'global is an object');
	t.equal(global in global, true, 'global is in global');

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(global, 'global'), 'global is not enumerable');
		et.end();
	});

	runTests(global, t);

	t.end();
});
