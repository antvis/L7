// @ts-nocheck
// tslint:disable
import { Element } from './Element';
import * as Mixin from './util/mixin';

function noop() {}

export class HTMLElement extends Element {
  public className: string;
  public children: any[];
  public focus: any;
  public blur: any;
  public insertBefore: any;
  public appendChild: any;
  public removeChild: any;
  public remove: any;
  public innerHTML: string;
  public tagName: string;

  constructor(tagName = '', level?: number) {
    super();

    this.className = '';
    this.children = [];

    this.focus = noop;
    this.blur = noop;

    this.insertBefore = noop;
    this.appendChild = noop;
    this.removeChild = noop;
    this.remove = noop;

    this.innerHTML = '';

    this.tagName = tagName.toUpperCase();

    Mixin.parentNode(this, level);
    Mixin.style(this);
    Mixin.classList(this);
    Mixin.clientRegion(this);
    Mixin.offsetRegion(this);
    Mixin.scrollRegion(this);
  }
}
