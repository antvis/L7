// executed as a child process by babel plugin
// expects .less file path as an argument

const { readFileSync } = require('fs');
const { resolve } = require('path');
const less = require('less');

const file = process.argv[2];

less.render(readFileSync(file, 'utf8'), {
  filename: resolve(file) // needed for relative @import paths in .less files
}).
  then(({ css }) => process.stdout.write(css)).
  catch(err => {
    throw err;
  });
