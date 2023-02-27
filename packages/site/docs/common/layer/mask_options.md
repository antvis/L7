


⚠️ mask、maskfence 不推荐使用，一下配置 2.14.x 之后版本生效

模板图层：用做模板的图层，PointLayer、LineLayer、PolygonLayer 都可以作为模板
掩膜图层：被模板切割的图层

### maskLayers

   掩膜图层生效

  <description> _array Layer_ **optional** _default:_ []</description>



 ### enableMask
    
掩膜图层生效

 是否开启掩膜，默认开启 maskLayers 不为空时生效

 <description> _bool_ **optional** _default:_ true</description>

 ### maskInside
    掩膜图层生效

<description> _boolean_ **optional** _default:_ true</description>

用来描述当前图层的内容与掩模边界显示。

- `true` 在掩模内部显示
- `false` 在掩模外部显示

### maskOpetation 掩膜方式

模板图层生效
<description> _枚举_ **optional** _default:_ and</description>
 maskLayers 为多个时失效，需要在模板图层设置

- or 交集
- and 并集

使用示例

```ts

 const polygonLayer = new Polygon();
 const rasterLayer = new Raster({ // 栅格图层使用polygon 掩膜
    maskLayers:[polygonLayer],
    enableMask:true,
    maskInside: true,
 
 });