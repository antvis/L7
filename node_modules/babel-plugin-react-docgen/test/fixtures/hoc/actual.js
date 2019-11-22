/**
 * Super tiny component
 */
class Component extends React.Component {
  render() { return null }
}

Component.propTypes = {
  /** Description for children */
  children: React.PropTypes.string.isRequired,
  /**
   * What happens onClick stays onClick
   */
  onClick: React.PropTypes.func,
  /** Fancy styles in here */
  style: React.PropTypes.object,
}

export default withHoc(Component)
