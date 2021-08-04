import Node from './Node';

export default class Element extends Node {
  public className: string;
  public children: any[];

  constructor() {
    super();

    this.className = '';
    this.children = [];
  }
  // @ts-ignore
  public setAttribute(name, value) {
    // @ts-ignore
    this[name] = value;
  }

  // @ts-ignore
  public getAttribute(name) {
    // @ts-ignore
    return this[name];
  }

  // @ts-ignore
  public setAttributeNS(name, value) {
    // @ts-ignore
    this[name] = value;
  }

  // @ts-ignore
  public getAttributeNS(name) {
    // @ts-ignore
    return this[name];
  }
}
