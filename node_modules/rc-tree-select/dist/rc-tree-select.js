(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["rc-tree-select"] = factory(require("react"), require("react-dom"));
	else
		root["rc-tree-select"] = factory(root["React"], root["ReactDOM"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_13__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 86);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(136)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(138)();
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(67);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(129);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(133);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(67);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(107);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(66);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.2' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(41)('wks');
var uid = __webpack_require__(31);
var Symbol = __webpack_require__(11).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return polyfill; });
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function componentWillMount() {
  // Call this.constructor.gDSFP to support sub-classes.
  var state = this.constructor.getDerivedStateFromProps(this.props, this.state);
  if (state !== null && state !== undefined) {
    this.setState(state);
  }
}

function componentWillReceiveProps(nextProps) {
  // Call this.constructor.gDSFP to support sub-classes.
  // Use the setState() updater to ensure state isn't stale in certain edge cases.
  function updater(prevState) {
    var state = this.constructor.getDerivedStateFromProps(nextProps, prevState);
    return state !== null && state !== undefined ? state : null;
  }
  // Binding "this" is important for shallow renderer support.
  this.setState(updater.bind(this));
}

function componentWillUpdate(nextProps, nextState) {
  try {
    var prevProps = this.props;
    var prevState = this.state;
    this.props = nextProps;
    this.state = nextState;
    this.__reactInternalSnapshotFlag = true;
    this.__reactInternalSnapshot = this.getSnapshotBeforeUpdate(
      prevProps,
      prevState
    );
  } finally {
    this.props = prevProps;
    this.state = prevState;
  }
}

// React may warn about cWM/cWRP/cWU methods being deprecated.
// Add a flag to suppress these warnings for this special case.
componentWillMount.__suppressDeprecationWarning = true;
componentWillReceiveProps.__suppressDeprecationWarning = true;
componentWillUpdate.__suppressDeprecationWarning = true;

function polyfill(Component) {
  var prototype = Component.prototype;

  if (!prototype || !prototype.isReactComponent) {
    throw new Error('Can only polyfill class components');
  }

  if (
    typeof Component.getDerivedStateFromProps !== 'function' &&
    typeof prototype.getSnapshotBeforeUpdate !== 'function'
  ) {
    return Component;
  }

  // If new component APIs are defined, "unsafe" lifecycles won't be called.
  // Error if any of these lifecycles are present,
  // Because they would work differently between older and newer (16.3+) versions of React.
  var foundWillMountName = null;
  var foundWillReceivePropsName = null;
  var foundWillUpdateName = null;
  if (typeof prototype.componentWillMount === 'function') {
    foundWillMountName = 'componentWillMount';
  } else if (typeof prototype.UNSAFE_componentWillMount === 'function') {
    foundWillMountName = 'UNSAFE_componentWillMount';
  }
  if (typeof prototype.componentWillReceiveProps === 'function') {
    foundWillReceivePropsName = 'componentWillReceiveProps';
  } else if (typeof prototype.UNSAFE_componentWillReceiveProps === 'function') {
    foundWillReceivePropsName = 'UNSAFE_componentWillReceiveProps';
  }
  if (typeof prototype.componentWillUpdate === 'function') {
    foundWillUpdateName = 'componentWillUpdate';
  } else if (typeof prototype.UNSAFE_componentWillUpdate === 'function') {
    foundWillUpdateName = 'UNSAFE_componentWillUpdate';
  }
  if (
    foundWillMountName !== null ||
    foundWillReceivePropsName !== null ||
    foundWillUpdateName !== null
  ) {
    var componentName = Component.displayName || Component.name;
    var newApiName =
      typeof Component.getDerivedStateFromProps === 'function'
        ? 'getDerivedStateFromProps()'
        : 'getSnapshotBeforeUpdate()';

    throw Error(
      'Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n' +
        componentName +
        ' uses ' +
        newApiName +
        ' but also contains the following legacy lifecycles:' +
        (foundWillMountName !== null ? '\n  ' + foundWillMountName : '') +
        (foundWillReceivePropsName !== null
          ? '\n  ' + foundWillReceivePropsName
          : '') +
        (foundWillUpdateName !== null ? '\n  ' + foundWillUpdateName : '') +
        '\n\nThe above lifecycles should be removed. Learn more about this warning here:\n' +
        'https://fb.me/react-async-component-lifecycle-hooks'
    );
  }

  // React <= 16.2 does not support static getDerivedStateFromProps.
  // As a workaround, use cWM and cWRP to invoke the new static lifecycle.
  // Newer versions of React will ignore these lifecycles if gDSFP exists.
  if (typeof Component.getDerivedStateFromProps === 'function') {
    prototype.componentWillMount = componentWillMount;
    prototype.componentWillReceiveProps = componentWillReceiveProps;
  }

  // React <= 16.2 does not support getSnapshotBeforeUpdate.
  // As a workaround, use cWU to invoke the new lifecycle.
  // Newer versions of React will ignore that lifecycle if gSBU exists.
  if (typeof prototype.getSnapshotBeforeUpdate === 'function') {
    if (typeof prototype.componentDidUpdate !== 'function') {
      throw new Error(
        'Cannot polyfill getSnapshotBeforeUpdate() for components that do not define componentDidUpdate() on the prototype'
      );
    }

    prototype.componentWillUpdate = componentWillUpdate;

    var componentDidUpdate = prototype.componentDidUpdate;

    prototype.componentDidUpdate = function componentDidUpdatePolyfill(
      prevProps,
      prevState,
      maybeSnapshot
    ) {
      // 16.3+ will not execute our will-update method;
      // It will pass a snapshot value to did-update though.
      // Older versions will require our polyfilled will-update value.
      // We need to handle both cases, but can't just check for the presence of "maybeSnapshot",
      // Because for <= 15.x versions this might be a "prevContext" object.
      // We also can't just check "__reactInternalSnapshot",
      // Because get-snapshot might return a falsy value.
      // So check for the explicit __reactInternalSnapshotFlag flag to determine behavior.
      var snapshot = this.__reactInternalSnapshotFlag
        ? this.__reactInternalSnapshot
        : maybeSnapshot;

      componentDidUpdate.call(this, prevProps, prevState, snapshot);
    };
  }

  return Component;
}




/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["q"] = toTitle;
/* unused harmony export toArray */
/* harmony export (immutable) */ __webpack_exports__["g"] = createRef;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return UNSELECTABLE_STYLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UNSELECTABLE_ATTRIBUTE; });
/* harmony export (immutable) */ __webpack_exports__["h"] = flatToHierarchy;
/* unused harmony export resetAriaId */
/* harmony export (immutable) */ __webpack_exports__["k"] = generateAriaId;
/* harmony export (immutable) */ __webpack_exports__["n"] = isLabelInValue;
/* harmony export (immutable) */ __webpack_exports__["p"] = parseSimpleTreeData;
/* harmony export (immutable) */ __webpack_exports__["o"] = isPosRelated;
/* harmony export (immutable) */ __webpack_exports__["c"] = cleanEntity;
/* harmony export (immutable) */ __webpack_exports__["l"] = getFilterTree;
/* harmony export (immutable) */ __webpack_exports__["i"] = formatInternalValue;
/* unused harmony export getLabel */
/* harmony export (immutable) */ __webpack_exports__["j"] = formatSelectorValue;
/* harmony export (immutable) */ __webpack_exports__["e"] = convertDataToTree;
/* harmony export (immutable) */ __webpack_exports__["f"] = convertTreeToEntities;
/* harmony export (immutable) */ __webpack_exports__["m"] = getHalfCheckedKeys;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return conductCheck; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_warning__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_warning___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_warning__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_tree_es_util__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_util_es_Children_toArray__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__SelectNode__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__strategies__ = __webpack_require__(54);








var warnDeprecatedLabel = false;

// =================== MISC ====================
function toTitle(title) {
  if (typeof title === 'string') {
    return title;
  }
  return null;
}

function toArray(data) {
  if (!data) return [];

  return Array.isArray(data) ? data : [data];
}

// Shallow copy of React 16.3 createRef api
function createRef() {
  var func = function setRef(node) {
    func.current = node;
  };
  return func;
}

// =============== Legacy ===============
var UNSELECTABLE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none'
};

var UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable'
};

/**
 * Convert position list to hierarchy structure.
 * This is little hack since use '-' to split the position.
 */
function flatToHierarchy(positionList) {
  if (!positionList.length) {
    return [];
  }

  var entrances = {};

  // Prepare the position map
  var posMap = {};
  var parsedList = positionList.slice().map(function (entity) {
    var clone = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, entity, {
      fields: entity.pos.split('-')
    });
    delete clone.children;
    return clone;
  });

  parsedList.forEach(function (entity) {
    posMap[entity.pos] = entity;
  });

  parsedList.sort(function (a, b) {
    return a.fields.length - b.fields.length;
  });

  // Create the hierarchy
  parsedList.forEach(function (entity) {
    var parentPos = entity.fields.slice(0, -1).join('-');
    var parentEntity = posMap[parentPos];

    if (!parentEntity) {
      entrances[entity.pos] = entity;
    } else {
      parentEntity.children = parentEntity.children || [];
      parentEntity.children.push(entity);
    }

    // Some time position list provide `key`, we don't need it
    delete entity.key;
    delete entity.fields;
  });

  return Object.keys(entrances).map(function (key) {
    return entrances[key];
  });
}

// =============== Accessibility ===============
var ariaId = 0;

function resetAriaId() {
  ariaId = 0;
}

function generateAriaId(prefix) {
  ariaId += 1;
  return prefix + '_' + ariaId;
}

function isLabelInValue(props) {
  var treeCheckable = props.treeCheckable,
      treeCheckStrictly = props.treeCheckStrictly,
      labelInValue = props.labelInValue;

  if (treeCheckable && treeCheckStrictly) {
    return true;
  }
  return labelInValue || false;
}

// =================== Tree ====================
function parseSimpleTreeData(treeData, _ref) {
  var id = _ref.id,
      pId = _ref.pId,
      rootPId = _ref.rootPId;

  var keyNodes = {};
  var rootNodeList = [];

  // Fill in the map
  var nodeList = treeData.map(function (node) {
    var clone = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, node);
    var key = clone[id];
    keyNodes[key] = clone;
    clone.key = clone.key || key;
    return clone;
  });

  // Connect tree
  nodeList.forEach(function (node) {
    var parentKey = node[pId];
    var parent = keyNodes[parentKey];

    // Fill parent
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
    }

    // Fill root tree node
    if (parentKey === rootPId || !parent && rootPId === null) {
      rootNodeList.push(node);
    }
  });

  return rootNodeList;
}

/**
 * Detect if position has relation.
 * e.g. 1-2 related with 1-2-3
 * e.g. 1-3-2 related with 1
 * e.g. 1-2 not related with 1-21
 */
function isPosRelated(pos1, pos2) {
  var fields1 = pos1.split('-');
  var fields2 = pos2.split('-');

  var minLen = Math.min(fields1.length, fields2.length);
  for (var i = 0; i < minLen; i += 1) {
    if (fields1[i] !== fields2[i]) {
      return false;
    }
  }
  return true;
}

/**
 * This function is only used on treeNode check (none treeCheckStrictly but has searchInput).
 * We convert entity to { node, pos, children } format.
 * This is legacy bug but we still need to do with it.
 * @param entity
 */
function cleanEntity(_ref2) {
  var node = _ref2.node,
      pos = _ref2.pos,
      children = _ref2.children;

  var instance = {
    node: node,
    pos: pos
  };

  if (children) {
    instance.children = children.map(cleanEntity);
  }

  return instance;
}

/**
 * Get a filtered TreeNode list by provided treeNodes.
 * [Legacy] Since `Tree` use `key` as map but `key` will changed by React,
 * we have to convert `treeNodes > data > treeNodes` to keep the key.
 * Such performance hungry!
 */
function getFilterTree(treeNodes, searchValue, filterFunc, valueEntities) {
  if (!searchValue) {
    return null;
  }

  function mapFilteredNodeToData(node) {
    if (!node) return null;

    var match = false;
    if (filterFunc(searchValue, node)) {
      match = true;
    }

    var children = Object(__WEBPACK_IMPORTED_MODULE_4_rc_util_es_Children_toArray__["a" /* default */])(node.props.children).map(mapFilteredNodeToData).filter(function (n) {
      return n;
    });

    if (children.length || match) {
      return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_5__SelectNode__["a" /* default */],
        __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, node.props, {
          key: valueEntities[node.props.value].key
        }),
        children
      );
    }

    return null;
  }

  return treeNodes.map(mapFilteredNodeToData).filter(function (node) {
    return node;
  });
}

// =================== Value ===================
/**
 * Convert value to array format to make logic simplify.
 */
function formatInternalValue(value, props) {
  var valueList = toArray(value);

  // Parse label in value
  if (isLabelInValue(props)) {
    return valueList.map(function (val) {
      if (typeof val !== 'object' || !val) {
        return {
          value: '',
          label: ''
        };
      }

      return val;
    });
  }

  return valueList.map(function (val) {
    return {
      value: val
    };
  });
}

function getLabel(wrappedValue, entity, treeNodeLabelProp) {
  if (wrappedValue.label) {
    return wrappedValue.label;
  }

  if (entity && entity.node.props) {
    return entity.node.props[treeNodeLabelProp];
  }

  // Since value without entity will be in missValueList.
  // This code will never reached, but we still need this in case.
  return wrappedValue.value;
}

/**
 * Convert internal state `valueList` to user needed value list.
 * This will return an array list. You need check if is not multiple when return.
 *
 * `allCheckedNodes` is used for `treeCheckStrictly`
 */
function formatSelectorValue(valueList, props, valueEntities) {
  var treeNodeLabelProp = props.treeNodeLabelProp,
      treeCheckable = props.treeCheckable,
      treeCheckStrictly = props.treeCheckStrictly,
      showCheckedStrategy = props.showCheckedStrategy;

  // Will hide some value if `showCheckedStrategy` is set

  if (treeCheckable && !treeCheckStrictly) {
    var values = {};
    valueList.forEach(function (wrappedValue) {
      values[wrappedValue.value] = wrappedValue;
    });
    var hierarchyList = flatToHierarchy(valueList.map(function (_ref3) {
      var value = _ref3.value;
      return valueEntities[value];
    }));

    if (showCheckedStrategy === __WEBPACK_IMPORTED_MODULE_6__strategies__["c" /* SHOW_PARENT */]) {
      // Only get the parent checked value
      return hierarchyList.map(function (_ref4) {
        var value = _ref4.node.props.value;
        return {
          label: getLabel(values[value], valueEntities[value], treeNodeLabelProp),
          value: value
        };
      });
    } else if (showCheckedStrategy === __WEBPACK_IMPORTED_MODULE_6__strategies__["b" /* SHOW_CHILD */]) {
      // Only get the children checked value
      var targetValueList = [];

      // Find the leaf children
      var traverse = function traverse(_ref5) {
        var value = _ref5.node.props.value,
            children = _ref5.children;

        if (!children || children.length === 0) {
          targetValueList.push({
            label: getLabel(values[value], valueEntities[value], treeNodeLabelProp),
            value: value
          });
          return;
        }

        children.forEach(function (entity) {
          traverse(entity);
        });
      };

      hierarchyList.forEach(function (entity) {
        traverse(entity);
      });

      return targetValueList;
    }
  }

  return valueList.map(function (wrappedValue) {
    return {
      label: getLabel(wrappedValue, valueEntities[wrappedValue.value], treeNodeLabelProp),
      value: wrappedValue.value
    };
  });
}

/**
 * Use `rc-tree` convertDataToTree to convert treeData to TreeNodes.
 * This will change the label to title value
 */
function processProps(props) {
  var title = props.title,
      label = props.label,
      key = props.key,
      value = props.value;

  var cloneProps = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, props);

  // Warning user not to use deprecated label prop.
  if (label && !title) {
    if (!warnDeprecatedLabel) {
      __WEBPACK_IMPORTED_MODULE_2_warning___default()(false, '\'label\' in treeData is deprecated. Please use \'title\' instead.');
      warnDeprecatedLabel = true;
    }

    cloneProps.title = label;
  }

  if (!key) {
    cloneProps.key = value;
  }

  return cloneProps;
}

function convertDataToTree(treeData) {
  return Object(__WEBPACK_IMPORTED_MODULE_3_rc_tree_es_util__["g" /* convertDataToTree */])(treeData, { processProps: processProps });
}

/**
 * Use `rc-tree` convertTreeToEntities for entities calculation.
 * We have additional entities of `valueEntities`
 */
function initWrapper(wrapper) {
  return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, wrapper, {
    valueEntities: {}
  });
}

function processEntity(entity, wrapper) {
  var value = entity.node.props.value;
  entity.value = value;

  // This should be empty, or will get error message.
  var currentEntity = wrapper.valueEntities[value];
  if (currentEntity) {
    __WEBPACK_IMPORTED_MODULE_2_warning___default()(false, 'Conflict! value of node \'' + entity.key + '\' (' + value + ') has already used by node \'' + currentEntity.key + '\'.');
  }
  wrapper.valueEntities[value] = entity;
}

function convertTreeToEntities(treeNodes) {
  return Object(__WEBPACK_IMPORTED_MODULE_3_rc_tree_es_util__["h" /* convertTreeToEntities */])(treeNodes, {
    initWrapper: initWrapper,
    processEntity: processEntity
  });
}

/**
 * https://github.com/ant-design/ant-design/issues/13328
 * We need calculate the half check key when searchValue is set.
 */
// TODO: This logic may better move to rc-tree
function getHalfCheckedKeys(valueList, valueEntities) {
  var values = {};

  // Fill checked keys
  valueList.forEach(function (_ref6) {
    var value = _ref6.value;

    values[value] = false;
  });

  // Fill half checked keys
  valueList.forEach(function (_ref7) {
    var value = _ref7.value;

    var current = valueEntities[value];

    while (current && current.parent) {
      var parentValue = current.parent.value;
      if (parentValue in values) break;
      values[parentValue] = true;

      current = current.parent;
    }
  });

  // Get half keys
  return Object.keys(values).filter(function (value) {
    return values[value];
  }).map(function (value) {
    return valueEntities[value].key;
  });
}

var conductCheck = __WEBPACK_IMPORTED_MODULE_3_rc_tree_es_util__["e" /* conductCheck */];

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(21);
var IE8_DOM_DEFINE = __webpack_require__(60);
var toPrimitive = __webpack_require__(37);
var dP = Object.defineProperty;

exports.f = __webpack_require__(15) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(11);
var core = __webpack_require__(7);
var ctx = __webpack_require__(36);
var hide = __webpack_require__(20);
var has = __webpack_require__(16);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(25)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 16 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__propertyUtils__ = __webpack_require__(154);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



var RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;

var getComputedStyleX = void 0;

// https://stackoverflow.com/a/3485654/3040605
function forceRelayout(elem) {
  var originalStyle = elem.style.display;
  elem.style.display = 'none';
  elem.offsetHeight; // eslint-disable-line
  elem.style.display = originalStyle;
}

function css(el, name, v) {
  var value = v;
  if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
    for (var i in name) {
      if (name.hasOwnProperty(i)) {
        css(el, i, name[i]);
      }
    }
    return undefined;
  }
  if (typeof value !== 'undefined') {
    if (typeof value === 'number') {
      value = value + 'px';
    }
    el.style[name] = value;
    return undefined;
  }
  return getComputedStyleX(el, name);
}

function getClientPosition(elem) {
  var box = void 0;
  var x = void 0;
  var y = void 0;
  var doc = elem.ownerDocument;
  var body = doc.body;
  var docElem = doc && doc.documentElement;
  // 根据 GBS 最新数据，A-Grade Browsers 都已支持 getBoundingClientRect 方法，不用再考虑传统的实现方式
  box = elem.getBoundingClientRect();

  // 注：jQuery 还考虑减去 docElem.clientLeft/clientTop
  // 但测试发现，这样反而会导致当 html 和 body 有边距/边框样式时，获取的值不正确
  // 此外，ie6 会忽略 html 的 margin 值，幸运地是没有谁会去设置 html 的 margin

  x = box.left;
  y = box.top;

  // In IE, most of the time, 2 extra pixels are added to the top and left
  // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
  // IE6 standards mode, this border can be overridden by setting the
  // document element's border to zero -- thus, we cannot rely on the
  // offset always being 2 pixels.

  // In quirks mode, the offset can be determined by querying the body's
  // clientLeft/clientTop, but in standards mode, it is found by querying
  // the document element's clientLeft/clientTop.  Since we already called
  // getClientBoundingRect we have already forced a reflow, so it is not
  // too expensive just to query them all.

  // ie 下应该减去窗口的边框吧，毕竟默认 absolute 都是相对窗口定位的
  // 窗口边框标准是设 documentElement ,quirks 时设置 body
  // 最好禁止在 body 和 html 上边框 ，但 ie < 9 html 默认有 2px ，减去
  // 但是非 ie 不可能设置窗口边框，body html 也不是窗口 ,ie 可以通过 html,body 设置
  // 标准 ie 下 docElem.clientTop 就是 border-top
  // ie7 html 即窗口边框改变不了。永远为 2
  // 但标准 firefox/chrome/ie9 下 docElem.clientTop 是窗口边框，即使设了 border-top 也为 0

  x -= docElem.clientLeft || body.clientLeft || 0;
  y -= docElem.clientTop || body.clientTop || 0;

  return {
    left: x,
    top: y
  };
}

function getScroll(w, top) {
  var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
  var method = 'scroll' + (top ? 'Top' : 'Left');
  if (typeof ret !== 'number') {
    var d = w.document;
    // ie6,7,8 standard mode
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      // quirks mode
      ret = d.body[method];
    }
  }
  return ret;
}

function getScrollLeft(w) {
  return getScroll(w);
}

function getScrollTop(w) {
  return getScroll(w, true);
}

function getOffset(el) {
  var pos = getClientPosition(el);
  var doc = el.ownerDocument;
  var w = doc.defaultView || doc.parentWindow;
  pos.left += getScrollLeft(w);
  pos.top += getScrollTop(w);
  return pos;
}

/**
 * A crude way of determining if an object is a window
 * @member util
 */
function isWindow(obj) {
  // must use == for ie8
  /* eslint eqeqeq:0 */
  return obj !== null && obj !== undefined && obj == obj.window;
}

function getDocument(node) {
  if (isWindow(node)) {
    return node.document;
  }
  if (node.nodeType === 9) {
    return node;
  }
  return node.ownerDocument;
}

function _getComputedStyle(elem, name, cs) {
  var computedStyle = cs;
  var val = '';
  var d = getDocument(elem);
  computedStyle = computedStyle || d.defaultView.getComputedStyle(elem, null);

  // https://github.com/kissyteam/kissy/issues/61
  if (computedStyle) {
    val = computedStyle.getPropertyValue(name) || computedStyle[name];
  }

  return val;
}

var _RE_NUM_NO_PX = new RegExp('^(' + RE_NUM + ')(?!px)[a-z%]+$', 'i');
var RE_POS = /^(top|right|bottom|left)$/;
var CURRENT_STYLE = 'currentStyle';
var RUNTIME_STYLE = 'runtimeStyle';
var LEFT = 'left';
var PX = 'px';

function _getComputedStyleIE(elem, name) {
  // currentStyle maybe null
  // http://msdn.microsoft.com/en-us/library/ms535231.aspx
  var ret = elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name];

  // 当 width/height 设置为百分比时，通过 pixelLeft 方式转换的 width/height 值
  // 一开始就处理了! CUSTOM_STYLE.height,CUSTOM_STYLE.width ,cssHook 解决@2011-08-19
  // 在 ie 下不对，需要直接用 offset 方式
  // borderWidth 等值也有问题，但考虑到 borderWidth 设为百分比的概率很小，这里就不考虑了

  // From the awesome hack by Dean Edwards
  // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
  // If we're not dealing with a regular pixel number
  // but a number that has a weird ending, we need to convert it to pixels
  // exclude left right for relativity
  if (_RE_NUM_NO_PX.test(ret) && !RE_POS.test(name)) {
    // Remember the original values
    var style = elem.style;
    var left = style[LEFT];
    var rsLeft = elem[RUNTIME_STYLE][LEFT];

    // prevent flashing of content
    elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT];

    // Put in the new values to get a computed value out
    style[LEFT] = name === 'fontSize' ? '1em' : ret || 0;
    ret = style.pixelLeft + PX;

    // Revert the changed values
    style[LEFT] = left;

    elem[RUNTIME_STYLE][LEFT] = rsLeft;
  }
  return ret === '' ? 'auto' : ret;
}

if (typeof window !== 'undefined') {
  getComputedStyleX = window.getComputedStyle ? _getComputedStyle : _getComputedStyleIE;
}

function getOffsetDirection(dir, option) {
  if (dir === 'left') {
    return option.useCssRight ? 'right' : dir;
  }
  return option.useCssBottom ? 'bottom' : dir;
}

function oppositeOffsetDirection(dir) {
  if (dir === 'left') {
    return 'right';
  } else if (dir === 'right') {
    return 'left';
  } else if (dir === 'top') {
    return 'bottom';
  } else if (dir === 'bottom') {
    return 'top';
  }
}

// 设置 elem 相对 elem.ownerDocument 的坐标
function setLeftTop(elem, offset, option) {
  // set position first, in-case top/left are set even on static elem
  if (css(elem, 'position') === 'static') {
    elem.style.position = 'relative';
  }
  var presetH = -999;
  var presetV = -999;
  var horizontalProperty = getOffsetDirection('left', option);
  var verticalProperty = getOffsetDirection('top', option);
  var oppositeHorizontalProperty = oppositeOffsetDirection(horizontalProperty);
  var oppositeVerticalProperty = oppositeOffsetDirection(verticalProperty);

  if (horizontalProperty !== 'left') {
    presetH = 999;
  }

  if (verticalProperty !== 'top') {
    presetV = 999;
  }
  var originalTransition = '';
  var originalOffset = getOffset(elem);
  if ('left' in offset || 'top' in offset) {
    originalTransition = Object(__WEBPACK_IMPORTED_MODULE_0__propertyUtils__["c" /* getTransitionProperty */])(elem) || '';
    Object(__WEBPACK_IMPORTED_MODULE_0__propertyUtils__["e" /* setTransitionProperty */])(elem, 'none');
  }
  if ('left' in offset) {
    elem.style[oppositeHorizontalProperty] = '';
    elem.style[horizontalProperty] = presetH + 'px';
  }
  if ('top' in offset) {
    elem.style[oppositeVerticalProperty] = '';
    elem.style[verticalProperty] = presetV + 'px';
  }
  // force relayout
  forceRelayout(elem);
  var old = getOffset(elem);
  var originalStyle = {};
  for (var key in offset) {
    if (offset.hasOwnProperty(key)) {
      var dir = getOffsetDirection(key, option);
      var preset = key === 'left' ? presetH : presetV;
      var off = originalOffset[key] - old[key];
      if (dir === key) {
        originalStyle[dir] = preset + off;
      } else {
        originalStyle[dir] = preset - off;
      }
    }
  }
  css(elem, originalStyle);
  // force relayout
  forceRelayout(elem);
  if ('left' in offset || 'top' in offset) {
    Object(__WEBPACK_IMPORTED_MODULE_0__propertyUtils__["e" /* setTransitionProperty */])(elem, originalTransition);
  }
  var ret = {};
  for (var _key in offset) {
    if (offset.hasOwnProperty(_key)) {
      var _dir = getOffsetDirection(_key, option);
      var _off = offset[_key] - originalOffset[_key];
      if (_key === _dir) {
        ret[_dir] = originalStyle[_dir] + _off;
      } else {
        ret[_dir] = originalStyle[_dir] - _off;
      }
    }
  }
  css(elem, ret);
}

function setTransform(elem, offset) {
  var originalOffset = getOffset(elem);
  var originalXY = Object(__WEBPACK_IMPORTED_MODULE_0__propertyUtils__["b" /* getTransformXY */])(elem);
  var resultXY = { x: originalXY.x, y: originalXY.y };
  if ('left' in offset) {
    resultXY.x = originalXY.x + offset.left - originalOffset.left;
  }
  if ('top' in offset) {
    resultXY.y = originalXY.y + offset.top - originalOffset.top;
  }
  Object(__WEBPACK_IMPORTED_MODULE_0__propertyUtils__["d" /* setTransformXY */])(elem, resultXY);
}

function setOffset(elem, offset, option) {
  if (option.ignoreShake) {
    var oriOffset = getOffset(elem);

    var oLeft = oriOffset.left.toFixed(0);
    var oTop = oriOffset.top.toFixed(0);
    var tLeft = offset.left.toFixed(0);
    var tTop = offset.top.toFixed(0);

    if (oLeft === tLeft && oTop === tTop) {
      return;
    }
  }

  if (option.useCssRight || option.useCssBottom) {
    setLeftTop(elem, offset, option);
  } else if (option.useCssTransform && Object(__WEBPACK_IMPORTED_MODULE_0__propertyUtils__["a" /* getTransformName */])() in document.body.style) {
    setTransform(elem, offset, option);
  } else {
    setLeftTop(elem, offset, option);
  }
}

function each(arr, fn) {
  for (var i = 0; i < arr.length; i++) {
    fn(arr[i]);
  }
}

function isBorderBoxFn(elem) {
  return getComputedStyleX(elem, 'boxSizing') === 'border-box';
}

var BOX_MODELS = ['margin', 'border', 'padding'];
var CONTENT_INDEX = -1;
var PADDING_INDEX = 2;
var BORDER_INDEX = 1;
var MARGIN_INDEX = 0;

function swap(elem, options, callback) {
  var old = {};
  var style = elem.style;
  var name = void 0;

  // Remember the old values, and insert the new ones
  for (name in options) {
    if (options.hasOwnProperty(name)) {
      old[name] = style[name];
      style[name] = options[name];
    }
  }

  callback.call(elem);

  // Revert the old values
  for (name in options) {
    if (options.hasOwnProperty(name)) {
      style[name] = old[name];
    }
  }
}

function getPBMWidth(elem, props, which) {
  var value = 0;
  var prop = void 0;
  var j = void 0;
  var i = void 0;
  for (j = 0; j < props.length; j++) {
    prop = props[j];
    if (prop) {
      for (i = 0; i < which.length; i++) {
        var cssProp = void 0;
        if (prop === 'border') {
          cssProp = '' + prop + which[i] + 'Width';
        } else {
          cssProp = prop + which[i];
        }
        value += parseFloat(getComputedStyleX(elem, cssProp)) || 0;
      }
    }
  }
  return value;
}

var domUtils = {};

each(['Width', 'Height'], function (name) {
  domUtils['doc' + name] = function (refWin) {
    var d = refWin.document;
    return Math.max(
    // firefox chrome documentElement.scrollHeight< body.scrollHeight
    // ie standard mode : documentElement.scrollHeight> body.scrollHeight
    d.documentElement['scroll' + name],
    // quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
    d.body['scroll' + name], domUtils['viewport' + name](d));
  };

  domUtils['viewport' + name] = function (win) {
    // pc browser includes scrollbar in window.innerWidth
    var prop = 'client' + name;
    var doc = win.document;
    var body = doc.body;
    var documentElement = doc.documentElement;
    var documentElementProp = documentElement[prop];
    // 标准模式取 documentElement
    // backcompat 取 body
    return doc.compatMode === 'CSS1Compat' && documentElementProp || body && body[prop] || documentElementProp;
  };
});

/*
 得到元素的大小信息
 @param elem
 @param name
 @param {String} [extra]  'padding' : (css width) + padding
 'border' : (css width) + padding + border
 'margin' : (css width) + padding + border + margin
 */
function getWH(elem, name, ex) {
  var extra = ex;
  if (isWindow(elem)) {
    return name === 'width' ? domUtils.viewportWidth(elem) : domUtils.viewportHeight(elem);
  } else if (elem.nodeType === 9) {
    return name === 'width' ? domUtils.docWidth(elem) : domUtils.docHeight(elem);
  }
  var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
  var borderBoxValue = name === 'width' ? elem.getBoundingClientRect().width : elem.getBoundingClientRect().height;
  var computedStyle = getComputedStyleX(elem);
  var isBorderBox = isBorderBoxFn(elem, computedStyle);
  var cssBoxValue = 0;
  if (borderBoxValue === null || borderBoxValue === undefined || borderBoxValue <= 0) {
    borderBoxValue = undefined;
    // Fall back to computed then un computed css if necessary
    cssBoxValue = getComputedStyleX(elem, name);
    if (cssBoxValue === null || cssBoxValue === undefined || Number(cssBoxValue) < 0) {
      cssBoxValue = elem.style[name] || 0;
    }
    // Normalize '', auto, and prepare for extra
    cssBoxValue = parseFloat(cssBoxValue) || 0;
  }
  if (extra === undefined) {
    extra = isBorderBox ? BORDER_INDEX : CONTENT_INDEX;
  }
  var borderBoxValueOrIsBorderBox = borderBoxValue !== undefined || isBorderBox;
  var val = borderBoxValue || cssBoxValue;
  if (extra === CONTENT_INDEX) {
    if (borderBoxValueOrIsBorderBox) {
      return val - getPBMWidth(elem, ['border', 'padding'], which, computedStyle);
    }
    return cssBoxValue;
  } else if (borderBoxValueOrIsBorderBox) {
    if (extra === BORDER_INDEX) {
      return val;
    }
    return val + (extra === PADDING_INDEX ? -getPBMWidth(elem, ['border'], which, computedStyle) : getPBMWidth(elem, ['margin'], which, computedStyle));
  }
  return cssBoxValue + getPBMWidth(elem, BOX_MODELS.slice(extra), which, computedStyle);
}

var cssShow = {
  position: 'absolute',
  visibility: 'hidden',
  display: 'block'
};

// fix #119 : https://github.com/kissyteam/kissy/issues/119
function getWHIgnoreDisplay() {
  for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var val = void 0;
  var elem = args[0];
  // in case elem is window
  // elem.offsetWidth === undefined
  if (elem.offsetWidth !== 0) {
    val = getWH.apply(undefined, args);
  } else {
    swap(elem, cssShow, function () {
      val = getWH.apply(undefined, args);
    });
  }
  return val;
}

each(['width', 'height'], function (name) {
  var first = name.charAt(0).toUpperCase() + name.slice(1);
  domUtils['outer' + first] = function (el, includeMargin) {
    return el && getWHIgnoreDisplay(el, name, includeMargin ? MARGIN_INDEX : BORDER_INDEX);
  };
  var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

  domUtils[name] = function (elem, v) {
    var val = v;
    if (val !== undefined) {
      if (elem) {
        var computedStyle = getComputedStyleX(elem);
        var isBorderBox = isBorderBoxFn(elem);
        if (isBorderBox) {
          val += getPBMWidth(elem, ['padding', 'border'], which, computedStyle);
        }
        return css(elem, name, val);
      }
      return undefined;
    }
    return elem && getWHIgnoreDisplay(elem, name, CONTENT_INDEX);
  };
});

function mix(to, from) {
  for (var i in from) {
    if (from.hasOwnProperty(i)) {
      to[i] = from[i];
    }
  }
  return to;
}

var utils = {
  getWindow: function getWindow(node) {
    if (node && node.document && node.setTimeout) {
      return node;
    }
    var doc = node.ownerDocument || node;
    return doc.defaultView || doc.parentWindow;
  },

  getDocument: getDocument,
  offset: function offset(el, value, option) {
    if (typeof value !== 'undefined') {
      setOffset(el, value, option || {});
    } else {
      return getOffset(el);
    }
  },

  isWindow: isWindow,
  each: each,
  css: css,
  clone: function clone(obj) {
    var i = void 0;
    var ret = {};
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret[i] = obj[i];
      }
    }
    var overflow = obj.overflow;
    if (overflow) {
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          ret.overflow[i] = obj.overflow[i];
        }
      }
    }
    return ret;
  },

  mix: mix,
  getWindowScrollLeft: function getWindowScrollLeft(w) {
    return getScrollLeft(w);
  },
  getWindowScrollTop: function getWindowScrollTop(w) {
    return getScrollTop(w);
  },
  merge: function merge() {
    var ret = {};

    for (var _len2 = arguments.length, args = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
      args[_key3] = arguments[_key3];
    }

    for (var i = 0; i < args.length; i++) {
      utils.mix(ret, args[i]);
    }
    return ret;
  },

  viewportWidth: 0,
  viewportHeight: 0
};

mix(utils, domUtils);

/* harmony default export */ __webpack_exports__["a"] = (utils);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(12);
var createDesc = __webpack_require__(26);
module.exports = __webpack_require__(15) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(22);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(64);
var defined = __webpack_require__(35);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toArray;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);


function toArray(children) {
  var ret = [];
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.Children.forEach(children, function (c) {
    ret.push(c);
  });
  return ret;
}

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(66);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(63);
var enumBugKeys = __webpack_require__(42);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(142)
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(141)))

/***/ }),
/* 34 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(93);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(22);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(21);
var dPs = __webpack_require__(95);
var enumBugKeys = __webpack_require__(42);
var IE_PROTO = __webpack_require__(40)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(61)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(98).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(41)('keys');
var uid = __webpack_require__(31);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(7);
var global = __webpack_require__(11);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(29) ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 42 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(12).f;
var has = __webpack_require__(16);
var TAG = __webpack_require__(8)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(35);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 45 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(8);


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(11);
var core = __webpack_require__(7);
var LIBRARY = __webpack_require__(29);
var wksExt = __webpack_require__(46);
var defineProperty = __webpack_require__(12).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Animate__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AnimateChild__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CSSMotion__ = __webpack_require__(167);
/* unused harmony reexport AnimateChild */
/* unused harmony reexport CSSMotion */






/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__Animate__["a" /* default */]);

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getStyleProperty */
/* harmony export (immutable) */ __webpack_exports__["c"] = getStyleValue;
/* unused harmony export getVendorPrefixes */
/* unused harmony export getVendorPrefixedEventName */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return animationEndName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return transitionEndName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return supportTransition; });
/* harmony export (immutable) */ __webpack_exports__["e"] = mergeChildren;
/* harmony export (immutable) */ __webpack_exports__["b"] = cloneProps;
/* harmony export (immutable) */ __webpack_exports__["d"] = getTransitionName;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_util_es_Children_toArray__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fbjs_lib_ExecutionEnvironment__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fbjs_lib_ExecutionEnvironment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_fbjs_lib_ExecutionEnvironment__);



// =================== Style ====================
var stylePrefixes = ['-webkit-', '-moz-', '-o-', 'ms-', ''];

function getStyleProperty(node, name) {
  // old ff need null, https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
  var style = window.getComputedStyle(node, null);
  var ret = '';
  for (var i = 0; i < stylePrefixes.length; i++) {
    ret = style.getPropertyValue(stylePrefixes[i] + name);
    if (ret) {
      break;
    }
  }
  return ret;
}

function getStyleValue(node, name) {
  return parseFloat(getStyleProperty(node, name));
}

// ================= Transition =================
// Event wrapper. Copy from react source code
function makePrefixMap(styleProp, eventName) {
  var prefixes = {};

  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes['Webkit' + styleProp] = 'webkit' + eventName;
  prefixes['Moz' + styleProp] = 'moz' + eventName;
  prefixes['ms' + styleProp] = 'MS' + eventName;
  prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();

  return prefixes;
}

function getVendorPrefixes(domSupport, win) {
  var prefixes = {
    animationend: makePrefixMap('Animation', 'AnimationEnd'),
    transitionend: makePrefixMap('Transition', 'TransitionEnd')
  };

  if (domSupport) {
    if (!('AnimationEvent' in win)) {
      delete prefixes.animationend.animation;
    }

    if (!('TransitionEvent' in win)) {
      delete prefixes.transitionend.transition;
    }
  }

  return prefixes;
}

var vendorPrefixes = getVendorPrefixes(__WEBPACK_IMPORTED_MODULE_1_fbjs_lib_ExecutionEnvironment__["canUseDOM"], typeof window !== 'undefined' ? window : {});

var style = {};

if (__WEBPACK_IMPORTED_MODULE_1_fbjs_lib_ExecutionEnvironment__["canUseDOM"]) {
  style = document.createElement('div').style;
}

var prefixedEventNames = {};

function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  }

  var prefixMap = vendorPrefixes[eventName];

  if (prefixMap) {
    var stylePropList = Object.keys(prefixMap);
    var len = stylePropList.length;
    for (var i = 0; i < len; i += 1) {
      var styleProp = stylePropList[i];
      if (Object.prototype.hasOwnProperty.call(prefixMap, styleProp) && styleProp in style) {
        prefixedEventNames[eventName] = prefixMap[styleProp];
        return prefixedEventNames[eventName];
      }
    }
  }

  return '';
}

var animationEndName = getVendorPrefixedEventName('animationend');
var transitionEndName = getVendorPrefixedEventName('transitionend');
var supportTransition = !!(animationEndName && transitionEndName);

// ==================== Node ====================
/**
 * [Legacy] Find the same children in both prev & next list.
 * Insert not find one before the find one, otherwise in the end. For example:
 * - prev: [1,2,3]
 * - next: [2,4]
 * -> [1,2,4,3]
 */
function mergeChildren(prev, next) {
  var prevList = Object(__WEBPACK_IMPORTED_MODULE_0_rc_util_es_Children_toArray__["a" /* default */])(prev);
  var nextList = Object(__WEBPACK_IMPORTED_MODULE_0_rc_util_es_Children_toArray__["a" /* default */])(next);

  // Skip if is single children
  if (prevList.length === 1 && nextList.length === 1 && prevList[0].key === nextList[0].key) {
    return nextList;
  }

  var mergeList = [];
  var nextChildrenMap = {};
  var missMatchChildrenList = [];

  // Fill matched prev node into next node map
  prevList.forEach(function (prevNode) {
    if (prevNode && nextList.some(function (_ref) {
      var key = _ref.key;
      return key === prevNode.key;
    })) {
      if (missMatchChildrenList.length) {
        nextChildrenMap[prevNode.key] = missMatchChildrenList;
        missMatchChildrenList = [];
      }
    } else {
      missMatchChildrenList.push(prevNode);
    }
  });

  // Insert prev node before the matched next node
  nextList.forEach(function (nextNode) {
    if (nextNode && nextChildrenMap[nextNode.key]) {
      mergeList = mergeList.concat(nextChildrenMap[nextNode.key]);
    }
    mergeList.push(nextNode);
  });

  mergeList = mergeList.concat(missMatchChildrenList);

  return mergeList;
}

function cloneProps(props, propList) {
  var newProps = {};
  propList.forEach(function (prop) {
    if (prop in props) {
      newProps[prop] = props[prop];
    }
  });

  return newProps;
}

function getTransitionName(transitionName, transitionType) {
  if (!transitionName) return null;

  if (typeof transitionName === 'object') {
    var type = transitionType.replace(/-\w/g, function (match) {
      return match[1].toUpperCase();
    });
    return transitionName[type];
  }

  return transitionName + '-' + transitionType;
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["p"] = warnOnlyTreeNode;
/* harmony export (immutable) */ __webpack_exports__["b"] = arrDel;
/* harmony export (immutable) */ __webpack_exports__["a"] = arrAdd;
/* harmony export (immutable) */ __webpack_exports__["o"] = posToArr;
/* harmony export (immutable) */ __webpack_exports__["l"] = getPosition;
/* unused harmony export isTreeNode */
/* harmony export (immutable) */ __webpack_exports__["k"] = getNodeChildren;
/* unused harmony export isCheckDisabled */
/* unused harmony export traverseTreeNodes */
/* harmony export (immutable) */ __webpack_exports__["m"] = mapChildren;
/* harmony export (immutable) */ __webpack_exports__["j"] = getDragNodesKeys;
/* harmony export (immutable) */ __webpack_exports__["c"] = calcDropPosition;
/* harmony export (immutable) */ __webpack_exports__["d"] = calcSelectedKeys;
/* harmony export (immutable) */ __webpack_exports__["g"] = convertDataToTree;
/* harmony export (immutable) */ __webpack_exports__["h"] = convertTreeToEntities;
/* harmony export (immutable) */ __webpack_exports__["n"] = parseCheckedKeys;
/* harmony export (immutable) */ __webpack_exports__["e"] = conductCheck;
/* harmony export (immutable) */ __webpack_exports__["f"] = conductExpandParent;
/* harmony export (immutable) */ __webpack_exports__["i"] = getDataAndAria;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_objectWithoutProperties__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_objectWithoutProperties___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_objectWithoutProperties__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_util_es_Children_toArray__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_warning__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_warning___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_warning__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__TreeNode__ = __webpack_require__(81);






var DRAG_SIDE_RANGE = 0.25;
var DRAG_MIN_GAP = 2;

var onlyTreeNodeWarned = false;

function warnOnlyTreeNode() {
  if (onlyTreeNodeWarned) return;

  onlyTreeNodeWarned = true;
  __WEBPACK_IMPORTED_MODULE_3_warning___default()(false, 'Tree only accept TreeNode as children.');
}

function arrDel(list, value) {
  var clone = list.slice();
  var index = clone.indexOf(value);
  if (index >= 0) {
    clone.splice(index, 1);
  }
  return clone;
}

function arrAdd(list, value) {
  var clone = list.slice();
  if (clone.indexOf(value) === -1) {
    clone.push(value);
  }
  return clone;
}

function posToArr(pos) {
  return pos.split('-');
}

function getPosition(level, index) {
  return level + '-' + index;
}

function isTreeNode(node) {
  return node && node.type && node.type.isTreeNode;
}

function getNodeChildren(children) {
  return Object(__WEBPACK_IMPORTED_MODULE_2_rc_util_es_Children_toArray__["a" /* default */])(children).filter(isTreeNode);
}

function isCheckDisabled(node) {
  var _ref = node.props || {},
      disabled = _ref.disabled,
      disableCheckbox = _ref.disableCheckbox;

  return !!(disabled || disableCheckbox);
}

function traverseTreeNodes(treeNodes, callback) {
  function processNode(node, index, parent) {
    var children = node ? node.props.children : treeNodes;
    var pos = node ? getPosition(parent.pos, index) : 0;

    // Filter children
    var childList = getNodeChildren(children);

    // Process node if is not root
    if (node) {
      var data = {
        node: node,
        index: index,
        pos: pos,
        key: node.key || pos,
        parentPos: parent.node ? parent.pos : null
      };

      callback(data);
    }

    // Process children node
    __WEBPACK_IMPORTED_MODULE_1_react__["Children"].forEach(childList, function (subNode, subIndex) {
      processNode(subNode, subIndex, { node: node, pos: pos });
    });
  }

  processNode(null);
}

/**
 * Use `rc-util` `toArray` to get the children list which keeps the key.
 * And return single node if children is only one(This can avoid `key` missing check).
 */
function mapChildren(children, func) {
  var list = Object(__WEBPACK_IMPORTED_MODULE_2_rc_util_es_Children_toArray__["a" /* default */])(children).map(func);
  if (list.length === 1) {
    return list[0];
  }
  return list;
}

function getDragNodesKeys(treeNodes, node) {
  var _node$props = node.props,
      eventKey = _node$props.eventKey,
      pos = _node$props.pos;

  var dragNodesKeys = [];

  traverseTreeNodes(treeNodes, function (_ref2) {
    var key = _ref2.key;

    dragNodesKeys.push(key);
  });
  dragNodesKeys.push(eventKey || pos);
  return dragNodesKeys;
}

// Only used when drag, not affect SSR.
function calcDropPosition(event, treeNode) {
  var clientY = event.clientY;

  var _treeNode$selectHandl = treeNode.selectHandle.getBoundingClientRect(),
      top = _treeNode$selectHandl.top,
      bottom = _treeNode$selectHandl.bottom,
      height = _treeNode$selectHandl.height;

  var des = Math.max(height * DRAG_SIDE_RANGE, DRAG_MIN_GAP);

  if (clientY <= top + des) {
    return -1;
  } else if (clientY >= bottom - des) {
    return 1;
  }

  return 0;
}

/**
 * Return selectedKeys according with multiple prop
 * @param selectedKeys
 * @param props
 * @returns [string]
 */
function calcSelectedKeys(selectedKeys, props) {
  if (!selectedKeys) return undefined;

  var multiple = props.multiple;

  if (multiple) {
    return selectedKeys.slice();
  }

  if (selectedKeys.length) {
    return [selectedKeys[0]];
  }
  return selectedKeys;
}

/**
 * Since React internal will convert key to string,
 * we need do this to avoid `checkStrictly` use number match
 */
function keyListToString(keyList) {
  if (!keyList) return keyList;
  return keyList.map(function (key) {
    return String(key);
  });
}

var internalProcessProps = function internalProcessProps(props) {
  return props;
};
function convertDataToTree(treeData, processer) {
  if (!treeData) return [];

  var _ref3 = processer || {},
      _ref3$processProps = _ref3.processProps,
      processProps = _ref3$processProps === undefined ? internalProcessProps : _ref3$processProps;

  var list = Array.isArray(treeData) ? treeData : [treeData];
  return list.map(function (_ref4) {
    var children = _ref4.children,
        props = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_objectWithoutProperties___default()(_ref4, ['children']);

    var childrenNodes = convertDataToTree(children, processer);

    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_4__TreeNode__["a" /* default */],
      processProps(props),
      childrenNodes
    );
  });
}

// TODO: ========================= NEW LOGIC =========================
/**
 * Calculate treeNodes entities. `processTreeEntity` is used for `rc-tree-select`
 * @param treeNodes
 * @param processTreeEntity  User can customize the entity
 */
function convertTreeToEntities(treeNodes) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      initWrapper = _ref5.initWrapper,
      processEntity = _ref5.processEntity,
      onProcessFinished = _ref5.onProcessFinished;

  var posEntities = {};
  var keyEntities = {};
  var wrapper = {
    posEntities: posEntities,
    keyEntities: keyEntities
  };

  if (initWrapper) {
    wrapper = initWrapper(wrapper) || wrapper;
  }

  traverseTreeNodes(treeNodes, function (item) {
    var node = item.node,
        index = item.index,
        pos = item.pos,
        key = item.key,
        parentPos = item.parentPos;

    var entity = { node: node, index: index, key: key, pos: pos };

    posEntities[pos] = entity;
    keyEntities[key] = entity;

    // Fill children
    entity.parent = posEntities[parentPos];
    if (entity.parent) {
      entity.parent.children = entity.parent.children || [];
      entity.parent.children.push(entity);
    }

    if (processEntity) {
      processEntity(entity, wrapper);
    }
  });

  if (onProcessFinished) {
    onProcessFinished(wrapper);
  }

  return wrapper;
}

/**
 * Parse `checkedKeys` to { checkedKeys, halfCheckedKeys } style
 */
function parseCheckedKeys(keys) {
  if (!keys) {
    return null;
  }

  // Convert keys to object format
  var keyProps = void 0;
  if (Array.isArray(keys)) {
    // [Legacy] Follow the api doc
    keyProps = {
      checkedKeys: keys,
      halfCheckedKeys: undefined
    };
  } else if (typeof keys === 'object') {
    keyProps = {
      checkedKeys: keys.checked || undefined,
      halfCheckedKeys: keys.halfChecked || undefined
    };
  } else {
    __WEBPACK_IMPORTED_MODULE_3_warning___default()(false, '`checkedKeys` is not an array or an object');
    return null;
  }

  keyProps.checkedKeys = keyListToString(keyProps.checkedKeys);
  keyProps.halfCheckedKeys = keyListToString(keyProps.halfCheckedKeys);

  return keyProps;
}

/**
 * Conduct check state by the keyList. It will conduct up & from the provided key.
 * If the conduct path reach the disabled or already checked / unchecked node will stop conduct.
 * @param keyList       list of keys
 * @param isCheck       is check the node or not
 * @param keyEntities   parsed by `convertTreeToEntities` function in Tree
 * @param checkStatus   Can pass current checked status for process (usually for uncheck operation)
 * @returns {{checkedKeys: [], halfCheckedKeys: []}}
 */
function conductCheck(keyList, isCheck, keyEntities) {
  var checkStatus = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var checkedKeys = {};
  var halfCheckedKeys = {}; // Record the key has some child checked (include child half checked)

  (checkStatus.checkedKeys || []).forEach(function (key) {
    checkedKeys[key] = true;
  });

  (checkStatus.halfCheckedKeys || []).forEach(function (key) {
    halfCheckedKeys[key] = true;
  });

  // Conduct up
  function conductUp(key) {
    if (checkedKeys[key] === isCheck) return;

    var entity = keyEntities[key];
    if (!entity) return;

    var children = entity.children,
        parent = entity.parent,
        node = entity.node;


    if (isCheckDisabled(node)) return;

    // Check child node checked status
    var everyChildChecked = true;
    var someChildChecked = false; // Child checked or half checked

    (children || []).filter(function (child) {
      return !isCheckDisabled(child.node);
    }).forEach(function (_ref6) {
      var childKey = _ref6.key;

      var childChecked = checkedKeys[childKey];
      var childHalfChecked = halfCheckedKeys[childKey];

      if (childChecked || childHalfChecked) someChildChecked = true;
      if (!childChecked) everyChildChecked = false;
    });

    // Update checked status
    if (isCheck) {
      checkedKeys[key] = everyChildChecked;
    } else {
      checkedKeys[key] = false;
    }
    halfCheckedKeys[key] = someChildChecked;

    if (parent) {
      conductUp(parent.key);
    }
  }

  // Conduct down
  function conductDown(key) {
    if (checkedKeys[key] === isCheck) return;

    var entity = keyEntities[key];
    if (!entity) return;

    var children = entity.children,
        node = entity.node;


    if (isCheckDisabled(node)) return;

    checkedKeys[key] = isCheck;

    (children || []).forEach(function (child) {
      conductDown(child.key);
    });
  }

  function conduct(key) {
    var entity = keyEntities[key];

    if (!entity) {
      __WEBPACK_IMPORTED_MODULE_3_warning___default()(false, '\'' + key + '\' does not exist in the tree.');
      return;
    }

    var children = entity.children,
        parent = entity.parent,
        node = entity.node;

    checkedKeys[key] = isCheck;

    if (isCheckDisabled(node)) return;

    // Conduct down
    (children || []).filter(function (child) {
      return !isCheckDisabled(child.node);
    }).forEach(function (child) {
      conductDown(child.key);
    });

    // Conduct up
    if (parent) {
      conductUp(parent.key);
    }
  }

  (keyList || []).forEach(function (key) {
    conduct(key);
  });

  var checkedKeyList = [];
  var halfCheckedKeyList = [];

  // Fill checked list
  Object.keys(checkedKeys).forEach(function (key) {
    if (checkedKeys[key]) {
      checkedKeyList.push(key);
    }
  });

  // Fill half checked list
  Object.keys(halfCheckedKeys).forEach(function (key) {
    if (!checkedKeys[key] && halfCheckedKeys[key]) {
      halfCheckedKeyList.push(key);
    }
  });

  return {
    checkedKeys: checkedKeyList,
    halfCheckedKeys: halfCheckedKeyList
  };
}

/**
 * If user use `autoExpandParent` we should get the list of parent node
 * @param keyList
 * @param keyEntities
 */
function conductExpandParent(keyList, keyEntities) {
  var expandedKeys = {};

  function conductUp(key) {
    if (expandedKeys[key]) return;

    var entity = keyEntities[key];
    if (!entity) return;

    expandedKeys[key] = true;

    var parent = entity.parent,
        node = entity.node;


    if (isCheckDisabled(node)) return;

    if (parent) {
      conductUp(parent.key);
    }
  }

  (keyList || []).forEach(function (key) {
    conductUp(key);
  });

  return Object.keys(expandedKeys);
}

/**
 * Returns only the data- and aria- key/value pairs
 * @param {object} props 
 */
function getDataAndAria(props) {
  return Object.keys(props).reduce(function (prev, key) {
    if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-') {
      prev[key] = props[key];
    }
    return prev;
  }, {});
}

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rc_tree__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__propTypes__ = __webpack_require__(84);





/**
 * SelectNode wrapped the tree node.
 * Let's use SelectNode instead of TreeNode
 * since TreeNode is so confuse here.
 */
var SelectNode = function SelectNode(props) {
  return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_rc_tree__["a" /* TreeNode */], props);
};

SelectNode.propTypes = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __WEBPACK_IMPORTED_MODULE_2_rc_tree__["a" /* TreeNode */].propTypes, {
  value: __WEBPACK_IMPORTED_MODULE_3__propTypes__["a" /* valueProp */]
});

// Let Tree trade as TreeNode to reuse this for performance saving.
SelectNode.isTreeNode = 1;

/* harmony default export */ __webpack_exports__["a"] = (SelectNode);

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SHOW_ALL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SHOW_PARENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SHOW_CHILD; });
var SHOW_ALL = 'SHOW_ALL';
var SHOW_PARENT = 'SHOW_PARENT';
var SHOW_CHILD = 'SHOW_CHILD';

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return selectorPropTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return selectorContextTypes; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_classnames__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react_lifecycles_compat__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__util__ = __webpack_require__(10);






/**
 * Input Box is in different position for different mode.
 * This not the same design as `Select` cause it's followed by antd 0.x `Select`.
 * We will not follow the new design immediately since antd 3.x is already released.
 *
 * So this file named as Selector to avoid confuse.
 */







var selectorPropTypes = {
  prefixCls: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  className: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  style: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.object,
  open: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  selectorValueList: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.array,
  allowClear: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  showArrow: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  onClick: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onBlur: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onFocus: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  removeSelected: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,

  // Pass by component
  ariaId: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  inputIcon: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func]),
  clearIcon: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func])
};

var selectorContextTypes = {
  onSelectorFocus: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func.isRequired,
  onSelectorBlur: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func.isRequired,
  onSelectorKeyDown: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func.isRequired,
  onSelectorClear: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func.isRequired
};

/* harmony default export */ __webpack_exports__["a"] = (function (modeName) {
  var BaseSelector = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(BaseSelector, _React$Component);

    function BaseSelector() {
      __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, BaseSelector);

      var _this = __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(this, (BaseSelector.__proto__ || Object.getPrototypeOf(BaseSelector)).call(this));

      _this.onFocus = function () {
        var _this$props = _this.props,
            onFocus = _this$props.onFocus,
            focused = _this$props.focused;
        var onSelectorFocus = _this.context.rcTreeSelect.onSelectorFocus;


        if (!focused) {
          onSelectorFocus();
        }

        if (onFocus) {
          onFocus.apply(undefined, arguments);
        }
      };

      _this.onBlur = function () {
        var onBlur = _this.props.onBlur;
        var onSelectorBlur = _this.context.rcTreeSelect.onSelectorBlur;

        // TODO: Not trigger when is inner component get focused

        onSelectorBlur();

        if (onBlur) {
          onBlur.apply(undefined, arguments);
        }
      };

      _this.focus = function () {
        _this.domRef.current.focus();
      };

      _this.blur = function () {
        _this.domRef.current.focus();
      };

      _this.domRef = Object(__WEBPACK_IMPORTED_MODULE_10__util__["g" /* createRef */])();
      return _this;
    }

    __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default()(BaseSelector, [{
      key: 'renderClear',
      value: function renderClear() {
        var _props = this.props,
            prefixCls = _props.prefixCls,
            allowClear = _props.allowClear,
            selectorValueList = _props.selectorValueList,
            clearIcon = _props.clearIcon;
        var onSelectorClear = this.context.rcTreeSelect.onSelectorClear;


        if (!allowClear || !selectorValueList.length || !selectorValueList[0].value) {
          return null;
        }

        return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'span',
          {
            key: 'clear',
            className: prefixCls + '-selection__clear',
            onClick: onSelectorClear
          },
          typeof clearIcon === 'function' ? __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(clearIcon, __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, this.props)) : clearIcon
        );
      }
    }, {
      key: 'renderArrow',
      value: function renderArrow() {
        var _props2 = this.props,
            prefixCls = _props2.prefixCls,
            showArrow = _props2.showArrow,
            inputIcon = _props2.inputIcon;

        if (!showArrow) {
          return null;
        }

        return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'span',
          {
            key: 'arrow',
            className: prefixCls + '-arrow',
            style: { outline: 'none' }
          },
          typeof inputIcon === 'function' ? __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(inputIcon, __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, this.props)) : inputIcon
        );
      }
    }, {
      key: 'render',
      value: function render() {
        var _classNames;

        var _props3 = this.props,
            prefixCls = _props3.prefixCls,
            className = _props3.className,
            style = _props3.style,
            open = _props3.open,
            focused = _props3.focused,
            disabled = _props3.disabled,
            allowClear = _props3.allowClear,
            onClick = _props3.onClick,
            ariaId = _props3.ariaId,
            renderSelection = _props3.renderSelection,
            renderPlaceholder = _props3.renderPlaceholder,
            tabIndex = _props3.tabIndex;
        var onSelectorKeyDown = this.context.rcTreeSelect.onSelectorKeyDown;


        var myTabIndex = tabIndex;
        if (disabled) {
          myTabIndex = null;
        }

        return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'span',
          {
            style: style,
            onClick: onClick,
            className: __WEBPACK_IMPORTED_MODULE_8_classnames___default()(className, prefixCls, (_classNames = {}, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-open', open), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-focused', open || focused), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-disabled', disabled), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-enabled', !disabled), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-allow-clear', allowClear), _classNames)),
            ref: this.domRef,
            role: 'combobox',
            'aria-expanded': open,
            'aria-owns': open ? ariaId : undefined,
            'aria-controls': open ? ariaId : undefined,
            'aria-haspopup': 'listbox',
            'aria-disabled': disabled,
            tabIndex: myTabIndex,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            onKeyDown: onSelectorKeyDown
          },
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            'span',
            {
              key: 'selection',
              className: __WEBPACK_IMPORTED_MODULE_8_classnames___default()(prefixCls + '-selection', prefixCls + '-selection--' + modeName)
            },
            renderSelection(),
            this.renderClear(),
            this.renderArrow(),
            renderPlaceholder && renderPlaceholder()
          )
        );
      }
    }]);

    return BaseSelector;
  }(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component);

  BaseSelector.propTypes = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, selectorPropTypes, {

    // Pass by HOC
    renderSelection: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func.isRequired,
    renderPlaceholder: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
    tabIndex: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.number
  });
  BaseSelector.contextTypes = {
    rcTreeSelect: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.shape(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, selectorContextTypes))
  };
  BaseSelector.defaultProps = {
    tabIndex: 0
  };


  Object(__WEBPACK_IMPORTED_MODULE_9_react_lifecycles_compat__["a" /* polyfill */])(BaseSelector);

  return BaseSelector;
});

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return popupContextTypes; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_lifecycles_compat__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_tree__ = __webpack_require__(83);










var popupContextTypes = {
  onPopupKeyDown: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,
  onTreeNodeSelect: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,
  onTreeNodeCheck: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired
};

var BasePopup = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(BasePopup, _React$Component);

  function BasePopup(props) {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, BasePopup);

    var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (BasePopup.__proto__ || Object.getPrototypeOf(BasePopup)).call(this));

    _initialiseProps.call(_this);

    var treeDefaultExpandAll = props.treeDefaultExpandAll,
        treeDefaultExpandedKeys = props.treeDefaultExpandedKeys,
        keyEntities = props.keyEntities;

    // TODO: make `expandedKeyList` control

    var expandedKeyList = treeDefaultExpandedKeys;
    if (treeDefaultExpandAll) {
      expandedKeyList = Object.keys(keyEntities);
    }

    _this.state = {
      keyList: [],
      expandedKeyList: expandedKeyList,
      // Cache `expandedKeyList` when tree is in filter. This is used in `getDerivedStateFromProps`
      cachedExpandedKeyList: [], // eslint-disable-line react/no-unused-state
      loadedKeys: []
    };
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(BasePopup, [{
    key: 'render',
    value: function render() {
      var _state = this.state,
          keyList = _state.keyList,
          expandedKeyList = _state.expandedKeyList,
          loadedKeys = _state.loadedKeys;
      var _props = this.props,
          prefixCls = _props.prefixCls,
          treeNodes = _props.treeNodes,
          filteredTreeNodes = _props.filteredTreeNodes,
          treeIcon = _props.treeIcon,
          treeLine = _props.treeLine,
          treeCheckable = _props.treeCheckable,
          treeCheckStrictly = _props.treeCheckStrictly,
          multiple = _props.multiple,
          ariaId = _props.ariaId,
          renderSearch = _props.renderSearch,
          switcherIcon = _props.switcherIcon,
          searchHalfCheckedKeys = _props.searchHalfCheckedKeys;
      var _context$rcTreeSelect = this.context.rcTreeSelect,
          onPopupKeyDown = _context$rcTreeSelect.onPopupKeyDown,
          onTreeNodeSelect = _context$rcTreeSelect.onTreeNodeSelect,
          onTreeNodeCheck = _context$rcTreeSelect.onTreeNodeCheck;


      var loadData = this.getLoadData();

      var treeProps = {};

      if (treeCheckable) {
        treeProps.checkedKeys = keyList;
      } else {
        treeProps.selectedKeys = keyList;
      }

      var $notFound = void 0;
      var $treeNodes = void 0;
      if (filteredTreeNodes) {
        if (filteredTreeNodes.length) {
          treeProps.checkStrictly = true;
          $treeNodes = filteredTreeNodes;

          // Fill halfCheckedKeys
          if (treeCheckable && !treeCheckStrictly) {
            treeProps.checkedKeys = {
              checked: keyList,
              halfChecked: searchHalfCheckedKeys
            };
          }
        } else {
          $notFound = this.renderNotFound();
        }
      } else if (!treeNodes.length) {
        $notFound = this.renderNotFound();
      } else {
        $treeNodes = treeNodes;
      }

      var $tree = void 0;
      if ($notFound) {
        $tree = $notFound;
      } else {
        $tree = __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_8_rc_tree__["b" /* default */],
          __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
            prefixCls: prefixCls + '-tree',
            showIcon: treeIcon,
            showLine: treeLine,
            selectable: !treeCheckable,
            checkable: treeCheckable,
            checkStrictly: treeCheckStrictly,
            multiple: multiple,
            loadData: loadData,
            loadedKeys: loadedKeys,
            expandedKeys: expandedKeyList,
            filterTreeNode: this.filterTreeNode,
            onSelect: onTreeNodeSelect,
            onCheck: onTreeNodeCheck,
            onExpand: this.onTreeExpand,
            onLoad: this.onLoad,
            switcherIcon: switcherIcon
          }, treeProps),
          $treeNodes
        );
      }

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          role: 'listbox',
          id: ariaId,
          onKeyDown: onPopupKeyDown,
          tabIndex: -1
        },
        renderSearch ? renderSearch() : null,
        $tree
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var _ref = prevState || {},
          _ref$prevProps = _ref.prevProps,
          prevProps = _ref$prevProps === undefined ? {} : _ref$prevProps,
          loadedKeys = _ref.loadedKeys,
          expandedKeyList = _ref.expandedKeyList,
          cachedExpandedKeyList = _ref.cachedExpandedKeyList;

      var valueList = nextProps.valueList,
          valueEntities = nextProps.valueEntities,
          keyEntities = nextProps.keyEntities,
          treeExpandedKeys = nextProps.treeExpandedKeys,
          filteredTreeNodes = nextProps.filteredTreeNodes,
          upperSearchValue = nextProps.upperSearchValue;


      var newState = {
        prevProps: nextProps
      };

      // Check value update
      if (valueList !== prevProps.valueList) {
        newState.keyList = valueList.map(function (_ref2) {
          var value = _ref2.value;
          return valueEntities[value];
        }).filter(function (entity) {
          return entity;
        }).map(function (_ref3) {
          var key = _ref3.key;
          return key;
        });
      }

      // Show all when tree is in filter mode
      if (!treeExpandedKeys && filteredTreeNodes && filteredTreeNodes.length && filteredTreeNodes !== prevProps.filteredTreeNodes) {
        newState.expandedKeyList = Object.keys(keyEntities);
      }

      // Cache `expandedKeyList` when filter set
      if (upperSearchValue && !prevProps.upperSearchValue) {
        newState.cachedExpandedKeyList = expandedKeyList;
      } else if (!upperSearchValue && prevProps.upperSearchValue && !treeExpandedKeys) {
        newState.expandedKeyList = cachedExpandedKeyList || [];
        newState.cachedExpandedKeyList = [];
      }

      // Use expandedKeys if provided
      if (prevProps.treeExpandedKeys !== treeExpandedKeys) {
        newState.expandedKeyList = treeExpandedKeys;
      }

      // Clean loadedKeys if key not exist in keyEntities anymore
      if (nextProps.loadData) {
        newState.loadedKeys = loadedKeys.filter(function (key) {
          return key in keyEntities;
        });
      }

      return newState;
    }

    /**
     * Not pass `loadData` when searching. To avoid loop ajax call makes browser crash.
     */


    /**
     * This method pass to Tree component which is used for add filtered class
     * in TreeNode > li
     */

  }]);

  return BasePopup;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

BasePopup.propTypes = {
  prefixCls: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  upperSearchValue: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  valueList: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.array,
  searchHalfCheckedKeys: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.array,
  valueEntities: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object,
  keyEntities: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object,
  treeIcon: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  treeLine: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  treeNodeFilterProp: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  treeCheckable: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool, __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node]),
  treeCheckStrictly: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  treeDefaultExpandAll: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  treeDefaultExpandedKeys: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.array,
  treeExpandedKeys: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.array,
  loadData: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,
  multiple: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  onTreeExpand: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,

  treeNodes: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node,
  filteredTreeNodes: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node,
  notFoundContent: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node,

  ariaId: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  switcherIcon: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func]),

  // HOC
  renderSearch: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,
  onTreeExpanded: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func
};
BasePopup.contextTypes = {
  rcTreeSelect: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.shape(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, popupContextTypes))
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onTreeExpand = function (expandedKeyList) {
    var _props2 = _this2.props,
        treeExpandedKeys = _props2.treeExpandedKeys,
        onTreeExpand = _props2.onTreeExpand,
        onTreeExpanded = _props2.onTreeExpanded;

    // Set uncontrolled state

    if (!treeExpandedKeys) {
      _this2.setState({ expandedKeyList: expandedKeyList }, onTreeExpanded);
    }

    if (onTreeExpand) {
      onTreeExpand(expandedKeyList);
    }
  };

  this.onLoad = function (loadedKeys) {
    _this2.setState({ loadedKeys: loadedKeys });
  };

  this.getLoadData = function () {
    var _props3 = _this2.props,
        loadData = _props3.loadData,
        upperSearchValue = _props3.upperSearchValue;

    if (upperSearchValue) return null;
    return loadData;
  };

  this.filterTreeNode = function (treeNode) {
    var _props4 = _this2.props,
        upperSearchValue = _props4.upperSearchValue,
        treeNodeFilterProp = _props4.treeNodeFilterProp;


    var filterVal = treeNode.props[treeNodeFilterProp];
    if (typeof filterVal === 'string') {
      return upperSearchValue && filterVal.toUpperCase().indexOf(upperSearchValue) !== -1;
    }

    return false;
  };

  this.renderNotFound = function () {
    var _props5 = _this2.props,
        prefixCls = _props5.prefixCls,
        notFoundContent = _props5.notFoundContent;


    return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
      'span',
      { className: prefixCls + '-not-found' },
      notFoundContent
    );
  };
};

Object(__WEBPACK_IMPORTED_MODULE_7_react_lifecycles_compat__["a" /* polyfill */])(BasePopup);

/* harmony default export */ __webpack_exports__["a"] = (BasePopup);

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(91), __esModule: true };

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(92)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(59)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(29);
var $export = __webpack_require__(14);
var redefine = __webpack_require__(62);
var hide = __webpack_require__(20);
var Iterators = __webpack_require__(27);
var $iterCreate = __webpack_require__(94);
var setToStringTag = __webpack_require__(43);
var getPrototypeOf = __webpack_require__(99);
var ITERATOR = __webpack_require__(8)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(15) && !__webpack_require__(25)(function () {
  return Object.defineProperty(__webpack_require__(61)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(22);
var document = __webpack_require__(11).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(20);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(16);
var toIObject = __webpack_require__(23);
var arrayIndexOf = __webpack_require__(96)(false);
var IE_PROTO = __webpack_require__(40)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(39);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(34);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(111), __esModule: true };

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(113);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(119);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(63);
var hiddenKeys = __webpack_require__(42).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(32);
var createDesc = __webpack_require__(26);
var toIObject = __webpack_require__(23);
var toPrimitive = __webpack_require__(37);
var has = __webpack_require__(16);
var IE8_DOM_DEFINE = __webpack_require__(60);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(15) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = addEventListenerWrap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_add_dom_event_listener__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_add_dom_event_listener___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_add_dom_event_listener__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);



function addEventListenerWrap(target, eventType, cb, option) {
  /* eslint camelcase: 2 */
  var callback = __WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.unstable_batchedUpdates ? function run(e) {
    __WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.unstable_batchedUpdates(cb, e);
  } : cb;
  return __WEBPACK_IMPORTED_MODULE_0_add_dom_event_listener___default()(target, eventType, callback, option);
}

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getVisibleRectForElement__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__adjustForViewport__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__getRegion__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__getElFuturePos__ = __webpack_require__(157);
/**
 * align dom node flexibly
 * @author yiminghe@gmail.com
 */







// http://yiminghe.iteye.com/blog/1124720

function isFailX(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.left < visibleRect.left || elFuturePos.left + elRegion.width > visibleRect.right;
}

function isFailY(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.top < visibleRect.top || elFuturePos.top + elRegion.height > visibleRect.bottom;
}

function isCompleteFailX(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.left > visibleRect.right || elFuturePos.left + elRegion.width < visibleRect.left;
}

function isCompleteFailY(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.top > visibleRect.bottom || elFuturePos.top + elRegion.height < visibleRect.top;
}

function flip(points, reg, map) {
  var ret = [];
  __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].each(points, function (p) {
    ret.push(p.replace(reg, function (m) {
      return map[m];
    }));
  });
  return ret;
}

function flipOffset(offset, index) {
  offset[index] = -offset[index];
  return offset;
}

function convertOffset(str, offsetLen) {
  var n = void 0;
  if (/%$/.test(str)) {
    n = parseInt(str.substring(0, str.length - 1), 10) / 100 * offsetLen;
  } else {
    n = parseInt(str, 10);
  }
  return n || 0;
}

function normalizeOffset(offset, el) {
  offset[0] = convertOffset(offset[0], el.width);
  offset[1] = convertOffset(offset[1], el.height);
}

/**
 * @param el
 * @param tgtRegion 参照节点所占的区域: { left, top, width, height }
 * @param align
 */
function doAlign(el, tgtRegion, align, isTgtRegionVisible) {
  var points = align.points;
  var offset = align.offset || [0, 0];
  var targetOffset = align.targetOffset || [0, 0];
  var overflow = align.overflow;
  var source = align.source || el;
  offset = [].concat(offset);
  targetOffset = [].concat(targetOffset);
  overflow = overflow || {};
  var newOverflowCfg = {};
  var fail = 0;
  // 当前节点可以被放置的显示区域
  var visibleRect = Object(__WEBPACK_IMPORTED_MODULE_1__getVisibleRectForElement__["a" /* default */])(source);
  // 当前节点所占的区域, left/top/width/height
  var elRegion = Object(__WEBPACK_IMPORTED_MODULE_3__getRegion__["a" /* default */])(source);
  // 将 offset 转换成数值，支持百分比
  normalizeOffset(offset, elRegion);
  normalizeOffset(targetOffset, tgtRegion);
  // 当前节点将要被放置的位置
  var elFuturePos = Object(__WEBPACK_IMPORTED_MODULE_4__getElFuturePos__["a" /* default */])(elRegion, tgtRegion, points, offset, targetOffset);
  // 当前节点将要所处的区域
  var newElRegion = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].merge(elRegion, elFuturePos);

  // 如果可视区域不能完全放置当前节点时允许调整
  if (visibleRect && (overflow.adjustX || overflow.adjustY) && isTgtRegionVisible) {
    if (overflow.adjustX) {
      // 如果横向不能放下
      if (isFailX(elFuturePos, elRegion, visibleRect)) {
        // 对齐位置反下
        var newPoints = flip(points, /[lr]/ig, {
          l: 'r',
          r: 'l'
        });
        // 偏移量也反下
        var newOffset = flipOffset(offset, 0);
        var newTargetOffset = flipOffset(targetOffset, 0);
        var newElFuturePos = Object(__WEBPACK_IMPORTED_MODULE_4__getElFuturePos__["a" /* default */])(elRegion, tgtRegion, newPoints, newOffset, newTargetOffset);

        if (!isCompleteFailX(newElFuturePos, elRegion, visibleRect)) {
          fail = 1;
          points = newPoints;
          offset = newOffset;
          targetOffset = newTargetOffset;
        }
      }
    }

    if (overflow.adjustY) {
      // 如果纵向不能放下
      if (isFailY(elFuturePos, elRegion, visibleRect)) {
        // 对齐位置反下
        var _newPoints = flip(points, /[tb]/ig, {
          t: 'b',
          b: 't'
        });
        // 偏移量也反下
        var _newOffset = flipOffset(offset, 1);
        var _newTargetOffset = flipOffset(targetOffset, 1);
        var _newElFuturePos = Object(__WEBPACK_IMPORTED_MODULE_4__getElFuturePos__["a" /* default */])(elRegion, tgtRegion, _newPoints, _newOffset, _newTargetOffset);

        if (!isCompleteFailY(_newElFuturePos, elRegion, visibleRect)) {
          fail = 1;
          points = _newPoints;
          offset = _newOffset;
          targetOffset = _newTargetOffset;
        }
      }
    }

    // 如果失败，重新计算当前节点将要被放置的位置
    if (fail) {
      elFuturePos = Object(__WEBPACK_IMPORTED_MODULE_4__getElFuturePos__["a" /* default */])(elRegion, tgtRegion, points, offset, targetOffset);
      __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].mix(newElRegion, elFuturePos);
    }
    var isStillFailX = isFailX(elFuturePos, elRegion, visibleRect);
    var isStillFailY = isFailY(elFuturePos, elRegion, visibleRect);
    // 检查反下后的位置是否可以放下了，如果仍然放不下：
    // 1. 复原修改过的定位参数
    if (isStillFailX || isStillFailY) {
      points = align.points;
      offset = align.offset || [0, 0];
      targetOffset = align.targetOffset || [0, 0];
    }
    // 2. 只有指定了可以调整当前方向才调整
    newOverflowCfg.adjustX = overflow.adjustX && isStillFailX;
    newOverflowCfg.adjustY = overflow.adjustY && isStillFailY;

    // 确实要调整，甚至可能会调整高度宽度
    if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
      newElRegion = Object(__WEBPACK_IMPORTED_MODULE_2__adjustForViewport__["a" /* default */])(elFuturePos, elRegion, visibleRect, newOverflowCfg);
    }
  }

  // need judge to in case set fixed with in css on height auto element
  if (newElRegion.width !== elRegion.width) {
    __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].css(source, 'width', __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].width(source) + newElRegion.width - elRegion.width);
  }

  if (newElRegion.height !== elRegion.height) {
    __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].css(source, 'height', __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].height(source) + newElRegion.height - elRegion.height);
  }

  // https://github.com/kissyteam/kissy/issues/190
  // 相对于屏幕位置没变，而 left/top 变了
  // 例如 <div 'relative'><el absolute></div>
  __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].offset(source, {
    left: newElRegion.left,
    top: newElRegion.top
  }, {
    useCssRight: align.useCssRight,
    useCssBottom: align.useCssBottom,
    useCssTransform: align.useCssTransform,
    ignoreShake: align.ignoreShake
  });

  return {
    points: points,
    offset: offset,
    targetOffset: targetOffset,
    overflow: newOverflowCfg
  };
}

/* harmony default export */ __webpack_exports__["a"] = (doAlign);
/**
 *  2012-04-26 yiminghe@gmail.com
 *   - 优化智能对齐算法
 *   - 慎用 resizeXX
 *
 *  2011-07-13 yiminghe@gmail.com note:
 *   - 增加智能对齐，以及大小调整选项
 **/

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getOffsetParent__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isAncestorFixed__ = __webpack_require__(155);




/**
 * 获得元素的显示部分的区域
 */
function getVisibleRectForElement(element) {
  var visibleRect = {
    left: 0,
    right: Infinity,
    top: 0,
    bottom: Infinity
  };
  var el = Object(__WEBPACK_IMPORTED_MODULE_1__getOffsetParent__["a" /* default */])(element);
  var doc = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getDocument(element);
  var win = doc.defaultView || doc.parentWindow;
  var body = doc.body;
  var documentElement = doc.documentElement;

  // Determine the size of the visible rect by climbing the dom accounting for
  // all scrollable containers.
  while (el) {
    // clientWidth is zero for inline block elements in ie.
    if ((navigator.userAgent.indexOf('MSIE') === -1 || el.clientWidth !== 0) &&
    // body may have overflow set on it, yet we still get the entire
    // viewport. In some browsers, el.offsetParent may be
    // document.documentElement, so check for that too.
    el !== body && el !== documentElement && __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].css(el, 'overflow') !== 'visible') {
      var pos = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].offset(el);
      // add border
      pos.left += el.clientLeft;
      pos.top += el.clientTop;
      visibleRect.top = Math.max(visibleRect.top, pos.top);
      visibleRect.right = Math.min(visibleRect.right,
      // consider area without scrollBar
      pos.left + el.clientWidth);
      visibleRect.bottom = Math.min(visibleRect.bottom, pos.top + el.clientHeight);
      visibleRect.left = Math.max(visibleRect.left, pos.left);
    } else if (el === body || el === documentElement) {
      break;
    }
    el = Object(__WEBPACK_IMPORTED_MODULE_1__getOffsetParent__["a" /* default */])(el);
  }

  // Set element position to fixed
  // make sure absolute element itself don't affect it's visible area
  // https://github.com/ant-design/ant-design/issues/7601
  var originalPosition = null;
  if (!__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].isWindow(element) && element.nodeType !== 9) {
    originalPosition = element.style.position;
    var position = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].css(element, 'position');
    if (position === 'absolute') {
      element.style.position = 'fixed';
    }
  }

  var scrollX = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getWindowScrollLeft(win);
  var scrollY = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getWindowScrollTop(win);
  var viewportWidth = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].viewportWidth(win);
  var viewportHeight = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].viewportHeight(win);
  var documentWidth = documentElement.scrollWidth;
  var documentHeight = documentElement.scrollHeight;

  // Reset element position after calculate the visible area
  if (element.style) {
    element.style.position = originalPosition;
  }

  if (Object(__WEBPACK_IMPORTED_MODULE_2__isAncestorFixed__["a" /* default */])(element)) {
    // Clip by viewport's size.
    visibleRect.left = Math.max(visibleRect.left, scrollX);
    visibleRect.top = Math.max(visibleRect.top, scrollY);
    visibleRect.right = Math.min(visibleRect.right, scrollX + viewportWidth);
    visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + viewportHeight);
  } else {
    // Clip by document's size.
    var maxVisibleWidth = Math.max(documentWidth, scrollX + viewportWidth);
    visibleRect.right = Math.min(visibleRect.right, maxVisibleWidth);

    var maxVisibleHeight = Math.max(documentHeight, scrollY + viewportHeight);
    visibleRect.bottom = Math.min(visibleRect.bottom, maxVisibleHeight);
  }

  return visibleRect.top >= 0 && visibleRect.left >= 0 && visibleRect.bottom > visibleRect.top && visibleRect.right > visibleRect.left ? visibleRect : null;
}

/* harmony default export */ __webpack_exports__["a"] = (getVisibleRectForElement);

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(18);


/**
 * 得到会导致元素显示不全的祖先元素
 */

function getOffsetParent(element) {
  if (__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].isWindow(element) || element.nodeType === 9) {
    return null;
  }
  // ie 这个也不是完全可行
  /*
   <div style="width: 50px;height: 100px;overflow: hidden">
   <div style="width: 50px;height: 100px;position: relative;" id="d6">
   元素 6 高 100px 宽 50px<br/>
   </div>
   </div>
   */
  // element.offsetParent does the right thing in ie7 and below. Return parent with layout!
  //  In other browsers it only includes elements with position absolute, relative or
  // fixed, not elements with overflow set to auto or scroll.
  //        if (UA.ie && ieMode < 8) {
  //            return element.offsetParent;
  //        }
  // 统一的 offsetParent 方法
  var doc = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getDocument(element);
  var body = doc.body;
  var parent = void 0;
  var positionStyle = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].css(element, 'position');
  var skipStatic = positionStyle === 'fixed' || positionStyle === 'absolute';

  if (!skipStatic) {
    return element.nodeName.toLowerCase() === 'html' ? null : element.parentNode;
  }

  for (parent = element.parentNode; parent && parent !== body; parent = parent.parentNode) {
    positionStyle = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].css(parent, 'position');
    if (positionStyle !== 'static') {
      return parent;
    }
  }
  return null;
}

/* harmony default export */ __webpack_exports__["a"] = (getOffsetParent);

/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(18);


function getRegion(node) {
  var offset = void 0;
  var w = void 0;
  var h = void 0;
  if (!__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].isWindow(node) && node.nodeType !== 9) {
    offset = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].offset(node);
    w = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].outerWidth(node);
    h = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].outerHeight(node);
  } else {
    var win = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getWindow(node);
    offset = {
      left: __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getWindowScrollLeft(win),
      top: __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getWindowScrollTop(win)
    };
    w = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].viewportWidth(win);
    h = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].viewportHeight(win);
  }
  offset.width = w;
  offset.height = h;
  return offset;
}

/* harmony default export */ __webpack_exports__["a"] = (getRegion);

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export genAnimateChild */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toArray__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_react_lifecycles_compat__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_classnames__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_component_classes__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_component_classes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_component_classes__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_raf__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_raf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_raf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__util__ = __webpack_require__(50);















var clonePropList = ['appeared', 'show', 'exclusive', 'children', 'animation'];

/**
 * AnimateChild only accept one child node.
 * `transitionSupport` is used for none transition test case.
 * Default we use browser transition event support check.
 */
function genAnimateChild(transitionSupport) {
  var AnimateChild = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(AnimateChild, _React$Component);

    function AnimateChild() {
      __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, AnimateChild);

      // [Legacy] Since old code addListener on the element.
      // To avoid break the behaviour that component not handle animation/transition
      // also can handle the animate, let keep the logic.
      var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (AnimateChild.__proto__ || Object.getPrototypeOf(AnimateChild)).call(this));

      _this.state = {
        child: null,

        eventQueue: [],
        eventActive: false
      };

      _this.onDomUpdated = function () {
        var eventActive = _this.state.eventActive;
        var _this$props = _this.props,
            transitionName = _this$props.transitionName,
            animation = _this$props.animation,
            onChildLeaved = _this$props.onChildLeaved,
            animateKey = _this$props.animateKey;


        var $ele = _this.getDomElement();

        // Skip if dom element not ready
        if (!$ele) return;

        // [Legacy] Add animation/transition event by dom level
        if (transitionSupport && _this.$prevEle !== $ele) {
          _this.cleanDomEvent();

          _this.$prevEle = $ele;
          _this.$prevEle.addEventListener(__WEBPACK_IMPORTED_MODULE_12__util__["a" /* animationEndName */], _this.onMotionEnd);
          _this.$prevEle.addEventListener(__WEBPACK_IMPORTED_MODULE_12__util__["g" /* transitionEndName */], _this.onMotionEnd);
        }

        var currentEvent = _this.getCurrentEvent();
        if (currentEvent.empty) {
          // Additional process the leave event
          if (currentEvent.lastEventType === 'leave') {
            onChildLeaved(animateKey);
          }
          return;
        }

        var eventType = currentEvent.eventType,
            restQueue = currentEvent.restQueue;

        var nodeClasses = __WEBPACK_IMPORTED_MODULE_10_component_classes___default()($ele);

        // [Legacy] Since origin code use js to set `className`.
        // This caused that any component without support `className` can be forced set.
        // Let's keep the logic.
        function legacyAppendClass() {
          if (!transitionSupport) return;

          var basicClassName = Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* getTransitionName */])(transitionName, '' + eventType);
          if (basicClassName) nodeClasses.add(basicClassName);

          if (eventActive) {
            var activeClassName = Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* getTransitionName */])(transitionName, eventType + '-active');
            if (activeClassName) nodeClasses.add(activeClassName);
          }
        }

        if (_this.currentEvent && _this.currentEvent.type === eventType) {
          legacyAppendClass();
          return;
        }

        // Clear timeout for legacy check
        clearTimeout(_this.timeout);

        // Clean up last event environment
        if (_this.currentEvent && _this.currentEvent.animateObj && _this.currentEvent.animateObj.stop) {
          _this.currentEvent.animateObj.stop();
        }

        // Clean up last transition class
        if (_this.currentEvent) {
          var basicClassName = Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* getTransitionName */])(transitionName, '' + _this.currentEvent.type);
          var activeClassName = Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* getTransitionName */])(transitionName, _this.currentEvent.type + '-active');
          if (basicClassName) nodeClasses.remove(basicClassName);
          if (activeClassName) nodeClasses.remove(activeClassName);
        }

        // New event come
        _this.currentEvent = {
          type: eventType
        };

        var animationHandler = (animation || {})[eventType];
        // =============== Check if has customize animation ===============
        if (animationHandler) {
          _this.currentEvent.animateObj = animationHandler($ele, function () {
            _this.onMotionEnd({ target: $ele });
          });

          // Do next step if not animate object provided
          if (!_this.currentEvent || !_this.currentEvent.animateObj) {
            _this.nextEvent(restQueue);
          }

          // ==================== Use transition instead ====================
        } else if (transitionSupport) {
          legacyAppendClass();
          if (!eventActive) {
            // Trigger `eventActive` in next frame
            __WEBPACK_IMPORTED_MODULE_11_raf___default()(function () {
              if (_this.currentEvent && _this.currentEvent.type === eventType && !_this._destroy) {
                _this.setState({ eventActive: true }, function () {
                  // [Legacy] Handle timeout if browser transition event not handle
                  var transitionDelay = Object(__WEBPACK_IMPORTED_MODULE_12__util__["c" /* getStyleValue */])($ele, 'transition-delay') || 0;
                  var transitionDuration = Object(__WEBPACK_IMPORTED_MODULE_12__util__["c" /* getStyleValue */])($ele, 'transition-duration') || 0;
                  var animationDelay = Object(__WEBPACK_IMPORTED_MODULE_12__util__["c" /* getStyleValue */])($ele, 'animation-delay') || 0;
                  var animationDuration = Object(__WEBPACK_IMPORTED_MODULE_12__util__["c" /* getStyleValue */])($ele, 'animation-duration') || 0;
                  var totalTime = Math.max(transitionDuration + transitionDelay, animationDuration + animationDelay);

                  if (totalTime >= 0) {
                    _this.timeout = setTimeout(function () {
                      _this.onMotionEnd({ target: $ele });
                    }, totalTime * 1000);
                  }
                });
              }
            });
          }

          // ======================= Just next action =======================
        } else {
          _this.onMotionEnd({ target: $ele });
        }
      };

      _this.onMotionEnd = function (_ref) {
        var target = _ref.target;
        var _this$props2 = _this.props,
            transitionName = _this$props2.transitionName,
            onChildLeaved = _this$props2.onChildLeaved,
            animateKey = _this$props2.animateKey,
            onAppear = _this$props2.onAppear,
            onEnter = _this$props2.onEnter,
            onLeave = _this$props2.onLeave,
            onEnd = _this$props2.onEnd;

        var currentEvent = _this.getCurrentEvent();
        if (currentEvent.empty) return;

        // Clear timeout for legacy check
        clearTimeout(_this.timeout);

        var restQueue = currentEvent.restQueue;


        var $ele = _this.getDomElement();
        if (!_this.currentEvent || $ele !== target) return;

        if (_this.currentEvent.animateObj && _this.currentEvent.animateObj.stop) {
          _this.currentEvent.animateObj.stop();
        }

        // [Legacy] Same as above, we need call js to remove the class
        if (transitionSupport && _this.currentEvent) {
          var basicClassName = Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* getTransitionName */])(transitionName, _this.currentEvent.type);
          var activeClassName = Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* getTransitionName */])(transitionName, _this.currentEvent.type + '-active');

          var nodeClasses = __WEBPACK_IMPORTED_MODULE_10_component_classes___default()($ele);
          if (basicClassName) nodeClasses.remove(basicClassName);
          if (activeClassName) nodeClasses.remove(activeClassName);
        }

        // Additional process the leave event
        if (_this.currentEvent && _this.currentEvent.type === 'leave') {
          onChildLeaved(animateKey);
        }

        // [Legacy] Trigger on event when it's last event
        if (_this.currentEvent && !restQueue.length) {
          if (_this.currentEvent.type === 'appear' && onAppear) {
            onAppear(animateKey);
          } else if (_this.currentEvent.type === 'enter' && onEnter) {
            onEnter(animateKey);
          } else if (_this.currentEvent.type === 'leave' && onLeave) {
            onLeave(animateKey);
          }

          if (onEnd) {
            // OnEnd(key, isShow)
            onEnd(animateKey, _this.currentEvent.type !== 'leave');
          }
        }

        _this.currentEvent = null;

        // Next queue
        _this.nextEvent(restQueue);
      };

      _this.getDomElement = function () {
        if (_this._destroy) return null;
        return __WEBPACK_IMPORTED_MODULE_6_react_dom___default.a.findDOMNode(_this);
      };

      _this.getCurrentEvent = function () {
        var _this$state$eventQueu = _this.state.eventQueue,
            eventQueue = _this$state$eventQueu === undefined ? [] : _this$state$eventQueu;
        var _this$props3 = _this.props,
            animation = _this$props3.animation,
            exclusive = _this$props3.exclusive,
            transitionAppear = _this$props3.transitionAppear,
            transitionEnter = _this$props3.transitionEnter,
            transitionLeave = _this$props3.transitionLeave;


        function hasEventHandler(eventType) {
          return eventType === 'appear' && (transitionAppear || animation.appear) || eventType === 'enter' && (transitionEnter || animation.enter) || eventType === 'leave' && (transitionLeave || animation.leave);
        }

        var event = null;
        // If is exclusive, only check the last event
        if (exclusive) {
          var eventType = eventQueue[eventQueue.length - 1];
          if (hasEventHandler(eventType)) {
            event = {
              eventType: eventType,
              restQueue: []
            };
          }
        } else {
          // Loop check the queue until find match
          var cloneQueue = eventQueue.slice();
          while (cloneQueue.length) {
            var _cloneQueue = cloneQueue,
                _cloneQueue2 = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toArray___default()(_cloneQueue),
                _eventType = _cloneQueue2[0],
                restQueue = _cloneQueue2.slice(1);

            if (hasEventHandler(_eventType)) {
              event = {
                eventType: _eventType,
                restQueue: restQueue
              };
              break;
            }
            cloneQueue = restQueue;
          }
        }

        if (!event) {
          event = {
            empty: true,
            lastEventType: eventQueue[eventQueue.length - 1]
          };
        }

        return event;
      };

      _this.nextEvent = function (restQueue) {
        // Next queue
        if (!_this._destroy) {
          _this.setState({
            eventQueue: restQueue,
            eventActive: false
          });
        }
      };

      _this.cleanDomEvent = function () {
        if (_this.$prevEle && transitionSupport) {
          _this.$prevEle.removeEventListener(__WEBPACK_IMPORTED_MODULE_12__util__["a" /* animationEndName */], _this.onMotionEnd);
          _this.$prevEle.removeEventListener(__WEBPACK_IMPORTED_MODULE_12__util__["g" /* transitionEndName */], _this.onMotionEnd);
        }
      };

      _this.$prevEle = null;

      _this.currentEvent = null;
      _this.timeout = null;
      return _this;
    }

    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(AnimateChild, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.onDomUpdated();
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.onDomUpdated();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        clearTimeout(this.timeout);
        this._destroy = true;
        this.cleanDomEvent();
      }
    }, {
      key: 'render',
      value: function render() {
        var _state = this.state,
            child = _state.child,
            eventActive = _state.eventActive;
        var _props = this.props,
            showProp = _props.showProp,
            transitionName = _props.transitionName;

        var _ref2 = child.props || {},
            className = _ref2.className;

        var currentEvent = this.getCurrentEvent();

        // Class name
        var connectClassName = transitionSupport && this.currentEvent ? __WEBPACK_IMPORTED_MODULE_9_classnames___default()(className, Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* getTransitionName */])(transitionName, this.currentEvent.type), eventActive && Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* getTransitionName */])(transitionName, this.currentEvent.type + '-active')) : className;

        var show = true;

        // Keep show when is in transition or has customize animate
        if (transitionSupport && (!currentEvent.empty || this.currentEvent && this.currentEvent.animateObj)) {
          show = true;
        } else {
          show = child.props[showProp];
        }

        // Clone child
        var newChildProps = {
          className: connectClassName
        };

        if (showProp) {
          newChildProps[showProp] = show;
        }

        return __WEBPACK_IMPORTED_MODULE_5_react___default.a.cloneElement(child, newChildProps);
      }
    }], [{
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(nextProps, prevState) {
        var _prevState$prevProps = prevState.prevProps,
            prevProps = _prevState$prevProps === undefined ? {} : _prevState$prevProps;
        var appeared = nextProps.appeared;


        var newState = {
          prevProps: Object(__WEBPACK_IMPORTED_MODULE_12__util__["b" /* cloneProps */])(nextProps, clonePropList)
        };

        function processState(propName, updater) {
          if (prevProps[propName] !== nextProps[propName]) {
            if (updater) {
              updater(nextProps[propName]);
            }
            return true;
          }
          return false;
        }

        function pushEvent(eventType) {
          var eventQueue = newState.eventQueue || prevState.eventQueue.slice();
          var matchIndex = eventQueue.indexOf(eventType);

          // Clean the rest event if eventType match
          if (matchIndex !== -1) {
            eventQueue = eventQueue.slice(0, matchIndex);
          }

          eventQueue.push(eventType);
          newState.eventQueue = eventQueue;
        }

        // Child update. Only set child.
        processState('children', function (child) {
          newState.child = child;
        });

        processState('appeared', function (isAppeared) {
          if (isAppeared) {
            pushEvent('appear');
          }
        });

        // Show update
        processState('show', function (show) {
          if (!appeared) {
            if (show) {
              pushEvent('enter');
            } else {
              pushEvent('leave');
            }
          }
        });

        return newState;
      }
    }]);

    return AnimateChild;
  }(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

  AnimateChild.propTypes = {
    transitionName: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.object]),
    transitionAppear: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
    transitionEnter: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
    transitionLeave: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
    exclusive: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
    appeared: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
    showProp: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,

    animateKey: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.any,
    animation: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.object,
    onChildLeaved: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,

    onEnd: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
    onAppear: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
    onEnter: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
    onLeave: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func
  };


  Object(__WEBPACK_IMPORTED_MODULE_8_react_lifecycles_compat__["a" /* polyfill */])(AnimateChild);

  return AnimateChild;
}

/* harmony default export */ __webpack_exports__["a"] = (genAnimateChild(__WEBPACK_IMPORTED_MODULE_12__util__["f" /* supportTransition */]));

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_objectWithoutProperties__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_objectWithoutProperties___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_objectWithoutProperties__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_prop_types__);







var LazyRenderBox = function (_Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(LazyRenderBox, _Component);

  function LazyRenderBox() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, LazyRenderBox);

    return __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, _Component.apply(this, arguments));
  }

  LazyRenderBox.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    return nextProps.hiddenClassName || nextProps.visible;
  };

  LazyRenderBox.prototype.render = function render() {
    var _props = this.props,
        hiddenClassName = _props.hiddenClassName,
        visible = _props.visible,
        props = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_objectWithoutProperties___default()(_props, ['hiddenClassName', 'visible']);

    if (hiddenClassName || __WEBPACK_IMPORTED_MODULE_4_react___default.a.Children.count(props.children) > 1) {
      if (!visible && hiddenClassName) {
        props.className += ' ' + hiddenClassName;
      }
      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement('div', props);
    }

    return __WEBPACK_IMPORTED_MODULE_4_react___default.a.Children.only(props.children);
  };

  return LazyRenderBox;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

LazyRenderBox.propTypes = {
  children: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.any,
  className: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  visible: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  hiddenClassName: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string
};


/* harmony default export */ __webpack_exports__["a"] = (LazyRenderBox);

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getAlignFromPlacement;
/* harmony export (immutable) */ __webpack_exports__["b"] = getAlignPopupClassName;
/* harmony export (immutable) */ __webpack_exports__["c"] = saveRef;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);

function isPointsEq(a1, a2, isAlignPoint) {
  if (isAlignPoint) {
    return a1[0] === a2[0];
  }
  return a1[0] === a2[0] && a1[1] === a2[1];
}

function getAlignFromPlacement(builtinPlacements, placementStr, align) {
  var baseAlign = builtinPlacements[placementStr] || {};
  return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, baseAlign, align);
}

function getAlignPopupClassName(builtinPlacements, prefixCls, align, isAlignPoint) {
  var points = align.points;
  for (var placement in builtinPlacements) {
    if (builtinPlacements.hasOwnProperty(placement)) {
      if (isPointsEq(builtinPlacements[placement].points, points, isAlignPoint)) {
        return prefixCls + '-placement-' + placement;
      }
    }
  }
  return '';
}

function saveRef(name, component) {
  this[name] = component;
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (process.env.NODE_ENV !== 'production') {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_objectWithoutProperties__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_objectWithoutProperties___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_objectWithoutProperties__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_classnames__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rc_animate__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rc_util_es_Children_toArray__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_react_lifecycles_compat__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__contextTypes__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__util__ = __webpack_require__(52);
















var ICON_OPEN = 'open';
var ICON_CLOSE = 'close';

var defaultTitle = '---';

var TreeNode = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_inherits___default()(TreeNode, _React$Component);

  function TreeNode(props) {
    __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_classCallCheck___default()(this, TreeNode);

    var _this = __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_possibleConstructorReturn___default()(this, (TreeNode.__proto__ || Object.getPrototypeOf(TreeNode)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      dragNodeHighlight: false
    };
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_createClass___default()(TreeNode, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, this.context, {
        rcTreeNode: {
          // onUpCheckConduct: this.onUpCheckConduct,
        }
      });
    }

    // Isomorphic needn't load data in server side

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.syncLoadData(this.props);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.syncLoadData(this.props);
    }

    // Disabled item still can be switch


    // Drag usage

  }, {
    key: 'isSelectable',
    value: function isSelectable() {
      var selectable = this.props.selectable;
      var treeSelectable = this.context.rcTree.selectable;

      // Ignore when selectable is undefined or null

      if (typeof selectable === 'boolean') {
        return selectable;
      }

      return treeSelectable;
    }

    // Load data to avoid default expanded tree without data


    // Switcher


    // Checkbox


    // Icon + Title


    // Children list wrapped with `Animation`

  }, {
    key: 'render',
    value: function render() {
      var _classNames;

      var loading = this.props.loading;

      var _props = this.props,
          className = _props.className,
          style = _props.style,
          dragOver = _props.dragOver,
          dragOverGapTop = _props.dragOverGapTop,
          dragOverGapBottom = _props.dragOverGapBottom,
          isLeaf = _props.isLeaf,
          expanded = _props.expanded,
          selected = _props.selected,
          checked = _props.checked,
          halfChecked = _props.halfChecked,
          otherProps = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_objectWithoutProperties___default()(_props, ['className', 'style', 'dragOver', 'dragOverGapTop', 'dragOverGapBottom', 'isLeaf', 'expanded', 'selected', 'checked', 'halfChecked']);

      var _context$rcTree = this.context.rcTree,
          prefixCls = _context$rcTree.prefixCls,
          filterTreeNode = _context$rcTree.filterTreeNode,
          draggable = _context$rcTree.draggable;

      var disabled = this.isDisabled();
      var dataOrAriaAttributeProps = Object(__WEBPACK_IMPORTED_MODULE_14__util__["i" /* getDataAndAria */])(otherProps);

      return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
        'li',
        __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({
          className: __WEBPACK_IMPORTED_MODULE_9_classnames___default()(className, (_classNames = {}, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-treenode-disabled', disabled), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-treenode-switcher-' + (expanded ? 'open' : 'close'), !isLeaf), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-treenode-checkbox-checked', checked), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-treenode-checkbox-indeterminate', halfChecked), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-treenode-selected', selected), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, prefixCls + '-treenode-loading', loading), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, 'drag-over', !disabled && dragOver), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, 'drag-over-gap-top', !disabled && dragOverGapTop), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, 'drag-over-gap-bottom', !disabled && dragOverGapBottom), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, 'filter-node', filterTreeNode && filterTreeNode(this)), _classNames)),

          style: style,

          role: 'treeitem',

          onDragEnter: draggable ? this.onDragEnter : undefined,
          onDragOver: draggable ? this.onDragOver : undefined,
          onDragLeave: draggable ? this.onDragLeave : undefined,
          onDrop: draggable ? this.onDrop : undefined,
          onDragEnd: draggable ? this.onDragEnd : undefined
        }, dataOrAriaAttributeProps),
        this.renderSwitcher(),
        this.renderCheckbox(),
        this.renderSelector(),
        this.renderChildren()
      );
    }
  }]);

  return TreeNode;
}(__WEBPACK_IMPORTED_MODULE_7_react___default.a.Component);

TreeNode.propTypes = {
  eventKey: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.string, // Pass by parent `cloneElement`
  prefixCls: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.string,
  className: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.string,
  style: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.object,
  root: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.object,
  onSelect: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,

  // By parent
  expanded: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  selected: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  checked: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  loaded: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  loading: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  halfChecked: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  children: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.node,
  title: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.node,
  pos: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.string,
  dragOver: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  dragOverGapTop: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  dragOverGapBottom: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,

  // By user
  isLeaf: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  selectable: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  disabled: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  disableCheckbox: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
  icon: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func]),
  switcherIcon: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func])
};
TreeNode.contextTypes = __WEBPACK_IMPORTED_MODULE_13__contextTypes__["a" /* nodeContextTypes */];
TreeNode.childContextTypes = __WEBPACK_IMPORTED_MODULE_13__contextTypes__["a" /* nodeContextTypes */];
TreeNode.defaultProps = {
  title: defaultTitle
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onSelectorClick = function (e) {
    // Click trigger before select/check operation
    var onNodeClick = _this2.context.rcTree.onNodeClick;

    onNodeClick(e, _this2);

    if (_this2.isSelectable()) {
      _this2.onSelect(e);
    } else {
      _this2.onCheck(e);
    }
  };

  this.onSelectorDoubleClick = function (e) {
    var onNodeDoubleClick = _this2.context.rcTree.onNodeDoubleClick;

    onNodeDoubleClick(e, _this2);
  };

  this.onSelect = function (e) {
    if (_this2.isDisabled()) return;

    var onNodeSelect = _this2.context.rcTree.onNodeSelect;

    e.preventDefault();
    onNodeSelect(e, _this2);
  };

  this.onCheck = function (e) {
    if (_this2.isDisabled()) return;

    var _props2 = _this2.props,
        disableCheckbox = _props2.disableCheckbox,
        checked = _props2.checked;
    var _context$rcTree2 = _this2.context.rcTree,
        checkable = _context$rcTree2.checkable,
        onNodeCheck = _context$rcTree2.onNodeCheck;


    if (!checkable || disableCheckbox) return;

    e.preventDefault();
    var targetChecked = !checked;
    onNodeCheck(e, _this2, targetChecked);
  };

  this.onMouseEnter = function (e) {
    var onNodeMouseEnter = _this2.context.rcTree.onNodeMouseEnter;

    onNodeMouseEnter(e, _this2);
  };

  this.onMouseLeave = function (e) {
    var onNodeMouseLeave = _this2.context.rcTree.onNodeMouseLeave;

    onNodeMouseLeave(e, _this2);
  };

  this.onContextMenu = function (e) {
    var onNodeContextMenu = _this2.context.rcTree.onNodeContextMenu;

    onNodeContextMenu(e, _this2);
  };

  this.onDragStart = function (e) {
    var onNodeDragStart = _this2.context.rcTree.onNodeDragStart;


    e.stopPropagation();
    _this2.setState({
      dragNodeHighlight: true
    });
    onNodeDragStart(e, _this2);

    try {
      // ie throw error
      // firefox-need-it
      e.dataTransfer.setData('text/plain', '');
    } catch (error) {
      // empty
    }
  };

  this.onDragEnter = function (e) {
    var onNodeDragEnter = _this2.context.rcTree.onNodeDragEnter;


    e.preventDefault();
    e.stopPropagation();
    onNodeDragEnter(e, _this2);
  };

  this.onDragOver = function (e) {
    var onNodeDragOver = _this2.context.rcTree.onNodeDragOver;


    e.preventDefault();
    e.stopPropagation();
    onNodeDragOver(e, _this2);
  };

  this.onDragLeave = function (e) {
    var onNodeDragLeave = _this2.context.rcTree.onNodeDragLeave;


    e.stopPropagation();
    onNodeDragLeave(e, _this2);
  };

  this.onDragEnd = function (e) {
    var onNodeDragEnd = _this2.context.rcTree.onNodeDragEnd;


    e.stopPropagation();
    _this2.setState({
      dragNodeHighlight: false
    });
    onNodeDragEnd(e, _this2);
  };

  this.onDrop = function (e) {
    var onNodeDrop = _this2.context.rcTree.onNodeDrop;


    e.preventDefault();
    e.stopPropagation();
    _this2.setState({
      dragNodeHighlight: false
    });
    onNodeDrop(e, _this2);
  };

  this.onExpand = function (e) {
    var onNodeExpand = _this2.context.rcTree.onNodeExpand;

    onNodeExpand(e, _this2);
  };

  this.setSelectHandle = function (node) {
    _this2.selectHandle = node;
  };

  this.getNodeChildren = function () {
    var children = _this2.props.children;

    var originList = Object(__WEBPACK_IMPORTED_MODULE_11_rc_util_es_Children_toArray__["a" /* default */])(children).filter(function (node) {
      return node;
    });
    var targetList = Object(__WEBPACK_IMPORTED_MODULE_14__util__["k" /* getNodeChildren */])(originList);

    if (originList.length !== targetList.length) {
      Object(__WEBPACK_IMPORTED_MODULE_14__util__["p" /* warnOnlyTreeNode */])();
    }

    return targetList;
  };

  this.getNodeState = function () {
    var expanded = _this2.props.expanded;


    if (_this2.isLeaf()) {
      return null;
    }

    return expanded ? ICON_OPEN : ICON_CLOSE;
  };

  this.isLeaf = function () {
    var _props3 = _this2.props,
        isLeaf = _props3.isLeaf,
        loaded = _props3.loaded;
    var loadData = _this2.context.rcTree.loadData;


    var hasChildren = _this2.getNodeChildren().length !== 0;

    if (isLeaf === false) {
      return false;
    }

    return isLeaf || !loadData && !hasChildren || loadData && loaded && !hasChildren;
  };

  this.isDisabled = function () {
    var disabled = _this2.props.disabled;
    var treeDisabled = _this2.context.rcTree.disabled;

    // Follow the logic of Selectable

    if (disabled === false) {
      return false;
    }

    return !!(treeDisabled || disabled);
  };

  this.syncLoadData = function (props) {
    var expanded = props.expanded,
        loading = props.loading,
        loaded = props.loaded;
    var _context$rcTree3 = _this2.context.rcTree,
        loadData = _context$rcTree3.loadData,
        onNodeLoad = _context$rcTree3.onNodeLoad;


    if (loading) return;

    // read from state to avoid loadData at same time
    if (loadData && expanded && !_this2.isLeaf()) {
      // We needn't reload data when has children in sync logic
      // It's only needed in node expanded
      var hasChildren = _this2.getNodeChildren().length !== 0;
      if (!hasChildren && !loaded) {
        onNodeLoad(_this2);
      }
    }
  };

  this.renderSwitcher = function () {
    var _props4 = _this2.props,
        expanded = _props4.expanded,
        switcherIconFromProps = _props4.switcherIcon;
    var _context$rcTree4 = _this2.context.rcTree,
        prefixCls = _context$rcTree4.prefixCls,
        switcherIconFromCtx = _context$rcTree4.switcherIcon;


    var switcherIcon = switcherIconFromProps || switcherIconFromCtx;

    if (_this2.isLeaf()) {
      return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
        'span',
        { className: __WEBPACK_IMPORTED_MODULE_9_classnames___default()(prefixCls + '-switcher', prefixCls + '-switcher-noop') },
        typeof switcherIcon === 'function' ? __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(switcherIcon, __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, _this2.props, { isLeaf: true })) : switcherIcon
      );
    }

    var switcherCls = __WEBPACK_IMPORTED_MODULE_9_classnames___default()(prefixCls + '-switcher', prefixCls + '-switcher_' + (expanded ? ICON_OPEN : ICON_CLOSE));
    return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
      'span',
      { onClick: _this2.onExpand, className: switcherCls },
      typeof switcherIcon === 'function' ? __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(switcherIcon, __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, _this2.props, { isLeaf: false })) : switcherIcon
    );
  };

  this.renderCheckbox = function () {
    var _props5 = _this2.props,
        checked = _props5.checked,
        halfChecked = _props5.halfChecked,
        disableCheckbox = _props5.disableCheckbox;
    var _context$rcTree5 = _this2.context.rcTree,
        prefixCls = _context$rcTree5.prefixCls,
        checkable = _context$rcTree5.checkable;

    var disabled = _this2.isDisabled();

    if (!checkable) return null;

    // [Legacy] Custom element should be separate with `checkable` in future
    var $custom = typeof checkable !== 'boolean' ? checkable : null;

    return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
      'span',
      {
        className: __WEBPACK_IMPORTED_MODULE_9_classnames___default()(prefixCls + '-checkbox', checked && prefixCls + '-checkbox-checked', !checked && halfChecked && prefixCls + '-checkbox-indeterminate', (disabled || disableCheckbox) && prefixCls + '-checkbox-disabled'),
        onClick: _this2.onCheck
      },
      $custom
    );
  };

  this.renderIcon = function () {
    var loading = _this2.props.loading;
    var prefixCls = _this2.context.rcTree.prefixCls;


    return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement('span', {
      className: __WEBPACK_IMPORTED_MODULE_9_classnames___default()(prefixCls + '-iconEle', prefixCls + '-icon__' + (_this2.getNodeState() || 'docu'), loading && prefixCls + '-icon_loading')
    });
  };

  this.renderSelector = function () {
    var dragNodeHighlight = _this2.state.dragNodeHighlight;
    var _props6 = _this2.props,
        title = _props6.title,
        selected = _props6.selected,
        icon = _props6.icon,
        loading = _props6.loading;
    var _context$rcTree6 = _this2.context.rcTree,
        prefixCls = _context$rcTree6.prefixCls,
        showIcon = _context$rcTree6.showIcon,
        treeIcon = _context$rcTree6.icon,
        draggable = _context$rcTree6.draggable,
        loadData = _context$rcTree6.loadData;

    var disabled = _this2.isDisabled();

    var wrapClass = prefixCls + '-node-content-wrapper';

    // Icon - Still show loading icon when loading without showIcon
    var $icon = void 0;

    if (showIcon) {
      var currentIcon = icon || treeIcon;

      $icon = currentIcon ? __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
        'span',
        {
          className: __WEBPACK_IMPORTED_MODULE_9_classnames___default()(prefixCls + '-iconEle', prefixCls + '-icon__customize')
        },
        typeof currentIcon === 'function' ? __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(currentIcon, __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, _this2.props)) : currentIcon
      ) : _this2.renderIcon();
    } else if (loadData && loading) {
      $icon = _this2.renderIcon();
    }

    // Title
    var $title = __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
      'span',
      { className: prefixCls + '-title' },
      title
    );

    return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
      'span',
      {
        ref: _this2.setSelectHandle,
        title: typeof title === 'string' ? title : '',
        className: __WEBPACK_IMPORTED_MODULE_9_classnames___default()('' + wrapClass, wrapClass + '-' + (_this2.getNodeState() || 'normal'), !disabled && (selected || dragNodeHighlight) && prefixCls + '-node-selected', !disabled && draggable && 'draggable'),
        draggable: !disabled && draggable || undefined,
        'aria-grabbed': !disabled && draggable || undefined,

        onMouseEnter: _this2.onMouseEnter,
        onMouseLeave: _this2.onMouseLeave,
        onContextMenu: _this2.onContextMenu,
        onClick: _this2.onSelectorClick,
        onDoubleClick: _this2.onSelectorDoubleClick,
        onDragStart: draggable ? _this2.onDragStart : undefined
      },
      $icon,
      $title
    );
  };

  this.renderChildren = function () {
    var _props7 = _this2.props,
        expanded = _props7.expanded,
        pos = _props7.pos;
    var _context$rcTree7 = _this2.context.rcTree,
        prefixCls = _context$rcTree7.prefixCls,
        openTransitionName = _context$rcTree7.openTransitionName,
        openAnimation = _context$rcTree7.openAnimation,
        renderTreeNode = _context$rcTree7.renderTreeNode;


    var animProps = {};
    if (openTransitionName) {
      animProps.transitionName = openTransitionName;
    } else if (typeof openAnimation === 'object') {
      animProps.animation = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, openAnimation);
    }

    // Children TreeNode
    var nodeList = _this2.getNodeChildren();

    if (nodeList.length === 0) {
      return null;
    }

    var $children = void 0;
    if (expanded) {
      $children = __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
        'ul',
        {
          className: __WEBPACK_IMPORTED_MODULE_9_classnames___default()(prefixCls + '-child-tree', expanded && prefixCls + '-child-tree-open'),
          'data-expanded': expanded,
          role: 'group'
        },
        Object(__WEBPACK_IMPORTED_MODULE_14__util__["m" /* mapChildren */])(nodeList, function (node, index) {
          return renderTreeNode(node, index, pos);
        })
      );
    }

    return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_10_rc_animate__["a" /* default */],
      __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, animProps, {
        showProp: 'data-expanded',
        component: ''
      }),
      $children
    );
  };
};

TreeNode.isTreeNode = 1;

Object(__WEBPACK_IMPORTED_MODULE_12_react_lifecycles_compat__["a" /* polyfill */])(TreeNode);

/* harmony default export */ __webpack_exports__["a"] = (TreeNode);

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return treeContextTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return nodeContextTypes; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);

/**
 * Webpack has bug for import loop, which is not the same behavior as ES module.
 * When util.js imports the TreeNode for tree generate will cause treeContextTypes be empty.
 */



/**
 * Thought we still use `cloneElement` to pass `key`,
 * other props can pass with context for future refactor.
 */
var treeContextTypes = {
  rcTree: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    root: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object,

    prefixCls: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
    selectable: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
    showIcon: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
    icon: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func]),
    draggable: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
    checkable: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool, __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.node]),
    checkStrictly: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
    disabled: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.bool,
    openTransitionName: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string,
    openAnimation: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.object]),

    loadData: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    filterTreeNode: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    renderTreeNode: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,

    isKeyChecked: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,

    onNodeClick: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeDoubleClick: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeExpand: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeSelect: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeCheck: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeMouseEnter: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeMouseLeave: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeContextMenu: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeDragStart: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeDragEnter: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeDragOver: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeDragLeave: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeDragEnd: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func,
    onNodeDrop: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func

    // TODO: Remove this
    // onBatchNodeCheck: PropTypes.func,
    // onCheckConductFinished: PropTypes.func,

    // Tree will store the entities when the treeNode refresh.
    // User can pass the func to add more info to customize the additional info.
    // processTreeEntity: PropTypes.func,
  })
};

var nodeContextTypes = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, treeContextTypes, {
  rcTreeNode: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.shape({
    onUpCheckConduct: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.func
  })
});

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Tree__ = __webpack_require__(172);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__TreeNode__ = __webpack_require__(81);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__TreeNode__["a"]; });



__WEBPACK_IMPORTED_MODULE_0__Tree__["a" /* default */].TreeNode = __WEBPACK_IMPORTED_MODULE_1__TreeNode__["a" /* default */];


/* harmony default export */ __webpack_exports__["b"] = (__WEBPACK_IMPORTED_MODULE_0__Tree__["a" /* default */]);

/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export genArrProps */
/* harmony export (immutable) */ __webpack_exports__["a"] = valueProp;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(10);



var internalValProp = __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.number]);

function genArrProps(propType) {
  return __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.oneOfType([propType, __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.arrayOf(propType)]);
}

/**
 * Origin code check `multiple` is true when `treeCheckStrictly` & `labelInValue`.
 * But in process logic is already cover to array.
 * Check array is not necessary. Let's simplify this check logic.
 */
function valueProp() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var props = args[0],
      propName = args[1],
      Component = args[2];


  if (Object(__WEBPACK_IMPORTED_MODULE_1__util__["n" /* isLabelInValue */])(props)) {
    var _err = genArrProps(__WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.shape({
      label: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.node,
      value: internalValProp
    })).apply(undefined, args);
    if (_err) {
      return new Error('Invalid prop `' + propName + '` supplied to `' + Component + '`. ' + 'You should use { label: string, value: string | number } or [{ label: string, value: string | number }] instead.');
    }
    return null;
  }

  var err = genArrProps(internalValProp).apply(undefined, args);
  if (err) {
    return new Error('Invalid prop `' + propName + '` supplied to `' + Component + '`. ' + 'You should use string or [string] instead.');
  }
  return null;
}

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export searchContextTypes */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_lifecycles_compat__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__util__ = __webpack_require__(10);





/**
 * Since search box is in different position with different mode.
 * - Single: in the popup box
 * - multiple: in the selector
 * Move the code as a SearchInput for easy management.
 */






var searchContextTypes = {
  onSearchInputChange: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired
};

var SearchInput = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(SearchInput, _React$Component);

  function SearchInput() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, SearchInput);

    var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (SearchInput.__proto__ || Object.getPrototypeOf(SearchInput)).call(this));

    _this.alignInputWidth = function () {
      _this.inputRef.current.style.width = _this.mirrorInputRef.current.clientWidth + 'px';
    };

    _this.focus = function (isDidMount) {
      if (_this.inputRef.current) {
        _this.inputRef.current.focus();
        if (isDidMount) {
          setTimeout(function () {
            _this.inputRef.current.focus();
          }, 0);
        }
      }
    };

    _this.blur = function () {
      if (_this.inputRef.current) {
        _this.inputRef.current.blur();
      }
    };

    _this.inputRef = Object(__WEBPACK_IMPORTED_MODULE_8__util__["g" /* createRef */])();
    _this.mirrorInputRef = Object(__WEBPACK_IMPORTED_MODULE_8__util__["g" /* createRef */])();
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(SearchInput, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          open = _props.open,
          needAlign = _props.needAlign;

      if (needAlign) {
        this.alignInputWidth();
      }

      if (open) {
        this.focus(true);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props2 = this.props,
          open = _props2.open,
          searchValue = _props2.searchValue,
          needAlign = _props2.needAlign;


      if (open && prevProps.open !== open) {
        this.focus();
      }

      if (needAlign && searchValue !== prevProps.searchValue) {
        this.alignInputWidth();
      }
    }

    /**
     * `scrollWidth` is not correct in IE, do the workaround.
     * ref: https://github.com/react-component/tree-select/issues/65
     */


    /**
     * Need additional timeout for focus cause parent dom is not ready when didMount trigger
     */

  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          searchValue = _props3.searchValue,
          prefixCls = _props3.prefixCls,
          disabled = _props3.disabled,
          renderPlaceholder = _props3.renderPlaceholder,
          open = _props3.open,
          ariaId = _props3.ariaId;
      var _context$rcTreeSelect = this.context.rcTreeSelect,
          onSearchInputChange = _context$rcTreeSelect.onSearchInputChange,
          onSearchInputKeyDown = _context$rcTreeSelect.onSearchInputKeyDown;


      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'span',
        { className: prefixCls + '-search__field__wrap' },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('input', {
          type: 'text',
          ref: this.inputRef,
          onChange: onSearchInputChange,
          onKeyDown: onSearchInputKeyDown,
          value: searchValue,
          disabled: disabled,
          className: prefixCls + '-search__field',

          'aria-label': 'filter select',
          'aria-autocomplete': 'list',
          'aria-controls': open ? ariaId : undefined,
          'aria-multiline': 'false'
        }),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'span',
          {
            ref: this.mirrorInputRef,
            className: prefixCls + '-search__field__mirror'
          },
          searchValue,
          '\xA0'
        ),
        renderPlaceholder ? renderPlaceholder() : null
      );
    }
  }]);

  return SearchInput;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

SearchInput.propTypes = {
  open: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  searchValue: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  prefixCls: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  disabled: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  renderPlaceholder: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,
  needAlign: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  ariaId: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string
};
SearchInput.contextTypes = {
  rcTreeSelect: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.shape(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, searchContextTypes))
};


Object(__WEBPACK_IMPORTED_MODULE_7_react_lifecycles_compat__["a" /* polyfill */])(SearchInput);

/* harmony default export */ __webpack_exports__["a"] = (SearchInput);

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(87);
module.exports = __webpack_require__(88);


/***/ }),
/* 87 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TreeNode", function() { return TreeNode; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Select__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SelectNode__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__strategies__ = __webpack_require__(54);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SHOW_ALL", function() { return __WEBPACK_IMPORTED_MODULE_2__strategies__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SHOW_CHILD", function() { return __WEBPACK_IMPORTED_MODULE_2__strategies__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SHOW_PARENT", function() { return __WEBPACK_IMPORTED_MODULE_2__strategies__["c"]; });




var TreeNode = __WEBPACK_IMPORTED_MODULE_1__SelectNode__["a" /* default */];

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__Select__["a" /* default */]);

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_react_lifecycles_compat__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rc_util_es_KeyCode__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_shallowequal__ = __webpack_require__(140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_shallowequal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_shallowequal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_raf__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_raf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_raf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__SelectTrigger__ = __webpack_require__(143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__Base_BaseSelector__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__Base_BasePopup__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__Selector_SingleSelector__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__Selector_MultipleSelector__ = __webpack_require__(174);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__Popup_SinglePopup__ = __webpack_require__(176);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__Popup_MultiplePopup__ = __webpack_require__(177);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__strategies__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__util__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__propTypes__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__SelectNode__ = __webpack_require__(53);






/**
 * ARIA: https://www.w3.org/TR/wai-aria/#combobox
 * Sample 1: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/combobox/aria1.1pattern/listbox-combo.html
 * Sample 2: https://www.w3.org/blog/wai-components-gallery/widget/combobox-with-aria-autocompleteinline/
 *
 * Tab logic:
 * Popup is close
 * 1. Focus input (mark component as focused)
 * 2. Press enter to show the popup
 * 3. If popup has input, focus it
 *
 * Popup is open
 * 1. press tab to close the popup
 * 2. Focus back to the selection input box
 * 3. Let the native tab going on
 *
 * TreeSelect use 2 design type.
 * In single mode, we should focus on the `span`
 * In multiple mode, we should focus on the `input`
 */






















var Select = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(Select, _React$Component);

  function Select(props) {
    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, Select);

    var _this = __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

    _initialiseProps.call(_this);

    var prefixAria = props.prefixAria,
        defaultOpen = props.defaultOpen,
        open = props.open;


    _this.state = {
      open: open || defaultOpen,
      valueList: [],
      searchHalfCheckedKeys: [],
      missValueList: [], // Contains the value not in the tree
      selectorValueList: [], // Used for multiple selector
      valueEntities: {},
      keyEntities: {},
      searchValue: '',

      init: true
    };

    _this.selectorRef = Object(__WEBPACK_IMPORTED_MODULE_20__util__["g" /* createRef */])();
    _this.selectTriggerRef = Object(__WEBPACK_IMPORTED_MODULE_20__util__["g" /* createRef */])();

    // ARIA need `aria-controls` props mapping
    // Since this need user input. Let's generate ourselves
    _this.ariaId = Object(__WEBPACK_IMPORTED_MODULE_20__util__["k" /* generateAriaId */])(prefixAria + '-list');
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default()(Select, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        rcTreeSelect: {
          onSelectorFocus: this.onSelectorFocus,
          onSelectorBlur: this.onSelectorBlur,
          onSelectorKeyDown: this.onComponentKeyDown,
          onSelectorClear: this.onSelectorClear,
          onMultipleSelectorRemove: this.onMultipleSelectorRemove,

          onTreeNodeSelect: this.onTreeNodeSelect,
          onTreeNodeCheck: this.onTreeNodeCheck,
          onPopupKeyDown: this.onComponentKeyDown,

          onSearchInputChange: this.onSearchInputChange,
          onSearchInputKeyDown: this.onSearchInputKeyDown
        }
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          autoFocus = _props.autoFocus,
          disabled = _props.disabled;


      if (autoFocus && !disabled) {
        this.focus();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(_, prevState) {
      if (prevState.valueList !== this.state.valueList) {
        this.forcePopupAlign();
      }
    }

    // ==================== Selector ====================


    // Handle key board event in both Selector and Popup


    // ===================== Popup ======================


    // ==================== Trigger =====================

    /**
     * Only update the value which is not in props
     */


    // [Legacy] Origin provide `documentClickClose` which triggered by `Trigger`
    // Currently `TreeSelect` align the hide popup logic as `Select` which blur to hide.
    // `documentClickClose` is not accurate anymore. Let's just keep the key word.


    // Tree checkable is also a multiple case


    // [Legacy] To align with `Select` component,
    // We use `searchValue` instead of `inputValue`
    // but currently still need support that.
    // Add this method the check if is controlled


    /**
     * 1. Update state valueList.
     * 2. Fire `onChange` event to user.
     */

  }, {
    key: 'focus',
    value: function focus() {
      this.selectorRef.current.focus();
    }
  }, {
    key: 'blur',
    value: function blur() {
      this.selectorRef.current.blur();
    }

    // ===================== Render =====================

  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          valueList = _state.valueList,
          missValueList = _state.missValueList,
          selectorValueList = _state.selectorValueList,
          searchHalfCheckedKeys = _state.searchHalfCheckedKeys,
          valueEntities = _state.valueEntities,
          keyEntities = _state.keyEntities,
          searchValue = _state.searchValue,
          open = _state.open,
          focused = _state.focused,
          treeNodes = _state.treeNodes,
          filteredTreeNodes = _state.filteredTreeNodes;
      var _props2 = this.props,
          prefixCls = _props2.prefixCls,
          treeExpandedKeys = _props2.treeExpandedKeys,
          onTreeExpand = _props2.onTreeExpand;

      var isMultiple = this.isMultiple();

      var passProps = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, this.props, {
        isMultiple: isMultiple,
        valueList: valueList,
        searchHalfCheckedKeys: searchHalfCheckedKeys,
        selectorValueList: [].concat(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(missValueList), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(selectorValueList)),
        valueEntities: valueEntities,
        keyEntities: keyEntities,
        searchValue: searchValue,
        upperSearchValue: (searchValue || '').toUpperCase(), // Perf save
        open: open,
        focused: focused,
        onChoiceAnimationLeave: this.onChoiceAnimationLeave,
        dropdownPrefixCls: prefixCls + '-dropdown',
        ariaId: this.ariaId
      });

      var Popup = isMultiple ? __WEBPACK_IMPORTED_MODULE_18__Popup_MultiplePopup__["a" /* default */] : __WEBPACK_IMPORTED_MODULE_17__Popup_SinglePopup__["a" /* default */];
      var $popup = __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(Popup, __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, passProps, {
        onTreeExpanded: this.delayForcePopupAlign,
        treeNodes: treeNodes,
        filteredTreeNodes: filteredTreeNodes
        // Tree expanded control
        , treeExpandedKeys: treeExpandedKeys,
        onTreeExpand: onTreeExpand
      }));

      var Selector = isMultiple ? __WEBPACK_IMPORTED_MODULE_16__Selector_MultipleSelector__["a" /* default */] : __WEBPACK_IMPORTED_MODULE_15__Selector_SingleSelector__["a" /* default */];
      var $selector = __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(Selector, __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, passProps, {
        ref: this.selectorRef
      }));

      return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_12__SelectTrigger__["a" /* default */],
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, passProps, {

          ref: this.selectTriggerRef,
          popupElement: $popup,

          onKeyDown: this.onKeyDown,
          onDropdownVisibleChange: this.onDropdownVisibleChange
        }),
        $selector
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var _prevState$prevProps = prevState.prevProps,
          prevProps = _prevState$prevProps === undefined ? {} : _prevState$prevProps;
      var treeCheckable = nextProps.treeCheckable,
          treeCheckStrictly = nextProps.treeCheckStrictly,
          filterTreeNode = nextProps.filterTreeNode,
          treeNodeFilterProp = nextProps.treeNodeFilterProp,
          treeDataSimpleMode = nextProps.treeDataSimpleMode;

      var newState = {
        prevProps: nextProps,
        init: false
      };

      // Process the state when props updated
      function processState(propName, updater) {
        if (prevProps[propName] !== nextProps[propName]) {
          updater(nextProps[propName], prevProps[propName]);
          return true;
        }
        return false;
      }

      var valueRefresh = false;

      // Open
      processState('open', function (propValue) {
        newState.open = propValue;
      });

      // Tree Nodes
      var treeNodes = void 0;
      var treeDataChanged = false;
      var treeDataModeChanged = false;
      processState('treeData', function (propValue) {
        treeNodes = Object(__WEBPACK_IMPORTED_MODULE_20__util__["e" /* convertDataToTree */])(propValue);
        treeDataChanged = true;
      });

      processState('treeDataSimpleMode', function (propValue, prevValue) {
        if (!propValue) return;

        var prev = !prevValue || prevValue === true ? {} : prevValue;

        // Shallow equal to avoid dynamic prop object
        if (!__WEBPACK_IMPORTED_MODULE_10_shallowequal___default()(propValue, prev)) {
          treeDataModeChanged = true;
        }
      });

      // Parse by `treeDataSimpleMode`
      if (treeDataSimpleMode && (treeDataChanged || treeDataModeChanged)) {
        var simpleMapper = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({
          id: 'id',
          pId: 'pId',
          rootPId: null
        }, treeDataSimpleMode !== true ? treeDataSimpleMode : {});
        treeNodes = Object(__WEBPACK_IMPORTED_MODULE_20__util__["e" /* convertDataToTree */])(Object(__WEBPACK_IMPORTED_MODULE_20__util__["p" /* parseSimpleTreeData */])(nextProps.treeData, simpleMapper));
      }

      // If `treeData` not provide, use children TreeNodes
      if (!nextProps.treeData) {
        processState('children', function (propValue) {
          treeNodes = Array.isArray(propValue) ? propValue : [propValue];
        });
      }

      // Convert `treeData` to entities
      if (treeNodes) {
        var entitiesMap = Object(__WEBPACK_IMPORTED_MODULE_20__util__["f" /* convertTreeToEntities */])(treeNodes);
        newState.treeNodes = treeNodes;
        newState.posEntities = entitiesMap.posEntities;
        newState.valueEntities = entitiesMap.valueEntities;
        newState.keyEntities = entitiesMap.keyEntities;

        valueRefresh = true;
      }

      // Value List
      if (prevState.init) {
        processState('defaultValue', function (propValue) {
          newState.valueList = Object(__WEBPACK_IMPORTED_MODULE_20__util__["i" /* formatInternalValue */])(propValue, nextProps);
          valueRefresh = true;
        });
      }

      processState('value', function (propValue) {
        newState.valueList = Object(__WEBPACK_IMPORTED_MODULE_20__util__["i" /* formatInternalValue */])(propValue, nextProps);
        valueRefresh = true;
      });

      // Selector Value List
      if (valueRefresh) {
        // Find out that value not exist in the tree
        var missValueList = [];
        var filteredValueList = [];
        var keyList = [];

        // Get latest value list
        var latestValueList = newState.valueList;
        if (!latestValueList) {
          // Also need add prev missValueList to avoid new treeNodes contains the value
          latestValueList = [].concat(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(prevState.valueList), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(prevState.missValueList));
        }

        // Get key by value
        latestValueList.forEach(function (wrapperValue) {
          var value = wrapperValue.value;

          var entity = (newState.valueEntities || prevState.valueEntities)[value];

          if (entity) {
            keyList.push(entity.key);
            filteredValueList.push(wrapperValue);
            return;
          }

          // If not match, it may caused by ajax load. We need keep this
          missValueList.push(wrapperValue);
        });

        // We need calculate the value when tree is checked tree
        if (treeCheckable && !treeCheckStrictly) {
          // Calculate the keys need to be checked
          var _conductCheck = Object(__WEBPACK_IMPORTED_MODULE_20__util__["d" /* conductCheck */])(keyList, true, newState.keyEntities || prevState.keyEntities),
              checkedKeys = _conductCheck.checkedKeys;

          // Format value list again for internal usage


          newState.valueList = checkedKeys.map(function (key) {
            return {
              value: (newState.keyEntities || prevState.keyEntities)[key].value
            };
          });
        } else {
          newState.valueList = filteredValueList;
        }

        // Fill the missValueList, we still need display in the selector
        newState.missValueList = missValueList;

        // Calculate the value list for `Selector` usage
        newState.selectorValueList = Object(__WEBPACK_IMPORTED_MODULE_20__util__["j" /* formatSelectorValue */])(newState.valueList, nextProps, newState.valueEntities || prevState.valueEntities);
      }

      // [Legacy] To align with `Select` component,
      // We use `searchValue` instead of `inputValue` but still keep the api
      // `inputValue` support `null` to work as `autoClearSearchValue`
      processState('inputValue', function (propValue) {
        if (propValue !== null) {
          newState.searchValue = propValue;
        }
      });

      // Search value
      processState('searchValue', function (propValue) {
        newState.searchValue = propValue;
      });

      // Do the search logic
      if (newState.searchValue !== undefined || prevState.searchValue && treeNodes) {
        var searchValue = newState.searchValue !== undefined ? newState.searchValue : prevState.searchValue;
        var upperSearchValue = String(searchValue).toUpperCase();

        var filterTreeNodeFn = filterTreeNode;
        if (filterTreeNode === false) {
          // Don't filter if is false
          filterTreeNodeFn = function filterTreeNodeFn() {
            return true;
          };
        } else if (typeof filterTreeNodeFn !== 'function') {
          // When is not function (true or undefined), use inner filter
          filterTreeNodeFn = function filterTreeNodeFn(_, node) {
            var nodeValue = String(node.props[treeNodeFilterProp]).toUpperCase();
            return nodeValue.indexOf(upperSearchValue) !== -1;
          };
        }

        newState.filteredTreeNodes = Object(__WEBPACK_IMPORTED_MODULE_20__util__["l" /* getFilterTree */])(newState.treeNodes || prevState.treeNodes, searchValue, filterTreeNodeFn, newState.valueEntities || prevState.valueEntities);
      }

      // We should re-calculate the halfCheckedKeys when in search mode
      if (valueRefresh && treeCheckable && !treeCheckStrictly && (newState.searchValue || prevState.searchValue)) {
        newState.searchHalfCheckedKeys = Object(__WEBPACK_IMPORTED_MODULE_20__util__["m" /* getHalfCheckedKeys */])(newState.valueList, newState.valueEntities || prevState.valueEntities);
      }

      // Checked Strategy
      processState('showCheckedStrategy', function () {
        newState.selectorValueList = newState.selectorValueList || Object(__WEBPACK_IMPORTED_MODULE_20__util__["j" /* formatSelectorValue */])(newState.valueList || prevState.valueList, nextProps, newState.valueEntities || prevState.valueEntities);
      });

      return newState;
    }
  }]);

  return Select;
}(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component);

Select.propTypes = {
  prefixCls: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  prefixAria: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  multiple: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  showArrow: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  open: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  value: __WEBPACK_IMPORTED_MODULE_21__propTypes__["a" /* valueProp */],
  autoFocus: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,

  defaultOpen: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  defaultValue: __WEBPACK_IMPORTED_MODULE_21__propTypes__["a" /* valueProp */],

  showSearch: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  placeholder: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node,
  inputValue: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string, // [Legacy] Deprecated. Use `searchValue` instead.
  searchValue: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  autoClearSearchValue: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  searchPlaceholder: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node, // [Legacy] Confuse with placeholder
  disabled: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  children: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node,
  labelInValue: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  maxTagCount: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.number,
  maxTagPlaceholder: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func]),
  maxTagTextLength: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.number,
  showCheckedStrategy: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOf([__WEBPACK_IMPORTED_MODULE_19__strategies__["a" /* SHOW_ALL */], __WEBPACK_IMPORTED_MODULE_19__strategies__["c" /* SHOW_PARENT */], __WEBPACK_IMPORTED_MODULE_19__strategies__["b" /* SHOW_CHILD */]]),

  dropdownMatchSelectWidth: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  treeData: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.array,
  treeDataSimpleMode: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.object]),
  treeNodeFilterProp: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  treeNodeLabelProp: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  treeCheckable: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node]),
  treeCheckStrictly: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  treeIcon: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  treeLine: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  treeDefaultExpandAll: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  treeDefaultExpandedKeys: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.array,
  treeExpandedKeys: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.array,
  loadData: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  filterTreeNode: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool]),

  notFoundContent: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node,

  onSearch: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onSelect: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onDeselect: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onChange: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onDropdownVisibleChange: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,

  onTreeExpand: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,

  inputIcon: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func]),
  clearIcon: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func]),
  removeIcon: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func]),
  switcherIcon: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func])
};
Select.childContextTypes = {
  rcTreeSelect: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.shape(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, __WEBPACK_IMPORTED_MODULE_13__Base_BaseSelector__["b" /* selectorContextTypes */], __WEBPACK_IMPORTED_MODULE_16__Selector_MultipleSelector__["b" /* multipleSelectorContextTypes */], __WEBPACK_IMPORTED_MODULE_14__Base_BasePopup__["b" /* popupContextTypes */], {

    onSearchInputChange: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
    onSearchInputKeyDown: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func
  }))
};
Select.defaultProps = {
  prefixCls: 'rc-tree-select',
  prefixAria: 'rc-tree-select',
  showArrow: true,
  showSearch: true,
  autoClearSearchValue: true,
  showCheckedStrategy: __WEBPACK_IMPORTED_MODULE_19__strategies__["b" /* SHOW_CHILD */],

  // dropdownMatchSelectWidth change the origin design, set to false now
  // ref: https://github.com/react-component/select/blob/4cad95e098a341a09de239ad6981067188842020/src/Select.jsx#L344
  // ref: https://github.com/react-component/select/pull/71
  treeNodeFilterProp: 'value',
  treeNodeLabelProp: 'title',
  treeIcon: false,
  notFoundContent: 'Not Found'
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onSelectorFocus = function () {
    _this2.setState({ focused: true });
  };

  this.onSelectorBlur = function () {
    _this2.setState({ focused: false });

    // TODO: Close when Popup is also not focused
    // this.setState({ open: false });
  };

  this.onComponentKeyDown = function (event) {
    var open = _this2.state.open;
    var keyCode = event.keyCode;


    if (!open) {
      if ([__WEBPACK_IMPORTED_MODULE_9_rc_util_es_KeyCode__["a" /* default */].ENTER, __WEBPACK_IMPORTED_MODULE_9_rc_util_es_KeyCode__["a" /* default */].DOWN].indexOf(keyCode) !== -1) {
        _this2.setOpenState(true);
      }
    } else if (__WEBPACK_IMPORTED_MODULE_9_rc_util_es_KeyCode__["a" /* default */].ESC === keyCode) {
      _this2.setOpenState(false);
    } else if ([__WEBPACK_IMPORTED_MODULE_9_rc_util_es_KeyCode__["a" /* default */].UP, __WEBPACK_IMPORTED_MODULE_9_rc_util_es_KeyCode__["a" /* default */].DOWN, __WEBPACK_IMPORTED_MODULE_9_rc_util_es_KeyCode__["a" /* default */].LEFT, __WEBPACK_IMPORTED_MODULE_9_rc_util_es_KeyCode__["a" /* default */].RIGHT].indexOf(keyCode) !== -1) {
      // TODO: Handle `open` state
      event.stopPropagation();
    }
  };

  this.onDeselect = function (wrappedValue, node, nodeEventInfo) {
    var onDeselect = _this2.props.onDeselect;

    if (!onDeselect) return;

    onDeselect(wrappedValue, node, nodeEventInfo);
  };

  this.onSelectorClear = function (event) {
    var disabled = _this2.props.disabled;

    if (disabled) return;

    _this2.triggerChange([], []);

    if (!_this2.isSearchValueControlled()) {
      _this2.setUncontrolledState({
        searchValue: '',
        filteredTreeNodes: null
      });
    }

    event.stopPropagation();
  };

  this.onMultipleSelectorRemove = function (event, removeValue) {
    event.stopPropagation();

    var _state2 = _this2.state,
        valueList = _state2.valueList,
        missValueList = _state2.missValueList,
        valueEntities = _state2.valueEntities;
    var _props3 = _this2.props,
        treeCheckable = _props3.treeCheckable,
        treeCheckStrictly = _props3.treeCheckStrictly,
        treeNodeLabelProp = _props3.treeNodeLabelProp,
        disabled = _props3.disabled;

    if (disabled) return;

    // Find trigger entity
    var triggerEntity = valueEntities[removeValue];

    // Clean up value
    var newValueList = valueList;
    if (triggerEntity) {
      // If value is in tree
      if (treeCheckable && !treeCheckStrictly) {
        newValueList = valueList.filter(function (_ref) {
          var value = _ref.value;

          var entity = valueEntities[value];
          return !Object(__WEBPACK_IMPORTED_MODULE_20__util__["o" /* isPosRelated */])(entity.pos, triggerEntity.pos);
        });
      } else {
        newValueList = valueList.filter(function (_ref2) {
          var value = _ref2.value;
          return value !== removeValue;
        });
      }
    }

    var triggerNode = triggerEntity ? triggerEntity.node : null;

    var extraInfo = {
      triggerValue: removeValue,
      triggerNode: triggerNode
    };
    var deselectInfo = {
      node: triggerNode
    };

    // [Legacy] Little hack on this to make same action as `onCheck` event.
    if (treeCheckable) {
      var filteredEntityList = newValueList.map(function (_ref3) {
        var value = _ref3.value;
        return valueEntities[value];
      });

      deselectInfo.event = 'check';
      deselectInfo.checked = false;
      deselectInfo.checkedNodes = filteredEntityList.map(function (_ref4) {
        var node = _ref4.node;
        return node;
      });
      deselectInfo.checkedNodesPositions = filteredEntityList.map(function (_ref5) {
        var node = _ref5.node,
            pos = _ref5.pos;
        return { node: node, pos: pos };
      });

      if (treeCheckStrictly) {
        extraInfo.allCheckedNodes = deselectInfo.checkedNodes;
      } else {
        // TODO: It's too expansive to get `halfCheckedKeys` in onDeselect. Not pass this.
        extraInfo.allCheckedNodes = Object(__WEBPACK_IMPORTED_MODULE_20__util__["h" /* flatToHierarchy */])(filteredEntityList).map(function (_ref6) {
          var node = _ref6.node;
          return node;
        });
      }
    } else {
      deselectInfo.event = 'select';
      deselectInfo.selected = false;
      deselectInfo.selectedNodes = newValueList.map(function (_ref7) {
        var value = _ref7.value;
        return (valueEntities[value] || {}).node;
      });
    }

    // Some value user pass prop is not in the tree, we also need clean it
    var newMissValueList = missValueList.filter(function (_ref8) {
      var value = _ref8.value;
      return value !== removeValue;
    });

    var wrappedValue = void 0;
    if (_this2.isLabelInValue()) {
      wrappedValue = {
        label: triggerNode ? triggerNode.props[treeNodeLabelProp] : null,
        value: removeValue
      };
    } else {
      wrappedValue = removeValue;
    }

    _this2.onDeselect(wrappedValue, triggerNode, deselectInfo);

    _this2.triggerChange(newMissValueList, newValueList, extraInfo);
  };

  this.onValueTrigger = function (isAdd, nodeList, nodeEventInfo, nodeExtraInfo) {
    var node = nodeEventInfo.node;
    var value = node.props.value;
    var _state3 = _this2.state,
        missValueList = _state3.missValueList,
        valueEntities = _state3.valueEntities,
        keyEntities = _state3.keyEntities,
        searchValue = _state3.searchValue;
    var _props4 = _this2.props,
        disabled = _props4.disabled,
        inputValue = _props4.inputValue,
        treeNodeLabelProp = _props4.treeNodeLabelProp,
        onSelect = _props4.onSelect,
        onSearch = _props4.onSearch,
        treeCheckable = _props4.treeCheckable,
        treeCheckStrictly = _props4.treeCheckStrictly,
        autoClearSearchValue = _props4.autoClearSearchValue;

    var label = node.props[treeNodeLabelProp];

    if (disabled) return;

    // Wrap the return value for user
    var wrappedValue = void 0;
    if (_this2.isLabelInValue()) {
      wrappedValue = {
        value: value,
        label: label
      };
    } else {
      wrappedValue = value;
    }

    // [Legacy] Origin code not trigger `onDeselect` every time. Let's align the behaviour.
    if (isAdd) {
      if (onSelect) {
        onSelect(wrappedValue, node, nodeEventInfo);
      }
    } else {
      _this2.onDeselect(wrappedValue, node, nodeEventInfo);
    }

    // Get wrapped value list.
    // This is a bit hack cause we use key to match the value.
    var newValueList = nodeList.map(function (_ref9) {
      var props = _ref9.props;
      return {
        value: props.value,
        label: props[treeNodeLabelProp]
      };
    });

    // When is `treeCheckable` and with `searchValue`, `valueList` is not full filled.
    // We need calculate the missing nodes.
    if (treeCheckable && !treeCheckStrictly) {
      var keyList = newValueList.map(function (_ref10) {
        var val = _ref10.value;
        return valueEntities[val].key;
      });
      if (isAdd) {
        keyList = Object(__WEBPACK_IMPORTED_MODULE_20__util__["d" /* conductCheck */])(keyList, true, keyEntities).checkedKeys;
      } else {
        keyList = Object(__WEBPACK_IMPORTED_MODULE_20__util__["d" /* conductCheck */])([valueEntities[value].key], false, keyEntities, { checkedKeys: keyList }).checkedKeys;
      }
      newValueList = keyList.map(function (key) {
        var props = keyEntities[key].node.props;

        return {
          value: props.value,
          label: props[treeNodeLabelProp]
        };
      });
    }

    // Clean up `searchValue` when this prop is set
    if (autoClearSearchValue || inputValue === null) {
      // Clean state `searchValue` if uncontrolled
      if (!_this2.isSearchValueControlled()) {
        _this2.setUncontrolledState({
          searchValue: '',
          filteredTreeNodes: null
        });
      }

      // Trigger onSearch if `searchValue` to be empty.
      // We should also trigger onSearch with empty string here
      // since if user use `treeExpandedKeys`, it need user have the ability to reset it.
      if (onSearch && searchValue && searchValue.length) {
        onSearch('');
      }
    }

    // [Legacy] Provide extra info
    var extraInfo = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, nodeExtraInfo, {
      triggerValue: value,
      triggerNode: node
    });

    _this2.triggerChange(missValueList, newValueList, extraInfo);
  };

  this.onTreeNodeSelect = function (_, nodeEventInfo) {
    var _state4 = _this2.state,
        valueList = _state4.valueList,
        valueEntities = _state4.valueEntities;
    var _props5 = _this2.props,
        treeCheckable = _props5.treeCheckable,
        multiple = _props5.multiple;

    if (treeCheckable) return;

    if (!multiple) {
      _this2.setOpenState(false);
    }

    var isAdd = nodeEventInfo.selected;
    var selectedValue = nodeEventInfo.node.props.value;


    var newValueList = void 0;

    if (!multiple) {
      newValueList = [{ value: selectedValue }];
    } else {
      newValueList = valueList.filter(function (_ref11) {
        var value = _ref11.value;
        return value !== selectedValue;
      });
      if (isAdd) {
        newValueList.push({ value: selectedValue });
      }
    }

    var selectedNodes = newValueList.map(function (_ref12) {
      var value = _ref12.value;
      return valueEntities[value];
    }).filter(function (entity) {
      return entity;
    }).map(function (_ref13) {
      var node = _ref13.node;
      return node;
    });

    _this2.onValueTrigger(isAdd, selectedNodes, nodeEventInfo, { selected: isAdd });
  };

  this.onTreeNodeCheck = function (_, nodeEventInfo) {
    var _state5 = _this2.state,
        searchValue = _state5.searchValue,
        keyEntities = _state5.keyEntities,
        valueEntities = _state5.valueEntities,
        valueList = _state5.valueList;
    var treeCheckStrictly = _this2.props.treeCheckStrictly;
    var checkedNodes = nodeEventInfo.checkedNodes,
        checkedNodesPositions = nodeEventInfo.checkedNodesPositions;

    var isAdd = nodeEventInfo.checked;

    var extraInfo = {
      checked: isAdd
    };

    var checkedNodeList = checkedNodes;

    // [Legacy] Check event provide `allCheckedNodes`.
    // When `treeCheckStrictly` or internal `searchValue` is set, TreeNode will be unrelated:
    // - Related: Show the top checked nodes and has children prop.
    // - Unrelated: Show all the checked nodes.
    if (searchValue) {
      var oriKeyList = valueList.map(function (_ref14) {
        var value = _ref14.value;
        return valueEntities[value];
      }).filter(function (entity) {
        return entity;
      }).map(function (_ref15) {
        var key = _ref15.key;
        return key;
      });

      var keyList = void 0;
      if (isAdd) {
        keyList = Array.from(new Set([].concat(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(oriKeyList), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(checkedNodeList.map(function (_ref16) {
          var value = _ref16.props.value;
          return valueEntities[value].key;
        })))));
      } else {
        keyList = Object(__WEBPACK_IMPORTED_MODULE_20__util__["d" /* conductCheck */])([nodeEventInfo.node.props.eventKey], false, keyEntities, { checkedKeys: oriKeyList }).checkedKeys;
      }

      checkedNodeList = keyList.map(function (key) {
        return keyEntities[key].node;
      });

      // Let's follow as not `treeCheckStrictly` format
      extraInfo.allCheckedNodes = keyList.map(function (key) {
        return Object(__WEBPACK_IMPORTED_MODULE_20__util__["c" /* cleanEntity */])(keyEntities[key]);
      });
    } else if (treeCheckStrictly) {
      extraInfo.allCheckedNodes = nodeEventInfo.checkedNodes;
    } else {
      extraInfo.allCheckedNodes = Object(__WEBPACK_IMPORTED_MODULE_20__util__["h" /* flatToHierarchy */])(checkedNodesPositions);
    }

    _this2.onValueTrigger(isAdd, checkedNodeList, nodeEventInfo, extraInfo);
  };

  this.onDropdownVisibleChange = function (open) {
    _this2.setOpenState(open, true);
  };

  this.onSearchInputChange = function (_ref17) {
    var value = _ref17.target.value;
    var _state6 = _this2.state,
        treeNodes = _state6.treeNodes,
        valueEntities = _state6.valueEntities;
    var _props6 = _this2.props,
        onSearch = _props6.onSearch,
        filterTreeNode = _props6.filterTreeNode,
        treeNodeFilterProp = _props6.treeNodeFilterProp;


    if (onSearch) {
      onSearch(value);
    }

    var isSet = false;

    if (!_this2.isSearchValueControlled()) {
      isSet = _this2.setUncontrolledState({
        searchValue: value
      });
      _this2.setOpenState(true);
    }

    if (isSet) {
      // Do the search logic
      var upperSearchValue = String(value).toUpperCase();

      var filterTreeNodeFn = filterTreeNode;
      if (filterTreeNode === false) {
        filterTreeNodeFn = function filterTreeNodeFn() {
          return true;
        };
      } else if (!filterTreeNodeFn) {
        filterTreeNodeFn = function filterTreeNodeFn(_, node) {
          var nodeValue = String(node.props[treeNodeFilterProp]).toUpperCase();
          return nodeValue.indexOf(upperSearchValue) !== -1;
        };
      }

      _this2.setState({
        filteredTreeNodes: Object(__WEBPACK_IMPORTED_MODULE_20__util__["l" /* getFilterTree */])(treeNodes, value, filterTreeNodeFn, valueEntities)
      });
    }
  };

  this.onSearchInputKeyDown = function (event) {
    var _state7 = _this2.state,
        searchValue = _state7.searchValue,
        valueList = _state7.valueList;
    var keyCode = event.keyCode;


    if (__WEBPACK_IMPORTED_MODULE_9_rc_util_es_KeyCode__["a" /* default */].BACKSPACE === keyCode && _this2.isMultiple() && !searchValue && valueList.length) {
      var lastValue = valueList[valueList.length - 1].value;
      _this2.onMultipleSelectorRemove(event, lastValue);
    }
  };

  this.onChoiceAnimationLeave = function () {
    _this2.forcePopupAlign();
  };

  this.setUncontrolledState = function (state) {
    var needSync = false;
    var newState = {};

    Object.keys(state).forEach(function (name) {
      if (name in _this2.props) return;

      needSync = true;
      newState[name] = state[name];
    });

    if (needSync) {
      _this2.setState(newState);
    }

    return needSync;
  };

  this.setOpenState = function (open) {
    var byTrigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var onDropdownVisibleChange = _this2.props.onDropdownVisibleChange;


    if (onDropdownVisibleChange && onDropdownVisibleChange(open, { documentClickClose: !open && byTrigger }) === false) {
      return;
    }

    _this2.setUncontrolledState({ open: open });
  };

  this.isMultiple = function () {
    var _props7 = _this2.props,
        multiple = _props7.multiple,
        treeCheckable = _props7.treeCheckable;

    return !!(multiple || treeCheckable);
  };

  this.isLabelInValue = function () {
    return Object(__WEBPACK_IMPORTED_MODULE_20__util__["n" /* isLabelInValue */])(_this2.props);
  };

  this.isSearchValueControlled = function () {
    var inputValue = _this2.props.inputValue;

    if ('searchValue' in _this2.props) return true;
    return 'inputValue' in _this2.props && inputValue !== null;
  };

  this.forcePopupAlign = function () {
    var $trigger = _this2.selectTriggerRef.current;

    if ($trigger) {
      $trigger.forcePopupAlign();
    }
  };

  this.delayForcePopupAlign = function () {
    // Wait 2 frame to avoid dom update & dom algin in the same time
    // https://github.com/ant-design/ant-design/issues/12031
    __WEBPACK_IMPORTED_MODULE_11_raf___default()(function () {
      __WEBPACK_IMPORTED_MODULE_11_raf___default()(_this2.forcePopupAlign);
    });
  };

  this.triggerChange = function (missValueList, valueList) {
    var extraInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var _state8 = _this2.state,
        valueEntities = _state8.valueEntities,
        searchValue = _state8.searchValue;
    var _props8 = _this2.props,
        onChange = _props8.onChange,
        disabled = _props8.disabled,
        treeCheckable = _props8.treeCheckable,
        treeCheckStrictly = _props8.treeCheckStrictly;


    if (disabled) return;

    // Trigger
    var extra = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({
      // [Legacy] Always return as array contains label & value
      preValue: _this2.state.selectorValueList.map(function (_ref18) {
        var label = _ref18.label,
            value = _ref18.value;
        return { label: label, value: value };
      })
    }, extraInfo);

    // Format value by `treeCheckStrictly`
    var selectorValueList = Object(__WEBPACK_IMPORTED_MODULE_20__util__["j" /* formatSelectorValue */])(valueList, _this2.props, valueEntities);

    if (!('value' in _this2.props)) {
      var newState = {
        missValueList: missValueList,
        valueList: valueList,
        selectorValueList: selectorValueList
      };

      if (searchValue && treeCheckable && !treeCheckStrictly) {
        newState.searchHalfCheckedKeys = Object(__WEBPACK_IMPORTED_MODULE_20__util__["m" /* getHalfCheckedKeys */])(valueList, valueEntities);
      }

      _this2.setState(newState);
    }

    // Only do the logic when `onChange` function provided
    if (onChange) {
      var connectValueList = void 0;

      // Get value by mode
      if (_this2.isMultiple()) {
        connectValueList = [].concat(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(missValueList), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(selectorValueList));
      } else {
        connectValueList = selectorValueList.slice(0, 1);
      }

      var labelList = null;
      var returnValue = void 0;

      if (_this2.isLabelInValue()) {
        returnValue = connectValueList.map(function (_ref19) {
          var label = _ref19.label,
              value = _ref19.value;
          return { label: label, value: value };
        });
      } else {
        labelList = [];
        returnValue = connectValueList.map(function (_ref20) {
          var label = _ref20.label,
              value = _ref20.value;

          labelList.push(label);
          return value;
        });
      }

      if (!_this2.isMultiple()) {
        returnValue = returnValue[0];
      }

      onChange(returnValue, labelList, extra);
    }
  };
};

Select.TreeNode = __WEBPACK_IMPORTED_MODULE_22__SelectNode__["a" /* default */];
Select.SHOW_ALL = __WEBPACK_IMPORTED_MODULE_19__strategies__["a" /* SHOW_ALL */];
Select.SHOW_PARENT = __WEBPACK_IMPORTED_MODULE_19__strategies__["c" /* SHOW_PARENT */];
Select.SHOW_CHILD = __WEBPACK_IMPORTED_MODULE_19__strategies__["b" /* SHOW_CHILD */];

// Let warning show correct component name
Select.displayName = 'TreeSelect';

Object(__WEBPACK_IMPORTED_MODULE_8_react_lifecycles_compat__["a" /* polyfill */])(Select);

/* harmony default export */ __webpack_exports__["a"] = (Select);

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(57);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(58);
__webpack_require__(100);
module.exports = __webpack_require__(7).Array.from;


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(34);
var defined = __webpack_require__(35);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(38);
var descriptor = __webpack_require__(26);
var setToStringTag = __webpack_require__(43);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(20)(IteratorPrototype, __webpack_require__(8)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(12);
var anObject = __webpack_require__(21);
var getKeys = __webpack_require__(30);

module.exports = __webpack_require__(15) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(23);
var toLength = __webpack_require__(65);
var toAbsoluteIndex = __webpack_require__(97);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(34);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(11).document;
module.exports = document && document.documentElement;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(16);
var toObject = __webpack_require__(44);
var IE_PROTO = __webpack_require__(40)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(36);
var $export = __webpack_require__(14);
var toObject = __webpack_require__(44);
var call = __webpack_require__(101);
var isArrayIter = __webpack_require__(102);
var toLength = __webpack_require__(65);
var createProperty = __webpack_require__(103);
var getIterFn = __webpack_require__(104);

$export($export.S + $export.F * !__webpack_require__(106)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(21);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(27);
var ITERATOR = __webpack_require__(8)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(12);
var createDesc = __webpack_require__(26);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(105);
var ITERATOR = __webpack_require__(8)('iterator');
var Iterators = __webpack_require__(27);
module.exports = __webpack_require__(7).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(39);
var TAG = __webpack_require__(8)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(8)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(108), __esModule: true };

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(109);
module.exports = __webpack_require__(7).Object.assign;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(14);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(110) });


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(30);
var gOPS = __webpack_require__(45);
var pIE = __webpack_require__(32);
var toObject = __webpack_require__(44);
var IObject = __webpack_require__(64);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(25)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(112);
var $Object = __webpack_require__(7).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(14);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(15), 'Object', { defineProperty: __webpack_require__(12).f });


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(114), __esModule: true };

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(58);
__webpack_require__(115);
module.exports = __webpack_require__(46).f('iterator');


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(116);
var global = __webpack_require__(11);
var hide = __webpack_require__(20);
var Iterators = __webpack_require__(27);
var TO_STRING_TAG = __webpack_require__(8)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(117);
var step = __webpack_require__(118);
var Iterators = __webpack_require__(27);
var toIObject = __webpack_require__(23);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(59)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 117 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 118 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(120), __esModule: true };

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(121);
__webpack_require__(126);
__webpack_require__(127);
__webpack_require__(128);
module.exports = __webpack_require__(7).Symbol;


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(11);
var has = __webpack_require__(16);
var DESCRIPTORS = __webpack_require__(15);
var $export = __webpack_require__(14);
var redefine = __webpack_require__(62);
var META = __webpack_require__(122).KEY;
var $fails = __webpack_require__(25);
var shared = __webpack_require__(41);
var setToStringTag = __webpack_require__(43);
var uid = __webpack_require__(31);
var wks = __webpack_require__(8);
var wksExt = __webpack_require__(46);
var wksDefine = __webpack_require__(47);
var enumKeys = __webpack_require__(123);
var isArray = __webpack_require__(124);
var anObject = __webpack_require__(21);
var isObject = __webpack_require__(22);
var toIObject = __webpack_require__(23);
var toPrimitive = __webpack_require__(37);
var createDesc = __webpack_require__(26);
var _create = __webpack_require__(38);
var gOPNExt = __webpack_require__(125);
var $GOPD = __webpack_require__(69);
var $DP = __webpack_require__(12);
var $keys = __webpack_require__(30);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(68).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(32).f = $propertyIsEnumerable;
  __webpack_require__(45).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(29)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(20)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(31)('meta');
var isObject = __webpack_require__(22);
var has = __webpack_require__(16);
var setDesc = __webpack_require__(12).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(25)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(30);
var gOPS = __webpack_require__(45);
var pIE = __webpack_require__(32);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(39);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(23);
var gOPN = __webpack_require__(68).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 126 */
/***/ (function(module, exports) {



/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(47)('asyncIterator');


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(47)('observable');


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(130), __esModule: true };

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(131);
module.exports = __webpack_require__(7).Object.setPrototypeOf;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(14);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(132).set });


/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(22);
var anObject = __webpack_require__(21);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(36)(Function.call, __webpack_require__(69).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(134), __esModule: true };

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(135);
var $Object = __webpack_require__(7).Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(14);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(38) });


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var assign = __webpack_require__(70);

var ReactPropTypesSecret = __webpack_require__(48);
var checkPropTypes = __webpack_require__(137);

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret = __webpack_require__(48);
  var loggedTypeFailures = {};

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          )

        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

module.exports = checkPropTypes;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(48);

function emptyFunction() {}

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 139 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @ignore
 * some key-codes definition and utils from closure-library
 * @author yiminghe@gmail.com
 */

var KeyCode = {
  /**
   * MAC_ENTER
   */
  MAC_ENTER: 3,
  /**
   * BACKSPACE
   */
  BACKSPACE: 8,
  /**
   * TAB
   */
  TAB: 9,
  /**
   * NUMLOCK on FF/Safari Mac
   */
  NUM_CENTER: 12, // NUMLOCK on FF/Safari Mac
  /**
   * ENTER
   */
  ENTER: 13,
  /**
   * SHIFT
   */
  SHIFT: 16,
  /**
   * CTRL
   */
  CTRL: 17,
  /**
   * ALT
   */
  ALT: 18,
  /**
   * PAUSE
   */
  PAUSE: 19,
  /**
   * CAPS_LOCK
   */
  CAPS_LOCK: 20,
  /**
   * ESC
   */
  ESC: 27,
  /**
   * SPACE
   */
  SPACE: 32,
  /**
   * PAGE_UP
   */
  PAGE_UP: 33, // also NUM_NORTH_EAST
  /**
   * PAGE_DOWN
   */
  PAGE_DOWN: 34, // also NUM_SOUTH_EAST
  /**
   * END
   */
  END: 35, // also NUM_SOUTH_WEST
  /**
   * HOME
   */
  HOME: 36, // also NUM_NORTH_WEST
  /**
   * LEFT
   */
  LEFT: 37, // also NUM_WEST
  /**
   * UP
   */
  UP: 38, // also NUM_NORTH
  /**
   * RIGHT
   */
  RIGHT: 39, // also NUM_EAST
  /**
   * DOWN
   */
  DOWN: 40, // also NUM_SOUTH
  /**
   * PRINT_SCREEN
   */
  PRINT_SCREEN: 44,
  /**
   * INSERT
   */
  INSERT: 45, // also NUM_INSERT
  /**
   * DELETE
   */
  DELETE: 46, // also NUM_DELETE
  /**
   * ZERO
   */
  ZERO: 48,
  /**
   * ONE
   */
  ONE: 49,
  /**
   * TWO
   */
  TWO: 50,
  /**
   * THREE
   */
  THREE: 51,
  /**
   * FOUR
   */
  FOUR: 52,
  /**
   * FIVE
   */
  FIVE: 53,
  /**
   * SIX
   */
  SIX: 54,
  /**
   * SEVEN
   */
  SEVEN: 55,
  /**
   * EIGHT
   */
  EIGHT: 56,
  /**
   * NINE
   */
  NINE: 57,
  /**
   * QUESTION_MARK
   */
  QUESTION_MARK: 63, // needs localization
  /**
   * A
   */
  A: 65,
  /**
   * B
   */
  B: 66,
  /**
   * C
   */
  C: 67,
  /**
   * D
   */
  D: 68,
  /**
   * E
   */
  E: 69,
  /**
   * F
   */
  F: 70,
  /**
   * G
   */
  G: 71,
  /**
   * H
   */
  H: 72,
  /**
   * I
   */
  I: 73,
  /**
   * J
   */
  J: 74,
  /**
   * K
   */
  K: 75,
  /**
   * L
   */
  L: 76,
  /**
   * M
   */
  M: 77,
  /**
   * N
   */
  N: 78,
  /**
   * O
   */
  O: 79,
  /**
   * P
   */
  P: 80,
  /**
   * Q
   */
  Q: 81,
  /**
   * R
   */
  R: 82,
  /**
   * S
   */
  S: 83,
  /**
   * T
   */
  T: 84,
  /**
   * U
   */
  U: 85,
  /**
   * V
   */
  V: 86,
  /**
   * W
   */
  W: 87,
  /**
   * X
   */
  X: 88,
  /**
   * Y
   */
  Y: 89,
  /**
   * Z
   */
  Z: 90,
  /**
   * META
   */
  META: 91, // WIN_KEY_LEFT
  /**
   * WIN_KEY_RIGHT
   */
  WIN_KEY_RIGHT: 92,
  /**
   * CONTEXT_MENU
   */
  CONTEXT_MENU: 93,
  /**
   * NUM_ZERO
   */
  NUM_ZERO: 96,
  /**
   * NUM_ONE
   */
  NUM_ONE: 97,
  /**
   * NUM_TWO
   */
  NUM_TWO: 98,
  /**
   * NUM_THREE
   */
  NUM_THREE: 99,
  /**
   * NUM_FOUR
   */
  NUM_FOUR: 100,
  /**
   * NUM_FIVE
   */
  NUM_FIVE: 101,
  /**
   * NUM_SIX
   */
  NUM_SIX: 102,
  /**
   * NUM_SEVEN
   */
  NUM_SEVEN: 103,
  /**
   * NUM_EIGHT
   */
  NUM_EIGHT: 104,
  /**
   * NUM_NINE
   */
  NUM_NINE: 105,
  /**
   * NUM_MULTIPLY
   */
  NUM_MULTIPLY: 106,
  /**
   * NUM_PLUS
   */
  NUM_PLUS: 107,
  /**
   * NUM_MINUS
   */
  NUM_MINUS: 109,
  /**
   * NUM_PERIOD
   */
  NUM_PERIOD: 110,
  /**
   * NUM_DIVISION
   */
  NUM_DIVISION: 111,
  /**
   * F1
   */
  F1: 112,
  /**
   * F2
   */
  F2: 113,
  /**
   * F3
   */
  F3: 114,
  /**
   * F4
   */
  F4: 115,
  /**
   * F5
   */
  F5: 116,
  /**
   * F6
   */
  F6: 117,
  /**
   * F7
   */
  F7: 118,
  /**
   * F8
   */
  F8: 119,
  /**
   * F9
   */
  F9: 120,
  /**
   * F10
   */
  F10: 121,
  /**
   * F11
   */
  F11: 122,
  /**
   * F12
   */
  F12: 123,
  /**
   * NUMLOCK
   */
  NUMLOCK: 144,
  /**
   * SEMICOLON
   */
  SEMICOLON: 186, // needs localization
  /**
   * DASH
   */
  DASH: 189, // needs localization
  /**
   * EQUALS
   */
  EQUALS: 187, // needs localization
  /**
   * COMMA
   */
  COMMA: 188, // needs localization
  /**
   * PERIOD
   */
  PERIOD: 190, // needs localization
  /**
   * SLASH
   */
  SLASH: 191, // needs localization
  /**
   * APOSTROPHE
   */
  APOSTROPHE: 192, // needs localization
  /**
   * SINGLE_QUOTE
   */
  SINGLE_QUOTE: 222, // needs localization
  /**
   * OPEN_SQUARE_BRACKET
   */
  OPEN_SQUARE_BRACKET: 219, // needs localization
  /**
   * BACKSLASH
   */
  BACKSLASH: 220, // needs localization
  /**
   * CLOSE_SQUARE_BRACKET
   */
  CLOSE_SQUARE_BRACKET: 221, // needs localization
  /**
   * WIN_KEY
   */
  WIN_KEY: 224,
  /**
   * MAC_FF_META
   */
  MAC_FF_META: 224, // Firefox (Gecko) fires this for the meta key instead of 91
  /**
   * WIN_IME
   */
  WIN_IME: 229
};

/*
 whether text and modified key is entered at the same time.
 */
KeyCode.isTextModifyingKeyEvent = function isTextModifyingKeyEvent(e) {
  var keyCode = e.keyCode;
  if (e.altKey && !e.ctrlKey || e.metaKey ||
  // Function keys don't generate text
  keyCode >= KeyCode.F1 && keyCode <= KeyCode.F12) {
    return false;
  }

  // The following keys are quite harmless, even in combination with
  // CTRL, ALT or SHIFT.
  switch (keyCode) {
    case KeyCode.ALT:
    case KeyCode.CAPS_LOCK:
    case KeyCode.CONTEXT_MENU:
    case KeyCode.CTRL:
    case KeyCode.DOWN:
    case KeyCode.END:
    case KeyCode.ESC:
    case KeyCode.HOME:
    case KeyCode.INSERT:
    case KeyCode.LEFT:
    case KeyCode.MAC_FF_META:
    case KeyCode.META:
    case KeyCode.NUMLOCK:
    case KeyCode.NUM_CENTER:
    case KeyCode.PAGE_DOWN:
    case KeyCode.PAGE_UP:
    case KeyCode.PAUSE:
    case KeyCode.PRINT_SCREEN:
    case KeyCode.RIGHT:
    case KeyCode.SHIFT:
    case KeyCode.UP:
    case KeyCode.WIN_KEY:
    case KeyCode.WIN_KEY_RIGHT:
      return false;
    default:
      return true;
  }
};

/*
 whether character is entered.
 */
KeyCode.isCharacterKey = function isCharacterKey(keyCode) {
  if (keyCode >= KeyCode.ZERO && keyCode <= KeyCode.NINE) {
    return true;
  }

  if (keyCode >= KeyCode.NUM_ZERO && keyCode <= KeyCode.NUM_MULTIPLY) {
    return true;
  }

  if (keyCode >= KeyCode.A && keyCode <= KeyCode.Z) {
    return true;
  }

  // Safari sends zero key code for non-latin characters.
  if (window.navigation.userAgent.indexOf('WebKit') !== -1 && keyCode === 0) {
    return true;
  }

  switch (keyCode) {
    case KeyCode.SPACE:
    case KeyCode.QUESTION_MARK:
    case KeyCode.NUM_PLUS:
    case KeyCode.NUM_MINUS:
    case KeyCode.NUM_PERIOD:
    case KeyCode.NUM_DIVISION:
    case KeyCode.SEMICOLON:
    case KeyCode.DASH:
    case KeyCode.EQUALS:
    case KeyCode.COMMA:
    case KeyCode.PERIOD:
    case KeyCode.SLASH:
    case KeyCode.APOSTROPHE:
    case KeyCode.SINGLE_QUOTE:
    case KeyCode.OPEN_SQUARE_BRACKET:
    case KeyCode.BACKSLASH:
    case KeyCode.CLOSE_SQUARE_BRACKET:
      return true;
    default:
      return false;
  }
};

/* harmony default export */ __webpack_exports__["a"] = (KeyCode);

/***/ }),
/* 140 */
/***/ (function(module, exports) {

//

module.exports = function shallowEqual(objA, objB, compare, compareContext) {
  var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

  if (ret !== void 0) {
    return !!ret;
  }

  if (objA === objB) {
    return true;
  }

  if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  // Test for A's keys different from B.
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    var valueA = objA[key];
    var valueB = objB[key];

    ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

    if (ret === false || (ret === void 0 && valueA !== valueB)) {
      return false;
    }
  }

  return true;
};


/***/ }),
/* 141 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

//# sourceMappingURL=performance-now.js.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 143 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_lifecycles_compat__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_trigger__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_classnames__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__util__ = __webpack_require__(10);













var BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    },
    ignoreShake: true
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    },
    ignoreShake: true
  }
};

var SelectTrigger = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(SelectTrigger, _React$Component);

  function SelectTrigger() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, SelectTrigger);

    var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (SelectTrigger.__proto__ || Object.getPrototypeOf(SelectTrigger)).call(this));

    _this.getDropdownTransitionName = function () {
      var _this$props = _this.props,
          transitionName = _this$props.transitionName,
          animation = _this$props.animation,
          dropdownPrefixCls = _this$props.dropdownPrefixCls;

      if (!transitionName && animation) {
        return dropdownPrefixCls + '-' + animation;
      }
      return transitionName;
    };

    _this.forcePopupAlign = function () {
      var $trigger = _this.triggerRef.current;

      if ($trigger) {
        $trigger.forcePopupAlign();
      }
    };

    _this.triggerRef = Object(__WEBPACK_IMPORTED_MODULE_10__util__["g" /* createRef */])();
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(SelectTrigger, [{
    key: 'render',
    value: function render() {
      var _classNames;

      var _props = this.props,
          disabled = _props.disabled,
          isMultiple = _props.isMultiple,
          dropdownPopupAlign = _props.dropdownPopupAlign,
          dropdownMatchSelectWidth = _props.dropdownMatchSelectWidth,
          dropdownClassName = _props.dropdownClassName,
          dropdownStyle = _props.dropdownStyle,
          onDropdownVisibleChange = _props.onDropdownVisibleChange,
          getPopupContainer = _props.getPopupContainer,
          dropdownPrefixCls = _props.dropdownPrefixCls,
          popupElement = _props.popupElement,
          open = _props.open,
          children = _props.children;

      // TODO: [Legacy] Use new action when trigger fixed: https://github.com/react-component/trigger/pull/86

      // When false do nothing with the width
      // ref: https://github.com/ant-design/ant-design/issues/10927

      var stretch = void 0;
      if (dropdownMatchSelectWidth !== false) {
        stretch = dropdownMatchSelectWidth ? 'width' : 'minWidth';
      }

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_8_rc_trigger__["a" /* default */],
        {
          ref: this.triggerRef,
          action: disabled ? [] : ['click'],
          popupPlacement: 'bottomLeft',
          builtinPlacements: BUILT_IN_PLACEMENTS,
          popupAlign: dropdownPopupAlign,
          prefixCls: dropdownPrefixCls,
          popupTransitionName: this.getDropdownTransitionName(),
          onPopupVisibleChange: onDropdownVisibleChange,
          popup: popupElement,
          popupVisible: open,
          getPopupContainer: getPopupContainer,
          stretch: stretch,
          popupClassName: __WEBPACK_IMPORTED_MODULE_9_classnames___default()(dropdownClassName, (_classNames = {}, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, dropdownPrefixCls + '--multiple', isMultiple), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, dropdownPrefixCls + '--single', !isMultiple), _classNames)),
          popupStyle: dropdownStyle
        },
        children
      );
    }
  }]);

  return SelectTrigger;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

SelectTrigger.propTypes = {
  // Pass by outside user props
  disabled: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  showSearch: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  prefixCls: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  dropdownPopupAlign: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object,
  dropdownClassName: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  dropdownStyle: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object,
  transitionName: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  animation: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  getPopupContainer: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,
  children: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node,

  dropdownMatchSelectWidth: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,

  // Pass by Select
  isMultiple: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  dropdownPrefixCls: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  onDropdownVisibleChange: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,
  popupElement: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node,
  open: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool
};


Object(__WEBPACK_IMPORTED_MODULE_7_react_lifecycles_compat__["a" /* polyfill */])(SelectTrigger);

/* harmony default export */ __webpack_exports__["a"] = (SelectTrigger);

/***/ }),
/* 144 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_util_es_Dom_contains__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_util_es_Dom_addEventListener__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__Popup__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utils__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_rc_util_es_ContainerRender__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_rc_util_es_Portal__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_classnames__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_classnames__);















function noop() {}

function returnEmptyString() {
  return '';
}

function returnDocument() {
  return window.document;
}

var ALL_HANDLERS = ['onClick', 'onMouseDown', 'onTouchStart', 'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur', 'onContextMenu'];

var IS_REACT_16 = !!__WEBPACK_IMPORTED_MODULE_6_react_dom__["createPortal"];

var Trigger = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Trigger, _React$Component);

  function Trigger(props) {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Trigger);

    var _this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    var popupVisible = void 0;
    if ('popupVisible' in props) {
      popupVisible = !!props.popupVisible;
    } else {
      popupVisible = !!props.defaultPopupVisible;
    }

    _this.prevPopupVisible = popupVisible;

    _this.state = {
      popupVisible: popupVisible
    };
    return _this;
  }

  Trigger.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    ALL_HANDLERS.forEach(function (h) {
      _this2['fire' + h] = function (e) {
        _this2.fireEvents(h, e);
      };
    });
  };

  Trigger.prototype.componentDidMount = function componentDidMount() {
    this.componentDidUpdate({}, {
      popupVisible: this.state.popupVisible
    });
  };

  Trigger.prototype.componentWillReceiveProps = function componentWillReceiveProps(_ref) {
    var popupVisible = _ref.popupVisible;

    if (popupVisible !== undefined) {
      this.setState({
        popupVisible: popupVisible
      });
    }
  };

  Trigger.prototype.componentDidUpdate = function componentDidUpdate(_, prevState) {
    var props = this.props;
    var state = this.state;
    var triggerAfterPopupVisibleChange = function triggerAfterPopupVisibleChange() {
      if (prevState.popupVisible !== state.popupVisible) {
        props.afterPopupVisibleChange(state.popupVisible);
      }
    };
    if (!IS_REACT_16) {
      this.renderComponent(null, triggerAfterPopupVisibleChange);
    }

    this.prevPopupVisible = prevState.popupVisible;

    // We must listen to `mousedown` or `touchstart`, edge case:
    // https://github.com/ant-design/ant-design/issues/5804
    // https://github.com/react-component/calendar/issues/250
    // https://github.com/react-component/trigger/issues/50
    if (state.popupVisible) {
      var currentDocument = void 0;
      if (!this.clickOutsideHandler && (this.isClickToHide() || this.isContextMenuToShow())) {
        currentDocument = props.getDocument();
        this.clickOutsideHandler = Object(__WEBPACK_IMPORTED_MODULE_8_rc_util_es_Dom_addEventListener__["a" /* default */])(currentDocument, 'mousedown', this.onDocumentClick);
      }
      // always hide on mobile
      if (!this.touchOutsideHandler) {
        currentDocument = currentDocument || props.getDocument();
        this.touchOutsideHandler = Object(__WEBPACK_IMPORTED_MODULE_8_rc_util_es_Dom_addEventListener__["a" /* default */])(currentDocument, 'touchstart', this.onDocumentClick);
      }
      // close popup when trigger type contains 'onContextMenu' and document is scrolling.
      if (!this.contextMenuOutsideHandler1 && this.isContextMenuToShow()) {
        currentDocument = currentDocument || props.getDocument();
        this.contextMenuOutsideHandler1 = Object(__WEBPACK_IMPORTED_MODULE_8_rc_util_es_Dom_addEventListener__["a" /* default */])(currentDocument, 'scroll', this.onContextMenuClose);
      }
      // close popup when trigger type contains 'onContextMenu' and window is blur.
      if (!this.contextMenuOutsideHandler2 && this.isContextMenuToShow()) {
        this.contextMenuOutsideHandler2 = Object(__WEBPACK_IMPORTED_MODULE_8_rc_util_es_Dom_addEventListener__["a" /* default */])(window, 'blur', this.onContextMenuClose);
      }
      return;
    }

    this.clearOutsideHandler();
  };

  Trigger.prototype.componentWillUnmount = function componentWillUnmount() {
    this.clearDelayTimer();
    this.clearOutsideHandler();
  };

  Trigger.prototype.getPopupDomNode = function getPopupDomNode() {
    // for test
    if (this._component && this._component.getPopupDomNode) {
      return this._component.getPopupDomNode();
    }
    return null;
  };

  Trigger.prototype.getPopupAlign = function getPopupAlign() {
    var props = this.props;
    var popupPlacement = props.popupPlacement,
        popupAlign = props.popupAlign,
        builtinPlacements = props.builtinPlacements;

    if (popupPlacement && builtinPlacements) {
      return Object(__WEBPACK_IMPORTED_MODULE_10__utils__["a" /* getAlignFromPlacement */])(builtinPlacements, popupPlacement, popupAlign);
    }
    return popupAlign;
  };

  /**
   * @param popupVisible    Show or not the popup element
   * @param event           SyntheticEvent, used for `pointAlign`
   */
  Trigger.prototype.setPopupVisible = function setPopupVisible(popupVisible, event) {
    var alignPoint = this.props.alignPoint;


    this.clearDelayTimer();

    if (this.state.popupVisible !== popupVisible) {
      if (!('popupVisible' in this.props)) {
        this.setState({ popupVisible: popupVisible });
      }
      this.props.onPopupVisibleChange(popupVisible);
    }

    // Always record the point position since mouseEnterDelay will delay the show
    if (alignPoint && event) {
      this.setPoint(event);
    }
  };

  Trigger.prototype.delaySetPopupVisible = function delaySetPopupVisible(visible, delayS, event) {
    var _this3 = this;

    var delay = delayS * 1000;
    this.clearDelayTimer();
    if (delay) {
      var point = event ? { pageX: event.pageX, pageY: event.pageY } : null;
      this.delayTimer = setTimeout(function () {
        _this3.setPopupVisible(visible, point);
        _this3.clearDelayTimer();
      }, delay);
    } else {
      this.setPopupVisible(visible, event);
    }
  };

  Trigger.prototype.clearDelayTimer = function clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  };

  Trigger.prototype.clearOutsideHandler = function clearOutsideHandler() {
    if (this.clickOutsideHandler) {
      this.clickOutsideHandler.remove();
      this.clickOutsideHandler = null;
    }

    if (this.contextMenuOutsideHandler1) {
      this.contextMenuOutsideHandler1.remove();
      this.contextMenuOutsideHandler1 = null;
    }

    if (this.contextMenuOutsideHandler2) {
      this.contextMenuOutsideHandler2.remove();
      this.contextMenuOutsideHandler2 = null;
    }

    if (this.touchOutsideHandler) {
      this.touchOutsideHandler.remove();
      this.touchOutsideHandler = null;
    }
  };

  Trigger.prototype.createTwoChains = function createTwoChains(event) {
    var childPros = this.props.children.props;
    var props = this.props;
    if (childPros[event] && props[event]) {
      return this['fire' + event];
    }
    return childPros[event] || props[event];
  };

  Trigger.prototype.isClickToShow = function isClickToShow() {
    var _props = this.props,
        action = _props.action,
        showAction = _props.showAction;

    return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1;
  };

  Trigger.prototype.isContextMenuToShow = function isContextMenuToShow() {
    var _props2 = this.props,
        action = _props2.action,
        showAction = _props2.showAction;

    return action.indexOf('contextMenu') !== -1 || showAction.indexOf('contextMenu') !== -1;
  };

  Trigger.prototype.isClickToHide = function isClickToHide() {
    var _props3 = this.props,
        action = _props3.action,
        hideAction = _props3.hideAction;

    return action.indexOf('click') !== -1 || hideAction.indexOf('click') !== -1;
  };

  Trigger.prototype.isMouseEnterToShow = function isMouseEnterToShow() {
    var _props4 = this.props,
        action = _props4.action,
        showAction = _props4.showAction;

    return action.indexOf('hover') !== -1 || showAction.indexOf('mouseEnter') !== -1;
  };

  Trigger.prototype.isMouseLeaveToHide = function isMouseLeaveToHide() {
    var _props5 = this.props,
        action = _props5.action,
        hideAction = _props5.hideAction;

    return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseLeave') !== -1;
  };

  Trigger.prototype.isFocusToShow = function isFocusToShow() {
    var _props6 = this.props,
        action = _props6.action,
        showAction = _props6.showAction;

    return action.indexOf('focus') !== -1 || showAction.indexOf('focus') !== -1;
  };

  Trigger.prototype.isBlurToHide = function isBlurToHide() {
    var _props7 = this.props,
        action = _props7.action,
        hideAction = _props7.hideAction;

    return action.indexOf('focus') !== -1 || hideAction.indexOf('blur') !== -1;
  };

  Trigger.prototype.forcePopupAlign = function forcePopupAlign() {
    if (this.state.popupVisible && this._component && this._component.alignInstance) {
      this._component.alignInstance.forceAlign();
    }
  };

  Trigger.prototype.fireEvents = function fireEvents(type, e) {
    var childCallback = this.props.children.props[type];
    if (childCallback) {
      childCallback(e);
    }
    var callback = this.props[type];
    if (callback) {
      callback(e);
    }
  };

  Trigger.prototype.close = function close() {
    this.setPopupVisible(false);
  };

  Trigger.prototype.render = function render() {
    var _this4 = this;

    var popupVisible = this.state.popupVisible;
    var _props8 = this.props,
        children = _props8.children,
        forceRender = _props8.forceRender,
        alignPoint = _props8.alignPoint,
        className = _props8.className;

    var child = __WEBPACK_IMPORTED_MODULE_4_react___default.a.Children.only(children);
    var newChildProps = { key: 'trigger' };

    if (this.isContextMenuToShow()) {
      newChildProps.onContextMenu = this.onContextMenu;
    } else {
      newChildProps.onContextMenu = this.createTwoChains('onContextMenu');
    }

    if (this.isClickToHide() || this.isClickToShow()) {
      newChildProps.onClick = this.onClick;
      newChildProps.onMouseDown = this.onMouseDown;
      newChildProps.onTouchStart = this.onTouchStart;
    } else {
      newChildProps.onClick = this.createTwoChains('onClick');
      newChildProps.onMouseDown = this.createTwoChains('onMouseDown');
      newChildProps.onTouchStart = this.createTwoChains('onTouchStart');
    }
    if (this.isMouseEnterToShow()) {
      newChildProps.onMouseEnter = this.onMouseEnter;
      if (alignPoint) {
        newChildProps.onMouseMove = this.onMouseMove;
      }
    } else {
      newChildProps.onMouseEnter = this.createTwoChains('onMouseEnter');
    }
    if (this.isMouseLeaveToHide()) {
      newChildProps.onMouseLeave = this.onMouseLeave;
    } else {
      newChildProps.onMouseLeave = this.createTwoChains('onMouseLeave');
    }
    if (this.isFocusToShow() || this.isBlurToHide()) {
      newChildProps.onFocus = this.onFocus;
      newChildProps.onBlur = this.onBlur;
    } else {
      newChildProps.onFocus = this.createTwoChains('onFocus');
      newChildProps.onBlur = this.createTwoChains('onBlur');
    }

    var childrenClassName = __WEBPACK_IMPORTED_MODULE_13_classnames___default()(child && child.props && child.props.className, className);
    if (childrenClassName) {
      newChildProps.className = childrenClassName;
    }
    var trigger = __WEBPACK_IMPORTED_MODULE_4_react___default.a.cloneElement(child, newChildProps);

    if (!IS_REACT_16) {
      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_11_rc_util_es_ContainerRender__["a" /* default */],
        {
          parent: this,
          visible: popupVisible,
          autoMount: false,
          forceRender: forceRender,
          getComponent: this.getComponent,
          getContainer: this.getContainer
        },
        function (_ref2) {
          var renderComponent = _ref2.renderComponent;

          _this4.renderComponent = renderComponent;
          return trigger;
        }
      );
    }

    var portal = void 0;
    // prevent unmounting after it's rendered
    if (popupVisible || this._component || forceRender) {
      portal = __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_12_rc_util_es_Portal__["a" /* default */],
        {
          key: 'portal',
          getContainer: this.getContainer,
          didUpdate: this.handlePortalUpdate
        },
        this.getComponent()
      );
    }

    return [trigger, portal];
  };

  return Trigger;
}(__WEBPACK_IMPORTED_MODULE_4_react___default.a.Component);

Trigger.propTypes = {
  children: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.any,
  action: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string)]),
  showAction: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.any,
  hideAction: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.any,
  getPopupClassNameFromAlign: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.any,
  onPopupVisibleChange: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  afterPopupVisibleChange: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  popup: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func]).isRequired,
  popupStyle: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.object,
  prefixCls: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  popupClassName: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  className: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  popupPlacement: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  builtinPlacements: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.object,
  popupTransitionName: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.object]),
  popupAnimation: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.any,
  mouseEnterDelay: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
  mouseLeaveDelay: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
  zIndex: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
  focusDelay: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
  blurDelay: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
  getPopupContainer: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  getDocument: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  forceRender: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  destroyPopupOnHide: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  mask: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  maskClosable: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  onPopupAlign: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  popupAlign: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.object,
  popupVisible: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  defaultPopupVisible: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  maskTransitionName: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.object]),
  maskAnimation: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  stretch: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  alignPoint: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool // Maybe we can support user pass position in the future
};
Trigger.defaultProps = {
  prefixCls: 'rc-trigger-popup',
  getPopupClassNameFromAlign: returnEmptyString,
  getDocument: returnDocument,
  onPopupVisibleChange: noop,
  afterPopupVisibleChange: noop,
  onPopupAlign: noop,
  popupClassName: '',
  mouseEnterDelay: 0,
  mouseLeaveDelay: 0.1,
  focusDelay: 0,
  blurDelay: 0.15,
  popupStyle: {},
  destroyPopupOnHide: false,
  popupAlign: {},
  defaultPopupVisible: false,
  mask: false,
  maskClosable: true,
  action: [],
  showAction: [],
  hideAction: []
};

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.onMouseEnter = function (e) {
    var mouseEnterDelay = _this5.props.mouseEnterDelay;

    _this5.fireEvents('onMouseEnter', e);
    _this5.delaySetPopupVisible(true, mouseEnterDelay, mouseEnterDelay ? null : e);
  };

  this.onMouseMove = function (e) {
    _this5.fireEvents('onMouseMove', e);
    _this5.setPoint(e);
  };

  this.onMouseLeave = function (e) {
    _this5.fireEvents('onMouseLeave', e);
    _this5.delaySetPopupVisible(false, _this5.props.mouseLeaveDelay);
  };

  this.onPopupMouseEnter = function () {
    _this5.clearDelayTimer();
  };

  this.onPopupMouseLeave = function (e) {
    // https://github.com/react-component/trigger/pull/13
    // react bug?
    if (e.relatedTarget && !e.relatedTarget.setTimeout && _this5._component && _this5._component.getPopupDomNode && Object(__WEBPACK_IMPORTED_MODULE_7_rc_util_es_Dom_contains__["a" /* default */])(_this5._component.getPopupDomNode(), e.relatedTarget)) {
      return;
    }
    _this5.delaySetPopupVisible(false, _this5.props.mouseLeaveDelay);
  };

  this.onFocus = function (e) {
    _this5.fireEvents('onFocus', e);
    // incase focusin and focusout
    _this5.clearDelayTimer();
    if (_this5.isFocusToShow()) {
      _this5.focusTime = Date.now();
      _this5.delaySetPopupVisible(true, _this5.props.focusDelay);
    }
  };

  this.onMouseDown = function (e) {
    _this5.fireEvents('onMouseDown', e);
    _this5.preClickTime = Date.now();
  };

  this.onTouchStart = function (e) {
    _this5.fireEvents('onTouchStart', e);
    _this5.preTouchTime = Date.now();
  };

  this.onBlur = function (e) {
    _this5.fireEvents('onBlur', e);
    _this5.clearDelayTimer();
    if (_this5.isBlurToHide()) {
      _this5.delaySetPopupVisible(false, _this5.props.blurDelay);
    }
  };

  this.onContextMenu = function (e) {
    e.preventDefault();
    _this5.fireEvents('onContextMenu', e);
    _this5.setPopupVisible(true, e);
  };

  this.onContextMenuClose = function () {
    if (_this5.isContextMenuToShow()) {
      _this5.close();
    }
  };

  this.onClick = function (event) {
    _this5.fireEvents('onClick', event);
    // focus will trigger click
    if (_this5.focusTime) {
      var preTime = void 0;
      if (_this5.preClickTime && _this5.preTouchTime) {
        preTime = Math.min(_this5.preClickTime, _this5.preTouchTime);
      } else if (_this5.preClickTime) {
        preTime = _this5.preClickTime;
      } else if (_this5.preTouchTime) {
        preTime = _this5.preTouchTime;
      }
      if (Math.abs(preTime - _this5.focusTime) < 20) {
        return;
      }
      _this5.focusTime = 0;
    }
    _this5.preClickTime = 0;
    _this5.preTouchTime = 0;
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    var nextVisible = !_this5.state.popupVisible;
    if (_this5.isClickToHide() && !nextVisible || nextVisible && _this5.isClickToShow()) {
      _this5.setPopupVisible(!_this5.state.popupVisible, event);
    }
  };

  this.onDocumentClick = function (event) {
    if (_this5.props.mask && !_this5.props.maskClosable) {
      return;
    }
    var target = event.target;
    var root = Object(__WEBPACK_IMPORTED_MODULE_6_react_dom__["findDOMNode"])(_this5);
    var popupNode = _this5.getPopupDomNode();
    if (!Object(__WEBPACK_IMPORTED_MODULE_7_rc_util_es_Dom_contains__["a" /* default */])(root, target) && !Object(__WEBPACK_IMPORTED_MODULE_7_rc_util_es_Dom_contains__["a" /* default */])(popupNode, target)) {
      _this5.close();
    }
  };

  this.getRootDomNode = function () {
    return Object(__WEBPACK_IMPORTED_MODULE_6_react_dom__["findDOMNode"])(_this5);
  };

  this.getPopupClassNameFromAlign = function (align) {
    var className = [];
    var _props9 = _this5.props,
        popupPlacement = _props9.popupPlacement,
        builtinPlacements = _props9.builtinPlacements,
        prefixCls = _props9.prefixCls,
        alignPoint = _props9.alignPoint,
        getPopupClassNameFromAlign = _props9.getPopupClassNameFromAlign;

    if (popupPlacement && builtinPlacements) {
      className.push(Object(__WEBPACK_IMPORTED_MODULE_10__utils__["b" /* getAlignPopupClassName */])(builtinPlacements, prefixCls, align, alignPoint));
    }
    if (getPopupClassNameFromAlign) {
      className.push(getPopupClassNameFromAlign(align));
    }
    return className.join(' ');
  };

  this.getComponent = function () {
    var _props10 = _this5.props,
        prefixCls = _props10.prefixCls,
        destroyPopupOnHide = _props10.destroyPopupOnHide,
        popupClassName = _props10.popupClassName,
        action = _props10.action,
        onPopupAlign = _props10.onPopupAlign,
        popupAnimation = _props10.popupAnimation,
        popupTransitionName = _props10.popupTransitionName,
        popupStyle = _props10.popupStyle,
        mask = _props10.mask,
        maskAnimation = _props10.maskAnimation,
        maskTransitionName = _props10.maskTransitionName,
        zIndex = _props10.zIndex,
        popup = _props10.popup,
        stretch = _props10.stretch,
        alignPoint = _props10.alignPoint;
    var _state = _this5.state,
        popupVisible = _state.popupVisible,
        point = _state.point;


    var align = _this5.getPopupAlign();

    var mouseProps = {};
    if (_this5.isMouseEnterToShow()) {
      mouseProps.onMouseEnter = _this5.onPopupMouseEnter;
    }
    if (_this5.isMouseLeaveToHide()) {
      mouseProps.onMouseLeave = _this5.onPopupMouseLeave;
    }

    return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_9__Popup__["a" /* default */],
      __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
        prefixCls: prefixCls,
        destroyPopupOnHide: destroyPopupOnHide,
        visible: popupVisible,
        point: alignPoint && point,
        className: popupClassName,
        action: action,
        align: align,
        onAlign: onPopupAlign,
        animation: popupAnimation,
        getClassNameFromAlign: _this5.getPopupClassNameFromAlign
      }, mouseProps, {
        stretch: stretch,
        getRootDomNode: _this5.getRootDomNode,
        style: popupStyle,
        mask: mask,
        zIndex: zIndex,
        transitionName: popupTransitionName,
        maskAnimation: maskAnimation,
        maskTransitionName: maskTransitionName,
        ref: _this5.savePopup
      }),
      typeof popup === 'function' ? popup() : popup
    );
  };

  this.getContainer = function () {
    var props = _this5.props;

    var popupContainer = document.createElement('div');
    // Make sure default popup container will never cause scrollbar appearing
    // https://github.com/react-component/trigger/issues/41
    popupContainer.style.position = 'absolute';
    popupContainer.style.top = '0';
    popupContainer.style.left = '0';
    popupContainer.style.width = '100%';
    var mountNode = props.getPopupContainer ? props.getPopupContainer(Object(__WEBPACK_IMPORTED_MODULE_6_react_dom__["findDOMNode"])(_this5)) : props.getDocument().body;
    mountNode.appendChild(popupContainer);
    return popupContainer;
  };

  this.setPoint = function (point) {
    var alignPoint = _this5.props.alignPoint;

    if (!alignPoint || !point) return;

    _this5.setState({
      point: {
        pageX: point.pageX,
        pageY: point.pageY
      }
    });
  };

  this.handlePortalUpdate = function () {
    if (_this5.prevPopupVisible !== _this5.state.popupVisible) {
      _this5.props.afterPopupVisibleChange(_this5.state.popupVisible);
    }
  };

  this.savePopup = function (node) {
    _this5._component = node;
  };
};

/* harmony default export */ __webpack_exports__["a"] = (Trigger);

/***/ }),
/* 145 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = contains;
function contains(root, n) {
  var node = n;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
}

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = addEventListener;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _EventObject = __webpack_require__(147);

var _EventObject2 = _interopRequireDefault(_EventObject);

function addEventListener(target, eventType, callback, option) {
  function wrapCallback(e) {
    var ne = new _EventObject2['default'](e);
    callback.call(target, ne);
  }

  if (target.addEventListener) {
    var _ret = (function () {
      var useCapture = false;
      if (typeof option === 'object') {
        useCapture = option.capture || false;
      } else if (typeof option === 'boolean') {
        useCapture = option;
      }

      target.addEventListener(eventType, wrapCallback, option || false);

      return {
        v: {
          remove: function remove() {
            target.removeEventListener(eventType, wrapCallback, useCapture);
          }
        }
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  } else if (target.attachEvent) {
    target.attachEvent('on' + eventType, wrapCallback);
    return {
      remove: function remove() {
        target.detachEvent('on' + eventType, wrapCallback);
      }
    };
  }
}

module.exports = exports['default'];

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @ignore
 * event object for dom
 * @author yiminghe@gmail.com
 */



Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _EventBaseObject = __webpack_require__(148);

var _EventBaseObject2 = _interopRequireDefault(_EventBaseObject);

var _objectAssign = __webpack_require__(70);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var TRUE = true;
var FALSE = false;
var commonProps = ['altKey', 'bubbles', 'cancelable', 'ctrlKey', 'currentTarget', 'eventPhase', 'metaKey', 'shiftKey', 'target', 'timeStamp', 'view', 'type'];

function isNullOrUndefined(w) {
  return w === null || w === undefined;
}

var eventNormalizers = [{
  reg: /^key/,
  props: ['char', 'charCode', 'key', 'keyCode', 'which'],
  fix: function fix(event, nativeEvent) {
    if (isNullOrUndefined(event.which)) {
      event.which = !isNullOrUndefined(nativeEvent.charCode) ? nativeEvent.charCode : nativeEvent.keyCode;
    }

    // add metaKey to non-Mac browsers (use ctrl for PC 's and Meta for Macs)
    if (event.metaKey === undefined) {
      event.metaKey = event.ctrlKey;
    }
  }
}, {
  reg: /^touch/,
  props: ['touches', 'changedTouches', 'targetTouches']
}, {
  reg: /^hashchange$/,
  props: ['newURL', 'oldURL']
}, {
  reg: /^gesturechange$/i,
  props: ['rotation', 'scale']
}, {
  reg: /^(mousewheel|DOMMouseScroll)$/,
  props: [],
  fix: function fix(event, nativeEvent) {
    var deltaX = undefined;
    var deltaY = undefined;
    var delta = undefined;
    var wheelDelta = nativeEvent.wheelDelta;
    var axis = nativeEvent.axis;
    var wheelDeltaY = nativeEvent.wheelDeltaY;
    var wheelDeltaX = nativeEvent.wheelDeltaX;
    var detail = nativeEvent.detail;

    // ie/webkit
    if (wheelDelta) {
      delta = wheelDelta / 120;
    }

    // gecko
    if (detail) {
      // press control e.detail == 1 else e.detail == 3
      delta = 0 - (detail % 3 === 0 ? detail / 3 : detail);
    }

    // Gecko
    if (axis !== undefined) {
      if (axis === event.HORIZONTAL_AXIS) {
        deltaY = 0;
        deltaX = 0 - delta;
      } else if (axis === event.VERTICAL_AXIS) {
        deltaX = 0;
        deltaY = delta;
      }
    }

    // Webkit
    if (wheelDeltaY !== undefined) {
      deltaY = wheelDeltaY / 120;
    }
    if (wheelDeltaX !== undefined) {
      deltaX = -1 * wheelDeltaX / 120;
    }

    // 默认 deltaY (ie)
    if (!deltaX && !deltaY) {
      deltaY = delta;
    }

    if (deltaX !== undefined) {
      /**
       * deltaX of mousewheel event
       * @property deltaX
       * @member Event.DomEvent.Object
       */
      event.deltaX = deltaX;
    }

    if (deltaY !== undefined) {
      /**
       * deltaY of mousewheel event
       * @property deltaY
       * @member Event.DomEvent.Object
       */
      event.deltaY = deltaY;
    }

    if (delta !== undefined) {
      /**
       * delta of mousewheel event
       * @property delta
       * @member Event.DomEvent.Object
       */
      event.delta = delta;
    }
  }
}, {
  reg: /^mouse|contextmenu|click|mspointer|(^DOMMouseScroll$)/i,
  props: ['buttons', 'clientX', 'clientY', 'button', 'offsetX', 'relatedTarget', 'which', 'fromElement', 'toElement', 'offsetY', 'pageX', 'pageY', 'screenX', 'screenY'],
  fix: function fix(event, nativeEvent) {
    var eventDoc = undefined;
    var doc = undefined;
    var body = undefined;
    var target = event.target;
    var button = nativeEvent.button;

    // Calculate pageX/Y if missing and clientX/Y available
    if (target && isNullOrUndefined(event.pageX) && !isNullOrUndefined(nativeEvent.clientX)) {
      eventDoc = target.ownerDocument || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;
      event.pageX = nativeEvent.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = nativeEvent.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    }

    // which for click: 1 === left; 2 === middle; 3 === right
    // do not use button
    if (!event.which && button !== undefined) {
      if (button & 1) {
        event.which = 1;
      } else if (button & 2) {
        event.which = 3;
      } else if (button & 4) {
        event.which = 2;
      } else {
        event.which = 0;
      }
    }

    // add relatedTarget, if necessary
    if (!event.relatedTarget && event.fromElement) {
      event.relatedTarget = event.fromElement === target ? event.toElement : event.fromElement;
    }

    return event;
  }
}];

function retTrue() {
  return TRUE;
}

function retFalse() {
  return FALSE;
}

function DomEventObject(nativeEvent) {
  var type = nativeEvent.type;

  var isNative = typeof nativeEvent.stopPropagation === 'function' || typeof nativeEvent.cancelBubble === 'boolean';

  _EventBaseObject2['default'].call(this);

  this.nativeEvent = nativeEvent;

  // in case dom event has been mark as default prevented by lower dom node
  var isDefaultPrevented = retFalse;
  if ('defaultPrevented' in nativeEvent) {
    isDefaultPrevented = nativeEvent.defaultPrevented ? retTrue : retFalse;
  } else if ('getPreventDefault' in nativeEvent) {
    // https://bugzilla.mozilla.org/show_bug.cgi?id=691151
    isDefaultPrevented = nativeEvent.getPreventDefault() ? retTrue : retFalse;
  } else if ('returnValue' in nativeEvent) {
    isDefaultPrevented = nativeEvent.returnValue === FALSE ? retTrue : retFalse;
  }

  this.isDefaultPrevented = isDefaultPrevented;

  var fixFns = [];
  var fixFn = undefined;
  var l = undefined;
  var prop = undefined;
  var props = commonProps.concat();

  eventNormalizers.forEach(function (normalizer) {
    if (type.match(normalizer.reg)) {
      props = props.concat(normalizer.props);
      if (normalizer.fix) {
        fixFns.push(normalizer.fix);
      }
    }
  });

  l = props.length;

  // clone properties of the original event object
  while (l) {
    prop = props[--l];
    this[prop] = nativeEvent[prop];
  }

  // fix target property, if necessary
  if (!this.target && isNative) {
    this.target = nativeEvent.srcElement || document; // srcElement might not be defined either
  }

  // check if target is a text node (safari)
  if (this.target && this.target.nodeType === 3) {
    this.target = this.target.parentNode;
  }

  l = fixFns.length;

  while (l) {
    fixFn = fixFns[--l];
    fixFn(this, nativeEvent);
  }

  this.timeStamp = nativeEvent.timeStamp || Date.now();
}

var EventBaseObjectProto = _EventBaseObject2['default'].prototype;

(0, _objectAssign2['default'])(DomEventObject.prototype, EventBaseObjectProto, {
  constructor: DomEventObject,

  preventDefault: function preventDefault() {
    var e = this.nativeEvent;

    // if preventDefault exists run it on the original event
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      // otherwise set the returnValue property of the original event to FALSE (IE)
      e.returnValue = FALSE;
    }

    EventBaseObjectProto.preventDefault.call(this);
  },

  stopPropagation: function stopPropagation() {
    var e = this.nativeEvent;

    // if stopPropagation exists run it on the original event
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      // otherwise set the cancelBubble property of the original event to TRUE (IE)
      e.cancelBubble = TRUE;
    }

    EventBaseObjectProto.stopPropagation.call(this);
  }
});

exports['default'] = DomEventObject;
module.exports = exports['default'];

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @ignore
 * base event object for custom and dom event.
 * @author yiminghe@gmail.com
 */



Object.defineProperty(exports, "__esModule", {
  value: true
});
function returnFalse() {
  return false;
}

function returnTrue() {
  return true;
}

function EventBaseObject() {
  this.timeStamp = Date.now();
  this.target = undefined;
  this.currentTarget = undefined;
}

EventBaseObject.prototype = {
  isEventObject: 1,

  constructor: EventBaseObject,

  isDefaultPrevented: returnFalse,

  isPropagationStopped: returnFalse,

  isImmediatePropagationStopped: returnFalse,

  preventDefault: function preventDefault() {
    this.isDefaultPrevented = returnTrue;
  },

  stopPropagation: function stopPropagation() {
    this.isPropagationStopped = returnTrue;
  },

  stopImmediatePropagation: function stopImmediatePropagation() {
    this.isImmediatePropagationStopped = returnTrue;
    // fixed 1.2
    // call stopPropagation implicitly
    this.stopPropagation();
  },

  halt: function halt(immediate) {
    if (immediate) {
      this.stopImmediatePropagation();
    } else {
      this.stopPropagation();
    }
    this.preventDefault();
  }
};

exports["default"] = EventBaseObject;
module.exports = exports["default"];

/***/ }),
/* 149 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_align__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_animate__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_raf__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_raf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_raf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__PopupInner__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__LazyRenderBox__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__utils__ = __webpack_require__(79);














var Popup = function (_Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Popup, _Component);

  function Popup(props) {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Popup);

    var _this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, _Component.call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      // Used for stretch
      stretchChecked: false,
      targetWidth: undefined,
      targetHeight: undefined
    };

    _this.savePopupRef = __WEBPACK_IMPORTED_MODULE_12__utils__["c" /* saveRef */].bind(_this, 'popupInstance');
    _this.saveAlignRef = __WEBPACK_IMPORTED_MODULE_12__utils__["c" /* saveRef */].bind(_this, 'alignInstance');
    return _this;
  }

  Popup.prototype.componentDidMount = function componentDidMount() {
    this.rootNode = this.getPopupDomNode();
    this.setStretchSize();
  };

  Popup.prototype.componentDidUpdate = function componentDidUpdate() {
    this.setStretchSize();
  };

  // Record size if stretch needed


  Popup.prototype.getPopupDomNode = function getPopupDomNode() {
    return __WEBPACK_IMPORTED_MODULE_6_react_dom___default.a.findDOMNode(this.popupInstance);
  };

  // `target` on `rc-align` can accept as a function to get the bind element or a point.
  // ref: https://www.npmjs.com/package/rc-align


  Popup.prototype.getMaskTransitionName = function getMaskTransitionName() {
    var props = this.props;
    var transitionName = props.maskTransitionName;
    var animation = props.maskAnimation;
    if (!transitionName && animation) {
      transitionName = props.prefixCls + '-' + animation;
    }
    return transitionName;
  };

  Popup.prototype.getTransitionName = function getTransitionName() {
    var props = this.props;
    var transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = props.prefixCls + '-' + props.animation;
    }
    return transitionName;
  };

  Popup.prototype.getClassName = function getClassName(currentAlignClassName) {
    return this.props.prefixCls + ' ' + this.props.className + ' ' + currentAlignClassName;
  };

  Popup.prototype.getPopupElement = function getPopupElement() {
    var _this2 = this;

    var savePopupRef = this.savePopupRef;
    var _state = this.state,
        stretchChecked = _state.stretchChecked,
        targetHeight = _state.targetHeight,
        targetWidth = _state.targetWidth;
    var _props = this.props,
        align = _props.align,
        visible = _props.visible,
        prefixCls = _props.prefixCls,
        style = _props.style,
        getClassNameFromAlign = _props.getClassNameFromAlign,
        destroyPopupOnHide = _props.destroyPopupOnHide,
        stretch = _props.stretch,
        children = _props.children,
        onMouseEnter = _props.onMouseEnter,
        onMouseLeave = _props.onMouseLeave;

    var className = this.getClassName(this.currentAlignClassName || getClassNameFromAlign(align));
    var hiddenClassName = prefixCls + '-hidden';

    if (!visible) {
      this.currentAlignClassName = null;
    }

    var sizeStyle = {};
    if (stretch) {
      // Stretch with target
      if (stretch.indexOf('height') !== -1) {
        sizeStyle.height = targetHeight;
      } else if (stretch.indexOf('minHeight') !== -1) {
        sizeStyle.minHeight = targetHeight;
      }
      if (stretch.indexOf('width') !== -1) {
        sizeStyle.width = targetWidth;
      } else if (stretch.indexOf('minWidth') !== -1) {
        sizeStyle.minWidth = targetWidth;
      }

      // Delay force align to makes ui smooth
      if (!stretchChecked) {
        sizeStyle.visibility = 'hidden';
        __WEBPACK_IMPORTED_MODULE_9_raf___default()(function () {
          if (_this2.alignInstance) {
            _this2.alignInstance.forceAlign();
          }
        });
      }
    }

    var newStyle = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, sizeStyle, style, this.getZIndexStyle());

    var popupInnerProps = {
      className: className,
      prefixCls: prefixCls,
      ref: savePopupRef,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      style: newStyle
    };

    if (destroyPopupOnHide) {
      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_8_rc_animate__["a" /* default */],
        {
          component: '',
          exclusive: true,
          transitionAppear: true,
          transitionName: this.getTransitionName(),
          onLeave: this.onAnimateLeaved
        },
        visible ? __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_7_rc_align__["a" /* default */],
          {
            target: this.getAlignTarget(),
            key: 'popup',
            ref: this.saveAlignRef,
            monitorWindowResize: true,
            align: align,
            onAlign: this.onAlign
          },
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_10__PopupInner__["a" /* default */],
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
              visible: true
            }, popupInnerProps),
            children
          )
        ) : null
      );
    }

    return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_8_rc_animate__["a" /* default */],
      {
        component: '',
        exclusive: true,
        transitionAppear: true,
        transitionName: this.getTransitionName(),
        showProp: 'xVisible',
        onLeave: this.onAnimateLeaved
      },
      __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_7_rc_align__["a" /* default */],
        {
          target: this.getAlignTarget(),
          key: 'popup',
          ref: this.saveAlignRef,
          monitorWindowResize: true,
          xVisible: visible,
          childrenProps: { visible: 'xVisible' },
          disabled: !visible,
          align: align,
          onAlign: this.onAlign
        },
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_10__PopupInner__["a" /* default */],
          __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
            hiddenClassName: hiddenClassName
          }, popupInnerProps),
          children
        )
      )
    );
  };

  Popup.prototype.getZIndexStyle = function getZIndexStyle() {
    var style = {};
    var props = this.props;
    if (props.zIndex !== undefined) {
      style.zIndex = props.zIndex;
    }
    return style;
  };

  Popup.prototype.getMaskElement = function getMaskElement() {
    var props = this.props;
    var maskElement = void 0;
    if (props.mask) {
      var maskTransition = this.getMaskTransitionName();
      maskElement = __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_11__LazyRenderBox__["a" /* default */], {
        style: this.getZIndexStyle(),
        key: 'mask',
        className: props.prefixCls + '-mask',
        hiddenClassName: props.prefixCls + '-mask-hidden',
        visible: props.visible
      });
      if (maskTransition) {
        maskElement = __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_8_rc_animate__["a" /* default */],
          {
            key: 'mask',
            showProp: 'visible',
            transitionAppear: true,
            component: '',
            transitionName: maskTransition
          },
          maskElement
        );
      }
    }
    return maskElement;
  };

  Popup.prototype.render = function render() {
    return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
      'div',
      null,
      this.getMaskElement(),
      this.getPopupElement()
    );
  };

  return Popup;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

Popup.propTypes = {
  visible: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  style: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.object,
  getClassNameFromAlign: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  onAlign: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  getRootDomNode: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  onMouseEnter: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  align: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.any,
  destroyPopupOnHide: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.bool,
  className: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  prefixCls: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  onMouseLeave: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  stretch: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.string,
  children: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.node,
  point: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.shape({
    pageX: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
    pageY: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number
  })
};

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onAlign = function (popupDomNode, align) {
    var props = _this3.props;
    var currentAlignClassName = props.getClassNameFromAlign(align);
    // FIX: https://github.com/react-component/trigger/issues/56
    // FIX: https://github.com/react-component/tooltip/issues/79
    if (_this3.currentAlignClassName !== currentAlignClassName) {
      _this3.currentAlignClassName = currentAlignClassName;
      popupDomNode.className = _this3.getClassName(currentAlignClassName);
    }
    props.onAlign(popupDomNode, align);
  };

  this.onAnimateLeaved = function () {
    var stretch = _this3.props.stretch;
    var stretchChecked = _this3.state.stretchChecked;

    if (stretch && stretchChecked) {
      _this3.setState({ stretchChecked: false });
    }
  };

  this.setStretchSize = function () {
    var getRootDomNode = _this3.props.getRootDomNode;
    var _state2 = _this3.state,
        stretchChecked = _state2.stretchChecked,
        targetHeight = _state2.targetHeight,
        targetWidth = _state2.targetWidth;


    var $ele = getRootDomNode();
    if (!$ele) return;

    var height = $ele.offsetHeight;
    var width = $ele.offsetWidth;

    if (targetHeight !== height || targetWidth !== width || !stretchChecked) {
      _this3.setState({
        stretchChecked: true,
        targetHeight: height,
        targetWidth: width
      });
    }
  };

  this.getTargetElement = function () {
    return _this3.props.getRootDomNode();
  };

  this.getAlignTarget = function () {
    var point = _this3.props.point;

    if (point) {
      return point;
    }
    return _this3.getTargetElement;
  };
};

/* harmony default export */ __webpack_exports__["a"] = (Popup);

/***/ }),
/* 150 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Align__ = __webpack_require__(151);
// export this package's api


/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__Align__["a" /* default */]);

/***/ }),
/* 151 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_dom_align__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_util_es_Dom_addEventListener__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__util__ = __webpack_require__(160);











function getElement(func) {
  if (typeof func !== 'function' || !func) return null;
  return func();
}

function getPoint(point) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}

var Align = function (_Component) {
  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default()(Align, _Component);

  function Align() {
    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Align);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.forceAlign = function () {
      var _this$props = _this.props,
          disabled = _this$props.disabled,
          target = _this$props.target,
          align = _this$props.align,
          onAlign = _this$props.onAlign;

      if (!disabled && target) {
        var source = __WEBPACK_IMPORTED_MODULE_5_react_dom___default.a.findDOMNode(_this);

        var result = void 0;
        var element = getElement(target);
        var point = getPoint(target);

        if (element) {
          result = Object(__WEBPACK_IMPORTED_MODULE_6_dom_align__["a" /* alignElement */])(source, element, align);
        } else if (point) {
          result = Object(__WEBPACK_IMPORTED_MODULE_6_dom_align__["b" /* alignPoint */])(source, point, align);
        }

        if (onAlign) {
          onAlign(source, result);
        }
      }
    }, _temp), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  Align.prototype.componentDidMount = function componentDidMount() {
    var props = this.props;
    // if parent ref not attached .... use document.getElementById
    this.forceAlign();
    if (!props.disabled && props.monitorWindowResize) {
      this.startMonitorWindowResize();
    }
  };

  Align.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var reAlign = false;
    var props = this.props;

    if (!props.disabled) {
      var source = __WEBPACK_IMPORTED_MODULE_5_react_dom___default.a.findDOMNode(this);
      var sourceRect = source ? source.getBoundingClientRect() : null;

      if (prevProps.disabled) {
        reAlign = true;
      } else {
        var lastElement = getElement(prevProps.target);
        var currentElement = getElement(props.target);
        var lastPoint = getPoint(prevProps.target);
        var currentPoint = getPoint(props.target);

        if (Object(__WEBPACK_IMPORTED_MODULE_8__util__["c" /* isWindow */])(lastElement) && Object(__WEBPACK_IMPORTED_MODULE_8__util__["c" /* isWindow */])(currentElement)) {
          // Skip if is window
          reAlign = false;
        } else if (lastElement !== currentElement || // Element change
        lastElement && !currentElement && currentPoint || // Change from element to point
        lastPoint && currentPoint && currentElement || // Change from point to element
        currentPoint && !Object(__WEBPACK_IMPORTED_MODULE_8__util__["b" /* isSamePoint */])(lastPoint, currentPoint)) {
          reAlign = true;
        }

        // If source element size changed
        var preRect = this.sourceRect || {};
        if (!reAlign && source && (preRect.width !== sourceRect.width || preRect.height !== sourceRect.height)) {
          reAlign = true;
        }
      }

      this.sourceRect = sourceRect;
    }

    if (reAlign) {
      this.forceAlign();
    }

    if (props.monitorWindowResize && !props.disabled) {
      this.startMonitorWindowResize();
    } else {
      this.stopMonitorWindowResize();
    }
  };

  Align.prototype.componentWillUnmount = function componentWillUnmount() {
    this.stopMonitorWindowResize();
  };

  Align.prototype.startMonitorWindowResize = function startMonitorWindowResize() {
    if (!this.resizeHandler) {
      this.bufferMonitor = Object(__WEBPACK_IMPORTED_MODULE_8__util__["a" /* buffer */])(this.forceAlign, this.props.monitorBufferTime);
      this.resizeHandler = Object(__WEBPACK_IMPORTED_MODULE_7_rc_util_es_Dom_addEventListener__["a" /* default */])(window, 'resize', this.bufferMonitor);
    }
  };

  Align.prototype.stopMonitorWindowResize = function stopMonitorWindowResize() {
    if (this.resizeHandler) {
      this.bufferMonitor.clear();
      this.resizeHandler.remove();
      this.resizeHandler = null;
    }
  };

  Align.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        childrenProps = _props.childrenProps,
        children = _props.children;

    var child = __WEBPACK_IMPORTED_MODULE_3_react___default.a.Children.only(children);
    if (childrenProps) {
      var newProps = {};
      var propList = Object.keys(childrenProps);
      propList.forEach(function (prop) {
        newProps[prop] = _this2.props[childrenProps[prop]];
      });

      return __WEBPACK_IMPORTED_MODULE_3_react___default.a.cloneElement(child, newProps);
    }
    return child;
  };

  return Align;
}(__WEBPACK_IMPORTED_MODULE_3_react__["Component"]);

Align.propTypes = {
  childrenProps: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.object,
  align: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.object.isRequired,
  target: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.func, __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.shape({
    clientX: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.number,
    clientY: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.number,
    pageX: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.number,
    pageY: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.number
  })]),
  onAlign: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.func,
  monitorBufferTime: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.number,
  monitorWindowResize: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.bool,
  disabled: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.bool,
  children: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.any
};
Align.defaultProps = {
  target: function target() {
    return window;
  },
  monitorBufferTime: 50,
  monitorWindowResize: false,
  disabled: false
};


/* harmony default export */ __webpack_exports__["a"] = (Align);

/***/ }),
/* 152 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__align_alignElement__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__align_alignPoint__ = __webpack_require__(159);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__align_alignElement__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__align_alignPoint__["a"]; });





/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__align_alignElement__["a" /* default */]);

/***/ }),
/* 153 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__align__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getOffsetParent__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getVisibleRectForElement__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__getRegion__ = __webpack_require__(75);





function isOutOfVisibleRect(target) {
  var visibleRect = Object(__WEBPACK_IMPORTED_MODULE_2__getVisibleRectForElement__["a" /* default */])(target);
  var targetRegion = Object(__WEBPACK_IMPORTED_MODULE_3__getRegion__["a" /* default */])(target);

  return !visibleRect || targetRegion.left + targetRegion.width <= visibleRect.left || targetRegion.top + targetRegion.height <= visibleRect.top || targetRegion.left >= visibleRect.right || targetRegion.top >= visibleRect.bottom;
}

function alignElement(el, refNode, align) {
  var target = align.target || refNode;
  var refNodeRegion = Object(__WEBPACK_IMPORTED_MODULE_3__getRegion__["a" /* default */])(target);

  var isTargetNotOutOfVisible = !isOutOfVisibleRect(target);

  return Object(__WEBPACK_IMPORTED_MODULE_0__align__["a" /* default */])(el, refNodeRegion, align, isTargetNotOutOfVisible);
}

alignElement.__getOffsetParent = __WEBPACK_IMPORTED_MODULE_1__getOffsetParent__["a" /* default */];

alignElement.__getVisibleRectForElement = __WEBPACK_IMPORTED_MODULE_2__getVisibleRectForElement__["a" /* default */];

/* harmony default export */ __webpack_exports__["a"] = (alignElement);

/***/ }),
/* 154 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getTransformName;
/* harmony export (immutable) */ __webpack_exports__["e"] = setTransitionProperty;
/* harmony export (immutable) */ __webpack_exports__["c"] = getTransitionProperty;
/* harmony export (immutable) */ __webpack_exports__["b"] = getTransformXY;
/* harmony export (immutable) */ __webpack_exports__["d"] = setTransformXY;
var vendorPrefix = void 0;

var jsCssMap = {
  Webkit: '-webkit-',
  Moz: '-moz-',
  // IE did it wrong again ...
  ms: '-ms-',
  O: '-o-'
};

function getVendorPrefix() {
  if (vendorPrefix !== undefined) {
    return vendorPrefix;
  }
  vendorPrefix = '';
  var style = document.createElement('p').style;
  var testProp = 'Transform';
  for (var key in jsCssMap) {
    if (key + testProp in style) {
      vendorPrefix = key;
    }
  }
  return vendorPrefix;
}

function getTransitionName() {
  return getVendorPrefix() ? getVendorPrefix() + 'TransitionProperty' : 'transitionProperty';
}

function getTransformName() {
  return getVendorPrefix() ? getVendorPrefix() + 'Transform' : 'transform';
}

function setTransitionProperty(node, value) {
  var name = getTransitionName();
  if (name) {
    node.style[name] = value;
    if (name !== 'transitionProperty') {
      node.style.transitionProperty = value;
    }
  }
}

function setTransform(node, value) {
  var name = getTransformName();
  if (name) {
    node.style[name] = value;
    if (name !== 'transform') {
      node.style.transform = value;
    }
  }
}

function getTransitionProperty(node) {
  return node.style.transitionProperty || node.style[getTransitionName()];
}

function getTransformXY(node) {
  var style = window.getComputedStyle(node, null);
  var transform = style.getPropertyValue('transform') || style.getPropertyValue(getTransformName());
  if (transform && transform !== 'none') {
    var matrix = transform.replace(/[^0-9\-.,]/g, '').split(',');
    return { x: parseFloat(matrix[12] || matrix[4], 0), y: parseFloat(matrix[13] || matrix[5], 0) };
  }
  return {
    x: 0,
    y: 0
  };
}

var matrix2d = /matrix\((.*)\)/;
var matrix3d = /matrix3d\((.*)\)/;

function setTransformXY(node, xy) {
  var style = window.getComputedStyle(node, null);
  var transform = style.getPropertyValue('transform') || style.getPropertyValue(getTransformName());
  if (transform && transform !== 'none') {
    var arr = void 0;
    var match2d = transform.match(matrix2d);
    if (match2d) {
      match2d = match2d[1];
      arr = match2d.split(',').map(function (item) {
        return parseFloat(item, 10);
      });
      arr[4] = xy.x;
      arr[5] = xy.y;
      setTransform(node, 'matrix(' + arr.join(',') + ')');
    } else {
      var match3d = transform.match(matrix3d)[1];
      arr = match3d.split(',').map(function (item) {
        return parseFloat(item, 10);
      });
      arr[12] = xy.x;
      arr[13] = xy.y;
      setTransform(node, 'matrix3d(' + arr.join(',') + ')');
    }
  } else {
    setTransform(node, 'translateX(' + xy.x + 'px) translateY(' + xy.y + 'px) translateZ(0)');
  }
}

/***/ }),
/* 155 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isAncestorFixed;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(18);


function isAncestorFixed(element) {
  if (__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].isWindow(element) || element.nodeType === 9) {
    return false;
  }

  var doc = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getDocument(element);
  var body = doc.body;
  var parent = null;
  for (parent = element.parentNode; parent && parent !== body; parent = parent.parentNode) {
    var positionStyle = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].css(parent, 'position');
    if (positionStyle === 'fixed') {
      return true;
    }
  }
  return false;
}

/***/ }),
/* 156 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(18);


function adjustForViewport(elFuturePos, elRegion, visibleRect, overflow) {
  var pos = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].clone(elFuturePos);
  var size = {
    width: elRegion.width,
    height: elRegion.height
  };

  if (overflow.adjustX && pos.left < visibleRect.left) {
    pos.left = visibleRect.left;
  }

  // Left edge inside and right edge outside viewport, try to resize it.
  if (overflow.resizeWidth && pos.left >= visibleRect.left && pos.left + size.width > visibleRect.right) {
    size.width -= pos.left + size.width - visibleRect.right;
  }

  // Right edge outside viewport, try to move it.
  if (overflow.adjustX && pos.left + size.width > visibleRect.right) {
    // 保证左边界和可视区域左边界对齐
    pos.left = Math.max(visibleRect.right - size.width, visibleRect.left);
  }

  // Top edge outside viewport, try to move it.
  if (overflow.adjustY && pos.top < visibleRect.top) {
    pos.top = visibleRect.top;
  }

  // Top edge inside and bottom edge outside viewport, try to resize it.
  if (overflow.resizeHeight && pos.top >= visibleRect.top && pos.top + size.height > visibleRect.bottom) {
    size.height -= pos.top + size.height - visibleRect.bottom;
  }

  // Bottom edge outside viewport, try to move it.
  if (overflow.adjustY && pos.top + size.height > visibleRect.bottom) {
    // 保证上边界和可视区域上边界对齐
    pos.top = Math.max(visibleRect.bottom - size.height, visibleRect.top);
  }

  return __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].mix(pos, size);
}

/* harmony default export */ __webpack_exports__["a"] = (adjustForViewport);

/***/ }),
/* 157 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getAlignOffset__ = __webpack_require__(158);


function getElFuturePos(elRegion, refNodeRegion, points, offset, targetOffset) {
  var p1 = Object(__WEBPACK_IMPORTED_MODULE_0__getAlignOffset__["a" /* default */])(refNodeRegion, points[1]);
  var p2 = Object(__WEBPACK_IMPORTED_MODULE_0__getAlignOffset__["a" /* default */])(elRegion, points[0]);
  var diff = [p2.left - p1.left, p2.top - p1.top];

  return {
    left: elRegion.left - diff[0] + offset[0] - targetOffset[0],
    top: elRegion.top - diff[1] + offset[1] - targetOffset[1]
  };
}

/* harmony default export */ __webpack_exports__["a"] = (getElFuturePos);

/***/ }),
/* 158 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * 获取 node 上的 align 对齐点 相对于页面的坐标
 */

function getAlignOffset(region, align) {
  var V = align.charAt(0);
  var H = align.charAt(1);
  var w = region.width;
  var h = region.height;

  var x = region.left;
  var y = region.top;

  if (V === 'c') {
    y += h / 2;
  } else if (V === 'b') {
    y += h;
  }

  if (H === 'c') {
    x += w / 2;
  } else if (H === 'r') {
    x += w;
  }

  return {
    left: x,
    top: y
  };
}

/* harmony default export */ __webpack_exports__["a"] = (getAlignOffset);

/***/ }),
/* 159 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__align__ = __webpack_require__(72);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };




/**
 * `tgtPoint`: { pageX, pageY } or { clientX, clientY }.
 * If client position provided, will internal convert to page position.
 */

function alignPoint(el, tgtPoint, align) {
  var pageX = void 0;
  var pageY = void 0;

  var doc = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getDocument(el);
  var win = doc.defaultView || doc.parentWindow;

  var scrollX = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getWindowScrollLeft(win);
  var scrollY = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].getWindowScrollTop(win);
  var viewportWidth = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].viewportWidth(win);
  var viewportHeight = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].viewportHeight(win);

  if ('pageX' in tgtPoint) {
    pageX = tgtPoint.pageX;
  } else {
    pageX = scrollX + tgtPoint.clientX;
  }

  if ('pageY' in tgtPoint) {
    pageY = tgtPoint.pageY;
  } else {
    pageY = scrollY + tgtPoint.clientY;
  }

  var tgtRegion = {
    left: pageX,
    top: pageY,
    width: 0,
    height: 0
  };

  var pointInView = pageX >= 0 && pageX <= scrollX + viewportWidth && pageY >= 0 && pageY <= scrollY + viewportHeight;

  // Provide default target point
  var points = [align.points[0], 'cc'];

  return Object(__WEBPACK_IMPORTED_MODULE_1__align__["a" /* default */])(el, tgtRegion, _extends({}, align, { points: points }), pointInView);
}

/* harmony default export */ __webpack_exports__["a"] = (alignPoint);

/***/ }),
/* 160 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = buffer;
/* harmony export (immutable) */ __webpack_exports__["b"] = isSamePoint;
/* harmony export (immutable) */ __webpack_exports__["c"] = isWindow;
function buffer(fn, ms) {
  var timer = void 0;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function bufferFn() {
    clear();
    timer = setTimeout(fn, ms);
  }

  bufferFn.clear = clear;

  return bufferFn;
}

function isSamePoint(prev, next) {
  if (prev === next) return true;
  if (!prev || !next) return false;

  if ('pageX' in next && 'pageY' in next) {
    return prev.pageX === next.pageX && prev.pageY === next.pageY;
  }

  if ('clientX' in next && 'clientY' in next) {
    return prev.clientX === next.clientX && prev.clientY === next.clientY;
  }

  return false;
}

function isWindow(obj) {
  return obj && typeof obj === 'object' && obj.window === obj;
}

/***/ }),
/* 161 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export genAnimate */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_lifecycles_compat__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_util_es_Children_toArray__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_fbjs_lib_warning__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_fbjs_lib_warning___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_fbjs_lib_warning__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__AnimateChild__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__util__ = __webpack_require__(50);














var defaultKey = 'rc_animate_' + Date.now();
var clonePropList = ['children'];

/**
 * Default use `AnimateChild` as component.
 * Here can also pass customize `ChildComponent` for test usage.
 */
function genAnimate(ChildComponent) {
  var Animate = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Animate, _React$Component);

    function Animate() {
      var _ref;

      var _temp, _this, _ret;

      __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Animate);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Animate.__proto__ || Object.getPrototypeOf(Animate)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        appeared: true,
        mergedChildren: []
      }, _this.onChildLeaved = function (key) {
        // Remove child which not exist anymore
        if (!_this.hasChild(key)) {
          var mergedChildren = _this.state.mergedChildren;

          _this.setState({
            mergedChildren: mergedChildren.filter(function (node) {
              return node.key !== key;
            })
          });
        }
      }, _this.hasChild = function (key) {
        var children = _this.props.children;


        return Object(__WEBPACK_IMPORTED_MODULE_8_rc_util_es_Children_toArray__["a" /* default */])(children).some(function (node) {
          return node && node.key === key;
        });
      }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
    }
    // [Legacy] Not sure usage
    // commit: https://github.com/react-component/animate/commit/0a1cbfd647407498b10a8c6602a2dea80b42e324
    // eslint-disable-line

    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Animate, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        // No need to re-render
        this.state.appeared = false;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _state = this.state,
            appeared = _state.appeared,
            mergedChildren = _state.mergedChildren;
        var _props = this.props,
            Component = _props.component,
            componentProps = _props.componentProps,
            className = _props.className,
            style = _props.style,
            showProp = _props.showProp;


        var $children = mergedChildren.map(function (node) {
          if (mergedChildren.length > 1 && !node.key) {
            __WEBPACK_IMPORTED_MODULE_9_fbjs_lib_warning___default()(false, 'must set key for <rc-animate> children');
            return null;
          }

          var show = true;

          if (!_this2.hasChild(node.key)) {
            show = false;
          } else if (showProp) {
            show = node.props[showProp];
          }

          var key = node.key || defaultKey;

          return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            ChildComponent,
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, _this2.props, {
              appeared: appeared,
              show: show,
              className: node.props.className,
              style: node.props.style,
              key: key,

              animateKey: node.key // Keep trans origin key
              , onChildLeaved: _this2.onChildLeaved
            }),
            node
          );
        });

        // Wrap with component
        if (Component) {
          var passedProps = this.props;
          if (typeof Component === 'string') {
            passedProps = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
              className: className,
              style: style
            }, componentProps);
          }

          return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            Component,
            passedProps,
            $children
          );
        }

        return $children[0] || null;
      }
    }], [{
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(nextProps, prevState) {
        var _prevState$prevProps = prevState.prevProps,
            prevProps = _prevState$prevProps === undefined ? {} : _prevState$prevProps;

        var newState = {
          prevProps: Object(__WEBPACK_IMPORTED_MODULE_11__util__["b" /* cloneProps */])(nextProps, clonePropList)
        };
        var showProp = nextProps.showProp;


        function processState(propName, updater) {
          if (prevProps[propName] !== nextProps[propName]) {
            updater(nextProps[propName]);
            return true;
          }
          return false;
        }

        processState('children', function (children) {
          var currentChildren = Object(__WEBPACK_IMPORTED_MODULE_8_rc_util_es_Children_toArray__["a" /* default */])(children).filter(function (node) {
            return node;
          });
          var prevChildren = prevState.mergedChildren.filter(function (node) {
            // Remove prev child if not show anymore
            if (currentChildren.every(function (_ref2) {
              var key = _ref2.key;
              return key !== node.key;
            }) && showProp && !node.props[showProp]) {
              return false;
            }
            return true;
          });

          // Merge prev children to keep the animation
          newState.mergedChildren = Object(__WEBPACK_IMPORTED_MODULE_11__util__["e" /* mergeChildren */])(prevChildren, currentChildren);
        });

        return newState;
      }
    }]);

    return Animate;
  }(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

  Animate.isAnimate = true;
  Animate.propTypes = {
    component: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.any,
    componentProps: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object,
    animation: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object,
    transitionName: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object]),
    transitionEnter: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
    transitionAppear: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
    exclusive: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
    transitionLeave: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
    onEnd: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,
    onEnter: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,
    onLeave: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,
    onAppear: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,
    showProp: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
    children: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node,
    style: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object,
    className: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string
  };
  Animate.defaultProps = {
    animation: {},
    component: 'span',
    componentProps: {},
    transitionEnter: true,
    transitionLeave: true,
    transitionAppear: false
  };


  Object(__WEBPACK_IMPORTED_MODULE_7_react_lifecycles_compat__["a" /* polyfill */])(Animate);

  return Animate;
}

/* harmony default export */ __webpack_exports__["a"] = (genAnimate(__WEBPACK_IMPORTED_MODULE_10__AnimateChild__["a" /* default */]));

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(163);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(57);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  return Array.isArray(arr) ? arr : (0, _from2.default)(arr);
};

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

try {
  var index = __webpack_require__(77);
} catch (err) {
  var index = __webpack_require__(77);
}

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;

/***/ }),
/* 167 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export genCSSMotion */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react_lifecycles_compat__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_classnames__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_raf__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_raf___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_raf__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__util__ = __webpack_require__(50);














var STATUS_NONE = 'none';
var STATUS_APPEAR = 'appear';
var STATUS_ENTER = 'enter';
var STATUS_LEAVE = 'leave';

/**
 * `transitionSupport` is used for none transition test case.
 * Default we use browser transition event support check.
 */
function genCSSMotion(transitionSupport) {
  var CSSMotion = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(CSSMotion, _React$Component);

    function CSSMotion() {
      __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, CSSMotion);

      var _this = __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(this, (CSSMotion.__proto__ || Object.getPrototypeOf(CSSMotion)).call(this));

      _this.onDomUpdate = function () {
        var _this$state = _this.state,
            status = _this$state.status,
            newStatus = _this$state.newStatus;
        var _this$props = _this.props,
            onAppearStart = _this$props.onAppearStart,
            onEnterStart = _this$props.onEnterStart,
            onLeaveStart = _this$props.onLeaveStart,
            onAppearActive = _this$props.onAppearActive,
            onEnterActive = _this$props.onEnterActive,
            onLeaveActive = _this$props.onLeaveActive,
            motionAppear = _this$props.motionAppear,
            motionEnter = _this$props.motionEnter,
            motionLeave = _this$props.motionLeave;


        if (!transitionSupport) {
          return;
        }

        // Event injection
        var $ele = __WEBPACK_IMPORTED_MODULE_7_react_dom___default.a.findDOMNode(_this);
        if (_this.$ele !== $ele) {
          _this.removeEventListener(_this.$ele);
          _this.addEventListener($ele);
          _this.$ele = $ele;
        }

        // Init status
        if (newStatus && status === STATUS_APPEAR && motionAppear) {
          _this.updateStatus(onAppearStart, null, null, function () {
            _this.updateActiveStatus(onAppearActive, STATUS_APPEAR);
          });
        } else if (newStatus && status === STATUS_ENTER && motionEnter) {
          _this.updateStatus(onEnterStart, null, null, function () {
            _this.updateActiveStatus(onEnterActive, STATUS_ENTER);
          });
        } else if (newStatus && status === STATUS_LEAVE && motionLeave) {
          _this.updateStatus(onLeaveStart, null, null, function () {
            _this.updateActiveStatus(onLeaveActive, STATUS_LEAVE);
          });
        }
      };

      _this.onMotionEnd = function (event) {
        var _this$state2 = _this.state,
            status = _this$state2.status,
            statusActive = _this$state2.statusActive;
        var _this$props2 = _this.props,
            onAppearEnd = _this$props2.onAppearEnd,
            onEnterEnd = _this$props2.onEnterEnd,
            onLeaveEnd = _this$props2.onLeaveEnd;

        if (status === STATUS_APPEAR && statusActive) {
          _this.updateStatus(onAppearEnd, { status: STATUS_NONE }, event);
        } else if (status === STATUS_ENTER && statusActive) {
          _this.updateStatus(onEnterEnd, { status: STATUS_NONE }, event);
        } else if (status === STATUS_LEAVE && statusActive) {
          _this.updateStatus(onLeaveEnd, { status: STATUS_NONE }, event);
        }
      };

      _this.addEventListener = function ($ele) {
        if (!$ele) return;

        $ele.addEventListener(__WEBPACK_IMPORTED_MODULE_12__util__["g" /* transitionEndName */], _this.onMotionEnd);
        $ele.addEventListener(__WEBPACK_IMPORTED_MODULE_12__util__["a" /* animationEndName */], _this.onMotionEnd);
      };

      _this.removeEventListener = function ($ele) {
        if (!$ele) return;

        $ele.removeEventListener(__WEBPACK_IMPORTED_MODULE_12__util__["g" /* transitionEndName */], _this.onMotionEnd);
        $ele.removeEventListener(__WEBPACK_IMPORTED_MODULE_12__util__["a" /* animationEndName */], _this.onMotionEnd);
      };

      _this.updateStatus = function (styleFunc, additionalState, event, callback) {
        var statusStyle = styleFunc ? styleFunc(__WEBPACK_IMPORTED_MODULE_7_react_dom___default.a.findDOMNode(_this), event) : null;

        if (statusStyle === false || _this._destroyed) return;

        var nextStep = void 0;
        if (callback) {
          nextStep = function nextStep() {
            _this.nextFrame(callback);
          };
        }

        _this.setState(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({
          statusStyle: typeof statusStyle === 'object' ? statusStyle : null,
          newStatus: false
        }, additionalState), nextStep); // Trigger before next frame & after `componentDidMount`
      };

      _this.updateActiveStatus = function (styleFunc, currentStatus) {
        // `setState` use `postMessage` to trigger at the end of frame.
        // Let's use requestAnimationFrame to update new state in next frame.
        _this.nextFrame(function () {
          var status = _this.state.status;

          if (status !== currentStatus) return;

          _this.updateStatus(styleFunc, { statusActive: true });
        });
      };

      _this.nextFrame = function (func) {
        _this.cancelNextFrame();
        _this.raf = __WEBPACK_IMPORTED_MODULE_11_raf___default()(func);
      };

      _this.cancelNextFrame = function () {
        if (_this.raf) {
          __WEBPACK_IMPORTED_MODULE_11_raf___default.a.cancel(_this.raf);
          _this.raf = null;
        }
      };

      _this.state = {
        status: STATUS_NONE,
        statusActive: false,
        newStatus: false,
        statusStyle: null
      };
      _this.$ele = null;
      _this.raf = null;
      return _this;
    }

    __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default()(CSSMotion, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.onDomUpdate();
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        this.onDomUpdate();
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._destroyed = true;
        this.removeEventListener(this.$ele);
        this.cancelNextFrame();
      }
    }, {
      key: 'render',
      value: function render() {
        var _classNames;

        var _state = this.state,
            status = _state.status,
            statusActive = _state.statusActive,
            statusStyle = _state.statusStyle;
        var _props = this.props,
            children = _props.children,
            motionName = _props.motionName,
            visible = _props.visible;


        if (!children) return null;

        if (status === STATUS_NONE || !transitionSupport) {
          return visible ? children({}) : null;
        }

        return children({
          className: __WEBPACK_IMPORTED_MODULE_10_classnames___default()((_classNames = {}, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* getTransitionName */])(motionName, status), status !== STATUS_NONE), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, Object(__WEBPACK_IMPORTED_MODULE_12__util__["d" /* getTransitionName */])(motionName, status + '-active'), status !== STATUS_NONE && statusActive), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_classNames, motionName, typeof motionName === 'string'), _classNames)),
          style: statusStyle
        });
      }
    }], [{
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(props, _ref) {
        var prevProps = _ref.prevProps;

        if (!transitionSupport) return {};

        var visible = props.visible,
            motionAppear = props.motionAppear,
            motionEnter = props.motionEnter,
            motionLeave = props.motionLeave,
            motionLeaveImmediately = props.motionLeaveImmediately;

        var newState = {
          prevProps: props
        };

        // Appear
        if (!prevProps && visible && motionAppear) {
          newState.status = STATUS_APPEAR;
          newState.statusActive = false;
          newState.newStatus = true;
        }

        // Enter
        if (prevProps && !prevProps.visible && visible && motionEnter) {
          newState.status = STATUS_ENTER;
          newState.statusActive = false;
          newState.newStatus = true;
        }

        // Leave
        if (prevProps && prevProps.visible && !visible && motionLeave || !prevProps && motionLeaveImmediately && !visible && motionLeave) {
          newState.status = STATUS_LEAVE;
          newState.statusActive = false;
          newState.newStatus = true;
        }

        return newState;
      }
    }]);

    return CSSMotion;
  }(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component);

  CSSMotion.propTypes = {
    visible: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
    children: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
    motionName: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.object]),
    motionAppear: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
    motionEnter: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
    motionLeave: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool,
    motionLeaveImmediately: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.bool, // Trigger leave motion immediately
    onAppearStart: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
    onAppearActive: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
    onAppearEnd: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
    onEnterStart: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
    onEnterActive: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
    onEnterEnd: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
    onLeaveStart: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
    onLeaveActive: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func,
    onLeaveEnd: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.func
  };
  CSSMotion.defaultProps = {
    visible: true,
    motionEnter: true,
    motionAppear: true,
    motionLeave: true
  };


  Object(__WEBPACK_IMPORTED_MODULE_9_react_lifecycles_compat__["a" /* polyfill */])(CSSMotion);

  return CSSMotion;
}

/* unused harmony default export */ var _unused_webpack_default_export = (genCSSMotion(__WEBPACK_IMPORTED_MODULE_12__util__["f" /* supportTransition */]));

/***/ }),
/* 168 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__LazyRenderBox__ = __webpack_require__(78);







var PopupInner = function (_Component) {
  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default()(PopupInner, _Component);

  function PopupInner() {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, PopupInner);

    return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(this, _Component.apply(this, arguments));
  }

  PopupInner.prototype.render = function render() {
    var props = this.props;
    var className = props.className;
    if (!props.visible) {
      className += ' ' + props.hiddenClassName;
    }
    return __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
      'div',
      {
        className: className,
        onMouseEnter: props.onMouseEnter,
        onMouseLeave: props.onMouseLeave,
        style: props.style
      },
      __WEBPACK_IMPORTED_MODULE_3_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_5__LazyRenderBox__["a" /* default */],
        { className: props.prefixCls + '-content', visible: props.visible },
        props.children
      )
    );
  };

  return PopupInner;
}(__WEBPACK_IMPORTED_MODULE_3_react__["Component"]);

PopupInner.propTypes = {
  hiddenClassName: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.string,
  className: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.string,
  prefixCls: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.string,
  onMouseEnter: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.func,
  onMouseLeave: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.func,
  children: __WEBPACK_IMPORTED_MODULE_4_prop_types___default.a.any
};


/* harmony default export */ __webpack_exports__["a"] = (PopupInner);

/***/ }),
/* 169 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);








var ContainerRender = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(ContainerRender, _React$Component);

  function ContainerRender() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, ContainerRender);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = ContainerRender.__proto__ || Object.getPrototypeOf(ContainerRender)).call.apply(_ref, [this].concat(args))), _this), _this.removeContainer = function () {
      if (_this.container) {
        __WEBPACK_IMPORTED_MODULE_5_react_dom___default.a.unmountComponentAtNode(_this.container);
        _this.container.parentNode.removeChild(_this.container);
        _this.container = null;
      }
    }, _this.renderComponent = function (props, ready) {
      var _this$props = _this.props,
          visible = _this$props.visible,
          getComponent = _this$props.getComponent,
          forceRender = _this$props.forceRender,
          getContainer = _this$props.getContainer,
          parent = _this$props.parent;

      if (visible || parent._component || forceRender) {
        if (!_this.container) {
          _this.container = getContainer();
        }
        __WEBPACK_IMPORTED_MODULE_5_react_dom___default.a.unstable_renderSubtreeIntoContainer(parent, getComponent(props), _this.container, function callback() {
          if (ready) {
            ready.call(this);
          }
        });
      }
    }, _temp), __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(ContainerRender, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.autoMount) {
        this.renderComponent();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.props.autoMount) {
        this.renderComponent();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.autoDestroy) {
        this.removeContainer();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children({
        renderComponent: this.renderComponent,
        removeContainer: this.removeContainer
      });
    }
  }]);

  return ContainerRender;
}(__WEBPACK_IMPORTED_MODULE_4_react___default.a.Component);

ContainerRender.propTypes = {
  autoMount: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  autoDestroy: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  visible: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  forceRender: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  parent: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.any,
  getComponent: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,
  getContainer: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,
  children: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired
};
ContainerRender.defaultProps = {
  autoMount: true,
  autoDestroy: true,
  forceRender: false
};
/* harmony default export */ __webpack_exports__["a"] = (ContainerRender);

/***/ }),
/* 170 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);








var Portal = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Portal, _React$Component);

  function Portal() {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Portal);

    return __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Portal.__proto__ || Object.getPrototypeOf(Portal)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Portal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createContainer();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var didUpdate = this.props.didUpdate;

      if (didUpdate) {
        didUpdate(prevProps);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.removeContainer();
    }
  }, {
    key: 'createContainer',
    value: function createContainer() {
      this._container = this.props.getContainer();
      this.forceUpdate();
    }
  }, {
    key: 'removeContainer',
    value: function removeContainer() {
      if (this._container) {
        this._container.parentNode.removeChild(this._container);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this._container) {
        return __WEBPACK_IMPORTED_MODULE_5_react_dom___default.a.createPortal(this.props.children, this._container);
      }
      return null;
    }
  }]);

  return Portal;
}(__WEBPACK_IMPORTED_MODULE_4_react___default.a.Component);

Portal.propTypes = {
  getContainer: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,
  children: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node.isRequired,
  didUpdate: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func
};
/* harmony default export */ __webpack_exports__["a"] = (Portal);

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var __DEV__ = process.env.NODE_ENV !== 'production';

var warning = function() {};

if (__DEV__) {
  var printWarning = function printWarning(format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    var argIndex = 0;
    var message = 'Warning: ' +
      format.replace(/%s/g, function() {
        return args[argIndex++];
      });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  }

  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
          '`warning(condition, format, ...args)` requires a warning ' +
          'message argument'
      );
    }
    if (!condition) {
      printWarning.apply(null, [format].concat(args));
    }
  };
}

module.exports = warning;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 172 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_classnames__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_warning__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_warning___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_warning__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rc_util_es_Children_toArray__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_react_lifecycles_compat__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__contextTypes__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__util__ = __webpack_require__(52);
















var Tree = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(Tree, _React$Component);

  function Tree() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, Tree);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Tree.__proto__ || Object.getPrototypeOf(Tree)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      // TODO: Remove this eslint
      posEntities: {}, // eslint-disable-line react/no-unused-state
      keyEntities: {},

      selectedKeys: [],
      checkedKeys: [],
      halfCheckedKeys: [],
      loadedKeys: [],
      loadingKeys: [],

      treeNode: []
    }, _this.onNodeDragStart = function (event, node) {
      var expandedKeys = _this.state.expandedKeys;
      var onDragStart = _this.props.onDragStart;
      var _node$props = node.props,
          eventKey = _node$props.eventKey,
          children = _node$props.children;


      _this.dragNode = node;

      _this.setState({
        dragNodesKeys: Object(__WEBPACK_IMPORTED_MODULE_13__util__["j" /* getDragNodesKeys */])(children, node),
        expandedKeys: Object(__WEBPACK_IMPORTED_MODULE_13__util__["b" /* arrDel */])(expandedKeys, eventKey)
      });

      if (onDragStart) {
        onDragStart({ event: event, node: node });
      }
    }, _this.onNodeDragEnter = function (event, node) {
      var expandedKeys = _this.state.expandedKeys;
      var onDragEnter = _this.props.onDragEnter;
      var _node$props2 = node.props,
          pos = _node$props2.pos,
          eventKey = _node$props2.eventKey;


      if (!_this.dragNode) return;

      var dropPosition = Object(__WEBPACK_IMPORTED_MODULE_13__util__["c" /* calcDropPosition */])(event, node);

      // Skip if drag node is self
      if (_this.dragNode.props.eventKey === eventKey && dropPosition === 0) {
        _this.setState({
          dragOverNodeKey: '',
          dropPosition: null
        });
        return;
      }

      // Ref: https://github.com/react-component/tree/issues/132
      // Add timeout to let onDragLevel fire before onDragEnter,
      // so that we can clean drag props for onDragLeave node.
      // Macro task for this:
      // https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script
      setTimeout(function () {
        // Update drag over node
        _this.setState({
          dragOverNodeKey: eventKey,
          dropPosition: dropPosition
        });

        // Side effect for delay drag
        if (!_this.delayedDragEnterLogic) {
          _this.delayedDragEnterLogic = {};
        }
        Object.keys(_this.delayedDragEnterLogic).forEach(function (key) {
          clearTimeout(_this.delayedDragEnterLogic[key]);
        });
        _this.delayedDragEnterLogic[pos] = setTimeout(function () {
          var newExpandedKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["a" /* arrAdd */])(expandedKeys, eventKey);
          if (!('expandedKeys' in _this.props)) {
            _this.setState({
              expandedKeys: newExpandedKeys
            });
          }

          if (onDragEnter) {
            onDragEnter({ event: event, node: node, expandedKeys: newExpandedKeys });
          }
        }, 400);
      }, 0);
    }, _this.onNodeDragOver = function (event, node) {
      var onDragOver = _this.props.onDragOver;
      var eventKey = node.props.eventKey;

      // Update drag position

      if (_this.dragNode && eventKey === _this.state.dragOverNodeKey) {
        var dropPosition = Object(__WEBPACK_IMPORTED_MODULE_13__util__["c" /* calcDropPosition */])(event, node);

        if (dropPosition === _this.state.dropPosition) return;

        _this.setState({
          dropPosition: dropPosition
        });
      }

      if (onDragOver) {
        onDragOver({ event: event, node: node });
      }
    }, _this.onNodeDragLeave = function (event, node) {
      var onDragLeave = _this.props.onDragLeave;


      _this.setState({
        dragOverNodeKey: ''
      });

      if (onDragLeave) {
        onDragLeave({ event: event, node: node });
      }
    }, _this.onNodeDragEnd = function (event, node) {
      var onDragEnd = _this.props.onDragEnd;

      _this.setState({
        dragOverNodeKey: ''
      });
      if (onDragEnd) {
        onDragEnd({ event: event, node: node });
      }

      _this.dragNode = null;
    }, _this.onNodeDrop = function (event, node) {
      var _this$state = _this.state,
          _this$state$dragNodes = _this$state.dragNodesKeys,
          dragNodesKeys = _this$state$dragNodes === undefined ? [] : _this$state$dragNodes,
          dropPosition = _this$state.dropPosition;
      var onDrop = _this.props.onDrop;
      var _node$props3 = node.props,
          eventKey = _node$props3.eventKey,
          pos = _node$props3.pos;


      _this.setState({
        dragOverNodeKey: ''
      });

      if (dragNodesKeys.indexOf(eventKey) !== -1) {
        __WEBPACK_IMPORTED_MODULE_9_warning___default()(false, 'Can not drop to dragNode(include it\'s children node)');
        return;
      }

      var posArr = Object(__WEBPACK_IMPORTED_MODULE_13__util__["o" /* posToArr */])(pos);

      var dropResult = {
        event: event,
        node: node,
        dragNode: _this.dragNode,
        dragNodesKeys: dragNodesKeys.slice(),
        dropPosition: dropPosition + Number(posArr[posArr.length - 1])
      };

      if (dropPosition !== 0) {
        dropResult.dropToGap = true;
      }

      if (onDrop) {
        onDrop(dropResult);
      }

      _this.dragNode = null;
    }, _this.onNodeClick = function (e, treeNode) {
      var onClick = _this.props.onClick;

      if (onClick) {
        onClick(e, treeNode);
      }
    }, _this.onNodeDoubleClick = function (e, treeNode) {
      var onDoubleClick = _this.props.onDoubleClick;

      if (onDoubleClick) {
        onDoubleClick(e, treeNode);
      }
    }, _this.onNodeSelect = function (e, treeNode) {
      var selectedKeys = _this.state.selectedKeys;
      var keyEntities = _this.state.keyEntities;
      var _this$props = _this.props,
          onSelect = _this$props.onSelect,
          multiple = _this$props.multiple;
      var _treeNode$props = treeNode.props,
          selected = _treeNode$props.selected,
          eventKey = _treeNode$props.eventKey;

      var targetSelected = !selected;

      // Update selected keys
      if (!targetSelected) {
        selectedKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["b" /* arrDel */])(selectedKeys, eventKey);
      } else if (!multiple) {
        selectedKeys = [eventKey];
      } else {
        selectedKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["a" /* arrAdd */])(selectedKeys, eventKey);
      }

      // [Legacy] Not found related usage in doc or upper libs
      var selectedNodes = selectedKeys.map(function (key) {
        var entity = keyEntities[key];
        if (!entity) return null;

        return entity.node;
      }).filter(function (node) {
        return node;
      });

      _this.setUncontrolledState({ selectedKeys: selectedKeys });

      if (onSelect) {
        var eventObj = {
          event: 'select',
          selected: targetSelected,
          node: treeNode,
          selectedNodes: selectedNodes,
          nativeEvent: e.nativeEvent
        };
        onSelect(selectedKeys, eventObj);
      }
    }, _this.onNodeCheck = function (e, treeNode, checked) {
      var _this$state2 = _this.state,
          keyEntities = _this$state2.keyEntities,
          oriCheckedKeys = _this$state2.checkedKeys,
          oriHalfCheckedKeys = _this$state2.halfCheckedKeys;
      var _this$props2 = _this.props,
          checkStrictly = _this$props2.checkStrictly,
          onCheck = _this$props2.onCheck;
      var eventKey = treeNode.props.eventKey;

      // Prepare trigger arguments

      var checkedObj = void 0;
      var eventObj = {
        event: 'check',
        node: treeNode,
        checked: checked,
        nativeEvent: e.nativeEvent
      };

      if (checkStrictly) {
        var checkedKeys = checked ? Object(__WEBPACK_IMPORTED_MODULE_13__util__["a" /* arrAdd */])(oriCheckedKeys, eventKey) : Object(__WEBPACK_IMPORTED_MODULE_13__util__["b" /* arrDel */])(oriCheckedKeys, eventKey);
        var halfCheckedKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["b" /* arrDel */])(oriHalfCheckedKeys, eventKey);
        checkedObj = { checked: checkedKeys, halfChecked: halfCheckedKeys };

        eventObj.checkedNodes = checkedKeys.map(function (key) {
          return keyEntities[key];
        }).filter(function (entity) {
          return entity;
        }).map(function (entity) {
          return entity.node;
        });

        _this.setUncontrolledState({ checkedKeys: checkedKeys });
      } else {
        var _conductCheck = Object(__WEBPACK_IMPORTED_MODULE_13__util__["e" /* conductCheck */])([eventKey], checked, keyEntities, {
          checkedKeys: oriCheckedKeys, halfCheckedKeys: oriHalfCheckedKeys
        }),
            _checkedKeys = _conductCheck.checkedKeys,
            _halfCheckedKeys = _conductCheck.halfCheckedKeys;

        checkedObj = _checkedKeys;

        // [Legacy] This is used for `rc-tree-select`
        eventObj.checkedNodes = [];
        eventObj.checkedNodesPositions = [];
        eventObj.halfCheckedKeys = _halfCheckedKeys;

        _checkedKeys.forEach(function (key) {
          var entity = keyEntities[key];
          if (!entity) return;

          var node = entity.node,
              pos = entity.pos;


          eventObj.checkedNodes.push(node);
          eventObj.checkedNodesPositions.push({ node: node, pos: pos });
        });

        _this.setUncontrolledState({
          checkedKeys: _checkedKeys,
          halfCheckedKeys: _halfCheckedKeys
        });
      }

      if (onCheck) {
        onCheck(checkedObj, eventObj);
      }
    }, _this.onNodeLoad = function (treeNode) {
      return new Promise(function (resolve) {
        // We need to get the latest state of loading/loaded keys
        _this.setState(function (_ref2) {
          var _ref2$loadedKeys = _ref2.loadedKeys,
              loadedKeys = _ref2$loadedKeys === undefined ? [] : _ref2$loadedKeys,
              _ref2$loadingKeys = _ref2.loadingKeys,
              loadingKeys = _ref2$loadingKeys === undefined ? [] : _ref2$loadingKeys;
          var _this$props3 = _this.props,
              loadData = _this$props3.loadData,
              onLoad = _this$props3.onLoad;
          var eventKey = treeNode.props.eventKey;


          if (!loadData || loadedKeys.indexOf(eventKey) !== -1 || loadingKeys.indexOf(eventKey) !== -1) {
            // react 15 will warn if return null
            return {};
          }

          // Process load data
          var promise = loadData(treeNode);
          promise.then(function () {
            var newLoadedKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["a" /* arrAdd */])(_this.state.loadedKeys, eventKey);
            var newLoadingKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["b" /* arrDel */])(_this.state.loadingKeys, eventKey);

            // onLoad should trigger before internal setState to avoid `loadData` trigger twice.
            // https://github.com/ant-design/ant-design/issues/12464
            if (onLoad) {
              var eventObj = {
                event: 'load',
                node: treeNode
              };
              onLoad(newLoadedKeys, eventObj);
            }

            _this.setUncontrolledState({
              loadedKeys: newLoadedKeys
            });
            _this.setState({
              loadingKeys: newLoadingKeys
            });

            resolve();
          });

          return {
            loadingKeys: Object(__WEBPACK_IMPORTED_MODULE_13__util__["a" /* arrAdd */])(loadingKeys, eventKey)
          };
        });
      });
    }, _this.onNodeExpand = function (e, treeNode) {
      var expandedKeys = _this.state.expandedKeys;
      var _this$props4 = _this.props,
          onExpand = _this$props4.onExpand,
          loadData = _this$props4.loadData;
      var _treeNode$props2 = treeNode.props,
          eventKey = _treeNode$props2.eventKey,
          expanded = _treeNode$props2.expanded;

      // Update selected keys

      var index = expandedKeys.indexOf(eventKey);
      var targetExpanded = !expanded;

      __WEBPACK_IMPORTED_MODULE_9_warning___default()(expanded && index !== -1 || !expanded && index === -1, 'Expand state not sync with index check');

      if (targetExpanded) {
        expandedKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["a" /* arrAdd */])(expandedKeys, eventKey);
      } else {
        expandedKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["b" /* arrDel */])(expandedKeys, eventKey);
      }

      _this.setUncontrolledState({ expandedKeys: expandedKeys });

      if (onExpand) {
        onExpand(expandedKeys, {
          node: treeNode,
          expanded: targetExpanded,
          nativeEvent: e.nativeEvent
        });
      }

      // Async Load data
      if (targetExpanded && loadData) {
        var loadPromise = _this.onNodeLoad(treeNode);
        return loadPromise ? loadPromise.then(function () {
          // [Legacy] Refresh logic
          _this.setUncontrolledState({ expandedKeys: expandedKeys });
        }) : null;
      }

      return null;
    }, _this.onNodeMouseEnter = function (event, node) {
      var onMouseEnter = _this.props.onMouseEnter;

      if (onMouseEnter) {
        onMouseEnter({ event: event, node: node });
      }
    }, _this.onNodeMouseLeave = function (event, node) {
      var onMouseLeave = _this.props.onMouseLeave;

      if (onMouseLeave) {
        onMouseLeave({ event: event, node: node });
      }
    }, _this.onNodeContextMenu = function (event, node) {
      var onRightClick = _this.props.onRightClick;

      if (onRightClick) {
        event.preventDefault();
        onRightClick({ event: event, node: node });
      }
    }, _this.setUncontrolledState = function (state) {
      var needSync = false;
      var newState = {};

      Object.keys(state).forEach(function (name) {
        if (name in _this.props) return;

        needSync = true;
        newState[name] = state[name];
      });

      if (needSync) {
        _this.setState(newState);
      }
    }, _this.isKeyChecked = function (key) {
      var _this$state$checkedKe = _this.state.checkedKeys,
          checkedKeys = _this$state$checkedKe === undefined ? [] : _this$state$checkedKe;

      return checkedKeys.indexOf(key) !== -1;
    }, _this.renderTreeNode = function (child, index) {
      var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var _this$state3 = _this.state,
          keyEntities = _this$state3.keyEntities,
          _this$state3$expanded = _this$state3.expandedKeys,
          expandedKeys = _this$state3$expanded === undefined ? [] : _this$state3$expanded,
          _this$state3$selected = _this$state3.selectedKeys,
          selectedKeys = _this$state3$selected === undefined ? [] : _this$state3$selected,
          _this$state3$halfChec = _this$state3.halfCheckedKeys,
          halfCheckedKeys = _this$state3$halfChec === undefined ? [] : _this$state3$halfChec,
          _this$state3$loadedKe = _this$state3.loadedKeys,
          loadedKeys = _this$state3$loadedKe === undefined ? [] : _this$state3$loadedKe,
          _this$state3$loadingK = _this$state3.loadingKeys,
          loadingKeys = _this$state3$loadingK === undefined ? [] : _this$state3$loadingK,
          dragOverNodeKey = _this$state3.dragOverNodeKey,
          dropPosition = _this$state3.dropPosition;

      var pos = Object(__WEBPACK_IMPORTED_MODULE_13__util__["l" /* getPosition */])(level, index);
      var key = child.key || pos;

      if (!keyEntities[key]) {
        Object(__WEBPACK_IMPORTED_MODULE_13__util__["p" /* warnOnlyTreeNode */])();
        return null;
      }

      return __WEBPACK_IMPORTED_MODULE_6_react___default.a.cloneElement(child, {
        key: key,
        eventKey: key,
        expanded: expandedKeys.indexOf(key) !== -1,
        selected: selectedKeys.indexOf(key) !== -1,
        loaded: loadedKeys.indexOf(key) !== -1,
        loading: loadingKeys.indexOf(key) !== -1,
        checked: _this.isKeyChecked(key),
        halfChecked: halfCheckedKeys.indexOf(key) !== -1,
        pos: pos,

        // [Legacy] Drag props
        dragOver: dragOverNodeKey === key && dropPosition === 0,
        dragOverGapTop: dragOverNodeKey === key && dropPosition === -1,
        dragOverGapBottom: dragOverNodeKey === key && dropPosition === 1
      });
    }, _temp), __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default()(Tree, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _props = this.props,
          prefixCls = _props.prefixCls,
          selectable = _props.selectable,
          showIcon = _props.showIcon,
          icon = _props.icon,
          draggable = _props.draggable,
          checkable = _props.checkable,
          checkStrictly = _props.checkStrictly,
          disabled = _props.disabled,
          loadData = _props.loadData,
          filterTreeNode = _props.filterTreeNode,
          openTransitionName = _props.openTransitionName,
          openAnimation = _props.openAnimation,
          switcherIcon = _props.switcherIcon;


      return {
        rcTree: {
          // root: this,

          prefixCls: prefixCls,
          selectable: selectable,
          showIcon: showIcon,
          icon: icon,
          switcherIcon: switcherIcon,
          draggable: draggable,
          checkable: checkable,
          checkStrictly: checkStrictly,
          disabled: disabled,
          openTransitionName: openTransitionName,
          openAnimation: openAnimation,

          loadData: loadData,
          filterTreeNode: filterTreeNode,
          renderTreeNode: this.renderTreeNode,
          isKeyChecked: this.isKeyChecked,

          onNodeClick: this.onNodeClick,
          onNodeDoubleClick: this.onNodeDoubleClick,
          onNodeExpand: this.onNodeExpand,
          onNodeSelect: this.onNodeSelect,
          onNodeCheck: this.onNodeCheck,
          onNodeLoad: this.onNodeLoad,
          onNodeMouseEnter: this.onNodeMouseEnter,
          onNodeMouseLeave: this.onNodeMouseLeave,
          onNodeContextMenu: this.onNodeContextMenu,
          onNodeDragStart: this.onNodeDragStart,
          onNodeDragEnter: this.onNodeDragEnter,
          onNodeDragOver: this.onNodeDragOver,
          onNodeDragLeave: this.onNodeDragLeave,
          onNodeDragEnd: this.onNodeDragEnd,
          onNodeDrop: this.onNodeDrop
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var treeNode = this.state.treeNode;
      var _props2 = this.props,
          prefixCls = _props2.prefixCls,
          className = _props2.className,
          focusable = _props2.focusable,
          showLine = _props2.showLine,
          _props2$tabIndex = _props2.tabIndex,
          tabIndex = _props2$tabIndex === undefined ? 0 : _props2$tabIndex;

      var domProps = Object(__WEBPACK_IMPORTED_MODULE_13__util__["i" /* getDataAndAria */])(this.props);

      if (focusable) {
        domProps.tabIndex = tabIndex;
        domProps.onKeyDown = this.onKeyDown;
      }

      return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
        'ul',
        __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, domProps, {
          className: __WEBPACK_IMPORTED_MODULE_8_classnames___default()(prefixCls, className, __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default()({}, prefixCls + '-show-line', showLine)),
          role: 'tree',
          unselectable: 'on'
        }),
        Object(__WEBPACK_IMPORTED_MODULE_13__util__["m" /* mapChildren */])(treeNode, function (node, index) {
          return _this2.renderTreeNode(node, index);
        })
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(props, prevState) {
      var prevProps = prevState.prevProps;

      var newState = {
        prevProps: props
      };

      function needSync(name) {
        return !prevProps && name in props || prevProps && prevProps[name] !== props[name];
      }

      // ================== Tree Node ==================
      var treeNode = null;

      // Check if `treeData` or `children` changed and save into the state.
      if (needSync('treeData')) {
        treeNode = Object(__WEBPACK_IMPORTED_MODULE_13__util__["g" /* convertDataToTree */])(props.treeData);
      } else if (needSync('children')) {
        treeNode = Object(__WEBPACK_IMPORTED_MODULE_10_rc_util_es_Children_toArray__["a" /* default */])(props.children);
      }

      // Tree support filter function which will break the tree structure in the vdm.
      // We cache the treeNodes in state so that we can return the treeNode in event trigger.
      if (treeNode) {
        newState.treeNode = treeNode;

        // Calculate the entities data for quick match
        var entitiesMap = Object(__WEBPACK_IMPORTED_MODULE_13__util__["h" /* convertTreeToEntities */])(treeNode);
        newState.posEntities = entitiesMap.posEntities;
        newState.keyEntities = entitiesMap.keyEntities;
      }

      var keyEntities = newState.keyEntities || prevState.keyEntities;

      // ================ expandedKeys =================
      if (needSync('expandedKeys') || prevProps && needSync('autoExpandParent')) {
        newState.expandedKeys = props.autoExpandParent || !prevProps && props.defaultExpandParent ? Object(__WEBPACK_IMPORTED_MODULE_13__util__["f" /* conductExpandParent */])(props.expandedKeys, keyEntities) : props.expandedKeys;
      } else if (!prevProps && props.defaultExpandAll) {
        newState.expandedKeys = Object.keys(keyEntities);
      } else if (!prevProps && props.defaultExpandedKeys) {
        newState.expandedKeys = props.autoExpandParent || props.defaultExpandParent ? Object(__WEBPACK_IMPORTED_MODULE_13__util__["f" /* conductExpandParent */])(props.defaultExpandedKeys, keyEntities) : props.defaultExpandedKeys;
      }

      // ================ selectedKeys =================
      if (props.selectable) {
        if (needSync('selectedKeys')) {
          newState.selectedKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["d" /* calcSelectedKeys */])(props.selectedKeys, props);
        } else if (!prevProps && props.defaultSelectedKeys) {
          newState.selectedKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["d" /* calcSelectedKeys */])(props.defaultSelectedKeys, props);
        }
      }

      // ================= checkedKeys =================
      if (props.checkable) {
        var checkedKeyEntity = void 0;

        if (needSync('checkedKeys')) {
          checkedKeyEntity = Object(__WEBPACK_IMPORTED_MODULE_13__util__["n" /* parseCheckedKeys */])(props.checkedKeys) || {};
        } else if (!prevProps && props.defaultCheckedKeys) {
          checkedKeyEntity = Object(__WEBPACK_IMPORTED_MODULE_13__util__["n" /* parseCheckedKeys */])(props.defaultCheckedKeys) || {};
        } else if (treeNode) {
          // If treeNode changed, we also need check it
          checkedKeyEntity = {
            checkedKeys: prevState.checkedKeys,
            halfCheckedKeys: prevState.halfCheckedKeys
          };
        }

        if (checkedKeyEntity) {
          var _checkedKeyEntity = checkedKeyEntity,
              _checkedKeyEntity$che = _checkedKeyEntity.checkedKeys,
              checkedKeys = _checkedKeyEntity$che === undefined ? [] : _checkedKeyEntity$che,
              _checkedKeyEntity$hal = _checkedKeyEntity.halfCheckedKeys,
              halfCheckedKeys = _checkedKeyEntity$hal === undefined ? [] : _checkedKeyEntity$hal;


          if (!props.checkStrictly) {
            var conductKeys = Object(__WEBPACK_IMPORTED_MODULE_13__util__["e" /* conductCheck */])(checkedKeys, true, keyEntities);
            checkedKeys = conductKeys.checkedKeys;
            halfCheckedKeys = conductKeys.halfCheckedKeys;
          }

          newState.checkedKeys = checkedKeys;
          newState.halfCheckedKeys = halfCheckedKeys;
        }
      }
      // ================= loadedKeys ==================
      if (needSync('loadedKeys')) {
        newState.loadedKeys = props.loadedKeys;
      }

      return newState;
    }

    /**
     * [Legacy] Select handler is less small than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */


    /**
     * Only update the value which is not in props
     */


    /**
     * [Legacy] Original logic use `key` as tracking clue.
     * We have to use `cloneElement` to pass `key`.
     */

  }]);

  return Tree;
}(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component);

Tree.propTypes = {
  prefixCls: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  className: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  tabIndex: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.number]),
  children: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.any,
  treeData: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.array, // Generate treeNode by children
  showLine: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  showIcon: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  icon: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func]),
  focusable: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  selectable: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  disabled: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  multiple: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  checkable: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node]),
  checkStrictly: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  draggable: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  defaultExpandParent: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  autoExpandParent: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  defaultExpandAll: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  defaultExpandedKeys: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string),
  expandedKeys: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string),
  defaultCheckedKeys: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string),
  checkedKeys: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.number])), __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.object]),
  defaultSelectedKeys: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string),
  selectedKeys: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string),
  onClick: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onDoubleClick: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onExpand: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onCheck: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onSelect: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onLoad: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  loadData: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  loadedKeys: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.arrayOf(__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string),
  onMouseEnter: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onMouseLeave: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onRightClick: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onDragStart: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onDragEnter: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onDragOver: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onDragLeave: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onDragEnd: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  onDrop: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  filterTreeNode: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func,
  openTransitionName: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  openAnimation: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.object]),
  switcherIcon: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func])
};
Tree.childContextTypes = __WEBPACK_IMPORTED_MODULE_12__contextTypes__["b" /* treeContextTypes */];
Tree.defaultProps = {
  prefixCls: 'rc-tree',
  showLine: false,
  showIcon: true,
  selectable: true,
  multiple: false,
  checkable: false,
  disabled: false,
  checkStrictly: false,
  draggable: false,
  defaultExpandParent: true,
  autoExpandParent: false,
  defaultExpandAll: false,
  defaultExpandedKeys: [],
  defaultCheckedKeys: [],
  defaultSelectedKeys: []
};


Object(__WEBPACK_IMPORTED_MODULE_11_react_lifecycles_compat__["a" /* polyfill */])(Tree);

/* harmony default export */ __webpack_exports__["a"] = (Tree);

/***/ }),
/* 173 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Base_BaseSelector__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__util__ = __webpack_require__(10);









var Selector = Object(__WEBPACK_IMPORTED_MODULE_6__Base_BaseSelector__["a" /* default */])('single');

var SingleSelector = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(SingleSelector, _React$Component);

  function SingleSelector() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, SingleSelector);

    var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (SingleSelector.__proto__ || Object.getPrototypeOf(SingleSelector)).call(this));

    _this.focus = function () {
      _this.selectorRef.current.focus();
    };

    _this.blur = function () {
      _this.selectorRef.current.blur();
    };

    _this.renderSelection = function () {
      var _this$props = _this.props,
          selectorValueList = _this$props.selectorValueList,
          placeholder = _this$props.placeholder,
          prefixCls = _this$props.prefixCls;


      var innerNode = void 0;

      if (selectorValueList.length) {
        var _selectorValueList$ = selectorValueList[0],
            label = _selectorValueList$.label,
            value = _selectorValueList$.value;

        innerNode = __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'span',
          {
            key: 'value',
            title: Object(__WEBPACK_IMPORTED_MODULE_7__util__["q" /* toTitle */])(label),
            className: prefixCls + '-selection-selected-value'
          },
          label || value
        );
      } else {
        innerNode = __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'span',
          {
            key: 'placeholder',
            className: prefixCls + '-selection__placeholder'
          },
          placeholder
        );
      }

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'span',
        { className: prefixCls + '-selection__rendered' },
        innerNode
      );
    };

    _this.selectorRef = Object(__WEBPACK_IMPORTED_MODULE_7__util__["g" /* createRef */])();
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(SingleSelector, [{
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Selector, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, this.props, {
        ref: this.selectorRef,
        renderSelection: this.renderSelection
      }));
    }
  }]);

  return SingleSelector;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

SingleSelector.propTypes = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __WEBPACK_IMPORTED_MODULE_6__Base_BaseSelector__["c" /* selectorPropTypes */]);


/* harmony default export */ __webpack_exports__["a"] = (SingleSelector);

/***/ }),
/* 174 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return multipleSelectorContextTypes; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_animate__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Base_BaseSelector__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__SearchInput__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__Selection__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__util__ = __webpack_require__(10);














var TREE_SELECT_EMPTY_VALUE_KEY = 'RC_TREE_SELECT_EMPTY_VALUE_KEY';

var Selector = Object(__WEBPACK_IMPORTED_MODULE_8__Base_BaseSelector__["a" /* default */])('multiple');

var multipleSelectorContextTypes = {
  onMultipleSelectorRemove: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired
};

var MultipleSelector = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(MultipleSelector, _React$Component);

  function MultipleSelector() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, MultipleSelector);

    var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (MultipleSelector.__proto__ || Object.getPrototypeOf(MultipleSelector)).call(this));

    _this.onPlaceholderClick = function () {
      _this.inputRef.current.focus();
    };

    _this.focus = function () {
      _this.inputRef.current.focus();
    };

    _this.blur = function () {
      _this.inputRef.current.blur();
    };

    _this.renderPlaceholder = function () {
      var _this$props = _this.props,
          prefixCls = _this$props.prefixCls,
          placeholder = _this$props.placeholder,
          searchPlaceholder = _this$props.searchPlaceholder,
          searchValue = _this$props.searchValue,
          selectorValueList = _this$props.selectorValueList;


      var currentPlaceholder = placeholder || searchPlaceholder;

      if (!currentPlaceholder) return null;

      var hidden = searchValue || selectorValueList.length;

      // [Legacy] Not remove the placeholder
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'span',
        {
          style: {
            display: hidden ? 'none' : 'block'
          },
          onClick: _this.onPlaceholderClick,
          className: prefixCls + '-search__field__placeholder'
        },
        currentPlaceholder
      );
    };

    _this.renderSelection = function () {
      var _this$props2 = _this.props,
          selectorValueList = _this$props2.selectorValueList,
          choiceTransitionName = _this$props2.choiceTransitionName,
          prefixCls = _this$props2.prefixCls,
          onChoiceAnimationLeave = _this$props2.onChoiceAnimationLeave,
          labelInValue = _this$props2.labelInValue,
          maxTagCount = _this$props2.maxTagCount,
          maxTagPlaceholder = _this$props2.maxTagPlaceholder;
      var onMultipleSelectorRemove = _this.context.rcTreeSelect.onMultipleSelectorRemove;

      // Check if `maxTagCount` is set

      var myValueList = selectorValueList;
      if (maxTagCount >= 0) {
        myValueList = selectorValueList.slice(0, maxTagCount);
      }

      // Selector node list
      var selectedValueNodes = myValueList.map(function (_ref) {
        var label = _ref.label,
            value = _ref.value;
        return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__Selection__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, _this.props, {
          key: value || TREE_SELECT_EMPTY_VALUE_KEY,
          label: label,
          value: value,
          onRemove: onMultipleSelectorRemove
        }));
      });

      // Rest node count
      if (maxTagCount >= 0 && maxTagCount < selectorValueList.length) {
        var content = '+ ' + (selectorValueList.length - maxTagCount) + ' ...';
        if (typeof maxTagPlaceholder === 'string') {
          content = maxTagPlaceholder;
        } else if (typeof maxTagPlaceholder === 'function') {
          var restValueList = selectorValueList.slice(maxTagCount);
          content = maxTagPlaceholder(labelInValue ? restValueList : restValueList.map(function (_ref2) {
            var value = _ref2.value;
            return value;
          }));
        }

        var restNodeSelect = __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__Selection__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, _this.props, {
          key: 'rc-tree-select-internal-max-tag-counter',
          label: content,
          value: null
        }));

        selectedValueNodes.push(restNodeSelect);
      }

      selectedValueNodes.push(__WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'li',
        {
          className: prefixCls + '-search ' + prefixCls + '-search--inline',
          key: '__input'
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__SearchInput__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, _this.props, { ref: _this.inputRef, needAlign: true }))
      ));
      var className = prefixCls + '-selection__rendered';
      if (choiceTransitionName) {
        return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_7_rc_animate__["a" /* default */],
          {
            className: className,
            component: 'ul',
            transitionName: choiceTransitionName,
            onLeave: onChoiceAnimationLeave
          },
          selectedValueNodes
        );
      }
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'ul',
        { className: className, role: 'menubar' },
        selectedValueNodes
      );
    };

    _this.inputRef = Object(__WEBPACK_IMPORTED_MODULE_11__util__["g" /* createRef */])();
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(MultipleSelector, [{
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Selector, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, this.props, {
        tabIndex: -1,
        showArrow: false,
        renderSelection: this.renderSelection,
        renderPlaceholder: this.renderPlaceholder
      }));
    }
  }]);

  return MultipleSelector;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

MultipleSelector.propTypes = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __WEBPACK_IMPORTED_MODULE_8__Base_BaseSelector__["c" /* selectorPropTypes */], {
  selectorValueList: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.array,
  disabled: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  searchValue: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  labelInValue: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  maxTagCount: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.number,
  maxTagPlaceholder: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func]),

  onChoiceAnimationLeave: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func
});
MultipleSelector.contextTypes = {
  rcTreeSelect: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.shape(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, multipleSelectorContextTypes, {

    onSearchInputChange: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func
  }))
};


/* harmony default export */ __webpack_exports__["a"] = (MultipleSelector);

/***/ }),
/* 175 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__util__ = __webpack_require__(10);









var Selection = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Selection, _React$Component);

  function Selection() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Selection);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Selection.__proto__ || Object.getPrototypeOf(Selection)).call.apply(_ref, [this].concat(args))), _this), _this.onRemove = function (event) {
      var _this$props = _this.props,
          onRemove = _this$props.onRemove,
          value = _this$props.value;

      onRemove(event, value);

      event.stopPropagation();
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Selection, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          prefixCls = _props.prefixCls,
          maxTagTextLength = _props.maxTagTextLength,
          label = _props.label,
          value = _props.value,
          onRemove = _props.onRemove,
          removeIcon = _props.removeIcon;


      var content = label || value;
      if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
        content = content.slice(0, maxTagTextLength) + '...';
      }

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'li',
        __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
          style: __WEBPACK_IMPORTED_MODULE_7__util__["b" /* UNSELECTABLE_STYLE */]
        }, __WEBPACK_IMPORTED_MODULE_7__util__["a" /* UNSELECTABLE_ATTRIBUTE */], {
          role: 'menuitem',
          className: prefixCls + '-selection__choice',
          title: Object(__WEBPACK_IMPORTED_MODULE_7__util__["q" /* toTitle */])(label)
        }),
        onRemove && __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'span',
          {
            className: prefixCls + '-selection__choice__remove',
            onClick: this.onRemove
          },
          typeof removeIcon === 'function' ? __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(removeIcon, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, this.props)) : removeIcon
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'span',
          { className: prefixCls + '-selection__choice__content' },
          content
        )
      );
    }
  }]);

  return Selection;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

Selection.propTypes = {
  prefixCls: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  maxTagTextLength: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.number,
  onRemove: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,

  label: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node,
  value: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string, __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.number]),
  removeIcon: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.oneOfType([__WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.node, __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func])
};


/* harmony default export */ __webpack_exports__["a"] = (Selection);

/***/ }),
/* 176 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Base_BasePopup__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__SearchInput__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__util__ = __webpack_require__(10);











var SinglePopup = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(SinglePopup, _React$Component);

  function SinglePopup() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, SinglePopup);

    var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (SinglePopup.__proto__ || Object.getPrototypeOf(SinglePopup)).call(this));

    _this.onPlaceholderClick = function () {
      _this.inputRef.current.focus();
    };

    _this.renderPlaceholder = function () {
      var _this$props = _this.props,
          searchPlaceholder = _this$props.searchPlaceholder,
          searchValue = _this$props.searchValue,
          prefixCls = _this$props.prefixCls;


      if (!searchPlaceholder) {
        return null;
      }

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'span',
        {
          style: {
            display: searchValue ? 'none' : 'block'
          },
          onClick: _this.onPlaceholderClick,
          className: prefixCls + '-search__field__placeholder'
        },
        searchPlaceholder
      );
    };

    _this.renderSearch = function () {
      var _this$props2 = _this.props,
          showSearch = _this$props2.showSearch,
          dropdownPrefixCls = _this$props2.dropdownPrefixCls;


      if (!showSearch) {
        return null;
      }

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'span',
        { className: dropdownPrefixCls + '-search' },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__SearchInput__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, _this.props, {
          ref: _this.inputRef,
          renderPlaceholder: _this.renderPlaceholder
        }))
      );
    };

    _this.inputRef = Object(__WEBPACK_IMPORTED_MODULE_9__util__["g" /* createRef */])();
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(SinglePopup, [{
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__Base_BasePopup__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, this.props, {
        renderSearch: this.renderSearch
      }));
    }
  }]);

  return SinglePopup;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

SinglePopup.propTypes = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __WEBPACK_IMPORTED_MODULE_7__Base_BasePopup__["a" /* default */].propTypes, {
  searchValue: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  showSearch: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  dropdownPrefixCls: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  disabled: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  searchPlaceholder: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string
});


/* harmony default export */ __webpack_exports__["a"] = (SinglePopup);

/***/ }),
/* 177 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Base_BasePopup__ = __webpack_require__(56);


/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__Base_BasePopup__["a" /* default */]);

/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=rc-tree-select.js.map