---
title: Use Offline
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

at present`L7`Support Gao Dehe`Mapbox`Two base maps, the AMap map is used online`API`Offline deployment is not possible. If you have offline deployment requirements, you can use it.`MapBox`Make a base map.`L7`The interface layer unifies the direct differences between different basemaps, and a set of visualization codes can be run on`L7`On any supported basemap. This article mainly introduces how to use it offline and accelerate its use in China.`MapBox`, and also provides online font services, which you can also download for local use.

### How to introduce Mapbox in L7

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'dark',
    center: [103.83735604457024, 1.360253881403068],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313,
    token: 'xxxx',
  }),
});
```

### Why go offline

- Offline deployment
- Domestic acceleration
- Do not use`mapbox token`

### How to use MapBox offline

As long as you don't use`MapBox`The data base map service can be used offline.`mapbox`All data service resources are in`style`configured inside. In addition to data services, there are also some static resources, which are mainly used for image annotation and text annotation.

`mapbox`If the data resources themselves are deployed and used separately in foreign countries, the loading speed experience is still very good.

Let's find out first`MapBox`What configuration items the style contains.

#### Mapbox style parameters

- `version`：`JS SDK`The corresponding version must be 8.
- `name`: The naming of the style.
- `sprite`: Sprite map, which contains all the sporadic icon images involved in a map into one large image.
- `glyphs`：`.pbf`Format font style, such as Microsoft Yahei and other font libraries.
- `sources`: The resource file of the layer, which can support vector slices, raster,`dem`raster, picture,`geojson`, video and other formats.
- `layers`: It is a description of each layer style. This is the key to rendering the map style. You can customize the map style.

Specific parameters and their`api`Can refer to`mapbox`official website.

If you want to achieve localization, you only need`sprite`，`glyphs`Localization is fine, and the map service can load other services.

If you don't need to use`MapBox`Data service, used to complete the visualization layer`L7`Rendering is even simpler.

You just need to`MapBox`Map style settings`blank`。

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

`blank`The style is considered to be a baseless style, so there is no need to use it in this style.`mapbox`service, there is no need to use`mapbox`of`token`。

#### Localized sprite map

If you need to use`mapbox`For field image annotation, you need to localize sprite image resources<br />Just download two files<br />sprite.json mainly records the position of each chart on the big picture<br />sprite.png A big picture composed of each small icon

Online sprite service address:<br /><https://lzxue.github.io/font-glyphs/sprite/sprite>

#### localized fonts

If needed use`mapbox`The article annotation function needs to be localized. If your rendering capabilities are all using`L7`To achieve this, this process is also unnecessary.

`L7`Online font service provided<br />Currently supports 4 fonts.

- Alibaba inclusive body
- noto
- opensan
- roboto

_If you have new font requirements, you can submit a PR and we will automatically generate an online font service for you. You can use it online or download it for local use._

Font service download:[gh-pages branch](https://github.com/lzxue/font-glyphs/tree/gh-pages) you can`clone`Come down and use it directly.

**You can also use online services**<br />github service<br /><https://lzxue.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf><br />Ant CDN:<br /><https://gw.alipayobjects.com/os/antvdemo/assets/mapbox/glyphs/{fontstack}/{range}.pbf>

#### Map service localization

1.Load[Third-party basemap](https://github.com/htoooth/Leaflet.ChineseTmsProviders), the raster tile layer is used as the base map, such as Sky Map, AMap,`google`Grid tiles are available<br />2.Download[opensteetmap ](https://openmaptiles.com/downloads/planet/)Vector tile map as base map<br />3. Publish base map service or vector tile service for your own business data.

**Here is a more complete solution**<br /> <https://jingsam.github.io/foxgis-server-lite/#/>

####

All service resources have been prepared so that we can use them independently`mapbox`Service, no need to apply again`mapbox`of`token`。

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: {
      version: 8,
      name: 'blank',
      sprite: 'https://lzxue.github.io/font-glyphs/sprite/sprite',
      glyphs:
        'https://gw.alipayobjects.com/os/antvdemo/assets/mapbox/glyphs/{fontstack}/{range}.pbf',
      sources: {},
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': 'white',
          },
        },
      ],
    },
    center: [103.83735604457024, 1.360253881403068],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313,
    token: 'xxxx',
  }),
});
```

[Offline, use mapbox demo without token](https://codesandbox.io/embed/frosty-architecture-tv6uv?fontsize=14&hidenavigation=1&theme=dark)<br />
