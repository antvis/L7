---
title: "MVT Tile"
description: "MVT Tile"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/source/mvt/"
---

[Resource index](/llms.txt)

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

### Tile source attribute

#### tileSet

Tile data set, which can obtain tile information and tile status within the current field of view

```ts
const source = layer1.getSource();
const tileSet = source.tileset;
```

##### Attributes

###### isLoaded

Whether the tiles are loaded

###### currentTiles

Current tile object

###### currentZoom

The current tile level; where once is not equal to the zoom level of the map

##### event

###### tiles-load-start

Map dragging, triggered when new tiles need to be loaded

```ts
tileSet.on('tiles-load-start', () => {
  console.log('tile start');
});
```

###### tiles-load-finished

Triggered after all tile resources that need to be loaded are loaded.

```ts
tileSet.on('tiles-load-finished', () => {
  console.log('tile finished');
});
```

### Tile source method

#### reloadAllTile

Reloading the tile will re-request the data, which is suitable for dynamic tile scenarios, such as the tile data is updated, or the data of the tile Join is updated.

```ts pure
source.reloadAllTile();
```

#### reloadTilebyId

Reload a specific tile

parameter

- z zoom level
- x tile x coordinate
- y tile has coordinates

```ts pure
source.reloadTileById(z, x, y);
```

#### reloadTileByExtent

Update tiles based on latitude and longitude range

parameter

- extent: latitude and longitude range \[minLng,minLat,maxLng,maxLat]
- zoom: zoom level

#### reloadTileByLnglat

Update tiles based on longitude and latitude, convert longitude and latitude coordinates into tile coordinates and update

- lng longitude
- latitude
- zoom zoom level

```tsx pure
source.reloadTileByLnglat(112, 30, 10);
```


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
