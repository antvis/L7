function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import PropTypes from 'prop-types';
import CSSMotionList from "rc-animate/es/CSSMotionList";
import Selection from './Selection';
import SearchInput from '../../SearchInput';
var NODE_SELECTOR = 'selector';
var NODE_SEARCH = 'search';
var TREE_SELECT_EMPTY_VALUE_KEY = 'RC_TREE_SELECT_EMPTY_VALUE_KEY';

var SelectorList = function SelectorList(props) {
  var selectorValueList = props.selectorValueList,
      choiceTransitionName = props.choiceTransitionName,
      prefixCls = props.prefixCls,
      onChoiceAnimationLeave = props.onChoiceAnimationLeave,
      labelInValue = props.labelInValue,
      maxTagCount = props.maxTagCount,
      maxTagPlaceholder = props.maxTagPlaceholder,
      showSearch = props.showSearch,
      valueEntities = props.valueEntities,
      inputRef = props.inputRef,
      onMultipleSelectorRemove = props.onMultipleSelectorRemove;
  var nodeKeys = []; // Check if `maxTagCount` is set

  var myValueList = selectorValueList;

  if (maxTagCount >= 0) {
    myValueList = selectorValueList.slice(0, maxTagCount);
  } // Basic selectors


  myValueList.forEach(function (_ref) {
    var label = _ref.label,
        value = _ref.value;

    var _ref2 = (valueEntities[value] || {}).node || {},
        _ref2$props = _ref2.props;

    _ref2$props = _ref2$props === void 0 ? {} : _ref2$props;
    var disabled = _ref2$props.disabled;
    nodeKeys.push({
      key: value,
      type: NODE_SELECTOR,
      label: label,
      value: value,
      disabled: disabled
    });
  }); // Rest node count

  if (maxTagCount >= 0 && maxTagCount < selectorValueList.length) {
    var content = "+ ".concat(selectorValueList.length - maxTagCount, " ...");

    if (typeof maxTagPlaceholder === 'string') {
      content = maxTagPlaceholder;
    } else if (typeof maxTagPlaceholder === 'function') {
      var restValueList = selectorValueList.slice(maxTagCount);
      content = maxTagPlaceholder(labelInValue ? restValueList : restValueList.map(function (_ref3) {
        var value = _ref3.value;
        return value;
      }));
    }

    nodeKeys.push({
      key: 'rc-tree-select-internal-max-tag-counter',
      type: NODE_SELECTOR,
      label: content,
      value: null,
      disabled: true
    });
  } // Search node


  if (showSearch !== false) {
    nodeKeys.push({
      key: '__input',
      type: NODE_SEARCH
    });
  }

  return React.createElement(CSSMotionList, {
    keys: nodeKeys,
    className: "".concat(prefixCls, "-selection__rendered"),
    component: "ul",
    role: "menubar",
    motionName: choiceTransitionName,
    onLeaveEnd: onChoiceAnimationLeave
  }, function (_ref4) {
    var type = _ref4.type,
        label = _ref4.label,
        value = _ref4.value,
        disabled = _ref4.disabled,
        className = _ref4.className,
        style = _ref4.style;

    if (type === NODE_SELECTOR) {
      return React.createElement(Selection, _extends({}, props, {
        className: className,
        style: style,
        key: value || TREE_SELECT_EMPTY_VALUE_KEY,
        label: label,
        value: value,
        onRemove: disabled ? null : onMultipleSelectorRemove
      }));
    }

    return React.createElement("li", {
      className: "".concat(prefixCls, "-search ").concat(prefixCls, "-search--inline")
    }, React.createElement(SearchInput, _extends({}, props, {
      ref: inputRef,
      needAlign: true
    })));
  });
};

SelectorList.propTypes = {
  selectorValueList: PropTypes.array,
  choiceTransitionName: PropTypes.string,
  prefixCls: PropTypes.string,
  onChoiceAnimationLeave: PropTypes.func,
  labelInValue: PropTypes.bool,
  showSearch: PropTypes.bool,
  maxTagCount: PropTypes.number,
  maxTagPlaceholder: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  valueEntities: PropTypes.object,
  inputRef: PropTypes.func,
  onMultipleSelectorRemove: PropTypes.func
};
export default SelectorList;