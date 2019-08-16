"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransform = exports.getTransform = exports.registerParser = exports.getParser = void 0;
var TRANSFORMS = {};
var PARSERS = {};

var getParser = function getParser(type) {
  return PARSERS[type];
};

exports.getParser = getParser;

var registerParser = function registerParser(type, parserFunction) {
  PARSERS[type] = parserFunction;
};

exports.registerParser = registerParser;

var getTransform = function getTransform(type) {
  return TRANSFORMS[type];
};

exports.getTransform = getTransform;

var registerTransform = function registerTransform(type, transFunction) {
  TRANSFORMS[type] = transFunction;
};

exports.registerTransform = registerTransform;