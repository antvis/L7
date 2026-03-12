---
skill_id: source-mvt
skill_name: MVT 数据源
category: data
difficulty: intermediate
tags: [mvt, vector-tile, pbf, tile-source]
dependencies: []
version: 2.x
---

# MVT 数据源

## 技能描述

掌握 L7 中 MVT (Mapbox Vector Tile) 数据源的配置和使用。MVT 是一种高效的矢量瓦片格式，使用 Protocol Buffer 编码，广泛应用于大规模地理数据的可视化。

## 何时使用

- ✅ 需要加载矢量瓦片地图服务
- ✅ 渲染海量矢量数据（百万级以上）
- ✅ 需要按需加载地理数据
- ✅ 使用第三方瓦片服务（Mapbox、阿里云等）
- ✅ 自建 MVT 瓦片服务

## 前置条件

- 已完成[场景初始化](../core/scene.md)
- 准备好 MVT 瓦片服务 URL

## 核心概念

### MVT 格式

MVT (Mapbox Vector Tile) 是一种矢量瓦片规范：

- **编码格式**：使用 Protocol Buffer（.pbf 文件）
- **瓦片结构**：遵循 TMS 或 XYZ 瓦片命名规则
- **图层组织**：一个瓦片可包含多个图层（layers）
- **坐标系统**：使用 Web Mercator 投影（EPSG:3857）

### 瓦片 URL 模板

MVT 数据源使用 URL 模板，包含以下占位符：

- `{z}` - 缩放级别（zoom level）
- `{x}` - 列号（column）
- `{y}` - 行号（row）

```
https://example.com/tiles/{z}/{x}/{y}.pbf
```

## 基础用法

### 单服务器配置

```javascript
import { Source } from '@antv/l7';

const source = new Source('https://tiles.example.com/{z}/{x}/{y}.pbf', {
  parser: {
    type: 'mvt', // 固定为 'mvt'
    tileSize: 256, // 瓦片大小（像素）
    maxZoom: 14, // 最大缩放级别
    minZoom: 0, // 最小缩放级别
    extent: [
      // 数据范围 [west, south, east, north]
      -180, -85.051129, 179, 85.051129,
    ],
  },
});

// 使用数据源
layer.source(source);
```

### 多服务器配置

使用大括号语法实现负载均衡：

```javascript
// 数字范围 {1-4}
const source1 = new Source('https://tile{1-4}.example.com/tiles/{z}/{x}/{y}.pbf', {
  parser: { type: 'mvt' },
});

// 字母范围 {a-d}
const source2 = new Source('https://tile{a-d}.example.com/tiles/{z}/{x}/{y}.pbf', {
  parser: { type: 'mvt' },
});

// 会自动分发到多个域名请求：
// tile1.example.com, tile2.example.com, tile3.example.com, tile4.example.com
```

## 配置参数

### parser 参数

| 参数          | 类型                               | 默认值                                       | 说明                   |
| ------------- | ---------------------------------- | -------------------------------------------- | ---------------------- |
| type          | `string`                           | -                                            | 固定为 `'mvt'`         |
| tileSize      | `number`                           | `256`                                        | 瓦片大小（像素）       |
| minZoom       | `number`                           | `0`                                          | 最小缩放级别           |
| maxZoom       | `number`                           | `Infinity`                                   | 最大缩放级别           |
| zoomOffset    | `number`                           | `0`                                          | 缩放级别偏移           |
| extent        | `[number, number, number, number]` | `[-Infinity, -Infinity, Infinity, Infinity]` | 数据边界范围           |
| getCustomData | `function`                         | -                                            | 自定义瓦片数据获取方法 |

### tileSize

瓦片的像素大小，常见值：

- `256` - 标准瓦片大小（默认）
- `512` - 高清瓦片
- `128` - 低精度瓦片

```javascript
const source = new Source(url, {
  parser: {
    type: 'mvt',
    tileSize: 512, // 使用 512 像素瓦片
  },
});
```

### minZoom / maxZoom

控制瓦片请求的缩放级别范围：

```javascript
const source = new Source(url, {
  parser: {
    type: 'mvt',
    minZoom: 3, // 地图缩放级别 < 3 时不请求
    maxZoom: 14, // 地图缩放级别 > 14 时使用 14 级数据
  },
});
```

**使用场景**：

- `minZoom`：避免在全球视图下请求过多瓦片
- `maxZoom`：复用较低层级数据，减少请求量

### zoomOffset

瓦片层级偏移量：

```javascript
const source = new Source(url, {
  parser: {
    type: 'mvt',
    zoomOffset: 1, // 请求比当前 zoom 高一级的瓦片
  },
});

// 地图 zoom=10 时，请求 z=11 的瓦片
```

**使用场景**：

- 提高数据精度（正偏移）
- 减少瓦片数量（负偏移）

### extent

限制瓦片请求的地理范围：

```javascript
// 只请求中国范围的瓦片
const source = new Source(url, {
  parser: {
    type: 'mvt',
    extent: [73.66, 3.86, 135.05, 53.55], // [west, south, east, north]
  },
});
```

**使用场景**：

- 区域性应用（只显示特定国家/地区）
- 减少不必要的瓦片请求
- 提升性能

## 高级用法

### 1. 自定义瓦片请求

使用 `getCustomData` 实现自定义请求逻辑：

```javascript
const source = new Source('https://api.example.com/tiles', {
  parser: {
    type: 'mvt',
    getCustomData: (tile, callback) => {
      const { x, y, z } = tile;

      // 自定义 URL 和参数
      const url = `https://api.example.com/tiles?z=${z}&x=${x}&y=${y}&token=YOUR_TOKEN`;

      fetch(url, {
        headers: {
          Authorization: 'Bearer YOUR_TOKEN',
        },
      })
        .then((res) => res.arrayBuffer())
        .then((data) => {
          callback(null, data); // 成功回调
        })
        .catch((err) => {
          callback(err, null); // 失败回调
        });
    },
  },
});
```

**使用场景**：

- 需要鉴权的瓦片服务
- 动态参数（时间、过滤条件等）
- 数据加密/解密
- 自定义缓存策略

### 2. 数据源复用

多个图层共享同一个 MVT 数据源：

```javascript
const vectorSource = new Source(
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      maxZoom: 9,
    },
  },
);

// 多个图层复用数据源
const polygonLayer = new PolygonLayer({
  sourceLayer: 'regions',
}).source(vectorSource);

const lineLayer = new LineLayer({
  sourceLayer: 'boundaries',
}).source(vectorSource);

// 只会请求一份瓦片数据，高效！
scene.addLayer(polygonLayer);
scene.addLayer(lineLayer);
```

### 3. 多数据源组合

```javascript
// 全球底图数据
const globalSource = new Source('https://global.tiles.com/{z}/{x}/{y}.pbf', {
  parser: {
    type: 'mvt',
    maxZoom: 10,
  },
});

// 中国详细数据
const chinaSource = new Source('https://china.tiles.com/{z}/{x}/{y}.pbf', {
  parser: {
    type: 'mvt',
    extent: [73.66, 3.86, 135.05, 53.55],
    minZoom: 10,
  },
});

// 根据缩放级别切换数据源
scene.on('zoomchange', () => {
  const zoom = scene.getZoom();
  if (zoom < 10) {
    layer.source(globalSource);
  } else {
    layer.source(chinaSource);
  }
});
```

## 实际应用场景

### 1. 使用公开瓦片服务

#### 阿里云 Ganos

```javascript
const source = new Source('https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf', {
  parser: {
    type: 'mvt',
    tileSize: 256,
    maxZoom: 9,
    extent: [-180, -85.051129, 179, 85.051129],
  },
});
```

#### Mapbox

```javascript
const source = new Source(
  'https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.mvt?access_token=YOUR_TOKEN',
  {
    parser: {
      type: 'mvt',
      maxZoom: 14,
    },
  },
);
```

### 2. 自建瓦片服务

#### MBTiles 文件服务

```javascript
// 使用 tileserver-gl 等工具提供服务
const source = new Source('http://localhost:8080/data/china/{z}/{x}/{y}.pbf', {
  parser: {
    type: 'mvt',
    tileSize: 256,
    maxZoom: 14,
  },
});
```

#### PostGIS + Tegola

```javascript
const source = new Source('http://tegola.io/maps/osm/{z}/{x}/{y}.pbf', {
  parser: {
    type: 'mvt',
    tileSize: 512,
  },
});
```

### 3. 带鉴权的私有服务

```javascript
const source = new Source('https://api.example.com/secure-tiles', {
  parser: {
    type: 'mvt',
    getCustomData: (tile, callback) => {
      const { x, y, z } = tile;

      // 获取 token
      const token = getAuthToken();

      fetch(`https://api.example.com/secure-tiles/${z}/${x}/${y}.pbf`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-API-Key': 'YOUR_API_KEY',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.arrayBuffer();
        })
        .then((data) => callback(null, data))
        .catch((err) => {
          console.error('瓦片加载失败:', err);
          callback(err, null);
        });
    },
  },
});
```

### 4. 动态参数（时间序列）

```javascript
let currentTime = '2024-01-01';

const source = new Source('https://api.example.com/tiles', {
  parser: {
    type: 'mvt',
    getCustomData: (tile, callback) => {
      const { x, y, z } = tile;
      const url = `https://api.example.com/tiles/${z}/${x}/${y}.pbf?time=${currentTime}`;

      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => callback(null, data))
        .catch((err) => callback(err, null));
    },
  },
});

// 更新时间参数
function updateTime(newTime) {
  currentTime = newTime;
  layer.source(source); // 重新加载
  scene.render();
}
```

## 性能优化

### 1. 合理设置缩放范围

```javascript
const source = new Source(url, {
  parser: {
    type: 'mvt',
    minZoom: 5, // 避免全球视图请求过多瓦片
    maxZoom: 14, // 限制最大精度，复用低层级数据
  },
});
```

### 2. 限制数据范围

```javascript
// 只请求业务相关区域的瓦片
const source = new Source(url, {
  parser: {
    type: 'mvt',
    extent: [100, 20, 130, 50], // 东亚地区
  },
});
```

### 3. 使用多服务器

```javascript
// 利用浏览器并发请求能力
const source = new Source('https://tile{1-4}.example.com/{z}/{x}/{y}.pbf', {
  parser: { type: 'mvt' },
});
```

### 4. 适当使用 zoomOffset

```javascript
// 使用低一级的瓦片，减少请求量
const source = new Source(url, {
  parser: {
    type: 'mvt',
    zoomOffset: -1, // 地图 zoom=10 时使用 z=9 的瓦片
  },
});
```

## 常见问题

### Q: 如何查看瓦片包含的图层？

A: 使用浏览器开发者工具或在线工具：

```javascript
// 1. 查看网络请求的 PBF 文件

// 2. 使用 TileDebugLayer
import { TileDebugLayer } from '@antv/l7';
const debugLayer = new TileDebugLayer();
scene.addLayer(debugLayer);

// 3. 使用在线工具
// https://protomaps.github.io/PMTiles/
// https://mapbox.github.io/vector-tile-spec/
```

### Q: MVT 和 GeoJSON 有什么区别？

A:

| 对比项     | MVT                      | GeoJSON         |
| ---------- | ------------------------ | --------------- |
| 编码格式   | Protocol Buffer (二进制) | JSON (文本)     |
| 文件大小   | 小（通常 < 50KB）        | 大（可能数 MB） |
| 加载方式   | 按需加载（瓦片）         | 一次性加载全部  |
| 适用数据量 | 百万级以上               | 万级以下        |
| 数据修改   | 需重新生成瓦片           | 可直接修改      |

### Q: 如何调试瓦片加载问题？

A:

1. **检查网络请求**：
   - 打开浏览器开发者工具 Network 面板
   - 查看瓦片请求的 URL 是否正确
   - 检查 HTTP 状态码

2. **使用调试图层**：

```javascript
import { TileDebugLayer } from '@antv/l7';
const debugLayer = new TileDebugLayer();
scene.addLayer(debugLayer);
```

3. **查看控制台错误**：

```javascript
scene.on('error', (e) => {
  console.error('场景错误:', e);
});
```

### Q: 瓦片 404 怎么办？

A: 检查以下几点：

1. URL 模板格式是否正确（`{z}/{x}/{y}`）
2. 是否超出 maxZoom 范围
3. extent 是否包含当前视野
4. 服务器是否支持 CORS
5. 是否需要鉴权

### Q: 如何实现瓦片缓存？

A: 浏览器会自动缓存瓦片（HTTP 缓存），也可以使用 Service Worker：

```javascript
// 使用 getCustomData 实现自定义缓存
const cache = new Map();

const source = new Source(url, {
  parser: {
    type: 'mvt',
    getCustomData: (tile, callback) => {
      const key = `${tile.z}/${tile.x}/${tile.y}`;

      // 从缓存读取
      if (cache.has(key)) {
        callback(null, cache.get(key));
        return;
      }

      // 请求数据
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => {
          cache.set(key, data); // 存入缓存
          callback(null, data);
        })
        .catch((err) => callback(err, null));
    },
  },
});
```

## 注意事项

⚠️ **坐标系统**：MVT 使用 Web Mercator 投影（EPSG:3857），确保数据匹配

⚠️ **文件格式**：瓦片必须是 Protocol Buffer 格式（.pbf 或 .mvt）

⚠️ **CORS 配置**：跨域请求需要服务器配置 CORS 头

⚠️ **缩放范围**：合理设置 minZoom 和 maxZoom 避免性能问题

⚠️ **数据源复用**：多图层使用同一数据时，务必复用 Source 对象

⚠️ **URL 占位符**：确保使用正确的占位符格式（`{z}/{x}/{y}`，不是 `$z/$x/$y`）

## 相关技能

- [矢量瓦片图层](../layers/tile-vector.md)
- [GeoJSON 数据源](./source-geojson.md)
- [场景初始化](../core/scene.md)
- [性能优化](../performance/optimization.md)

## 在线示例

查看更多示例：[L7 矢量瓦片示例](https://l7.antv.antgroup.com/examples/tile/vector)
