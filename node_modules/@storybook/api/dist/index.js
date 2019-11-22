"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.create");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-prototype-of");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.set-prototype-of");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStorybookState = useStorybookState;
exports.useStorybookApi = useStorybookApi;
exports.useAddonState = useAddonState;
exports.useParameter = useParameter;
Object.defineProperty(exports, "ChannelListener", {
  enumerable: true,
  get: function get() {
    return _channels.Listener;
  }
});
Object.defineProperty(exports, "StoreOptions", {
  enumerable: true,
  get: function get() {
    return _store.Options;
  }
});
exports.useChannel = exports.Provider = exports.Consumer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _memoizerific = _interopRequireDefault(require("memoizerific"));

var _objects = _interopRequireDefault(require("shallow-equal/objects"));

var _coreEvents = _interopRequireDefault(require("@storybook/core-events"));

var _channels = require("@storybook/channels");

var _initProviderApi = _interopRequireDefault(require("./init-provider-api"));

var _context = require("./context");

var _store = _interopRequireWildcard(require("./store"));

var _initialState = _interopRequireDefault(require("./initial-state"));

var _addons = _interopRequireDefault(require("./modules/addons"));

var _channel = _interopRequireDefault(require("./modules/channel"));

var _notifications = _interopRequireDefault(require("./modules/notifications"));

var _stories = _interopRequireDefault(require("./modules/stories"));

var _layout = _interopRequireDefault(require("./modules/layout"));

var _shortcuts = _interopRequireDefault(require("./modules/shortcuts"));

var _url = _interopRequireDefault(require("./modules/url"));

var _versions = _interopRequireDefault(require("./modules/versions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ManagerContext = (0, _context.createContext)({
  api: undefined,
  state: (0, _initialState["default"])({})
});
var STORY_CHANGED = _coreEvents["default"].STORY_CHANGED,
    SET_STORIES = _coreEvents["default"].SET_STORIES,
    SELECT_STORY = _coreEvents["default"].SELECT_STORY;

var ManagerProvider =
/*#__PURE__*/
function (_Component) {
  _inherits(ManagerProvider, _Component);

  function ManagerProvider(props) {
    var _this;

    _classCallCheck(this, ManagerProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ManagerProvider).call(this, props));
    _this.api = void 0;
    _this.modules = void 0;
    var provider = props.provider,
        location = props.location,
        path = props.path,
        _props$viewMode = props.viewMode,
        viewMode = _props$viewMode === void 0 ? props.docsMode ? 'docs' : 'story' : _props$viewMode,
        storyId = props.storyId,
        docsMode = props.docsMode,
        navigate = props.navigate;
    var store = new _store["default"]({
      getState: function getState() {
        return _this.state;
      },
      setState: function setState(stateChange, callback) {
        return _this.setState(stateChange, callback);
      }
    });
    var routeData = {
      location: location,
      path: path,
      viewMode: viewMode,
      storyId: storyId
    }; // Initialize the state to be the initial (persisted) state of the store.
    // This gives the modules the chance to read the persisted state, apply their defaults
    // and override if necessary

    var docsModeState = {
      layout: {
        isToolshown: false,
        showPanel: false
      },
      ui: {
        docsMode: true
      }
    };
    _this.state = store.getInitialState((0, _initialState["default"])(Object.assign({}, routeData, {}, docsMode ? docsModeState : null)));
    var apiData = {
      navigate: navigate,
      store: store,
      provider: provider
    };
    _this.modules = [_channel["default"], _addons["default"], _layout["default"], _notifications["default"], _shortcuts["default"], _stories["default"], _url["default"], _versions["default"]].map(function (initModule) {
      return initModule(Object.assign({}, routeData, {}, apiData, {
        state: _this.state
      }));
    }); // Create our initial state by combining the initial state of all modules, then overlaying any saved state

    var state = _initialState["default"].apply(void 0, _toConsumableArray(_this.modules.map(function (m) {
      return m.state;
    }))); // Get our API by combining the APIs exported by each module


    var combo = Object.assign.apply(Object, [{
      navigate: navigate
    }].concat(_toConsumableArray(_this.modules.map(function (m) {
      return m.api;
    }))));
    var api = (0, _initProviderApi["default"])({
      provider: provider,
      store: store,
      api: combo
    });
    api.on(STORY_CHANGED, function (id) {
      var options = api.getParameters(id, 'options');

      if (options) {
        api.setOptions(options);
      }
    });
    api.on(SET_STORIES, function (data) {
      api.setStories(data.stories);
      var options = storyId ? api.getParameters(storyId, 'options') : api.getParameters(Object.keys(data.stories)[0], 'options');
      api.setOptions(options);
    });
    api.on(SELECT_STORY, function (_ref) {
      var kind = _ref.kind,
          story = _ref.story,
          rest = _objectWithoutProperties(_ref, ["kind", "story"]);

      api.selectStory(kind, story, rest);
    });
    _this.state = state;
    _this.api = api;
    return _this;
  }

  _createClass(ManagerProvider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // Now every module has had a chance to set its API, call init on each module which gives it
      // a chance to do things that call other modules' APIs.
      this.modules.forEach(function (_ref2) {
        var init = _ref2.init;

        if (init) {
          init({
            api: _this2.api
          });
        }
      });
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var prevState = this.state;
      var prevProps = this.props;

      if (prevState !== nextState) {
        return true;
      }

      if (prevProps.path !== nextProps.path) {
        return true;
      }

      return false;
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      var value = {
        state: this.state,
        api: this.api
      };
      return _react["default"].createElement(ManagerContext.Provider, {
        value: value
      }, typeof children === 'function' ? children(value) : children);
    }
  }]);

  return ManagerProvider;
}(_react.Component);

exports.Provider = ManagerProvider;
ManagerProvider.displayName = "ManagerProvider";
ManagerProvider.displayName = 'Manager';

ManagerProvider.getDerivedStateFromProps = function (props, state) {
  if (state.path !== props.path) {
    return Object.assign({}, state, {
      location: props.location,
      path: props.path,
      viewMode: props.viewMode,
      storyId: props.storyId
    });
  }

  return null;
};

var ManagerConsumer =
/*#__PURE__*/
function (_Component2) {
  _inherits(ManagerConsumer, _Component2);

  function ManagerConsumer(props) {
    var _this3;

    _classCallCheck(this, ManagerConsumer);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(ManagerConsumer).call(this, props));
    _this3.dataMemory = void 0;
    _this3.prevChildren = void 0;
    _this3.prevData = void 0;
    _this3.dataMemory = props.filter ? (0, _memoizerific["default"])(10)(props.filter) : null;
    return _this3;
  }

  _createClass(ManagerConsumer, [{
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props = this.props,
          children = _this$props.children,
          pure = _this$props.pure;
      return _react["default"].createElement(ManagerContext.Consumer, null, function (d) {
        var data = _this4.dataMemory ? _this4.dataMemory(d) : d;

        if (pure && _this4.prevChildren && _this4.prevData && (0, _objects["default"])(data, _this4.prevData)) {
          return _this4.prevChildren;
        }

        _this4.prevChildren = children(data);
        _this4.prevData = data;
        return _this4.prevChildren;
      });
    }
  }]);

  return ManagerConsumer;
}(_react.Component);

exports.Consumer = ManagerConsumer;
ManagerConsumer.displayName = "ManagerConsumer";

function useStorybookState() {
  var _useContext = (0, _react.useContext)(ManagerContext),
      state = _useContext.state;

  return state;
}

function useStorybookApi() {
  var _useContext2 = (0, _react.useContext)(ManagerContext),
      api = _useContext2.api;

  return api;
}

function orDefault(fromStore, defaultState) {
  if (typeof fromStore === 'undefined') {
    return defaultState;
  }

  return fromStore;
}

function useAddonState(addonId, defaultState) {
  var api = useStorybookApi();
  var ref = (0, _react.useRef)({});
  var existingState = api.getAddonState(addonId);
  var state = orDefault(existingState, defaultState);

  var setState = function setState(newStateOrMerger, options) {
    return api.setAddonState(addonId, newStateOrMerger, options);
  };

  if (typeof existingState === 'undefined' && typeof state !== 'undefined') {
    if (!ref.current[addonId]) {
      api.setAddonState(addonId, state);
      ref.current[addonId] = true;
    }
  }

  return [state, setState];
}

var useChannel = function useChannel(eventMap) {
  var api = useStorybookApi();
  (0, _react.useEffect)(function () {
    Object.entries(eventMap).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          type = _ref4[0],
          listener = _ref4[1];

      return api.on(type, listener);
    });
    return function () {
      Object.entries(eventMap).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            type = _ref6[0],
            listener = _ref6[1];

        return api.off(type, listener);
      });
    };
  });
  return api.emit;
};

exports.useChannel = useChannel;

function useParameter(parameterKey, defaultValue) {
  var api = useStorybookApi();
  var result = api.getCurrentParameter(parameterKey);
  return orDefault(result, defaultValue);
}