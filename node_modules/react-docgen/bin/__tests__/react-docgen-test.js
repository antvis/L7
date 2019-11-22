/*
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/*global jasmine, describe, it, expect, afterEach*/

// NOTE: This test spawns a subprocesses that load the files from dist/, not
// src/. Before running this test run `npm run build` or `npm run watch`.

const TEST_TIMEOUT = 120000;

jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST_TIMEOUT;

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const temp = require('temp');
const spawn = require('cross-spawn');

function run(args, stdin) {
  return new Promise(resolve => {
    const docgen = spawn(path.join(__dirname, '../react-docgen.js'), args);
    let stdout = '';
    let stderr = '';
    docgen.stdout.on('data', data => (stdout += data));
    docgen.stderr.on('data', data => (stderr += data));
    docgen.on('close', () => resolve([stdout, stderr]));
    docgen.on('error', e => {
      throw e;
    });
    if (stdin) {
      docgen.stdin.write(stdin);
    }
    docgen.stdin.end();
  });
}

const component = fs.readFileSync(
  path.join(__dirname, '../../example/components/Component.js'),
);

describe('react-docgen CLI', () => {
  let tempDir;
  let tempComponents = [];
  let tempNoComponents = [];

  function createTempfiles(suffix, dir) {
    if (!tempDir) {
      tempDir = temp.mkdirSync();
    }
    if (!dir) {
      dir = tempDir;
    } else {
      dir = path.join(tempDir, dir);
      try {
        fs.mkdirSync(dir);
      } catch (error) {
        if (error.message.indexOf('EEXIST') === -1) {
          throw error;
        }
      }
    }
    if (!suffix) {
      suffix = 'js';
    }

    const componentPath = path.join(dir, 'Component.' + suffix);
    const componentFile = fs.openSync(componentPath, 'w');
    fs.writeSync(componentFile, component.toString());
    fs.closeSync(componentFile);
    const noComponentPath = path.join(dir, 'NoComponent.' + suffix);
    const noComponentFile = fs.openSync(noComponentPath, 'w');
    fs.writeSync(noComponentFile, '{}');
    fs.closeSync(noComponentFile);

    tempComponents.push(componentPath);
    tempNoComponents.push(noComponentPath);

    return dir;
  }

  afterEach(() => {
    if (tempDir) {
      rimraf.sync(tempDir);
    }
    tempDir = null;
    tempComponents = [];
    tempNoComponents = [];
  });

  it(
    'reads from stdin',
    () => {
      return run([], component).then(([stdout, stderr]) => {
        expect(stdout).not.toBe('');
        expect(stderr).toBe('');
      });
    },
    TEST_TIMEOUT,
  );

  it(
    'reads files provided as command line arguments',
    () => {
      createTempfiles();
      return run(tempComponents.concat(tempNoComponents)).then(
        ([stdout, stderr]) => {
          expect(stdout).toContain('Component');
          expect(stderr).toContain('NoComponent');
        },
      );
    },
    TEST_TIMEOUT,
  );

  it(
    'reads directories provided as command line arguments',
    () => {
      createTempfiles();
      return run([tempDir]).then(([stdout, stderr]) => {
        expect(stdout).toContain('Component');
        expect(stderr).toContain('NoComponent');
      });
    },
    TEST_TIMEOUT,
  );

  it(
    'considers js and jsx by default',
    () => {
      createTempfiles();
      createTempfiles('jsx');
      createTempfiles('foo');
      return run([tempDir]).then(([stdout, stderr]) => {
        expect(stdout).toContain('Component.js');
        expect(stdout).toContain('Component.jsx');
        expect(stdout).not.toContain('Component.foo');

        expect(stderr).toContain('NoComponent.js');
        expect(stderr).toContain('NoComponent.jsx');
        expect(stderr).not.toContain('NoComponent.foo');
      });
    },
    TEST_TIMEOUT,
  );

  it(
    'considers files with the specified extension',
    () => {
      createTempfiles('foo');
      createTempfiles('bar');

      const verify = ([stdout, stderr]) => {
        expect(stdout).toContain('Component.foo');
        expect(stdout).toContain('Component.bar');

        expect(stderr).toContain('NoComponent.foo');
        expect(stderr).toContain('NoComponent.bar');
      };

      return Promise.all([
        run(['--extension=foo', '--extension=bar', tempDir]).then(verify),
        run(['-x', 'foo', '-x', 'bar', tempDir]).then(verify),
      ]);
    },
    TEST_TIMEOUT,
  );

  it(
    'ignores files in node_modules, __tests__ and __mocks__ by default',
    () => {
      createTempfiles(null, 'node_modules');
      createTempfiles(null, '__tests__');
      createTempfiles(null, '__mocks__');

      return run([tempDir]).then(([stdout, stderr]) => {
        expect(stdout).toBe('');
        expect(stderr).toBe('');
      });
    },
    TEST_TIMEOUT,
  );

  it(
    'ignores specified folders',
    () => {
      createTempfiles(null, 'foo');

      const verify = ([stdout, stderr]) => {
        expect(stdout).toBe('');
        expect(stderr).toBe('');
      };

      return Promise.all([
        run(['--ignore=foo', tempDir]).then(verify),
        run(['-i', 'foo', tempDir]).then(verify),
      ]);
    },
    TEST_TIMEOUT,
  );

  it(
    'writes to stdout',
    () => {
      return run([], component).then(([stdout, stderr]) => {
        expect(stdout.length > 0).toBe(true);
        expect(stderr.length).toBe(0);
      });
    },
    TEST_TIMEOUT,
  );

  it(
    'writes to stderr',
    () => {
      return run([], '{}').then(([stdout, stderr]) => {
        expect(stderr.length > 0).toBe(true);
        expect(stdout.length).toBe(0);
      });
    },
    TEST_TIMEOUT,
  );

  it(
    'writes to a file if provided',
    () => {
      const outFile = temp.openSync();
      createTempfiles();

      const verify = ([stdout]) => {
        expect(fs.readFileSync(outFile.path)).not.toBe('');
        expect(stdout).toBe('');
      };

      return Promise.all([
        run(['--out=' + outFile.path, tempDir]).then(verify),
        run(['-o', outFile.path, tempDir]).then(verify),
      ]);
    },
    TEST_TIMEOUT,
  );

  describe('--resolver', () => {
    it(
      'accepts the names of built in resolvers',
      () => {
        return Promise.all([
          // No option passed: same as --resolver=findExportedComponentDefinition
          run([
            path.join(__dirname, '../../example/components/Component.js'),
          ]).then(([stdout]) => {
            expect(stdout).toContain('Component');
          }),

          run([
            '--resolver=findExportedComponentDefinition',
            path.join(__dirname, '../../example/components/Component.js'),
          ]).then(([stdout]) => {
            expect(stdout).toContain('Component');
          }),

          run([
            '--resolver=findAllComponentDefinitions',
            path.join(__dirname, './example/MultipleComponents.js'),
          ]).then(([stdout]) => {
            expect(stdout).toContain('ComponentA');
            expect(stdout).toContain('ComponentB');
          }),
        ]);
      },
      TEST_TIMEOUT,
    );

    it(
      'accepts a path to a resolver function',
      () => {
        return Promise.all([
          run([
            '--resolver=' + path.join(__dirname, 'example/customResolver.js'),
            path.join(__dirname, '../../example/components/Component.js'),
          ]).then(([stdout]) => {
            expect(stdout).toContain('Custom');
          }),
        ]);
      },
      TEST_TIMEOUT,
    );
  });

  describe('--exclude/-e', () => {
    it(
      'ignores files by name',
      () => {
        createTempfiles(null, 'foo');
        createTempfiles(null, 'bar');

        const verify = ([stdout, stderr]) => {
          expect(stdout).toBe('');
          expect(stderr).toBe('');
        };

        return run([
          '--exclude=Component.js',
          '--exclude=NoComponent.js',
          tempDir,
        ]).then(verify);
      },
      TEST_TIMEOUT,
    );

    it(
      'ignores files by regex',
      () => {
        createTempfiles(null, 'foo');
        createTempfiles(null, 'bar');

        const verify = ([stdout, stderr]) => {
          expect(stdout).toBe('');
          expect(stderr).toBe('');
        };

        return run(['--exclude=/.*Component\\.js/', tempDir]).then(verify);
      },
      TEST_TIMEOUT,
    );
  });
});
