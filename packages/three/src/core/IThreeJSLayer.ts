import { ILayer } from '@antv/l7';
import {
    AnimationMixer,
    Matrix4,
    Object3D
  } from 'three';

export type ILngLat = [number, number]

export interface IThreeJSLayer extends ILayer {
  // 获取对应地图的经纬度模型矩阵
  getModelMatrix(
    lnglat: ILngLat,
    altitude: number,
    rotation: [number, number, number],
    scale: [number, number, number],
  ): Matrix4;

  // 获取对应地图的经纬度平移矩阵
  getTranslateMatrix(lnglat: ILngLat, altitude?: number): Matrix4;

  // 设置模型对应地图在经纬度和高度方向的平移
  setObjectLngLat(object: Object3D, lnglat: ILngLat, altitude?: number): void;

  // 根据经纬度设置模型对应地图的平移
  setObjectLngLat(object: Object3D, lnglat: ILngLat, altitude?: number): void;

  // 返回物体在场景中的经纬度
  getObjectLngLat(object: Object3D): ILngLat;

  // 增加加载模型的动画混合器
  addAnimateMixer(mixer: AnimationMixer): void;
}