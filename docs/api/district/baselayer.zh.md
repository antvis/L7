---
title: 基础地图
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

## 简介

District 支持下面几种图

- WorldLayer 世界地图
- CountryLayer 国家地图，目前只支持中国
- ProvinceLayer 省级地图
- CityLayer 市级地图
- CountyLayer 县级地图

## 配置项

### zIndex

图层绘制顺序

### data `Array`

属性数据用于可视化渲染

### visible

地图是否可见

### joinBy

数据关联，属性数据如何内部空间数据关联绑定 目前支持 NAME_CHN,adcode 字段连接
对照表 `Array [string, string]` 第一个值为空间数据字段，第二个为传入数据字段名

### showBorder `boolean`

是否显示国界线，默认显示，不建议不显示

### simplifyTolerance

数据抽稀容差,默认不抽稀 `boolean | number` 单位为度，一度约 111km，数字越大精度越低。参考设置数据 0.01

### depth

数据显示层级 0：国家级，1:省级，2: 市级，3：县级

### stroke 填充描边颜色

`ProvinceLayer, CityLayer, CountyLayer`

### strokeWidth 填充描边宽度

`ProvinceLayer, CityLayer, CountyLayer`

### autoFit

是否自动缩放到图层范围 `boolean`

### chinaNationalStroke

中国国界线颜色 `CountryLayer`

### chinaNationalWidth

中国国界线宽度 `CountryLayer`

### coastlineStroke

海岸线颜色 `CountryLayer`

### coastlineWidth

海岸线宽度 `WorldLayer` `CountryLayer`

### nationalWidth

国界线 `WorldLayer` `CountryLayer`

### nationalStroke

国界线 `WorldLayer` `CountryLayer`

### provinceStroke

省界颜色 `CountryLayer depth= 0，1，2时生效`

### provinceStrokeWidth

省界宽度 `CountryLayer depth = 0，1，2时生效`

### cityStroke 市级边界颜色

`CountryLayer depth =1，2时生效`

### cityStrokeWidth 市级边界宽度

`CountryLayer depth =1，2 时生效`

### countyStroke

县级边界颜色 `CountryLayer depth =2时生效`

### countyStrokeWidth

县级边界宽度 `CountryLayer depth =2时生效`

`markdown:docs/common/district/label.zh.md`

`markdown:docs/common/district/fill.zh.md`

`markdown:docs/common/district/popup.zh.md`

`markdown:docs/common/district/bubble.zh.md`

## 数据

District 提供 polygon 数据需要跟用户的属性数据，通过关系字段进行连接

- [国家名称对照表](https://gw.alipayobjects.com/os/bmw-prod/b6fcd072-72a7-4875-8e05-9652ffc977d9.csv)

- [省级行政名称*adcode*对照表.csv](https://gw.alipayobjects.com/os/bmw-prod/2aa6fb7b-3694-4df3-b601-6f6f9adac496.csv)

- [市级行政区划及编码](https://gw.alipayobjects.com/os/bmw-prod/d2aefd78-f5df-486f-9310-7449cc7f5569.csv)

- [县级行政区名称级编码](https://gw.alipayobjects.com/os/bmw-prod/fafd299e-0e1e-4fa2-a8ac-10a984c6e983.csv)

## 方法

### updateLayerAttribute

更新图层渲染样式
参数

- layerName
  'fill' | 'line' | 'label' | 'bubble' = 'fill',
- type: 'color' | 'size' | 'shape' | 'filter',
- attr: AttributeType | undefined,

```js
const layer = new CountryLayer();
layer.updateLayerAttribute('fill', 'color', 'red');
```

### updateDistrict

根据 adcode 更新 行政区块

参数

- adcode 行政区划编码
- data 数据
- joinByField 绑定字段

```javascript
citylayer.updateDistrict(['330100', '340100']);
```

### updateData(data, joinBy)

更新显示数据，

参数：

- data 需要更新的数据
- joinBy 关联字段 可选，如果不设置保持和初始化一致。

### getFillData

获取填充数据，可用于绘制独立的边界线

### show

显示图层

### hide

图层隐藏不显示

### destroy

移除并销毁图层

## 事件

 行政区划图事件监听默认添加在 fillLayer 上，你点击填充的色块才能接收到事件响应。

支持的事件类型同

### on 添加事件

参数

- type
- handle
- layerType 可选 `'fill' | 'line' | 'label' | 'bubble'` 默认值 `fill`

```javascript
const layer = new CountryLayer();
layer.on('click', (e) => {
  console.log(e);
});
```

### off 移除事件

参数

- type
- handle
- layerType 可选 `'fill' | 'line' | 'label' | 'bubble'` 默认值 `fill`
