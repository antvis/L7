import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
var ROW = 4;
var COL = 3;
import classnames from 'classnames';

function goYear(direction) {
  var next = this.state.value.clone();
  next.add(direction, 'years');
  this.setState({
    value: next
  });
}

function chooseDecade(year, event) {
  var next = this.state.value.clone();
  next.year(year);
  next.month(this.state.value.month());
  this.props.onSelect(next);
  event.preventDefault();
}

var DecadePanel = function (_React$Component) {
  _inherits(DecadePanel, _React$Component);

  function DecadePanel(props) {
    _classCallCheck(this, DecadePanel);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      value: props.value || props.defaultValue
    };

    // bind methods
    _this.prefixCls = props.rootPrefixCls + '-decade-panel';
    _this.nextCentury = goYear.bind(_this, 100);
    _this.previousCentury = goYear.bind(_this, -100);
    return _this;
  }

  DecadePanel.prototype.render = function render() {
    var _this2 = this;

    var value = this.state.value;
    var _props = this.props,
        locale = _props.locale,
        renderFooter = _props.renderFooter;

    var currentYear = value.year();
    var startYear = parseInt(currentYear / 100, 10) * 100;
    var preYear = startYear - 10;
    var endYear = startYear + 99;
    var decades = [];
    var index = 0;
    var prefixCls = this.prefixCls;

    for (var rowIndex = 0; rowIndex < ROW; rowIndex++) {
      decades[rowIndex] = [];
      for (var colIndex = 0; colIndex < COL; colIndex++) {
        var startDecade = preYear + index * 10;
        var endDecade = preYear + index * 10 + 9;
        decades[rowIndex][colIndex] = {
          startDecade: startDecade,
          endDecade: endDecade
        };
        index++;
      }
    }

    var footer = renderFooter && renderFooter('decade');

    var decadesEls = decades.map(function (row, decadeIndex) {
      var tds = row.map(function (decadeData) {
        var _classNameMap;

        var dStartDecade = decadeData.startDecade;
        var dEndDecade = decadeData.endDecade;
        var isLast = dStartDecade < startYear;
        var isNext = dEndDecade > endYear;
        var classNameMap = (_classNameMap = {}, _classNameMap[prefixCls + '-cell'] = 1, _classNameMap[prefixCls + '-selected-cell'] = dStartDecade <= currentYear && currentYear <= dEndDecade, _classNameMap[prefixCls + '-last-century-cell'] = isLast, _classNameMap[prefixCls + '-next-century-cell'] = isNext, _classNameMap);
        var content = dStartDecade + '-' + dEndDecade;
        var clickHandler = void 0;
        if (isLast) {
          clickHandler = _this2.previousCentury;
        } else if (isNext) {
          clickHandler = _this2.nextCentury;
        } else {
          clickHandler = chooseDecade.bind(_this2, dStartDecade);
        }
        return React.createElement(
          'td',
          {
            key: dStartDecade,
            onClick: clickHandler,
            role: 'gridcell',
            className: classnames(classNameMap)
          },
          React.createElement(
            'a',
            {
              className: prefixCls + '-decade'
            },
            content
          )
        );
      });
      return React.createElement(
        'tr',
        { key: decadeIndex, role: 'row' },
        tds
      );
    });

    return React.createElement(
      'div',
      { className: this.prefixCls },
      React.createElement(
        'div',
        { className: prefixCls + '-header' },
        React.createElement('a', {
          className: prefixCls + '-prev-century-btn',
          role: 'button',
          onClick: this.previousCentury,
          title: locale.previousCentury
        }),
        React.createElement(
          'div',
          { className: prefixCls + '-century' },
          startYear,
          '-',
          endYear
        ),
        React.createElement('a', {
          className: prefixCls + '-next-century-btn',
          role: 'button',
          onClick: this.nextCentury,
          title: locale.nextCentury
        })
      ),
      React.createElement(
        'div',
        { className: prefixCls + '-body' },
        React.createElement(
          'table',
          { className: prefixCls + '-table', cellSpacing: '0', role: 'grid' },
          React.createElement(
            'tbody',
            { className: prefixCls + '-tbody' },
            decadesEls
          )
        )
      ),
      footer && React.createElement(
        'div',
        { className: prefixCls + '-footer' },
        footer
      )
    );
  };

  return DecadePanel;
}(React.Component);

export default DecadePanel;


DecadePanel.propTypes = {
  locale: PropTypes.object,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  rootPrefixCls: PropTypes.string,
  renderFooter: PropTypes.func
};

DecadePanel.defaultProps = {
  onSelect: function onSelect() {}
};