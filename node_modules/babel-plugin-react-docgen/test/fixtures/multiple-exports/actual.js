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

class ErrorBox2 extends React.Component {
  render() {
    const { children2 } = this.props;

    return (
      <div className="error-box">
        {children2}
      </div>
    );
  }
}

ErrorBox2.propTypes = {
  children2: React.PropTypes.node.isRequired,
};

export { ErrorBox2 };
