'use strict';

var ES = require('es-abstract/es2019');

module.exports = function flatMap(mapperFunction) {
	var O = ES.ToObject(this);
	var sourceLen = ES.ToLength(ES.Get(O, 'length'));

	if (!ES.IsCallable(mapperFunction)) {
		throw new TypeError('mapperFunction must be a function');
	}

	var T;
	if (arguments.length > 1) {
		T = arguments[1];
	}

	var A = ES.ArraySpeciesCreate(O, 0);
	ES.FlattenIntoArray(A, O, sourceLen, 0, 1, mapperFunction, T);
	return A;
};
