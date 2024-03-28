---
title: No Map
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

In many cases we just do simple geographical visualization without loading a map. This tutorial will tell you how to use basemapless mode in L7.

- `L7`Added a baseless map style at the map style level`blank`No basemap mode.
- Do not need to use`mapbox token`, no need to register`mapbox`account.

```javascript
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'blank',
    center: [103.83735604457024, 1.360253881403068],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313,
  }),
});
```

🌟 If you just need to make a map of China and fill the world map like this, it is recommended that you use this mode.
