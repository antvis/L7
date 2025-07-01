# L7 相对坐标系 Layer 层实现

## 概述

L7 现在支持在 Layer 层实现相对坐标系，通过 Source 模块进行坐标转换，同时在交互计算时保持使用绝对坐标。这种实现方式提供了更好的架构设计和使用体验。

## 主要特性

### 1. Layer 层配置

- 通过 `enableRelativeCoordinates` 选项启用相对坐标系
- 自动处理坐标转换，无需手动计算
- 保持向后兼容性

### 2. 自动坐标处理

- **渲染时**: 使用相对坐标，提高精度
- **交互时**: 使用绝对坐标，确保正确的地理位置计算
- **原点计算**: 自动计算数据边界框的中心点作为相对原点

### 3. 高精度支持

- 坐标转换使用 `toPrecision(15)` 保持最高精度
- 支持嵌套坐标结构（多边形、多重多边形等）
- 有效坐标范围从大数值变为小数值（±0.001 范围）

## 使用方法

### 基础用法

```typescript
import { PolygonLayer } from '@antv/l7';

const layer = new PolygonLayer()
  .source(data, {
    parser: {
      type: 'geojson',
    },
  })
  .shape('fill')
  .color('#ff0000')
  .style({
    opacity: 0.8,
    // 启用相对坐标系
    enableRelativeCoordinates: true,
  });

scene.addLayer(layer);
```

### 获取相对坐标信息

```typescript
layer.on('inited', () => {
  // 获取相对坐标原点
  const origin = layer.getRelativeOrigin();
  console.log('Relative origin:', origin);

  // 获取原始数据范围
  const extent = layer.getOriginalExtent();
  console.log('Original extent:', extent);

  // 获取绝对坐标数据（用于交互）
  const absoluteData = layer.getAbsoluteData();
  console.log('Absolute data for interactions:', absoluteData.length);
});
```

### 完整示例

```typescript
import { Scene, PolygonLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'dark',
    center: [121.434765, 31.256735],
    zoom: 18,
    pitch: 45,
  }),
});

scene.on('loaded', () => {
  fetch('your-high-precision-data.geojson')
    .then((res) => res.json())
    .then((data) => {
      const layer = new PolygonLayer({
        autoFit: true,
      })
        .source(data, {
          parser: {
            type: 'geojson',
          },
        })
        .shape('fill')
        .color('red')
        .style({
          opacity: 0.8,
          // 启用相对坐标系，适用于高精度场景
          enableRelativeCoordinates: true,
        });

      scene.addLayer(layer);

      // 交互事件仍然使用绝对坐标
      layer.on('click', (e) => {
        console.log('Clicked feature:', e.feature);
        console.log('Absolute coordinates preserved for interaction');
      });
    });
});
```

## 技术实现

### 1. 架构设计

```
用户数据 (绝对坐标)
    ↓
Layer.processRelativeCoordinates()
    ↓
Source.processRelativeCoordinates()
    ↓
渲染数据 (相对坐标) + 交互数据 (绝对坐标)
```

### 2. 核心组件

#### Source 层工具 (`packages/source/src/utils/relative-coordinates.ts`)

- `calculateRelativeOrigin()`: 计算相对坐标原点
- `convertToRelativeCoordinates()`: 转换为相对坐标
- `convertToAbsoluteCoordinates()`: 转换回绝对坐标
- `processRelativeCoordinates()`: 主处理函数

#### Layer 层集成 (`packages/layers/src/core/BaseLayer.ts`)

- `processRelativeCoordinates()`: 处理相对坐标转换
- `getAbsoluteData()`: 获取绝对坐标数据
- `getRelativeOrigin()`: 获取相对坐标原点
- `getOriginalExtent()`: 获取原始数据范围

#### 接口定义 (`packages/layers/src/core/interface.ts`)

- `IBaseLayerStyleOptions.enableRelativeCoordinates`: 启用选项

### 3. 坐标转换流程

1. **数据加载**: Layer 接收绝对坐标数据
2. **检查配置**: 判断是否启用 `enableRelativeCoordinates`
3. **计算原点**: 自动计算数据边界框中心点
4. **坐标转换**: 将绝对坐标转换为相对坐标
5. **数据分离**:
   - 渲染使用相对坐标数据
   - 交互保留绝对坐标数据
6. **更新范围**: 更新 Source 的范围和中心点信息

## 适用场景

### 1. 室内地图

- 高精度建筑物内部结构
- 楼层平面图
- 室内导航路径

### 2. 高缩放级别地图

- Zoom > 20 的精细场景
- 厘米级精度要求
- 测量和标注应用

### 3. 工程制图

- CAD 数据可视化
- 工程图纸展示
- 精密设备布局

## 性能优化

### 1. 精度提升

- 从 6-7 位有效数字提升到 15 位
- 消除浮点数精度丢失
- 避免高缩放级别下的抖动问题

### 2. 内存管理

- 智能数据分离存储
- 按需转换坐标
- 避免重复计算

### 3. 渲染优化

- 相对坐标下更稳定的渲染
- 减少 GPU 计算误差
- 提高图形质量

## 与现有系统的兼容性

### 1. 向后兼容

- 默认不启用相对坐标系
- 现有代码无需修改
- 渐进式升级支持

### 2. 坐标系共存

- 支持同一场景中混合使用
- 不同 Layer 可以独立配置
- 交互计算统一使用绝对坐标

### 3. 地图服务兼容

- 支持所有 L7 支持的地图服务
- 不依赖特定底图实现
- 保持地图交互的一致性

## 调试和监控

### 1. 开发工具

```typescript
// 检查相对坐标转换状态
console.log('Layer relative coordinate status:', {
  enabled: layer.getLayerConfig().enableRelativeCoordinates,
  origin: layer.getRelativeOrigin(),
  extent: layer.getOriginalExtent(),
  dataCount: layer.getAbsoluteData().length,
});
```

### 2. 性能监控

```typescript
// 监控坐标转换性能
layer.on('inited', () => {
  const start = performance.now();
  // 坐标转换完成
  const end = performance.now();
  console.log(`Coordinate conversion took ${end - start} ms`);
});
```

## 最佳实践

### 1. 何时使用

- 数据坐标精度要求高于 6 位小数
- 地图缩放级别 > 18
- 需要显示精细几何结构
- 存在坐标抖动问题

### 2. 配置建议

```typescript
// 推荐配置
.style({
  enableRelativeCoordinates: true,  // 启用相对坐标
  opacity: 0.8,
  // 其他样式配置...
})
```

### 3. 数据准备

- 确保输入数据使用高精度坐标
- 验证数据范围合理性
- 测试坐标转换结果

## 故障排除

### 1. 常见问题

- **坐标显示异常**: 检查数据格式和坐标系
- **交互位置偏移**: 确认使用绝对坐标进行交互
- **性能问题**: 评估数据量和转换复杂度

### 2. 调试步骤

1. 验证原始数据格式
2. 检查相对坐标转换结果
3. 确认渲染和交互数据分离
4. 测试不同缩放级别下的表现

## 未来扩展

### 1. 自定义原点

- 支持用户指定相对坐标原点
- 多个数据源共享原点
- 原点持久化存储

### 2. 坐标系转换

- 支持更多坐标系类型
- 投影坐标系转换
- 自定义转换函数

### 3. 性能优化

- WebWorker 并行处理
- 增量坐标更新
- 缓存机制优化
