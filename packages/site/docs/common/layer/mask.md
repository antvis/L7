## 图层掩膜

### 配置项设置

 -  maskLayers: 掩膜图层数组
  <description> _array_ **optional** _default:_ []</description>

 -  enableMask: 是否开始，默认开启 maskLayers 不为空时生效

 <description> _bool_ **optional** _default:_ true</description>

```ts
 const polygonLayer = new Polygon();
 const rasterLayer = new Raster({ // 栅格图层使用polygon 掩膜
    maskLayers:[polygonLayer]
 });

```

### addMask
    添加 Mask 图层
```ts
 const polygonLayer = new Polygon();
 layer.addMask(polygonLayer);
```
### removeMask

```ts
 const polygonLayer = new Polygon();
 layer.removeMask(polygonLayer);

```
### disableMask
```ts

 layer.disableMask();

```
### enableMask

```ts
 layer.disableMask();
```


