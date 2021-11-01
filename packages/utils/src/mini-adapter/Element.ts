// @ts-nocheck
// tslint:disable
import { Node } from './Node';

export class Element extends Node {
  public className: string;
  public children: any[];

  constructor() {
    super();

    this.className = '';
    this.children = [];
  }

  public setAttribute(name, value) {
    this[name] = value;
  }

  public getAttribute(name) {
    return this[name];
  }

  public setAttributeNS(name, value) {
    this[name] = value;
  }

  public getAttributeNS(name) {
    return this[name];
  }
}
