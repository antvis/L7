#!/usr/bin/env node

/* eslint-disable no-console, import/no-extraneous-dependencies, no-global-assign */

require = require('esm')(module);

const requireReactElementToJsxString = buildType => {
  if (buildType === 'esm') {
    return require(`./../../dist/esm`).default;
  } else if (buildType === 'cjs') {
    return require('./../../dist/cjs').default;
  }

  throw new Error(`Unknown build type: "${buildType}"`);
};

const expect = require('expect');
const React = require('react');
const reactElementToJsxString = requireReactElementToJsxString(process.argv[2]);

console.log(`Tested "react" version: "${React.version}"`);

const tree = React.createElement(
  'div',
  { foo: 51 },
  React.createElement('h1', {}, 'Hello world')
);

expect(reactElementToJsxString(tree)).toEqual(
  `<div foo={51}>
  <h1>
    Hello world
  </h1>
</div>`
);
