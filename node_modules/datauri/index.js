#!/usr/bin/env node
var semver = require('semver');
var nodeVersion = semver.clean(process.version);
var build = './';

if (!semver.satisfies(nodeVersion, '>= 4.0.0')) {
  build += 'old/';
}

module.exports = require(build + 'module');
