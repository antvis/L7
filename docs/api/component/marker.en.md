---
title: Marker
order: 3
---

`markdown:docs/common/style.md`

Marker 地图标注 目前只支持 2D dom 标注

## 构造函数

Marker

`const Marker = new L7.Marker(option)`

#### option

- color        `string` ![L7 Marker](https://gw.alipayobjects.com/zos/basement_prod/b10e0efd-8379-4b04-bcbb-5cfefaa0327f.svg)设置默认 marker 的颜色
- element    `Dom|string`    自定义 marker Dom 节点，可以是 dom 实例，也可以是 dom id
- anchor     `string`  锚点位置   支持 center, top, top-left, top-right, bottom, bottom-left,bottom-                        right,left, right
- offsets    `Array`  偏移量  [ 0, 0 ] 分别表示 X, Y 的偏移量

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

#### getLngLat

获取 marker 经纬度坐标

#### togglePopup

开启或者关闭 marker 弹出框

#### setPopup

为 marker 设置 popup

#### getPopup

获取 marker 弹出框

## 示例代码

#### 默认 Marker

`const marker = new L7.Marker({color:'blue'})`

#### 自定义 Marker

```javascript
var el = document.createElement('label');
el.className = 'labelclass';
el.textContent = data[i].v;
el.style.background = getColor(data[i].v);
new L7.Marker({
  element: el,
}).setLnglat([data[i].x * 1, data[i].y]);
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
