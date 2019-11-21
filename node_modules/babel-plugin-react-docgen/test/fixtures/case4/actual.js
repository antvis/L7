import React from 'react';

const Button = ({ children, onClick, style = {} }) => {
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

export default Button;

let A;
A = [1,2,2,2];

function abc() {
  let c = function cef() {
    A = 'str';
  };
}
