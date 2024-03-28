### texture

Currently, texture methods are only supported on line layers.

- The texture method supports passing in global icon texture resources added by the scene.addImage method.

```javascript
// First load image resources globally
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
  .texture('plane') // Bind texture to layer
  .color('#8C1EB2')
  .style({
    lineTexture: true, // Enable line mapping function
    iconStep: 30, // Set the spacing of the texture
    textureBlend: 'replace', //Set the texture blending method. The default value is normal. The optional values ​​are normal/replace.
  });
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>

[Online case](/examples/line/animate#plane_animate2)
