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
