---
title: 快速开始
order: 0
---

`markdown:docs/common/style.md`

地图行政区划组件，支持世界地图，中国地图省市县三级，支持中国地图省市县上钻下取。

## 使用

**using modules**

```javascript
import { WorldLayer } from '@antv/l7-district';
```

**CDN 版本引用**

```html
<head>
  <! --引入最新版的L7-District -->
  <script src="https://unpkg.com/@antv/l7-district"></script>
</head>
```

⚠️⚠️⚠️ District 相关配置和接口还在完善中，你可以适用体验，某些配置和接口可能会进行调整

### 数据

District 提供 polygon 数据需要跟用户的属性数据，通过关系字段进行连接

- [国家名称对照表](https://gw.alipayobjects.com/os/bmw-prod/b6fcd072-72a7-4875-8e05-9652ffc977d9.csv)

- [省级行政名称*adcode*对照表.csv](https://gw.alipayobjects.com/os/bmw-prod/2aa6fb7b-3694-4df3-b601-6f6f9adac496.csv)

- [市级行政区划及编码](https://gw.alipayobjects.com/os/bmw-prod/d2aefd78-f5df-486f-9310-7449cc7f5569.csv)

- [县级行政区名称级编码](https://gw.alipayobjects.com/os/bmw-prod/fafd299e-0e1e-4fa2-a8ac-10a984c6e983.csv)
