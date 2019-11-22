"use strict";

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serverRequire;

var _interpret = _interopRequireDefault(require("interpret"));

var _nodeLogger = require("@storybook/node-logger");

var _interpretFiles = require("./interpret-files");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The code based on https://github.com/webpack/webpack-cli/blob/ca504de8c7c0ea66278021b72fa6a953e3ffa43c/bin/convert-argv
const compilersState = new Map();

function registerCompiler(moduleDescriptor) {
  if (!moduleDescriptor) {
    return 0;
  }

  const state = compilersState.get(moduleDescriptor);

  if (state !== undefined) {
    return state;
  }

  if (typeof moduleDescriptor === 'string') {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(moduleDescriptor);

    compilersState.set(moduleDescriptor, 1);
    return 1;
  }

  if (!Array.isArray(moduleDescriptor)) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    moduleDescriptor.register(require(moduleDescriptor.module));
    compilersState.set(moduleDescriptor, 1);
    return 1;
  }

  let registered = 0;

  for (let i = 0; i < moduleDescriptor.length; i += 1) {
    try {
      registered += registerCompiler(moduleDescriptor[i]);
      break;
    } catch (e) {// do nothing
    }
  }

  compilersState.set(moduleDescriptor, registered);
  return registered;
}

function interopRequireDefault(filePath) {
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const result = require(filePath);

  const isES6DefaultExported = typeof result === 'object' && result !== null && typeof result.default !== 'undefined';
  return isES6DefaultExported ? result.default : result;
}

function getCandidate(paths) {
  for (let i = 0; i < paths.length; i += 1) {
    const candidate = (0, _interpretFiles.getInterpretedFileWithExt)(paths[i]);

    if (candidate) {
      return candidate;
    }
  }

  return undefined;
}

function serverRequire(filePath) {
  const paths = Array.isArray(filePath) ? filePath : [filePath];
  const existingCandidate = getCandidate(paths);

  if (!existingCandidate) {
    return null;
  }

  const {
    path: candidatePath,
    ext: candidateExt
  } = existingCandidate;
  const moduleDescriptor = _interpret.default.extensions[candidateExt]; // The "moduleDescriptor" either "undefined" or "null". The warning isn't needed in these cases.

  if (moduleDescriptor && registerCompiler(moduleDescriptor) === 0) {
    _nodeLogger.logger.warn(`=> File ${candidatePath} is detected`);

    _nodeLogger.logger.warn(`   but impossible to import loader for ${candidateExt}`);

    return null;
  }

  return interopRequireDefault(candidatePath);
}