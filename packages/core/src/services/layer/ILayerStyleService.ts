/**
 * 1. 提供各个 Layer 样式属性初始值的注册服务
 * 2. 当 Layer 通过 style() 改变某些样式属性时，需要感知并标记该属性已经失效，
 *    随后当 Layer 重绘时通过 dirty 标记进行脏检查。重新传入 uniform 或者构建顶点数据（更新 Buffer 中的指定位置）。
 * @see https://yuque.antfin-inc.com/yuqi.pyq/fgetpa/qfuzg8
 */

type OptionType = 'attribute' | 'uniform';
type Color = [number, number, number];
type StyleOption =
  | {
      type: OptionType;
      value: string | number | number[] | Color;
      dirty: boolean;
    }
  | string
  | number
  | number[]
  | Color;

export interface ILayerStyleOptions {
  [key: string]: StyleOption;
}

// tslint:disable-next-line:no-empty-interface
export default interface ILayerStyleService {
  registerDefaultStyleOptions(
    layerName: string,
    options: ILayerStyleOptions,
  ): void;
}
