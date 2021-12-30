---
title: 图层基类
order: 2
---

`markdown:docs/common/style.md`

## 简介

L7 Layer 接口设计遵循图形语法，所有图层都继承于该基类。

语法示例

```javascript
const layer = new Layer(option) // option - 传入构造函数的参数对象，提供 layer 的初始状态
  .source(...)    // 传入图层需要的数据以及相关的解析器
  .shape(...)     // 为图层指定具体的形状，如：circle/triangle 等
  .color(...)     // 指定图层的颜色配置
  .texture(...)   // 指定图层引用的纹理
  .size(...)      // 设置图层元素的大小
  .animate(...)   // 设置图层元素的动画模式
  .active(...)    // 指定图层元素是否支持划过选中
  .select(...)    // 指定图层元素是否支持点击选中
  .style(...);    // 指定图层自定义样式的配置

scene.addLayer(layer);
```

## options 配置项

```javascript
const options = {
  name: 'xxx',
  zIndex: 1,
};
const layer = new Layer(options);
```

### name

<description> _string_ **optional** _default:_ 自动数字编号</description>

设置图层名称,可根据 name 获取 layer;

### visible

<description> _bool_ **optional** _default:_ true</description>

图层是否可见

### zIndex

<description> _int_ **optional** _default:_ 0</description>

图层绘制顺序，数值大绘制在上层，可以控制图层绘制的上下层级

### minZoom

<description> _number_ **optional** _default:_ Mapbox （0-24） 高德 （2-19)</description>

图层显示最小缩放等级

### maxZoom

<description> _number_ **optional** _default:_ Mapbox （0-24） 高德 （2-19)</description>

图层显示最大缩放等级

### autoFit

<description> _bool_ **optional** _default:_ false</description>

layer 初始化完成之后，地图是否自动缩放到图层范围

### pickingBuffer

<description> _bool_ **optional** _default:_ 0</description>

图层拾取缓存机制，如 1px 宽度的线鼠标很难拾取(点击)到, 通过设置该参数可扩大拾取的范围（放大图层对象的尺寸）

### blend

<description> _string_ **optional** _default:_ 'normal'</description>

图层元素混合效果

- normal 正常效果 默认 发生遮挡的时候，只会显示前面的图层的颜色
- additive 叠加模式 发生遮挡的时候，显示前后图层颜色的叠加
- subtractive 相减模式 发生遮挡的时候，显示前后图层颜色的相减
- max 最大值 发生遮挡的时候，显示图层颜色 rgb 的最大值

# 方法

### source

设置图层数据以及解析配置 source(data, config)

- data { geojson | json | csv }
- config   可选   数据源配置项
  - parser 数据解析，默认是解析层 geojson
  - transforms [transform，transform ]  数据处理转换 可设置多个

parser 和  transforms [见 source 文档](../../source/source)

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

设置数据字段映射方法。

用户在使用 color、size 或者是 style 中的数据映射字段的时候，若是使用了指定了按比例映射，则都需要处理字段到值的映射关系。scale 方法就可以设置字段到值的映射是按哪一种类型进行映射。

```javascript
.color('key', ['#f00', '#0f0', '#00f'])

.size('key', [10, 20, 30])

.style({
  opacity: ['key', [0, 0.5, 1.0]]
})
```

- `field` 指定 source 中传入的数据中用于映射的字段名

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

通常一种图层可以有多种表现形式，shape 方法用于指定图层具体的表现形式，以 PointLayer 的 shape 为例：

```javascript
shape('circle'); // 圆形
shape('triangle'); // 三角形
shape('cylinder'); // 圆柱
```

**shape(shape)**

参数 `shape` string

- 只支持接收一个参数，指定几何图像对象绘制的形状。下表列出了不同的 图层 几何图形对象支持的 shape 形状

| layer 类型 | shape 类型                                                                             | 备注 |
| ---------- | -------------------------------------------------------------------------------------- | ---- |
| point      | 2d:point,circle, square, triangle,hexagon,image,text 3d:circle,triangle,hexagon,square |      |
| line       | line,arc, arc3d, greatcircle                                                           |      |
| polygon    | fill,line, extrude                                                                     |      |

**shape(field, shapes)**

- shape 根据字段指定行形状，比如根据字段指定 PointLayer/imageLayer 的 icon 类型

```javascript
scene.addImage(
  '00',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);
scene.addImage(
  '01',
  'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
);
scene.addImage(
  '02',
  'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
);
const imageLayer = new PointLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'longitude',
      y: 'latitude',
    },
  })
  .shape('name', ['00', '01', '02'])
  .size(20);
scene.addLayer(imageLayer);
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*oVyHT5S3sv0AAAAAAAAAAABkARQnAQ'>

[在线案例](../../examples/point/image#image)

**shape(field, callback)**

- shape 也支持回调函数的写法

```javascript
.shape('key', value => {
  if(value > 10) {
    return 'circle';
  } else {
    return 'triangle';
  }
}
```

### style

style 方法通常用于描述图层具体的样式，大多数图层会支持一些比较通用的属性， 如 opacity 属性，同时每个图层也会有仅限本图层支持的属性，如只有
CityBuildingLayer 支持的 windowColor 属性，每个图层具体要如何配置属性请查看每个图层的详细文档。

- opacity 设置透明度 大部分图层都支持

- stroke 线填充颜色 仅点图层支持

- strokeWidth 线的宽度 仅点图层支持

```javascript
layer.style({
  opacity: 0.8,
  stroke: 'white',
});
```

- 样式数据映射
  在大多数情况下，用户需要将 source 中传入的数据映射到图层的元素中，以此来达到需要的可视化的效果，比如想要用柱形图表示各地的人口数据，代码可能是这个样子的：

```javascript
const population = await getPopulation();
const layer = new PointLayer()
  .source(population)
  .shape('cylinder')
  .color('#f00')
  .size('population'); // population 字段表示数据中的人口值
scene.addLayer(layer);
```

而在一些特殊的业务场景下，我们可能需要将除了 size、color、以外的属性根据数据动态设置，如我们在绘制文本标注的时候需要根据文本的长短来设置偏移量，以保证文本位置的相对固定。在这种情况下，我们就需要使用图层样式数据纹理来完成这一项工作。

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*LPoeTJ5tPxMAAAAAAAAAAAAAARQnAQ'>

```javascript
const pointLayer = new PointLayer({})
  .source(data, {
    parser: {
      type: 'json',
      x: 'j',
      y: 'w',
    },
  })
  .shape('m', 'text')
  .size(12)
  .color('w', ['#0e0030', '#0e0030', '#0e0030'])
  .style({
    textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
    textOffset: 'textOffset', // 文本相对锚点的偏移量 [水平, 垂直]
    fontFamily,
    iconfont: true,
    textAllowOverlap: true,
  });
```

[在线案例](../../examples/point/text#styleMap)

从 L7 2.5 开始，各图层样式将逐步支持样式数据映射

| layer 类型/shape       | 支持的样式字段                                       | 备注                              |
| ---------------------- | ---------------------------------------------------- | --------------------------------- |
| pointLayer/fill        | opacity、strokeOpacity、strokeWidth、stroke、offsets | shape circle、triangle...         |
| pointLayer/image       | opacity、offsets                                     | offsets 经纬度偏移                |
| pointLayer/normal      | opacity、offsets                                     |                                   |
| pointLayer/text        | opacity、strokeWidth、stroke、textOffset             | textOffset 相对文字画布位置的偏移 |
| pointLayer/extrude     | opacity                                              |                                   |
| polygonLayer/fill      | opacity                                              |                                   |
| polygonLayer/extrude   | opacity                                              |                                   |
| lineLayer/line         | opacity                                              |                                   |
| lineLayer/arc          | opacity、thetaOffset                                 | thetaOffset 弧线的弯曲弧度        |
| lineLayer/arc3d        | opacity                                              |                                   |
| lineLayer/great_circle | opacity                                              |                                   |

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*F_QoSr-W0BwAAAAAAAAAAAAAARQnAQ'>

[在线案例](../../examples/point/scatter#scatterStyleMap)

### 纹理方法

目前只在线图层上支持了纹理方法

- textute 方法支持传入由 scene.addImage 方法添加的全局 icon 贴图资源

```javascript
// 首先在全局加载图片资源
scene.addImage(
  'plane',
  'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg',
);

const layer = new LineLayer({
  blend: 'normal',
})
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(25)
  .shape('arc')
  .texture('plane') // 为图层绑定纹理
  .color('#8C1EB2')
  .style({
    lineTexture: true, // 开启线的贴图功能
    iconStep: 30, // 设置贴图纹理的间距
    textureBlend: 'replace', // 设置纹理混合方式，默认值为 normal，可选值有 normal/replace 两种
  });
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*0UrUTakTFQsAAAAAAAAAAAAAARQnAQ'>

[在线案例](../../examples/gallery/animate#animate_path_texture)

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

- id 元素 ID

```javascript
layer.setActive(id);
```

### select

开启或者关闭 mouseclick 元素选中高亮效果

参数： selectOption | boolean

selectOption

- color 填充颜色

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

- id 元素 ID

```javascript
layer.setSelect(id);
```

### getLegendItems

获取图例配置

- type 图例类型

```javascript
layer.getLegendItems('color');

layer.getLegendItems('size');
```

## 鼠标事件

鼠标事件回调参数 target

```javascript
layer.on(eventName, (target) => console.log(target));
```

- x: number 鼠标  在地图位置 x 坐标
- y: number 鼠标  在地图位置 y 坐标
- type: string 鼠标事件类型
- lngLat: 经度度对象 {lng:number, lat: number }; 鼠标所在位置经纬度
- feature: any; 数据选中的地理要素信息
- featureId: number | null; 数据选中的地理要素的 ID

### click

点击事件

```javascript
layer.on('click', (e) => console.log(e));
```

### mousemove

鼠标移动事件

```javascript
layer.on('mousemove', (e) => console.log(e));
```

### mouseout

鼠标移除

```javascript
layer.on('mouseout', (e) => console.log(e));
```

### mouseup

鼠标抬起

```javascript
layer.on('mouseup', (e) => console.log(e));
```

### mousedown

鼠标按下

```javascript
layer.on('mousedown', (e) => console.log(e));
```

### contextmenu

鼠标右键

```javascript
layer.on('contextmenu', (e) => console.log(e));
```

### unclick

点击未拾取到元素

```javascript
layer.on('unclick', (e) => console.log(e));
```

### unmousemove

鼠标移动未拾取到元素

```javascript
layer.on('unmousemove', (e) => console.log(e));
```

### unmouseup

鼠标抬起未拾取到元素

```javascript
layer.on('unmouseup', (e) => console.log(e));
```

### unmousedown

鼠标按下未拾取到元素

```javascript
layer.on('unmousedown', (e) => console.log(e));
```

### uncontextmenu

鼠标右键位拾取到元素

```javascript
layer.on('uncontextmenu', (e) => console.log(e));
```

### unpick

所有鼠标事件未拾取到

```javascript
layer.on('unpick', (e) => console.log(e));
```

使用示例

```javascript
layer.on('click', (ev) => {}); // 鼠标左键点击图层事件
layer.on('mouseenter', (ev) => {}); // 鼠标进入图层要素
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

```javascript
layer.on('add', (type) => console.log(type));
```

### remove

图层移除时触发

参数 option

- target 当前 layer
- type 事件类型

```javascript
layer.on('remove', (type) => console.log(type));
```

## 图层框选

### boxSelect

参数 option

- box [x1: number, y1: number, x2: number, y2: number] 相较于
- cb (...args: any[]) => void 传入的回调方法，返回框选内部的 feature

```javascript
layer.boxSelect(box, cb);
// (x1, y1), (x2, y2) 框选的方框左上角和右下角相对于地图左上角的像素坐标
// cb 是传入的回调函数，回调函数返回的参数是选中的 feature 对象数组，对象的字段和用户传入的数据相关
```
