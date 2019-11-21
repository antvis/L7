# History
---

## 2.9.0 / 2019-04-30

- Use CSSMotion of `rc-animate` to make motion pure.

## 2.8.0 / 2019-04-26

- Upgrade `rc-tree` deps version to `2.0.0`.

## 2.6.0

- selected value will always display in popup.

## 2.5.0

- `notFoundContent` type change to `PropTypes.node`

## 2.4.0

- `onSearch` will also trigger when user select item makes searchValue auto clear
- `treeExpandedKeys` will be restore when TreeSelect exit filter mode.
- `loadData` will not trigger when in filter mode.

## 2.3.0

- Add `treeExpandedKeys`
- Add `onTreeExpand`

## 2.2.0

- Allow custom icon (#120)

## 2.1.0

- upgrade rc-tree to 1.14.x (#121)

## 2.0.0

- Refactor TreeSelect. [#113](https://github.com/react-component/tree-select/pull/113)

## 1.12.0 / 2017-11-15

- Add `focus()` `blur()` `onFocus` `onBlur` and `autoFocus`.

## 1.10.0 / 2017-05-18

- Add `allowClear` to multiple.
- Pass all props of tree item to TreeNode

## 1.7.0 / 2016-05-20
- add `inputValue` api.

### break change
- search item and select it, will save search text and result.

## 1.6.0-beta / 2016-05-03
- add `treeDataSimpleMode` api.

## 1.5.2 / 2016-04-02
- `skipHandleInitValue` is deprecated, use `treeCheckStrictly` instead.

## 1.4.0 / 2016-03-14
- change `showAllChecked`/`showParentChecked` to `showCheckedStrategy`.

## 1.3.0 / 2016-03-14
- add `showAllChecked`/`showParentChecked` API.

## 1.2.0 / 2016-02-29
- change onChange's third parameter, from flat array to tree's hierarchical structure.

## 1.1.x / 2016-02-26
- stable version
