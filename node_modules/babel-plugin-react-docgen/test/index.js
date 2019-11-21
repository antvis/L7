import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from '@babel/core';
import plugin from '../src';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('Add propType doc to react components', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    // Ignore macOS directory files
    if (caseName.indexOf('.DS_Store') < 0) {
      it(`should ${caseName.split('-').join(' ')}`, () => {
        const fixtureDir = path.join(fixturesDir, caseName);
        const actualPath = path.join(fixtureDir, 'actual.js');
        const options = {
          presets: [
            "@babel/env",
            "@babel/flow",
            "@babel/react",
          ],
          plugins: [
            [plugin, {
              "DOC_GEN_COLLECTION_NAME": "STORYBOOK_REACT_CLASSES",
              handlers: ["react-docgen-deprecation-handler"]
            }],
            "@babel/plugin-proposal-class-properties"
          ],
          babelrc: false
        };

        const actual = transformFileSync(actualPath, options).code;
        // fs.writeFileSync(path.join(fixtureDir, 'expected.js'), actual);
        const expected = fs.readFileSync(
          path.join(fixtureDir, 'expected.js')
        ).toString();
        assert.equal(trim(actual), trim(expected));
      });
    }
  });
});
