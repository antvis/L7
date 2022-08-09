---
title: 高德地图
order: 0
---
`markdown:docs/common/style.md`
## 使用高德地图

### 注册账号并申请Key

1. 首先，[注册开发者账号](https://lbs.amap.com/dev/id/choose)，成为高德开放平台开发者

2. 登陆之后，在进入「应用管理」 页面「创建新应用」

3. 为应用[添加 Key](https://lbs.amap.com/dev/key/app)，「服务平台」一项请选择「 Web 端 ( JSAPI ) 」

### 引入 L7 

2.0版本在L7内部动态引入了高德地图JS API，因此不再需要单独引入高德JS API，只需设置 type 为 ```amap``` 并且传入token

```html
<script src="https://unpkg.com/@antv/l7"></script>
```

### 添加div 标签指定地图容器

同时需要为Div设置 高度和宽度

``` html
<div id="map"></div>
````

### 初始化 L7 Scene


```javascript
  const scene = new L7.Scene({
    id: 'map',
    map: new L7.GaodeMap({
      style: 'dark', // 样式URL
      center: [120.19382669582967, 30.258134],
      pitch: 0,
      zoom: 12,
      token: '高德地图token',
    }),
  });

```

这样我们就完成了通过L7 实例化高德地图


### 添加可视化图层

- 首先我们需要获取数据，获取数据方法，这里我们获取在线的json数据
- 然后我们就可以初始一个Layer，并添加到Scene就完成了图层的添加。

```javascript

fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
  .then(res => res.json())
  .then(data => {
    const pointLayer = new L7.PointLayer({})
      .source(data.list, {
        parser: {
          type: 'json',
          x: 'j',
          y: 'w'
        }
      })
      .shape('cylinder')
      .size('t', function(level) {
        return [ 1, 2, level * 2 + 20 ];
      })
      .color('t', [
        '#094D4A',
        '#146968',
        '#1D7F7E',
        '#289899',
        '#34B6B7',
        '#4AC5AF',
        '#5FD3A6',
        '#7BE39E',
        '#A1EDB8',
        '#CEF8D6'
      ])
      .style({
        opacity: 1.0
      });
    scene.addLayer(pointLayer);
  });

  ```

  ### 完整demo代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>创建地图场景</title>
    <style>
       html,body{overflow:hidden;margin:0;}
    	#map { position:absolute; top:0; bottom:0; width:100%; }
    </style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/@antv/l7"></script>
<script>

  const scene = new L7.Scene({
    id: 'map',
    map: new L7.GaodeMap({
      style: 'dark', // 样式URL
      center: [120.19382669582967, 30.258134],
      pitch: 0,
      zoom: 12,
      token: '高德地图token',
    }),
  });

fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
  .then(res => res.json())
  .then(data => {
    const pointLayer = new L7.PointLayer({})
      .source(data.list, {
        parser: {
          type: 'json',
          x: 'j',
          y: 'w'
        }
      })
      .shape('cylinder')
      .size('t', function(level) {
        return [ 1, 2, level * 2 + 20 ];
      })
      .color('t', [
        '#094D4A',
        '#146968',
        '#1D7F7E',
        '#289899',
        '#34B6B7',
        '#4AC5AF',
        '#5FD3A6',
        '#7BE39E',
        '#A1EDB8',
        '#CEF8D6'
      ])
      .style({
        opacity: 1.0
      });
    scene.addLayer(pointLayer);
  });

</script>
</body>
</html>
```
