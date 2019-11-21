import * as React from 'react';
import * as PropTypes from 'prop-types';
import { INTERNAL_COL_DEFINE } from './utils';

var ColGroup = function ColGroup(props, _ref) {
  var table = _ref.table;
  var _table$props = table.props,
      prefixCls = _table$props.prefixCls,
      expandIconAsCell = _table$props.expandIconAsCell;
  var fixed = props.fixed;
  var cols = [];

  if (expandIconAsCell && fixed !== 'right') {
    cols.push(React.createElement("col", {
      className: "".concat(prefixCls, "-expand-icon-col"),
      key: "rc-table-expand-icon-col"
    }));
  }

  var leafColumns;

  if (fixed === 'left') {
    leafColumns = table.columnManager.leftLeafColumns();
  } else if (fixed === 'right') {
    leafColumns = table.columnManager.rightLeafColumns();
  } else {
    leafColumns = table.columnManager.leafColumns();
  }

  cols = cols.concat(leafColumns.map(function (_ref2) {
    var key = _ref2.key,
        dataIndex = _ref2.dataIndex,
        width = _ref2.width,
        additionalProps = _ref2[INTERNAL_COL_DEFINE];
    var mergedKey = key !== undefined ? key : dataIndex;
    return React.createElement("col", Object.assign({
      key: mergedKey,
      style: {
        width: width,
        minWidth: width
      }
    }, additionalProps));
  }));
  return React.createElement("colgroup", null, cols);
};

ColGroup.contextTypes = {
  table: PropTypes.any
};
export default ColGroup;