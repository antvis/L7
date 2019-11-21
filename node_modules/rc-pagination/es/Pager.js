import _defineProperty from 'babel-runtime/helpers/defineProperty';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

var Pager = function Pager(props) {
  var _classNames;

  var prefixCls = props.rootPrefixCls + '-item';
  var cls = classNames(prefixCls, prefixCls + '-' + props.page, (_classNames = {}, _defineProperty(_classNames, prefixCls + '-active', props.active), _defineProperty(_classNames, props.className, !!props.className), _defineProperty(_classNames, prefixCls + '-disabled', !props.page), _classNames));

  var handleClick = function handleClick() {
    props.onClick(props.page);
  };

  var handleKeyPress = function handleKeyPress(e) {
    props.onKeyPress(e, props.onClick, props.page);
  };

  return React.createElement(
    'li',
    {
      title: props.showTitle ? props.page : null,
      className: cls,
      onClick: handleClick,
      onKeyPress: handleKeyPress,
      tabIndex: '0'
    },
    props.itemRender(props.page, 'page', React.createElement(
      'a',
      null,
      props.page
    ))
  );
};

Pager.propTypes = {
  page: PropTypes.number,
  active: PropTypes.bool,
  last: PropTypes.bool,
  locale: PropTypes.object,
  className: PropTypes.string,
  showTitle: PropTypes.bool,
  rootPrefixCls: PropTypes.string,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func,
  itemRender: PropTypes.func
};

export default Pager;