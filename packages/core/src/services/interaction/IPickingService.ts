import { ILayer } from '../layer/ILayerService';
export interface IPickingService {
  init(id: string): void;
  pickBox(layer: ILayer, box: [number, number, number, number]): any[];
  boxPickLayer(
    layer: ILayer,
    box: [number, number, number, number],
    cb: (...args: any[]) => void,
  ): Promise<any>;
  destroy(): void;
}
