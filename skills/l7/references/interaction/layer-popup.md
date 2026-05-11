---
skill_id: layer-popup
skill_name: 图层弹窗
category: interaction
difficulty: intermediate
tags: [popup, layer-popup, tooltip, interaction, info-box]
dependencies: [scene-initialization, popup, events]
version: 2.x
---

# 图层弹窗 (LayerPopup)

## 技能描述

掌握 LayerPopup 的使用方法，这是一种专门用于展示图层元素信息的弹窗组件。LayerPopup 基于 Popup 封装，可自动监听图层事件并展示要素信息，无需手动绑定事件。

## 何时使用

- ✅ 需要显示图层元素的属性信息
- ✅ 需要快速实现悬停/点击显示详情
- ✅ 需要同时展示多个图层的信息
- ✅ 需要自定义弹窗内容和样式
- ✅ 需要格式化显示字段值

## 前置条件

- 已完成 [场景初始化](../core/scene.md)
- 了解 [Popup](./popup.md) 基础用法
- 已创建需要展示信息的图层

## 核心概念

### LayerPopup vs Popup

| 对比项         | Popup      | LayerPopup   |
| -------------- | ---------- | ------------ |
| **事件绑定**   | 手动绑定   | 自动监听     |
| **配置复杂度** | 高         | 低           |
| **多图层支持** | 需手动管理 | 原生支持     |
| **字段格式化** | 手动处理   | 内置支持     |
| **适用场景**   | 自定义弹窗 | 图层元素信息 |

### 触发方式

LayerPopup 支持多种触发方式：

- `'hover'` (默认) - 鼠标悬停显示
- `'click'` - 鼠标点击显示
- `'touchend'` - 触摸结束显示（移动端）
- `'touchstart'` - 触摸开始显示

## 基础用法

### 1. 最简单的用法

为单个图层添加弹窗：

```javascript
import { Scene, LayerPopup, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120, 30],
    zoom: 10,
  }),
});

scene.on('loaded', () => {
  // 创建点图层
  const pointLayer = new PointLayer()
    .source(
      [
        { lng: 120.1, lat: 30.1, name: '点位 1', value: 100 },
        { lng: 120.2, lat: 30.2, name: '点位 2', value: 200 },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    )
    .shape('circle')
    .size(10)
    .color('#5B8FF9');

  scene.addLayer(pointLayer);

  // 创建 LayerPopup
  const layerPopup = new LayerPopup({
    items: [
      {
        layer: pointLayer,
        fields: ['name', 'value'], // 显示 name 和 value 字段
      },
    ],
    trigger: 'hover', // 悬停触发
  });

  scene.addPopup(layerPopup);
});
```

### 2. 字段格式化

对字段进行格式化显示：

```javascript
const layerPopup = new LayerPopup({
  items: [
    {
      layer: pointLayer,
      fields: [
        {
          field: 'name',
          formatField: (field) => `名称：${field}`, // 格式化字段名
        },
        {
          field: 'value',
          formatValue: (value) => `${value} 人`, // 格式化字段值
        },
        {
          field: 'date',
          formatValue: (date) => new Date(date).toLocaleDateString(), // 日期格式化
        },
      ],
    },
  ],
});

scene.addPopup(layerPopup);
```

### 3. 自定义标题

设置弹窗标题：

```javascript
const layerPopup = new LayerPopup({
  items: [
    {
      layer: pointLayer,
      title: '点位详情', // 固定标题
      fields: ['name', 'value'],
    },
  ],
});

// 或使用回调函数动态生成标题
const layerPopup = new LayerPopup({
  items: [
    {
      layer: pointLayer,
      title: (feature) => `点位：${feature.name}`, // 动态标题
      fields: ['value', 'description'],
    },
  ],
});
```

### 4. 自定义内容

完全自定义弹窗内容：

```javascript
const layerPopup = new LayerPopup({
  items: [
    {
      layer: pointLayer,
      customContent: (feature) => {
        const div = document.createElement('div');
        div.innerHTML = `
          <h3>${feature.name}</h3>
          <p>数值：${feature.value}</p>
          <p>描述：${feature.description}</p>
        `;
        return div;
      },
    },
  ],
});

scene.addPopup(layerPopup);
```

### 5. 多图层弹窗

同时展示多个图层的信息：

```javascript
const layerPopup = new LayerPopup({
  items: [
    {
      layer: pointLayer,
      title: '点位信息',
      fields: ['name', 'value'],
    },
    {
      layer: lineLayer,
      title: '路径信息',
      fields: ['route_name', 'distance'],
    },
    {
      layer: polygonLayer,
      title: '区域信息',
      fields: ['area_name', 'population'],
    },
  ],
  trigger: 'hover',
});

scene.addPopup(layerPopup);
```

## 配置选项

### LayerPopup 配置

```typescript
interface ILayerPopupOption {
  items?: LayerPopupConfigItem[]; // 图层配置数组
  trigger?: 'hover' | 'click' | 'touchend' | 'touchstart'; // 触发方式
  // 继承自 Popup 的配置
  closeButton?: boolean; // 关闭按钮
  closeOnClick?: boolean; // 点击关闭
  maxWidth?: string; // 最大宽度
  anchor?: anchorType; // 锚点位置
  offsets?: [number, number]; // 偏移量
  className?: string; // 自定义类名
  style?: string; // 自定义样式
}
```

### LayerPopupConfigItem 配置

```typescript
interface LayerPopupConfigItem {
  layer: BaseLayer | string; // 图层实例或 ID/名称
  fields?: Array<string | LayerField>; // 字段配置
  customContent?: ElementType | ((feature: any) => ElementType); // 自定义内容
  title?: ElementType | ((feature: any) => ElementType); // 标题
}
```

### LayerField 配置

```typescript
interface LayerField {
  field: string; // 字段名
  formatField?: ElementType | ((field: string, feature: any) => ElementType); // 字段名格式化
  formatValue?: ElementType | ((value: any, feature: any) => ElementType); // 字段值格式化
  getValue?: (feature: any) => any; // 自定义获取值
}
```

## 实际应用场景

### 1. 点位信息展示

```javascript
const poiLayer = new PointLayer()
  .source(poiData, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
  })
  .shape('circle')
  .size(10)
  .color('category', categoryColors);

scene.addLayer(poiLayer);

const poiPopup = new LayerPopup({
  items: [
    {
      layer: poiLayer,
      title: (feature) => `<h3>${feature.name}</h3>`,
      fields: [
        {
          field: 'category',
          formatField: () => '类别',
          formatValue: (value) => getCategoryName(value),
        },
        {
          field: 'address',
          formatField: () => '地址',
        },
        {
          field: 'phone',
          formatField: () => '电话',
        },
        {
          field: 'rating',
          formatField: () => '评分',
          formatValue: (value) => `${value} ⭐`,
        },
      ],
    },
  ],
  trigger: 'hover',
});

scene.addPopup(poiPopup);
```

### 2. 行政区信息展示

```javascript
const provinceLayer = new PolygonLayer().source(provinceData).shape('fill').color('GDP', gdpColors);

scene.addLayer(provinceLayer);

const provincePopup = new LayerPopup({
  items: [
    {
      layer: provinceLayer,
      title: (feature) => `<h3>${feature.name}</h3>`,
      fields: [
        {
          field: 'GDP',
          formatField: () => 'GDP',
          formatValue: (value) => `¥${(value / 10000).toFixed(2)} 万亿`,
        },
        {
          field: 'population',
          formatField: () => '人口',
          formatValue: (value) => `${(value / 10000).toFixed(1)} 万人`,
        },
        {
          field: 'area',
          formatField: () => '面积',
          formatValue: (value) => `${value} km²`,
        },
        {
          field: 'density',
          formatField: () => '人口密度',
          formatValue: (value) => `${value.toFixed(0)} 人/km²`,
        },
      ],
    },
  ],
  trigger: 'hover',
});

scene.addPopup(provincePopup);
```

### 3. 路径信息展示

```javascript
const routeLayer = new LineLayer()
  .source(routeData)
  .shape('line')
  .size('distance', (d) => Math.min(d / 100, 10))
  .color('#5B8FF9');

scene.addLayer(routeLayer);

const routePopup = new LayerPopup({
  items: [
    {
      layer: routeLayer,
      title: (feature) => `<h3>${feature.route_name}</h3>`,
      fields: [
        {
          field: 'start_point',
          formatField: () => '起点',
        },
        {
          field: 'end_point',
          formatField: () => '终点',
        },
        {
          field: 'distance',
          formatField: () => '距离',
          formatValue: (value) => `${(value / 1000).toFixed(2)} km`,
        },
        {
          field: 'duration',
          formatField: () => '预计时间',
          formatValue: (value) => `${Math.floor(value / 60)}小时${value % 60}分钟`,
        },
      ],
    },
  ],
  trigger: 'click', // 点击显示
});

scene.addPopup(routePopup);
```

### 4. 热力图信息展示

```javascript
const heatmapLayer = new HeatmapLayer().source(heatData).size('intensity', [0, 1]).shape('heatmap');

scene.addLayer(heatmapLayer);

const heatPopup = new LayerPopup({
  items: [
    {
      layer: heatmapLayer,
      title: '热力数据',
      fields: [
        {
          field: 'value',
          formatField: () => '热度值',
          formatValue: (value) => value.toFixed(2),
        },
        {
          field: 'density',
          formatField: () => '密度',
          formatValue: (value) => `${value.toFixed(2)} 人/km²`,
        },
      ],
    },
  ],
  trigger: 'hover',
});

scene.addPopup(heatPopup);
```

### 5. 多图层联合展示

```javascript
// 创建多个图层
const buildingLayer = new PolygonLayer({ name: 'buildings' })
  .source(buildingData)
  .shape('fill')
  .color('#5B8FF9');

const roadLayer = new LineLayer({ name: 'roads' })
  .source(roadData)
  .shape('line')
  .size(3)
  .color('#5AD8A6');

const poiLayer = new PointLayer({ name: 'pois' })
  .source(poiData)
  .shape('circle')
  .size(8)
  .color('#F4664A');

scene.addLayer(buildingLayer);
scene.addLayer(roadLayer);
scene.addLayer(poiLayer);

// 创建多图层弹窗
const multiLayerPopup = new LayerPopup({
  items: [
    {
      layer: 'buildings', // 使用图层名称
      title: (feature) => `<h4>🏢 ${feature.name}</h4>`,
      fields: [
        { field: 'type', formatField: () => '类型' },
        { field: 'floors', formatField: () => '层数' },
        { field: 'height', formatField: () => '高度', formatValue: (v) => `${v}m` },
      ],
    },
    {
      layer: 'roads',
      title: (feature) => `<h4>🛣️ ${feature.name}</h4>`,
      fields: [
        { field: 'type', formatField: () => '道路类型' },
        { field: 'length', formatField: () => '长度', formatValue: (v) => `${v}km` },
      ],
    },
    {
      layer: 'pois',
      title: (feature) => `<h4>📍 ${feature.name}</h4>`,
      fields: [
        { field: 'category', formatField: () => '类别' },
        { field: 'address', formatField: () => '地址' },
      ],
    },
  ],
  trigger: 'hover',
});

scene.addPopup(multiLayerPopup);
```

### 6. 自定义 HTML 内容

```javascript
const customPopup = new LayerPopup({
  items: [
    {
      layer: pointLayer,
      customContent: (feature) => {
        const container = document.createElement('div');
        container.style.cssText = 'width: 200px;';

        container.innerHTML = `
          <div style="padding: 10px;">
            <img src="${feature.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px;" />
            <h3 style="margin: 10px 0 5px;">${feature.name}</h3>
            <p style="color: #666; font-size: 12px;">${feature.description}</p>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
              <span style="color: #1890ff;">¥${feature.price}</span>
              <span style="color: #faad14;">⭐ ${feature.rating}</span>
            </div>
            <button onclick="console.log('clicked', ${feature.id})" 
                    style="width: 100%; margin-top: 10px; padding: 5px;">
              查看详情
            </button>
          </div>
        `;

        return container;
      },
    },
  ],
  trigger: 'click',
});

scene.addPopup(customPopup);
```

### 7. 条件显示字段

根据数据动态显示字段：

```javascript
const conditionalPopup = new LayerPopup({
  items: [
    {
      layer: pointLayer,
      title: (feature) => `<h3>${feature.name}</h3>`,
      fields: [
        // 始终显示的字段
        {
          field: 'name',
          formatField: () => '名称',
        },
        // 条件显示的字段
        {
          field: 'phone',
          formatField: () => '电话',
          getValue: (feature) => feature.phone || '暂无',
        },
        {
          field: 'website',
          formatField: () => '网站',
          getValue: (feature) =>
            feature.website ? `<a href="${feature.website}" target="_blank">访问网站</a>` : '暂无',
        },
        // 根据类型显示不同字段
        {
          field: 'rating',
          formatField: () => '评分',
          getValue: (feature) => (feature.type === 'restaurant' ? `${feature.rating} ⭐` : null), // 返回 null 不显示
        },
      ],
    },
  ],
});

scene.addPopup(conditionalPopup);
```

## 方法

### getOptions()

获取当前 Popup 配置：

```javascript
const options = layerPopup.getOptions();
console.log(options);
```

### setOptions()

更新 Popup 配置：

```javascript
layerPopup.setOptions({
  trigger: 'click', // 改为点击触发
  maxWidth: '300px',
});

// 更新字段配置
layerPopup.setOptions({
  items: [
    {
      layer: pointLayer,
      fields: ['new_field1', 'new_field2'],
    },
  ],
});
```

### show() / hide()

显示/隐藏 Popup：

```javascript
layerPopup.show(); // 显示
layerPopup.hide(); // 隐藏
```

### setLngLat()

设置 Popup 锚点位置：

```javascript
layerPopup.setLngLat([120.1, 30.1]);
```

### panToPopup()

将地图平移至 Popup 位置：

```javascript
layerPopup.panToPopup();
```

## 事件

### open

Popup 打开时触发：

```javascript
layerPopup.on('open', () => {
  console.log('Popup 已打开');
});
```

### close

Popup 关闭时触发：

```javascript
layerPopup.on('close', () => {
  console.log('Popup 已关闭');
});
```

### show

Popup 显示时触发：

```javascript
layerPopup.on('show', () => {
  console.log('Popup 显示');
});
```

### hide

Popup 隐藏时触发：

```javascript
layerPopup.on('hide', () => {
  console.log('Popup 隐藏');
});
```

## 样式定制

### 自定义 CSS 类名

```javascript
const layerPopup = new LayerPopup({
  className: 'custom-popup',
  items: [...],
});

// CSS
/*
.custom-popup .l7-popup-content {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.custom-popup h3 {
  margin: 0;
  padding: 12px;
  background: #1890ff;
  color: white;
  border-radius: 8px 8px 0 0;
}

.custom-popup .popup-field {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}
*/
```

### 内联样式

```javascript
const layerPopup = new LayerPopup({
  style: 'max-width: 300px; font-family: Arial;',
  items: [...],
});
```

## 常见问题

### Q: LayerPopup 不显示怎么办？

A: 检查以下几点：

1. 图层是否正确添加到 Scene
2. 图层是否有数据
3. fields 配置的字段名是否正确
4. trigger 触发方式是否合适
5. 检查浏览器控制台是否有错误

### Q: 如何禁用某个图层的弹窗？

A: 从 items 数组中移除该图层配置：

```javascript
layerPopup.setOptions({
  items: [
    // 只保留需要显示的图层
    {
      layer: pointLayer,
      fields: ['name'],
    },
  ],
});
```

### Q: 如何动态更新弹窗内容？

A: 使用 `setOptions` 方法：

```javascript
// 根据缩放级别更新显示字段
scene.on('zoomchange', () => {
  const zoom = scene.getZoom();

  if (zoom < 10) {
    layerPopup.setOptions({
      items: [{ layer: pointLayer, fields: ['name'] }],
    });
  } else {
    layerPopup.setOptions({
      items: [
        {
          layer: pointLayer,
          fields: ['name', 'address', 'phone'],
        },
      ],
    });
  }
});
```

### Q: 如何自定义弹窗位置？

A: 使用 `offsets` 配置：

```javascript
const layerPopup = new LayerPopup({
  offsets: [0, 20], // [水平偏移，垂直偏移]
  items: [...],
});
```

### Q: 如何在移动端使用？

A: 使用触摸触发方式：

```javascript
const layerPopup = new LayerPopup({
  trigger: 'touchend', // 或 'touchstart'
  items: [...],
});
```

### Q: 如何关闭自动关闭功能？

A: 配置 `closeOnClick` 和 `closeOnEsc`：

```javascript
const layerPopup = new LayerPopup({
  closeOnClick: false, // 点击地图不关闭
  closeOnEsc: false, // 按 Esc 不关闭
  items: [...],
});
```

## 注意事项

⚠️ **图层添加顺序**：先添加图层到 Scene，再添加 LayerPopup

⚠️ **字段名匹配**：fields 中的字段名必须与数据中的字段名一致

⚠️ **性能考虑**：hover 触发在大数据量时可能影响性能，可考虑使用 click 触发

⚠️ **移动端适配**：移动端建议使用 'touchend' 或 'click' 触发

⚠️ **自定义内容**：使用 customContent 时注意事件绑定和内存清理

⚠️ **多图层冲突**：多个图层在同一位置时，可能只显示最上层图层的信息

## 相关技能

- [Popup](./popup.md) - 基础弹窗组件
- [事件处理](./events.md) - 图层事件监听
- [Marker](./components.md) - 标注组件
- [图层通用方法](../layers/base-layer.md) - 图层 API

## 在线示例

查看更多示例：[L7 LayerPopup 示例](https://l7.antv.antgroup.com/examples/component/popup#layerpopup)
