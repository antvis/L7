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

export default withHoc()(deeperHoc(Component))

class CompA extends React.Component {
  render() { return null }
}

CompA.propTypes = {
  /** Fancy styles in here */
  myProp: React.PropTypes.object,
}

export { CompA }
