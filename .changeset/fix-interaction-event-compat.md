---
'@antv/l7-core': patch
'@antv/l7-maps': patch
---

fix: 修复移除 hammerjs 后的事件系统兼容性问题

- 修复 triggerHover 方法签名与接口不符，补全 lngLat 和 type 参数，解决 layer.pick() 拾取失效问题
- SceneService 补充 Press 事件监听，保持长按事件向后兼容
- amap-next: 修复 wrapper 容器定位上下文和高度初始化问题
