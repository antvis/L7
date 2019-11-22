#!/usr/bin/env node

var size = require('./');
var helpText = [
  'Usage',
  '  $ window-size',
  '',
  'Example',
  '  $ window-size',
  '  height: 40 ',
  '  width : 145',
  ''
].join('\n');

function showSize() {
  console.log('height: ' + size.height);
  console.log('width : ' + size.width);
}

switch (process.argv[2]) {
  case 'help':
  case '--help':
  case '-h':
    console.log(helpText);
    break;
  default: {
    showSize();
    break;
  }
}
