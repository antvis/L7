import * as React from 'react'; // eslint-disable-next-line import/prefer-default-export

export function cloneElement(element) {
  if (!React.isValidElement(element)) return element;

  for (var _len = arguments.length, restArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    restArgs[_key - 1] = arguments[_key];
  }

  return React.cloneElement.apply(React, [element].concat(restArgs));
}
//# sourceMappingURL=reactNode.js.map
