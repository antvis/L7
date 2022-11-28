import { anchorType, DOM } from '@antv/l7-utils';
import EventEmitter from 'eventemitter3';
import { Container } from 'inversify';
import { ILngLat } from '../map/IMapService';

export interface IPopupOption {
  /**
   * 是否展示关闭按钮
   */
  closeButton: boolean;

  /**
   * 关闭按钮距离右上角的偏移
   */
  closeButtonOffsets?: [number, number];

  /**
   * 点击地图区域是否关闭弹框
   */
  closeOnClick: boolean;

  /**
   * 按 Esc 键是否关闭弹框
   */
  closeOnEsc: boolean;

  /**
   * 气泡体的最大宽度
   */
  maxWidth: string;

  /**
   * 气泡
   */
  anchor: anchorType[any];

  /**
   * 气泡相对偏移
   */
  offsets: [number, number];

  /**
   * 气泡上的所有鼠标事件是否关闭事件冒泡
   */
  stopPropagation: boolean;

  /**
   * popup 位置发生变化时地图是否自动平移至气泡位置
   */
  autoPan: boolean;

  /**
   * 展示其他气泡时，当前气泡是否自动关闭
   */
  autoClose: boolean;

  /**
   * 当前气泡是否自动跟随光标
   */
  followCursor: boolean;

  /**
   * 自定义气泡容器的 class
   */
  className?: string;

  /**
   * 自定义气泡容器的 style
   */
  style?: string;

  /**
   * Popup 气泡的内置文本
   */
  text?: string;

  /**
   * Popup 气泡的内置HTML
   */
  html?: DOM.ElementType;

  /**
   * Popup 气泡的标题
   */
  title?: DOM.ElementType;

  /**
   * 初始的经纬度位置
   */
  lngLat?: ILngLat;
}

export interface IPopup extends EventEmitter {
  addTo(scene: Container): this;
  remove(): void;
  setLnglat(lngLat: ILngLat): this;
  getLnglat(): ILngLat;
  setHTML(html: DOM.ElementType): this;
  setText(text: string): this;
  setMaxWidth(maxWidth: string): this;
  isOpen(): boolean;
  open(): this;
  close(): this;
  getOptions(): IPopupOption;
  setOptions(option: Partial<IPopupOption>): this;
}

export interface IPopupService {
  addPopup(popup: IPopup): void;
  removePopup(popup: IPopup): void;
  init(scene: Container): void;
  initPopup(): void;
  destroy(): void;
}
