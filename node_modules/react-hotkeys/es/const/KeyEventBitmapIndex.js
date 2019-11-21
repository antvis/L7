/**
 * @typedef {Number} KeyEventBitmapIndex index (0-2) of which position in an event bitmap
 * a particular event is located
 */

/**
 * Enum for index values for KeyEventBitmaps
 * @readonly
 * @enum {KeyEventBitmapIndex}
 */
var KeyEventBitmapIndex = {
  keydown: 0,
  keypress: 1,
  keyup: 2
};
export default KeyEventBitmapIndex;