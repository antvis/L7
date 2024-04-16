---
title: MVT Tile
order: 6
---

<embed src="@/docs/api/common/style.md"></embed>

When L7 loads the vector tile map, it needs to be`source`Parse the tile service and configure the request parameters of the tile service.

## parser

### type

<description> _string_ **required** _default:_ mvt</description>

### tileSize `number`

<description> _number_ **Optional** _default:_ 256</description>Request tile size

### zoomOffset

<description> number **Optional** *default:*0</description>Tile request tile level offset

### maxZoom

<description> _number_ **Optional** *default:*0</description>Maximum tile zoom level`20`

### minZoom

<description> _number_ **Optional** _default:_ 2-</description>Tile minimum scaling, etc.

### extent `[number, number, number, number]`

<description> _number\[]_ **Optional**not limited:\_</description>Map display range

### getCustomData `(tile: { x: number, y: number, z: number }, callback: (err: any, data: any) => void) => void,`

<description>\_\_**Optional**</description>

callback parameters

- err when data is returned
- data arraybuffer type, pbf

Customize the tile data acquisition method, trial business scenarios require data authentication, or special processing scenarios

<embed src="@/docs/api/common/source/tile/method.zh.md"></embed>

## Example

### Universal

```javascript
const tileSource = new Source('http://localhost:3000/zhejiang.mbtiles/{z}/{x}/{y}.pbf', {
  parser: {
    type: 'mvt',
    tileSize: 256,
    zoomOffset: 0,
    maxZoom: 9,
    extent: [-180, -85.051129, 179, 85.051129],
  },
});
```

### Custom method

```javascript
const source = new Source('https://gridwise.alibaba-inc.com/tile/test?z={z}&x={x}&y={y}', {
  parser: {
    type: 'mvt',
    tileSize: 256,
    getCustomData: (tile, cb) => {
      const url = `https://gridwise.alibaba-inc.com/tile/test?z=${tile.z}&x=${tile.x}&y=${tile.y}`;
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => {
          cb(null, data);
        });
    },
  },
});
```
