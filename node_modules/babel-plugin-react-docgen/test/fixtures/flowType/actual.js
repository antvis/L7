// @flow
import React from 'react'

type PropsType = {
  /** The text to be rendered in the button */
  label: number,
  /** Some other prop */
  thing?: string,
}

class FlowTypeButton extends React.Component<PropsType> {
  /**
   * handle click number of times clicked and update parent component via callback
   * @return  {string} returns nothing but at least this makes it into docgen
   */
  handleClick = (bar?: string) => {
    console.log(bar);
  };

  render() {
    return <button onClick={this.handleClick}>{this.props.label}</button>
  }
}

export default FlowTypeButton
