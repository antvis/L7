import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import toFragment from 'rc-util/es/Children/mapSelf';
import cx from 'classnames';
import TodayButton from '../calendar/TodayButton';
import OkButton from '../calendar/OkButton';
import TimePickerButton from '../calendar/TimePickerButton';

var CalendarFooter = function (_React$Component) {
  _inherits(CalendarFooter, _React$Component);

  function CalendarFooter() {
    _classCallCheck(this, CalendarFooter);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  CalendarFooter.prototype.onSelect = function onSelect(value) {
    this.props.onSelect(value);
  };

  CalendarFooter.prototype.getRootDOMNode = function getRootDOMNode() {
    return ReactDOM.findDOMNode(this);
  };

  CalendarFooter.prototype.render = function render() {
    var props = this.props;
    var value = props.value,
        prefixCls = props.prefixCls,
        showOk = props.showOk,
        timePicker = props.timePicker,
        renderFooter = props.renderFooter,
        mode = props.mode;

    var footerEl = null;
    var extraFooter = renderFooter && renderFooter(mode);
    if (props.showToday || timePicker || extraFooter) {
      var _cx;

      var nowEl = void 0;
      if (props.showToday) {
        nowEl = React.createElement(TodayButton, _extends({}, props, { value: value }));
      }
      var okBtn = void 0;
      if (showOk === true || showOk !== false && !!props.timePicker) {
        okBtn = React.createElement(OkButton, props);
      }
      var timePickerBtn = void 0;
      if (!!props.timePicker) {
        timePickerBtn = React.createElement(TimePickerButton, props);
      }

      var footerBtn = void 0;
      if (nowEl || timePickerBtn || okBtn || extraFooter) {
        footerBtn = React.createElement(
          'span',
          { className: prefixCls + '-footer-btn' },
          extraFooter,
          toFragment([nowEl, timePickerBtn, okBtn])
        );
      }
      var cls = cx(prefixCls + '-footer', (_cx = {}, _cx[prefixCls + '-footer-show-ok'] = okBtn, _cx));
      footerEl = React.createElement(
        'div',
        { className: cls },
        footerBtn
      );
    }
    return footerEl;
  };

  return CalendarFooter;
}(React.Component);

CalendarFooter.propTypes = {
  prefixCls: PropTypes.string,
  showDateInput: PropTypes.bool,
  disabledTime: PropTypes.any,
  timePicker: PropTypes.element,
  selectedValue: PropTypes.any,
  showOk: PropTypes.bool,
  onSelect: PropTypes.func,
  value: PropTypes.object,
  renderFooter: PropTypes.func,
  defaultValue: PropTypes.object,
  mode: PropTypes.string
};
export default CalendarFooter;