import {
  IControl,
  IControlOption,
  IControlService,
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

export default abstract class Control<O extends IControlOption = IControlOption>
  extends EventEmitter<ControlEvent>
  implements IControl<O> {
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

  constructor(option?: Partial<IControlOption>) {
    super();
    Control.controlCount++;
    this.controlOption = {
      ...this.getDefault(),
      ...(option || {}),
    };
  }

  /**
   * 更新配置的方法，子类如果有自己的配置，也需要重写该方法
   * @param newOptions
   */
  public setOptions(newOptions: Partial<O>): void {
    const {
      position: oldPosition,
      className: oldClassName,
      style: oldStyle,
    } = this.controlOption;

    if ('position' in newOptions && newOptions.position !== oldPosition) {
      this.setPosition(newOptions.position);
    }
    if ('className' in newOptions && newOptions.className !== oldClassName) {
      this.setContainerClassName(newOptions.className);
    }
    if ('style' in newOptions && newOptions.style !== oldStyle) {
      this.setContainerStyle(newOptions.style);
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
    this.scene = sceneContainer.get<ISceneService>(TYPES.ISceneService);
    this.sceneContainer = sceneContainer;
    this.isShow = true;

    // 初始化 container
    this.container = this.onAdd();
    DOM.addClass(this.container, 'l7-control');

    // 将 container 插入容器中
    this.insertContainer();
    this.setOptions(this.controlOption);
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
  public abstract onAdd(): HTMLElement;

  /**
   * Control 被移除时调用
   */
  public abstract onRemove(): void;

  /**
   * 显示控件时触发
   */
  public show() {
    const container = this.container;
    DOM.removeClass(container, 'l7-control-hide');
    this.isShow = true;
    this.emit('show', this);
  }

  /**
   * 隐藏控件时触发
   */
  public hide() {
    const container = this.container;
    DOM.addClass(container, 'l7-control-hide');
    this.isShow = false;
    this.emit('hide', this);
  }

  /**
   * 获取默认构造器参数
   */
  public getDefault(): O {
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
  protected setPosition(
    position: PositionType | PositionName = PositionType.TOPLEFT,
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
  protected setContainerClassName(className?: string | null) {
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
  protected setContainerStyle(style?: string | null) {
    const container = this.container;
    const { style: oldStyle } = this.controlOption;
    if (oldStyle) {
      DOM.removeStyle(container, oldStyle);
    }
    if (style) {
      DOM.addStyle(container, style);
    }
  }

  /**
   * 将控件 DOM 插入到对应 position 的容器中
   * @protected
   */
  protected insertContainer() {
    const container = this.container;
    const position = this.controlOption.position;
    const corner = this.controlService.controlCorners[position];
    if (position.indexOf('bottom') !== -1) {
      corner.insertBefore(container, corner.firstChild);
    } else {
      corner.appendChild(container);
    }
  }
}
