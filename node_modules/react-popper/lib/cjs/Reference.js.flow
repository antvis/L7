// @flow
import * as React from 'react';
import warning from 'warning';
import { ManagerReferenceNodeSetterContext } from './Manager';
import { safeInvoke, unwrapArray, setRef } from './utils';
import { type Ref } from "./RefTypes";

export type ReferenceChildrenProps = { ref: Ref };
export type ReferenceProps = {
  children: ReferenceChildrenProps => React.Node,
  innerRef?: Ref,
};

type InnerReferenceProps = {
  setReferenceNode?: (?HTMLElement) => void,
};

class InnerReference extends React.Component<
  ReferenceProps & InnerReferenceProps
> {
  refHandler = (node: ?HTMLElement) => {
    setRef(this.props.innerRef, node)
    safeInvoke(this.props.setReferenceNode, node);
  };

  componentWillUnmount() {
    setRef(this.props.innerRef, null)
  }

  render() {
    warning(
      Boolean(this.props.setReferenceNode),
      '`Reference` should not be used outside of a `Manager` component.'
    );
    return unwrapArray(this.props.children)({ ref: this.refHandler });
  }
}

export default function Reference(props: ReferenceProps) {
  return (
    <ManagerReferenceNodeSetterContext.Consumer>
      {(setReferenceNode) => (
        <InnerReference setReferenceNode={setReferenceNode} {...props} />
      )}
    </ManagerReferenceNodeSetterContext.Consumer>
  );
}
