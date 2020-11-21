---
title: 绘制 API
order: 3
---

`markdown:docs/common/style.md`

## 钻取地图

钻取是改变展现数据维度的层次，变换分析的粒度。它包括向上钻取（drillup）和向下钻取（drilldown）。

钻取地图支持两种可视化类型

- 填充图：在地图上显示每个区域，根据区域值设置区块填充颜色
- 气泡图：每个区域用气泡显示，根据区域值设置气泡的颜色和大小

## 使用

```javascript
import { DrillDownLayer } from '@antv/l7-district';
```

DrillDownLayer 提供默认提供通过 Layer 的交互事件，实现上钻下钻的交互，默认点击当前图层(click)向下钻取，双击非地图区域(undblclick)向上钻取。你可以更改默认交互的的触发事件。通过也可以更改默认的交互行为。

## 构造函数

### scene L7 scene 对象

### option 行政区划配置项

## 配置项

### customTrigger

是否自定义下钻交互，默认 `false`

### drillDownTriggerEvent

向下钻取的触发事件 ⛔customTrigger 为 true 时不生效

### drillUpTriggleEvent

向上钻取的触发事件 ⛔customTrigger 为 true 时不生效

### provinceData

省级数据

### cityData

市级数据 可以是全量的数据，下钻时可以不需要重新设置数据

### countyData

县级数据 可以是全量的数据，下钻时可以不需要重新设置数据

### joinBy

数据关联，属性数据如何内部空间数据关联绑定 目前支持 NAME_CHN,adcode 字段连接
对照表 `Array [string, string]` 第一个值为空间数据字段，第二个为传入数据字段名

### label

文本配置项 `labelOption`

### bubble

气泡配置项 `bubbleOption`

### fill

填充配置项 `fillOption`

### province

`layerOption` 省级图层配置，如果不设置等同全局配置

### city

`layerOption` 市级图层配置，如果不设置等同全局配置

### county

`layerOption` 县级图层配置，如果不设置等同全局配置

### viewStart

    起始下钻视图 `Country' | 'Province' | 'City' | 'County`;  用于定义下钻层级，
    如果 viewStart 设置为 Province 需要为city 设置 adcode 初值
    同理如果  viewStart 设置为 City 需要为 county 设置 adcode 初值

### viewEnd

结束下钻视图 `Country' | 'Province' | 'City' | 'County`; 用于定义下钻层级，

#### layerOption

下钻各个层级的配置项，可以独立配置，每一层级的样式，不设置和上一层就保持一致

- joinBy: [string, string];
- label: Partial<ILabelOption>;
- bubble: Partial<IBubbleOption>;
- fill: Partial<IFillOptions>;
  ⛔ 中国地图视角设置，省界，海岸线，宽度通过以下属性
- chinaNationalStroke 中国国界线颜色
- chinaNationalWidth 中国国界线宽度
- coastlineStroke 海岸线颜色
- coastlineWidth 海岸线宽度
- nationalWidth 国界线
- nationalStroke 国界线
- provinceStroke 省界颜色
- provinceStrokeWidth 省界宽度

#### labelOption

文本标注配置项，目前只支持常量配置，不支持数据映射

- enable `boolean` 是否开启标注 `true`
- color `string` 标注颜色
- field `string` 标注字段名 默认 `NAME_CHN`
- size `number` 文本大小 默认 `8`
- stroke `string` 描边颜色 `#fff`
- strokeWidth `number` 描边宽度 `2`
- textAllowOverlap: `boolean` 文字是否允许压盖 `true`
- opacity `number` 透明度 `1`

#### bubbleOption

气泡图配置项

- enable `boolean` 是否显示气泡 `true`
- shape: AttributeType; 气泡形状支持数据映射
- size: AttributeType; 气泡大小支持数据映射
- color: AttributeType; 气泡颜色支持数据映射
- scale: { // 数字度量
  field: string; 度量字段
  type: ScaleTypeName; 度量字段
  };
- style: {
  opacity: number; 透明度
  stroke: string; 填充色
  strokeWidth: number; 填充宽度
  };

#### fill

填充图样式

- scale: ScaleTypeName | null; 填充颜色度量类型
- color: AttributeType; 填充颜色支持数据映射
- style: any; 填充图样式
- activeColor: string; 填充图高亮颜色

## 属性

为了实现灵活相关图层的可视化样式，将内部图层通过属性对外透出

### provinceLayer

全国地图 CountyLayer

### cityLayer

省级地图 ProvinceLayer

### countyLayer

市级地图 CityLayer

## 方法

### drillDown

向下钻取 自定义钻取交互行为时使用

** 参数 **

- adcode 下钻层级的行政区划代码, 可以设置一个或者多个，多个使用
- data 下钻层级的数据，可选，如果不设置取全局配置
- joinBy 下钻关联字段 `Array` 可选 如果不设置取全局配置

```javascirpt
  drillLayer.drillDown(['110100'])
```

### drillUp

向上钻取

```javascirpt
 drillLayer.drillUp(['110100'])
```

### updateData

参数

- layer 更新图层名称 `province|city|county`
- data 数据
- joinBy 可选

### show

显示图形

### hide

隐藏图层

### destroy

移除并销毁图层
