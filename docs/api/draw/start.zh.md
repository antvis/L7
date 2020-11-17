---
title: 快速使用
order: 1
---

`markdown:docs/common/style.md`

地图绘制组件，支持点、线、面， 圆、矩形、的绘制编辑。

# 使用

**using modules**

```javascript
import { DrawControl } from '@antv/l7-draw';
```

**CDN 版本引用**

```html
<head>
  <! --引入最新版的L7-Draw -->
  <script src="https://unpkg.com/@antv/l7-draw"></script>
</head>
```

## 实例化

```javascript
const control = new DrawControl(scene, option);
scene.addControl(control);
```

```javascript
// CDN 引用
const control = new L7.Draw.DrawControl(scene, option);
scene.addControl(control);
```
