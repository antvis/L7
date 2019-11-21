# Storybook Addon Actions

Storybook Addon Actions can be used to display data received by event handlers in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](https://raw.githubusercontent.com/storybookjs/storybook/HEAD/addons/actions/docs/screenshot.png)

## Getting Started

Install:

```sh
npm i -D @storybook/addon-actions
```

Then, add following content to `.storybook/addons.js`

```js
import '@storybook/addon-actions/register';
```

Import the `action` function and use it to create actions handlers. When creating action handlers, provide a **name** to make it easier to identify.

> _Note: Make sure NOT to use reserved words as function names. [issues#29](https://github.com/storybookjs/storybook-addon-actions/issues/29#issuecomment-288274794)_

```js
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from './button';

storiesOf('Button', module).add('default view', () => (
  <Button onClick={action('button-click')}>Hello World!</Button>
));
```

## Multiple actions

If your story requires multiple actions, it may be convenient to use `actions` to create many at once:

```js
import { storiesOf } from '@storybook/react';
import { actions } from '@storybook/addon-actions';

import Button from './button';

// This will lead to { onClick: action('onClick'), ... }
const eventsFromNames = actions('onClick', 'onMouseOver');

// This will lead to { onClick: action('clicked'), ... }
const eventsFromObject = actions({ onClick: 'clicked', onMouseOver: 'hovered' });

storiesOf('Button', module)
  .add('default view', () => <Button {...eventsFromNames}>Hello World!</Button>)
  .add('default view, different actions', () => (
    <Button {...eventsFromObject}>Hello World!</Button>
  ));
```

## Action Decorators

If you wish to process action data before sending them over to the logger, you can do it with action decorators.

`decorate` takes an array of decorator functions. Each decorator function is passed an array of arguments, and should return a new arguments array to use. `decorate` returns a object with two functions: `action` and `actions`, that act like the above, except they log the modified arguments instead of the original arguments.

```js
import { decorate } from '@storybook/addon-actions';

import Button from './button';

const firstArg = decorate([args => args.slice(0, 1)]);

storiesOf('Button', module).add('default view', () => (
  <Button onClick={firstArg.action('button-click')}>Hello World!</Button>
));
```

## Configuration

Arguments which are passed to the action call will have to be serialized while be "transferred"
over the channel.

This is not very optimal and can cause lag when large objects are being logged, for this reason it is possible 
to configure a maximum depth.

The action logger, by default, will log all actions fired during the lifetime of the story. After a while
this can make the storybook laggy. As a workaround, you can configure an upper limit to how many actions should 
be logged.

To apply the configuration globally use the `configureActions` function in your `config.js` file.

```js
import { configureActions } from '@storybook/addon-actions';

configureActions({
  depth: 100,
  // Limit the number of items logged into the actions panel
  limit: 20,
})
```

To apply the configuration per action use:
```js
action('my-action', {
  depth: 5,
})
```

### Available Options

|Name|Type|Description|Default|
|---|---|---|---|
|`depth`|Number|Configures the transferred depth of any logged objects.|`10`|
|`clearOnStoryChange`|Boolean|Flag whether to clear the action logger when switching away from the current story.|`true`|
|`limit`|Number|Limits the number of items logged in the action logger|`50`|

## withActions decorator

You can define action handles in a declarative way using `withActions` decorators. It accepts the same arguments as [`actions`](#multiple-actions)
Keys have `'<eventName> <selector>'` format, e.g. `'click .btn'`. Selector is optional. This can be used with any framework but is especially useful for `@storybook/html`.

```js
import { storiesOf } from '@storybook/html';
import { withActions } from '@storybook/addon-actions';

storiesOf('button', module)
  // Log mouseovers on entire story and clicks on .btn
  .addDecorator(withActions('mouseover', 'click .btn'))
  .add('with actions', () => `
    <div>
      Clicks on this button will be logged: <button className="btn" type="button">Button</button>
    </div>
  `);
```
