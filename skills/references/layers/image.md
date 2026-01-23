---
skill_id: image-layer
skill_name: 图片图层
category: layers
difficulty: beginner
tags: [image, layer, raster, overlay, photo]
dependencies: [scene-initialization]
version: 2.x
---

# 图片图层

## 技能描述

在地图上叠加显示图片，支持卫星图、航拍图、扫描地图、历史地图等图片的精确定位和显示。

## 何时使用

- ✅ 显示卫星遥感图片（卫星影像、航拍照片）
- ✅ 叠加历史地图（古地图对比、历史影像）
- ✅ 显示扫描文档（建筑平面图、工程图纸）
- ✅ 展示分析结果图（热力分析图、风险区域图）
- ✅ 自定义底图（特殊区域地图、室内地图）

## 前置条件

- 已完成[场景初始化](../01-core/scene-initialization.md)
- 准备好图片 URL 或 Base64 数据
- 确定图片的地理边界坐标（四个角点）

## 输入参数

### 数据格式

```typescript
interface ImageData {
  extent: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  // 或使用四个角点
  coordinates: [
    [number, number], // 左上角 [lng, lat]
    [number, number], // 右上角 [lng, lat]
    [number, number], // 右下角 [lng, lat]
    [number, number], // 左下角 [lng, lat]
  ];
}
```

### 图层配置

| 方法                  | 参数                        | 说明           |
| --------------------- | --------------------------- | -------------- |
| `source(url, config)` | url: 图片地址, config: 配置 | 设置图片数据源 |
| `shape(type)`         | type: 形状类型              | image（默认）  |
| `style(config)`       | config: 样式对象            | 设置样式       |

## 输出

返回 `ImageLayer` 实例

## 代码示例

### 基础用法 - extent 方式

```javascript
import { ImageLayer } from '@antv/l7';

scene.on('loaded', () => {
  const imageLayer = new ImageLayer()
    .source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
      parser: {
        type: 'image',
        extent: [121.168, 30.2828, 121.384, 30.4219], // [西, 南, 东, 北]
      },
    })
    .style({
      opacity: 1.0,
    });

  scene.addLayer(imageLayer);
});
```

### 四角点定位方式

```javascript
const imageLayer = new ImageLayer().source('https://example.com/aerial-photo.jpg', {
  parser: {
    type: 'image',
    coordinates: [
      [121.168, 30.4219], // 左上角 [经度, 纬度]
      [121.384, 30.4219], // 右上角
      [121.384, 30.2828], // 右下角
      [121.168, 30.2828], // 左下角
    ],
  },
});

scene.addLayer(imageLayer);
```

### Base64 图片

```javascript
const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANS...';

const imageLayer = new ImageLayer()
  .source(base64Image, {
    parser: {
      type: 'image',
      extent: [120.0, 30.0, 121.0, 31.0],
    },
  })
  .style({
    opacity: 0.8,
  });

scene.addLayer(imageLayer);
```

### 多张图片叠加

```javascript
const images = [
  {
    url: 'https://example.com/layer1.png',
    extent: [121.0, 30.0, 122.0, 31.0],
    opacity: 0.5,
  },
  {
    url: 'https://example.com/layer2.png',
    extent: [121.0, 30.0, 122.0, 31.0],
    opacity: 0.7,
  },
];

images.forEach((img, index) => {
  const layer = new ImageLayer({ name: `image-${index}` })
    .source(img.url, {
      parser: {
        type: 'image',
        extent: img.extent,
      },
    })
    .style({
      opacity: img.opacity,
    });

  scene.addLayer(layer);
});
```

### 动态更新图片

```javascript
const imageLayer = new ImageLayer().source('https://example.com/image1.jpg', {
  parser: {
    type: 'image',
    extent: [121.0, 30.0, 122.0, 31.0],
  },
});

scene.addLayer(imageLayer);

// 切换图片
function updateImage(newUrl) {
  imageLayer.setData(newUrl, {
    parser: {
      type: 'image',
      extent: [121.0, 30.0, 122.0, 31.0],
    },
  });
}

// 使用示例
updateImage('https://example.com/image2.jpg');
```

### 带交互的图片图层

```javascript
const imageLayer = new ImageLayer()
  .source('https://example.com/floor-plan.png', {
    parser: {
      type: 'image',
      extent: [121.4737, 31.2304, 121.4837, 31.2404],
    },
  })
  .style({
    opacity: 0.8,
  });

// 点击事件
imageLayer.on('click', (e) => {
  console.log('点击位置:', e.lngLat);

  // 显示信息弹窗
  const popup = new L7.Popup({
    offsets: [0, 0],
    closeButton: false,
  })
    .setLnglat(e.lngLat)
    .setHTML(`<div>坐标: ${e.lngLat.lng.toFixed(4)}, ${e.lngLat.lat.toFixed(4)}</div>`)
    .addTo(scene);
});

// 鼠标悬停改变透明度
imageLayer.on('mousemove', () => {
  imageLayer.style({ opacity: 1.0 });
  scene.render();
});

imageLayer.on('mouseout', () => {
  imageLayer.style({ opacity: 0.8 });
  scene.render();
});

scene.addLayer(imageLayer);
```

## 样式配置详解

### 基础样式

```javascript
{
  opacity: 1.0,          // 透明度，0-1，默认 1.0
  clampLow: true,        // 是否裁剪低于最小值的部分
  clampHigh: true,       // 是否裁剪高于最大值的部分
  domain: [0, 1],        // 数据值域范围
  rampColors: {          // 颜色映射（用于灰度图）
    colors: [...],
    positions: [...]
  }
}
```

## 常见场景

### 1. 卫星影像叠加

```javascript
// 叠加高清卫星图
const satelliteLayer = new ImageLayer()
  .source('https://api.example.com/satellite/tile.jpg', {
    parser: {
      type: 'image',
      extent: [116.3, 39.9, 116.5, 40.1], // 北京区域
    },
  })
  .style({
    opacity: 0.8,
  });

scene.addLayer(satelliteLayer);

// 添加滑动条控制透明度
const slider = document.getElementById('opacity-slider');
slider.addEventListener('input', (e) => {
  const opacity = parseFloat(e.target.value);
  satelliteLayer.style({ opacity });
  scene.render();
});
```

### 2. 历史地图对比

```javascript
let showHistorical = false;

// 当前地图（默认显示）
const currentMap = new ImageLayer({ name: 'current' })
  .source('https://example.com/current-map.jpg', {
    parser: {
      type: 'image',
      extent: [121.0, 30.0, 122.0, 31.0],
    },
  })
  .style({ opacity: 1.0 });

// 历史地图（初始隐藏）
const historicalMap = new ImageLayer({ name: 'historical' })
  .source('https://example.com/historical-map.jpg', {
    parser: {
      type: 'image',
      extent: [121.0, 30.0, 122.0, 31.0],
    },
  })
  .style({ opacity: 0.0 });

scene.addLayer(currentMap);
scene.addLayer(historicalMap);

// 切换按钮
document.getElementById('toggle-btn').addEventListener('click', () => {
  showHistorical = !showHistorical;

  currentMap.style({ opacity: showHistorical ? 0 : 1 });
  historicalMap.style({ opacity: showHistorical ? 1 : 0 });
  scene.render();
});
```

### 3. 建筑平面图

```javascript
// 室内平面图
const floorPlan = new ImageLayer()
  .source('https://example.com/floor-1.png', {
    parser: {
      type: 'image',
      coordinates: [
        [121.4737, 31.2404], // 左上
        [121.4837, 31.2404], // 右上
        [121.4837, 31.2304], // 右下
        [121.4737, 31.2304], // 左下
      ],
    },
  })
  .style({
    opacity: 0.9,
  });

scene.addLayer(floorPlan);

// 楼层切换
const floors = {
  '1F': 'https://example.com/floor-1.png',
  '2F': 'https://example.com/floor-2.png',
  '3F': 'https://example.com/floor-3.png',
};

function switchFloor(floorName) {
  floorPlan.setData(floors[floorName], {
    parser: {
      type: 'image',
      coordinates: [
        [121.4737, 31.2404],
        [121.4837, 31.2404],
        [121.4837, 31.2304],
        [121.4737, 31.2304],
      ],
    },
  });
}
```

### 4. 雷达气象图

```javascript
// 实时更新的雷达图
class WeatherRadar {
  constructor(scene) {
    this.scene = scene;
    this.layer = null;
    this.updateInterval = null;
  }

  start() {
    this.layer = new ImageLayer()
      .source('', {
        parser: {
          type: 'image',
          extent: [115.0, 28.0, 125.0, 38.0], // 覆盖区域
        },
      })
      .style({
        opacity: 0.7,
      });

    this.scene.addLayer(this.layer);
    this.update();

    // 每5分钟更新一次
    this.updateInterval = setInterval(
      () => {
        this.update();
      },
      5 * 60 * 1000,
    );
  }

  async update() {
    try {
      const response = await fetch('/api/weather/radar/latest');
      const data = await response.json();

      this.layer.setData(data.imageUrl, {
        parser: {
          type: 'image',
          extent: [115.0, 28.0, 125.0, 38.0],
        },
      });
    } catch (error) {
      console.error('更新雷达图失败:', error);
    }
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
const radar = new WeatherRadar(scene);
radar.start();
```

## 性能优化

### 1. 图片尺寸优化

```javascript
// 使用合适分辨率的图片
// 根据显示区域大小选择图片
const mapWidth = scene.getSize().width;
const mapHeight = scene.getSize().height;

// 推荐图片分辨率不超过显示区域的 2 倍
const recommendedWidth = mapWidth * 2;
const recommendedHeight = mapHeight * 2;

// 使用 CDN 图片服务调整尺寸
const imageUrl = `https://cdn.example.com/image.jpg?w=${recommendedWidth}&h=${recommendedHeight}`;
```

### 2. 懒加载

```javascript
// 只在需要时加载图片图层
let imageLayer = null;

function showImageLayer() {
  if (!imageLayer) {
    imageLayer = new ImageLayer().source('https://example.com/large-image.jpg', {
      parser: {
        type: 'image',
        extent: [121.0, 30.0, 122.0, 31.0],
      },
    });

    scene.addLayer(imageLayer);
  } else {
    imageLayer.show();
  }
}

function hideImageLayer() {
  if (imageLayer) {
    imageLayer.hide();
  }
}
```

### 3. 使用 WebP 格式

```javascript
// WebP 格式可减少 25-35% 的文件大小
const imageLayer = new ImageLayer().source('https://example.com/image.webp', {
  parser: {
    type: 'image',
    extent: [121.0, 30.0, 122.0, 31.0],
  },
});
```

## 注意事项

⚠️ **坐标顺序**：extent 格式为 `[minLng, minLat, maxLng, maxLat]`（西南东北）

⚠️ **图片大小**：建议单张图片不超过 5MB，过大会影响加载速度

⚠️ **跨域问题**：确保图片服务器配置了正确的 CORS 头

⚠️ **坐标精度**：确保图片边界坐标准确，否则会出现偏移或变形

⚠️ **透明度**：PNG 格式支持透明度，JPG 不支持

⚠️ **更新性能**：频繁更新图片会影响性能，建议控制更新频率

## 常见问题

### Q: 图片无法显示？

A: 检查：1) 图片 URL 是否可访问；2) CORS 配置；3) extent 坐标是否正确；4) 图片格式是否支持

### Q: 图片位置偏移？

A: 检查 extent 或 coordinates 的坐标是否准确，注意经纬度顺序

### Q: 图片模糊？

A: 使用更高分辨率的图片，或使用原始尺寸而非缩放后的图片

### Q: 图片加载慢？

A: 1) 压缩图片大小；2) 使用 CDN；3) 使用 WebP 格式；4) 预加载图片

### Q: 如何实现图片淡入效果？

A: 创建图层时设置 opacity: 0，然后逐渐增加到 1

```javascript
const layer = new ImageLayer().style({ opacity: 0 });
scene.addLayer(layer);

let opacity = 0;
const fadeIn = setInterval(() => {
  opacity += 0.05;
  if (opacity >= 1) {
    opacity = 1;
    clearInterval(fadeIn);
  }
  layer.style({ opacity });
  scene.render();
}, 50);
```

## 相关技能

- [场景初始化](../01-core/scene-initialization.md)
- [栅格图层](./raster-layer.md)
- [瓦片图层](./tile-layer.md)
- [事件处理](../05-interaction/event-handling.md)

## 在线示例

查看更多示例: [L7 官方示例 - 图片图层](https://l7.antv.antgroup.com/examples/raster/image)
