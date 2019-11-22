# Marksy
A markdown to custom components library. Supports any virtual DOM library.

## Installation

```sh
npm install marksy
```

## Usage
```js
import React, {createElement} from 'React';
import marksy from 'marksy'
// const marksy = require('marksy').marksy

const compile = marksy({
  // Pass in whatever creates elements for your
  // virtual DOM library. h('h1', {})
  createElement,

  // You can override the default elements with
  // custom VDOM trees
  elements: {
    h1 ({id, children}) {
      return <h1 className="my-custom-class">{children}</h1>
    },
    h2 ({id, children}) {},
    h3 ({id, children}) {},
    h4 ({id, children}) {},
    blockquote ({children}) {},
    hr () {},
    ol ({children}) {},
    ul ({children}) {},
    p ({children}) {},
    table ({children}) {},
    thead ({children}) {},
    tbody ({children}) {},
    tr ({children}) {},
    th ({children}) {},
    td ({children}) {},
    a ({href, title, target, children}) {},
    strong ({children}) {},
    em ({children}) {},
    br () {},
    del ({children}) {},
    img ({src, alt}) {},
    code ({language, code}) {},
    codespan ({children}) {},
  },
});

const compiled = compile('# hello', {
  // Options passed to "marked" (https://www.npmjs.com/package/marked)
});

compiled.tree // The React tree of components
compiled.toc // The table of contents, based on usage of headers
```

### Components
You can also add your own custom components. You do this by importing `marksy/components`. This build of marksy includes babel transpiler which will convert any HTML to elements and allow for custom components:

<pre lang="js"><code>
import React, {createElement} from 'react'
import marksy from 'marksy'

const compile = marksy({
  createElement,
  components: {
    MyCustomComponent (props) {
      return &lt;h1>{props.children}&lt;/h1>
    }
  }
})

/* CREATE MARKDOWN USING MARKSY LANGUAGE:
  # Just a test
  ```marksy
  h(MyCustomComponent, {}, "Some text")
  ```
*/
</code></pre>

This will be converted to the component above. You can pass in any kind of props, as if it was normal code. If you are not familiar with `h`, this is a convention for creating elements and components in virtual dom implementations.

### Jsx

You can take one step further and create components wherever you want in the markdown, using jsx. You will have to import `marksy/jsx`. This build of marksy includes babel transpiler which will convert any HTML to elements and allow for custom components. Note that this will increase your bundle size sagnificantly:

<pre lang="js"><code>
import React, {createElement} from 'react'
import marksy from 'marksy/components'

const compile = marksy({
  createElement,
  components: {
    MyCustomComponent (props) {
      return &lt;h1>{props.children}&lt;/h1>
    }
  }
})

/* MARKDOWN:
  # Just a test
  &lt;MyCustomComponent>some text&lt;/MyCustomComponent>
*/

/* WITH LANGUAGE FOR GENERIC SUPPORT:
  # Just a test
  ```marksy
  &lt;MyCustomComponent>some text&lt;/MyCustomComponent>
  ```
*/
</code></pre>

### Context
You might need to pass in general information to your custom elements and components. You can pass in a context to do so:

```js
import React, {createElement} from 'react'
import marksy from 'marksy/components'

const compile = marksy({
  createElement,
  elements: {
    h1(props) {
      return <h1>{props.context.foo}</h1>
    }
  },
  components: {
    MyCustomComponent (props) {
      return <h1>{props.context.foo}</h1>
    }
  }
})

compile('<MyCustomComponent />', null, {
  foo: 'bar'
})
```

### Code highlighting
To enable code highlighting you just need to add a method that does the transformation. Here is an example with [Highlight.js](https://highlightjs.org/), but you could also use [Prism](http://prismjs.com/). Both of them support server side rendering. For example:

```js
import {createElement} from 'react'
import 'highlight.js/styles/github.css';
import hljs from 'highlight.js/lib/highlight';
import hljsJavascript from 'highlight.js/lib/languages/javascript';
import marksy from 'marksy/components'

hljs.registerLanguage('javascript', hljsJavascript);

const compile = marksy({
  createElement,
  highlight(language, code) {
    return hljs.highlight(language, code).value
  }
})
```

The elements returned is:

```html
<pre>
  <code class="language-js">
    ...code...
  </code>
</pre>
```

Meaning that the `code` element is added a classname based on the language.

## Developing
1. Clone repo
2. `npm install`
3. `npm start` -> localhost:8080 (development app)
