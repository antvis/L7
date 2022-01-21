---
title: Popup 信息框
order: 0
---

`markdown:docs/common/style.md`

地图标注信息窗口，用于展示地图要素的属性信息

## 构造函数

Popup

```javascript
const option = {};
const popup = new L7.Popup(option);
```

### option

- closeButton 是否显示关闭按钮，布尔值，默认为 true。
- closeButtonOffsets 显示关闭按钮时生效，[number, number]，默认为 [0, 0]，以右上角为起始点。
- closeOnClick 是否在点击地图的时候关闭弹框，布尔值，默认为 true
- maxWidth 弹框最宽值，默认为 240px
- anchor 弹框锚点，默认值为 bottom，可选值有 center、top、top-left、left、bottom-left、bottom、bottom-right、right、top-right

#### 添加到地图

```javascript
scene.addPopup(popup);
```

## 方法

#### setLnglat

设置 popup 的经纬度位置

**参数**：lnglat

支持数组

```javascript
[112, 32];
```

经纬度对象

```javascript
const lnglat = {
  lng: 112.323,
  lat: 30.456,
};
```

```javascript
popup.setLnglat([112, 32]);
```

#### setHTML

**参数**：html 字符串

设置 popup html 内容

```javascript
var html = `<p>省份
  ${feature.s} </p><p>地区
  ${feature.m}</p><p>数值
  ${feature.t}</p>`;
popup.setHTML(html);
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

#### setMaxWidth

设置 popup 最大宽度

```javascript
popup.setMaxWidth('300px');
```

#### open

显示 popup

```javascript
popup.open();
```

#### close

关闭 popup

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
  const popup= new L7.Popup().setLnglat([112, 32]).setHTML(html);
  scene.addPopup(popup);
```

## demo 地址

[demo1](../../../examples/point/column#column_linear)
[demo2](../../../examples/line/path#bus_light)
