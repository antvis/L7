'use strict';

const arrayDiffer = (array, ...values) => {
	const rest = new Set([].concat(...values));
	return array.filter(x => !rest.has(x));
};

module.exports = arrayDiffer;
module.exports.default = arrayDiffer;
