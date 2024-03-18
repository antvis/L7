import { Scene, PolygonLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.15, 30.246 ],
    zoom: 13.5,
    style: 'dark',
    pitchEnable: false,
    rotation: -90
  })
});

scene.on('loaded', () => {
  scene.addImage(
    'arrow',
    'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg'
  );

  fetch('https://gw.alipayobjects.com/os/bmw-prod/67130c6c-7f49-4680-915c-54e69730861d.json')
    .then(data => data.json())
    .then(({ lakeBorderData, lakeData, landData }) => {
      const lakeLayer = new PolygonLayer()
        .source(lakeData)
        .shape('fill')
        .color('#1E90FF')
        .style({
          opacity: 0.4,
          opacityLinear: {
            enable: true,
            dir: 'out' // in - out
          }
        });
      const landLayer = new PolygonLayer()
        .source(landData)
        .shape('fill')
        .color('#3CB371')
        .style({
          opacity: 0.4,
          opacityLinear: {
            enable: true,
            dir: 'in' // in - out
          }
        });

      const lakeBorderLayer = new PolygonLayer()
        .source(lakeBorderData)
        .shape('fill')
        .color('#ccc')
        .style({
          opacity: 0.5,
          opacityLinear: {
            enable: true,
            dir: 'in' // in - out
          }
        });

      scene.addLayer(lakeLayer);
      scene.addLayer(lakeBorderLayer);
      scene.addLayer(landLayer);

    });


  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json'
  )
    .then(res => res.json())
    .then(data => {

      const layer = new LineLayer({})
        .source(data)
        .size(3)
        .shape('line')
        .texture('arrow')
        .color('rgb(22,119,255)')
        .animate({
          interval: 1, // 间隔
          duration: 1, // 持续时间，延时
          trailLength: 2 // 流线长度
        })
        .style({
          opacity: 0.6,
          lineTexture: true, // 开启线的贴图功能
          iconStep: 10, // 设置贴图纹理的间距
          borderWidth: 0.4, // 默认文 0，最大有效值为 0.5
          borderColor: '#fff' // 默认为 #ccc
        });
      scene.addLayer(layer);
    });
});
