# @zkochan/cmd-shim

> Used in pnpm for command line application support

<!--@shields('travis', 'appveyor', 'npm')-->
[![Build Status](https://img.shields.io/travis/pnpm/cmd-shim/master.svg)](https://travis-ci.org/pnpm/cmd-shim) [![Build Status on Windows](https://img.shields.io/appveyor/ci/zkochan/cmd-shim-8ah3a/master.svg)](https://ci.appveyor.com/project/zkochan/cmd-shim-8ah3a/branch/master) [![npm version](https://img.shields.io/npm/v/@zkochan/cmd-shim.svg)](https://www.npmjs.com/package/@zkochan/cmd-shim)
<!--/@-->

The cmd-shim used in [pnpm](https://github.com/rstacruz/pnpm) to create executable scripts on Windows,
since symlinks are not suitable for this purpose there.

On Unix systems, you should use a symbolic link instead.

## Installation

```sh
npm install --save @zkochan/cmd-shim
```

## API

### `cmdShim(src, to, opts?): Promise<void>`

Create a cmd shim at `to` for the command line program at `from`.
e.g.

```javascript
const cmdShim = require('@zkochan/cmd-shim')
cmdShim(__dirname + '/cli.js', '/usr/bin/command-name')
  .catch(err => console.error(err))
```

### `cmdShim.ifExists(src, to, opts?): Promise<void>`

The same as above, but will just continue if the file does not exist.

#### Arguments:

- `opts.preserveSymlinks` - _Boolean_ - if true, `--preserve-symlinks` is added to the options passed to NodeJS.
- `opts.nodePath` - _String_ - sets the [NODE_PATH](https://nodejs.org/api/cli.html#cli_node_path_path) env variable.
- `opts.createCmdFile` - _Boolean_ - is `true` on Windows by default. If true, creates a cmd file.
- `opts.createPwshFile` - _Boolean_ - is `true` by default. If true, creates a powershell file.

```javascript
const cmdShim = require('@zkochan/cmd-shim')
cmdShim(__dirname + '/cli.js', '/usr/bin/command-name', { preserveSymlinks: true })
  .catch(err => console.error(err))
```

## License

[BSD-2-Clause](./LICENSE) © [Zoltan Kochan](http://kochan.io)
