import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import MonthTable from './MonthTable';

function goYear(direction) {
  this.props.changeYear(direction);
}

function noop() {}

var MonthPanel = function (_React$Component) {
  _inherits(MonthPanel, _React$Component);

  function MonthPanel(props) {
    _classCallCheck(this, MonthPanel);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.setAndSelectValue = function (value) {
      _this.setValue(value);
      _this.props.onSelect(value);
    };

    _this.setValue = function (value) {
      if ('value' in _this.props) {
        _this.setState({
          value: value
        });
      }
    };

    _this.nextYear = goYear.bind(_this, 1);
    _this.previousYear = goYear.bind(_this, -1);
    _this.prefixCls = props.rootPrefixCls + '-month-panel';

    _this.state = {
      value: props.value || props.defaultValue
    };
    return _this;
  }

  MonthPanel.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
    var newState = {};

    if ('value' in props) {
      newState = {
        value: props.value
      };
    }

    return newState;
  };

  MonthPanel.prototype.render = function render() {
    var props = this.props;
    var value = this.state.value;
    var locale = props.locale,
        cellRender = props.cellRender,
        contentRender = props.contentRender,
        renderFooter = props.renderFooter;

    var year = value.year();
    var prefixCls = this.prefixCls;

    var footer = renderFooter && renderFooter('month');

    return React.createElement(
      'div',
      { className: prefixCls, style: props.style },
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: prefixCls + '-header' },
          React.createElement('a', {
            className: prefixCls + '-prev-year-btn',
            role: 'button',
            onClick: this.previousYear,
            title: locale.previousYear
          }),
          React.createElement(
            'a',
            {
              className: prefixCls + '-year-select',
              role: 'button',
              onClick: props.onYearPanelShow,
              title: locale.yearSelect
            },
            React.createElement(
              'span',
              { className: prefixCls + '-year-select-content' },
              year
            ),
            React.createElement(
              'span',
              { className: prefixCls + '-year-select-arrow' },
              'x'
            )
          ),
          React.createElement('a', {
            className: prefixCls + '-next-year-btn',
            role: 'button',
            onClick: this.nextYear,
            title: locale.nextYear
          })
        ),
        React.createElement(
          'div',
          { className: prefixCls + '-body' },
          React.createElement(MonthTable, {
            disabledDate: props.disabledDate,
            onSelect: this.setAndSelectValue,
            locale: locale,
            value: value,
            cellRender: cellRender,
            contentRender: contentRender,
            prefixCls: prefixCls
          })
        ),
        footer && React.createElement(
          'div',
          { className: prefixCls + '-footer' },
          footer
        )
      )
    );
  };

  return MonthPanel;
}(React.Component);

MonthPanel.propTypes = {
  onChange: PropTypes.func,
  disabledDate: PropTypes.func,
  onSelect: PropTypes.func,
  renderFooter: PropTypes.func,
  rootPrefixCls: PropTypes.string,
  value: PropTypes.object,
  defaultValue: PropTypes.object
};
MonthPanel.defaultProps = {
  onChange: noop,
  onSelect: noop
};


polyfill(MonthPanel);

export default MonthPanel;