# rollup-plugin-json changelog

## 4.0.0
*2019-03-18*
* Pass all JSON data through dataToEsm to consistently support "compact" formatting, support empty keys, abandon Node 4 support, add prettier, update dependencies ([#53](https://github.com/rollup/rollup-plugin-json/issues/53))

## 3.1.0
*2018-09-13*
* Expose "compact" and "namedExports" options ([#45](https://github.com/rollup/rollup-plugin-json/issues/45))
* Update rollup-pluginutils to support null values in JSON ([#44](https://github.com/rollup/rollup-plugin-json/issues/44))
* Update dependencies and ensure rollup@1.0 compatibility ([#46](https://github.com/rollup/rollup-plugin-json/issues/46))

## 3.0.0
*2018-05-11*
* No longer create a fake AST to support tree-shaking with upcoming versions of rollup ([#41](https://github.com/rollup/rollup-plugin-json/issues/41))

## 2.3.1
*2018-05-11*
* Update example in readme ([#38](https://github.com/rollup/rollup-plugin-json/issues/38))
* Warn when using this version with upcoming rollup versions

## 2.3.0
*2017-06-03*
* Always parse JSON, so malformed JSON is identified at bundle time ([#27](https://github.com/rollup/rollup-plugin-json/issues/27))

## 2.2.0
*2017-06-03*
* Add `indent` option ([#24](https://github.com/rollup/rollup-plugin-json/issues/24))

## 2.1.1
*2017-04-09*
* Add license to package.json ([#25](https://github.com/rollup/rollup-plugin-json/pull/25))

## 2.1.0
*2016-12-15*
* Add support for `preferConst` option ([#16](https://github.com/rollup/rollup-plugin-json/pull/16))
* Handle JSON files with no valid identifier keys ([#19](https://github.com/rollup/rollup-plugin-json/issues/19))

## 2.0.2
*2016-09-07*
* Generate correct fake AST

## 2.0.1
*2016-06-23*
* Return a `name`

## 2.0.0
*2015-11-05*
* Generate fake AST to avoid unnecessary traversals within Rollup

## 1.1.0
*unpublished*
* Generate named exports alongside default exports

## 1.0.0
*2015-10-25*
* First release
