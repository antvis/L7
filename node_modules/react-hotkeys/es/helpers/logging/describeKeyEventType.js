/**
 * Returns the name of the event at a specified event bitmap index
 * @param {KeyEventBitmapIndex} eventBitmapIndex
 * @returns {KeyEventName} Name of the key event
 */
function describeKeyEventType(eventBitmapIndex) {
  switch (parseInt(eventBitmapIndex, 10)) {
    case 0:
      return 'keydown';

    case 1:
      return 'keypress';

    default:
      return 'keyup';
  }
}

export default describeKeyEventType;