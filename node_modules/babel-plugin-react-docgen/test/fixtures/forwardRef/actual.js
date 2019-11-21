import React from 'react';

/**
 * forwardRef Wrapped Component
 */
const ErrorBox = React.forwardRef(({ children, color }, ref) => {
  return (
    <div className="error-box" style={{ color }}>
      {children}
    </div>
  );
});

ErrorBox.displayName = 'ErrorBox';

ErrorBox.defaultProps = {
  color: 'red'
}

ErrorBox.propTypes = {
  /**
   * Children
   */
  children: React.PropTypes.node.isRequired,

  /**
   * Color
   */
  color: React.PropTypes.oneOf(['red', 'green', 'blue'])
};

export { ErrorBox }
