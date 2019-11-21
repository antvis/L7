5.1.0
==================
* add support for `renderLine` (#98)


5.0.3
==================
* #88

5.0.2
==================


5.0.1
==================
* #78

5.0.0
==================
* #75 - remove `autoFocus` in favor of codemirror.options.autofocus

4.3.0
==================
* #74 => add support for more DOM events => onContextMenu | onCopy | onCut | onDblClick | onDragLeave | onDragStart | onMouseDown | onPaste | onTouchStart
* #76 => babel-ify index.js package for out of the box runtime support e.g. `Object.assign`

4.2.0
==================
* add notion of UnControlled#detach => [`editorDidAttach`, `editorDidDetach`] (related to #37)

4.1.0
==================
* https://github.com/scniro/react-codemirror2/issues/63
* add internal notion of `applied`, `appliedUserDefined`, `appliedNext` to isolate update flows for controlled v. uncontrolled
* test coverage

4.0.1
==================
* https://github.com/scniro/react-codemirror2/issues/61

4.0.0
==================
* cursor, scroll, and selection events occur after an internal hydrate
* cursor, scroll, and selection events have more strict checking and are more responsive for changed valued
* added `PREVENT_CODEMIRROR_RENDER` global for rendering bypass
* selections managed via props now have and isolated autofocus option
* optimization of setting instance options when updated via props
* https://github.com/scniro/react-codemirror2/issues/49
* test coverage

3.0.6
==================
* https://github.com/scniro/react-codemirror2/issues/28

3.0.5
==================
* https://github.com/scniro/react-codemirror2/issues/31 (take 2)

3.0.4
==================
* https://github.com/scniro/react-codemirror2/issues/31

3.0.3
==================
* https://github.com/scniro/react-codemirror2/pull/27

3.0.2
==================
* https://github.com/scniro/react-codemirror2/issues/22

3.0.1
==================
* fixes https://github.com/scniro/react-codemirror2/issues/25

3.0.0
==================
* typings
* [`onSet`, onBeforeSet`] deprecated [removed]
* [`resetCursorOnSet`, `autoScrollCursorOnSet`] deprecated, now => [`autoCursor`, `autoScroll`]
* add `autoFocus`
* modify return of `onSelection`: this.editor, data.ranges) now => (this.editor, data)
* split component into two per usage, `UnControlled` & `Controlled`
* fixes  https://github.com/scniro/react-codemirror2/issues/22

2.0.2
==================
* fixes https://github.com/scniro/react-codemirror2/issues/14
* remove deprecation warnings from 1.x

2.0.1
==================
* bump `peerDependencies` to support react 16.x

2.0.0
==================
* deprecate 1.x due to dependency conflicts occurring from over-strict versioning of codemirror as a `dependency`. Codemirror is now designated as a `peerDependency`

1.0.0
==================
* [`onValueSet`, `onValueChange`] deprecated, now => [`onSet`, `onChange`];
* add `onBeforeChange` `onBeforeSet`
* add `defineMode`
