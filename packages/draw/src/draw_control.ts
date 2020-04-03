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
    if (controls.point) {
      this.draw.point = new DrawPoint(this.scene);
      this.createButton(
        '绘制点',
        'draw-point',
        container,
        this.onButtonClick.bind(null, 'point'),
      );
    }
    if (controls.line) {
      this.draw.line = new DrawLine(this.scene);
      this.createButton(
        '绘制线',
        'draw-line',
        container,
        this.onButtonClick.bind(null, 'line'),
      );
    }
    if (controls.polygon) {
      this.createButton(
        '绘制面',
        'draw-polygon',
        container,
        this.onButtonClick.bind(null, 'polygon'),
      );
      this.draw.polygon = new DrawPolygon(this.scene);
    }
    if (controls.rect) {
      this.draw.rect = new DrawRect(this.scene);
      this.createButton(
        '绘制矩形',
        'draw-rect',
        container,
        this.onButtonClick.bind(null, 'rect'),
      );
    }
    if (controls.circle) {
      this.draw.circle = new DrawCircle(this.scene);
      this.createButton(
        '绘制圆',
        'draw-circle',
        container,
        this.onButtonClick.bind(null, 'circle'),
      );
    }

    if (controls.delete) {
      this.drawDelete = new DrawDelete(this.scene);
      this.createButton(
        '删除',
        'draw-delete',
        container,
        this.onDeleteMode.bind(null, 'delete'),
      );
    }
    // 监听组件 选中, 编辑
    return container;
  }

  private createButton(
    tile: string,
    className: string,
    container: HTMLElement,
    fn: (...arg: any[]) => any,
  ) {
    const link = DOM.create('a', className, container) as HTMLLinkElement;
    link.href = 'javascript:void(0)';
    link.title = tile;
    link.addEventListener('mousedown', fn, true);
    return link;
  }

  private onButtonClick = (type: string, e: MouseEvent) => {
    e.stopPropagation();
    for (const draw in this.draw) {
      if (draw === type) {
        this.draw[draw].enable();
        this.currentDraw = this.draw[draw];
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
}
