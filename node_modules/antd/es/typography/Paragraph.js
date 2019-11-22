function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import Base from './Base';

var Paragraph = function Paragraph(props) {
  return React.createElement(Base, _extends({}, props, {
    component: "div"
  }));
};

export default Paragraph;
//# sourceMappingURL=Paragraph.js.map
