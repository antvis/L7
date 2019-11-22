"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseList = parseList;
exports.getEnvConfig = getEnvConfig;

function parseList(str) {
  return str.split(',');
}

function getEnvConfig(program, configEnv) {
  Object.keys(configEnv).forEach(fieldName => {
    const envVarName = configEnv[fieldName];
    const envVarValue = process.env[envVarName];

    if (envVarValue) {
      program[fieldName] = envVarValue; // eslint-disable-line
    }
  });
}