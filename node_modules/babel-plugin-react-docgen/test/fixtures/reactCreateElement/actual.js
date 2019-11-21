import React from 'react';
import PropTypes from 'prop-types';

const Kitten = ({ isWide, isLong }) => React.createElement('img', { width: isWide ? '500' : '200', height: isLong ? '500' : '200', src: 'http://placekitten.com.s3.amazonaws.com/homepage-samples/200/287.jpg' });

Kitten.propTypes = {
  /** Whether the cat is wide */
  isWide: PropTypes.bool,
  /** Whether the cat is long */
  isLong: PropTypes.bool
};

Kitten.defaultProps = {
  isWide: false,
  isLong: false
};

export default Kitten;
