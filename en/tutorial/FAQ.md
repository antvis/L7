---
title: "FAQ"
description: "FAQ"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/tutorial/FAQ/"
---

[Resource index](/llms.txt)

### Inconsistent versions of each dependent package of L7 in the project lead to error reporting

```js
Error: Cannot apply @injectable decorator multiple times.
```

<img height="300px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BsMyRZDuB54AAAAAAAAAAAAAARQnAQ'>

🌟Solution:\
delete`node_modules`Download all different versions of`L7`package, reinstall and start.

### Disable map interaction

1. During initialization, you can`map`Configuration item settings

- Gaode map can be viewed<https://lbs.amap.com/api/javascript-api/reference/map>
- mapbox <https://docs.mapbox.com/mapbox-gl-js/api/#map>

2. Set after loading is complete
   transfer`scene`of[setMapStatus](/en/api/scene/#setmapstatus)method

### webcontext lost

1. Browser exists`webgl`The upper limit of instances is 16 in general browsers, so the number of map instances that can exist in the browser is limited.
2. Need to be called after destroying the map`scene.destroy();`right`webgl`The instance is destroyed.
