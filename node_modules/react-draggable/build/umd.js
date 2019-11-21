"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Draggable = _interopRequireDefault(require("./Draggable"));

var _DraggableCore = _interopRequireDefault(require("./DraggableCore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Previous versions of this lib exported <Draggable> as the root export. As to not break
// them, or TypeScript, we export *both* as the root and as 'default'.
// See https://github.com/mzabriskie/react-draggable/pull/254
// and https://github.com/mzabriskie/react-draggable/issues/266
_Draggable.default.default = _Draggable.default;
_Draggable.default.DraggableCore = _DraggableCore.default;
var _default = _Draggable.default;
exports.default = _default;