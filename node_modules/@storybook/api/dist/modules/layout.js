"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.join");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.values");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
exports.focusableUIElements = void 0;

var _global = require("global");

var _pick = _interopRequireDefault(require("lodash/pick"));

var _utilDeprecate = _interopRequireDefault(require("util-deprecate"));

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

var _theming = require("@storybook/theming");

var _merge = _interopRequireDefault(require("../lib/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var deprecatedThemeOptions = {
  name: 'theme.brandTitle',
  url: 'theme.brandUrl'
};
var deprecatedLayoutOptions = {
  goFullScreen: 'isFullscreen',
  showStoriesPanel: 'showNav',
  showAddonPanel: 'showPanel',
  addonPanelInRight: 'panelPosition'
};

var deprecationMessage = function deprecationMessage(optionsMap) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return "The options { ".concat(Object.keys(optionsMap).join(', '), " } are deprecated -- use ").concat(prefix ? "".concat(prefix, "'s") : '', " { ").concat(Object.values(optionsMap).join(', '), " } instead.");
};

var applyDeprecatedThemeOptions = (0, _utilDeprecate["default"])(function (_ref) {
  var name = _ref.name,
      url = _ref.url,
      theme = _ref.theme;

  var _ref2 = theme || {},
      brandTitle = _ref2.brandTitle,
      brandUrl = _ref2.brandUrl,
      brandImage = _ref2.brandImage;

  return {
    brandTitle: brandTitle || name,
    brandUrl: brandUrl || url,
    brandImage: brandImage || null
  };
}, deprecationMessage(deprecatedThemeOptions));
var applyDeprecatedLayoutOptions = (0, _utilDeprecate["default"])(function (options) {
  var layoutUpdate = {};
  ['goFullScreen', 'showStoriesPanel', 'showAddonPanel'].forEach(function (option) {
    var v = options[option];

    if (typeof v !== 'undefined') {
      var _key = deprecatedLayoutOptions[option];
      layoutUpdate[_key] = v;
    }
  });

  if (options.addonPanelInRight) {
    layoutUpdate.panelPosition = 'right';
  }

  return layoutUpdate;
}, deprecationMessage(deprecatedLayoutOptions));

var checkDeprecatedThemeOptions = function checkDeprecatedThemeOptions(options) {
  if (Object.keys(deprecatedThemeOptions).find(function (v) {
    return v in options;
  })) {
    return applyDeprecatedThemeOptions(options);
  }

  return {};
};

var checkDeprecatedLayoutOptions = function checkDeprecatedLayoutOptions(options) {
  if (Object.keys(deprecatedLayoutOptions).find(function (v) {
    return v in options;
  })) {
    return applyDeprecatedLayoutOptions(options);
  }

  return {};
};

var initial = {
  ui: {
    enableShortcuts: true,
    sidebarAnimations: true,
    docsMode: false
  },
  layout: {
    isToolshown: true,
    isFullscreen: false,
    showPanel: true,
    showNav: true,
    panelPosition: 'bottom'
  },
  selectedPanel: undefined,
  theme: _theming.themes.light
};
var focusableUIElements = {
  storySearchField: 'storybook-explorer-searchfield',
  storyListMenu: 'storybook-explorer-menu',
  storyPanelRoot: 'storybook-panel-root'
};
exports.focusableUIElements = focusableUIElements;
var hasSetOptions = false;

function _default(_ref3) {
  var store = _ref3.store;
  var api = {
    toggleFullscreen: function toggleFullscreen(toggled) {
      return store.setState(function (state) {
        var value = typeof toggled === 'boolean' ? toggled : !state.layout.isFullscreen;
        return {
          layout: Object.assign({}, state.layout, {
            isFullscreen: value
          })
        };
      });
    },
    togglePanel: function togglePanel(toggled) {
      return store.setState(function (state) {
        var value = typeof toggled !== 'undefined' ? toggled : !state.layout.showPanel;
        return {
          layout: Object.assign({}, state.layout, {
            showPanel: value
          })
        };
      });
    },
    togglePanelPosition: function togglePanelPosition(position) {
      if (typeof position !== 'undefined') {
        return store.setState(function (state) {
          return {
            layout: Object.assign({}, state.layout, {
              panelPosition: position
            })
          };
        });
      }

      return store.setState(function (state) {
        return {
          layout: Object.assign({}, state.layout, {
            panelPosition: state.layout.panelPosition === 'right' ? 'bottom' : 'right'
          })
        };
      });
    },
    toggleNav: function toggleNav(toggled) {
      return store.setState(function (state) {
        var value = typeof toggled !== 'undefined' ? toggled : !state.layout.showNav;
        return {
          layout: Object.assign({}, state.layout, {
            showNav: value
          })
        };
      });
    },
    toggleToolbar: function toggleToolbar(toggled) {
      return store.setState(function (state) {
        var value = typeof toggled !== 'undefined' ? toggled : !state.layout.isToolshown;
        return {
          layout: Object.assign({}, state.layout, {
            isToolshown: value
          })
        };
      });
    },
    resetLayout: function resetLayout() {
      return store.setState(function (state) {
        return {
          layout: Object.assign({}, state.layout, {
            showNav: false,
            showPanel: false,
            isFullscreen: false
          })
        };
      });
    },
    focusOnUIElement: function focusOnUIElement(elementId) {
      if (!elementId) {
        return;
      }

      var element = _global.document.getElementById(elementId);

      if (element) {
        element.focus();
      }
    },
    setOptions: function setOptions(options) {
      // The very first time the user sets their options, we don't consider what is in the store.
      // At this point in time, what is in the store is what we *persisted*. We did that in order
      // to avoid a FOUC (e.g. initial rendering the wrong theme while we waited for the stories to load)
      // However, we don't want to have a memory about these things, otherwise we see bugs like the
      // user setting a name for their storybook, persisting it, then never being able to unset it
      // without clearing localstorage. See https://github.com/storybookjs/storybook/issues/5857
      var _ref4 = hasSetOptions ? store.getState() : initial,
          layout = _ref4.layout,
          ui = _ref4.ui,
          selectedPanel = _ref4.selectedPanel,
          theme = _ref4.theme;

      if (options) {
        var updatedLayout = Object.assign({}, layout, {}, (0, _pick["default"])(options, Object.keys(layout)), {}, checkDeprecatedLayoutOptions(options));
        var updatedUi = Object.assign({}, ui, {}, (0, _pick["default"])(options, Object.keys(ui)));
        var updatedTheme = Object.assign({}, theme, {}, options.theme, {}, checkDeprecatedThemeOptions(options));
        var modification = {};

        if (!(0, _fastDeepEqual["default"])(ui, updatedUi)) {
          modification.ui = updatedUi;
        }

        if (!(0, _fastDeepEqual["default"])(layout, updatedLayout)) {
          modification.layout = updatedLayout;
        }

        if (!(0, _fastDeepEqual["default"])(theme, updatedTheme)) {
          modification.theme = updatedTheme;
        }

        if (options.selectedPanel && !(0, _fastDeepEqual["default"])(selectedPanel, options.selectedPanel)) {
          modification.selectedPanel = options.selectedPanel;
        }

        if (Object.keys(modification).length) {
          store.setState(modification, {
            persistence: 'permanent'
          });
        }

        hasSetOptions = true;
      }
    }
  };
  var persisted = (0, _pick["default"])(store.getState(), 'layout', 'ui', 'selectedPanel', 'theme');
  return {
    api: api,
    state: (0, _merge["default"])(initial, persisted)
  };
}