import React from 'react';
export function hoc (Inner) {
  const C1 = (props) => <ActualC1 {...props} />
  const C2 = (props) => <ActualC2 {...props} />
  return {
    C1,
    C2
  }
}

class ActualC1 extends React.Component {
  render() { return <div/> }
}

class ActualC2 extends React.Component {
  render() { return <div/> }
}
