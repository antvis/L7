/* eslint-disable no-eval */
import { Scene, LineLayer, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';


const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 40,
    center: [ 86, 35.443 ],
    zoom: 2.5,
    viewMode: '3D',
    style: 'dark'
  })
});
const originData = { // 设置经纬度起点和终点数据
  lng1: 116.5883553580003,
  lat1: 40.07680509701226,
  lng2: 55.7508, //2.663131,12.304181 
  lat2: 37.617255
};

scene.on('loaded', () => {
  scene.addImage(
    'plane',
    'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg'
  );

  Promise.all([
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/dbd008f1-9189-461c-88aa-569357ffc07d.json'
    ).then(d => d.json())

  ]).then(function onLoad([ world ]) {

    const data = [];
    for (let i = 0; i < 11; i++) {
      data.push({
        thetaOffset: -0.5 + i * 0.1, // 设置曲线的偏移量
        ...originData
      });
    }

    const worldLine = new LineLayer()
      .source(world)
      .color('#41fc9d')
      .size(0.5)
      .style({
        opacity: 0.4
      });
    scene.addLayer(worldLine);

    const dotPoint = new PointLayer()
    .source(data, {
      parser: {
        type: 'json',
        x: 'lng2',
        y: 'lat2'
      }
    })
    .shape('circle')
    .color('#ffed11')
    .animate(true)
    .size(40)
    .style({
      opacity: 1.0
    });
    scene.addLayer(dotPoint);


    const layer = new LineLayer({
      blend: 'normal'
    })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng1',
          y: 'lat1',
          x1: 'lng2',
          y1: 'lat2'
        }
      })
      .size(1)
      .shape('arc')
      .color('#ff6b34')
      .style({
        opacity: 1,
        thetaOffset: 'thetaOffset'
      });
    scene.addLayer(layer);


    const layer2 = new LineLayer({
      blend: 'normal'
    })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng1',
          y: 'lat1',
          x1: 'lng2',
          y1: 'lat2'
        }
      })
      .size(15)
      .texture('plane')
      .shape('arc')
      .color('#8C1EB2')
      .style({
        opacity: 1,
        thetaOffset: 'thetaOffset',
        lineTexture: true, // 开启线的贴图功能
        iconStep: 20, // 设置贴图纹理的间距
        textureBlend: 'replace'
      })
      .animate({
        duration: 1,
        interval: 0.4,
        trailLength: 0.05
      });

    scene.addLayer(layer2);
  });
});
