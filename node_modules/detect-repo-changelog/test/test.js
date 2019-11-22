'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const hasChangelog = require('../');

const tmpDir = `${__dirname}/tmp`;

beforeEach(() => mkdirp.sync(tmpDir));
afterEach(() => rimraf.sync(tmpDir));

it('should detect changelog file', () => {
    fs.writeFileSync(`${tmpDir}/CHANGELOG.md`);

    return hasChangelog(tmpDir)
    .then((changelogFile) => expect(changelogFile).to.equal(`${tmpDir}/CHANGELOG.md`));
});

it('should return null if no changelog file is present', () => {
    return hasChangelog(tmpDir)
    .then((changelogFile) => expect(changelogFile).to.equal(null));
});

it('should return null if changelog file is actually a directory', () => {
    fs.mkdirSync(`${tmpDir}/CHANGELOG.md`);

    return hasChangelog(tmpDir)
    .then((changelogFile) => expect(changelogFile).to.equal(null));
});
