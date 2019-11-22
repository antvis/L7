# cobertura-parse

Parse cobertura results file and return JSON

The output is based on, and intended to be compatible with, https://github.com/davglass/lcov-parse

## Use

```js
var cob = require( "cobertura-parse" );

// parse by file path
cob.parseFile( "filepath.xml", function( err, result ) { ... } );

// or parse file contents
cob.parseContent( "<?xml version="1.0" ?><coverage>...</coverage>",
    function( err, result ) { ... } );
```