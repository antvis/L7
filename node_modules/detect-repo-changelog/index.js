'use strict';

const pify = require('pify');
const readdir = pify(require('fs').readdir);
const isRegularFile = require('is-regular-file');
const changelogFilenameRegex = require('changelog-filename-regex');
const find = require('lodash.find');

function hasChangelog(dir) {
    return readdir(dir)
    .then((files) => {
        let changelogFile = find(files, (file) => changelogFilenameRegex.test(file));

        if (!changelogFile) {
            return null;
        }

        changelogFile = `${dir}/${changelogFile}`;

        return isRegularFile(changelogFile)
        .then((is) => is ? changelogFile : null);
    });
}

module.exports = hasChangelog;
