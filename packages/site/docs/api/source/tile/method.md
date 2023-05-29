### 瓦片source 属性

#### tileSet 
 瓦片数据集，可以获取当前视野内的瓦片信息, 瓦片状态

 ```ts
 const source = layer1.getSource();
 const tileSet = source.tileset;
 ```
 ##### 属性
 
###### isLoaded 
    瓦片是否加载完成

###### currentTiles
   

###### currentZoom
 当前瓦片层级；这里的曾经和map 的缩放层级不相等

 ##### 事件

 ###### tiles-load-start

    地图拖动，需要加载新的瓦片时触发

    ```ts
     
        tileSet.on('tiles-load-start',()=>{
            console.log('tile start');
        })
      
    ```
  

###### tiles-load-finished
    所有需要加载的瓦片资源加载完成后触发
  

    ```ts
      tileSet.on('tiles-load-finished',()=>{
            console.log('tile finished');
        })

    ```

### 瓦片source 方法

#### reloadAllTile

重新加载瓦片，会重新请求数据，适用与动态瓦片场景，如瓦片数据发生了更新，或者瓦片Join 的数据发生了更新

```ts pure
source.reloadAllTile();
```

#### reloadTilebyId

重新加载特定瓦片的 

参数
- z  缩放等级
- x  瓦片 x 坐标
- y  瓦片有坐标

```ts  pure
source.reloadTileById(z,x,y);
```

#### reloadTileByExtent

根据经纬度范围更新瓦片

参数

- extent: 经纬范围 [minLng,minLat,maxLng,maxLat]
- zoom: 缩放等级

#### reloadTileByLnglat

根据经纬度更新瓦片，经纬度坐标转换成瓦片坐标更新

- lng 经度
- lat  纬度
- zoom 缩放等级


```tsx pure

source.reloadTileByLnglat(112,30,10);
```