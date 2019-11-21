"use strict";

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.placement = exports.all = exports.single = exports.allData = exports.singleData = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _notifications = _interopRequireDefault(require("./notifications"));

var itemStories = _interopRequireWildcard(require("./item.stories"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  component: _notifications["default"],
  title: 'UI|Notifications/Notifications',
  decorators: [function (storyFn) {
    return _react["default"].createElement("div", {
      style: {
        width: '240px',
        margin: '1rem'
      }
    }, storyFn());
  }],
  excludeStories: /.*Data$/
};
exports["default"] = _default;
var items = Array.from(Object.entries(itemStories)).filter(function (entry) {
  return itemStories["default"].excludeStories.exec(entry[0]);
}).map(function (entry) {
  return entry[1];
});
var singleData = [items[0]];
exports.singleData = singleData;
var allData = items;
exports.allData = allData;

var single = function single() {
  return _react["default"].createElement(_notifications["default"], {
    notifications: singleData,
    placement: {
      position: 'relative'
    }
  });
};

exports.single = single;
single.displayName = "single";

var all = function all() {
  return _react["default"].createElement(_notifications["default"], {
    notifications: allData,
    placement: {
      position: 'relative'
    }
  });
};

exports.all = all;
all.displayName = "all";

var placement = function placement() {
  return _react["default"].createElement(_notifications["default"], {
    placement: {
      position: 'fixed',
      left: 20,
      bottom: 20
    },
    notifications: allData
  });
};

exports.placement = placement;
placement.displayName = "placement";