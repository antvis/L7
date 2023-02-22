


⚠️ mask、maskfence 不推荐使用，一下配置 2.14.x 之后版本生效
### maskLayers

   掩膜图层数组，掩膜图层

  <description> _array Layer_ **optional** _default:_ []</description>



 ### enableMask

 是否开启掩膜，默认开启 maskLayers 不为空时生效

 <description> _bool_ **optional** _default:_ true</description>

 ### maskInside

<description> _boolean_ **optional** _default:_ true</description>

用来描述当前图层的内容与掩模边界显示。

- `true` 在掩模内部显示
- `false` 在掩模外部显示

使用示例

```ts

 const polygonLayer = new Polygon();
 const rasterLayer = new Raster({ // 栅格图层使用polygon 掩膜
    maskLayers:[polygonLayer],
    enableMask:true,
    maskInside: true,
 
 });