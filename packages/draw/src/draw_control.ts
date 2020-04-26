/*
 * @Author: lzxue
 * @Date: 2020-04-03 19:24:16
 * @Last Modified by: lzxue
 * @Last Modified time: 2020-04-22 19:09:42
 */
import { Control, DOM, IControlOption, PositionType, Scene } from '@antv/l7';
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
import { IDrawFeatureOption } from './modes/draw_feature';
const DrawType: {
  [key: string]: any;
} = {
  point: DrawPoint,
  line: DrawLine,
  polygon: DrawPolygon,
  circle: DrawCircle,
  rect: DrawRect,
};
import { isObject, polygon } from '@turf/helpers';
import { DrawEvent, DrawModes } from './util/constant';
export interface IControls {
  [key: string]: boolean | IDrawFeatureOption;
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
        line: true,
        polygon: true,
        rect: true,
        circle: true,
        delete: true,
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

    // 代理每个绘制组件的事件

    this.addControlEvent();
    // 监听组件 选中, 编辑
    return container;
  }

  public onRemove() {
    for (const draw in this.draw) {
      if (this.draw[draw]) {
        this.draw[draw].destroy();
      }
    }
  }

  public getDraw(type: string): DrawFeature | null {
    const { controls } = this.controlOption as IDrawControlOption;
    if (controls[type]) {
      return this.draw[type];
    }
    return null;
  }

  public getAllData() {
    const res: { [key: string]: any } = {};
    for (const draw in this.draw) {
      if (this.draw[draw]) {
        res[draw] = this.draw[draw].getData();
      }
    }
    return res;
  }
  public removeAllData() {
    for (const draw in this.draw) {
      if (this.draw[draw]) {
        this.draw[draw].removeAllData();
      }
    }
  }

  private addControls(controls: IControls, container: HTMLElement) {
    for (const type in controls) {
      if (DrawType[type] && controls[type] !== false) {
        const drawOption = isObject(controls[type]) ? controls[type] : false;
        const draw = new DrawType[type](this.scene, drawOption);
        draw.on(DrawEvent.MODE_CHANGE, this.onModeChange.bind(null, type));
        this.draw[type] = draw;
        this.createButton(
          draw.title,
          'draw-' + type,
          container,
          'click',
          this.onButtonClick.bind(null, type),
        );
      } else if (type === 'delete' && controls[type] !== false) {
        const draw = new DrawDelete(this.scene);
        draw.on(DrawEvent.MODE_CHANGE, this.onModeChange.bind(null, type));
        this.createButton(
          draw.title,
          'draw-' + type,
          container,
          'mousedown',
          this.onDeleteMode.bind(null, type),
        );
      }
    }
  }

  private addControlEvent() {
    for (const draw in this.draw) {
      if (this.draw[draw]) {
        ['draw.create', 'draw.update', 'draw.delete'].forEach(
          (type: string) => {
            this.draw[draw].on('draw.create', (feature) => {
              this.emit(type, {
                drawType: draw,
                feature,
              });
            });
          },
        );
      }
    }
  }
  private createButton(
    tile: string,
    className: string,
    container: HTMLElement,
    eventType: string,
    fn: (...arg: any[]) => any,
  ) {
    const link = DOM.create('button', className, container);
    link.title = tile;
    link.addEventListener(eventType, fn, false);
    return link;
  }

  private onButtonClick = (type: string, e: MouseEvent) => {
    for (const draw in this.draw) {
      if (draw === type) {
        this.draw[draw].enable();
      } else {
        this.draw[draw].disable();
      }
    }
  };

  private onDeleteMode = (type: string, e: MouseEvent) => {
    e.stopPropagation();
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
