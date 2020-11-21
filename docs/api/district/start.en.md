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

CDN 引用所有的方法都在 L7.District 命名空间下。

```html
<head>
  <! --引入最新版的L7-District -->
  <script src="https://unpkg.com/@antv/l7-district"></script>
</head>
```

```javascript
import { WorldLayer } from '@antv/l7-district';
/**
 * L7.District.WorldLayer()// CDN 引用
 * */
new WorldLayer(scene, {
  data: [],
  fill: {
    color: {
      field: 'NAME_CHN',
      values: [
        '#feedde',
        '#fdd0a2',
        '#fdae6b',
        '#fd8d3c',
        '#e6550d',
        '#a63603',
      ],
    },
  },
  stroke: '#ccc',
  label: {
    enable: true,
    textAllowOverlap: false,
    field: 'Short_Name_ZH',
  },
  popup: {
    enable: false,
    Html: (props) => {
      return `<span>${props.Short_Name_ZH}</span>`;
    },
  },
});
```

## 简介

District 支持下面几种图

- WorldLayer 世界地图
- CountryLayer 国家地图，目前只支持中国
- ProvinceLayer 省级地图
- CityLayer 市级地图
- CountyLayer 县级地图
- DrillDownLayer 上钻下取地图

## 构造函数

参数：

- scene L7 scene 对象
- option 行政区划配置项

  - zIndex 图层绘制顺序
  - data `Array` 属性数据用于可视化渲染
  - joinBy 数据关联，属性数据如何内部空间数据关联绑定 目前支持 NAME_CHN,adcode 字段连接
    对照表 `Array [string, string]` 第一个值为空间数据字段，第二个为传入数据字段名
  - depth 数据显示层级 0：国家级，1:省级，2: 市级，3：县级
  - label 标注配置项 支持常量，不支持数据映射
    - enable `boolean` 是否显示标注
    - color 标注字体颜色 常量
    - field 标注字段 常量
    - size 标注大小 常量
    - stroke 文字描边颜色
    - strokeWidth 文字描边宽度
    - textAllowOverlap 是否允许文字压盖
    - opacity 标注透明度
  - fill 填充配置项 支持数据映射
    - color 图层填充颜色，支持常量和数据映射
      常量：统一设置成一样的颜色
      数据映射
      - field 填充映射字段
      - values 映射值，同 color 方法第二个参数数组，回调函数
    - style 同 polygonLayer 的 style 方法
    - activeColor 鼠标滑过高亮颜色
  - bubble 气泡图
    - enable `boolean` 是否显示气泡 default false
    - color 气泡颜色 支持常量、数据映射
    - size 气泡大小 支持常量、数据映射
    - shape 气泡形状 支持常量、数据映射
    - style 气泡图样式 同 PointLayer
  - stroke 填充描边颜色
  - strokeWidth 填充描边宽度
  - autoFit 是否自动缩放到图层范围 `boolean`
  - popup 信息窗口

    - enable 是否开启 `boolean`
    - triggerEvent 触发事件 例如 'mousemove' | 'click';
    - Html popup html 字符串，支持回调函数 (properties: any) => string;

  - chinaNationalStroke 中国国界线颜色
  - chinaNationalWidth 中国国界线宽度
  - coastlineStroke 海岸线颜色
  - coastlineWidth 海岸线宽度 `WorldLayer` `CountryLayer`
  - nationalWidth 国界线 `WorldLayer` `CountryLayer`
  - nationalStroke 国界线 `WorldLayer` `CountryLayer`
  - provinceStroke 省界颜色 `CountryLayer`
  - provinceStrokeWidth 省界宽度 `CountryLayer`
  - cityStroke 市级边界颜色 `CountryLayer`
  - cityStrokeWidth 市级边界宽度 `CountryLayer`
  - countyStroke 县级边界颜色 `CountryLayer`
  - countyStrokeWidth 县级边界宽度 `CountryLayer`

### 数据

District 提供 polygon 数据需要跟用户的属性数据，通过关系字段进行连接

- [国家名称对照表](https://gw.alipayobjects.com/os/bmw-prod/b6fcd072-72a7-4875-8e05-9652ffc977d9.csv)

- [省级行政名称*adcode*对照表.csv](https://gw.alipayobjects.com/os/bmw-prod/2aa6fb7b-3694-4df3-b601-6f6f9adac496.csv)

- [市级行政区划及编码](https://gw.alipayobjects.com/os/bmw-prod/d2aefd78-f5df-486f-9310-7449cc7f5569.csv)

- [县级行政区名称级编码](https://gw.alipayobjects.com/os/bmw-prod/fafd299e-0e1e-4fa2-a8ac-10a984c6e983.csv)

### 属性

行政区划组件每个图层有多个子图层组成，如标注层，国界线、省界线等等，

#### fillLayer

### 方法

#### updateData(data, joinBy)

更新显示数据，

参数：

- data 需要更新的数据
- joinBy 关联字段 可选，如果不设置保持和初始化一致。

#### show

显示图层

#### hide

图层隐藏不显示

#### destroy

移除并销毁图层
