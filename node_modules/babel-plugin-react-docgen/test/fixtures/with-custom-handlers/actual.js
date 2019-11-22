import React from 'react';
import './styles.css';

class ErrorBox extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <div className="error-box">
        {children}
      </div>
    );
  }
}

ErrorBox.propTypes = {
  /** @deprecated This is the description for prop */
  deprecatedProp: React.PropTypes.number,
};

export default ErrorBox;
