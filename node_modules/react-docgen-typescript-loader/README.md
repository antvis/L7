<p align="center">
  <img src="./logo.png" alt="Logo for project react-docgen-typescript-loader">
</p>

<p align="center">
Webpack loader to generate docgen information from TypeScript React components. The primary use case is to get the prop types table populated in the <a href="https://github.com/storybooks/storybook/tree/master/addons/info">Storybook Info Addon.
</a>
</p>

<p align="center">
  <a href="https://travis-ci.org/strothj/react-docgen-typescript-loader">
    <img src="https://travis-ci.org/strothj/react-docgen-typescript-loader.svg?branch=master">
  </a>

  <a href="https://ci.appveyor.com/project/strothj/react-docgen-typescript-loader">
  <img src="https://ci.appveyor.com/api/projects/status/6l1xdmf8moud8vyj?svg=true">
  </a>
</p>

<p align="center">
  <img src="./example.png" alt="Example screenshot of Storybook with TypeScript props">
  <br>
  <a href="./examples/storybook">Example Storybook project</a>
  <br>
  <a href="https://react-docgen-typescript-loader.netlify.com">Live Storybook</a>
</p>

## Guide

- [Changelog](#changelog)
- [Migrating from V2 to V3](#migrating-from-v2-to-v3)
- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Package Installation](#package-installation)
  - [Webpack Configuration](#webpack-configuration)
    - [Storybook 4](#storybook-4)
    - [Storybook 3](#storybook-3)
- [Documenting Components with Storybook](#documenting-components-with-storybook)
  - [Including Component Description](#including-component-description)
  - [Exporting Components](#exporting-components)
- [Loader Options](#loader-options)
- [Performance](#performance)
  - [Optional Performance Settings](#optional-performance-settings)
- [Alternative Implementation](#alternative-implementation)
- [Limitations](#limitations)
  - [React Component Class Import](#react-component-class-import)
  - [Export Names](#export-names)
- [Contributing](#contributing)
- [Credits](#credits)
  - [SVG Logos](#svg-logos)
  - [Projects](#projects)
- [License](#license)

## Changelog

View [Changelog](https://github.com/strothj/react-docgen-typescript-loader/blob/master/CHANGELOG.md).

## Migrating from V2 to V3

Version 2 supported the options `includes` and `excludes`, which were arrays of regular expressions. If you made use of these options, remove them from and use the Webpack equivalents.

`includes` would default to `["\\.tsx$"]` which meant that only files ending in the extension `.ts` or `.tsx` would be processed. This default behavior is already covered by Webpack's `test` field.

`excludes` would default to `["node_modules"]`. This would prevent the processing of files in node_modules. This option was added to allow further filtering to hopefully speed up processing. When this loader is used in monorepo environments, this option would complicate configuration.

In version 3, the loader no longer performs its own filtering. If you relied on the additional filtering behavior, you should be able to reimplement it using options in Webpack.

This change shouldn't affect the majority of projects.

## Quick Start

### Requirements

The source code generation relies on being able to insert `// @ts-ignore` in a few select places and as such requires TypeScript 2.3 or above.

### Package Installation

```shell
$ npm install --save-dev react-docgen-typescript-loader

or

$ yarn add --dev react-docgen-typescript-loader
```

### Webpack Configuration

**IMPORTANT:** Webpack loaders are executed right-to-left (or bottom-to-top). `react-docgen-typescript-loader` needs to be added under `ts-loader`.

Example Storybook config `/.storybook/webpack.config.js`:

#### Storybook 4

```javascript
const path = require("path");

module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    include: path.resolve(__dirname, "../src"),
    use: [
      require.resolve("ts-loader"),
      require.resolve("react-docgen-typescript-loader"),
    ],
  });

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
```

#### Storybook 3

```javascript
const path = require("path");
const genDefaultConfig = require("@storybook/react/dist/server/config/defaults/webpack.config.js");

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig);

  config.module.rules.push({
    test: /\.tsx?$/,
    include: path.resolve(__dirname, "../src"),
    use: [
      require.resolve("ts-loader"),
      require.resolve("react-docgen-typescript-loader"),
    ],
  });

  config.resolve.extensions.push(".ts", ".tsx");

  return config;
};
```

## Documenting Components with Storybook

Include the `withInfo` decorator as normal.
Reference the addon documentation for the latest usage instructions:
https://github.com/storybooks/storybook/tree/master/addons/info

### Including Component Description

The Storybook Info Addon is able to populate the component description from your component's documentation. It does this when your story name matches the display name of your component. The prop tables will populate in either case.

![Example image, how to include component description](/example-story-name.png)

In the first example you are able to see above `Story Source` the component description. The second example shows a story with a name different from the component. In the second example the component description is missing.

If you have a component named
`TicTacToeCell`, then you would have to use something like: `storiesOf("...", module).add("TicTacToeCell", ...)` to have the story description come from the component description.

In addition to the description from the component, you may still include story description text using the normal withInfo api.

### Exporting Components

**It is important** to export your component using a named export for docgen information to be generated properly.

---

`TicTacToeCell.tsx`:

```javascript
import React, { Component } from "react";
import * as styles from "./TicTacToeCell.css";

interface Props {
  /**
   * Value to display, either empty (" ") or "X" / "O".
   *
   * @default " "
   **/
  value?: " " | "X" | "O";

  /** Cell position on game board. */
  position: { x: number, y: number };

  /** Called when an empty cell is clicked. */
  onClick?: (x: number, y: number) => void;
}

/**
 * TicTacToe game cell. Displays a clickable button when the value is " ",
 * otherwise displays "X" or "O".
 */
// Notice the named export here, this is required for docgen information
// to be generated correctly.
export class TicTacToeCell extends Component<Props> {
  handleClick = () => {
    const {
      position: { x, y },
      onClick,
    } = this.props;
    if (!onClick) return;

    onClick(x, y);
  };

  render() {
    const { value = " " } = this.props;
    const disabled = value !== " ";
    const classes = `${styles.button} ${disabled ? styles.disabled : ""}`;

    return (
      <button
        className={classes}
        disabled={disabled}
        onClick={this.handleClick}
      >
        {value}
      </button>
    );
  }
}

// Component can still be exported as default.
export default TicTacToeCell;
```

`ColorButton.stories.tsx`:

```javascript
import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import TicTacToeCell from "./TicTacToeCell";

const stories = storiesOf("Components", module);

stories.add(
  "TicTacToeCell",
  withInfo({ inline: true })(() => (
    <TicTacToeCell
      value="X"
      position={{ x: 0, y: 0 }}
      onClick={action("onClick")}
    />
  )),
);
```

## Loader Options

| Option                             | Type                       | Description                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| skipPropsWithName                  | string[] or string         | Avoid including docgen information for the prop or props specified.                                                                                                                                                                                                                                                                                         |
| skipPropsWithoutDoc                | boolean                    | Avoid including docgen information for props without documentation.                                                                                                                                                                                                                                                                                         |
| componentNameResolver              | function                   | If a string is returned, then the component will use that name. Else it will fallback to the default logic of parser. https://github.com/styleguidist/react-docgen-typescript#parseroptions                                                                                                                                                                 |
| propFilter                         | function                   | Filter props using a function. If skipPropsWithName or skipPropsWithoutDoc is defined the function will not be used. Function accepts two arguments: object with information about prop and an object with information about component. Return true to include prop in documentation. https://github.com/styleguidist/react-docgen-typescript#parseroptions |
| tsconfigPath                       | string                     | Specify the location of the tsconfig.json to use. Can not be used with compilerOptions.                                                                                                                                                                                                                                                                     |
| compilerOptions                    | typescript.CompilerOptions | Specify TypeScript compiler options. Can not be used with tsconfigPath.                                                                                                                                                                                                                                                                                     |
| docgenCollectionName               | string or null             | Specify the docgen collection name to use. All docgen information will be collected into this global object. Set to `null` to disable. Defaults to `STORYBOOK_REACT_CLASSES` for use with the Storybook Info Addon. https://github.com/gongreg/react-storybook-addon-docgen                                                                                 |
| setDisplayName                     | boolean                    | Automatically set the components' display name. If you want to set display names yourself or are using another plugin to do this, you should disable this option. Defaults to `true`. This is used to preserve component display names during a production build of Storybook.                                                                              |
| shouldExtractLiteralValuesFromEnum | boolean                    | If set to true, string enums and unions will be converted to docgen enum format. Useful if you use Storybook and want to generate knobs automatically using [addon-smart-knobs](https://github.com/storybookjs/addon-smart-knobs). https://github.com/styleguidist/react-docgen-typescript#parseroptions                                                    |

## Performance

There is a significant startup cost due to the initial type parsing. Once the project is running in watch mode, things should be smoother due to Webpack caching.

## Alternative Implementation

This plugin uses a Webpack loader to inject the docgen information. There is also a version which works as a Webpack plugin. I will be supporting both versions. The loader version more accurately generates the injected code blocks and should work with all module types but at the cost of a longer initial startup. The plugin version may be faster.

The Webpack plugin version is available here:
https://github.com/strothj/react-docgen-typescript-loader/tree/plugin

## Limitations

This plugin makes use of the project:
https://github.com/styleguidist/react-docgen-typescript.
It is subject to the same limitations.

### React Component Class Import

When extending from `React.Component` as opposed to `Component`, docgens don't seem to be created. Ref issue [#10](https://github.com/strothj/react-docgen-typescript-loader/issues/10) (thanks @StevenLangbroek for tracking down the cause).

Doesn't work:

```
import React from 'react';

interface IProps {
  whatever?: string;
};

export default class MyComponent extends React.Component<IProps> {}
```

Works:

```
import React, { Component } from 'react';

export default class MyComponent extends Component<IProps> {}
```

### Export Names

Component docgen information can not be
generated for components that are only exported as default. You can work around
the issue by exporting the component using a named export.

```javascript
import * as React from "react";

interface ColorButtonProps {
  /** Buttons background color */
  color: "blue" | "green";
}

/** A button with a configurable background color. */
export const ColorButton: React.SFC<ColorButtonProps> = props => (
  <button
    style={{
      padding: 40,
      color: "#eee",
      backgroundColor: props.color,
      fontSize: "2rem",
    }}
  >
    {props.children}
  </button>
);

export default ColorButton;
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Credits

### SVG Logos

- https://prettier.io
- https://seeklogo.com

### Projects

- [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript)

## License

[MIT](https://choosealicense.com/licenses/mit/)
