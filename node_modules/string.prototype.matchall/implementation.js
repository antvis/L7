'use strict';

var ES = require('es-abstract/es2019');
var callBound = require('es-abstract/helpers/callBound');
var hasSymbols = require('has-symbols')();
var flagsGetter = require('regexp.prototype.flags');

var $indexOf = callBound('String.prototype.indexOf');

var regexpMatchAllPolyfill = require('./polyfill-regexp-matchall');

var getMatcher = function getMatcher(regexp) { // eslint-disable-line consistent-return
	var matcherPolyfill = regexpMatchAllPolyfill();
	if (hasSymbols && typeof Symbol.matchAll === 'symbol') {
		var matcher = ES.GetMethod(regexp, Symbol.matchAll);
		if (matcher === RegExp.prototype[Symbol.matchAll] && matcher !== matcherPolyfill) {
			return matcherPolyfill;
		}
		return matcher;
	}
	// fallback for pre-Symbol.matchAll environments
	if (ES.IsRegExp(regexp)) {
		return matcherPolyfill;
	}
};

module.exports = function matchAll(regexp) {
	var O = ES.RequireObjectCoercible(this);

	if (typeof regexp !== 'undefined' && regexp !== null) {
		var isRegExp = ES.IsRegExp(regexp);
		if (isRegExp) {
			// workaround for older engines that lack RegExp.prototype.flags
			var flags = 'flags' in regexp ? ES.Get(regexp, 'flags') : flagsGetter(regexp);
			ES.RequireObjectCoercible(flags);
			if ($indexOf(ES.ToString(flags), 'g') < 0) {
				throw new TypeError('matchAll requires a non-global regular expression');
			}
		}

		var matcher = getMatcher(regexp);
		if (typeof matcher !== 'undefined') {
			return ES.Call(matcher, regexp, [O]);
		}
	}

	var S = ES.ToString(O);
	// var rx = ES.RegExpCreate(regexp, 'g');
	var rx = new RegExp(regexp, 'g');
	return ES.Call(getMatcher(rx), rx, [S]);
};
