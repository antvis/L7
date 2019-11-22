const React = require('react');
const { PropTypes } = React;

const stylesheet = {};

/**
 * Component for displaying a container that resembles the original CSS environment for different themes
 */

const ComponentWrapper = React.createClass({
  propTypes: {
    /**
     * Theme to display
     */
    theme: PropTypes.string
  },

  getDefaultProps() {
    return {
      theme: 'damask'
    };
  },

  render() {
    return (
      <div className={ stylesheet[this.props.theme] }>
        <div className={ stylesheet.container }>
          { this.props.children }
        </div>
      </div>
    );
  }
});

module.exports = ComponentWrapper;
