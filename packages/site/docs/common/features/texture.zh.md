线图层支持纹理贴图和多种表现形式，通过 `scene.addImage` 方法添加到全局的资源，使用 `texture` 方法指定贴图。

```javascript
scene.addImage('02', 'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg');
const layer = new LineLayer()
    .source(data)
    .size(4)
    .shape('line')
    .texture('02')
    .color('#25d8b7')
    .animate({
        interval: 1, // 间隔
        duration: 1, // 持续时间，延时
        trailLength: 2 // 流线长度
    }).style({
        lineTexture: true, // 开启线的贴图功能
        iconStep: 20 // 设置贴图纹理的间距
    });
```

<div>
  <div style="width:40%;float:right; margin-left: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

- lineTexture   指定是否开启纹理贴图能力
- iconStep      指定贴图在线图层上面排布的间隔

[在线案例](/examples/gallery/animate/#animate_path_texture)

#### texture advance

✨ animate  
当线图层 (`shape` 为 `arc`/`arc3d`) 开启动画模式的时候，纹理在线图层上的分布还会和 `animate` 的参数相关.        

线图层上排列的纹理的数量大致为 duration/interval

```javascript
.animate({
    duration: 1,
    interval: 0.2,
    trailLength: 0.1
});

// 此时 纹理贴图数量为  duration / interval = 5
```

✨ textureBlend 参数    
通过控制 style 方法中的 textureBlend 参数，我们可以控制纹理图层和线图层的混合情况  

- normal
- replace

```javascript
.style({
    lineTexture: true, // 开启线的贴图功能
    iconStep: 30, // 设置贴图纹理的间距
    textureBlend: 'replace', // 设置纹理混合方式，默认值为 normal，可选值有 normal/replace 两种
  });

```

[在线案例](zh/examples/line/animate#plane_animate2)

