import BaseControl from '@antv/l7-component';
export interface IDrawControlOption {
  pickBuffer: number;
  controls: any;
}
export default class DrawControl extends BaseControl {
  constructor(options) {
    super(options);
  }
}
