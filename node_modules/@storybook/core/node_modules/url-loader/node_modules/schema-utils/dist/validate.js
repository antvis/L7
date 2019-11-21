"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ajv = _interopRequireDefault(require("ajv"));

var _ajvKeywords = _interopRequireDefault(require("ajv-keywords"));

var _absolutePath = _interopRequireDefault(require("./keywords/absolutePath"));

var _ValidationError = _interopRequireDefault(require("./ValidationError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ajv = new _ajv.default({
  allErrors: true,
  verbose: true,
  $data: true
});
(0, _ajvKeywords.default)(ajv, ['instanceof', 'formatMinimum', 'formatMaximum', 'patternRequired']); // Custom keywords

(0, _absolutePath.default)(ajv);

function validate(schema, options, configuration = {}) {
  let errors = [];

  if (Array.isArray(options)) {
    errors = Array.from(options).map(nestedOptions => validateObject(schema, nestedOptions));
    errors.forEach((list, idx) => {
      const applyPrefix = error => {
        // eslint-disable-next-line no-param-reassign
        error.dataPath = `[${idx}]${error.dataPath}`;

        if (error.children) {
          error.children.forEach(applyPrefix);
        }
      };

      list.forEach(applyPrefix);
    });
    errors = errors.reduce((arr, items) => arr.concat(items), []);
  } else {
    errors = validateObject(schema, options);
  }

  if (errors.length > 0) {
    throw new _ValidationError.default(errors, schema, configuration);
  }

  return errors;
}

function validateObject(schema, options) {
  const compiledSchema = ajv.compile(schema);
  const valid = compiledSchema(options);
  return valid ? [] : filterErrors(compiledSchema.errors);
}

function filterErrors(errors) {
  let newErrors = [];

  for (const error of errors) {
    const {
      dataPath
    } = error;
    let children = [];
    newErrors = newErrors.filter(oldError => {
      if (oldError.dataPath.includes(dataPath)) {
        if (oldError.children) {
          children = children.concat(oldError.children.slice(0));
        } // eslint-disable-next-line no-undefined, no-param-reassign


        oldError.children = undefined;
        children.push(oldError);
        return false;
      }

      return true;
    });

    if (children.length) {
      error.children = children;
    }

    newErrors.push(error);
  }

  return newErrors;
}

var _default = validate;
exports.default = _default;