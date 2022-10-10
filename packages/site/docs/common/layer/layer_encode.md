# 方法

### source

设置图层数据以及解析配置 source(data, config)

- data { geojson | json | csv }
- config   可选   数据源配置项
  - parser 数据解析，默认是解析层 geojson
  - transforms [transform，transform ]  数据处理转换可设置多个

parser 和  transforms [见 source 文档](/zh/docs/api/source/source)

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

设置数据字段映射方法，用于设置数据字段的定义域。  

用户在 source 方法中传入数据后可以通过 scale 方法设置映射到值域的映射关系以及相关的定义域

```javascript
const pointLayer = new PointLayer({})
    .source(data)
    .shape('circle')
    .color('id', ['#f00', '#ff0'])
    .size('mag', [1, 80])
    .scale('mag', {
      type: "linear",
      domain: [ 1, 50]
    })
    .active(true)
    .style({
      opacity: 0.3,
      strokeWidth: 1
    });
```
🌟  在上面的代码中 size 设置点的大小，且点大小的值域为 [1, 80]。我们通过 scale 指定 mag 字段的定义域是 [1, 50]  
✨  为了验证是否生效我们可以讲 domain 设置为 [1, 20]，我们可以看到点的 size 明显变大了（size 在值域中的取值变大了）

[在线案例](https://codesandbox.io/s/gracious-dhawan-4d71l?file=/index.js)   

✨ L7 在内部使用了 d3 的 scale 方法，为了方便理解可以看 d3 比例尺的概念

```javascript
var data = [1.2, 2.3, 0.9, 1.5, 3.3];
var min = d3.min(data);
var max = d3.max(data);

var linear = d3.scale.linear()
            .domain([min, max])
            .range([0, 300])
linear(0.9) // 0
linear(2.3) // 1.5
linear(3.3) // 300
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

<img width="100%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PzoTRJnY-fIAAAAAAAAAAAAAARQnAQ'>

### size

将数据值映射到图形的大小上的方法，size 方法具体的参数使用可以查看对应图层的详细文档

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

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*iN0nTYRDd3AAAAAAAAAAAABkARQnAQ'>

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