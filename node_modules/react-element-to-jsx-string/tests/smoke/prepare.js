#!/usr/bin/env node

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const requestedReactVersion = process.argv[2];
if (!requestedReactVersion) {
  throw new Error("React version is missing: '$ ./prepare 16.0.0'");
}

const nodeModulesPath = path.join(__dirname, 'node_modules');
const packageJsonPath = path.join(__dirname, 'package.json');

const deleteExistingDependencies = () => () => {
  if (fs.existsSync(nodeModulesPath)) {
    execSync(`rm -r "${nodeModulesPath}"`, {
      cwd: __dirname,
      stdio: 'inherit',
    });
  }

  if (fs.existsSync(packageJsonPath)) {
    execSync(`rm "${packageJsonPath}"`, {
      cwd: __dirname,
      stdio: 'inherit',
    });
  }
};

const preparePackageJson = reactVersion => () => {
  const packageJson = {
    name: 'smoke',
    version: '0.0.1',
    main: 'index.js',
    license: 'MIT',
    private: true,
    dependencies: {
      react: reactVersion,
    },
  };

  fs.writeFileSync(
    path.join(__dirname, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
};

const installDependencies = () => () =>
  new Promise(() => {
    if (!fs.existsSync(packageJsonPath)) {
      return;
    }

    execSync('yarn install --no-lockfile', {
      cwd: __dirname,
      stdio: 'inherit',
    });
  });

Promise.resolve()
  .then(() =>
    console.log(`Requested "react" version: "${requestedReactVersion}"`)
  )
  .then(deleteExistingDependencies())
  .then(preparePackageJson(requestedReactVersion))
  .then(installDependencies())
  .catch(err => console.error(err));
