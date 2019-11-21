"use strict";

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.freeze");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animation = exports.easing = void 0;

var _core = require("@emotion/core");

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  0%, 100% { transform:translate3d(0,0,0); }\n  12.5%, 62.5% { transform:translate3d(-4px,0,0); }\n  37.5%, 87.5% {  transform: translate3d(4px,0,0);  }\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  0% { transform: translateY(1px); }\n  25% { transform: translateY(0px); }\n  50% { transform: translateY(-3px); }\n  100% { transform: translateY(1px); }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  0%, 100% { opacity: 1; }\n  50% { opacity: .4; }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n\tfrom {\n\t\ttransform: rotate(0deg);\n\t}\n\tto {\n\t\ttransform: rotate(360deg);\n\t}\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var easing = {
  rubber: 'cubic-bezier(0.175, 0.885, 0.335, 1.05)'
};
exports.easing = easing;
var rotate360 = (0, _core.keyframes)(_templateObject());
var glow = (0, _core.keyframes)(_templateObject2());

var _float = (0, _core.keyframes)(_templateObject3());

var jiggle = (0, _core.keyframes)(_templateObject4());
var inlineGlow =
/*#__PURE__*/
(0, _core.css)("animation:", glow, " 1.5s ease-in-out infinite;color:transparent;cursor:progress;label:inlineGlow;" + (process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hbmltYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBaUNzQiIsImZpbGUiOiIuLi9zcmMvYW5pbWF0aW9uLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3NzLCBrZXlmcmFtZXMgfSBmcm9tICdAZW1vdGlvbi9jb3JlJztcblxuZXhwb3J0IGNvbnN0IGVhc2luZyA9IHtcbiAgcnViYmVyOiAnY3ViaWMtYmV6aWVyKDAuMTc1LCAwLjg4NSwgMC4zMzUsIDEuMDUpJyxcbn07XG5cbmNvbnN0IHJvdGF0ZTM2MCA9IGtleWZyYW1lc2Bcblx0ZnJvbSB7XG5cdFx0dHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG5cdH1cblx0dG8ge1xuXHRcdHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG5cdH1cbmA7XG5cbmNvbnN0IGdsb3cgPSBrZXlmcmFtZXNgXG4gIDAlLCAxMDAlIHsgb3BhY2l0eTogMTsgfVxuICA1MCUgeyBvcGFjaXR5OiAuNDsgfVxuYDtcblxuY29uc3QgZmxvYXQgPSBrZXlmcmFtZXNgXG4gIDAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDFweCk7IH1cbiAgMjUlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCk7IH1cbiAgNTAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zcHgpOyB9XG4gIDEwMCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMXB4KTsgfVxuYDtcblxuY29uc3QgamlnZ2xlID0ga2V5ZnJhbWVzYFxuICAwJSwgMTAwJSB7IHRyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCk7IH1cbiAgMTIuNSUsIDYyLjUlIHsgdHJhbnNmb3JtOnRyYW5zbGF0ZTNkKC00cHgsMCwwKTsgfVxuICAzNy41JSwgODcuNSUgeyAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCg0cHgsMCwwKTsgIH1cbmA7XG5cbmNvbnN0IGlubGluZUdsb3cgPSBjc3NgXG4gIGFuaW1hdGlvbjogJHtnbG93fSAxLjVzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICBjb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGN1cnNvcjogcHJvZ3Jlc3M7XG5gO1xuXG4vLyBob3ZlciAmIGFjdGl2ZSBzdGF0ZSBmb3IgbGlua3MgYW5kIGJ1dHRvbnNcbmNvbnN0IGhvdmVyYWJsZSA9IGNzc2BcbiAgdHJhbnNpdGlvbjogYWxsIDE1MG1zIGVhc2Utb3V0O1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xuXG4gICY6aG92ZXIge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgLTJweCwgMCk7XG4gIH1cblxuICAmOmFjdGl2ZSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IGFuaW1hdGlvbiA9IHtcbiAgcm90YXRlMzYwLFxuICBnbG93LFxuICBmbG9hdCxcbiAgamlnZ2xlLFxuICBpbmxpbmVHbG93LFxuICBob3ZlcmFibGUsXG59O1xuIl19 */")); // hover & active state for links and buttons

var hoverable = process.env.NODE_ENV === "production" ? {
  name: "1023qba-hoverable",
  styles: "transition:all 150ms ease-out;transform:translate3d(0,0,0);&:hover{transform:translate3d(0,-2px,0);}&:active{transform:translate3d(0,0,0);}label:hoverable;"
} : {
  name: "1023qba-hoverable",
  styles: "transition:all 150ms ease-out;transform:translate3d(0,0,0);&:hover{transform:translate3d(0,-2px,0);}&:active{transform:translate3d(0,0,0);}label:hoverable;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hbmltYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBd0NxQiIsImZpbGUiOiIuLi9zcmMvYW5pbWF0aW9uLnRzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3NzLCBrZXlmcmFtZXMgfSBmcm9tICdAZW1vdGlvbi9jb3JlJztcblxuZXhwb3J0IGNvbnN0IGVhc2luZyA9IHtcbiAgcnViYmVyOiAnY3ViaWMtYmV6aWVyKDAuMTc1LCAwLjg4NSwgMC4zMzUsIDEuMDUpJyxcbn07XG5cbmNvbnN0IHJvdGF0ZTM2MCA9IGtleWZyYW1lc2Bcblx0ZnJvbSB7XG5cdFx0dHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG5cdH1cblx0dG8ge1xuXHRcdHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG5cdH1cbmA7XG5cbmNvbnN0IGdsb3cgPSBrZXlmcmFtZXNgXG4gIDAlLCAxMDAlIHsgb3BhY2l0eTogMTsgfVxuICA1MCUgeyBvcGFjaXR5OiAuNDsgfVxuYDtcblxuY29uc3QgZmxvYXQgPSBrZXlmcmFtZXNgXG4gIDAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDFweCk7IH1cbiAgMjUlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCk7IH1cbiAgNTAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zcHgpOyB9XG4gIDEwMCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMXB4KTsgfVxuYDtcblxuY29uc3QgamlnZ2xlID0ga2V5ZnJhbWVzYFxuICAwJSwgMTAwJSB7IHRyYW5zZm9ybTp0cmFuc2xhdGUzZCgwLDAsMCk7IH1cbiAgMTIuNSUsIDYyLjUlIHsgdHJhbnNmb3JtOnRyYW5zbGF0ZTNkKC00cHgsMCwwKTsgfVxuICAzNy41JSwgODcuNSUgeyAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCg0cHgsMCwwKTsgIH1cbmA7XG5cbmNvbnN0IGlubGluZUdsb3cgPSBjc3NgXG4gIGFuaW1hdGlvbjogJHtnbG93fSAxLjVzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICBjb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGN1cnNvcjogcHJvZ3Jlc3M7XG5gO1xuXG4vLyBob3ZlciAmIGFjdGl2ZSBzdGF0ZSBmb3IgbGlua3MgYW5kIGJ1dHRvbnNcbmNvbnN0IGhvdmVyYWJsZSA9IGNzc2BcbiAgdHJhbnNpdGlvbjogYWxsIDE1MG1zIGVhc2Utb3V0O1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xuXG4gICY6aG92ZXIge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgLTJweCwgMCk7XG4gIH1cblxuICAmOmFjdGl2ZSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcbiAgfVxuYDtcblxuZXhwb3J0IGNvbnN0IGFuaW1hdGlvbiA9IHtcbiAgcm90YXRlMzYwLFxuICBnbG93LFxuICBmbG9hdCxcbiAgamlnZ2xlLFxuICBpbmxpbmVHbG93LFxuICBob3ZlcmFibGUsXG59O1xuIl19 */"
};
var animation = {
  rotate360: rotate360,
  glow: glow,
  "float": _float,
  jiggle: jiggle,
  inlineGlow: inlineGlow,
  hoverable: hoverable
};
exports.animation = animation;