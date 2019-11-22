module.exports = function (mimetypesFile) {
    'use strict';

    var fs     = require('fs'),
        obj    = {},
        config = null,
        mime   = null;

    fs.readFileSync(mimetypesFile, 'utf-8')
        .split('\n')
        .filter(function (line) {
            return (!line.match(/^#/));
        }).forEach(function (line) {
            config = line.replace(/\t+|\t+$/g, ' ').split(' ');
            mime = config.shift();

            config.forEach(function (extension) {
                obj[extension] = mime;
            });
        });

    return obj;
};
