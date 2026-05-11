---
title: Marker 标注
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

Marker 地图标注 目前只支持 2D DOM 标注

## 构造函数

Marker

`const Marker = new L7.Marker(option)`

#### option

- color        `string` 
  ![map-marker.png](https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ)  设置默认 marker 的颜色
- element    `DOM|string`    自定义 marker DOM 节点，可以是 dom 实例，也可以是 dom id
- anchor     `string`  锚点位置   支持 center, top, top-left, top-right, bottom, bottom-left,bottom-right,left, right
- offsets    `Array`  偏移量  [ 0, 0 ] 分别表示 X, Y 的偏移量
- overflowHide   `boolean`  超出屏幕时是否隐藏 Marker，默认为 true
- draggable `boolean` 是否支持拖拽调整 Marker 位置
- extData 用户自定义属性，支持任意数据类型，存储 marker 属性信息

### 添加到 Scene

```javascript
scene.addMarker(marker);
```

## 方法

#### setLnglat(lngLat: ILngLat | [number, number])

设置 marker 经纬度位置

```javascript
marker.setLnglat({ lng: 120, lat: 30 });
// 或数组形式
marker.setLnglat([120, 30]);
```

#### getLngLat(): ILngLat

获取 marker 经纬度坐标

```javascript
const { lng, lat } = marker.getLngLat();
```

#### remove()

移除 marker，从地图上删除并释放事件绑定

```javascript
marker.remove();
```

#### hide()

隐藏 marker，不从地图中删除，可通过 `show()` 恢复显示

```javascript
marker.hide();
```

#### show()

显示已隐藏的 marker

```javascript
marker.show();
```

#### getElement(): HTMLElement

获取 marker 的 DOM 元素

```javascript
const el = marker.getElement();
```

#### setElement(element: HTMLElement)

设置 marker 的 DOM 元素，通过此方法可更新 Marker 样式

```javascript
const el = document.createElement('div');
marker.setElement(el);
```

#### getOffset(): number[]

获取 marker 的偏移量 `[x, y]`

```javascript
const [x, y] = marker.getOffset();
```

#### setDraggable(draggable: boolean)

设置是否支持拖拽调整位置

```javascript
marker.setDraggable(true);
```

#### getDraggable(): boolean

获取当前是否支持拖拽调整位置

```javascript
const draggable = marker.getDraggable();
```

#### togglePopup()

开启或者关闭 marker 弹出框

#### openPopup()

打开关联的 Popup

```javascript
marker.openPopup();
```

#### closePopup()

关闭关联的 Popup

```javascript
marker.closePopup();
```

#### setPopup(popup: Popup)

为 marker 设置 popup

```javascript
const popup = new Popup({ anchor: 'left' }).setText('Hello');
marker.setPopup(popup);
```

#### getPopup(): Popup

获取 marker 关联的 popup

```javascript
const popup = marker.getPopup();
```

#### getExtData(): any

获取用户自定义数据

```javascript
const data = marker.getExtData();
```

#### setExtData(data: any)

设置用户自定义数据

```javascript
marker.setExtData({ name: 'test', value: 42 });
```

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
- dragstart
- dragging
- dragend

事件返回数据

- target 事件触发源
- data extData 用户自定义数据
- lnglat marker 经纬度

```javascript
marker.on('click', (e) => {});
```

## demo 地址

[demo1](/examples/tutorial/marker#amap)
