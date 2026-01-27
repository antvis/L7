---
skill_id: polygon-layer
skill_name: 面图层
category: layers
difficulty: beginner
tags: [polygon, fill, extrude, 3d, choropleth]
dependencies: [scene-initialization]
version: 2.x
---

# 面图层

## 技能描述

在地图上绘制面状地理要素，支持填充图、3D 挤出、等值图等多种形式。

## 何时使用

- ✅ 显示行政区划（省、市、区）
- ✅ 显示建筑轮廓（2D/3D）
- ✅ 显示土地利用分类
- ✅ 显示等值区域（人口密度、经济指标）
- ✅ 显示湖泊、公园等区域
- ✅ 制作热力分区图

## 前置条件

- 已完成[场景初始化](../core/scene.md)
- 准备好面数据（通常是 GeoJSON 格式）

## 面类型

| 类型      | 说明     | 适用场景           |
| --------- | -------- | ------------------ |
| `fill`    | 2D 填充  | 行政区划、土地分类 |
| `extrude` | 3D 挤出  | 建筑、人口柱状图   |
| `water`   | 水面效果 | 湖泊、海洋         |
| `ocean`   | 海洋效果 | 全球海洋           |

## 通用方法

面图层继承了所有图层的通用能力，以下是最常用的方法：

### 显示控制

```javascript
// 显示/隐藏图层
polygonLayer.show();
polygonLayer.hide();

// 设置图层顺序（面图层通常在底层）
polygonLayer.setIndex(1);

// 缩放到图层范围
polygonLayer.fitBounds();
```

### 事件监听

```javascript
// 点击区域
polygonLayer.on('click', (e) => {
  console.log('区域名称:', e.feature.properties.name);
  console.log('区域数据:', e.feature);
});

// 鼠标悬停高亮
polygonLayer.on('mousemove', (e) => {
  // 高亮当前区域
});

polygonLayer.on('mouseout', () => {
  // 取消高亮
});
```

### 数据过滤

```javascript
// 只显示特定省份
polygonLayer.filter((feature) => {
  return ['浙江省', '江苏省', '上海市'].includes(feature.name);
});
```

> 📖 **完整文档**：查看 [图层通用方法和事件](./layer-common-api.md) 了解所有通用 API。

---

## 代码示例

### 基础用法 - 区域填充

```javascript
import { PolygonLayer } from '@antv/l7';

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json')
    .then((res) => res.json())
    .then((data) => {
      const polygonLayer = new PolygonLayer().source(data).shape('fill').color('#5B8FF9').style({
        opacity: 0.6,
      });

      scene.addLayer(polygonLayer);
    });
});
```

### 数据驱动 - 等值图

```javascript
const provinceLayer = new PolygonLayer()
  .source(provinceData)
  .shape('fill')
  .color('gdp', ['#FFF5B8', '#FFAB5C', '#FF6B3B', '#CC2B12']) // GDP 分级着色
  .style({
    opacity: 0.8,
  });

scene.addLayer(provinceLayer);
```

### 自定义颜色映射

```javascript
const landUseLayer = new PolygonLayer()
  .source(landUseData)
  .shape('fill')
  .color('type', {
    住宅: '#5B8FF9',
    商业: '#5AD8A6',
    工业: '#5D7092',
    绿地: '#61DDAA',
    水域: '#65789B',
  })
  .style({
    opacity: 0.7,
  });

scene.addLayer(landUseLayer);
```

### 带描边的填充图

```javascript
// 填充层
const fillLayer = new PolygonLayer()
  .source(data)
  .shape('fill')
  .color('value', ['#FFF5B8', '#FFAB5C', '#FF6B3B'])
  .style({
    opacity: 0.8,
  });

// 描边层
const lineLayer = new LineLayer().source(data).shape('line').size(1).color('#fff').style({
  opacity: 0.6,
});

scene.addLayer(fillLayer);
scene.addLayer(lineLayer);
```

### 3D 建筑 - 挤出效果

```javascript
const buildingLayer = new PolygonLayer()
  .source(buildingData)
  .shape('extrude')
  .size('height') // 根据 height 字段设置高度
  .color('type', {
    住宅: '#5B8FF9',
    商业: '#5AD8A6',
    办公: '#5D7092',
  })
  .style({
    opacity: 0.8,
  });

scene.addLayer(buildingLayer);

// 确保场景有倾斜角度才能看到 3D 效果
scene.setPitch(45);
```

### 3D 人口柱状图

```javascript
const populationLayer = new PolygonLayer()
  .source(districtData)
  .shape('extrude')
  .size('population', [0, 50000]) // 人口映射到高度
  .color('population', ['#FFF5B8', '#FFAB5C', '#FF6B3B', '#CC2B12'])
  .style({
    opacity: 0.8,
  });

scene.addLayer(populationLayer);
```

### 水面效果

```javascript
const lakeLayer = new PolygonLayer()
  .source(lakeData)
  .shape('water')
  .color('#6495ED')
  .style({
    opacity: 0.8,
    speed: 0.5, // 水波速度
  })
  .animate(true);

scene.addLayer(lakeLayer);
```

### 海洋效果

```javascript
const oceanLayer = new PolygonLayer()
  .source(oceanData)
  .shape('ocean')
  .color('#284AC9')
  .style({
    opacity: 0.8,
  })
  .animate(true);

scene.addLayer(oceanLayer);
```

## 数据格式要求

### GeoJSON 格式（推荐）

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "浙江省",
        "adcode": "330000",
        "gdp": 82553,
        "population": 6540
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [120.19, 30.26],
            [120.2, 30.27],
            [120.21, 30.26],
            [120.19, 30.26]
          ]
        ]
      }
    }
  ]
}
```

使用 GeoJSON：

```javascript
layer.source(geojsonData, {
  parser: {
    type: 'geojson',
  },
});
```

### MultiPolygon（多面）

```json
{
  "type": "Feature",
  "properties": {
    "name": "浙江省（含岛屿）"
  },
  "geometry": {
    "type": "MultiPolygon",
    "coordinates": [
      [
        [
          [120.19, 30.26],
          [120.2, 30.27],
          [120.21, 30.26],
          [120.19, 30.26]
        ]
      ],
      [
        [
          [122.1, 30.0],
          [122.11, 30.01],
          [122.12, 30.0],
          [122.1, 30.0]
        ]
      ]
    ]
  }
}
```

### 3D 建筑数据格式

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "大厦A",
        "height": 150,
        "floors": 30,
        "type": "商业"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      }
    }
  ]
}
```

## 样式配置详解

### 2D 填充样式

```javascript
layer.style({
  opacity: 0.8, // 透明度
  stroke: '#fff', // 描边颜色（需要配合 lineLayer）
  strokeWidth: 1, // 描边宽度
});
```

### 3D 挤出样式

```javascript
layer.style({
  opacity: 0.8,
  extrudeBase: 0, // 挤出基准高度
  pickLight: true, // 是否接受光照
});
```

### 水面样式

```javascript
layer.style({
  opacity: 0.8,
  speed: 0.5, // 水波动画速度
});
```

## 常见问题

### 1. 面不显示

**检查清单**:

- ✅ GeoJSON 数据格式是否正确
- ✅ 坐标顺序是否正确（经度在前，纬度在后）
- ✅ 多边形是否闭合（首尾坐标相同）
- ✅ 颜色是否与背景相同
- ✅ opacity 是否为 0

```javascript
// 调试代码
console.log('数据:', data);
layer.color('#FF0000'); // 使用明显颜色
layer.style({ opacity: 1 });
```

### 2. 3D 效果看不到

需要设置地图倾斜：

```javascript
// 创建场景时设置
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 45, // 倾斜角度
    center: [120, 30],
    zoom: 12,
  }),
});

// 或运行时设置
scene.setPitch(45);
```

### 3. 数据加载慢

**优化方案**:

```javascript
// 1. 简化几何形状
layer.source(data, {
  parser: {
    type: 'geojson',
  },
  transforms: [
    {
      type: 'simplify',
      tolerance: 0.01, // 简化容差
    },
  ],
});

// 2. 根据缩放级别显示
layer.setMinZoom(5);
layer.setMaxZoom(15);
```

### 4. 描边效果不明显

需要单独创建线图层：

```javascript
// 填充层
const fillLayer = new PolygonLayer()
  .source(data)
  .shape('fill')
  .color('#5B8FF9')
  .style({ opacity: 0.6 });

// 线图层
const lineLayer = new LineLayer()
  .source(data)
  .shape('line')
  .size(2)
  .color('#fff')
  .style({ opacity: 1 });

scene.addLayer(fillLayer);
scene.addLayer(lineLayer);
```

## 高级用法

### 分级设色图（Choropleth）

```javascript
// 配置比例尺
layer
  .source(data)
  .shape('fill')
  .color('value', ['#FFF5B8', '#FFAB5C', '#FF6B3B', '#CC2B12'])
  .scale('value', {
    type: 'quantize', // 分段类型
    domain: [0, 1000],
  })
  .style({
    opacity: 0.8,
  });

// 添加图例
import { Legend } from '@antv/l7';

const legend = new Legend({
  position: 'bottomright',
  items: [
    { value: '0-250', color: '#FFF5B8' },
    { value: '250-500', color: '#FFAB5C' },
    { value: '500-750', color: '#FF6B3B' },
    { value: '750-1000', color: '#CC2B12' },
  ],
});

scene.addControl(legend);
```

### 动态更新数据

```javascript
// 更新数据
const newData = {...};
layer.setData(newData);

// 更新样式
layer.color('newField', ['#5B8FF9', '#5AD8A6']);
scene.render();
```

### 高亮选中区域

```javascript
layer.on('click', (e) => {
  // 重置之前的高亮
  if (layer.selectedFeatureId) {
    layer.setActive(layer.selectedFeatureId, false);
  }

  // 高亮当前选中
  layer.setActive(e.featureId, true);
  layer.selectedFeatureId = e.featureId;
});

// 配置高亮样式
layer.style({
  selectColor: '#FF0000',
});
```

## 相关技能

- [图层通用方法和事件](./layer-common-api.md)
- [场景初始化](../core/scene.md)
- [线图层（描边）](./line.md)
- [颜色映射](../visual/mapping.md)
- [事件交互](../interaction/events.md)
- [添加弹窗](../interaction/popup.md)
- [添加图例](../interaction/components.md)

## 在线示例

查看更多示例: [L7 官方示例 - 面图层](https://l7.antv.antgroup.com/examples/polygon/fill)
