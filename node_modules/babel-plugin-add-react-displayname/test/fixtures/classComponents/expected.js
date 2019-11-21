var _class, _temp;

import React from 'react';
import { Component } from 'react';

export let Component3a = class Component3a extends React.Component {
  render() {
    return React.createElement('div', null);
  }
};

Component3a.displayName = 'Component3a';
let Component3b = class Component3b extends React.Component {
  render() {
    return React.createElement('div', null);
  }
};
Component3b.displayName = 'Component3b';
export { Component3b as default };


export let Component3c = class Component3c extends Component {
  render() {
    return React.createElement('div', null);
  }
};

Component3c.displayName = 'Component3c';
let Component3d = (_temp = _class = class Component3d extends Component {
  render() {
    return React.createElement('div', null);
  }
}, _class.get = () => {
  return React.createElement('div', null);
}, _temp);
Component3d.displayName = 'Component3d';
