const { forOwn, has, isPlainObject, set, size } = require('lodash');
const flat = require('flat');

class Deprecated {
  constructor(deprecations, input) {
    if (!isPlainObject(deprecations)) {
      throw new Error('Deprecations must a be plain object.');
    }
    if (!isPlainObject(input)) {
      throw new Error('Input must be a plain object.');
    }
    this.compare(flat(deprecations), input);
  }
  compare(deprecations, input) {
    const violations = {};
    const compliant = {};
    const iterator = (input, keys = []) => {
      if (size(input)) {
        forOwn(input, (value, key) => {
          const path = [...keys, key].join('.');
          if (path in deprecations) {
            if (typeof deprecations[path] === 'string') {
              set(compliant, deprecations[path], value);
              violations[path] = deprecations[path];
            } else if (deprecations[path] === null) {
              violations[path] = deprecations[path];
            }
          } else {
            if (isPlainObject(value)) {
              iterator(value, [...keys, key]);
            } else {
              set(compliant, [...keys, key], value);
            }
          }
        });
      } else if(!has(compliant, keys)) {
        set(compliant, keys, {});
      }
    };
    iterator(input);
    this.compliant = compliant;
    this.violations = violations;
  }
  getCompliant() {
    return this.compliant;
  }
  getViolations() {
    return this.violations;
  }
}

module.exports = Deprecated;
