"use strict";

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.get-own-property-descriptor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddonPanel = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var usePrevious = function usePrevious(value) {
  var ref = (0, _react.useRef)();
  (0, _react.useEffect)(function () {
    // happens after return
    ref.current = value;
  }, [value]);
  return ref.current;
};

var useUpdate = function useUpdate(update, value) {
  var previousValue = usePrevious(value);
  return update ? value : previousValue;
};

var AddonPanel = function AddonPanel(_ref) {
  var active = _ref.active,
      children = _ref.children;
  return (// the transform is to prevent a bug where the content would be invisible
    // the hidden attribute is an valid html element that's both accessible and works to visually hide content
    _react["default"].createElement("div", {
      hidden: !active,
      style: {
        transform: 'translateX(0px)'
      }
    }, useUpdate(active, children))
  );
};

exports.AddonPanel = AddonPanel;
AddonPanel.displayName = "AddonPanel";