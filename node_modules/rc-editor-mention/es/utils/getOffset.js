export default function getOffset(element, container) {
  var rect = element.getBoundingClientRect();
  if (rect.width || rect.height) {
    var elementContainer = container || element.parentElement;
    return {
      top: rect.top - elementContainer.clientTop,
      left: rect.left - elementContainer.clientLeft
    };
  }
  return rect;
}