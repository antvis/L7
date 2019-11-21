import React, {component} from 'react';

export default function Modal (component) {
  return class extends component {
    constructor (...args) {
      super(...args) ;
    }

    render() {
      return <div></div>;
    }

  }
}
