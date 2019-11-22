import React from 'react';

export const wrapComopnent = (Component) => {
  const WrappedComponent = props => (
    <Wrapper>
        <Component/>
    </Wrapper>
  );
  return WrappedComponent;
};

export class Wrapper extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <div className="error-box">
        {children}
      </div>
    );
  }
}

Wrapper.propTypes = {
  children: React.PropTypes.node.isRequired,
};
