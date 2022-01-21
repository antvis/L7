---
title: FAQ
order: 16
---

`markdown:docs/common/style.md`

### 项目中 L7 各个依赖包版本不一致导致报错

Error: Cannot apply @injectable decorator multiple times.

<img height="300px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BsMyRZDuB54AAAAAAAAAAAAAARQnAQ'>

🌟 解决方法：  
删除 node_modules 下所有不同版本的 L7 包，重新安装启动即可

### 禁止地图交互

1. 初始化的时候可以在 map 配置项设置

- 高德地图可查看 https://lbs.amap.com/api/javascript-api/reference/map
- mapbox https://docs.mapbox.com/mapbox-gl-js/api/#map

2. 加载完成后设置
   调用 scene 的 [setMapStatus](./scene/#setmapstatus) 方法
