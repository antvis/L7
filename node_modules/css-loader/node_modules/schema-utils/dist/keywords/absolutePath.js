"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function errorMessage(schema, data, message) {
  return {
    keyword: 'absolutePath',
    params: {
      absolutePath: data
    },
    message,
    parentSchema: schema
  };
}

function getErrorFor(shouldBeAbsolute, data, schema) {
  const message = shouldBeAbsolute ? `The provided value ${JSON.stringify(data)} is not an absolute path!` : `A relative path is expected. However, the provided value ${JSON.stringify(data)} is an absolute path!`;
  return errorMessage(schema, data, message);
}

var _default = ajv => ajv.addKeyword('absolutePath', {
  errors: true,
  type: 'string',

  compile(expected, schema) {
    function callback(data) {
      let passes = true;
      const isExclamationMarkPresent = data.includes('!');
      const isCorrectAbsoluteOrRelativePath = expected === /^(?:[A-Za-z]:\\|\/)/.test(data);

      if (isExclamationMarkPresent) {
        callback.errors = [errorMessage(schema, data, `The provided value ${JSON.stringify(data)} contains exclamation mark (!) which is not allowed because it's reserved for loader syntax.`)];
        passes = false;
      }

      if (!isCorrectAbsoluteOrRelativePath) {
        callback.errors = [getErrorFor(expected, data, schema)];
        passes = false;
      }

      return passes;
    }

    callback.errors = [];
    return callback;
  }

});

exports.default = _default;