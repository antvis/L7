#!/usr/bin/env node

const execFileSync = require('child_process').execFileSync;
const path = require('path');

const buildType = process.argv[2];
if (!buildType) {
  throw new Error('The build type to test is missing');
}

const requestedReactVersion = process.argv[3];
if (!requestedReactVersion) {
  throw new Error('React version to use for the test is missing');
}

execFileSync(path.join(__dirname, 'prepare.js'), [requestedReactVersion], {
  cwd: __dirname,
  stdio: 'inherit',
});

execFileSync(path.join(__dirname, 'smoke.js'), [buildType], {
  cwd: __dirname,
  stdio: 'inherit',
});
