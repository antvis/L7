# History
----

## 6.9.0 / 2019-10-18

- Rewrite in typescript
- Fix `scroll={{ x: 'max-content' }}` not working.

## 6.8.0 / 2019-09-03

- Add `tableLayout`, could be set to `fixed`: https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout
- Add `column.ellipsis` to ellipsize cell content.

## 6.7.0 / 2019-07-22

- Show icon if using `expandIcon` even if `expandRowByClick` is set

## 6.6.0 / 2019-06-04

- Fixed Table header extra vertial scrollbar style.

## 6.5.0 / 2019-04-20

- Add internal interface for col definition.

## 6.4.0 / 2018-10-15

- Render data- and aria- props [#227](https://github.com/react-component/table/pull/227)
- onCell add row index [#222](https://github.com/react-component/table/pull/222)
- Add expandIcon [#236](https://github.com/react-component/table/pull/236)

## 6.3.1 / 2018-08-02

- Revert [112346](https://github.com/react-component/table/commit/112346ca75e8057771cf70fc8fde4bf5f63ce2e8) since too many edge cases.

## 6.3.0 / 2018-08-02

- Fixed header will read cell width from body.

## 6.2.0 / 2018-05-09

- Add `expanded` as the fourth parameter to `expandedRowRender`.

## 6.0.0 / 2017-11-14

- Refactor.
- Allow override default examples.
- Add Table[onRow] and column[onCell].
- Add column[align].

## 5.6.0 / 2017-08-27

- Better empty data style for fixed-columns Table.

## 5.5.0 / 2017-08-17

- Add `onRowContextMenu`

## 5.4.0 / 2017-05-23

- Add `onRowMouseEnter`, `onRowMouseLeave`.

## 5.3.0 / 2017-04-06

- `emptyText` support React.Node

## 5.0.0 / 2016-09-07

- Remove props `columnsPageSize` and `columnsPageRange`, use fixed columns instead.
- Add prop `onRowDoubleClick`.
- Improve perfermance when expand row.

## 4.6.0 / 2016-08-29

Add prop `emptyText`.

## 4.5.3 / 2016-08-24

[#76](https://github.com/react-component/table/pull/76)

## 4.5.2 / 2016-08-23

Add `indent` as third argument to `rowClassName` `rowRef` `expandRowClassName`。

## 4.5.1 / 2016-08-19

Add original event param for `onRowClick`

## 4.5.0 / 2016-08-17

Add `expandRowByClicky` prop, allow expanding the row by clicking it.

## 4.4.7 / 2016-08-16

Fix https://github.com/ant-design/ant-design/issues/2729

## 4.4.6 / 2016-08-05

Fix https://github.com/ant-design/ant-design/issues/2625

## 4.4.2 / 2016-08-01

- Improve row and cell render perfermance.

## 4.4.1 / 2016-07-24

-  Fix row expand of key 0 record. (ant-design/ant-design#2471)

## 4.4.0 / 2016-07-19

- Add `title` prop [demo](http://react-component.github.io/table/examples/title-and-footer.html)
- Add `getBodyWrapper` prop [demo](http://react-component.github.io/table/examples/animation.html)
- Use `maxHeight` for fixed-header Table [#65](https://github.com/react-component/table/issues/65)

## 4.3.0 / 2016-06-20

- support `rowKey="uid"`

## 4.2.0 / 2016-06-16

- Header can be scroll in fixed-columns Table

## 4.1.0 / 2016-06-01

- Support nested string of `dataIndex`
- Fix fixed Table with expand row

## 4.0.0 / 2016-04-18

- Support fixed columns
- Add `scroll` prop
- Add `defaultExpandAllRows` prop
- Add `onExpand` prop
- Add `rowRef` prop

## 3.11.0 / 2016-02-25

- Add prop `showHeader`
- support render footer via `footer={() => <div>xxx</div>}`

## 3.10.0 / 2016-02-22

- Add prop expandIconColumnIndex

## 3.9.0 / 2016-01-19

- support pinned and paging columns.

## 3.8.0

- Add `onRowClick`

## 3.7.0

- Add `childenIndent`

## 3.6.0 / 2015-11-11

- add defaultExpandedRowKeys/expandedRowKeys/onExpandedRowsChange prop

## 3.5.0 / 2015-11-03

- Add colSpan and rowSpan support

## 3.3.0 / 2015-10-27

- support react 0.14

## 3.2.0 / 2015-09-09

- add expandIconAsCell prop
