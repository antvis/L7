# rc-table

React table component.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-table.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-table
[travis-image]: https://img.shields.io/travis/react-component/table.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/table
[codecov-image]: https://img.shields.io/codecov/c/github/react-component/table/master.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/react-component/table/branch/master
[download-image]: https://img.shields.io/npm/dm/rc-table.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-table

## install

[![rc-table](https://nodei.co/npm/rc-table.png)](https://npmjs.org/package/rc-table)

## Development

```
npm install
npm start
```

## Example

http://react-component.github.io/table/examples/

## Usage

```js
import Table from 'rc-table';

const columns = [{
  title: 'Name', dataIndex: 'name', key:'name', width: 100,
}, {
  title: 'Age', dataIndex: 'age', key:'age', width: 100,
}, {
  title: 'Address', dataIndex: 'address', key:'address', width: 200,
}, {
  title: 'Operations', dataIndex: '', key:'operations', render: () => <a href="#">Delete</a>,
}];

const data = [
  { name: 'Jack', age: 28, address: 'some where', key:'1' },
  { name: 'Rose', age: 36, address: 'some where', key:'2' },
];

React.render(<Table columns={columns} data={data} />, mountNode);
```

## API

### Properties

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th style="width: 100px;">Name</th>
      <th style="width: 50px;">Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>tableLayout</td>
      <td>'auto' | 'fixed'</td>
      <td>'auto', 'fixed' for any columns is fixed or ellipsis or header is fixed</td>
      <td>https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout</td>
    </tr>
    <tr>
      <td>prefixCls</td>
      <td>String</td>
      <td>rc-table</td>
      <td></td>
    </tr>
    <tr>
      <td>className</td>
      <td>String</td>
      <td></td>
      <td>additional className</td>
    </tr>
    <tr>
      <td>id</td>
      <td>String</td>
      <td></td>
      <td>identifier of the container div</td>
    </tr>
    <tr>
      <td>useFixedHeader</td>
      <td>Boolean</td>
      <td>false</td>
      <td>whether use separator table for header. better set width for columns</td>
    </tr>
    <tr>
      <td>scroll</td>
      <td>Object</td>
      <td>{x: false, y: false}</td>
      <td>whether table can be scroll in x/y direction, `x` or `y` can be a number that indicated the width and height of table body</td>
    </tr>
    <tr>
      <td>expandIconAsCell</td>
      <td>Boolean</td>
      <td>false</td>
      <td>whether render expandIcon as a cell</td>
    </tr>
    <tr>
      <td>expandIconColumnIndex</td>
      <td>Number</td>
      <td>0</td>
      <td>The index of expandIcon which column will be inserted when expandIconAsCell is false</td>
    </tr>
    <tr>
      <td>rowKey</td>
      <td>string or Function(record):string</td>
      <td>'key'</td>
      <td>
        If rowKey is string, `record[rowKey]` will be used as key.
        If rowKey is function, the return value of `rowKey(record)` will be use as key.
      </td>
    </tr>
    <tr>
      <td>rowClassName</td>
      <td>string or Function(record, index, indent):string</td>
      <td></td>
      <td>get row's className</td>
    </tr>
    <tr>
      <td>rowRef</td>
      <td>Function(record, index, indent):string</td>
      <td></td>
      <td>get row's ref key</td>
    </tr>
    <tr>
      <td>defaultExpandedRowKeys</td>
      <td>String[]</td>
      <td>[]</td>
      <td>initial expanded rows keys</td>
    </tr>
    <tr>
      <td>expandedRowKeys</td>
      <td>String[]</td>
      <td></td>
      <td>current expanded rows keys</td>
    </tr>
    <tr>
      <td>defaultExpandAllRows</td>
      <td>Boolean</td>
      <td>false</td>
      <td>Expand All Rows initially</td>
    </tr>
    <tr>
      <td>onExpandedRowsChange</td>
      <td>Function(expandedRows)</td>
      <td>save the expanded rows in the internal state</td>
      <td>function to call when the expanded rows change</td>
    </tr>
    <tr>
      <td>onExpand</td>
      <td>Function(expanded, record)</td>
      <td></td>
      <td>function to call when click expand icon</td>
    </tr>
    <tr>
      <td>expandedRowClassName</td>
      <td>Function(recode, index, indent):string</td>
      <td></td>
      <td>get expanded row's className</td>
    </tr>
    <tr>
      <td>expandedRowRender</td>
      <td>Function(recode, index, indent, expanded):ReactNode</td>
      <td></td>
      <td>Content render to expanded row</td>
    </tr>
    <tr>
      <td>data</td>
      <td>Object[]</td>
      <td></td>
      <td>data record array to be rendered</td>
    </tr>
    <tr>
      <td>indentSize</td>
      <td>Number</td>
      <td>15</td>
      <td>indentSize for every level of data.i.children, better using with column.width specified</td>
    </tr>
    <tr>
      <td>onRowClick[deprecated]</td>
      <td>Function(record, index)</td>
      <td></td>
      <td>handle rowClick action, index means the index of current row among fatherElement[childrenColumnName]</td>
    </tr>
    <tr>
      <td>onRowDoubleClick[deprecated]</td>
      <td>Function(record, index)</td>
      <td></td>
      <td>handle rowDoubleClick action, index means the index of current row among fatherElement[childrenColumnName]</td>
    </tr>
    <tr>
      <td>onRowMouseEnter[deprecated]</td>
      <td>Function(record, index)</td>
      <td></td>
      <td>handle onRowMouseEnter action, index means the index of current row among fatherElement[childrenColumnName]</td>
    </tr>
    <tr>
      <td>onRowMouseLeave[deprecated]</td>
      <td>Function(record, index)</td>
      <td></td>
      <td>handle onRowMouseLeave action, index means the index of current row among fatherElement[childrenColumnName]</td>
    </tr>
    <tr>
      <td>onRow</td>
      <td>Function(record, index)</td>
      <td></td>
      <td>Set custom props per each row.</td>
    </tr>
    <tr>
      <td>onHeaderRow</td>
      <td>Function(record, index)</td>
      <td></td>
      <td>Set custom props per each header row.</td>
    </tr>
    <tr>
      <td>showHeader</td>
      <td>Boolean</td>
      <td>true</td>
      <td>whether table head is shown</td>
    </tr>
    <tr>
      <td>title</td>
      <td>Function(currentData)</td>
      <td></td>
      <td>table title render function</td>
    </tr>
    <tr>
      <td>footer</td>
      <td>Function(currentData)</td>
      <td></td>
      <td>table footer render function</td>
    </tr>
    <tr>
      <td>getBodyWrapper[deprecated]</td>
      <td>Function(body)</td>
      <td></td>
      <td>get wrapper of tbody, [demo](http://react-component.github.io/table/examples/animation.html)</td>
    </tr>
    <tr>
      <td>emptyText</td>
      <td>React.Node or Function</td>
      <td>`No Data`</td>
      <td>Display text when data is empty</td>
    </tr>
    <tr>
      <td>columns</td>
      <td>Object[]<Object></td>
      <td></td>
      <td>
        The columns config of table, see table below
      </td>
    </tr>
    <tr>
      <td>components</td>
      <td>Object</td>
      <td></td>
      <td>
        Override table elements, see [#171](https://github.com/react-component/table/pull/171) for more details
      </td>
    </tr>
  </tbody>
</table>

## Column Props

<table>
  <thead>
    <tr>
      <th style="width: 100px;">Name</th>
      <th style="width: 50px;">Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>key</td>
      <td>String</td>
      <td></td>
      <td>key of this column</td>
    </tr>
    <tr>
      <td>className</td>
      <td>String</td>
      <td></td>
      <td>className of this column</td>
    </tr>
    <tr>
      <td>colSpan</td>
      <td>Number</td>
      <td></td>
      <td>thead colSpan of this column</td>
    </tr>
    <tr>
      <td>title</td>
      <td>React Node</td>
      <td></td>
      <td>title of this column</td>
    </tr>
    <tr>
      <td>dataIndex</td>
      <td>String</td>
      <td></td>
      <td>display field of the data record</td>
    </tr>
    <tr>
      <td>width</td>
      <td>String|Number</td>
      <td></td>
      <td>width of the specific proportion calculation according to the width of the columns</td>
    </tr>
    <tr>
      <td>fixed</td>
      <td>String|Boolean</td>
      <td></td>
      <td>this column will be fixed when table scroll horizontally: true or 'left' or 'right'</td>
    </tr>
    <tr>
      <td>align</td>
      <td>String</td>
      <td></td>
      <td>specify how cell content is aligned</td>
    </tr>
    <tr>
      <td>ellipsis</td>
      <td>Boolean</td>
      <td></td>
      <td>specify whether cell content be ellipsized</td>
    </tr>
    <tr>
      <td>onCell</td>
      <td>Function(record, index)</td>
      <td></td>
      <td>Set custom props per each cell.</td>
    </tr>
    <tr>
      <td>onHeaderCell</td>
      <td>Function(record)</td>
      <td></td>
      <td>Set custom props per each header cell.</td>
    </tr>
    <tr>
      <td>render</td>
      <td>Function(value, row, index)</td>
      <td></td>
      <td>The render function of cell, has three params: the text of this cell, the record of this row, the index of this row, it's return an object:{ children: value, props: { colSpan: 1, rowSpan:1 } } ==> 'children' is the text of this cell, props is some setting of this cell, eg: 'colspan' set td colspan, 'rowspan' set td rowspan</td>
    </tr>
    <tr>
      <td>onCellClick[deprecated]</td>
      <td>Function(row, event)</td>
      <td></td>
      <td>Called when column's cell is clicked</td>
    </tr>
  </tbody>
</table>

## License

rc-table is released under the MIT license.
