# 多底图切换演示

本演示展示了 L7 如何在不同地图提供商之间无缝切换，验证了地图服务方法对齐重构的成果。

## 功能特性

- **多底图支持**：支持高德、百度、腾讯、Mapbox、MapLibre 等多种地图服务
- **统一 API**：通过统一的接口抽象，上层代码无需关心底层地图实现
- **Zoom 偏移对齐**：自动处理不同地图的缩放层级差异
- **样式配置统一**：提供一致的样式配置接口

## 使用方法

### 方式一：独立 HTML 页面

直接打开 `examples/multi-basemap-demo.html` 文件，在浏览器中查看交互式演示。

```bash
# 使用本地服务器打开（推荐）
npx serve examples/multi-basemap-demo.html
```

### 方式二：集成到 Examples 系统

该 demo 已集成到 L7 的 examples 系统中，可以通过以下方式访问：

1. 启动 examples 开发服务器
2. 在 GUI 面板中选择 `basemap` -> `multiBasemap`
3. 通过顶部的 map 下拉菜单切换不同的底图类型

支持的底图类型：

- `Map`: L7 默认地图
- `AMap`: 高德地图
- `BaiduMap`: 百度地图
- `TencentMap`: 腾讯地图
- `GoogleMap`: Google 地图
- `Mapbox`: Mapbox
- `MapLibre`: MapLibre

## 技术实现

### Zoom 偏移机制

不同地图服务商的缩放层级定义不同，为了实现视觉一致性，我们引入了 Zoom 偏移机制：

```typescript
// BaseMapService 中的统一实现
protected zoomOffset: number = 0;

public getZoom(): number {
  return this.map.getZoom() - this.zoomOffset;
}

public setZoom(zoom: number): void {
  return this.map.setZoom(zoom + this.zoomOffset);
}
```

各地图的偏移配置：

- **百度地图 (BMap)**: `zoomOffset = 1.75`
- **腾讯地图 (TMap)**: `zoomOffset = 1`
- **Google 地图 (GMap)**: `zoomOffset = 1`
- **其他地图**: `zoomOffset = 0`

### 方法对齐

所有地图实现都遵循统一的接口规范，包括：

- **状态获取**：`getZoom()`, `getCenter()`, `getPitch()`, `getRotation()`, `getBounds()`
- **状态设置**：`setZoom()`, `setCenter()`, `setPitch()`, `setRotation()`
- **坐标转换**：`lngLatToPixel()`, `pixelToLngLat()`, `lngLatToMercator()`, `getModelMatrix()`
- **样式配置**：`getMapStyleConfig()`, `setMapStyle()`
- **其他功能**：`exportMap()`, `fitBounds()`, `panTo()`, `zoomIn/Out()`

## 相关文件

- `examples/demos/basemap/multi-basemap.tsx`: Examples 系统中的 demo 实现
- `examples/multi-basemap-demo.html`: 独立的 HTML 演示页面
- `packages/maps/src/utils/BaseMapService.ts`: 基础地图服务实现
- `packages/maps/src/*/map.ts`: 各地图的具体实现

## 注意事项

1. **API Key 配置**：部分地图服务（如高德、百度、Google）需要配置相应的 API Key
2. **CORS 限制**：某些地图服务可能有跨域限制，建议在本地服务器环境中测试
3. **浏览器兼容性**：确保使用现代浏览器以获得最佳体验
