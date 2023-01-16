### texture

目前只在线图层上支持了纹理方法

- texture 方法支持传入由 scene.addImage 方法添加的全局 icon 贴图资源

```javascript
// 首先在全局加载图片资源
scene.addImage(
  'plane',
  'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg',
);

const layer = new LineLayer({
  blend: 'normal',
})
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(25)
  .shape('arc')
  .texture('plane') // 为图层绑定纹理
  .color('#8C1EB2')
  .style({
    lineTexture: true, // 开启线的贴图功能
    iconStep: 30, // 设置贴图纹理的间距
    textureBlend: 'replace', // 设置纹理混合方式，默认值为 normal，可选值有 normal/replace 两种
  });
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>

[在线案例](/examples/line/animate#plane_animate2)