var _dec, _class;

import React from 'react';
import { Component } from 'react';
import connect from '../decorators/connect';

let DecoratedComponent = (_dec = connect(Component), _dec(_class = class DecoratedComponent extends React.Component {
  render() {
    return React.createElement('div', null);
  }
}) || _class);
DecoratedComponent.displayName = 'DecoratedComponent';
export { DecoratedComponent as default };
