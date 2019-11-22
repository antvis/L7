"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "withKnobs", {
  enumerable: true,
  get: function get() {
    return _.withKnobs;
  }
});
Object.defineProperty(exports, "knob", {
  enumerable: true,
  get: function get() {
    return _.knob;
  }
});
Object.defineProperty(exports, "text", {
  enumerable: true,
  get: function get() {
    return _.text;
  }
});
Object.defineProperty(exports, "boolean", {
  enumerable: true,
  get: function get() {
    return _["boolean"];
  }
});
Object.defineProperty(exports, "number", {
  enumerable: true,
  get: function get() {
    return _.number;
  }
});
Object.defineProperty(exports, "color", {
  enumerable: true,
  get: function get() {
    return _.color;
  }
});
Object.defineProperty(exports, "object", {
  enumerable: true,
  get: function get() {
    return _.object;
  }
});
Object.defineProperty(exports, "array", {
  enumerable: true,
  get: function get() {
    return _.array;
  }
});
Object.defineProperty(exports, "date", {
  enumerable: true,
  get: function get() {
    return _.date;
  }
});
Object.defineProperty(exports, "select", {
  enumerable: true,
  get: function get() {
    return _.select;
  }
});
Object.defineProperty(exports, "files", {
  enumerable: true,
  get: function get() {
    return _.files;
  }
});
Object.defineProperty(exports, "button", {
  enumerable: true,
  get: function get() {
    return _.button;
  }
});

var _ = require(".");