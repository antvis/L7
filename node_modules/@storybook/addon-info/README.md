# Storybook Info Addon

Storybook Info Addon will show additional information for your stories in [Storybook](https://storybook.js.org).
Useful when you want to display usage or other types of documentation alongside your story.

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](https://raw.githubusercontent.com/storybookjs/storybook/HEAD/addons/info/docs/home-screenshot.png)

## Installation

Install the following npm module:

```sh
npm i -D @storybook/addon-info
```

## Basic usage

Then, add `withInfo` as a decorator to your book of stories.
It is possible to add `info` by default to all or a subsection of stories by using a global or story decorator.

It is important to declare this decorator as **the first decorator**, otherwise it won't work well.

```js
// Globally in your .storybook/config.js.
import { addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

addDecorator(withInfo); 
```

or

```js
storiesOf('Component', module)
  .addDecorator(withInfo) // At your stories directly.
  .add(...);
```

Then, you can use the `info` parameter to either pass certain options or specific documentation text to your stories.
A complete list of possible configurations can be found [in a later section](#setting-global-options).
This can be done per book of stories:

```js
import { storiesOf } from '@storybook/react';

import Component from './Component';

storiesOf('Component', module)
  .addParameters({
    info: {
      // Your settings
    },
  })
  .add('with some emoji', () => <Component />);
```

...or for each story individually:

```js
import { storiesOf } from '@storybook/react';

import Component from './Component';

storiesOf('Component', module)
  .add(
    'with some emoji',
    () => <Component emoji />,
    { info: { inline: true, header: false } } // Make your component render inline with the additional info
  )
  .add(
    'with no emoji',
    () => <Component />,
    { info: '☹️ no emojis' } // Add additional info text directly
  );
```

...or even together:

```js
import { storiesOf } from '@storybook/react';

import Component from './Component';

storiesOf('Component', module)
  .addParameters({
    info: {
      // Make a default for all stories in this book,
      inline: true, // where the components are inlined
      styles: {
        header: {
          h1: {
            color: 'red', // and the headers of the sections are red.
          },
        },
      },
    },
  })
  .add('green version', () => <Component green />, {
    info: {
      styles: stylesheet => ({
        // Setting the style with a function
        ...stylesheet,
        header: {
          ...stylesheet.header,
          h1: {
            ...stylesheet.header.h1,
            color: 'green', // Still inlined but with green headers!
          },
        },
      }),
    },
  })
  .add('something else', () => <Component different />, {
    info: 'This story has additional text added to the info!', // Still inlined and with red headers!
  });
```

It is also possible to disable the `info` addon entirely.
Depending on the scope at which you want to disable the addon, pass the following parameters object either to an individual story or to an `addParameters` call.

```
{
  info: {
    disable: true
  }
}
```

## Markdown

The `info` addon also supports markdown.
To use markdown as additional textual documentation for your stories, either pass it directly as a String to the `info` parameters, or use the `text` option.

```js
storiesOf('Button', module).add('Button Component', () => <Button />, {
  info: {
    text: `
          description or documentation about my component, supports markdown

          ~~~js
          <Button>Click Here</Button>
          ~~~
        `,
  },
});
```

## Setting Global Options

To configure default options for all usage of the info addon, pass a option object along with the decorator in `.storybook/config.js`.

```js
// config.js
import { withInfo } from '@storybook/addon-info';

addDecorator(
  withInfo({
    header: false, // Global configuration for the info addon across all of your stories.
  })
);
```

Configuration parameters can be set at 3 different locations: passed as default options along the `addDecorator` call, passed as an object of parameters to a book of stories to the `addParameters` call, and passed as direct parameters to each individual story.
In order, all of them will be combined together, with a later call overriding the previous set configurations on a per-key basis.

## Options and Defaults

```js
{
  /**
   * Text to display with storybook component
   */
  text?: string;
  /**
   * Displays info inline vs click button to view
   * @default false
   */
  inline: boolean,
  /**
   * Toggles display of header with component name and description
   * @default true
   */
  header: boolean,
  /**
   * Displays the source of story Component
   * @default true
   */
  source: boolean,
  /**
   * Components used in story
   * Displays Prop Tables with these components
   * @default []
   */
  propTables: Array<React.ComponentType>,
  /**
   * Exclude Components from being shown in Prop Tables section
   * Accepts an array of component classes or functions
   * @default []
   */
  propTablesExclude: Array<React.ComponentType>,
  /**
   * Overrides styles of addon. The object should follow this shape:
   * https://github.com/storybookjs/storybook/blob/master/addons/info/src/components/Story.js#L19.
   * This prop can also accept a function which has the default stylesheet passed as an argument
   */
  styles: Object | Function,
  /**
   * Overrides components used to display markdown
   * @default {}
   */
  components: { [key: string]: React.ComponentType },
  /**
   * Max props to display per line in source code
   * @default 3
   */
  maxPropsIntoLine: number,
  /**
   * Displays the first 10 characters of the prop name
   * @default 3
   */
  maxPropObjectKeys: number,
  /**
   * Displays the first 10 items in the default prop array
   * @default 3
   */
  maxPropArrayLength: number,
  /**
   * Displays the first 100 characters in the default prop string
   * @default 50
   */
  maxPropStringLength: number,
  /**
   * Override the component used to render the props table
   * @default PropTable
   */
  TableComponent: React.ComponentType,
  /**
   * Will exclude any respective properties whose name is included in array
   * @default []
   */
  excludedPropTypes: Array<string>,
}
```

### Rendering a Custom Table

The `TableComponent` option allows you to define how the prop table should be rendered. Your component will be rendered with the following props.

```js
  {
    propDefinitions: Array<{
      property: string, // The name of the prop
      propType: Object | string, // The prop type. TODO: info about what this object is...
      required: boolean, // True if the prop is required
      description: string, // The description of the prop
      defaultValue: any // The default value of the prop
    }>
  }
```

Example:

```js
// button.js
// @flow
import React from 'react';

const paddingStyles = {
  small: '4px 8px',
  medium: '8px 16px',
};

const Button = ({
  size,
  ...rest
}: {
  /** The size of the button */
  size: 'small' | 'medium',
}) => {
  const style = {
    padding: paddingStyles[size] || '',
  };
  return <button style={style} {...rest} />;
};
Button.defaultProps = {
  size: 'medium',
};

export default Button;
```

```js
// stories.js
import React from 'react';

import { storiesOf } from '@storybook/react';
import Button from './button';

const Red = props => <span style={{ color: 'red' }} {...props} />;

const TableComponent = ({ propDefinitions }) => {
  const props = propDefinitions.map(
    ({ property, propType, required, description, defaultValue }) => {
      return (
        <tr key={property}>
          <td>
            {property}
            {required ? <Red>*</Red> : null}
          </td>
          <td>{propType.name}</td>
          <td>{defaultValue}</td>
          <td>{description}</td>
        </tr>
      );
    }
  );

  return (
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>type</th>
          <th>default</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>{props}</tbody>
    </table>
  );
};

storiesOf('Button', module).add('with text', () => <Button>Hello Button</Button>, {
  info: {
    TableComponent,
  },
});
```

### React Docgen Integration

React Docgen is included as part of the @storybook/react package through the use of `babel-plugin-react-docgen` during babel compile time.
When rendering a story with a React component commented in this supported format, the Addon Info description will render the comments above the component declaration and the prop table will display the prop's comment in the description column.

```js
import React from 'react';
import PropTypes from 'prop-types';

/** Button component description */
const DocgenButton = ({ disabled, label, style, onClick }) => (
  <button disabled={disabled} style={style} onClick={onClick}>
    {label}
  </button>
);

DocgenButton.defaultProps = {
  disabled: false,
  onClick: () => {},
  style: {},
};

DocgenButton.propTypes = {
  /** Boolean indicating whether the button should render as disabled */
  disabled: PropTypes.bool,
  /** button label. */
  label: PropTypes.string.isRequired,
  /** onClick handler */
  onClick: PropTypes.func,
  /** component styles */
  style: PropTypes.shape,
};

export default DocgenButton;
```

Comments above flow types are also supported. Storybook Info Addon should now render all the correct types for your component if the PropTypes are in the same file as the React component.

## The FAQ

**Components lose their names on static build**

Component names also get minified with other javascript code when building for production.
When creating components, set the `displayName` static property to show the correct component name on static builds.
