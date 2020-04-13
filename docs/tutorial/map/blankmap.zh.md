---
title: 使用无地图模式
order: 2
---

很多情况下我们只是做些简单的地理可视化，不需要加载地图.
本教程就是告诉大家如果在L7中使用无底图模式。

L7 在地图样式层面增加了无底图样式```blank``` 无底图模式

不需要使用mapbox token ,也不需要注册mapbox账户

```javascript
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'blank',
    center: [ 103.83735604457024, 1.360253881403068 ],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313
  })
});
```
如果你只是需要做个中国地图，世界地图这样填充图，建议你采用这样的模式

离线，无token使用 

<iframe
     src="https://codesandbox.io/embed/worldmap-tv6uv?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="worldmap"
     allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
   ></iframe>
