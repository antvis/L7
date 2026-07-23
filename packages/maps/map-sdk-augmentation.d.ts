/**
 * 第三方地图 SDK 类型补全
 *
 * @types/bmapgl 与 @map-component/tmap-types 未声明、但运行时确实存在且
 * L7 maps 服务依赖的 BMapGL.Map / TMap.Map 成员。通过 interface 合并增强，
 * 不引入任何运行时代码。
 *
 * 详见: packages/maps/src/{bmap,tmap}/map.ts
 */
declare namespace BMapGL {
  interface Map {
    // BMapGL.Map 继承 EventEmitter，但 @types/bmapgl 未声明 on/off
    on(type: string, handler: (...args: any[]) => void): void;
    off(type: string, handler: (...args: any[]) => void): void;
    // 与 setMinZoom/setMaxZoom 对应的 getter，运行时存在
    getMinZoom(): number;
    getMaxZoom(): number;
  }
}

declare namespace TMap {
  interface Map {
    // 返回地图容器 DOM，@map-component/tmap-types 未声明
    getContainer(): HTMLElement;
    // 按像素偏移平移地图，运行时接受 [x, y] 元组
    panBy(offset: [number, number]): void;
  }
}
