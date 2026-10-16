---
title: MVT Tile
order: 6
---

When L7 loads the vector tile map, it needs to be`source`Parse the tile service and configure the request parameters of the tile service.

## parser

### type

_string_ **required** _default:_ mvt

### tileSize `number`

_number_ **Optional** _default:_ 256Request tile size

### zoomOffset

number **Optional** *default:*0Tile request tile level offset

### maxZoom

_number_ **Optional** *default:*0Maximum tile zoom level`20`

### minZoom

_number_ **Optional** _default:_ 2-Tile minimum scaling, etc.

### extent `[number, number, number, number]`

_number\[]_ **Optional**not limited:\_Map display range

### getCustomData `(tile: { x: number, y: number, z: number }, callback: (err: any, data: any) => void) => void,`

\_\_**Optional**

callback parameters

- err when data is returned
- data arraybuffer type, pbf

Customize the tile data acquisition method, trial business scenarios require data authentication, or special processing scenarios

<!-- include: ../common/source/tile/method.en.md -->

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
