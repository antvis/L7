import React, { PropTypes } from 'react'

const Second = () => (
  <div>Sample</div>
)

const First = ({ children }) => (
  <div>
    { children }
    <Second />
  </div>
)

First.propTypes = {
  children: PropTypes.node
}

export default First
