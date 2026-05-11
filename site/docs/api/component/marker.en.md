---
title: Marker
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

Marker 地图标注 目前只支持 2D dom 标注

## 构造函数

Marker

`const Marker = new L7.Marker(option)`

#### option

- color        `string` ![L7 Marker](https://gw.alipayobjects.com/zos/basement_prod/b10e0efd-8379-4b04-bcbb-5cfefaa0327f.svg)设置默认 marker 的颜色
- element    `DOM|string`    自定义 marker DOM 节点，可以是 dom 实例，也可以是 dom id
- anchor     `string`  锚点位置   支持 center, top, top-left, top-right, bottom, bottom-left,bottom-                        right,left, right
- offsets    `Array`  偏移量  [ 0, 0 ] 分别表示 X, Y 的偏移量

### 添加到 Scene

```javascript
scene.addMarker(marker);
```

## 方法

#### setLnglat(lngLat: ILngLat | [number, number])

Set marker longitude and latitude position

```javascript
marker.setLnglat({ lng: 120, lat: 30 });
marker.setLnglat([120, 30]);
```

#### getLngLat(): ILngLat

Get marker longitude and latitude coordinates

#### remove()

Remove the marker from the map and clean up event bindings

#### hide()

Hide the marker visually without removing it from the map. Use `show()` to restore visibility.

```javascript
marker.hide();
```

#### show()

Show a hidden marker

```javascript
marker.show();
```

#### getElement(): HTMLElement

Get the marker DOM element

#### setElement(element: HTMLElement)

Set the marker DOM element to update Marker appearance

#### getOffset(): number[]

Get the marker offset `[x, y]`

#### setDraggable(draggable: boolean)

Set whether the marker supports dragging

#### getDraggable(): boolean

Get whether the marker currently supports dragging

#### togglePopup()

Toggle the marker popup open/closed

#### openPopup()

Open the associated Popup

#### closePopup()

Close the associated Popup

#### setPopup(popup: Popup)

Set a popup for the marker

#### getPopup(): Popup

Get the marker popup

#### getExtData(): any

Get user-defined custom data

#### setExtData(data: any)

Set user-defined custom data

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

[demo1](/examples/tutorial/marker#amap)
