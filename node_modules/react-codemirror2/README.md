[![Build Status](https://img.shields.io/travis/scniro/react-codemirror2.svg?style=flat-square)](https://travis-ci.org/scniro/react-codemirror2)
[![Dependency Status](https://img.shields.io/david/scniro/react-codemirror2.svg?label=deps&style=flat-square)](https://david-dm.org/scniro/react-codemirror2)
[![DevDependency Status](https://img.shields.io/david/dev/scniro/react-codemirror2.svg?label=devDeps&style=flat-square)](https://david-dm.org/scniro/react-codemirror2#info=devDependencies)
[![Coverage](https://img.shields.io/coveralls/scniro/react-codemirror2.svg?style=flat-square)](https://coveralls.io/github/scniro/react-codemirror2)
[![Downloads](https://img.shields.io/npm/dm/react-codemirror2.svg?style=flat-square)](https://www.npmjs.com/package/react-codemirror2)
[![NPM Version](https://img.shields.io/npm/v/react-codemirror2.svg?style=flat-square)](https://www.npmjs.com/package/react-codemirror2)

### react-codemirror2

demo @ [scniro.github.io/react-codemirror2](https://scniro.github.io/react-codemirror2/)

> npm install react-codemirror2 codemirror --save

`react-codemirror2` ships with the notion of an [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html) and [controlled](https://reactjs.org/docs/forms.html#controlled-components) component. `UnControlled` consists of a simple wrapper largely powered by the inner workings of `codemirror` itself, while `Controlled` will demand state management from the user, preventing codemirror changes unless properly handled via `value`. The latter will offer more control and likely be more appropriate with [redux](http://redux.js.org/) heavy apps.

## uncontrolled usage
```jsx
import {UnControlled as CodeMirror} from 'react-codemirror2'

<CodeMirror
  value='<h1>I ♥ react-codemirror2</h1>'
  options={{
    mode: 'xml',
    theme: 'material',
    lineNumbers: true
  }}
  onChange={(editor, data, value) => {
  }}
/>
```

## controlled usage
```jsx
import {Controlled as CodeMirror} from 'react-codemirror2'

<CodeMirror
  value={this.state.value}
  options={options}
  onBeforeChange={(editor, data, value) => {
    this.setState({value});
  }}
  onChange={(editor, data, value) => {
  }}
/>
```

## requiring codemirror resources

- [codemirror](https://www.npmjs.com/package/codemirror)

`codemirror` comes as a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/), meaning you'll need to require it in your project _in addition to_ `react-codemirror2`. This prevents any versioning conflicts that would arise if `codemirror` came as a dependency through this wrapper. It's been observed that version mismatches can cause difficult to trace issues such as sytax highlighting disappearing without any explicit errors/warnings

- additional

Since codemirror ships mostly unconfigured, the user is left with the responsibility for requiring any additional resources should they be necessary. This is often the case when specifying certain [language modes]() and [themes](). How to import/require these assets will vary according to the specifics of your development environment. Below is a sample to include the assets necessary to specify a mode of `xml` (HTML) and a `material` theme.

> note that the base codemirror.css file is required in all use cases

```css
@import 'codemirror/lib/codemirror.css';
@import 'codemirror/theme/material.css';
```

```jsx
import CodeMirror from 'react-codemirror2';
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
```

## props

| prop         | type&nbsp;*`default`*  | components                        | description                                                                                                           |
|--------------|------------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `autoCursor` | boolean&nbsp;*`true`*  | `Controlled`&nbsp;`UnControlled`  | should component cursor position correct when `value` changed                                                         |                                                                                   |
| `autoScroll` | boolean&nbsp;*`true`*  | `Controlled`&nbsp;`UnControlled`  | should component scroll cursor position into view when `value` changed                                                |
| `className`  | string                 | `Controlled`&nbsp;`UnControlled`  | pass through class *`class="react-codemirror2 className"`*                                                            |
| `defineMode` | object                 | `Controlled`&nbsp;`UnControlled`  | pass a [custom mode](http://marijnhaverbeke.nl/blog/codemirror-mode-system.html) via `{name: 'custom', fn: myModeFn}` |
| `detach`     | boolean                | `UnControlled`                    | should component ignore new props                                                                                     |
| `options`    | object                 | `Controlled`&nbsp;`UnControlled`  | [codemirror configuration](https://codemirror.net/doc/manual.html#config)                                             |
| `value`      | string                 | *`Controlled`&nbsp;`UnControlled` | * component value _**must be managed for controlled components**_                                                     |

## props cont. (wrapped codemirror [programming api](https://codemirror.net/doc/manual.html#api))

- `cursor` - *[setCursor](https://codemirror.net/doc/manual.html#setCursor)*
> will programmatically set cursor to the position specified
```jsx
<CodeMirror
  [...]
  cursor={{
    line: 5,
    ch: 10
  }}
  onCursor={(editor, data) => {}}
/>
```
- `scroll` - *[scrollTo](https://codemirror.net/doc/manual.html#scrollTo)*
> will programmatically scroll to the specified coordinate
```jsx
<CodeMirror
  [...]
  scroll={{
    x: 50,
    y: 50
  }}
  onScroll={(editor, data) => {}}
/>
```
- `selection={{ranges: array<{anchor, head}>, focus?: boolean}` - *[setSelections](https://codemirror.net/doc/manual.html#setSelections)*
> will programmatically select the ranges specified
```jsx
<CodeMirror
  [...]
  selection={{
    ranges: [{
      anchor: {ch: 8, line: 5},
      head: {ch: 37, line: 5}
    }],
    focus: true // defaults false if not specified
  }}
  onSelection={(editor, data) => {}}
/>
```

## events

| event                                                            | components                       | description                                                                                                 |
|------------------------------------------------------------------|----------------------------------|-------------------------------------------------------------------------------------------------------------|
| **editorDidAttach(editor)**                                      | `UnControlled`                   | component is now **responding** to new props                                                                |
| **editorDidConfigure(editor)**                                   | `Controlled`&nbsp;`UnControlled` | component configuration has been set                                                                        |
| **editorDidDetach(editor)**                                      | `UnControlled`                   | component is now **ignoring** new props                                                                     |
| **editorDidMount(editor,&nbsp;_[next]_)**                        | `Controlled`&nbsp;`UnControlled` | * invoking optional `next` will trigger `editorDidConfigure`                                                |
| **editorWillUnmount(editor)**                                    | `Controlled`&nbsp;`UnControlled` | invoked before [`componentWillUnmount`](https://reactjs.org/docs/react-component.html#componentwillunmount) |
| **onBeforeChange(editor,&nbsp;data,&nbsp;value,&nbsp;_[next]_)** | `Controlled`&nbsp;`UnControlled` | * if used, `next` is returned via `UnControlled` and *must* be invoked to trigger onChange                  |
| **onChange(editor,&nbsp;data,&nbsp;value)**                      | `Controlled`&nbsp;`UnControlled` | the component value has been changed                                                                        |

## events cont. [wrapped codemirror events](https://codemirror.net/doc/manual.html#events)

- `onBlur(editor, event)` - *[blur](https://codemirror.net/doc/manual.html#event_blur)*
- `onContextMenu(editor, event)` - *[contextmenu](https://codemirror.net/doc/manual.html#event_dom)*
- `onCopy(editor, event)` - *[copy](https://codemirror.net/doc/manual.html#event_dom)*
- `onCursor(editor, data)`- *[cursorActivity](https://codemirror.net/doc/manual.html#event_doc_cursorActivity)*
- `onCursorActivity(editor)` - *[cursorActivity](https://codemirror.net/doc/manual.html#event_cursorActivity)*
- `onCut(editor, event)` - *[cut](https://codemirror.net/doc/manual.html#event_dom)*
- `onDblClick(editor, event)` - *[dblclick](https://codemirror.net/doc/manual.html#event_dom)*
- `onDragEnter(editor, event)` - *[dragenter](https://codemirror.net/doc/manual.html#event_dom)*
- `onDragOver(editor, event)` - *[dragover](https://codemirror.net/doc/manual.html#event_dom)*
- `onDragLeave(editor, event)` - *[dragleave](https://codemirror.net/doc/manual.html#event_dom)*
- `onDragStart(editor, event)` - *[dragstart](https://codemirror.net/doc/manual.html#event_dom)*
- `onDrop(editor, event)` - *[drop](https://codemirror.net/doc/manual.html#event_dom)*
- `onFocus(editor, event)` - *[focus](https://codemirror.net/doc/manual.html#event_focus)*
- `onGutterClick(editor, lineNumber, gutter, event)` - *[gutterClick](https://codemirror.net/doc/manual.html#event_gutterClick)*
- `onKeyDown(editor, event)` - *[keydown](https://codemirror.net/doc/manual.html#event_dom)*
- `onKeyPress(editor, event)` - *[keypress](https://codemirror.net/doc/manual.html#event_dom)*
- `onKeyUp(editor, event)` - *[keyup](https://codemirror.net/doc/manual.html#event_dom)*
- `onMouseDown(editor, event)` - *[mousedown](https://codemirror.net/doc/manual.html#event_dom)*
- `onPaste(editor, event)` - *[paste](https://codemirror.net/doc/manual.html#event_dom)*
- `onScroll(editor, data)` - *[scroll](https://codemirror.net/doc/manual.html#event_scroll)*
- `onSelection(editor, data)` - *[beforeSelectionChange](https://codemirror.net/doc/manual.html#event_doc_beforeSelectionChange)*
- `onTouchStart(editor, event)` - *[touchstart](https://codemirror.net/doc/manual.html#event_dom)*
- `onUpdate(editor, event)` - *[update](https://codemirror.net/doc/manual.html#event_update)*
- `onViewportChange(editor, from, to)` - *[viewportChange](https://codemirror.net/doc/manual.html#event_viewportChange)*

## FAQ

- Is server side rendering supported?

Yes. react-codemirror2 will prevent rendering in absence of `navigator`. You can also force the component to not render via a `PREVENT_CODEMIRROR_RENDER` global.

- How can I get the instance?

The recommended technique to get the instance is to persist the `editor` returned via event callbacks. There is no static method to get it on demand, e.g. `CodeMirror.getInstance()`. Example...

```jsx
constructor() {
  this.instance = null;
}

render() {
  <CodeMirror editorDidMount={editor => { this.instance = editor }}/>
}
```

- How can I have a resizable editor?

Check out [bokuweb/re-resizable](https://github.com/bokuweb/re-resizable). Wrapping your component with `<Resizable/>'s` works well

## Contributing

Pull Requests are welcome. Be mindful of the availbe scripts below to help submitting a well-received contribution.

- `npm run start` to run the app on `localhost:8000`
- `npm run webpack` to re-bundle the react app
- `npm run test` to ensure tests continue to pass
- `npm run build` to generate the demo bundle

note that it's necessary to bump the [package.json](https://github.com/scniro/react-codemirror2/blob/master/package.json#L3) version prior to final `npm run build` so we can grab the proposed new version as seen in the demo header. Also note, the core changes are to be made in `src/index.tsx` as `./index.js` and `./index.d.ts` are _generated_

[MIT](./LICENSE) © 2018 [scniro](https://github.com/scniro)
