import describeKeyEventType from './describeKeyEventType';

function describeKeyEvent(event, keyName, keyEventBitmapIndex) {
  var eventDescription = "'".concat(keyName, "' ").concat(describeKeyEventType(keyEventBitmapIndex));

  if (event.simulated) {
    return "(simulated) ".concat(eventDescription);
  }

  return eventDescription;
}

export default describeKeyEvent;