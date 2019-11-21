import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

import React from 'react';
import DateTHead from './DateTHead';
import DateTBody from './DateTBody';

var DateTable = function (_React$Component) {
  _inherits(DateTable, _React$Component);

  function DateTable() {
    _classCallCheck(this, DateTable);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  DateTable.prototype.render = function render() {
    var props = this.props;
    var prefixCls = props.prefixCls;
    return React.createElement(
      'table',
      { className: prefixCls + '-table', cellSpacing: '0', role: 'grid' },
      React.createElement(DateTHead, props),
      React.createElement(DateTBody, props)
    );
  };

  return DateTable;
}(React.Component);

export default DateTable;