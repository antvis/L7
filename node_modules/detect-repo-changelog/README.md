# detect-repo-changelog

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[npm-url]:https://npmjs.org/package/detect-repo-changelog
[downloads-image]:http://img.shields.io/npm/dm/detect-repo-changelog.svg
[npm-image]:http://img.shields.io/npm/v/detect-repo-changelog.svg
[travis-url]:https://travis-ci.org/IndigoUnited/node-detect-repo-changelog
[travis-image]:http://img.shields.io/travis/IndigoUnited/node-detect-repo-changelog/master.svg
[coveralls-url]:https://coveralls.io/r/IndigoUnited/node-detect-repo-changelog
[coveralls-image]:https://img.shields.io/coveralls/IndigoUnited/node-detect-repo-changelog/master.svg
[david-dm-url]:https://david-dm.org/IndigoUnited/node-detect-repo-changelog
[david-dm-image]:https://img.shields.io/david/IndigoUnited/node-detect-repo-changelog.svg
[david-dm-dev-url]:https://david-dm.org/IndigoUnited/node-detect-repo-changelog#info=devDependencies
[david-dm-dev-image]:https://img.shields.io/david/dev/IndigoUnited/node-detect-repo-changelog.svg

Scans a repository directory, searching for a changelog file.

Uses [changelog-filename-regex](https://github.com/shinnn/changelog-filename-regex) to match against a variety of changelog filenames.


## Installation

`$ npm install detect-repo-changelog`


## Usage

`detectRepoChangelog(dir) -> Promise`

```js
const detectRepoChangelog = require('detect-repo-changelog');

detectRepoChangelog('./some-repository-directory')
.then((changelogFile) => {
    if (changelogFile) {
        console.log(`changelog file is ${changelogFile}`);
    } else {
        console.log('no changelog detected');
    }
});
```


## Tests

`$ npm test`   
`$ npm test-cov` to get coverage report


## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
