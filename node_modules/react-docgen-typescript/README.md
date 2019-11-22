# react-docgen-typescript

[![Build Status](https://travis-ci.org/styleguidist/react-docgen-typescript.svg)](https://travis-ci.org/styleguidist/react-docgen-typescript)

![](https://nodei.co/npm/react-docgen-typescript.png?downloadRank=true&downloads=true)

A simple parser for React properties defined in TypeScript instead of propTypes.

It can be used with [React Styleguidist](https://github.com/styleguidist/react-styleguidist).

## Installation

```
npm install --save-dev react-docgen-typescript
```

## React Styleguidist integration

Include following line in your `styleguide.config.js`:

```javascript
propsParser: require('react-docgen-typescript').withDefaultConfig([parserOptions]).parse
```

or if you want to use custom tsconfig file

```javascript
propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json', [parserOptions]).parse
```

### parserOptions

- propFilter:

  ```typescript
  {
    skipPropsWithName?: string[] | string;
    skipPropsWithoutDoc?: boolean;
  }
  ```

  or

  ```typescript
  (prop: PropItem, component: Component) => boolean
  ```

  In case you do not want to print out all the HTML props, because your component is typed like this:
  ```typescript
  const MyComponent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ()...
  ```
  you can use this workaround inside `propFilter`:
  ```typescript
  if (prop.parent) {
    return !prop.parent.fileName.includes('node_modules')
  }

  return true
  ```

  Note: `children` without a doc comment will not be documented.

- componentNameResolver:

  ```typescript
  (exp: ts.Symbol, source: ts.SourceFile) => string | undefined | null | false
  ```

  If a string is returned, then the component will use that name. Else it will fallback to the default logic of parser.
  
- shouldExtractLiteralValuesFromEnum: boolean
  
  If set to true, string enums and unions will be converted to docgen enum format. Useful if you use Storybook and want to generate knobs automatically using [addon-smart-knobs](https://github.com/storybookjs/addon-smart-knobs).

- savePropValueAsString: boolean

  If set to true, defaultValue to props will be string.
  Example:
  ```javascript
    Component.defaultProps = {
        counter: 123,
        disabled: false
    }
  ```
  Will return:
  ```javascript
    counter: {
        defaultValue: '123',
        required: true,
        type: 'number'
    },
    disabled: {
        defaultValue: 'false',
        required: true,
        type: 'boolean'
    }
  ```

**Styled components example:**

```typescript
componentNameResolver: (exp, source) => exp.getName() === 'StyledComponentClass' && getDefaultExportForFile(source);
```

> The parser exports `getDefaultExportForFile` helper through its public API.

## Example

In the example folder you can see React Styleguidist integration.

The component [`Column.tsx`](./examples/react-styleguidist-example/components/Column.tsx)

```javascript
import * as React from 'react';
import { Component } from 'react';

/**
 * Column properties.
 */
export interface IColumnProps {
    /** prop1 description */
    prop1?: string;
    /** prop2 description */
    prop2: number;
    /**
     * prop3 description
     */
    prop3: () => void;
    /** prop4 description */
    prop4: 'option1' | 'option2' | 'option3';
}

/**
 * Form column.
 */
export class Column extends Component<IColumnProps, {}> {
    render() {
        return <div>Test</div>;
    }
}
```

Will generate the following stylesheet:

![Stylesheet example](https://github.com/styleguidist/react-docgen-typescript/raw/master/stylesheet-example-column.png "Stylesheet example")

The functional component [`Grid.tsx`](./examples/react-styleguidist-example/components/Grid.tsx)

```javascript
import * as React from 'react';

/**
 * Grid properties.
 */
export interface IGridProps {
    /** prop1 description */
    prop1?: string;
    /** prop2 description */
    prop2: number;
    /**
     * prop3 description
     */
    prop3: () => void;
    /** Working grid description */
    prop4: 'option1' | 'option2' | 'option3';
}

/**
 * Form Grid.
 */
export const Grid = (props: IGridProps) => {
    const smaller = () => {return;};
    return <div>Grid</div>;
};
```

Will generate the following stylesheet:

![Stylesheet example](https://github.com/styleguidist/react-docgen-typescript/raw/master/stylesheet-example-grid.png "Stylesheet example")

## Contributions
The typescript is pretty complex and there are many different ways how
to define components and their props so it's realy hard to support all
these use cases. That means only one thing, contributions are highly
welcome. Just keep in mind that each PR should also include tests for
the part it's fixing.

Thanks to all contributors without their help there wouldn't be a single 
bug fixed or feature implemented. Check the [**contributors**](https://github.com/styleguidist/react-docgen-typescript/graphs/contributors) tab to find out
more. All those people supported this project. **THANK YOU!**

## Thanks to others

The integration with React Styleguidist wouldn't be possible without [Vyacheslav Slinko](https://github.com/vslinko) pull request [#118](https://github.com/styleguidist/react-styleguidist/pull/118) at React Styleguidist.
