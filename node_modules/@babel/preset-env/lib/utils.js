"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = getType;
exports.semverify = semverify;
exports.intersection = intersection;
exports.findSuggestion = findSuggestion;
exports.prettifyVersion = prettifyVersion;
exports.prettifyTargets = prettifyTargets;
exports.isUnreleasedVersion = isUnreleasedVersion;
exports.getLowestUnreleased = getLowestUnreleased;
exports.filterStageFromList = filterStageFromList;
exports.getImportSource = getImportSource;
exports.getRequireSource = getRequireSource;
exports.isPolyfillSource = isPolyfillSource;
exports.getModulePath = getModulePath;
exports.createImport = createImport;
exports.isNamespaced = isNamespaced;
exports.has = void 0;

var t = _interopRequireWildcard(require("@babel/types"));

var _invariant = _interopRequireDefault(require("invariant"));

var _semver = _interopRequireDefault(require("semver"));

var _jsLevenshtein = _interopRequireDefault(require("js-levenshtein"));

var _helperModuleImports = require("@babel/helper-module-imports");

var _unreleasedLabels = _interopRequireDefault(require("../data/unreleased-labels"));

var _targetsParser = require("./targets-parser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const has = Object.hasOwnProperty.call.bind(Object.hasOwnProperty);
exports.has = has;

function getType(target) {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

const versionRegExp = /^(\d+|\d+.\d+)$/;

function semverify(version) {
  if (typeof version === "string" && _semver.default.valid(version)) {
    return version;
  }

  (0, _invariant.default)(typeof version === "number" || typeof version === "string" && versionRegExp.test(version), `'${version}' is not a valid version`);
  const split = version.toString().split(".");

  while (split.length < 3) {
    split.push("0");
  }

  return split.join(".");
}

function intersection(first, second, third) {
  const result = new Set();

  for (const el of first) {
    if (second.has(el) && third.has(el)) result.add(el);
  }

  return result;
}

function findSuggestion(options, option) {
  let levenshteinValue = Infinity;
  return options.reduce((suggestion, validOption) => {
    const value = (0, _jsLevenshtein.default)(validOption, option);

    if (value < levenshteinValue) {
      levenshteinValue = value;
      return validOption;
    }

    return suggestion;
  }, "");
}

function prettifyVersion(version) {
  if (typeof version !== "string") {
    return version;
  }

  const parts = [_semver.default.major(version)];

  const minor = _semver.default.minor(version);

  const patch = _semver.default.patch(version);

  if (minor || patch) {
    parts.push(minor);
  }

  if (patch) {
    parts.push(patch);
  }

  return parts.join(".");
}

function prettifyTargets(targets) {
  return Object.keys(targets).reduce((results, target) => {
    let value = targets[target];
    const unreleasedLabel = _unreleasedLabels.default[target];

    if (typeof value === "string" && unreleasedLabel !== value) {
      value = prettifyVersion(value);
    }

    results[target] = value;
    return results;
  }, {});
}

function isUnreleasedVersion(version, env) {
  const unreleasedLabel = _unreleasedLabels.default[env];
  return !!unreleasedLabel && unreleasedLabel === version.toString().toLowerCase();
}

function getLowestUnreleased(a, b, env) {
  const unreleasedLabel = _unreleasedLabels.default[env];
  const hasUnreleased = [a, b].some(item => item === unreleasedLabel);

  if (hasUnreleased) {
    return a === hasUnreleased ? b : a || b;
  }

  return (0, _targetsParser.semverMin)(a, b);
}

function filterStageFromList(list, stageList) {
  return Object.keys(list).reduce((result, item) => {
    if (!stageList[item]) {
      result[item] = list[item];
    }

    return result;
  }, {});
}

function getImportSource({
  node
}) {
  if (node.specifiers.length === 0) return node.source.value;
}

function getRequireSource({
  node
}) {
  if (!t.isExpressionStatement(node)) return;
  const {
    expression
  } = node;
  const isRequire = t.isCallExpression(expression) && t.isIdentifier(expression.callee) && expression.callee.name === "require" && expression.arguments.length === 1 && t.isStringLiteral(expression.arguments[0]);
  if (isRequire) return expression.arguments[0].value;
}

function isPolyfillSource(source) {
  return source === "@babel/polyfill" || source === "core-js";
}

const modulePathMap = {
  "regenerator-runtime": "regenerator-runtime/runtime"
};

function getModulePath(mod) {
  return modulePathMap[mod] || `core-js/modules/${mod}`;
}

function createImport(path, mod) {
  return (0, _helperModuleImports.addSideEffect)(path, getModulePath(mod));
}

function isNamespaced(path) {
  if (!path.node) return false;
  const binding = path.scope.getBinding(path.node.name);
  if (!binding) return false;
  return binding.path.isImportNamespaceSpecifier();
}