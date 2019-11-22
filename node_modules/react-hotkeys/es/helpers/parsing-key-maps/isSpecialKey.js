import SpecialKeysDictionary from '../../const/SpecialKeysDictionary';
/**
 * Whether the specified key is a valid key name that is not a single character or
 * symbol
 * @param {ReactKeyName} key Name of the key
 * @returns {boolean} Whether the key is a valid special key
 */

function isSpecialKey(key) {
  return !!SpecialKeysDictionary[key];
}

export default isSpecialKey;