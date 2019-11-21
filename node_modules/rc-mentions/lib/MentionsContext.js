"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MentionsContextConsumer = exports.MentionsContextProvider = void 0;

var _createReactContext = _interopRequireDefault(require("@ant-design/create-react-context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* tslint:disable: no-object-literal-type-assertion */
// We will never use default, here only to fix TypeScript warning
var MentionsContext = (0, _createReactContext.default)(null);
var MentionsContextProvider = MentionsContext.Provider;
exports.MentionsContextProvider = MentionsContextProvider;
var MentionsContextConsumer = MentionsContext.Consumer;
exports.MentionsContextConsumer = MentionsContextConsumer;