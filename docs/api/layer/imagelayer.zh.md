---
title: ImageLayer
order: 5
---
# ImageLayer

## 简介
将图片添加到地图上，需要指定图片的经纬度范围

### 代码示例

```javascript
const layer = new ImageLayer({});
layer.source(
  'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
  {
    parser: {
      type: 'image',
      extent: [ 121.168, 30.2828, 121.384, 30.4219 ]
    }
  }
);
```
