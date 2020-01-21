---
title: popup
order: 0
---

# popup

地图标注信息窗口，用于展示地图要素的属性信息

## 构造函数

Popup

```javascript
const popup = new L7.Popup(option);
```

#### option

- closeButton
- closeOnClick
- maxWidth
- anchor

## 方法

#### setLnglat

设置 popup 的经纬度位置<br />**参数**：lnglat 经纬度数组 [112,32]

```javascript
popup.setLnglat([112, 32]);
```

#### addTo

**参数**：scene 地图 scene 实例

将 popup 添加到地图 scene 显示

```javascript
popup.addTo(scene);
```

#### setHtml

**参数**：html 字符串

设置 popup html 内容

```javascript
var html =
  '<p>\u7701\u4EFD\uFF1A' +
  feature.s +
  '</p>\n        <p>\u5730\u533A\uFF1A' +
  feature.m +
  '</p>\n        <p>\u6E29\u5EA6\uFF1A' +
  feature.t +
  '</p>\n        ';
popup.setHtml(html);
```

#### setDOMContent

- 参数 htmlNode dom 对象
  区别于 setHtml 对象只能传字符串

**tips**
如果需要将 react 组件渲染到 popup 可以用此方法。

#### setText

设置 popup 显示文本内容

```javascript
popup.setText('hello world');
```

#### open

显示 popup

```javascript
popup.open();
```

#### close

显示 popup

```javascript
popup.close();
```

#### remove

移除 popup

```javascript
popup.remove();
```

## 事件

### open

```javascript
popup.on('open', () => {});
```

#### close

```javascript
popup.on('close', () => {});
```

## 示例代码

#### 添加 popup

```
  var html = '<p>'+feature.m+'</p>';
  const new L7.Popup().setLnglat([112, 32]).setHTML(html).addTo(scene);
```

## demo 地址

[demo1](../../../examples/point/column)
[demo2](../../../examples/line/path)
