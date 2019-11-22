import React from 'react';

export const Button = ({ children, onClick, style = {} }) => {
  return (
      <button
    style={{ }}
    onClick={onClick}
      >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  style: React.PropTypes.object,
};