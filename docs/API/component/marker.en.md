---
title: Map Marker
order: 3
---

Marker 地图标注 目前只支持2D dom标注


## 构造函数
Marker<br />`const Marker = new L7.Marker(option)`


#### option

- color        `string `   ![map-marker.png](https://cdn.nlark.com/yuque/0/2019/png/104251/1566814628445-4f3152c8-71d1-4908-a651-246c17e507b5.png#align=left&display=inline&height=32&name=map-marker.png&originHeight=32&originWidth=32&size=635&status=done&width=32) 设置默认marker的颜色
- element    `Dom|string`    自定义marker Dom节点，可以是dom实例，也可以是dom id
- anchor     `string`  锚点位置  支持 center, top, top-left, top-right, bottom, bottom-left,bottom-                        right,left, right
- offset    `Array`  偏移量 [ 0, 0 ] 分别表示 X, Y 的偏移量


## 方法

#### setLnglat
设置marker经纬度位置

#### addTo
将marker添加到地图Scene

#### remove
移除marker

#### getElement
获取marker dom Element

#### getLngLat
获取marker经纬度坐标

#### togglePopup
开启或者关闭marker弹出框

#### setPopup
为marker设置popup

#### getPopup
获取marker弹出框


## 示例代码

#### 默认Marker
**<br />` const marker = new L7.Marker({color:'blue'})`


#### 自定义Marker

```javascript
var el = document.createElement('label');
       el.className = 'lableclass';
       el.textContent = data[i].v;
       el.style.background = getColor(data[i].v);
       new L7.Marker({
         element: el
       })
       .setLnglat([data[i].x * 1, data[i].y])
        .addTo(scene);
```


#### 设置 popup

```javascript
  var popup = new L7.Popup({
          anchor: 'left'
        }).setText(item.name);

new L7.Marker({
  element: el
}).setLnglat(item.coordinates)
  .setPopup(popup)
  .addTo(scene);
```


