import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import DateTable from './date/DateTable';
import MonthTable from './month/MonthTable';
import { calendarMixinWrapper, calendarMixinPropTypes, calendarMixinDefaultProps, getNowByCurrentStateValue } from './mixin/CalendarMixin';
import { commonMixinWrapper, propType, defaultProp } from './mixin/CommonMixin';
import CalendarHeader from './full-calendar/CalendarHeader';
import moment from 'moment';

var FullCalendar = function (_React$Component) {
  _inherits(FullCalendar, _React$Component);

  function FullCalendar(props) {
    _classCallCheck(this, FullCalendar);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    var type = void 0;
    if ('type' in props) {
      type = props.type;
    } else {
      type = props.defaultType;
    }

    _this.state = {
      type: type,
      value: props.value || props.defaultValue || moment(),
      selectedValue: props.selectedValue || props.defaultSelectedValue
    };
    return _this;
  }

  FullCalendar.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, state) {
    var newState = {};
    var value = nextProps.value,
        selectedValue = nextProps.selectedValue;


    if ('type' in nextProps) {
      newState = {
        type: nextProps.type
      };
    }
    if ('value' in nextProps) {
      newState.value = value || nextProps.defaultValue || getNowByCurrentStateValue(state.value);
    }
    if ('selectedValue' in nextProps) {
      newState.selectedValue = selectedValue;
    }

    return newState;
  };

  FullCalendar.prototype.render = function render() {
    var props = this.props;
    var locale = props.locale,
        prefixCls = props.prefixCls,
        fullscreen = props.fullscreen,
        showHeader = props.showHeader,
        headerComponent = props.headerComponent,
        headerRender = props.headerRender,
        disabledDate = props.disabledDate;
    var _state = this.state,
        value = _state.value,
        type = _state.type;


    var header = null;
    if (showHeader) {
      if (headerRender) {
        header = headerRender(value, type, locale);
      } else {
        var TheHeader = headerComponent || CalendarHeader;
        header = React.createElement(TheHeader, _extends({
          key: 'calendar-header'
        }, props, {
          prefixCls: prefixCls + '-full',
          type: type,
          value: value,
          onTypeChange: this.setType,
          onValueChange: this.setValue
        }));
      }
    }

    var table = type === 'date' ? React.createElement(DateTable, {
      dateRender: props.dateCellRender,
      contentRender: props.dateCellContentRender,
      locale: locale,
      prefixCls: prefixCls,
      onSelect: this.onSelect,
      value: value,
      disabledDate: disabledDate
    }) : React.createElement(MonthTable, {
      cellRender: props.monthCellRender,
      contentRender: props.monthCellContentRender,
      locale: locale,
      onSelect: this.onMonthSelect,
      prefixCls: prefixCls + '-month-panel',
      value: value,
      disabledDate: disabledDate
    });

    var children = [header, React.createElement(
      'div',
      { key: 'calendar-body', className: prefixCls + '-calendar-body' },
      table
    )];

    var className = [prefixCls + '-full'];

    if (fullscreen) {
      className.push(prefixCls + '-fullscreen');
    }

    return this.renderRoot({
      children: children,
      className: className.join(' ')
    });
  };

  return FullCalendar;
}(React.Component);

FullCalendar.propTypes = _extends({}, calendarMixinPropTypes, propType, {
  defaultType: PropTypes.string,
  type: PropTypes.string,
  prefixCls: PropTypes.string,
  locale: PropTypes.object,
  onTypeChange: PropTypes.func,
  fullscreen: PropTypes.bool,
  monthCellRender: PropTypes.func,
  dateCellRender: PropTypes.func,
  showTypeSwitch: PropTypes.bool,
  Select: PropTypes.func.isRequired,
  headerComponents: PropTypes.array,
  headerComponent: PropTypes.object, // The whole header component
  headerRender: PropTypes.func,
  showHeader: PropTypes.bool,
  disabledDate: PropTypes.func,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  selectedValue: PropTypes.object,
  defaultSelectedValue: PropTypes.object
});
FullCalendar.defaultProps = _extends({}, calendarMixinDefaultProps, defaultProp, {
  defaultType: 'date',
  fullscreen: false,
  showTypeSwitch: true,
  showHeader: true,
  onTypeChange: function onTypeChange() {}
});

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onMonthSelect = function (value) {
    _this2.onSelect(value, {
      target: 'month'
    });
  };

  this.setType = function (type) {
    if (!('type' in _this2.props)) {
      _this2.setState({
        type: type
      });
    }
    _this2.props.onTypeChange(type);
  };
};

polyfill(FullCalendar);

export default calendarMixinWrapper(commonMixinWrapper(FullCalendar));