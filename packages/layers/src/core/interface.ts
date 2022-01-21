import { styleSingle } from '../core/BaseModel';
export enum lineStyleType {
  'solid' = 0.0,
  'dash' = 1.0,
}

export interface ILineLayerStyleOptions {
  opacity: styleSingle;
  lineType?: keyof typeof lineStyleType; // 可选参数、线类型(all - dash/solid)
  dashArray?: [number, number]; //  可选参数、虚线间隔
  segmentNumber?: number;

  forward?: boolean; // 可选参数、是否反向(arcLine)
  lineTexture?: boolean; // 可选参数、是否开启纹理贴图功能(all)
  iconStep?: number; // 可选参数、纹理贴图步长(all)
  iconStepCount?: number; // 可选参数、纹理贴图间隔
  textureBlend?: string; // 可选参数、供给纹理贴图使用(all)
  sourceColor?: string; // 可选参数、设置渐变色的起始颜色(all)
  targetColor?: string; // 可选参数、设置渐变色的终点颜色(all)
  thetaOffset?: number; // 可选参数、设置弧线的偏移量

  globalArcHeight?: number; // 可选参数、地球模式下 3D 弧线的高度
  vertexHeightScale?: number; // 可选参数、lineLayer vertex height scale

  borderWidth?: number; // 可选参数 线边框宽度
  borderColor?: string; // 可选参数 线边框颜色

  heightfixed?: boolean; // 可选参数 高度是否固定

  mask?: boolean;         // 可选参数 时候允许蒙层
  maskInside?: boolean;   // 可选参数 控制图层是否显示在蒙层的内部
}
