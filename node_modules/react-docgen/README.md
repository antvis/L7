# react-docgen [![Build Status](https://travis-ci.org/reactjs/react-docgen.svg?branch=master)](https://travis-ci.org/reactjs/react-docgen)

`react-docgen` is a CLI and toolbox to help extracting information from [React][] components, and generate documentation from it.

It uses [recast][] and [@babel/parser][] to parse the source into an AST and provides methods to process this AST to extract the desired information. The output / return value is a JSON blob / JavaScript object.

It provides a default implementation for React components defined via
`React.createClass`, [ES2015 class definitions][classes] or functions
(stateless components). These component definitions must follow certain
guidelines in order to be analyzable (see below for more info).

> react-docgen is a low level tool to extract information about react components. If you are searching for a more high level styleguide with nice interface try [react-styleguidist](https://github.com/styleguidist/react-styleguidist) or any of the other tools listed in the [wiki](https://github.com/reactjs/react-docgen/wiki).

## Install

Install the module with yarn or npm:

```
yarn add react-docgen --dev
```

```
npm install --save-dev react-docgen
```

## CLI

Installing the module adds a `react-docgen` executable which allows you to convert
a single file, multiple files or an input stream. We are trying to make the
executable as versatile as possible so that it can be integrated into many
workflows.

```
Usage: react-docgen [path]... [options]

path     A component file or directory. If no path is provided it reads from stdin.

Options:
   -o FILE, --out FILE   store extracted information in FILE
   --pretty              pretty print JSON
   -x, --extension       File extensions to consider. Repeat to define multiple extensions. Default:  [js,jsx]
   -e, --exclude         Filename pattern to exclude. Default:  []
   -i, --ignore          Folders to ignore. Default:  [node_modules,__tests__,__mocks__]
   --resolver RESOLVER   Resolver name (findAllComponentDefinitions, findExportedComponentDefinition) or
      path to a module that exports a resolver.  [findExportedComponentDefinition]

Extract meta information from React components.
If a directory is passed, it is recursively traversed.
```

By default, `react-docgen` will look for the exported component created through
`React.createClass`, a class definition or a function (stateless component) in
each file. You can change that behavior with the `--resolver` option, which
either expects the name of a built-in resolver or a path to JavaScript module
exporting a resolver function. Have a look below for [more information about
resolvers](#resolver).

Have a look at `example/` for an example of how to use the result to generate a
markdown version of the documentation.

`react-docgen` will look for a babel configuration and use it if available. If no config file is found
it will fallback to a default configuration, enabling all [syntax extension](https://babeljs.io/docs/en/babel-parser#plugins) of the babel-parser.

## API

The tool can be used programmatically to extract component information and customize the extraction process:

```js
var reactDocs = require('react-docgen');
var componentInfo = reactDocs.parse(src);
```

As with the CLI, this will look for the exported component created through `React.createClass` or a class definition in the provided source. The whole process of analyzing the source code is separated into two parts:

- Locating/finding the nodes in the AST which define the component
- Extracting information from those nodes

`parse` accepts more arguments with which this behavior can be customized.

### parse(source \[, resolver \[, handlers \[, options\]\]\])

| Parameter |  Type | Description |
| -------------- | ------ | --------------- |
| source       | string | The source text |
| resolver     | function | A function of the form `(ast: ASTNode, recast: Object) => (NodePath|Array<NodePath>)`. Given an AST and a reference to recast, it returns an (array of) NodePath which represents the component definition. |
| handlers     | Array\<function\> | An array of functions of the form `(documentation: Documentation, definition: NodePath) => void`. Each function is called with a `Documentation` object and a reference to the component definition as returned by `resolver`. Handlers extract relevant information from the definition and augment `documentation`. |
| opt

#### options

##### ∙ filename

Type: `string`

The absolute path to the file associated with the code currently being parsed, if there is one. This is used to search for the correct babel config.

This option is optional, but it is highly recommended to set it when integrating `react-docgen`.

##### ∙ cwd

Type: `string`
Default: `process.cwd()`

The working directory that babel configurations will be searched in.

##### ∙ babelrc, babelrcRoots, root, rootMode, configFile, envName

Type: `boolean`
Default: `true`

These options, will be passed directly to `babel` for locating and resolving a local config or babelrc. To see
documentation for each option consult the [babel website](https://babeljs.io/docs/en/options#config-loading-options).

##### ∙ parserOptions

Type: `BabelParserOptions`

This options will be directly supplied to `@babel/parser`. To see a list of
supported options head over to the [babel website](https://babeljs.io/docs/en/babel-parser#options) and have a look.

#### resolver

The resolver's task is to extract those parts from the source code which the handlers can analyze. For example, the `findExportedComponentDefinition` resolver inspects the AST to find

```js
var Component = React.createClass(<def>);
module.exports = Component;

// or

class Component extends React.Component {
  // ...
}
module.exports = Component;
```

and returns the ObjectExpression to which `<def>` resolves to, or the class declaration itself.

`findAllComponentDefinitions` works similarly, but finds _all_ `React.createClass` calls and class definitions, not only the one that is exported.

This makes it easy, together with the utility methods created to analyze the AST, to introduce new or custom resolver methods. For example, a resolver could look for plain ObjectExpressions with a `render` method.

#### handlers

Handlers do the actual work and extract the desired information from the result the resolver returned. Like the resolver, they try to delegate as much work as possible to the reusable utility functions.

For example, while the `propTypesHandler` expects the prop types definition to be an ObjectExpression and be available as `propTypes` in the component definition, most of the work is actually performed by the `getPropType` utility function.

> There are some community created handlers available. Have a look at the wiki for a list: https://github.com/reactjs/react-docgen/wiki

## Guidelines for default resolvers and handlers

- Modules have to export a single component, and only that component is analyzed.
- When using `React.createClass`, the component definition (the value passed to it) must resolve to an object literal.
- When using classes, the class must either `extend React.Component` _or_ define a `render()` method.
- `propTypes` must be an object literal or resolve to an object literal in the same file.
- The `return` statement in `getDefaultProps` must contain an object literal.

## PropTypes

### Example

For the following component

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * General component description.
 */
class MyComponent extends Component {
  render() {
    // ...
  }
}

MyComponent.propTypes = {
  /**
   * Description of prop "foo".
   */
  foo: PropTypes.number.isRequired,
  /**
   * Description of prop "bar" (a custom validation function).
   */
  bar: function(props, propName, componentName) {
    // ...
  },
  baz: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

MyComponent.defaultProps = {
  bar: 21,
};

export default MyComponent;
```

we are getting this output:

```json
{
  "props": {
    "foo": {
      "type": {
        "name": "number"
      },
      "required": true,
      "description": "Description of prop \"foo\"."
    },
    "bar": {
      "type": {
        "name": "custom"
      },
      "required": false,
      "description": "Description of prop \"bar\" (a custom validation function).",
      "defaultValue": {
        "value": "21",
        "computed": false
      }
    },
    "baz": {
      "type": {
        "name": "union",
        "value": [
          {
            "name": "number"
          },
          {
            "name": "string"
          }
        ]
      },
      "required": false,
      "description": ""
    }
  },
  "description": "General component description."
}
```

## Flow Type support

If you are using [flow][flow] then react-docgen can also extract the flow type annotations. As flow has a way more advanced and fine granular type system, the returned types from react-docgen are different in comparison when using `React.PropTypes`.

> **Note**: react-docgen will not be able to grab the type definition if the type is imported or declared in a different file.

### Example

For the following component

```js
import React, { Component } from 'react';

type Props = {
  /** Description of prop "foo". */
  primitive: number,
  /** Description of prop "bar". */
  literalsAndUnion: 'string' | 'otherstring' | number,
  arr: Array<any>,
  func?: (value: string) => void,
  noParameterName?: string => void,
  obj?: { subvalue: ?boolean },
};

/**
 * General component description.
 */
export default class MyComponent extends Component<void, Props, void> {
  props: Props;

  render(): ?ReactElement {
    // ...
  }
}
```

we are getting this output:

```json
{
  "description": "General component description.",
  "props": {
    "primitive": {
      "flowType": { "name": "number" },
      "required": true,
      "description": "Description of prop \"foo\"."
    },
    "literalsAndUnion": {
      "flowType": {
        "name": "union",
        "raw": "'string' | 'otherstring' | number",
        "elements": [
          { "name": "literal", "value": "'string'" },
          { "name": "literal", "value": "'otherstring'" },
          { "name": "number" }
        ]
      },
      "required": true,
      "description": "Description of prop \"bar\"."
    },
    "arr": {
      "flowType": {
        "name": "Array",
        "elements": [{ "name": "any" }],
        "raw": "Array<any>"
      },
      "required": true
    },
    "func": {
      "flowType": {
        "name": "signature",
        "type": "function",
        "raw": "(value: string) => void",
        "signature": {
          "arguments": [{ "name": "value", "type": { "name": "string" } }],
          "return": { "name": "void" }
        }
      },
      "required": false
    },
    "noParameterName": {
      "flowType": {
        "name": "signature",
        "type": "function",
        "raw": "string => void",
        "signature": {
          "arguments": [{ "name": "", "type": { "name": "string" } }],
          "return": { "name": "void" }
        }
      },
      "required": false
    },
    "obj": {
      "flowType": {
        "name": "signature",
        "type": "object",
        "raw": "{ subvalue: ?boolean }",
        "signature": {
          "properties": [
            {
              "key": "subvalue",
              "value": {
                "name": "boolean",
                "nullable": true,
                "required": true
              }
            }
          ]
        }
      },
      "required": false
    }
  }
}
```

### Types

Here is a list of all the available types and its result structure.

| Name                                      | Examples                                                                                                                                                                | Result                                                                                                                                                                                                                                                             |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Simple                                    | `let x: string;`<br />`let x: number;`<br />`let x: boolean;`<br />`let x: any;`<br />`let x: void;`<br />`let x: Object;`<br />`let x: String;`<br />`let x: MyClass;` | `{ "name": "<type>" }`                                                                                                                                                                                                                                             |
| Literals                                  | `let x: 'foo';`<br />`let x: 1;`<br />`let x: true;`                                                                                                                    | `{ "name": "literal", "value": "<rawvalue>" }`                                                                                                                                                                                                                     |
| Typed Classes                             | `let x: Array<foo>;`<br />`let x: Class<foo>;`<br />`let x: MyClass<bar>;`                                                                                              | `{ "name": "<type>", "elements": [{ <element-type> }, ...] }`                                                                                                                                                                                                      |
| Object Signature                          | `let x: { foo: string, bar?: mixed };`<br />`let x: { [key: string]: string, foo: number };`                                                                            | `{ "name": "signature", "type": "object", "raw": "<raw-signature>", "signature": { "properties": [{ "key": "<property-name>"\|{ <property-key-type> }, "value": { <property-type>, "required": <true/false> } }, ...] } }`                                          |
| Function Signature                        | `let x: (x: string) => void;`                                                                                                                                           | `{ "name": "signature", "type": "function", "raw": "<raw-signature>", "signature": { "arguments": [{ "name": "<argument-name>", "type": { <argument-type> } }, ...], "return": { <return-type> } } }`                                                              |
| Callable-Object/Function-Object Signature | `let x: { (x: string): void, prop: string };`                                                                                                                           | `{ "name": "signature", "type": "object", "raw": "<raw-signature>", "signature": { "properties": [{ "key": "<property-name>"\|{ <property-key-type> }, "value": { <property-type>, "required": <true/false> } }, ...], "constructor": { <function-signature> } } }` |
| Tuple                                     | `let x: [foo, "value", number];`                                                                                                                                        | `{ "name": "tuple", "raw": "<raw-signature>", "elements": [{ <element-type> }, ...] }`                                                                                                                                                                             |
| Union                                     | `let x: number \| string;`                                                                                                                                              | `{ "name": "union", "raw": "<raw-signature>", "elements": [{ <element-type> }, ...] }`                                                                                                                                                                             |
| Intersect                                 | `let x: number & string;`                                                                                                                                               | `{ "name": "intersect", "raw": "<raw-signature>", "elements": [{ <element-type> }, ...] }`                                                                                                                                                                         |
| Nullable modifier                         | `let x: ?number;`                                                                                                                                                       | `{ "name": "number", "nullable": true }`                                                                                                                                                                                                                           |

## Result data structure

The structure of the JSON blob / JavaScript object is as follows:

```
{
  ["description": string,]
  ["props": {
    "<propName>": {
      "type": {
        "name": "<typeName>",
        ["value": <typeValue>]
        ["raw": string]
      },
      "flowType": <flowType>,
      "required": boolean,
      "description": string,
      ["defaultValue": {
        "value": string,
        "computed": boolean
      }]
    },
    ...
  },]
  ["composes": <componentNames>]
}
```

(`[...]` means the property may not exist if such information was not found in the component definition)

- `<propName>`: For each prop that was found, there will be an entry in `props` under the same name.
- `<typeName>`: The name of the type, which is usually corresponds to the function name in `React.PropTypes`. However, for types define with `oneOf`, we use `"enum"` and for `oneOfType` we use `"union"`. If a custom function is provided or the type cannot be resolved to anything of `React.PropTypes`, we use `"custom"`.
- `<typeValue>`: Some types accept parameters which define the type in more detail (such as `arrayOf`, `instanceOf`, `oneOf`, etc). Those are stored in `<typeValue>`. The data type of `<typeValue>` depends on the type definition.
- `<flowType>`: If using flow type this property contains the parsed flow type as can be seen in the table above.

[react]: http://facebook.github.io/react/
[flow]: http://flowtype.org/
[recast]: https://github.com/benjamn/recast
[@babel/parser]: https://github.com/babel/babel/tree/master/packages/babel-parser
[classes]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
