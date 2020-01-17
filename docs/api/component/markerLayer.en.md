---
title: Marker Layer
order: 3
---

MarkerLayer 不同于PointLayer图层 

**技术差异** 
- MarkerLayer地图元素采用Dom元素绘制
- PointLayer 通过WebGL绘制元素。

**功能差异**

- MarkerLayer 元素的自定义性比较强，任何HTML+ CSS的组合都可可以绘制在地图上。
- PointLayer 自定义性比较弱，实现成本比较高，优势可以绘制大量的数据，性能比交互。

## 使用

```javascript
  import { Marker, MarkerLayer} from '@antv/l7'

```
### 构造函数

```javascript

  const markerLayer = new MarkerLayer(option);
  
  // 调用 addMarker方法 将多个Marker添加到Layer

  scene.addMarkerLayer(markerLayer);
  
```
#### option

- cluster 是部分聚合 ```boolean```  默认 ```false```

- clusterOption 聚合配置
   
- cluster 是部分聚合 
   - element  ```function```

后续会增加更多配置项目

### 方法

#### addMarker

参数

- marker ```Marker``` 需要添加的Marker

添加Marker

通过Marker对象实例化一个Marker

```javascript
const marker = new Marker().setLnglat(); // 添加进Marker必须设置经纬度才能添加
markerLayer.addMarker(marker);

```

#### removeMarker

从MarkerLayer 移除Marker

#### getMarkers

获取MarkerLayer中的所有Marker

#### clear

清除掉所有的Marker

#### 

### Scene 

#### addMarkerLayer
添加MarkerLayer

```javascript
scene.addMarkerLayer(layer);
```


#### removeMarkerLayer

移除MarkerLayer

```javascript
scene.removeMarkerLayer(layer);
```

### demo地址
[markerLayer ](../../../examples/point/marker#markerlayer)

[markerLayer 聚合](../../../examples/point/marker#clustermarker)


