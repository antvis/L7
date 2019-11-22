"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.freeze");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.bold");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.SuccessIcon = exports.Fade = exports.TextInput = exports.Description = exports.GridWrapper = exports.Row = exports.GridHeaderRow = exports.HeaderItem = void 0;

require("regenerator-runtime/runtime");

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _theming = require("@storybook/theming");

var _reactHotkeys = require("react-hotkeys");

var _components = require("@storybook/components");

var _SettingsFooter = _interopRequireDefault(require("./SettingsFooter"));

var _shortcut = require("../libs/shortcut");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n0%,100% { opacity: 0; }\n  50% { opacity: 1; }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Button = _components.Form.Button,
    Input = _components.Form.Input;

var Header = _theming.styled.header(function (_ref) {
  var theme = _ref.theme;
  return {
    marginBottom: 20,
    fontSize: theme.typography.size.m3,
    fontWeight: theme.typography.weight.black,
    alignItems: 'center',
    display: 'flex'
  };
}); // Grid


var HeaderItem = _theming.styled.div(function (_ref2) {
  var theme = _ref2.theme;
  return {
    fontWeight: theme.typography.weight.bold
  };
});

exports.HeaderItem = HeaderItem;

var GridHeaderRow = _theming.styled.div({
  alignSelf: 'flex-end',
  display: 'grid',
  margin: '10px 0',
  gridTemplateColumns: '1fr 1fr 12px',
  '& > *:last-of-type': {
    gridColumn: '2 / 2',
    justifySelf: 'flex-end',
    gridRow: '1'
  }
});

exports.GridHeaderRow = GridHeaderRow;

var Row = _theming.styled.div(function (_ref3) {
  var theme = _ref3.theme;
  return {
    padding: '6px 0',
    borderTop: "1px solid ".concat(theme.appBorderColor),
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 0px'
  };
});

exports.Row = Row;

var GridWrapper = _theming.styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridAutoRows: 'minmax(auto, auto)',
  marginBottom: '20px'
}); // Form


exports.GridWrapper = GridWrapper;

var Description = _theming.styled.div({
  alignSelf: 'center'
});

exports.Description = Description;
var TextInput = (0, _theming.styled)(Input)(function (_ref4) {
  var valid = _ref4.valid,
      theme = _ref4.theme;
  return valid === 'error' ? {
    animation: "".concat(theme.animation.jiggle, " 700ms ease-out")
  } : {};
}, {
  display: 'flex',
  width: 80,
  flexDirection: 'column',
  justifySelf: 'flex-end',
  paddingLeft: 4,
  paddingRight: 4,
  textAlign: 'center'
});
exports.TextInput = TextInput;
var Fade = (0, _theming.keyframes)(_templateObject());
exports.Fade = Fade;
var SuccessIcon = (0, _theming.styled)(_components.Icons)(function (_ref5) {
  var valid = _ref5.valid,
      theme = _ref5.theme;
  return valid === 'valid' ? {
    color: theme.color.positive,
    animation: "".concat(Fade, " 2s ease forwards")
  } : {
    opacity: 0
  };
}, {
  alignSelf: 'center',
  display: 'flex',
  marginLeft: 10,
  height: 14,
  width: 14
});
exports.SuccessIcon = SuccessIcon;

var Container = _theming.styled.div(function (_ref6) {
  var theme = _ref6.theme;
  return {
    fontSize: theme.typography.size.s2,
    padding: "3rem 20px",
    maxWidth: 600,
    margin: '0 auto'
  };
});

var shortcutLabels = {
  fullScreen: 'Go full screen',
  togglePanel: 'Toggle addons',
  panelPosition: 'Toggle addons orientation',
  toggleNav: 'Toggle sidebar',
  toolbar: 'Toggle canvas toolbar',
  search: 'Focus search',
  focusNav: 'Focus sidebar',
  focusIframe: 'Focus canvas',
  focusPanel: 'Focus addons',
  prevComponent: 'Previous component',
  nextComponent: 'Next component',
  prevStory: 'Previous story',
  nextStory: 'Next story',
  shortcutsPage: 'Go to shortcuts page',
  aboutPage: 'Go to about page'
}; // Shortcuts that cannot be configured

var fixedShortcuts = ['escape'];

function toShortcutState(shortcutKeys) {
  return Object.entries(shortcutKeys).reduce(function (acc, _ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        feature = _ref8[0],
        shortcut = _ref8[1];

    return fixedShortcuts.includes(feature) ? acc : Object.assign({}, acc, _defineProperty({}, feature, {
      shortcut: shortcut,
      error: false
    }));
  }, {});
}

var keyMap = {
  CLOSE: 'escape'
};

var _ref17 =
/*#__PURE__*/
_react["default"].createElement(GridHeaderRow, null, _react["default"].createElement(HeaderItem, null, "Commands"), _react["default"].createElement(HeaderItem, null, "Shortcut"));

var _ref18 =
/*#__PURE__*/
_react["default"].createElement(_components.Icons, {
  icon: "close"
});

var _ref19 =
/*#__PURE__*/
_react["default"].createElement(Header, null, "Keyboard shortcuts");

var _ref20 =
/*#__PURE__*/
_react["default"].createElement(_SettingsFooter["default"], null);

var ShortcutsScreen =
/*#__PURE__*/
function (_Component) {
  _inherits(ShortcutsScreen, _Component);

  function ShortcutsScreen(props) {
    var _this;

    _classCallCheck(this, ShortcutsScreen);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ShortcutsScreen).call(this, props));

    _this.onKeyDown = function (e) {
      var _this$state = _this.state,
          activeFeature = _this$state.activeFeature,
          shortcutKeys = _this$state.shortcutKeys;

      if (e.key === 'Backspace') {
        return _this.restoreDefault();
      }

      var shortcut = (0, _shortcut.eventToShortcut)(e); // Keypress is not a potential shortcut

      if (!shortcut) {
        return false;
      } // Check we don't match any other shortucts


      var error = !!Object.entries(shortcutKeys).find(function (_ref9) {
        var _ref10 = _slicedToArray(_ref9, 2),
            feature = _ref10[0],
            existingShortcut = _ref10[1].shortcut;

        return feature !== activeFeature && existingShortcut && (0, _shortcut.shortcutMatchesShortcut)(shortcut, existingShortcut);
      });
      return _this.setState({
        shortcutKeys: Object.assign({}, shortcutKeys, _defineProperty({}, activeFeature, {
          shortcut: shortcut,
          error: error
        }))
      });
    };

    _this.onFocus = function (focusedInput) {
      return function () {
        var shortcutKeys = _this.state.shortcutKeys;

        _this.setState({
          activeFeature: focusedInput,
          shortcutKeys: Object.assign({}, shortcutKeys, _defineProperty({}, focusedInput, {
            shortcut: null,
            error: false
          }))
        });
      };
    };

    _this.onBlur =
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var _this$state2, shortcutKeys, activeFeature, _shortcutKeys$activeF, shortcut, error;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this$state2 = _this.state, shortcutKeys = _this$state2.shortcutKeys, activeFeature = _this$state2.activeFeature;

              if (!shortcutKeys[activeFeature]) {
                _context.next = 6;
                break;
              }

              _shortcutKeys$activeF = shortcutKeys[activeFeature], shortcut = _shortcutKeys$activeF.shortcut, error = _shortcutKeys$activeF.error;

              if (!(!shortcut || error)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", _this.restoreDefault());

            case 5:
              return _context.abrupt("return", _this.saveShortcut());

            case 6:
              return _context.abrupt("return", false);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    _this.saveShortcut =
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      var _this$state3, activeFeature, shortcutKeys, setShortcut;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _this$state3 = _this.state, activeFeature = _this$state3.activeFeature, shortcutKeys = _this$state3.shortcutKeys;
              setShortcut = _this.props.setShortcut;
              _context2.next = 4;
              return setShortcut(activeFeature, shortcutKeys[activeFeature].shortcut);

            case 4:
              _this.setState({
                successField: activeFeature
              });

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    _this.restoreDefaults =
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3() {
      var restoreAllDefaultShortcuts, defaultShortcuts;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              restoreAllDefaultShortcuts = _this.props.restoreAllDefaultShortcuts;
              _context3.next = 3;
              return restoreAllDefaultShortcuts();

            case 3:
              defaultShortcuts = _context3.sent;
              return _context3.abrupt("return", _this.setState({
                shortcutKeys: toShortcutState(defaultShortcuts)
              }));

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    _this.restoreDefault =
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4() {
      var _this$state4, activeFeature, shortcutKeys, restoreDefaultShortcut, defaultShortcut;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _this$state4 = _this.state, activeFeature = _this$state4.activeFeature, shortcutKeys = _this$state4.shortcutKeys;
              restoreDefaultShortcut = _this.props.restoreDefaultShortcut;
              _context4.next = 4;
              return restoreDefaultShortcut(activeFeature);

            case 4:
              defaultShortcut = _context4.sent;
              return _context4.abrupt("return", _this.setState({
                shortcutKeys: Object.assign({}, shortcutKeys, {}, toShortcutState(_defineProperty({}, activeFeature, defaultShortcut)))
              }));

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    _this.displaySuccessMessage = function (activeElement) {
      var _this$state5 = _this.state,
          successField = _this$state5.successField,
          shortcutKeys = _this$state5.shortcutKeys;
      return activeElement === successField && shortcutKeys[activeElement].error === false ? 'valid' : '';
    };

    _this.displayError = function (activeElement) {
      var _this$state6 = _this.state,
          activeFeature = _this$state6.activeFeature,
          shortcutKeys = _this$state6.shortcutKeys;
      return activeElement === activeFeature && shortcutKeys[activeElement].error === true ? 'error' : '';
    };

    _this.renderKeyInput = function () {
      var shortcutKeys = _this.state.shortcutKeys;
      var arr = Object.entries(shortcutKeys).map(function (_ref15) {
        var _ref16 = _slicedToArray(_ref15, 2),
            feature = _ref16[0],
            shortcut = _ref16[1].shortcut;

        return _react["default"].createElement(Row, {
          key: feature
        }, _react["default"].createElement(Description, null, shortcutLabels[feature]), _react["default"].createElement(TextInput, {
          spellCheck: "false",
          valid: _this.displayError(feature),
          className: "modalInput",
          onBlur: _this.onBlur,
          onFocus: _this.onFocus(feature),
          onKeyDown: _this.onKeyDown,
          value: shortcut ? (0, _shortcut.shortcutToHumanString)(shortcut) : '',
          placeholder: "Type keys",
          readOnly: true
        }), _react["default"].createElement(SuccessIcon, {
          valid: _this.displaySuccessMessage(feature),
          icon: "check"
        }));
      });
      return arr;
    };

    _this.renderKeyForm = function () {
      return _react["default"].createElement(GridWrapper, null, _ref17, _this.renderKeyInput());
    };

    _this.state = {
      activeFeature: '',
      successField: '',
      // The initial shortcutKeys that come from props are the defaults/what was saved
      // As the user interacts with the page, the state stores the temporary, unsaved shortcuts
      // This object also includes the error attached to each shortcut
      shortcutKeys: toShortcutState(props.shortcutKeys)
    };
    return _this;
  }

  _createClass(ShortcutsScreen, [{
    key: "render",
    value: function render() {
      var onClose = this.props.onClose;
      var layout = this.renderKeyForm();
      return _react["default"].createElement(_reactHotkeys.GlobalHotKeys, {
        handlers: {
          CLOSE: onClose
        },
        keyMap: keyMap
      }, _react["default"].createElement(_components.Tabs, {
        absolute: true,
        selected: "shortcuts",
        actions: {
          onSelect: function onSelect() {}
        },
        tools: _react["default"].createElement(_react.Fragment, null, _react["default"].createElement(_components.IconButton, {
          onClick: function onClick(e) {
            e.preventDefault();
            return onClose();
          }
        }, _ref18))
      }, _react["default"].createElement("div", {
        id: "shortcuts",
        title: "Keyboard Shortcuts"
      }, _react["default"].createElement(Container, null, _ref19, layout, _react["default"].createElement(Button, {
        tertiary: true,
        small: true,
        id: "restoreDefaultsHotkeys",
        onClick: this.restoreDefaults
      }, "Restore defaults"), _ref20))));
    }
  }]);

  return ShortcutsScreen;
}(_react.Component);

ShortcutsScreen.displayName = "ShortcutsScreen";
ShortcutsScreen.propTypes = {
  shortcutKeys: _propTypes["default"].shape({}).isRequired,
  // Need TS for this
  setShortcut: _propTypes["default"].func.isRequired,
  restoreDefaultShortcut: _propTypes["default"].func.isRequired,
  restoreAllDefaultShortcuts: _propTypes["default"].func.isRequired,
  onClose: _propTypes["default"].func.isRequired
};
var _default = ShortcutsScreen;
exports["default"] = _default;