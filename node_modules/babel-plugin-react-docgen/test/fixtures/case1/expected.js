"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.TOUCHSTART_TIMEOUT = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactAddonsShallowCompare = _interopRequireDefault(require("react-addons-shallow-compare"));

var _reactMomentProptypes = _interopRequireDefault(require("react-moment-proptypes"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TOUCHSTART_TIMEOUT = 200;
exports.TOUCHSTART_TIMEOUT = TOUCHSTART_TIMEOUT;
var propTypes = {
  day: _reactMomentProptypes["default"].momentObj,
  modifiers: _react.PropTypes.arrayOf(_react.PropTypes.string),
  onDayClick: _react.PropTypes.func,
  onDayMouseDown: _react.PropTypes.func,
  onDayMouseUp: _react.PropTypes.func,
  onDayMouseEnter: _react.PropTypes.func,
  onDayMouseLeave: _react.PropTypes.func,
  onDayTouchStart: _react.PropTypes.func,
  onDayTouchEnd: _react.PropTypes.func,
  onDayTouchTap: _react.PropTypes.func,
  'hypen-dash': _react.PropTypes.string
};
var defaultProps = {
  day: (0, _moment["default"])(),
  modifiers: [],
  onDayClick: function onDayClick() {},
  onDayMouseDown: function onDayMouseDown() {},
  onDayMouseUp: function onDayMouseUp() {},
  onDayMouseEnter: function onDayMouseEnter() {},
  onDayMouseLeave: function onDayMouseLeave() {},
  onDayTouchStart: function onDayTouchStart() {},
  onDayTouchEnd: function onDayTouchEnd() {},
  onDayTouchTap: function onDayTouchTap() {},
  'hypen-dash': 'hello'
};

var CalendarDay =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CalendarDay, _React$Component);

  function CalendarDay(props) {
    var _this;

    _classCallCheck(this, CalendarDay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CalendarDay).call(this, props));
    _this.hasActiveTouchStart = false;
    return _this;
  }

  _createClass(CalendarDay, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return (0, _reactAddonsShallowCompare["default"])(this, nextProps, nextState);
    }
    /**
     * Some description about how handleDayClick works
     * @param  {Object} day this is a moment js object
     * @param  {number|string} modifiers hello world
     * @param  {number=} e events yo
     * @return {*} wut return
     */

  }, {
    key: "handleDayClick",
    value: function handleDayClick(day, modifiers, e) {
      this.props.onDayClick(day, modifiers, e);
    }
  }, {
    key: "handleDayMouseDown",
    value: function handleDayMouseDown(day, modifiers, e) {
      this.props.onDayMouseDown(day, modifiers, e);
    }
  }, {
    key: "handleDayMouseUp",
    value: function handleDayMouseUp(day, modifiers, e) {
      this.props.onDayMouseUp(day, modifiers, e);
    }
  }, {
    key: "handleDayMouseEnter",
    value: function handleDayMouseEnter(day, modifiers, e) {
      this.props.onDayMouseEnter(day, modifiers, e);
    }
  }, {
    key: "handleDayMouseLeave",
    value: function handleDayMouseLeave(day, modifiers, e) {
      this.props.onDayMouseLeave(day, modifiers, e);
    }
  }, {
    key: "handleDayTouchStart",
    value: function handleDayTouchStart(day, modifiers, e) {
      var _this2 = this;

      this.hasActiveTouchStart = true;
      setTimeout(function () {
        _this2.hasActiveTouchStart = false;
      }, TOUCHSTART_TIMEOUT);
      this.props.onDayTouchStart(day, modifiers, e);
    }
  }, {
    key: "handleDayTouchEnd",
    value: function handleDayTouchEnd(day, modifiers, e) {
      if (this.hasActiveTouchStart) {
        this.hasActiveTouchStart = false;
        this.handleDayTouchTap(day, modifiers, e);
      }

      this.props.onDayTouchEnd(day, modifiers, e);
    }
  }, {
    key: "handleDayTouchTap",
    value: function handleDayTouchTap(day, modifiers, e) {
      this.props.onDayTouchTap(day, modifiers, e);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          day = _this$props.day,
          modifiers = _this$props.modifiers;
      return _react["default"].createElement("div", {
        className: "CalendarDay",
        onMouseEnter: function onMouseEnter(e) {
          return _this3.handleDayMouseEnter(day, modifiers, e);
        },
        onMouseLeave: function onMouseLeave(e) {
          return _this3.handleDayMouseLeave(day, modifiers, e);
        },
        onMouseDown: function onMouseDown(e) {
          return _this3.handleDayMouseDown(day, modifiers, e);
        },
        onMouseUp: function onMouseUp(e) {
          return _this3.handleDayMouseUp(day, modifiers, e);
        },
        onClick: function onClick(e) {
          return _this3.handleDayClick(day, modifiers, e);
        },
        onTouchStart: function onTouchStart(e) {
          return _this3.handleDayTouchStart(day, modifiers, e);
        },
        onTouchEnd: function onTouchEnd(e) {
          return _this3.handleDayTouchEnd(day, modifiers, e);
        }
      }, _react["default"].createElement("span", {
        className: "CalendarDay__day"
      }, day.format('D')));
    }
  }]);

  return CalendarDay;
}(_react["default"].Component);

exports["default"] = CalendarDay;
CalendarDay.propTypes = propTypes;
CalendarDay.defaultProps = defaultProps;
CalendarDay.__docgenInfo = {
  "description": "",
  "methods": [{
    "name": "handleDayClick",
    "docblock": "Some description about how handleDayClick works\n@param  {Object} day this is a moment js object\n@param  {number|string} modifiers hello world\n@param  {number=} e events yo\n@return {*} wut return",
    "modifiers": [],
    "params": [{
      "name": "day",
      "description": "this is a moment js object",
      "type": {
        "name": "Object"
      },
      "optional": false
    }, {
      "name": "modifiers",
      "description": "hello world",
      "type": {
        "name": "union",
        "elements": [{
          "name": "number"
        }, {
          "name": "string"
        }]
      },
      "optional": false
    }, {
      "name": "e",
      "description": "events yo",
      "type": {
        "name": "number"
      },
      "optional": true
    }],
    "returns": {
      "description": "wut return",
      "type": {
        "name": "mixed"
      }
    },
    "description": "Some description about how handleDayClick works"
  }, {
    "name": "handleDayMouseDown",
    "docblock": null,
    "modifiers": [],
    "params": [{
      "name": "day",
      "type": null
    }, {
      "name": "modifiers",
      "type": null
    }, {
      "name": "e",
      "type": null
    }],
    "returns": null
  }, {
    "name": "handleDayMouseUp",
    "docblock": null,
    "modifiers": [],
    "params": [{
      "name": "day",
      "type": null
    }, {
      "name": "modifiers",
      "type": null
    }, {
      "name": "e",
      "type": null
    }],
    "returns": null
  }, {
    "name": "handleDayMouseEnter",
    "docblock": null,
    "modifiers": [],
    "params": [{
      "name": "day",
      "type": null
    }, {
      "name": "modifiers",
      "type": null
    }, {
      "name": "e",
      "type": null
    }],
    "returns": null
  }, {
    "name": "handleDayMouseLeave",
    "docblock": null,
    "modifiers": [],
    "params": [{
      "name": "day",
      "type": null
    }, {
      "name": "modifiers",
      "type": null
    }, {
      "name": "e",
      "type": null
    }],
    "returns": null
  }, {
    "name": "handleDayTouchStart",
    "docblock": null,
    "modifiers": [],
    "params": [{
      "name": "day",
      "type": null
    }, {
      "name": "modifiers",
      "type": null
    }, {
      "name": "e",
      "type": null
    }],
    "returns": null
  }, {
    "name": "handleDayTouchEnd",
    "docblock": null,
    "modifiers": [],
    "params": [{
      "name": "day",
      "type": null
    }, {
      "name": "modifiers",
      "type": null
    }, {
      "name": "e",
      "type": null
    }],
    "returns": null
  }, {
    "name": "handleDayTouchTap",
    "docblock": null,
    "modifiers": [],
    "params": [{
      "name": "day",
      "type": null
    }, {
      "name": "modifiers",
      "type": null
    }, {
      "name": "e",
      "type": null
    }],
    "returns": null
  }],
  "displayName": "CalendarDay",
  "props": {
    "day": {
      "defaultValue": {
        "value": "moment()",
        "computed": true
      },
      "type": {
        "name": "custom",
        "raw": "momentPropTypes.momentObj"
      },
      "required": false,
      "description": ""
    },
    "modifiers": {
      "defaultValue": {
        "value": "[]",
        "computed": false
      },
      "type": {
        "name": "arrayOf",
        "value": {
          "name": "string"
        }
      },
      "required": false,
      "description": ""
    },
    "onDayClick": {
      "defaultValue": {
        "value": "function() {}",
        "computed": false
      },
      "type": {
        "name": "func"
      },
      "required": false,
      "description": ""
    },
    "onDayMouseDown": {
      "defaultValue": {
        "value": "function() {}",
        "computed": false
      },
      "type": {
        "name": "func"
      },
      "required": false,
      "description": ""
    },
    "onDayMouseUp": {
      "defaultValue": {
        "value": "function() {}",
        "computed": false
      },
      "type": {
        "name": "func"
      },
      "required": false,
      "description": ""
    },
    "onDayMouseEnter": {
      "defaultValue": {
        "value": "function() {}",
        "computed": false
      },
      "type": {
        "name": "func"
      },
      "required": false,
      "description": ""
    },
    "onDayMouseLeave": {
      "defaultValue": {
        "value": "function() {}",
        "computed": false
      },
      "type": {
        "name": "func"
      },
      "required": false,
      "description": ""
    },
    "onDayTouchStart": {
      "defaultValue": {
        "value": "function() {}",
        "computed": false
      },
      "type": {
        "name": "func"
      },
      "required": false,
      "description": ""
    },
    "onDayTouchEnd": {
      "defaultValue": {
        "value": "function() {}",
        "computed": false
      },
      "type": {
        "name": "func"
      },
      "required": false,
      "description": ""
    },
    "onDayTouchTap": {
      "defaultValue": {
        "value": "function() {}",
        "computed": false
      },
      "type": {
        "name": "func"
      },
      "required": false,
      "description": ""
    },
    "hypen-dash": {
      "defaultValue": {
        "value": "'hello'",
        "computed": false
      },
      "type": {
        "name": "string"
      },
      "required": false,
      "description": ""
    }
  }
};

if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
  STORYBOOK_REACT_CLASSES["test/fixtures/case1/actual.js"] = {
    name: "CalendarDay",
    docgenInfo: CalendarDay.__docgenInfo,
    path: "test/fixtures/case1/actual.js"
  };
}
