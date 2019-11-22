import _extends from 'babel-runtime/helpers/extends';
import * as React from 'react';
import Dialog from './Dialog';
import Portal from 'rc-util/es/PortalWrapper';
// fix issue #10656
/*
* getContainer remarks
* Custom container should not be return, because in the Portal component, it will remove the
* return container element here, if the custom container is the only child of it's component,
* like issue #10656, It will has a conflict with removeChild method in react-dom.
* So here should add a child (div element) to custom container.
* */
export default (function (props) {
    var visible = props.visible,
        getContainer = props.getContainer,
        forceRender = props.forceRender;
    // 渲染在当前 dom 里；

    if (getContainer === false) {
        return React.createElement(Dialog, _extends({}, props, { getOpenCount: function getOpenCount() {
                return 2;
            } }));
    }
    return React.createElement(Portal, { visible: visible, forceRender: forceRender, getContainer: getContainer }, function (childProps) {
        return React.createElement(Dialog, _extends({}, props, childProps));
    });
});