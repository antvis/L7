"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.find-index");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.reduce");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.object.values");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.split");

require("core-js/modules/es.string.trim");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _router = require("@storybook/router");

var _merge = _interopRequireDefault(require("../lib/merge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var initStoriesApi = function initStoriesApi(_ref) {
  var store = _ref.store,
      navigate = _ref.navigate,
      initialStoryId = _ref.storyId,
      initialViewMode = _ref.viewMode;

  var isStory = function isStory(obj) {
    var story = obj;
    return !!(story && story.parameters);
  };

  var getData = function getData(storyId) {
    var _store$getState = store.getState(),
        storiesHash = _store$getState.storiesHash;

    return storiesHash[storyId];
  };

  var getCurrentStoryData = function getCurrentStoryData() {
    var _store$getState2 = store.getState(),
        storyId = _store$getState2.storyId;

    return getData(storyId);
  };

  var getParameters = function getParameters(storyId, parameterName) {
    var data = getData(storyId);

    if (isStory(data)) {
      var _ref2 = data,
          parameters = _ref2.parameters;
      return parameterName ? parameters[parameterName] : parameters;
    }

    return null;
  };

  var getCurrentParameter = function getCurrentParameter(parameterName) {
    var _store$getState3 = store.getState(),
        storyId = _store$getState3.storyId;

    var parameters = getParameters(storyId, parameterName);

    if (parameters) {
      return parameters;
    }

    return undefined;
  };

  var jumpToStory = function jumpToStory(direction) {
    var _store$getState4 = store.getState(),
        storiesHash = _store$getState4.storiesHash,
        viewMode = _store$getState4.viewMode,
        storyId = _store$getState4.storyId; // cannot navigate when there's no current selection


    if (!storyId || !storiesHash[storyId]) {
      return;
    }

    var lookupList = Object.keys(storiesHash).filter(function (k) {
      return !(storiesHash[k].children || Array.isArray(storiesHash[k]));
    });
    var index = lookupList.indexOf(storyId); // cannot navigate beyond fist or last

    if (index === lookupList.length - 1 && direction > 0) {
      return;
    }

    if (index === 0 && direction < 0) {
      return;
    }

    var result = lookupList[index + direction];

    if (viewMode && result) {
      navigate("/".concat(viewMode, "/").concat(result));
    }
  };

  var jumpToComponent = function jumpToComponent(direction) {
    var state = store.getState();
    var storiesHash = state.storiesHash,
        viewMode = state.viewMode,
        storyId = state.storyId; // cannot navigate when there's no current selection

    if (!storyId || !storiesHash[storyId]) {
      return;
    }

    var lookupList = Object.entries(storiesHash).reduce(function (acc, i) {
      var value = i[1];

      if (value.isComponent) {
        acc.push(_toConsumableArray(i[1].children));
      }

      return acc;
    }, []);
    var index = lookupList.findIndex(function (i) {
      return i.includes(storyId);
    }); // cannot navigate beyond fist or last

    if (index === lookupList.length - 1 && direction > 0) {
      return;
    }

    if (index === 0 && direction < 0) {
      return;
    }

    var result = lookupList[index + direction][0];
    navigate("/".concat(viewMode || 'story', "/").concat(result));
  };

  var toKey = function toKey(input) {
    return input.replace(/[^a-z0-9]+([a-z0-9])/gi, function () {
      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      return params[1].toUpperCase();
    });
  };

  var toGroup = function toGroup(name) {
    return {
      name: name,
      id: toKey(name)
    };
  };

  var setStories = function setStories(input) {
    var hash = {};
    var storiesHashOutOfOrder = Object.values(input).reduce(function (acc, item) {
      var kind = item.kind,
          parameters = item.parameters; // FIXME: figure out why parameters is missing when used with react-native-server

      var _ref3 = parameters && parameters.options || {
        hierarchyRootSeparator: '|',
        hierarchySeparator: /\/|\./
      },
          rootSeparator = _ref3.hierarchyRootSeparator,
          groupSeparator = _ref3.hierarchySeparator;

      var _parseKind = (0, _router.parseKind)(kind, {
        rootSeparator: rootSeparator,
        groupSeparator: groupSeparator
      }),
          root = _parseKind.root,
          groups = _parseKind.groups;

      var rootAndGroups = [].concat(root || []).concat(groups).map(toGroup) // Map a bunch of extra fields onto the groups, collecting the path as we go (thus the reduce)
      .reduce(function (soFar, group, index, original) {
        var name = group.name;
        var parent = index > 0 && soFar[index - 1].id;
        var id = (0, _router.sanitize)(parent ? "".concat(parent, "-").concat(name) : name);

        if (parent === id) {
          throw new Error("\nInvalid part '".concat(name, "', leading to id === parentId ('").concat(id, "'), inside kind '").concat(kind, "'\n\nDid you create a path that uses the separator char accidentally, such as 'Vue <docs/>' where '/' is a separator char? See https://github.com/storybookjs/storybook/issues/6128\n              ").trim());
        }

        var result = Object.assign({}, group, {
          id: id,
          parent: parent,
          depth: index,
          children: [],
          isComponent: index === original.length - 1,
          isLeaf: false,
          isRoot: !!root && index === 0
        });
        return soFar.concat([result]);
      }, []);
      var paths = [].concat(_toConsumableArray(rootAndGroups.map(function (g) {
        return g.id;
      })), [item.id]); // Ok, now let's add everything to the store

      rootAndGroups.forEach(function (group, index) {
        var child = paths[index + 1];
        var id = group.id;
        acc[id] = (0, _merge["default"])(acc[id] || {}, Object.assign({}, group, {}, child && {
          children: [child]
        }));
      });
      var story = Object.assign({}, item, {
        parent: rootAndGroups[rootAndGroups.length - 1].id,
        isLeaf: true
      });
      acc[item.id] = story;
      return acc;
    }, hash); // When adding a group, also add all of its children, depth first

    function addItem(acc, item) {
      if (!acc[item.id]) {
        // If we were already inserted as part of a group, that's great.
        acc[item.id] = item;
        var children = item.children;

        if (children) {
          children.forEach(function (id) {
            return addItem(acc, storiesHashOutOfOrder[id]);
          });
        }
      }

      return acc;
    } // Now create storiesHash by reordering the above by group


    var storiesHash = Object.values(storiesHashOutOfOrder).reduce(addItem, {});
    var settingsPageList = ['about', 'shortcuts'];

    var _store$getState5 = store.getState(),
        storyId = _store$getState5.storyId,
        viewMode = _store$getState5.viewMode;

    if (storyId && storyId.match(/--\*$/)) {
      var idStart = storyId.slice(0, -1); // drop the * at the end

      var firstKindLeaf = Object.values(storiesHash).find(function (s) {
        return !s.children && s.id.substring(0, idStart.length) === idStart;
      });

      if (viewMode && firstKindLeaf) {
        navigate("/".concat(viewMode, "/").concat(firstKindLeaf.id));
      }
    } else if (!storyId || storyId === '*' || !storiesHash[storyId]) {
      // when there's no storyId or the storyId item doesn't exist
      // we pick the first leaf and navigate
      var firstLeaf = Object.values(storiesHash).find(function (s) {
        return !s.children;
      });

      if (viewMode === 'settings' && settingsPageList.includes(storyId)) {
        navigate("/".concat(viewMode, "/").concat(storyId));
      } else if (viewMode === 'settings' && !settingsPageList.includes(storyId)) {
        navigate("/story/".concat(firstLeaf.id));
      } else if (viewMode && firstLeaf) {
        navigate("/".concat(viewMode, "/").concat(firstLeaf.id));
      }
    }

    store.setState({
      storiesHash: storiesHash,
      storiesConfigured: true
    });
  };

  var selectStory = function selectStory(kindOrId, story) {
    var _store$getState6 = store.getState(),
        _store$getState6$view = _store$getState6.viewMode,
        viewMode = _store$getState6$view === void 0 ? 'story' : _store$getState6$view,
        storyId = _store$getState6.storyId,
        storiesHash = _store$getState6.storiesHash;

    if (!story) {
      var s = storiesHash[(0, _router.sanitize)(kindOrId)]; // eslint-disable-next-line no-nested-ternary

      var _id = s ? s.children ? s.children[0] : s.id : kindOrId;

      navigate("/".concat(viewMode, "/").concat(_id));
    } else if (!kindOrId) {
      // This is a slugified version of the kind, but that's OK, our toId function is idempotent
      var kind = storyId.split('--', 2)[0];
      selectStory((0, _router.toId)(kind, story));
    } else {
      selectStory((0, _router.toId)(kindOrId, story));
    }
  };

  return {
    api: {
      storyId: _router.toId,
      selectStory: selectStory,
      getCurrentStoryData: getCurrentStoryData,
      setStories: setStories,
      jumpToComponent: jumpToComponent,
      jumpToStory: jumpToStory,
      getData: getData,
      getParameters: getParameters,
      getCurrentParameter: getCurrentParameter
    },
    state: {
      storiesHash: {},
      storyId: initialStoryId,
      viewMode: initialViewMode,
      storiesConfigured: false
    }
  };
};

var _default = initStoriesApi;
exports["default"] = _default;