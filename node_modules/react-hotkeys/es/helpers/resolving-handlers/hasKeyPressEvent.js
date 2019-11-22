import KeysWithoutPressEventDictionary from '../../const/KeysWithoutPressEventDictionary';
/**
 * Whether the specified key name is for a key that has a native keypress event
 * @param {NormalizedKeyName} keyName Name of the key
 * @returns {Boolean} Whether the key has a native keypress event
 */

function hasKeyPressEvent(keyName) {
  return !KeysWithoutPressEventDictionary[keyName];
}

export default hasKeyPressEvent;