---
title: Map Layer
order: 0
---
# Layer


## 简介
L7 Layer 接口设计遵循图形语法，在可视表达上

语法示例

```javascript
new Layer(option)
.source()
.color()
.size()
.shape()
.style()

```


## 构造函数


## 配置项

### visable
图层是否可见   {bool }  default true

### zIndex
 图层绘制顺序，数值越小优先绘制，可以控制图层绘制的上下层级  {int}   default 0
### minZoom
图层显示最小缩放等级，（0-18）   {number}  default 0

### maxZoom
 图层显示最大缩放等级 （0-18）   {number}  default 18


## 鼠标事件 

⚠️ beta版当前不支持，正式版会支持

```javascript
layer.on('click', (ev)=>{});             // 鼠标左键点击图层事件
layer.on('dblclick', (ev)=>{});          // 鼠标左键双击图层事件
layer.on('mousemove', (ev)=>{});        // 鼠标在图层上移动时触发
layer.on('mouseover', (ev)=>{});         // 鼠标移入图层要素内时触发
layer.on('mouseout', (ev)=>{});           // 鼠标移出图层要素时触发
layer.on('mouseup', (ev)=>{});         // 鼠标在图层上单击抬起时触发
layer.on('mousedown', (ev)=>{});         // 鼠标在图层上单击按下时触发
layer.on('mouseleave', (ev)=>{});    // 鼠标离开图层要素
layer.on('rightclick', (ev)=>{});    // 鼠标右键图层要素

```


## 方法

### source
数据源为layer设置数据  source(data,config)

- data {geojson|json|csv}


       源数据

- config  可选 数据源配置项
  - parser 数据解析，默认是解析层geojson
  - transforms [transform，transform ]  数据处理转换 可设置多个

 parser和 transforms [见source文档](https://www.yuque.com/antv/l7/source)

```javascript
layer.source(data, {
      parser: {
        type: 'csv',
        x: 'lng',
        y: 'lat'
      },
      transforms:[
        {
          type: 'map',
          callback:function(item){
            const [x, y] = item.coordinates;
            item.lat = item.lat*1;
            item.lng = item.lng*1;
            item.v = item.v *1;
            item.coordinates = [x*1,y*1];
            return item;
          }

        },
        {
          type: 'hexagon',
          size: 6000,
          field:'v',
          method:'sum'
       }
      ]
    })
```

### 

### scale


cscle('field', scaleConfig)

(field: string, scaleConfig: object)

为指定的数据字段进行列定义，返回 layer 实例。



- `field` 字段名。

- `scaleConfig` 列定义配置，对象类型，可配置的属性如下：

```javascript
{
  type: "linear" // 指定数据类型，可声明的类型为：identity、linear、cat、time、timeCat、log、pow,  quantile,quantize
}

```

### size

将数据值映射到图形的大小上的方法。

**注意：** 

不同图层的 size 的含义有所差别：

- point 图形的 size 影响点的半径大小和高度；

- line, arc, path 中的 size 影响线的粗细,和高度；

- polygon size 影响的是高度



```javascript
pointLayer.size(10); // 常量
pointLayer.size('type'); // 使用字段映射到大小
pointLayer.size('type', [ 0, 10 ]); // 使用字段映射到大小，并指定最大值和最小值
pointLayer.size('type', (type) => { // 回调函数
  if(type === 'a') {
    return 10;
  }
  return 5;
});
```


#### size(value）

传入数字常量，如 `pointLayer.size(20)`

#### size(field)
根据 field 字段的值映射大小，使用默认的`最大值 max:10` 和`最小值 min: 1`。

#### size(field, callback)
使用回调函数控制图形大小。

- `callback`: function 回调函数。

```javascript
pointLayer.size('age', (value) => {
  if(value === 1) {
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
layer.color('type', [ 'red', 'blue' ]) // 指定颜色
layer.color('type', (type) => { // 通过回调函数
  if (type === 'a') {
    return 'red';
  }
  return 'blue';
});
layer.color('type*value', (type, value) => { //多个参数，通过回调函数
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
layer.color('name') // 映射数据字段
layer.color('white') // 指定颜色
```


#### color(field, colors)

参数：

- `field`: stringfield 为映射至颜色属性的数据源字段名，也支持指定多个参数。

-  `colors`: string | array | function


colors 的参数有以下情况： 如果为空，即未指定颜色的数组，那么使用内置的全局的颜色；如果需要指定颜色，则需要以数组格式传入，那么分类的颜色按照数组中的颜色确定。对于颜色的分配顺序。

```javascript
layer.color('name'); // 使用默认的颜色
layer.color('name', [ 'red', 'blue' ]); // 使用传入的指定颜色
```

- colors 如果是回调函数，则该回调函数的参数为对应字段的数值，具体使用如下，当 color 映射为多个字段时，参数按照字段声明的顺序传入：



```javascript
layer.color('gender', (value) => {
  if(value === 1) {
    return 'red'
  }
  return 'blue';
});
layer.color('gender*age', (gender, age) => {
  if(age === 20 && gender ==' 男'  ) {
    return 'red'
  }
  return 'blue';
});
```

### shape
将数据值映射到图形的形状上的方法。

**shape(shape)**

参数`shape` string

只支持接收一个参数，指定几何图像对象绘制的形状。下表列出了不同的 图层 几何图形对象支持的 shape 形状

| layer类型 | shape类型 | 备注 |
| --- | --- | --- |
| point | 2d:point,circle, square, triangle,hexagon,image,text 3d:circle,triangle,hexagon,square |  |
| line | line,arc, arc3d, greatcircle |  |
| polygon | fill,line, extrude |  |


**shape(field, shapes)**

**shape(field, callback)**


### style

用于配置几何体显示图像属性目前支持以下属性，其他属性会逐步开放

- fill

- opacity  设置透明度

- stroke  线填充颜色

- strokeWidth 线的宽度


```javascript
layer.style({
    fill:'red',
    opacity:0.8,
    stroke:'white'
})
```


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


### fitBounds

缩放到图层范围

```javascript
layer.fitBounds()

```
