<a name="eslint-plugin-jsdoc"></a>
# eslint-plugin-jsdoc

[![GitSpo Mentions](https://gitspo.com/badges/mentions/gajus/eslint-plugin-jsdoc?style=flat-square)](https://gitspo.com/mentions/gajus/eslint-plugin-jsdoc)
[![NPM version](http://img.shields.io/npm/v/eslint-plugin-jsdoc.svg?style=flat-square)](https://www.npmjs.org/package/eslint-plugin-jsdoc)
[![Travis build status](http://img.shields.io/travis/gajus/eslint-plugin-jsdoc/master.svg?style=flat-square)](https://travis-ci.org/gajus/eslint-plugin-jsdoc)
[![js-canonical-style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)

JSDoc linting rules for ESLint.

* [eslint-plugin-jsdoc](#eslint-plugin-jsdoc)
    * [Reference to jscs-jsdoc](#eslint-plugin-jsdoc-reference-to-jscs-jsdoc)
    * [Installation](#eslint-plugin-jsdoc-installation)
    * [Configuration](#eslint-plugin-jsdoc-configuration)
    * [Settings](#eslint-plugin-jsdoc-settings)
        * [Alias Preference](#eslint-plugin-jsdoc-settings-alias-preference)
        * [Additional Tag Names](#eslint-plugin-jsdoc-settings-additional-tag-names)
        * [Allow `@override` Without Accompanying `@param` Tags](#eslint-plugin-jsdoc-settings-allow-override-without-accompanying-param-tags)
        * [Settings to Configure `check-examples`](#eslint-plugin-jsdoc-settings-settings-to-configure-check-examples)
    * [Rules](#eslint-plugin-jsdoc-rules)
        * [`check-alignment`](#eslint-plugin-jsdoc-rules-check-alignment)
        * [`check-examples`](#eslint-plugin-jsdoc-rules-check-examples)
        * [`check-indentation`](#eslint-plugin-jsdoc-rules-check-indentation)
        * [`check-param-names`](#eslint-plugin-jsdoc-rules-check-param-names)
        * [`check-syntax`](#eslint-plugin-jsdoc-rules-check-syntax)
        * [`check-tag-names`](#eslint-plugin-jsdoc-rules-check-tag-names)
        * [`check-types`](#eslint-plugin-jsdoc-rules-check-types)
        * [`newline-after-description`](#eslint-plugin-jsdoc-rules-newline-after-description)
        * [`no-undefined-types`](#eslint-plugin-jsdoc-rules-no-undefined-types)
        * [`require-description-complete-sentence`](#eslint-plugin-jsdoc-rules-require-description-complete-sentence)
        * [`require-description`](#eslint-plugin-jsdoc-rules-require-description)
        * [`require-example`](#eslint-plugin-jsdoc-rules-require-example)
        * [`require-hyphen-before-param-description`](#eslint-plugin-jsdoc-rules-require-hyphen-before-param-description)
        * [`require-param-description`](#eslint-plugin-jsdoc-rules-require-param-description)
        * [`require-param-name`](#eslint-plugin-jsdoc-rules-require-param-name)
        * [`require-param-type`](#eslint-plugin-jsdoc-rules-require-param-type)
        * [`require-param`](#eslint-plugin-jsdoc-rules-require-param)
        * [`require-returns-description`](#eslint-plugin-jsdoc-rules-require-returns-description)
        * [`require-returns-type`](#eslint-plugin-jsdoc-rules-require-returns-type)
        * [`require-returns-check`](#eslint-plugin-jsdoc-rules-require-returns-check)
        * [`require-returns`](#eslint-plugin-jsdoc-rules-require-returns)
        * [`valid-types`](#eslint-plugin-jsdoc-rules-valid-types)


<a name="eslint-plugin-jsdoc-reference-to-jscs-jsdoc"></a>
### Reference to jscs-jsdoc

This table maps the rules between `eslint-plugin-jsdoc` and `jscs-jsdoc`.

| `eslint-plugin-jsdoc` | `jscs-jsdoc` |
| --- | --- |
| [`check-alignment`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-alignment) | N/A |
| [`check-examples`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-examples) | N/A |
| [`check-indentation`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-indentation) | N/A |
| [`check-param-names`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-param-names) | [`checkParamNames`](https://github.com/jscs-dev/jscs-jsdoc#checkparamnames) |
| [`check-syntax`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-syntax) | N/A |
| [`check-tag-names`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-tag-names) | N/A ~ [`checkAnnotations`](https://github.com/jscs-dev/jscs-jsdoc#checkannotations) |
| [`check-types`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-check-types) | [`checkTypes`](https://github.com/jscs-dev/jscs-jsdoc#checktypes) |
| [`newline-after-description`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-newline-after-description) | [`requireNewlineAfterDescription`](https://github.com/jscs-dev/jscs-jsdoc#requirenewlineafterdescription) and [`disallowNewlineAfterDescription`](https://github.com/jscs-dev/jscs-jsdoc#disallownewlineafterdescription) |
| [`require-description`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-description) | N/A |
| [`require-description-complete-sentence`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-description-complete-sentence) | [`requireDescriptionCompleteSentence`](https://github.com/jscs-dev/jscs-jsdoc#requiredescriptioncompletesentence) |
| [`require-example`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-example) | N/A |
| [`require-hyphen-before-param-description`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-hyphen-before-param-description) | [`requireHyphenBeforeDescription`](https://github.com/jscs-dev/jscs-jsdoc#requirehyphenbeforedescription) |
| [`require-param`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-param) | [`checkParamExistence`](https://github.com/jscs-dev/jscs-jsdoc#checkparamexistence) |
| [`require-param-description`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-param-description) | [`requireParamDescription`](https://github.com/jscs-dev/jscs-jsdoc#requireparamdescription) |
| [`require-param-name`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-param-name) | N/A |
| [`require-param-type`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-param-type) | [`requireParamTypes`](https://github.com/jscs-dev/jscs-jsdoc#requireparamtypes) |
| [`require-returns`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-returns) | [`requireReturn`](https://github.com/jscs-dev/jscs-jsdoc#requirereturn) |
| [`require-returns-check`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-returns-check) | [`requireReturn`](https://github.com/jscs-dev/jscs-jsdoc#requirereturncheck) |
| [`require-returns-description`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-returns-description) | [`requireReturnDescription`](https://github.com/jscs-dev/jscs-jsdoc#requirereturndescription) |
| [`require-returns-type`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-returns-type) | [`requireReturnTypes`](https://github.com/jscs-dev/jscs-jsdoc#requirereturntypes) |
| [`valid-types`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-valid-types) | N/A |
| [`no-undefined-types`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-no-undefined-types) | N/A |
| N/A | [`checkReturnTypes`](https://github.com/jscs-dev/jscs-jsdoc#checkreturntypes) |
| N/A | [`checkRedundantParams`](https://github.com/jscs-dev/jscs-jsdoc#checkredundantparams) |
| N/A | [`checkReturnTypes`](https://github.com/jscs-dev/jscs-jsdoc#checkreturntypes) |
| N/A | [`checkRedundantAccess`](https://github.com/jscs-dev/jscs-jsdoc#checkredundantaccess) |
| N/A | [`enforceExistence`](https://github.com/jscs-dev/jscs-jsdoc#enforceexistence) |
| N/A | [`leadingUnderscoreAccess`](https://github.com/jscs-dev/jscs-jsdoc#leadingunderscoreaccess) |

<a name="eslint-plugin-jsdoc-installation"></a>
## Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally.

```sh
npm install eslint
```

If you have installed `ESLint` globally, you have to install JSDoc plugin globally too. Otherwise, install it locally.

```sh
npm install eslint-plugin-jsdoc
```

<a name="eslint-plugin-jsdoc-configuration"></a>
## Configuration

Add `plugins` section and specify `eslint-plugin-jsdoc` as a plugin.

```json
{
    "plugins": [
        "jsdoc"
    ]
}
```

Finally, enable all of the rules that you would like to use.

```json
{
    "rules": {
        "jsdoc/check-alignment": 1,
        "jsdoc/check-examples": 1,
        "jsdoc/check-indentation": 1,
        "jsdoc/check-param-names": 1,
        "jsdoc/check-syntax": 1,
        "jsdoc/check-tag-names": 1,
        "jsdoc/check-types": 1,
        "jsdoc/newline-after-description": 1,
        "jsdoc/no-undefined-types": 1,
        "jsdoc/require-description": 1,
        "jsdoc/require-description-complete-sentence": 1,
        "jsdoc/require-example": 1,
        "jsdoc/require-hyphen-before-param-description": 1,
        "jsdoc/require-param": 1,
        "jsdoc/require-param-description": 1,
        "jsdoc/require-param-name": 1,
        "jsdoc/require-param-type": 1,
        "jsdoc/require-returns": 1,
        "jsdoc/require-returns-check": 1,
        "jsdoc/require-returns-description": 1,
        "jsdoc/require-returns-type": 1,
        "jsdoc/valid-types": 1
    }
}
```

<a name="eslint-plugin-jsdoc-settings"></a>
## Settings

<a name="eslint-plugin-jsdoc-settings-alias-preference"></a>
### Alias Preference

Use `settings.jsdoc.tagNamePreference` to configure a preferred alias name for a JSDoc tag. The format of the configuration is: `<primary tag name>: <preferred alias name>`, e.g.

```json
{
    "rules": {},
    "settings": {
        "jsdoc": {
            "tagNamePreference": {
                "param": "arg",
                "returns": "return"
            }
        }
    }
}
```

<a name="eslint-plugin-jsdoc-settings-additional-tag-names"></a>
### Additional Tag Names

Use `settings.jsdoc.additionalTagNames` to configure additional, allowed JSDoc tags. The format of the configuration is as follows:

```json
{
    "rules": {},
    "settings": {
        "jsdoc": {
            "additionalTagNames": {
                "customTags": ["define", "extends", "record"]
            }
        }
    }
}
```

<a name="eslint-plugin-jsdoc-settings-allow-override-without-accompanying-param-tags"></a>
### Allow <code>@override</code> Without Accompanying <code>@param</code> Tags

Use any of the following settings to override `require-param` and allow
`@param` to be omitted when the specified tags are present on the JSDoc
comment or the parent class comment. The default value for each is `false`.

* `settings.jsdoc.allowOverrideWithoutParam` - Enables behavior with
  `@override` tag
* `settings.jsdoc.allowImplementsWithoutParam` - Enables behavior with
  `@implements` tag
* `settings.jsdoc.allowAugmentsExtendsWithoutParam` - Enables behavior with
  `@augments` tag or its synonym `@extends`

The format of the configuration is as follows:

```json
{
    "rules": {},
    "settings": {
        "jsdoc": {
            "allowOverrideWithoutParam": true,
            "allowImplementsWithoutParam": true,
            "allowAugmentsExtendsWithoutParam": true
        }
    }
}
```

<a name="eslint-plugin-jsdoc-settings-settings-to-configure-check-examples"></a>
### Settings to Configure <code>check-examples</code>

The settings below all impact the `check-examples` rule and default to
no-op/false except as noted.

JSDoc specs use of an optional `<caption>` element at the beginning of
`@example`. The following setting requires its use.

* `settings.jsdoc.captionRequired` - Require `<caption>` at beginning
  of any `@example`

JSDoc does not specify a formal means for delimiting code blocks within
`@example` (it uses generic syntax highlighting techniques for its own
syntax highlighting). The following settings determine whether a given
`@example` tag will have the `check-examples` checks applied to it:

* `settings.jsdoc.exampleCodeRegex` - Regex which whitelists lintable
  examples. If a parenthetical group is used, the first one will be used,
  so you may wish to use `(?:...)` groups where you do not wish the
  first such group treated as one to include. If no parenthetical group
  exists or matches, the whole matching expression will be used.
  An example might be ````"^```(?:js|javascript)([\\s\\S]*)```$"````
  to only match explicitly fenced JavaScript blocks.
* `settings.jsdoc.rejectExampleCodeRegex` - Regex blacklist which rejects
  non-lintable examples (has priority over `exampleCodeRegex`). An example
  might be ```"^`"``` to avoid linting fenced blocks which may indicate
  a non-JavaScript language.

If neither is in use, all examples will be matched. Note also that even if
`settings.jsdoc.captionRequired` is not set, any initial `<caption>`
will be stripped out before doing the regex matching.

The following settings determine which individual ESLint rules will be
applied to the JavaScript found within the `@example` tags (as determined
to be applicable by the above regex settings). They are ordered by
decreasing precedence:

* `settings.jsdoc.allowInlineConfig` - If not set to `false`, will allow
  inline config within the `@example` to override other config. Defaults
  to `true`.
* `settings.jsdoc.noDefaultExampleRules` - Setting to `true` will disable the
  default rules which are expected to be troublesome for most documentation
  use. See the section below for the specific default rules.
* `settings.jsdoc.matchingFileName` - Setting for a dummy file name to trigger
  specific rules defined in one's config; usable with ESLint `.eslintrc.*`
  `overrides` -> `files` globs, to apply a desired subset of rules with
  `@example` (besides allowing for rules specific to examples, this setting
  can be useful for enabling reuse of the same rules within `@example` as
  with JavaScript Markdown lintable by
  [other plugins](https://github.com/eslint/eslint-plugin-markdown), e.g.,
  if one sets `matchingFileName` to `dummy.md` so that `@example` rules will
  follow one's Markdown rules).
* `settings.jsdoc.configFile` - A config file. Corresponds to ESLint's `-c`.
* `settings.jsdoc.eslintrcForExamples` - Defaults to `true` in adding rules
  based on an `.eslintrc.*` file. Setting to `false` corresponds to
  ESLint's `--no-eslintrc`.
* `settings.jsdoc.baseConfig` - An object of rules with the same schema
  as `.eslintrc.*` for defaults

Finally, the following rule pertains to inline disable directives:

- `settings.jsdoc.reportUnusedDisableDirectives` - If not set to `false`,
  this will report disabled directives which are not used (and thus not
  needed). Defaults to `true`. Corresponds to ESLint's
  `--report-unused-disable-directives`.

<a name="eslint-plugin-jsdoc-settings-settings-to-configure-check-examples-rules-disabled-by-default-unless-nodefaultexamplerules-is-set-to-true"></a>
#### Rules Disabled by Default Unless <code>noDefaultExampleRules</code> is Set to <code>true</code>

* `eol-last` - Insisting that a newline "always" be at the end is less likely
  to be desired in sample code as with the code file convention
* `no-console` - Unlikely to have inadvertent temporary debugging within
  examples
* `no-undef` - Many variables in examples will be `undefined`.
* `no-unused-vars` - It is common to define variables for clarity without always
  using them within examples.
* `padded-blocks` - It can generally look nicer to pad a little even if one's
  code follows more stringency as far as block padding.
* `import/no-unresolved` - One wouldn't generally expect example paths to
  resolve relative to the current JavaScript file as one would with real code.
* `import/unambiguous` - Snippets in examples are likely too short to always
  include full import/export info
* `node/no-missing-import` - See `import/no-unresolved`
* `node/no-missing-require` -  See `import/no-unresolved`

<a name="eslint-plugin-jsdoc-rules"></a>
## Rules

<a name="eslint-plugin-jsdoc-rules-check-alignment"></a>
### <code>check-alignment</code>

Reports invalid alignment of JSDoc block asterisks.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|N/A|

The following patterns are considered problems:

````js
/**
  * @param {Number} foo
 */
function quux (foo) {

}
// Message: Expected JSDoc block to be aligned.

/**
 * @param {Number} foo
  */
function quux (foo) {

}
// Message: Expected JSDoc block to be aligned.

/**
 * @param {Number} foo
 */
function quux (foo) {

}
// Message: Expected JSDoc block to be aligned.

/**
  * @param {Number} foo
 */
function quux (foo) {

}
// Message: Expected JSDoc block to be aligned.

/**
 * @param {Number} foo
 */
function quux (foo) {

}
// Message: Expected JSDoc block to be aligned.
````

The following patterns are not considered problems:

````js
/**
 * Desc
 *
 * @param {Number} foo
 */
function quux (foo) {

}

/**
 * Desc
 *
 * @param {{
  foo: Bar,
  bar: Baz
 * }} foo
 *
 */
function quux (foo) {

}
````


<a name="eslint-plugin-jsdoc-rules-check-examples"></a>
### <code>check-examples</code>

Ensures that (JavaScript) examples within JSDoc adhere to ESLint rules.

Works in conjunction with the following settings:

* `captionRequired`
* `exampleCodeRegex`
* `rejectExampleCodeRegex`
* `allowInlineConfig` - Defaults to `true`
* `noDefaultExampleRules`
* `matchingFileName`
* `configFile`
* `eslintrcForExamples` - Defaults to `true`
* `baseConfig`
* `reportUnusedDisableDirectives` - Defaults to `true`

Inline ESLint config within `@example` JavaScript is allowed, though the
disabling of ESLint directives which are not needed by the resolved rules
will be reported as with the ESLint `--report-unused-disable-directives`
command.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`param`|

The following patterns are considered problems:

````js
/**
 * @example alert('hello')
 */
function quux () {

}
// Settings: {"jsdoc":{"baseConfig":{"rules":{"no-alert":2,"semi":["error","always"]}},"eslintrcForExamples":false}}
// Message: @example error (no-alert): Unexpected alert.

/**
 * @example ```js
 alert('hello');
 ```
 */
function quux () {

}
// Settings: {"jsdoc":{"baseConfig":{"rules":{"semi":["error","never"]}},"eslintrcForExamples":false,"exampleCodeRegex":"```js([\\s\\S]*)```"}}
// Message: @example error (semi): Extra semicolon.

/**
 * @example
 * ```js alert('hello'); ```
 */
function quux () {

}
// Settings: {"jsdoc":{"baseConfig":{"rules":{"semi":["error","never"]}},"eslintrcForExamples":false,"exampleCodeRegex":"```js ([\\s\\S]*)```"}}
// Message: @example error (semi): Extra semicolon.

/**
 * @example ```
 * js alert('hello'); ```
 */
function quux () {

}
// Settings: {"jsdoc":{"baseConfig":{"rules":{"semi":["error","never"]}},"eslintrcForExamples":false,"exampleCodeRegex":"```\njs ([\\s\\S]*)```"}}
// Message: @example error (semi): Extra semicolon.

/**
 * @example <b>Not JavaScript</b>
 */
function quux () {

}
/**
 * @example quux2();
 */
function quux2 () {

}
// Settings: {"jsdoc":{"baseConfig":{"rules":{"semi":["error","never"]}},"eslintrcForExamples":false,"rejectExampleCodeRegex":"^\\s*<.*>$"}}
// Message: @example error (semi): Extra semicolon.

/**
 * @example
 * quux(); // does something useful
 */
function quux () {

}
// Settings: {"jsdoc":{"baseConfig":{"rules":{"no-undef":["error"]}},"eslintrcForExamples":false,"noDefaultExampleRules":true}}
// Message: @example error (no-undef): 'quux' is not defined.

/**
 * @example <caption>Valid usage</caption>
 * quux(); // does something useful
 *
 * @example
 * quux('random unwanted arg'); // results in an error
 */
function quux () {

}
// Settings: {"jsdoc":{"captionRequired":true,"eslintrcForExamples":false}}
// Message: Caption is expected for examples.

/**
 * @example  quux();
 */
function quux () {

}
// Settings: {"jsdoc":{"baseConfig":{"rules":{"indent":["error"]}},"eslintrcForExamples":false,"noDefaultExampleRules":false}}
// Message: @example error (indent): Expected indentation of 0 spaces but found 1.

/**
 * @example test() // eslint-disable-line semi
 */
function quux () {}
// Settings: {"jsdoc":{"eslintrcForExamples":false,"noDefaultExampleRules":true,"reportUnusedDisableDirectives":true}}
// Message: @example error: Unused eslint-disable directive (no problems were reported from 'semi').

/**
 * @example
 test() // eslint-disable-line semi
 */
function quux () {}
// Settings: {"jsdoc":{"allowInlineConfig":false,"baseConfig":{"rules":{"semi":["error","always"]}},"eslintrcForExamples":false,"noDefaultExampleRules":true}}
// Message: @example error (semi): Missing semicolon.
````

The following patterns are not considered problems:

````js
/**
 * @example ```js
 alert('hello');
 ```
 */
function quux () {

}
// Settings: {"jsdoc":{"baseConfig":{"rules":{"semi":["error","always"]}},"eslintrcForExamples":false,"exampleCodeRegex":"```js([\\s\\S]*)```"}}

/**
 * @example
 * // arbitrary example content
 */
function quux () {

}
// Settings: {"jsdoc":{"eslintrcForExamples":false}}

/**
 * @example
 * quux(); // does something useful
 */
function quux () {

}
// Settings: {"jsdoc":{"baseConfig":{"rules":{"no-undef":["error"]}},"eslintrcForExamples":false,"noDefaultExampleRules":false}}

/**
 * @example quux();
 */
function quux () {

}
// Settings: {"jsdoc":{"baseConfig":{"rules":{"indent":["error"]}},"eslintrcForExamples":false,"noDefaultExampleRules":false}}

/**
 * @example <caption>Valid usage</caption>
 * quux(); // does something useful
 *
 * @example <caption>Invalid usage</caption>
 * quux('random unwanted arg'); // results in an error
 */
function quux () {

}
// Settings: {"jsdoc":{"captionRequired":true,"eslintrcForExamples":false}}

/**
 * @example test() // eslint-disable-line semi
 */
function quux () {}
// Settings: {"jsdoc":{"eslintrcForExamples":false,"noDefaultExampleRules":true,"reportUnusedDisableDirectives":false}}

/**
 * @example
 test() // eslint-disable-line semi
 */
function quux () {}
// Settings: {"jsdoc":{"allowInlineConfig":true,"baseConfig":{"rules":{"semi":["error","always"]}},"eslintrcForExamples":false,"noDefaultExampleRules":true}}
````


<a name="eslint-plugin-jsdoc-rules-check-indentation"></a>
### <code>check-indentation</code>

Reports invalid padding inside JSDoc block.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|N/A|

The following patterns are considered problems:

````js
/**
 * foo
 *
 * @param bar
 *  baz
 */
function quux () {

}
// Message: There must be no indentation.
````

The following patterns are not considered problems:

````js
/**
 * foo
 *
 * @param bar
 * baz
 */
function quux () {

}
````


<a name="eslint-plugin-jsdoc-rules-check-param-names"></a>
### <code>check-param-names</code>

Ensures that parameter names in JSDoc match those in the function declaration.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`param`|

The following patterns are considered problems:

````js
/**
 * @param Foo
 */
function quux (foo = 'FOO') {

}
// Message: Expected @param names to be "foo". Got "Foo".

/**
 * @arg Foo
 */
function quux (foo = 'FOO') {

}
// Settings: {"jsdoc":{"tagNamePreference":{"param":"arg"}}}
// Message: Expected @arg names to be "foo". Got "Foo".

/**
 * @param Foo
 */
function quux (foo) {

}
// Message: Expected @param names to be "foo". Got "Foo".

/**
 * @param Foo.Bar
 */
function quux (foo) {

}
// Message: @param path declaration ("Foo.Bar") appears before any real parameter.

/**
 * @param foo
 * @param Foo.Bar
 */
function quux (foo) {

}
// Message: @param path declaration ("Foo.Bar") root node name ("Foo") does not match previous real parameter name ("foo").

/**
 * @param foo
 * @param foo.bar
 * @param bar
 */
function quux (bar, foo) {

}
// Message: Expected @param names to be "bar, foo". Got "foo, bar".

/**
 * @param foo
 * @param bar
 */
function quux (foo) {

}
// Message: @param "bar" does not match an existing function parameter.
````

The following patterns are not considered problems:

````js
/**
 *
 */
function quux (foo) {

}

/**
 * @param foo
 */
function quux (foo) {

}

/**
 * @param foo
 * @param bar
 */
function quux (foo, bar) {

}

/**
 * @param foo
 * @param bar
 */
function quux (foo, bar, baz) {

}

/**
 * @param foo
 * @param foo.foo
 * @param bar
 */
function quux (foo, bar) {

}

/**
 * @param args
 */
function quux (...args) {

}

/**
 * @param foo
 */
function quux ({a, b}) {

}

/**
 * @param foo
 */
function quux ({a, b} = {}) {

}

/**
 * @param foo
 */
function quux ([a, b] = []) {

}

/**
 * Assign the project to a list of employees.
 * @param {Object[]} employees - The employees who are responsible for the project.
 * @param {string} employees[].name - The name of an employee.
 * @param {string} employees[].department - The employee's department.
 */
function assign (employees) {

};
````


<a name="eslint-plugin-jsdoc-rules-check-param-names-deconstructing-function-parameter"></a>
#### Deconstructing Function Parameter

`eslint-plugin-jsdoc` does not validate names of parameters in function deconstruction, e.g.

```js
/**
 * @param foo
 */
function quux ({
    a,
    b
}) {

}
```

`{a, b}` is an [`ObjectPattern`](https://github.com/estree/estree/blob/master/es2015.md#objectpattern) AST type and does not have a name. Therefore, the associated parameter in JSDoc block can have any name.

Likewise for the pattern `[a, b]` which is an [`ArrayPattern`](https://github.com/estree/estree/blob/master/es2015.md#arraypattern).

<a name="eslint-plugin-jsdoc-rules-check-syntax"></a>
### <code>check-syntax</code>

Reports against Google Closure Compiler syntax.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|N/A|

The following patterns are considered problems:

````js
/**
 * @param {string=} foo
 */
function quux (foo) {

}
// Message: Syntax should not be Google Closure Compiler style.
````

The following patterns are not considered problems:

````js
/**
 * @param {string} [foo]
 */
function quux (foo) {

}

/**
 *
 */
function quux (foo) {

}
````


<a name="eslint-plugin-jsdoc-rules-check-tag-names"></a>
### <code>check-tag-names</code>

Reports invalid block tag names.

Valid [JSDoc 3 Block Tags](http://usejsdoc.org/#block-tags) are:

```
abstract
access
alias
async
augments
author
borrows
callback
class
classdesc
constant
constructs
copyright
default
deprecated
description
enum
event
example
exports
external
file
fires
function
generator
global
hideconstructor
ignore
implements
inheritdoc
inner
instance
interface
kind
lends
license
listens
member
memberof
memberof!
mixes
mixin
module
name
namespace
override
package
param
private
property
protected
public
readonly
requires
returns
see
since
static
summary
this
throws
todo
tutorial
type
typedef
variation
version
yields
```

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|N/A|

The following patterns are considered problems:

````js
/**
 * @Param
 */
function quux () {

}
// Message: Invalid JSDoc tag name "Param".

/**
 * @foo
 */
function quux () {

}
// Message: Invalid JSDoc tag name "foo".

/**
 * @arg foo
 */
function quux (foo) {

}
// Message: Invalid JSDoc tag (preference). Replace "arg" JSDoc tag with "param".

/**
 * @param foo
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"tagNamePreference":{"param":"arg"}}}
// Message: Invalid JSDoc tag (preference). Replace "param" JSDoc tag with "arg".

/**
 * @param foo
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"tagNamePreference":{"param":"parameter"}}}
// Message: Invalid JSDoc tag (preference). Replace "param" JSDoc tag with "parameter".

/**
 * @bar foo
 */
function quux (foo) {

}
// Message: Invalid JSDoc tag name "bar".

/**
 * @baz @bar foo
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"additionalTagNames":{"customTags":["bar"]}}}
// Message: Invalid JSDoc tag name "baz".

/**
 * @bar
 * @baz
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"additionalTagNames":{"customTags":["bar"]}}}
// Message: Invalid JSDoc tag name "baz".
````

The following patterns are not considered problems:

````js
/**
 * @param foo
 */
function quux (foo) {

}

/**
 * @memberof! foo
 */
function quux (foo) {

}

/**
 * @arg foo
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"tagNamePreference":{"param":"arg"}}}

/**
 * @bar foo
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"additionalTagNames":{"customTags":["bar"]}}}

/**
 * @baz @bar foo
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"additionalTagNames":{"customTags":["baz","bar"]}}}

/** 
 * @abstract
 * @access
 * @alias
 * @augments
 * @author
 * @borrows
 * @callback
 * @class
 * @classdesc
 * @constant
 * @constructs
 * @copyright
 * @default
 * @deprecated
 * @description
 * @enum
 * @event
 * @example
 * @exports
 * @external
 * @file
 * @fires
 * @function
 * @global
 * @ignore
 * @implements
 * @inheritdoc
 * @inner
 * @instance
 * @interface
 * @kind
 * @lends
 * @license
 * @listens
 * @member
 * @memberof
 * @memberof!
 * @mixes
 * @mixin
 * @module
 * @name
 * @namespace
 * @override
 * @param
 * @private
 * @property
 * @protected
 * @public
 * @readonly
 * @requires
 * @returns
 * @see
 * @since
 * @static
 * @summary
 * @this
 * @throws
 * @todo
 * @tutorial
 * @type
 * @typedef
 * @variation
 * @version
 */
function quux (foo) {}
````


<a name="eslint-plugin-jsdoc-rules-check-types"></a>
### <code>check-types</code>

Reports invalid types.

Ensures that case of native types is the same as in this list:

```
undefined
null
boolean
number
string
Object
Array
Date
RegExp
```

<a name="eslint-plugin-jsdoc-rules-check-types-why-not-capital-case-everything"></a>
#### Why not capital case everything?

Why are `boolean`, `number` and `string` exempt from starting with a capital letter? Let's take `string` as an example. In Javascript, everything is an object. The string Object has prototypes for string functions such as `.toUpperCase()`.

Fortunately we don't have to write `new String()` everywhere in our code. Javascript will automatically wrap string primitives into string Objects when we're applying a string function to a string primitive. This way the memory footprint is a tiny little bit smaller, and the [GC](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) has less work to do.

So in a sense, there two types of strings in Javascript; `{string}` literals, also called primitives and `{String}` Objects. We use the primitives because it's easier to write and uses less memory. `{String}` and `{string}` are technically both valid, but they are not the same.

```js
new String('lard') // String {0: "l", 1: "a", 2: "r", 3: "d", length: 4}
'lard' // "lard"
new String('lard') === 'lard' // false
```

To make things more confusing, there are also object literals and object Objects. But object literals are still static Objects and object Objects are instantiated Objects. So an object primitive is still an object Object.

Basically, for primitives, we want to define the type as a primitive, because that's what we use in 99.9% of cases. For everything else, we use the type rather than the primitive. Otherwise it would all just be `{object}`.

In short: It's not about consistency, rather about the 99.9% use case.

type name | `typeof` | check-types | testcase
--|--|--|--
**Object** | object | **Object** | `({}) instanceof Object` -> `true`
**Array** | object | **Array** | `([]) instanceof Array` -> `true`
**Date** | object | **Date** | `(new Date()) instanceof Date` -> `true`
**RegExp** | object | **RegExp** | `(new RegExp(/.+/)) instanceof RegExp` -> `true`
Boolean | **boolean** | **boolean** | `(true) instanceof Boolean` -> **`false`**
Number | **number** | **number** | `(41) instanceof Number` -> **`false`**
String | **string** | **string** | `("test") instanceof String` -> **`false`**

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`class`, `constant`, `enum`, `member`, `module`, `namespace`, `param`, `property`, `returns`, `throws`, `type`, `typedef`|

The following patterns are considered problems:

````js
/**
 * @param {Number} foo
 */
function quux (foo) {

}
// Message: Invalid JSDoc @param "foo" type "Number".

/**
 * @arg {Number} foo
 */
function quux (foo) {

}
// Message: Invalid JSDoc @arg "foo" type "Number".

/**
 * @returns {Number} foo
 * @throws {Number} foo
 */
function quux () {

}
// Message: Invalid JSDoc @returns type "Number".

/**
 * @param {(Number|string|Boolean)=} foo
 */
function quux (foo, bar, baz) {

}
// Message: Invalid JSDoc @param "foo" type "Number".

/**
 * @param {Array<Number|String>} foo
 */
function quux (foo, bar, baz) {

}
// Message: Invalid JSDoc @param "foo" type "Number".
````

The following patterns are not considered problems:

````js
/**
 * @param {number} foo
 * @param {Bar} bar
 * @param {*} baz
 */
function quux (foo, bar, baz) {

}

/**
 * @arg {number} foo
 * @arg {Bar} bar
 * @arg {*} baz
 */
function quux (foo, bar, baz) {

}

/**
 * @param {(number|string|boolean)=} foo
 */
function quux (foo, bar, baz) {

}

/**
 * @param {typeof bar} foo
 */
function qux(foo) {
}

/**
 * @param {import('./foo').bar.baz} foo
 */
function qux(foo) {
}

/**
 * @param {(x: number, y: string) => string} foo
 */
function qux(foo) {
}

/**
 * @param {() => string} foo
 */
function qux(foo) {
}
````


<a name="eslint-plugin-jsdoc-rules-newline-after-description"></a>
### <code>newline-after-description</code>

Enforces a consistent padding of the block description.

This rule takes one argument. If it is `"always"` then a problem is raised when there is a newline after the description. If it is `"never"` then a problem is raised when there is no newline after the description. The default value is `"always"`.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|N/A|

The following patterns are considered problems:

````js
/**
 * Foo.
 *
 * Foo.
 * @foo
 */
function quux () {

}
// Options: ["always"]
// Message: There must be a newline after the description of the JSDoc block.

/**
 * Bar.
 *
 * Bar.
 *
 * @bar
 */
function quux () {

}
// Options: ["never"]
// Message: There must be no newline after the description of the JSDoc block.
````

The following patterns are not considered problems:

````js
/**
 * Foo.
 */
function quux () {

}
// Options: ["always"]

/**
 * Bar.
 */
function quux () {

}
// Options: ["never"]

/**
 * Foo.
 *
 * @foo
 */
function quux () {

}
// Options: ["always"]

/**
 * Bar.
 * @bar
 */
function quux () {

}
// Options: ["never"]
````


<a name="eslint-plugin-jsdoc-rules-no-undefined-types"></a>
### <code>no-undefined-types</code>

Checks that types in jsdoc comments are defined. This can be used to check unimported types.

When enabling this rule, types in jsdoc comments will resolve as used variables, i.e. will not be marked as unused by `no-unused-vars`.


|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`param`, `returns`|

The following patterns are considered problems:

````js
/**
 * @param {strnig} foo - Bar.
 */
function quux(foo) {

}
// Message: The type 'strnig' is undefined.
````

The following patterns are not considered problems:

````js
/**
 * @param {string} foo - Bar.
 */
function quux(foo) {

}

class MyClass {}

/**
 * @param {MyClass} foo - Bar.
 */
function quux(foo) {
  console.log(foo);
}

quux(0);

const MyType = require('my-library').MyType;

/**
 * @param {MyType} foo - Bar.
 */
  function quux(foo) {

}

import {MyType} from 'my-library';

/**
 * @param {MyType} foo - Bar.
 * @param {Object<string, number>} foo
 * @param {Array<string>} baz
 */
  function quux(foo, bar, baz) {

}

/*global MyType*/

/**
 * @param {MyType} foo - Bar.
 * @param {HisType} bar - Foo.
 */
  function quux(foo, bar) {

}

/**
 * @typedef {Object} hello
 * @property {string} a - a.
 */

/**
 * @param {hello} foo
 */
function quux(foo) {

}

/**
 * @param {Array<syntaxError} foo
 */
function quux(foo) {

}

/**
 * Callback test.
 *
 * @callback addStuffCallback
 * @param {String} sum - An test integer.
 */
/**
 * Test Eslint.
 *
 * @param {addStuffCallback} callback - A callback to run.
 */
function testFunction(callback) {
  callback();
}
````


<a name="eslint-plugin-jsdoc-rules-require-description-complete-sentence"></a>
### <code>require-description-complete-sentence</code>

Requires that block description and tag description are written in complete sentences, i.e.,

* Description must start with an uppercase alphabetical character.
* Paragraphs must start with an uppercase alphabetical character.
* Sentences must end with a period.
* Every line in a paragraph (except the first) which starts with an uppercase character must be preceded by a line ending with a period.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`param`, `returns`|

The following patterns are considered problems:

````js
/**
 * foo.
 */
function quux () {

}
// Message: Sentence should start with an uppercase character.

/**
 * Foo)
 */
function quux () {

}
// Message: Sentence must end with a period.

/**
 * Foo.
 *
 * foo.
 */
function quux () {

}
// Message: Sentence should start with an uppercase character.

/**
 * тест.
 */
function quux () {

}
// Message: Sentence should start with an uppercase character.

/**
 * Foo
 */
function quux () {

}
// Message: Sentence must end with a period.

/**
 * Foo
 * Bar.
 */
function quux () {

}
// Message: A line of text is started with an uppercase character, but preceding line does not end the sentence.

/**
 * Foo.
 *
 * @param foo foo.
 */
function quux (foo) {

}
// Message: Sentence should start with an uppercase character.

/**
 * Foo.
 *
 * @param foo bar
 */
function quux (foo) {

}
// Message: Sentence should start with an uppercase character.

/**
 * {@see Foo.bar} buz
 */
function quux (foo) {

}
// Message: Sentence should start with an uppercase character.

/**
 * Foo.
 *
 * @returns {number} foo
 */
function quux (foo) {

}
// Message: Sentence should start with an uppercase character.

/**
 * Foo.
 *
 * @returns foo.
 */
function quux (foo) {

}
// Message: Sentence should start with an uppercase character.

/**
 * lorem ipsum dolor sit amet, consectetur adipiscing elit. pellentesque elit diam,
 * iaculis eu dignissim sed, ultrices sed nisi. nulla at ligula auctor, consectetur neque sed,
 * tincidunt nibh. vivamus sit amet vulputate ligula. vivamus interdum elementum nisl,
 * vitae rutrum tortor semper ut. morbi porta ante vitae dictum fermentum.
 * proin ut nulla at quam convallis gravida in id elit. sed dolor mauris, blandit quis ante at,
 * consequat auctor magna. duis pharetra purus in porttitor mollis.
 */
function longDescription (foo) {

}
// Message: Sentence should start with an uppercase character.

/**
 * @arg {number} foo - Foo
 */
function quux (foo) {

}
// Message: Sentence must end with a period.

/**
 * @argument {number} foo - Foo
 */
function quux (foo) {

}
// Message: Sentence must end with a period.

/**
 * @return {number} foo
 */
function quux (foo) {

}
// Message: Sentence should start with an uppercase character.

/**
 * Returns bar.
 *
 * @return {number} bar
 */
function quux (foo) {

}
// Message: Sentence should start with an uppercase character.
````

The following patterns are not considered problems:

````js
/**
 * @param foo - Foo.
 */
function quux () {

}

/**
 * Foo.
 */
function quux () {

}

/**
 * Foo.
 * Bar.
 */
function quux () {

}

/**
 * Foo.
 *
 * Bar.
 */
function quux () {

}

/**
 * Тест.
 */
function quux () {

}

/**
 * Foo
 * bar.
 */
function quux () {

}

/**
 * @returns Foo bar.
 */
function quux () {

}

/**
 * Foo. {@see Math.sin}.
 */
function quux () {

}

/**
 * Foo {@see Math.sin} bar.
 */
function quux () {

}

/**
 * Foo?
 *
 * Bar!
 *
 * Baz:
 *   1. Foo.
 *   2. Bar.
 */
function quux () {

}

/**
 * Hello:
 * World.
 */
function quux () {

}

/**
 * Hello: world.
 */
function quux () {

}
````


<a name="eslint-plugin-jsdoc-rules-require-description"></a>
### <code>require-description</code>

Requires that all functions have a description.

* All functions must have a `@description` tag.
* Every description tag must have a non-empty description that explains the purpose of the method.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`class`, `example`|

The following patterns are considered problems:

````js
/**
 *
 */
function quux () {

}
// Message: Missing JSDoc @description declaration.

/**
 * @description
 */
function quux () {

}
// Message: Missing JSDoc @description description.
````

The following patterns are not considered problems:

````js
/**
 * @description
 * // arbitrary description content
 */
function quux () {

}

/**
 * @description
 * quux(); // does something useful
 */
function quux () {

}

/**
 * @description <caption>Valid usage</caption>
 * quux(); // does something useful
 *
 * @description <caption>Invalid usage</caption>
 * quux('random unwanted arg'); // results in an error
 */
function quux () {

}
````


<a name="eslint-plugin-jsdoc-rules-require-example"></a>
### <code>require-example</code>

Requires that all functions have examples.

* All functions must have one or more `@example` tags.
* Every example tag must have a non-empty description that explains the method's usage.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`example`|

The following patterns are considered problems:

````js
/**
 *
 */
function quux () {

}
// Message: Missing JSDoc @example declaration.

/**
 * @example
 */
function quux () {

}
// Message: Missing JSDoc @example description.
````

The following patterns are not considered problems:

````js
/**
 * @example
 * // arbitrary example content
 */
function quux () {

}

/**
 * @example
 * quux(); // does something useful
 */
function quux () {

}

/**
 * @example <caption>Valid usage</caption>
 * quux(); // does something useful
 *
 * @example <caption>Invalid usage</caption>
 * quux('random unwanted arg'); // results in an error
 */
function quux () {

}
````


<a name="eslint-plugin-jsdoc-rules-require-hyphen-before-param-description"></a>
### <code>require-hyphen-before-param-description</code>

Requires a hyphen before the `@param` description.

This rule takes one argument. If it is `"always"` then a problem is raised when there is no hyphen before the description. If it is `"never"` then a problem is raised when there is a hyphen before the description. The default value is `"always"`.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`param`|

The following patterns are considered problems:

````js
/**
 * @param foo Foo.
 */
function quux () {

}
// Options: ["always"]
// Message: There must be a hyphen before @param description.

/**
 * @param foo - Foo.
 */
function quux () {

}
// Options: ["never"]
// Message: There must be no hyphen before @param description.
````

The following patterns are not considered problems:

````js
/**
 * @param foo - Foo.
 */
function quux () {

}
// Options: ["always"]

/**
 * @param foo Foo.
 */
function quux () {

}
// Options: ["never"]
````


<a name="eslint-plugin-jsdoc-rules-require-param-description"></a>
### <code>require-param-description</code>

Requires that `@param` tag has `description` value.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`param`|

The following patterns are considered problems:

````js
/**
 * @param foo
 */
function quux (foo) {

}
// Message: Missing JSDoc @param "foo" description.

/**
 * @arg foo
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"tagNamePreference":{"param":"arg"}}}
// Message: Missing JSDoc @arg "foo" description.
````

The following patterns are not considered problems:

````js
/**
 *
 */
function quux (foo) {

}

/**
 * @param foo Foo.
 */
function quux (foo) {

}
````


<a name="eslint-plugin-jsdoc-rules-require-param-name"></a>
### <code>require-param-name</code>

Requires that all function parameters have name.

> The `@param` tag requires you to specify the name of the parameter you are documenting. You can also include the parameter's type, enclosed in curly brackets, and a description of the parameter.
>
> [JSDoc](http://usejsdoc.org/tags-param.html#overview)

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`param`|

The following patterns are considered problems:

````js
/**
 * @param
 */
function quux (foo) {

}
// Message: There must be an identifier after @param type.

/**
 * @param {string}
 */
function quux (foo) {

}
// Message: There must be an identifier after @param tag.
````

The following patterns are not considered problems:

````js
/**
 * @param foo
 */
function quux (foo) {

}

/**
 * @param {string} foo
 */
function quux (foo) {

}
````


<a name="eslint-plugin-jsdoc-rules-require-param-type"></a>
### <code>require-param-type</code>

Requires that `@param` tag has `type` value.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`param`|

The following patterns are considered problems:

````js
/**
 * @param foo
 */
function quux (foo) {

}
// Message: Missing JSDoc @param "foo" type.

/**
 * @arg foo
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"tagNamePreference":{"param":"arg"}}}
// Message: Missing JSDoc @arg "foo" type.
````

The following patterns are not considered problems:

````js
/**
 *
 */
function quux (foo) {

}

/**
 * @param {number} foo
 */
function quux (foo) {

}
````


<a name="eslint-plugin-jsdoc-rules-require-param"></a>
### <code>require-param</code>

Requires that all function parameters are documented.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`param`|

The following patterns are considered problems:

````js
/**
 *
 */
function quux (foo) {

}
// Message: Missing JSDoc @param "foo" declaration.

/**
 *
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"tagNamePreference":{"param":"arg"}}}
// Message: Missing JSDoc @arg "foo" declaration.

/**
 * @param foo
 */
function quux (foo, bar) {

}
// Message: Missing JSDoc @param "bar" declaration.

/**
 * @override
 */
function quux (foo) {

}
// Message: Missing JSDoc @param "foo" declaration.

/**
 * @implements
 */
function quux (foo) {

}
// Message: Missing JSDoc @param "foo" declaration.

/**
 * @augments
 */
function quux (foo) {

}
// Message: Missing JSDoc @param "foo" declaration.

/**
 * @extends
 */
function quux (foo) {

}
// Message: Missing JSDoc @param "foo" declaration.

/**
 * @override
 */
class A {
  /**
    *
    */
  quux (foo) {

  }
}
// Message: Missing JSDoc @param "foo" declaration.

/**
 * @implements
 */
class A {
  /**
   *
   */
  quux (foo) {

  }
}
// Message: Missing JSDoc @param "foo" declaration.

/**
 * @augments
 */
class A {
  /**
   *
   */
  quux (foo) {

  }
}
// Message: Missing JSDoc @param "foo" declaration.

/**
 * @extends
 */
class A {
  /**
   *
   */
  quux (foo) {

  }
}
// Message: Missing JSDoc @param "foo" declaration.
````

The following patterns are not considered problems:

````js
/**
 * @param foo
 */
function quux (foo) {

}

/**
 * @inheritdoc
 */
function quux (foo) {

}

/**
 * @arg foo
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"tagNamePreference":{"param":"arg"}}}

/**
 * @override
 * @param foo
 */
function quux (foo) {

}

/**
 * @override
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"allowOverrideWithoutParam":true}}

/**
 * @implements
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"allowImplementsWithoutParam":true}}

/**
 * @implements
 * @param foo
 */
function quux (foo) {

}

/**
 * @augments
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"allowAugmentsExtendsWithoutParam":true}}

/**
 * @augments
 * @param foo
 */
function quux (foo) {

}

/**
 * @extends
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"allowAugmentsExtendsWithoutParam":true}}

/**
 * @extends
 * @param foo
 */
function quux (foo) {

}

/**
 * @override
 */
class A {
  /**
  * @param foo
  */
  quux (foo) {

  }
}

/**
 * @override
 */
class A {
  /**
   *
   */
  quux (foo) {

  }
}
// Settings: {"jsdoc":{"allowOverrideWithoutParam":true}}

/**
 * @implements
 */
class A {
  /**
   *
   */
  quux (foo) {

  }
}
// Settings: {"jsdoc":{"allowImplementsWithoutParam":true}}

/**
 * @implements
 */
class A {
  /**
   * @param foo
   */
  quux (foo) {

  }
}

/**
 * @augments
 */
class A {
  /**
   *
   */
  quux (foo) {

  }
}
// Settings: {"jsdoc":{"allowAugmentsExtendsWithoutParam":true}}

/**
 * @augments
 */
class A {
  /**
   * @param foo
   */
  quux (foo) {

  }
}

/**
 * @extends
 */
class A {
  /**
   *
   */
  quux (foo) {

  }
}
// Settings: {"jsdoc":{"allowAugmentsExtendsWithoutParam":true}}

/**
 * @extends
 */
class A {
  /**
   * @param foo
   */
  quux (foo) {

  }
}
````


<a name="eslint-plugin-jsdoc-rules-require-returns-description"></a>
### <code>require-returns-description</code>

Requires that `@returns` tag has `description` value.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`returns`|

The following patterns are considered problems:

````js
/**
 * @returns
 */
function quux (foo) {

}
// Message: Missing JSDoc @returns description.

/**
 * @return
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"tagNamePreference":{"returns":"return"}}}
// Message: Missing JSDoc @return description.
````

The following patterns are not considered problems:

````js
/**
 *
 */
function quux () {

}

/**
 * @returns Foo.
 */
function quux () {

}

/**
 * @returns {undefined}
 */
function quux () {

}

/**
 * @returns {void}
 */
function quux () {

}
````


<a name="eslint-plugin-jsdoc-rules-require-returns-type"></a>
### <code>require-returns-type</code>

Requires that `@returns` tag has `type` value.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`returns`|

The following patterns are considered problems:

````js
/**
 * @returns
 */
function quux () {

}
// Message: Missing JSDoc @returns type.

/**
 * @returns Foo.
 */
function quux () {

}
// Message: Missing JSDoc @returns type.

/**
 * @return Foo.
 */
function quux () {

}
// Settings: {"jsdoc":{"tagNamePreference":{"returns":"return"}}}
// Message: Missing JSDoc @return type.
````

The following patterns are not considered problems:

````js
/**
 * @returns {number}
 */
function quux () {

}
````


<a name="eslint-plugin-jsdoc-rules-require-returns-check"></a>
### <code>require-returns-check</code>

Checks if the return expression exists in function body and in the comment.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`returns`|

The following patterns are considered problems:

````js
/**
 * @returns
 */
function quux (foo) {

}
// Message: Present JSDoc @returns declaration but not available return expression in function.

/**
 * @return
 */
function quux (foo) {

}
// Settings: {"jsdoc":{"tagNamePreference":{"returns":"return"}}}
// Message: Present JSDoc @return declaration but not available return expression in function.

/**
 * @returns
 */
const quux = () => {}
// Message: Present JSDoc @returns declaration but not available return expression in function.

/**
 * @returns {undefined} Foo.
 * @returns {String} Foo.
 */
function quux () {

  return foo;
}
// Message: Found more than one @returns declaration.
````

The following patterns are not considered problems:

````js
/**
 * @returns Foo.
 */
function quux () {

  return foo;
}

/**
 * @returns {void} Foo.
 */
function quux () {

  return foo;
}

/**
 * @returns {undefined} Foo.
 */
function quux () {

  return foo;
}

/**
 *
 */
function quux () {
}

/**
 * @returns {*} Foo.
 */
const quux = () => foo;

/**
 * @returns {undefined} Foo.
 */
function quux () {}

/**
 * @returns { void } Foo.
 */
function quux () {}

/**
 * @returns {Promise<void>}
 */
async function quux() {}

/**
 * @returns {Promise<void>}
 */
async () => {}

/**
 * @returns Foo.
 * @abstract
 */
function quux () {
  throw new Error('must be implemented by subclass!');
}
````


<a name="eslint-plugin-jsdoc-rules-require-returns"></a>
### <code>require-returns</code>

Requires returns are documented.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`returns`|

The following patterns are considered problems:

````js
/**
 *
 */
function quux (foo) {

  return foo;
}
// Message: Missing JSDoc @returns declaration.

/**
 *
 */
const foo = () => ({
  bar: 'baz'
})
// Message: Missing JSDoc @returns declaration.

/**
 *
 */
const foo = bar=>({ bar })
// Message: Missing JSDoc @returns declaration.

/**
 *
 */
const foo = bar => bar.baz()
// Message: Missing JSDoc @returns declaration.

/**
 *
 */
function quux (foo) {

  return foo;
}
// Settings: {"jsdoc":{"tagNamePreference":{"returns":"return"}}}
// Message: Missing JSDoc @return declaration.
````

The following patterns are not considered problems:

````js
/**
 * @returns Foo.
 */
function quux () {

  return foo;
}

/**
 *
 */
function quux () {
}

/**
 *
 */
function quux (bar) {
  bar.filter(baz => {
    return baz.corge();
  })
}

/**
 * @returns Array
 */
function quux (bar) {
  return bar.filter(baz => {
    return baz.corge();
  })
}

/**
 * @returns Array
 */
const quux = (bar) => bar.filter(({ corge }) => corge())

/**
 * @inheritdoc
 */
function quux (foo) {
}

/**
 * @override
 */
function quux (foo) {
}

/**
 * @constructor
 */
function quux (foo) {
}
````


<a name="eslint-plugin-jsdoc-rules-valid-types"></a>
### <code>valid-types</code>

Requires all types to be valid JSDoc or Closure compiler types without syntax errors.

Also impacts behaviors on namepath-pointing or event-pointing tags:

1.  `@alias`, `@augments`, `@extends`, `@lends`, `@memberof`, `@memberof!`, `@mixes`, `@name`, `@this`
1.  `@callback`, `@event`, `@listens`, `@fires`, `@emits`
1.  `@borrows`

The following apply to the above sets:

-   Expect tags in set 1 or 2 to have a valid namepath if present
-   Prevent set 2 from being empty by setting `allowEmptyNamepaths` to `false` as these tags might have some indicative value without a path (but set 1 will always fail if empty)
-   For the special case of set 3, i.e., `@borrows <that namepath> as <this namepath>`, check that both namepaths are present and valid and ensure there is an `as ` between them.

|||
|---|---|
|Context|`ArrowFunctionExpression`, `FunctionDeclaration`, `FunctionExpression`|
|Tags|`param`, `returns`|

The following patterns are considered problems:

````js
/**
 * @param {Array<string} foo
 */
function quux() {

}
// Message: Syntax error in type: Array<string

/**
 * @borrows foo% as bar
 */
function quux() {

}
// Message: Syntax error in type: foo%

/**
 * @borrows foo as bar%
 */
function quux() {

}
// Message: Syntax error in type: bar%

/**
 * @borrows foo
 */
function quux() {

}
// Message: @borrows must have an "as" expression. Found ""

/**
 * @see foo%
 */
function quux() {

}
// Settings: {"jsdoc":{"checkSeesForNamepaths":true}}
// Message: Syntax error in type: foo%

/**
 * @alias module:abc#event:foo-bar
 */
function quux() {

}
// Message: Syntax error in type: module:abc#event:foo-bar

/**
 * @callback
 */
function quux() {

}
// Settings: {"jsdoc":{"allowEmptyNamepaths":false}}
// Message: Syntax error in type: 
````

The following patterns are not considered problems:

````js
/**
 * @param {Array<string>} foo
 */
function quux() {

}

/**
 * @param {string} foo
 */
function quux() {

}

/**
 * @param foo
 */
function quux() {

}

/**
 * @borrows foo as bar
 */
function quux() {

}

/**
 * @see foo%
 */
function quux() {

}

/**
 * @alias module:svgcanvas.SvgCanvas#event:ext_langReady
 */
function quux() {

}

/**
 * @callback
 */
function quux() {

}

/**
 * @see {@link foo}
 */
function quux() {

}
````


