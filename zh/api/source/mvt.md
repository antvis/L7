---
title: "MVT Tile"
description: "MVT Tile"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/source/mvt/"
---

[资料索引](/llms.txt)

L7 加载矢量瓦片地图的时候需要在 `source` 中对瓦片服务进行解析，同时配置瓦片服务的请求参数。

## parser

### type

_string_ **必选** _default:_ mvt

### tileSize `number`

_number_ **可选** _default:_ 256
请求瓦片的大小

### zoomOffset

number **可选** _default:_ 0
瓦片请求瓦片层级的偏移

### maxZoom

_number_ **可选** _default:_ 0
瓦片最大缩放等级 `20`

### minZoom

_number_ **可选** _default:_ 2-
瓦片最小缩放等

### extent `[number, number, number, number]`

_number[]_ **可选** 不限制:\_
地图显示范围

### getCustomData `(tile: { x: number, y: number, z: number }, callback: (err: any, data: any) => void) => void,`

\_\_ **可选**

callback 参数

- err 数据返回时
- data arrarybuffer 类型， pbf

自定义瓦片数据获取方法,试用业务场景需要数据鉴权，或者特殊处理的场景

## 瓦片 source 属性

### tileset

瓦片数据集，可以获取当前视野内的瓦片信息, 瓦片状态

```ts
const source = layer1.getSource();
const tileSet = source.tileset;
```

#### 属性

##### isLoaded

瓦片是否加载完成

##### currentTiles

当前瓦片对象

##### currentZoom

当前瓦片层级；这里的曾经和map 的缩放层级不相等

#### 事件

##### tiles-load-start

地图拖动，需要加载新的瓦片时触发

```ts
tileSet.on('tiles-load-start', () => {
  console.log('tile start');
});
```

##### tiles-load-finished

所有需要加载的瓦片资源加载完成后触发

```ts
tileSet.on('tiles-load-finished', () => {
  console.log('tile finished');
});
```

## 瓦片 source 方法

### reloadAllTile

重新加载瓦片，会重新请求数据，适用与动态瓦片场景，如瓦片数据发生了更新，或者瓦片Join 的数据发生了更新

```ts pure
source.reloadAllTile();
```

### reloadTilebyId

重新加载特定瓦片的

参数

- z 缩放等级
- x 瓦片 x 坐标
- y 瓦片 y 坐标

```ts pure
source.reloadTileById(z, x, y);
```

### reloadTileByExtent

根据经纬度范围更新瓦片

参数

- extent: 经纬范围 [minLng, minLat, maxLng, maxLat]
- zoom: 缩放等级

### reloadTileByLnglat

根据经纬度更新瓦片，经纬度坐标转换成瓦片坐标更新

- lng 经度
- lat 纬度
- zoom 缩放等级

```tsx pure
source.reloadTileByLnglat(112, 30, 10);
```


## 示例

### 通用

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

### 自定义方法

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
