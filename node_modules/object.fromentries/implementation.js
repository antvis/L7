'use strict';

var ES = require('es-abstract/es2019');

var adder = function addDataProperty(key, value) {
	var O = this; // eslint-disable-line no-invalid-this
	var propertyKey = ES.ToPropertyKey(key);
	ES.CreateDataPropertyOrThrow(O, propertyKey, value);
};

var legacyAssign = function assign(obj, entries) {
	for (var i = 0; i < entries.length; ++i) {
		var entry = entries[i];
		if (ES.Type(entry) !== 'Object') {
			throw new TypeError('iterator returned a non-object; entry expected');
		}

		var key = ES.Get(entry, '0');
		var value = ES.Get(entry, '1');
		var propertyKey = ES.ToPropertyKey(key);
		ES.CreateDataPropertyOrThrow(obj, propertyKey, value);
	}
};

var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

module.exports = function fromEntries(iterable) {
	ES.RequireObjectCoercible(iterable);

	var obj = {};

	// this part isn't in the spec, it's for a reasonable fallback for pre-ES6 environments
	if (!hasSymbols) {
		if (!ES.IsArray(iterable)) {
			throw new TypeError('this environment lacks native Symbols, and can not support non-Array iterables');
		}
		legacyAssign(obj, iterable);
		return obj;
	}

	return ES.AddEntriesFromIterable(obj, iterable, adder);
};
