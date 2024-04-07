import type { IInteractionTarget } from '../interaction/IInteractionService';
import type { ILayer } from '../layer/ILayerService';
import type { ILngLat } from '../map/IMapService';
export interface IPickingService {
  pickedColors: Uint8Array | undefined;
  pickedTileLayers: ILayer[];
  init(id: string): void;
  pickFromPickingFBO(layer: ILayer, target: IInteractionTarget): Promise<boolean>;
  pickBox(layer: ILayer, box: [number, number, number, number]): Promise<any[]>;
  triggerHoverOnLayer(
    layer: ILayer,
    target: {
      x: number;
      y: number;
      type: string;
      lngLat: ILngLat;
      feature?: unknown;
      featureId?: number | null;
    },
  ): void;

  boxPickLayer(
    layer: ILayer,
    box: [number, number, number, number],
    cb: (...args: any[]) => void,
  ): Promise<any>;
  destroy(): void;
}

export interface ILayerPickService {
  pickRasterLayer(layer: ILayer, target: IInteractionTarget, parent?: ILayer): boolean;
  pick(layer: ILayer, target: IInteractionTarget): Promise<boolean>;
  /**
   * 绘制拾取图层
   * @param target 触发对象
   */
  pickRender(target: IInteractionTarget): void;
  /**
   * 为图层设置选中对象
   * @param pickedColors
   */
  selectFeature(pickedColors: Uint8Array | undefined): void;
  /**
   * 为图层设置active对象
   * @param pickedColors
   */

  highlightPickedFeature(pickedColors: Uint8Array | undefined): void;

  /**
   * 获取选中的要素
   * @param id q
   */
  getFeatureById(id: number, lngLat?: ILngLat): any;
}
