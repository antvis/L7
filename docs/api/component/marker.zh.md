---
title: Marker 标注
order: 3
---

`markdown:docs/common/style.md`

Marker 地图标注 目前只支持 2D Dom 标注

## 构造函数

Marker

`const Marker = new L7.Marker(option)`

#### option

- color        `string` 
  ![map-marker.png](https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ)  设置默认 marker 的颜色
- element    `Dom|string`    自定义 marker Dom 节点，可以是 dom 实例，也可以是 dom id
- anchor     `string`  锚点位置   支持 center, top, top-left, top-right, bottom, bottom-left,bottom-right,left, right
- offsets    `Array`  偏移量  [ 0, 0 ] 分别表示 X, Y 的偏移量
- extData 用户自定义属性，支持任意数据类型，存储 marker 属性信息

### 添加到 Scene

```javascript
scene.addMarker(marker);
```

## 方法

#### setLnglat

设置 marker 经纬度位置

#### remove

移除 marker

#### getElement

获取 marker dom Element

### setElement

- element `dom`

设置 element 通过此方法更新 Marker 样式

#### getLngLat

获取 marker 经纬度坐标

#### togglePopup

开启或者关闭 marker 弹出框

#### openPopup

打开 Popup

### closePopup

关闭 popup

#### setPopup

为 marker 设置 popup

#### getPopup

获取 marker 弹出框

#### getExtData()

获取用户自定义数据

#### setExtData(data)

设置用户自定义数据

## 示例代码

#### 默认 Marker

`const marker = new L7.Marker({color:'blue'})`

#### 自定义 Marker

```javascript
var el = document.createElement('label');
el.className = 'labelclass';
el.textContent = data[i].v;
el.style.background = getColor(data[i].v);

const marker = new L7.Marker({
  element: el,
}).setLnglat([data[i].x * 1, data[i].y]);

scene.addMarker(marker);
```

#### 设置 popup

```javascript
var popup = new L7.Popup({
  anchor: 'left',
}).setText(item.name);

new L7.Marker({
  element: el,
})
  .setLnglat(item.coordinates)
  .setPopup(popup);
```

## 事件

### 鼠标事件

- mousemove
- click
- mousedown
- mouseup
- dblclick
- contextmenu
- mouseover
- mouseout

事件返回数据

- target 事件触发源
- data extData 用户自定义数据
- lnglat marker 经纬度

```javascript
marker.on('click', (e) => {});
```

## demo 地址

[demo1](../../../examples/tutorial/marker#amap)
