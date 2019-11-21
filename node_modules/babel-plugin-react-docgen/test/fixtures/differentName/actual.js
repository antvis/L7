import React, { PropTypes } from 'react'

const stylesheet = {};

/**
 * Component for displaying a container that resembles the original CSS environment for different themes
 */

class OriginalName extends Component () {
  static displayName = 'ThisIsTheDisplayNameNow'

  static propTypes = {
    /**
     * Theme to display
     */
    theme: PropTypes.string,
    /**
     * The component children
     */
    children: PropTypes.node
  }

  getDefaultProps() {
    return {
      theme: 'damask'
    };
  }

  render() {
    return (
      <div className={ stylesheet[this.props.theme] }>
        { this.props.children }
      </div>
    );
  }
}

module.exports = OriginalName;
