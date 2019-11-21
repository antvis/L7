'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Dialog = require('./Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _PortalWrapper = require('rc-util/lib/PortalWrapper');

var _PortalWrapper2 = _interopRequireDefault(_PortalWrapper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// fix issue #10656
/*
* getContainer remarks
* Custom container should not be return, because in the Portal component, it will remove the
* return container element here, if the custom container is the only child of it's component,
* like issue #10656, It will has a conflict with removeChild method in react-dom.
* So here should add a child (div element) to custom container.
* */
exports['default'] = function (props) {
    var visible = props.visible,
        getContainer = props.getContainer,
        forceRender = props.forceRender;
    // 渲染在当前 dom 里；

    if (getContainer === false) {
        return React.createElement(_Dialog2['default'], (0, _extends3['default'])({}, props, { getOpenCount: function getOpenCount() {
                return 2;
            } }));
    }
    return React.createElement(_PortalWrapper2['default'], { visible: visible, forceRender: forceRender, getContainer: getContainer }, function (childProps) {
        return React.createElement(_Dialog2['default'], (0, _extends3['default'])({}, props, childProps));
    });
};

module.exports = exports['default'];