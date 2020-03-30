import { Control } from '@antv/l7-component';
export interface IDrawControlOption {
  pickBuffer: number;
  controls: any;
}
export default class DrawControl extends Control {
  constructor(options: IDrawControlOption) {
    super(options);
  }
}
