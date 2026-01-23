---
skill_id: raster-layer
skill_name: 栅格瓦片图层
category: layers
difficulty: beginner
tags: [raster, layer, tile, xyz, tms, imagery]
dependencies: [scene-initialization]
version: 2.x
---

# 栅格瓦片图层

## 技能描述

加载和显示第三方图片瓦片服务，支持 XYZ、TMS 等标准瓦片协议，可用于叠加卫星影像、地形图、专题图等栅格数据。

## 何时使用

- ✅ 叠加第三方卫星影像（天地图、OpenStreetMap）
- ✅ 显示专题地图图层（气象云图、热力分析）
- ✅ 加载自定义瓦片服务（地形渲染、历史地图）
- ✅ 多源数据叠加（多个瓦片图层组合）
- ✅ 替换或补充默认底图

## 前置条件

- 已完成[场景初始化](../01-core/scene-initialization.md)
- 准备好瓦片服务 URL（XYZ 或 TMS 格式）
- 了解瓦片服务的坐标系和缩放级别范围

## 输入参数

### 瓦片 URL 格式

```typescript
// XYZ 格式 (最常用)
'https://tile.server.com/{z}/{x}/{y}.png';

// TMS 格式 (Y轴反转)
'https://tile.server.com/{z}/{x}/{-y}.png';

// 多子域
'https://{s}.tile.server.com/{z}/{x}/{y}.png';

// 带参数
'https://tile.server.com/{z}/{x}/{y}.png?token=YOUR_TOKEN';
```

### 图层配置

| 方法                  | 参数                       | 说明           |
| --------------------- | -------------------------- | -------------- |
| `source(url, config)` | url: 瓦片URL, config: 配置 | 设置瓦片数据源 |
| `style(config)`       | config: 样式对象           | 设置样式参数   |

### 配置参数

```typescript
{
  parser: {
    type: 'rasterTile',
    tileSize: 256,              // 瓦片大小，默认 256
    minZoom: 0,                 // 最小缩放级别
    maxZoom: 18,                // 最大缩放级别
    zoomOffset: 0,              // 缩放偏移量
    updateStrategy: 'overlap'   // 更新策略: overlap | replace
  }
}
```

## 输出

返回 `RasterLayer` 实例

## 代码示例

### 基础用法 - OpenStreetMap 瓦片

```javascript
import { RasterLayer } from '@antv/l7';

scene.on('loaded', () => {
  const osmLayer = new RasterLayer()
    .source('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        minZoom: 0,
        maxZoom: 18,
      },
    })
    .style({
      opacity: 1.0,
    });

  scene.addLayer(osmLayer);
});
```

### 天地图影像服务

```javascript
const TOKEN = 'YOUR_TIANDITU_TOKEN';

const tdtImageLayer = new RasterLayer({
  name: 'tianditu-imagery',
  zIndex: 1,
}).source(`https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${TOKEN}`, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    minZoom: 0,
    maxZoom: 18,
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
  },
});

// 叠加天地图注记
const tdtLabelLayer = new RasterLayer({
  name: 'tianditu-labels',
  zIndex: 2,
}).source(`https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${TOKEN}`, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    minZoom: 0,
    maxZoom: 18,
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
  },
});

scene.addLayer(tdtImageLayer);
scene.addLayer(tdtLabelLayer);
```

### Mapbox 卫星图层

```javascript
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN';

const satelliteLayer = new RasterLayer()
  .source(
    `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`,
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        minZoom: 0,
        maxZoom: 22,
      },
    },
  )
  .style({
    opacity: 0.8,
  });

scene.addLayer(satelliteLayer);
```

### TMS 格式瓦片

```javascript
// TMS 格式的 Y 轴是反转的
const tmsLayer = new RasterLayer().source('https://tile.server.com/{z}/{x}/{-y}.png', {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    minZoom: 0,
    maxZoom: 16,
  },
});

scene.addLayer(tmsLayer);
```

### 自定义瓦片服务

```javascript
const customTileLayer = new RasterLayer({
  name: 'custom-tiles',
})
  .source('https://your-tile-server.com/tiles/{z}/{x}/{y}.png', {
    parser: {
      type: 'rasterTile',
      tileSize: 512, // 512x512 瓦片
      minZoom: 0,
      maxZoom: 14,
      zoomOffset: 0,
      updateStrategy: 'overlap',
    },
  })
  .style({
    opacity: 1.0,
  });

scene.addLayer(customTileLayer);
```

### 多子域配置

```javascript
// 提高并发加载速度
const tileLayer = new RasterLayer().source('https://{s}.example.com/{z}/{x}/{y}.png', {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    subdomains: ['a', 'b', 'c', 'd'], // 4个子域轮流请求
  },
});
```

### 带认证的瓦片服务

```javascript
const securedTileLayer = new RasterLayer().source(
  'https://secure-tiles.example.com/{z}/{x}/{y}.png?apikey=YOUR_API_KEY',
  {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      maxZoom: 18,
    },
  },
);

scene.addLayer(securedTileLayer);
```

### 图层控制 - 显示/隐藏

```javascript
const rasterLayer = new RasterLayer().source(tileUrl, config);
scene.addLayer(rasterLayer);

// 隐藏图层
rasterLayer.hide();

// 显示图层
rasterLayer.show();

// 切换可见性
function toggleLayer() {
  const isVisible = rasterLayer.isVisible();
  if (isVisible) {
    rasterLayer.hide();
  } else {
    rasterLayer.show();
  }
}
```

### 透明度动态调整

```javascript
const rasterLayer = new RasterLayer().source(tileUrl, config);
scene.addLayer(rasterLayer);

// 创建透明度滑块
const slider = document.getElementById('opacity-slider');
slider.addEventListener('input', (e) => {
  const opacity = parseFloat(e.target.value);
  rasterLayer.style({ opacity });
  scene.render();
});
```

## 样式配置详解

```javascript
{
  opacity: 1.0,           // 透明度，0-1，默认 1.0
  // 暂不支持更多样式配置
}
```

## 常见场景

### 1. 叠加气象云图

```javascript
class WeatherTileLayer {
  constructor(scene) {
    this.scene = scene;
    this.layer = null;
    this.updateInterval = null;
  }

  start() {
    // 创建气象瓦片图层
    this.layer = new RasterLayer({
      name: 'weather-radar',
    })
      .source('https://weather.example.com/radar/{z}/{x}/{y}.png?time=' + Date.now(), {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
        },
      })
      .style({
        opacity: 0.6,
      });

    this.scene.addLayer(this.layer);

    // 每10分钟更新一次
    this.updateInterval = setInterval(
      () => {
        this.update();
      },
      10 * 60 * 1000,
    );
  }

  update() {
    const timestamp = Date.now();
    this.layer.setData(`https://weather.example.com/radar/{z}/{x}/{y}.png?time=${timestamp}`, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        minZoom: 1,
        maxZoom: 10,
      },
    });
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.layer) {
      this.scene.removeLayer(this.layer);
    }
  }
}

// 使用
const weatherLayer = new WeatherTileLayer(scene);
weatherLayer.start();
```

### 2. 多图层切换

```javascript
const layers = {
  satellite: {
    name: '卫星影像',
    url: 'https://tile.server.com/satellite/{z}/{x}/{y}.jpg',
    layer: null,
  },
  street: {
    name: '街道地图',
    url: 'https://tile.server.com/street/{z}/{x}/{y}.png',
    layer: null,
  },
  terrain: {
    name: '地形图',
    url: 'https://tile.server.com/terrain/{z}/{x}/{y}.png',
    layer: null,
  },
};

// 初始化所有图层
Object.keys(layers).forEach((key) => {
  const config = layers[key];
  config.layer = new RasterLayer({ name: key })
    .source(config.url, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
      },
    })
    .style({
      opacity: key === 'satellite' ? 1.0 : 0, // 默认显示卫星图
    });

  scene.addLayer(config.layer);
});

// 切换图层
function switchLayer(layerKey) {
  Object.keys(layers).forEach((key) => {
    const opacity = key === layerKey ? 1.0 : 0;
    layers[key].layer.style({ opacity });
  });
  scene.render();
}

// UI 控制
document.querySelectorAll('.layer-switch').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const layerKey = e.target.dataset.layer;
    switchLayer(layerKey);
  });
});
```

### 3. 历史影像对比

```javascript
// 对比两个不同时期的影像
const layer2020 = new RasterLayer({ name: 'image-2020' })
  .source('https://tiles.example.com/2020/{z}/{x}/{y}.png', {
    parser: { type: 'rasterTile', tileSize: 256 },
  })
  .style({ opacity: 1.0 });

const layer2025 = new RasterLayer({ name: 'image-2025' })
  .source('https://tiles.example.com/2025/{z}/{x}/{y}.png', {
    parser: { type: 'rasterTile', tileSize: 256 },
  })
  .style({ opacity: 0.0 });

scene.addLayer(layer2020);
scene.addLayer(layer2025);

// 卷帘对比控制
const compareSlider = document.getElementById('compare-slider');
compareSlider.addEventListener('input', (e) => {
  const value = parseFloat(e.target.value); // 0-1
  layer2020.style({ opacity: 1 - value });
  layer2025.style({ opacity: value });
  scene.render();
});
```

### 4. 叠加专题图层

```javascript
// 基础底图
const baseLayer = new RasterLayer({ name: 'base', zIndex: 1 }).source(
  'https://tiles.example.com/base/{z}/{x}/{y}.png',
  {
    parser: { type: 'rasterTile', tileSize: 256 },
  },
);

// 专题图层 - 人口密度
const populationLayer = new RasterLayer({ name: 'population', zIndex: 2 })
  .source('https://tiles.example.com/population/{z}/{x}/{y}.png', {
    parser: { type: 'rasterTile', tileSize: 256 },
  })
  .style({ opacity: 0.6 });

// 专题图层 - 交通路网
const trafficLayer = new RasterLayer({ name: 'traffic', zIndex: 3 })
  .source('https://tiles.example.com/traffic/{z}/{x}/{y}.png', {
    parser: { type: 'rasterTile', tileSize: 256 },
  })
  .style({ opacity: 0.5 });

scene.addLayer(baseLayer);
scene.addLayer(populationLayer);
scene.addLayer(trafficLayer);

// 图层控制面板
function toggleThematicLayer(layerName, visible) {
  const layers = { population: populationLayer, traffic: trafficLayer };
  if (layers[layerName]) {
    visible ? layers[layerName].show() : layers[layerName].hide();
    scene.render();
  }
}
```

## 性能优化

### 1. 设置合理的缩放级别

```javascript
const tileLayer = new RasterLayer().source(tileUrl, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    minZoom: 3, // 避免加载过大范围的瓦片
    maxZoom: 16, // 避免加载过精细的瓦片
  },
});
```

### 2. 使用多子域提高并发

```javascript
const tileLayer = new RasterLayer().source('https://{s}.tile.server.com/{z}/{x}/{y}.png', {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    subdomains: ['a', 'b', 'c', 'd'], // 多个子域并发请求
  },
});
```

### 3. 图层按需加载

```javascript
let rasterLayer = null;

function showRasterLayer() {
  if (!rasterLayer) {
    rasterLayer = new RasterLayer().source(tileUrl, config);
    scene.addLayer(rasterLayer);
  } else {
    rasterLayer.show();
  }
}

function hideRasterLayer() {
  if (rasterLayer) {
    rasterLayer.hide(); // 隐藏而不是销毁，保留缓存
  }
}
```

### 4. 使用较大瓦片尺寸

```javascript
// 512x512 瓦片可减少请求数量
const tileLayer = new RasterLayer().source(tileUrl, {
  parser: {
    type: 'rasterTile',
    tileSize: 512, // 使用 512 而不是 256
    maxZoom: 16,
  },
});
```

## 注意事项

⚠️ **瓦片 URL 格式**：确保使用正确的占位符 `{z}`、`{x}`、`{y}`，TMS 格式使用 `{-y}`

⚠️ **跨域问题**：确保瓦片服务器配置了 CORS 头，或使用代理

⚠️ **缩放级别**：不同瓦片服务支持的缩放级别不同，设置合适的 minZoom/maxZoom

⚠️ **瓦片尺寸**：大多数服务使用 256x256，部分使用 512x512，需与服务匹配

⚠️ **坐标系**：确保瓦片服务使用 Web Mercator (EPSG:3857) 坐标系

⚠️ **API Key**：使用第三方服务时注意 API Key 的有效性和配额限制

⚠️ **性能**：过多图层会影响性能，建议不超过 3-5 个栅格图层同时显示

## 常见问题

### Q: 瓦片无法显示？

A: 检查：1) URL 格式是否正确；2) CORS 配置；3) API Key 是否有效；4) 网络连接；5) 缩放级别范围

### Q: 瓦片加载很慢？

A: 1) 使用多子域配置；2) 使用 CDN；3) 设置合理的缩放级别范围；4) 考虑使用更大的瓦片尺寸

### Q: 瓦片位置偏移？

A: 检查：1) 坐标系是否匹配（Web Mercator）；2) 是否需要使用 TMS 格式（{-y}）；3) zoomOffset 设置

### Q: 如何判断使用 XYZ 还是 TMS？

A: 如果瓦片 Y 轴从上到下递增用 XYZ（`{y}`），从下到上递增用 TMS（`{-y}`）

### Q: 瓦片有缝隙？

A: 1) 检查 tileSize 设置是否与服务匹配；2) 可能是网络加载延迟，等待加载完成

### Q: 如何实现瓦片预加载？

A: L7 会自动缓存已加载的瓦片，可通过调整地图视角提前触发瓦片加载

## 瓦片服务示例

### 国内常用服务

```javascript
// 天地图 (需要申请 token)
'https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=YOUR_TOKEN';

// 高德地图 (供参考，建议使用官方 SDK)
'https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7';

// OpenStreetMap
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
```

### 国际常用服务

```javascript
// Mapbox
'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=YOUR_TOKEN';

// CartoDB
'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

// Stamen
'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png';
```

## 相关技能

- [场景初始化](../01-core/scene-initialization.md)
- [图片图层](./image.md)
- [地图配置](../01-core/map-types.md)

## 在线示例

查看更多示例: [L7 官方示例 - 栅格图层](https://l7.antv.antgroup.com/examples/raster/raster)
