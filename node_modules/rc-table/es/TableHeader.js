import * as React from 'react';
import * as PropTypes from 'prop-types';
import TableHeaderRow from './TableHeaderRow';

function getHeaderRows(columns) {
  var currentRow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var rows = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  // eslint-disable-next-line no-param-reassign
  rows[currentRow] = rows[currentRow] || [];
  columns.forEach(function (column) {
    if (column.rowSpan && rows.length < column.rowSpan) {
      while (rows.length < column.rowSpan) {
        rows.push([]);
      }
    }

    var cell = {
      key: column.key,
      className: column.className || '',
      children: column.title,
      column: column
    };

    if (column.children) {
      getHeaderRows(column.children, currentRow + 1, rows);
    }

    if ('colSpan' in column) {
      cell.colSpan = column.colSpan;
    }

    if ('rowSpan' in column) {
      cell.rowSpan = column.rowSpan;
    }

    if (cell.colSpan !== 0) {
      rows[currentRow].push(cell);
    }
  });
  return rows.filter(function (row) {
    return row.length > 0;
  });
}

var TableHeader = function TableHeader(props, _ref) {
  var table = _ref.table;
  var components = table.components;
  var _table$props = table.props,
      prefixCls = _table$props.prefixCls,
      showHeader = _table$props.showHeader,
      onHeaderRow = _table$props.onHeaderRow;
  var expander = props.expander,
      columns = props.columns,
      fixed = props.fixed;

  if (!showHeader) {
    return null;
  }

  var rows = getHeaderRows(columns);
  expander.renderExpandIndentCell(rows, fixed);
  var HeaderWrapper = components.header.wrapper;
  return React.createElement(HeaderWrapper, {
    className: "".concat(prefixCls, "-thead")
  }, rows.map(function (row, index) {
    return React.createElement(TableHeaderRow, {
      prefixCls: prefixCls,
      key: index,
      index: index,
      fixed: fixed,
      columns: columns,
      rows: rows,
      row: row,
      components: components,
      onHeaderRow: onHeaderRow
    });
  }));
};

TableHeader.contextTypes = {
  table: PropTypes.any
};
export default TableHeader;