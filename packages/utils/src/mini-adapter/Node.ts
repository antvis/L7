// @ts-nocheck
// tslint:disable
import EventTarget from './EventTarget';

export class Node extends EventTarget {
  public childNodes: any[];

  constructor() {
    super();
    this.childNodes = [];
  }

  public appendChild(node) {
    this.childNodes.push(node);
    // if (node instanceof Node) {
    //   this.childNodes.push(node)
    // } else {
    //   throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.')
    // }
  }

  public cloneNode() {
    const copyNode = Object.create(this);

    Object.assign(copyNode, this);
    return copyNode;
  }

  public removeChild(node) {
    const index = this.childNodes.findIndex((child) => child === node);

    if (index > -1) {
      return this.childNodes.splice(index, 1);
    }
    return null;
  }
}
