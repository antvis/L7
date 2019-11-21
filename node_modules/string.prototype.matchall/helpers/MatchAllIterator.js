'use strict';

var ES = require('es-abstract/es2019');
var flagsGetter = require('regexp.prototype.flags');

var RegExpStringIterator = require('./RegExpStringIterator');
var OrigRegExp = RegExp;

module.exports = function MatchAllIterator(R, O) {
	var S = ES.ToString(O);

	var matcher, global, fullUnicode, flags;
	if (ES.IsRegExp(R)) {
		var C = ES.SpeciesConstructor(R, OrigRegExp);
		flags = ES.Get(R, 'flags');
		if (typeof flags === 'string') {
			matcher = new C(R, flags); // ES.Construct(C, [R, flags]);
		} else if (C === OrigRegExp) {
			// workaround for older engines that lack RegExp.prototype.flags
			matcher = new C(R.source, flagsGetter(R)); // ES.Construct(C, [R.source, flagsGetter(R)]);
		} else {
			matcher = new C(R, flagsGetter(R)); // ES.Construct(C, [R, flagsGetter(R)]);
		}
		global = ES.ToBoolean(ES.Get(matcher, 'global'));
		fullUnicode = ES.ToBoolean(ES.Get(matcher, 'unicode'));
		var lastIndex = ES.ToLength(ES.Get(R, 'lastIndex'));
		ES.Set(matcher, 'lastIndex', lastIndex, true);
	} else {
		flags = 'g';
		matcher = new OrigRegExp(R, flags);
		global = true;
		fullUnicode = false;
		if (ES.Get(matcher, 'lastIndex') !== 0) {
			throw new TypeError('Assertion failed: newly constructed RegExp had a lastIndex !== 0. Please report this!');
		}
	}
	return new RegExpStringIterator(matcher, S, global, fullUnicode);
};
