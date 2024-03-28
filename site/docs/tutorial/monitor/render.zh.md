---
title: 渲染监控
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

在地图应用中，渲染大数据的地理数据是十分常见的需求，为了保证应用的流畅性，需要追求极致的渲染性能，为此监控引擎渲染内容对于优化性能，建设地图可视化应用性能指标有切实的意义。

### 实现

下面介绍如何使用 L7 提供的能力简单获取应用的渲染性能信息。

```javascript
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 60, 40.7128 ],
    zoom: 2
  }),
  debug: true
});
scene.on('loaded', () => {
  const debugService = scene.getDebugService();
  // 开启每帧渲染的监控
  debugService.renderDebug(true)
  debugService.on('renderEnd', renderInfo => {
    const {
      renderUid,			// 当前帧渲染唯一编号
      renderStart,		// 当前帧渲染开始时间
      renderEnd,			// 当前帧渲染结束时间
      renderDuration	// 当前帧渲染时间
    } = renderInfo;
    ...
  }

  setTimeout(() => {
    debugService.renderDebug(false);
    debugService.off('renderEnd');
  }, 1000); // 监听 1s 内的渲染情况
});
```
