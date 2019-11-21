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
  children: React.PropTypes.node.isRequired,
};

export default ErrorBox;
