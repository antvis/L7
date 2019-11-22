"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensurePanel = ensurePanel;
exports["default"] = exports.types = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var types;
exports.types = types;

(function (types) {
  types["TAB"] = "tab";
  types["PANEL"] = "panel";
  types["TOOL"] = "tool";
  types["PREVIEW"] = "preview";
  types["NOTES_ELEMENT"] = "notes-element";
})(types || (exports.types = types = {}));

function ensurePanel(panels, selectedPanel, currentPanel) {
  var keys = Object.keys(panels);

  if (keys.indexOf(selectedPanel) >= 0) {
    return selectedPanel;
  }

  if (keys.length) {
    return keys[0];
  }

  return currentPanel;
}

var _default = function _default(_ref) {
  var provider = _ref.provider,
      store = _ref.store;
  var api = {
    getElements: function getElements(type) {
      return provider.getElements(type);
    },
    getPanels: function getPanels() {
      return api.getElements(types.PANEL);
    },
    getStoryPanels: function getStoryPanels() {
      var allPanels = api.getPanels();

      var _store$getState = store.getState(),
          storyId = _store$getState.storyId,
          storiesHash = _store$getState.storiesHash;

      var storyInput = storyId && storiesHash[storyId];

      if (!allPanels || !storyInput) {
        return allPanels;
      }

      var parameters = storyInput.parameters;
      var filteredPanels = {};
      Object.entries(allPanels).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            id = _ref3[0],
            panel = _ref3[1];

        var paramKey = panel.paramKey;

        if (paramKey && parameters && parameters[paramKey] && parameters[paramKey].disabled) {
          return;
        }

        filteredPanels[id] = panel;
      });
      return filteredPanels;
    },
    getSelectedPanel: function getSelectedPanel() {
      var _store$getState2 = store.getState(),
          selectedPanel = _store$getState2.selectedPanel;

      return ensurePanel(api.getPanels(), selectedPanel, selectedPanel);
    },
    setSelectedPanel: function setSelectedPanel(panelName) {
      store.setState({
        selectedPanel: panelName
      }, {
        persistence: 'session'
      });
    },
    setAddonState: function setAddonState(addonId, newStateOrMerger, options) {
      var nextState;

      var _store$getState3 = store.getState(),
          existing = _store$getState3.addons;

      if (typeof newStateOrMerger === 'function') {
        var merger = newStateOrMerger;
        nextState = merger(api.getAddonState(addonId));
      } else {
        nextState = newStateOrMerger;
      }

      return store.setState({
        addons: Object.assign({}, existing, _defineProperty({}, addonId, nextState))
      }, options).then(function () {
        return api.getAddonState(addonId);
      });
    },
    getAddonState: function getAddonState(addonId) {
      return store.getState().addons[addonId];
    }
  };
  return {
    api: api,
    state: {
      selectedPanel: ensurePanel(api.getPanels(), store.getState().selectedPanel),
      addons: {}
    }
  };
};

exports["default"] = _default;