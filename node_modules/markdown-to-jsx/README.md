**markdown-to-jsx**

The most lightweight, customizable React markdown component.

[![npm version](https://badge.fury.io/js/markdown-to-jsx.svg)](https://badge.fury.io/js/markdown-to-jsx) [![build status](https://api.travis-ci.org/probablyup/markdown-to-jsx.svg)](https://travis-ci.org/probablyup/markdown-to-jsx) [![codecov](https://codecov.io/gh/probablyup/markdown-to-jsx/branch/master/graph/badge.svg)](https://codecov.io/gh/probablyup/markdown-to-jsx) [![downloads](https://img.shields.io/npm/dm/markdown-to-jsx.svg)](https://npm-stat.com/charts.html?package=markdown-to-jsx)
[![Backers on Open Collective](https://opencollective.com/markdown-to-jsx/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/markdown-to-jsx/sponsors/badge.svg)](#sponsors)

<!-- TOC -->

- [Installation](#installation)
- [Usage](#usage)
    - [Parsing Options](#parsing-options)
        - [options.forceBlock](#optionsforceblock)
        - [options.forceInline](#optionsforceinline)
        - [options.overrides - Override Any HTML Tag's Representation](#optionsoverrides---override-any-html-tags-representation)
        - [options.overrides - Rendering Arbitrary React Components](#optionsoverrides---rendering-arbitrary-react-components)
        - [options.createElement - Custom React.createElement behavior](#optionscreateelement---custom-reactcreateelement-behavior)
        - [options.slugify](#optionsslugify)
        - [options.namedCodesToUnicode](#optionsnamedcodestounicode)
    - [Getting the smallest possible bundle size](#getting-the-smallest-possible-bundle-size)
    - [Usage with Preact](#usage-with-preact)
- [Gotchas](#gotchas)
    - [Significant indentation inside arbitrary HTML](#significant-indentation-inside-arbitrary-html)
        - [Code blocks](#code-blocks)
- [Using The Compiler Directly](#using-the-compiler-directly)
- [Changelog](#changelog)
- [Donate](#donate)
- [Credits](#credits)
    - [Contributors](#contributors)
    - [Backers](#backers)
    - [Sponsors](#sponsors)

<!-- /TOC -->

---

`markdown-to-jsx` uses a heavily-modified fork of [simple-markdown](https://github.com/Khan/simple-markdown) as its parsing engine and extends it in a number of ways to make your life easier. Notably, this package offers the following additional benefits:

-   Arbitrary HTML is supported and parsed into the appropriate JSX representation
    without `dangerouslySetInnerHTML`

-   Any HTML tags rendered by the compiler and/or `<Markdown>` component can be overridden to include additional
    props or even a different HTML representation entirely.

-   GFM task list support.

-   Fenced code blocks with [highlight.js](https://highlightjs.org/) support.

All this clocks in at around 5 kB gzipped, which is a fraction of the size of most other React markdown components.

Requires React >= 0.14.

## Installation

Install `markdown-to-jsx` with your favorite package manager.

```shell
npm i markdown-to-jsx
```

## Usage

`markdown-to-jsx` exports a React component by default for easy JSX composition:

ES6-style usage\*:

```jsx
import Markdown from 'markdown-to-jsx';
import React from 'react';
import { render } from 'react-dom';

render(<Markdown># Hello world!</Markdown>, document.body);

/*
    renders:

    <h1>Hello world!</h1>
 */
```

\* **NOTE: JSX does not natively preserve newlines in multiline text. In general, writing markdown directly in JSX is discouraged and it's a better idea to keep your content in separate .md files and require them, perhaps using webpack's [raw-loader](https://github.com/webpack-contrib/raw-loader).**

### Parsing Options

#### options.forceBlock

By default, the compiler will try to make an intelligent guess about the content passed and wrap it in a `<div>`, `<p>`, or `<span>` as needed to satisfy the "inline"-ness of the markdown. For instance, this string would be considered "inline":

```md
Hello. _Beautiful_ day isn't it?
```

But this string would be considered "block" due to the existence of a header tag, which is a block-level HTML element:

```md
# Whaddup?
```

However, if you really want all input strings to be treated as "block" layout, simply pass `options.forceBlock = true` like this:

```jsx
<Markdown options={{ forceBlock: true }}>Hello there old chap!</Markdown>;

// or

compiler('Hello there old chap!', { forceBlock: true });

// renders

<p>Hello there old chap!</p>;
```

#### options.forceInline

The inverse is also available by passing `options.forceInline = true`:

```jsx
<Markdown options={{ forceInline: true }}># You got it babe!</Markdown>;

// or

compiler('# You got it babe!', { forceInline: true });

// renders

<span># You got it babe!</span>;
```

#### options.overrides - Override Any HTML Tag's Representation

Pass the `options.overrides` prop to the compiler or `<Markdown>` component to seamlessly revise the rendered representation of any HTML tag. You can choose to change the component itself, add/change props, or both.

```jsx
import Markdown from 'markdown-to-jsx';
import React from 'react';
import { render } from 'react-dom';

// surprise, it's a div instead!
const MyParagraph = ({ children, ...props }) => (
    <div {...props}>{children}</div>
);

render(
    <Markdown
        options={{
            overrides: {
                h1: {
                    component: MyParagraph,
                    props: {
                        className: 'foo',
                    },
                },
            },
        }}
    >
        # Hello world!
    </Markdown>,
    document.body
);

/*
    renders:

    <div class="foo">
        Hello World
    </div>
 */
```

If you only wish to provide a component override, a simplified syntax is available:

```js
{
    overrides: {
        h1: MyParagraph,
    },
}
```

Depending on the type of element, there are some props that must be preserved to ensure the markdown is converted as intended. They are:

-   `a`: `title`, `href`
-   `img`: `title`, `alt`, `src`
-   `input[type="checkbox"]`: `checked`, `readonly` (specifically, the one rendered by a GFM task list)
-   `ol`: `start`
-   `td`: `style`
-   `th`: `style`

Any conflicts between passed `props` and the specific properties above will be resolved in favor of `markdown-to-jsx`'s code.

#### options.overrides - Rendering Arbitrary React Components

One of the most interesting use cases enabled by the HTML syntax processing in `markdown-to-jsx` is the ability to use any kind of element, even ones that aren't real HTML tags like React component classes.

By adding an override for the components you plan to use in markdown documents, it's possible to dynamically render almost anything. One possible scenario could be writing documentation:

```jsx
import Markdown from 'markdown-to-jsx';
import React from 'react';
import { render } from 'react-dom';

import DatePicker from './date-picker';

const md = `
# DatePicker

The DatePicker works by supplying a date to bias towards,
as well as a default timezone.

<DatePicker biasTowardDateTime="2017-12-05T07:39:36.091Z" timezone="UTC+5" />
`;

render(
    <Markdown
        children={md}
        options={{
            overrides: {
                DatePicker: {
                    component: DatePicker,
                },
            },
        }}
    />,
    document.body
);
```

`markdown-to-jsx` also handles JSX interpolation syntax, but in a minimal way to not introduce a potential attack vector. Interpolations are sent to the component as their raw string, which the consumer can then `eval()` or process as desired to their security needs.

In the following case, `DatePicker` could simply run `parseInt()` on the passed `startTime` for example:

```jsx
import Markdown from 'markdown-to-jsx';
import React from 'react';
import { render } from 'react-dom';

import DatePicker from './date-picker';

const md = `
# DatePicker

The DatePicker works by supplying a date to bias towards,
as well as a default timezone.

<DatePicker
  biasTowardDateTime="2017-12-05T07:39:36.091Z"
  timezone="UTC+5"
  startTime={1514579720511}
/>
`;

render(
    <Markdown
        children={md}
        options={{
            overrides: {
                DatePicker: {
                    component: DatePicker,
                },
            },
        }}
    />,
    document.body
);
```

Another possibility is to use something like [recompose's `withProps()` HOC](https://github.com/acdlite/recompose/blob/master/docs/API.md#withprops) to create various pregenerated scenarios and then reference them by name in the markdown:

```jsx
import Markdown from 'markdown-to-jsx';
import React from 'react';
import { render } from 'react-dom';
import withProps from 'recompose/withProps';

import DatePicker from './date-picker';

const DecemberDatePicker = withProps({
    range: {
        start: new Date('2017-12-01'),
        end: new Date('2017-12-31'),
    },
    timezone: 'UTC+5',
})(DatePicker);

const md = `
# DatePicker

The DatePicker works by supplying a date to bias towards,
as well as a default timezone.

<DatePicker
  biasTowardDateTime="2017-12-05T07:39:36.091Z"
  timezone="UTC+5"
  startTime={1514579720511}
/>

Here's an example of a DatePicker pre-set to only the month of December:

<DecemberDatePicker />
`;

render(
    <Markdown
        children={md}
        options={{
            overrides: {
                DatePicker,
                DecemberDatePicker,
            },
        }}
    />,
    document.body
);
```

#### options.createElement - Custom React.createElement behavior

Sometimes, you might want to override the `React.createElement` default behavior to hook into the rendering process before the JSX gets rendered. This might be useful to add extra children or modify some props based on runtime conditions. The function mirrors the `React.createElement` function, so the params are [`type, [props], [...children]`](https://reactjs.org/docs/react-api.html#createelement):

```javascript
import Markdown from 'markdown-to-jsx';
import React from 'react';
import { render } from 'react-dom';

const md = `
# Hello world
`;

render(
    <Markdown
        children={md}
        options={{
            createElement(type, props, children) {
                return (
                    <div className="parent">
                        {React.createElement(type, props, children)}
                    </div>
                );
            },
        }}
    />,
    document.body
);
```

#### options.slugify

By default, a [lightweight deburring function](https://github.com/probablyup/markdown-to-jsx/blob/bc2f57412332dc670f066320c0f38d0252e0f057/index.js#L261-L275) is used to generate an HTML id from headings. You can override this by passing a function to `options.slugify`. This is helpful when you are using non-alphanumeric characters (e.g. Chinese or Japanese characters) in headings. For example:

```jsx
<Markdown options={{ slugify: str => str }}># 中文</Markdown>;

// or

compiler('# 中文', { slugify: str => str });

// renders:

<h1 id="中文">中文</h1>
```

#### options.namedCodesToUnicode

By default only a couple of named html codes are converted to unicode characters:

* `&` (`&amp;`)
* `'` (`&apos;`)
* `>` (`&gt;`)
* `<` (`&lt;`)
* ` ` (`&nbsp;`)
* `"` (`&quot;`)

Some projects require to extend this map of named codes and unicode characters. To customize this list with additional html codes pass the option namedCodesToUnicode as object with the code names needed as in the example below:

```jsx
<Markdown options={{ namedCodesToUnicode: {
    le: '\u2264',
    ge: '\u2265',
} }}>This text is &le; than this text.</Markdown>;

// or

compiler('This text is &le; than this text.', namedCodesToUnicode: {
    le: '\u2264',
    ge: '\u2265',
});

// renders:

<p>This text is ≤ than this text.</p>
```

### Getting the smallest possible bundle size

Many development conveniences are placed behind `process.env.NODE_ENV !== "production"` conditionals. When bundling your app, it's a good idea to replace these code snippets such that a minifier (like uglify) can sweep them away and leave a smaller overall bundle.

Here are instructions for some of the popular bundlers:

-   [webpack](https://webpack.js.org/guides/production/#specify-the-environment)
-   [browserify plugin](https://github.com/hughsk/envify)
-   [parcel](https://parceljs.org/production.html)
-   [fuse-box](http://fuse-box.org/plugins/replace-plugin#notes)

### Usage with Preact

Everything will work just fine! Simply [Alias `react` to `preact-compat`](https://github.com/developit/preact-compat#usage-with-webpack) like you probably already are doing.

## Gotchas

### Significant indentation inside arbitrary HTML

People usually write HTML like this:

```html
<div>
    Hey, how are you?
</div>
```

Note the leading spaces before the inner content. This sort of thing unfortunately clashes with existing markdown syntaxes since 4 spaces === a code block and other similar collisions.

To get around this, `markdown-to-jsx` left-trims approximately as much whitespace as the first line inside the HTML block. So for example:

```html
<div>
  # Hello

  How are you?
</div>
```

The two leading spaces in front of "# Hello" would be left-trimmed from all lines inside the HTML block. In the event that there are varying amounts of indentation, only the amount of the first line is trimmed.

> NOTE! These syntaxes work just fine when you aren't writing arbitrary HTML wrappers inside your markdown. This is very much an edge case of an edge case. 🙃

#### Code blocks

⛔️

```md
<div>
    var some = code();
</div>
```

✅

```md
<div>
```js
var some = code();
```
</div>
```

## Using The Compiler Directly

If desired, the compiler function is a "named" export on the `markdown-to-jsx` module:

```jsx
import { compiler } from 'markdown-to-jsx';
import React from 'react';
import { render } from 'react-dom';

render(compiler('# Hello world!'), document.body);

/*
    renders:

    <h1>Hello world!</h1>
 */
```

It accepts the following arguments:

```js
compiler(markdown: string, options: object?)
```

## Changelog

See [Github Releases](https://github.com/probablyup/markdown-to-jsx/releases).

## Donate

Like this library? It's developed entirely on a volunteer basis; chip in a few bucks if you can at the [OpenCollective](https://opencollective.com/markdown-to-jsx).

## Credits

### Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/markdown-to-jsx/contributors.svg?width=890&button=false" /></a>

### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/markdown-to-jsx#backer)]

<a href="https://opencollective.com/markdown-to-jsx#backers" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/backers.svg?width=890"></a>

### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/markdown-to-jsx#sponsor)]

<a href="https://opencollective.com/markdown-to-jsx/sponsor/0/website" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/markdown-to-jsx/sponsor/1/website" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/markdown-to-jsx/sponsor/2/website" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/markdown-to-jsx/sponsor/3/website" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/markdown-to-jsx/sponsor/4/website" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/markdown-to-jsx/sponsor/5/website" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/markdown-to-jsx/sponsor/6/website" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/markdown-to-jsx/sponsor/7/website" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/markdown-to-jsx/sponsor/8/website" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/markdown-to-jsx/sponsor/9/website" target="_blank"><img src="https://opencollective.com/markdown-to-jsx/sponsor/9/avatar.svg"></a>

MIT
