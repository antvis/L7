'use strict';

var fs = require('fs');

fs.readFile('lib/exec.js', 'utf-8', function (err, data) {
    if (err) {
        throw err;
    }

    var jsonData = JSON.stringify(require('./lib/data/parser')('lib/data/mime.types'));

    data = data.replace('* mimer', '* mimer - ' + require('./package.json').version);

    fs.writeFile('dist/mimer.js', data.replace('$_MIMER_DATA_LIST', jsonData));
});
