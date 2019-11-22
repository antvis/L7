import React from 'react'
import { Component } from 'react'
import connect from '../decorators/connect';


@connect(Component)
export default class DecoratedComponent extends React.Component {
  render() {
    return <div></div>
  }
}