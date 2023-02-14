---
title: DebugService
order: 0
---

<embed src="@/docs/common/style.md"></embed>

## 简介

L7 在通过 debugService 的形式对外提供调试服务，通过 debugService 用户可以获得一些有助于性能监控的信息。

### serEnable(enable: boolean)

用户可以通过 scene 初始化的时候和 debugService 提供的方法来开启监控。

```js
// 可以在 scene 初始化的时候打开监控
const scene = new Scene({
  debug: true, // 默认为 false
});

// 可以通过 debugService 单独控制监控
const debugService = scene.getDebugService();
debugService.serEnable(true); // 开启监控
```

### getLog(field: undefined | string | string[]): ILog[] | ILog | undefined

用户通过 getLog 方法获取日志，通过传入不通的参数，用户可以准确获得自己需要的日志内容。

```js
// 获取地图初始化日志
debugService.getLog('map'); // map 为固定值

// 在获取图层的创建日志时，为了获取到全部的数据，需要在 layer 创建完成之后获取
layer.on('inited', () => {
  debugService.getLog(layer.id); // 获取单个图层创建日志
});

layerAllLoad([pointLayer1, pointLayer2], () => {
  // layerAllLoad 自己实现监听
  debugService.getLog([pointLayer1.id, pointLayer2.id]); // 获取多个图层创建日志
});

// 获取所有日志
debugService.getLog();
```

- 通过 getLog 方法可以获得如下的日志信息

```js
const enum IDebugLog {
  MapInitStart = 'mapInitStart', 			// 地图初始化时间

  LayerInitStart = 'layerInitStart',	// 图层初始化开始时间
  LayerInitEnd = 'layerInitEnd',			// 图层初始化结束时间

  SourceInitStart = 'sourceInitStart',// souce 初始化开始时间
  SourceInitEnd = 'sourceInitEnd',		// souce 初始化结束时间

  // scale：将数据进行 scale 映射处理 => 将数据从定义域转化到值域
  // 如： layer.size('v', [1, 10]);
  //  		根据字段 v 表示的定义域将 size 的结果映射到 1 ～ 10 之间
  ScaleInitStart = 'scaleInitStart',	// scale 初始化开始时间
  ScaleInitEnd = 'scaleInitEnd',			// scale 初始化结束时间

  // mapping：构建渲染数据
  MappingStart = 'mappingStart',			// mapping 初始化开始时间
  MappingEnd = 'mappingEnd',					// mapping 初始化结束时间

  // build model：构建渲染使用的程序对象、构建网格、纹理等
  BuildModelStart = 'buildModelStart',// souce 初始化开始时间
  BuildModelEnd = 'buildModelEnd',		// souce 初始化结束时间
}
```

### renderDebug(enable: boolean)

debugService 提供了监听图层渲染时间的便捷方法, 通过 renderDebug 开启。

### on(name: string, options: any)

debugService 支持事件监听，常用与监听渲染。

```js
debugService.on('renderEnd', renderInfo => {
  const {
    renderUid,			// 当前帧渲染唯一编号
    renderStart,		// 当前帧渲染开始时间
    renderEnd,			// 当前帧渲染结束时间
    renderDuration	// 当前帧渲染时间
  } = renderInfo;
  ...
}
```

### off(name: string, func: Function)

debugService 事件取消监听。
