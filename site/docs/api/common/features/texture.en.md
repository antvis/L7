The line layer supports texture mapping and various expression forms, through`scene.addImage`Methods are added to global resources using`texture`Method specifies the texture.

```javascript
scene.addImage(
  '02',
  'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
);
const layer = new LineLayer()
  .source(data)
  .size(4)
  .shape('line')
  .texture('02')
  .color('#25d8b7')
  .animate({
    interval: 1, // interval
    duration: 1, // duration, delay
    trailLength: 2, // streamline length
  })
  .style({
    lineTexture: true, // Enable line mapping function
    iconStep: 20, //Set the spacing of the texture
  });
```

<div>
  <div style="width:40%;float:right; margin-left: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

- lineTexture specifies whether to enable texture mapping capabilities
- iconStep specifies the interval at which the texture is arranged on the line layer

[Online case](/examples/gallery/animate/#animate_path_texture)

#### texture advance

✨ animate\
Current line layer (`shape`for`arc`/`arc3d`) When animation mode is turned on, the distribution of textures on the line layer will also be consistent with`animate`parameters related.

The number of textures arranged on a line layer is roughly duration/interval

```javascript
.animate({
    duration: 1,
    interval: 0.2,
    trailLength: 0.1
});

// At this time, the number of texture maps is duration / interval = 5
```

✨ textureBlend parameters\
By controlling the textureBlend parameter in the style method, we can control the blending of texture layers and line layers.

- normal
- replace

```javascript
.style({
    lineTexture: true, // Enable line mapping function
    iconStep: 30, // Set the spacing of the texture
    textureBlend: 'replace', //Set the texture blending method. The default value is normal. The optional values ​​are normal/replace.
  });
```

[Online case](zh/examples/line/animate#plane_animate2)
