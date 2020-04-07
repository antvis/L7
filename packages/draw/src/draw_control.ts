/*
 * @Author: lzxue
 * @Date: 2020-04-03 19:24:16
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-04-07 15:17:21
 */
import { Control, IControlOption, PositionType, Scene } from '@antv/l7';
import { DOM } from '@antv/l7-utils';
import './css/draw.less';
import {
  DrawCircle,
  DrawDelete,
  DrawFeature,
  DrawLine,
  DrawPoint,
  DrawPolygon,
  DrawRect,
} from './modes';
const DrawType: {
  [key: string]: any;
} = {
  point: DrawPoint,
  line: DrawLine,
  polygon: DrawPolygon,
  circle: DrawCircle,
  rect: DrawRect,
};
import { DrawEvent, DrawModes } from './util/constant';
export interface IControls {
  [key: string]: boolean;
}

export interface IDrawControlOption extends IControlOption {
  pickBuffer: number;
  controls: IControls;
  layout: 'horizontal' | 'vertical';
}
export class DrawControl extends Control {
  private draw: {
    [key: string]: DrawFeature;
  } = {};
  private drawDelete: DrawDelete;
  private currentDraw: DrawFeature;
  private scene: Scene;
  constructor(scene: Scene, options: Partial<IDrawControlOption>) {
    super(options);
    this.scene = scene;
  }

  public getDefault() {
    return {
      position: PositionType.TOPLEFT,
      controls: {
        point: true,
      },
      name: 'draw',
    };
  }

  public onAdd(): HTMLElement {
    const { layout } = this.controlOption;
    const controlClass = 'l7-control-draw' + ' ' + layout;
    const { controls } = this.controlOption as IDrawControlOption;
    const container = DOM.create('div', controlClass) as HTMLElement;
    this.addControls(controls, container);
    // 监听组件 选中, 编辑
    return container;
  }
  private addControls(controls: IControls, container: HTMLElement) {
    for (const type in controls) {
      if (DrawType[type]) {
        const draw = new DrawType[type](this.scene);
        draw.on(DrawEvent.MODE_CHANGE, this.onModeChange.bind(null, type));
        this.draw[type] = draw;
        this.createButton(
          draw.title,
          'draw-' + type,
          container,
          this.onButtonClick.bind(null, type),
        );
      } else if (type === 'delete') {
        const draw = new DrawDelete(this.scene);
        draw.on(DrawEvent.MODE_CHANGE, this.onModeChange.bind(null, type));
        this.createButton(
          draw.title,
          'draw-' + type,
          container,
          this.onDeleteMode.bind(null, type),
        );
      }
    }
  }

  private createButton(
    tile: string,
    className: string,
    container: HTMLElement,
    fn: (...arg: any[]) => any,
  ) {
    const link = DOM.create('button', className, container);
    link.title = tile;
    link.addEventListener('mousedown', fn, false);
    return link;
  }

  private onButtonClick = (type: string, e: MouseEvent) => {
    // e.stopPropagation();
    for (const draw in this.draw) {
      if (draw === type) {
        this.draw[draw].enable();
      } else {
        this.draw[draw].disable();
      }
    }
  };

  private onDeleteMode = (type: string, e: MouseEvent) => {
    // e.stopPropagation();
    if (!this.currentDraw) {
      return;
    }
    this.currentDraw.deleteMode.enable();
    return false;
  };

  private onModeChange = (type: string, mode: string) => {
    if (mode === DrawModes.SIMPLE_SELECT) {
      this.currentDraw = this.draw[type];
    }
  };
}
