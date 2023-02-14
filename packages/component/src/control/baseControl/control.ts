import {
  IControl,
  IControlService,
  IGlobalConfigService,
  ILayerService,
  IMapService,
  IRendererService,
  ISceneService,
  PositionName,
  PositionType,
  TYPES,
} from '@antv/l7-core';
import { DOM } from '@antv/l7-utils';
import EventEmitter from 'eventemitter3';
import { Container } from 'inversify';
import { ControlEvent } from '../../interface';

export { PositionType } from '@antv/l7-core';
export { Control };

export interface IControlOption {
  name: string;
  position: PositionName | Element;
  className?: string;
  style?: string;
}

export default class Control<O extends IControlOption = IControlOption>
  extends EventEmitter<ControlEvent>
  implements IControl<O>
{
  /**
   * 当前类型控件实例个数
   * @protected
   */
  protected static controlCount = 0;

  /**
   * 当前控件实例配置
   */
  public controlOption: O;

  /**
   * 控件的 DOM 容器
   * @protected
   */
  protected container: HTMLElement;

  /**
   * 当前控件是否显示
   * @protected
   */
  protected isShow: boolean;

  protected sceneContainer: Container;
  protected scene: ISceneService;
  protected mapsService: IMapService;
  protected renderService: IRendererService;
  protected layerService: ILayerService;
  protected controlService: IControlService;
  protected configService: IGlobalConfigService;

  constructor(option?: Partial<O>) {
    super();
    Control.controlCount++;
    this.controlOption = {
      ...this.getDefault(option),
      ...(option || {}),
    };
  }

  public getOptions() {
    return this.controlOption;
  }

  /**
   * 更新配置的方法，子类如果有自己的配置，也需要重写该方法
   * @param newOptions
   */
  public setOptions(newOptions: Partial<O>): void {
    const defaultOptions = this.getDefault(newOptions);
    (Object.entries(newOptions) as Array<[keyof O, any]>).forEach(
      ([key, value]) => {
        if (value === undefined) {
          newOptions[key] = defaultOptions[key];
        }
      },
    );
    if ('position' in newOptions) {
      this.setPosition(newOptions.position);
    }
    if ('className' in newOptions) {
      this.setClassName(newOptions.className);
    }
    if ('style' in newOptions) {
      this.setStyle(newOptions.style);
    }
    this.controlOption = {
      ...this.controlOption,
      ...newOptions,
    };
  }

  /**
   * 当 Control 被添加至 Scene 中，被 controlService 调用的方法
   * @param sceneContainer
   */
  public addTo(sceneContainer: Container) {
    // 初始化各个 Service 实例
    this.mapsService = sceneContainer.get<IMapService>(TYPES.IMapService);
    this.renderService = sceneContainer.get<IRendererService>(
      TYPES.IRendererService,
    );
    this.layerService = sceneContainer.get<ILayerService>(TYPES.ILayerService);
    this.controlService = sceneContainer.get<IControlService>(
      TYPES.IControlService,
    );
    this.configService = sceneContainer.get<IGlobalConfigService>(
      TYPES.IGlobalConfigService,
    );
    this.scene = sceneContainer.get<ISceneService>(TYPES.ISceneService);
    this.sceneContainer = sceneContainer;
    this.isShow = true;

    // 初始化 container
    this.container = this.onAdd();
    DOM.addClass(this.container, 'l7-control');

    const { className, style } = this.controlOption;
    if (className) {
      this.setClassName(className);
    }
    if (style) {
      this.setStyle(style);
    }
    // 将 container 插入容器中
    this.insertContainer();
    this.emit('add', this);
    return this;
  }

  /**
   * 将控件移除时触发
   */
  public remove() {
    if (!this.mapsService) {
      return this;
    }
    DOM.remove(this.container);
    this.onRemove();
    this.emit('remove', this);
  }

  /**
   * Control 被添加的时候被调用，返回 Control 对应的 DOM 容器
   */
  public onAdd(): HTMLElement {
    return DOM.create('div');
  }

  /**
   * Control 被移除时调用
   */
  // tslint:disable-next-line:no-empty
  public onRemove() {}

  /**
   * 显示控件时触发
   */
  public show() {
    const container = this.container;
    DOM.removeClass(container, 'l7-control--hide');
    this.isShow = true;
    this.emit('show', this);
  }

  /**
   * 隐藏控件时触发
   */
  public hide() {
    const container = this.container;
    DOM.addClass(container, 'l7-control--hide');
    this.isShow = false;
    this.emit('hide', this);
  }

  /**
   * 获取默认构造器参数
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getDefault(option?: Partial<O>): O {
    // tslint:disable-next-line:no-object-literal-type-assertion
    return {
      position: PositionType.TOPRIGHT,
      name: `${Control.controlCount}`,
    } as O;
  }

  /**
   * 获取当前控件对应的 DOM 容器
   */
  public getContainer() {
    return this.container;
  }

  /**
   * 获取当前 Control 是否展示
   */
  public getIsShow() {
    return this.isShow;
  }

  public _refocusOnMap(e: MouseEvent) {
    // if map exists and event is not a keyboard event
    if (this.mapsService && e && e.screenX > 0 && e.screenY > 0) {
      const container = this.mapsService.getContainer();
      if (container !== null) {
        container.focus();
      }
    }
  }

  /**
   * 设置当前控件位置
   * @param position
   */
  public setPosition(
    position: PositionType | IControlOption['position'] = PositionType.TOPLEFT,
  ) {
    // 考虑组件的自动布局，需要销毁重建
    const controlService = this.controlService;
    if (controlService) {
      controlService.removeControl(this);
    }
    this.controlOption.position = position;
    if (controlService) {
      controlService.addControl(this, this.sceneContainer);
    }
    return this;
  }

  /**
   * 设置容器 container 的样式相关位置，包含 className
   * @param className
   */
  public setClassName(className?: string | null) {
    const container = this.container;
    const { className: oldClassName } = this.controlOption;
    if (oldClassName) {
      DOM.removeClass(container, oldClassName);
    }
    if (className) {
      DOM.addClass(container, className);
    }
  }

  /**
   * 设置容器 container 的样式相关位置，包含 style
   * @param style
   */
  public setStyle(style?: string | null) {
    const container = this.container;
    if (style) {
      container.setAttribute('style', style);
    } else {
      container.removeAttribute('style');
    }
  }

  /**
   * 将控件 DOM 插入到对应 position 的容器中
   * @protected
   */
  protected insertContainer() {
    const position = this.controlOption.position;
    const container = this.container;

    if (position instanceof Element) {
      position.appendChild(container);
    } else {
      const corner = this.controlService.controlCorners[position];
      if (position.indexOf('bottom') !== -1) {
        corner.insertBefore(container, corner.firstChild);
      } else {
        corner.appendChild(container);
      }
    }
  }

  /**
   * 检查当前传入 option 是否包含 keys 字段
   * @param option
   * @param keys
   * @protected
   */
  protected checkUpdateOption(option: Partial<O>, keys: Array<keyof O>) {
    return keys.some((key) => key in option);
  }
}
