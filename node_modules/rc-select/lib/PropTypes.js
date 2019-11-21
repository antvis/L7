"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var PropTypes = _interopRequireWildcard(require("prop-types"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function propsValueType() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var props = args[0],
      propName = args[1],
      componentName = args[2],
      rest = args.slice(3);
  var basicType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
  var labelInValueShape = PropTypes.shape({
    key: basicType.isRequired,
    label: PropTypes.node
  });

  if (props.labelInValue) {
    var validate = PropTypes.oneOfType([PropTypes.arrayOf(labelInValueShape), labelInValueShape]);
    var error = validate.apply(void 0, [props, propName, componentName].concat(_toConsumableArray(rest)));

    if (error) {
      return new Error("Invalid prop `".concat(propName, "` supplied to `").concat(componentName, "`, ") + "when you set `labelInValue` to `true`, `".concat(propName, "` should in ") + "shape of `{ key: string | number, label?: ReactNode }`.");
    }
  } else if ((props.mode === 'multiple' || props.mode === 'tags' || props.multiple || props.tags) && props[propName] === '') {
    return new Error("Invalid prop `".concat(propName, "` of type `string` supplied to `").concat(componentName, "`, ") + "expected `array` when `multiple` or `tags` is `true`.");
  } else {
    var _validate = PropTypes.oneOfType([PropTypes.arrayOf(basicType), basicType]);

    return _validate.apply(void 0, [props, propName, componentName].concat(_toConsumableArray(rest)));
  }

  return null;
}

var SelectPropTypes = {
  id: PropTypes.string,
  defaultActiveFirstOption: PropTypes.bool,
  multiple: PropTypes.bool,
  filterOption: PropTypes.any,
  children: PropTypes.any,
  showSearch: PropTypes.bool,
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  showArrow: PropTypes.bool,
  tags: PropTypes.bool,
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  transitionName: PropTypes.string,
  optionLabelProp: PropTypes.string,
  optionFilterProp: PropTypes.string,
  animation: PropTypes.string,
  choiceTransitionName: PropTypes.string,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  onSearch: PropTypes.func,
  onPopupScroll: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onInputKeyDown: PropTypes.func,
  placeholder: PropTypes.any,
  onDeselect: PropTypes.func,
  labelInValue: PropTypes.bool,
  loading: PropTypes.bool,
  value: propsValueType,
  defaultValue: propsValueType,
  dropdownStyle: PropTypes.object,
  maxTagTextLength: PropTypes.number,
  maxTagCount: PropTypes.number,
  maxTagPlaceholder: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  tokenSeparators: PropTypes.arrayOf(PropTypes.string),
  getInputElement: PropTypes.func,
  showAction: PropTypes.arrayOf(PropTypes.string),
  clearIcon: PropTypes.node,
  inputIcon: PropTypes.node,
  removeIcon: PropTypes.node,
  menuItemSelectedIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dropdownRender: PropTypes.func
};
var _default = SelectPropTypes;
exports["default"] = _default;