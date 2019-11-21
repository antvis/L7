import React, { PropTypes } from 'react'

const Child = () => (
  <div>Sample</div>
)

function FuncDeclaration({ children }) {
  return (
    <div>
      {children}
      <Child />
    </div>
  )
}

FuncDeclaration.propTypes = {
  children: PropTypes.node
}

export default FuncDeclaration
