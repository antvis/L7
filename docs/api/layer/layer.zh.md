---
title: 图层基类
order: 0
---

`markdown:docs/common/style.md`

## 简介

L7 Layer 接口设计遵循图形语法，所有图层都继承于该基类。

语法示例

```javascript
const layer = new Layer(option)
  .source()
  .color()
  .size()
  .shape()
  .style();

scene.addLayer(layer);
```

## 构造函数

## 配置项

### name

<description> _string_ **optional** _default:_ 自动数字编号</description>

设置图层名称,可根据 name 获取 layer;

### visible

图层是否可见   {bool } default true

### zIndex

图层绘制顺序，数值大绘制在上层，可以控制图层绘制的上下层级 {int}   default 0

### minZoom

图层显示最小缩放等级，（0-18）   {number}  Mapbox （0-24） 高德 （3-18）

### maxZoom

图层显示最大缩放等级 （0-18）   {number}  Mapbox （0-24） 高德 （3-18）

### autoFit

layer 初始化完成之后，是否自动缩放到图层范围 {bool } default false

### pickingBuffer

图层拾取缓存机制，如 1px 宽度的线鼠标很难拾取(点击)到, 通过设置该参数可扩大拾取的范围 {number} default 0

### blend

图层元素混合效果

- normal 正常效果 默认
- additive 叠加模式
- subtractive 相减模式
- max 最大值

# 方法

### source

数据源为 layer 设置数据 source(data,config)

- data {geojson|json|csv}

源数据

- config   可选   数据源配置项
  - parser 数据解析，默认是解析层 geojson
  - transforms [transform，transform ]  数据处理转换 可设置多个

parser 和  transforms [见 source 文档](../source/source)

```javascript
layer.source(data, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    {
      type: 'map',
      callback: function(item) {
        const [x, y] = item.coordinates;
        item.lat = item.lat * 1;
        item.lng = item.lng * 1;
        item.v = item.v * 1;
        item.coordinates = [x * 1, y * 1];
        return item;
      },
    },
    {
      type: 'hexagon',
      size: 6000,
      field: 'v',
      method: 'sum',
    },
  ],
});
```

### scale

设置数据字段映射方法

- `field` 字段名。

- `scaleConfig` 列定义配置，对象类型，可配置的属性如下：

#### scale 类型

**连续型**

- linear 线性
- log
- pow 指数型

**连续分类型**

- quantile 等分位
- quantize 等间距

**枚举型**

- cat 枚举

```javascript
layer.scale('name', {
  type: 'cat',
});

// 设置多个scale

// 字段名为 key, value 为scale配置项

layer.scale({
  name: {
    type: 'cat',
  },
  value: {
    type: 'linear',
  },
});
```

## 视觉编码方法

可视化编码是将数据转换为可视形式的过程，L7 目前支持形状，大小，颜色 3 种视觉通道，你可以指定数据字段，为不同要素设置不同的图形属性。

### size

将数据值映射到图形的大小上的方法,具体 size 的表示具体意义可以查看对应图层的文档

```javascript
pointLayer.size(10); // 常量
pointLayer.size('type'); // 使用字段映射到大小
pointLayer.size('type', [0, 10]); // 使用字段映射到大小，并指定最大值和最小值
pointLayer.size('type', (type) => {
  // 回调函数
  if (type === 'a') {
    return 10;
  }
  return 5;
});
```

#### size(value）

传入数字常量，如  `pointLayer.size(20)`

#### size(field)

根据 field 字段的值映射大小，使用默认的`最大值 max:10`  和`最小值 min: 1`。

#### size(field, callback)

使用回调函数控制图形大小。

- `callback`: function 回调函数。

```javascript
pointLayer.size('age', (value) => {
  if (value === 1) {
    return 5;
  }
  return 10;
});
```

### color

将数据值映射到图形的颜色上的方法。

```javascript
layer.color('red'); // 常量颜色
layer.color('type'); // 对 type 字段进行映射，使用内置的颜色
layer.color('type', ['red', 'blue']); // 指定颜色
layer.color('type', (type) => {
  // 通过回调函数
  if (type === 'a') {
    return 'red';
  }
  return 'blue';
});
layer.color('type*value', (type, value) => {
  //多个参数，通过回调函数
  if (type === 'a' && value > 100) {
    return 'red';
  }
  return 'blue';
});
```

#### color(value)

参数：`value` ：string
只支持接收一个参数，value 可以是：

- 映射至颜色属性的数据源字段名，如果数据源中不存在这个字段名的话，则按照常量进行解析，这个时候会使用 L7 默认提供的颜色。

- 也可以直接指定某一个具体的颜色值 color，如 '#fff', 'white','rgba(255,0,0,0.5)' ,rgb(255,0,1) 等。

示例

```javascript
layer.color('name'); // 映射数据字段
layer.color('white'); // 指定颜色
```

#### color(field, colors)

参数：

- `field`: stringfield 为映射至颜色属性的数据源字段名，也支持指定多个参数。

- `colors`: string | array | function

colors 的参数有以下情况：  如果为空，即未指定颜色的数组，那么使用内置的全局的颜色；如果需要指定颜色，则需要以数组格式传入，那么分类的颜色按照数组中的颜色确定。

```javascript
layer.color('name'); // 使用默认的颜色
layer.color('name', ['red', 'blue']); // 使用传入的指定颜色
```

- colors 如果是回调函数，则该回调函数的参数为对应字段的数值，具体使用如下，当 color 映射为多个字段时，参数按照字段声明的顺序传入：

```javascript
layer.color('gender', (value) => {
  if (value === 1) {
    return 'red';
  }
  return 'blue';
});
layer.color('gender*age', (gender, age) => {
  if (age === 20 && gender == ' 男') {
    return 'red';
  }
  return 'blue';
});
```

### shape

将数据值映射到图形的形状上的方法。

**shape(shape)**

参数`shape` string

只支持接收一个参数，指定几何图像对象绘制的形状。下表列出了不同的 图层 几何图形对象支持的 shape 形状

| layer 类型 | shape 类型                                                                             | 备注 |
| ---------- | -------------------------------------------------------------------------------------- | ---- |
| point      | 2d:point,circle, square, triangle,hexagon,image,text 3d:circle,triangle,hexagon,square |      |
| line       | line,arc, arc3d, greatcircle                                                           |      |
| polygon    | fill,line, extrude                                                                     |      |

**shape(field, shapes)**

**shape(field, callback)**

### style

全局设置图形显示属性

- opacity   设置透明度

- stroke 线填充颜色 仅点图层支持

- strokeWidth 线的宽度 仅点图层支持

```javascript
layer.style({
  opacity: 0.8,
  stroke: 'white',
});
```

## 图层更新方法

如果已经添加了图层，需要修改图层显示样式可以再次调用图形映射方法，然后调用 `scene.render()`更新渲染即可

### 样式更新

```javascript
layer.color('blue');
layer.size(10);
layer.style({});
scene.render();
```

### setData

更新 Source 数据

参数:

- data 数据
- option 默认和初始配置项一致，如果数据格式相同可不设置

调用 setData 方法会自动更新图层渲染

```javascript
layer.setData(data);
```

### setBlend(type)

设置图层叠加方法
参数：

- type blend 类型

## 图层控制方法

### show

图层显示

```javascript
layer.show();
```

### hide

图层隐藏

```javascript
layer.hide();
```

### isVisible

图层是否可见

return `true | false`

### setIndex

设置图层绘制顺序

### fitBounds

缩放到图层范围

```javascript
layer.fitBounds();
```

### setMinZoom

设置图层最小缩放等级

参数

- zoom {number}

```javascript
layer.setMinZoom(zoom);
```

### setMaxZoom

设置图层最大缩放等级

参数

- zoom {number}

```javascript
layer.setMinZoom(zoom);
```

设置图层最大缩放等级

参数

- zoom {number}

```javascript
layer.setMinZoom(zoom);
```

## 图层交互方法

### active

开启或者关闭 mousehover 元素高亮效果

参数： activeOption | boolean

activeOption
-color 填充颜色

```javascript
// 开启 Active  使用默认高亮颜色
layer.active(true);

//  开启 Active  自定义高亮颜色

layer.active({
  color: 'red',
});

// 关闭高亮效果
layer.active(false);
```

### setActive

根据元素 ID 设置指定元素 hover 高亮

```javascript
layer.setActive(id);
```

### select

开启或者关闭 mouseclick 元素选中高亮效果

参数： selectOption | boolean

selectOption
-color 填充颜色

```javascript
// 开启 Active  使用默认高亮颜色
layer.select(true);

//  开启 Active  自定义高亮颜色

layer.select({
  color: 'red',
});

// 关闭高亮效果
layer.select(false);
```

### setSelect

根据元素 ID 设置指定元素 click 选中 高亮

```javascript
layer.setSelect(id);
```

## 鼠标事件

鼠标事件回调参数 target

```typescript
```

- x: number 鼠标  在地图位置 x 坐标
- y: number 鼠标  在地图位置 y 坐标
- type: string 鼠标事件类型
- lngLat: 经度度对象 {lng:number, lat: number }; 鼠标所在位置经纬度
- feature: any; 数据选中的地理要素信息
- featureId: number | null; 数据选中的地理要素的 ID

### click

点击事件

### mousemove

鼠标移动事件

### mouseout

鼠标移除

### mouseup

鼠标按下

### mousedown

鼠标向下

### contextmenu

鼠标右键

### unclick

点击未拾取到元素

### unmousemove

鼠标移动未拾取到元素

### unmouseup

鼠标抬起未拾取到元素

### unmousedown

鼠标按下未拾取到元素

### uncontextmenu

鼠标右键位拾取到元素

### unpick

所有鼠标事件未拾取到

使用示例

```javascript
layer.on('click', (ev) => {}); // 鼠标左键点击图层事件
layer.on('mousemove', (ev) => {}); // 鼠标在图层上移动时触发
layer.on('mouseout', (ev) => {}); // 鼠标移出图层要素时触发
layer.on('mouseup', (ev) => {}); // 鼠标在图层上单击抬起时触发
layer.on('mousedown', (ev) => {}); // 鼠标在图层上单击按下时触发
layer.on('contextmenu', (ev) => {}); // 图层要素点击右键菜单

// 鼠标在图层外的事件
layer.on('unclick', (ev) => {}); // 图层外点击
layer.on('unmousemove', (ev) => {}); // 图层外移动
layer.on('unmouseup', (ev) => {}); // 图层外鼠标抬起
layer.on('unmousedown', (ev) => {}); // 图层外单击按下时触发
layer.on('uncontextmenu', (ev) => {}); // 图层外点击右键
layer.on('unpick', (ev) => {}); // 图层外的操作的所有事件
```

## 图层事件

### inited

参数 option

- target 当前 layer
- type 事件类型

图层初始化完成后触发

```javascript
layer.on('inited', (option) => {});
```

### add

图层添加到 scene

参数 option

- target 当前 layer
- type 事件类型

### remove

图层移除时触发

参数 option

- target 当前 layer
- type 事件类型
