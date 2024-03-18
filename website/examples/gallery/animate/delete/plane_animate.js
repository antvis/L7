/* eslint-disable no-eval */
import { Scene, LineLayer, PointLayer, PolygonLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 40,
    center: [ 3.438, 40.16797 ],
    zoom: 1
  })
});
scene.setBgColor('#000');
scene.on('loaded', () => {
  scene.addImage(
    'plane',
    'https://gw.alipayobjects.com/zos/bmw-prod/96327aa6-7fc5-4b5b-b1d8-65771e05afd8.svg'
  );
  Promise.all([
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/2960e1fc-b543-480f-a65e-d14c229dd777.json'
    ).then(d => d.json()),
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/4472780b-fea1-4fc2-9e4b-3ca716933dc7.json'
    ).then(d => d.text()),
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json'
    ).then(d => d.text())
  ]).then(function onLoad([ world, dot, flyline ]) {
    const dotData = eval(dot);
    // @ts-ignore
    const flydata = eval(flyline).map(item => {
      // @ts-ignore
      const latlng1 = item.from.split(',').map(e => {
        return e * 1;
      });
      // @ts-ignore
      const latlng2 = item.to.split(',').map(e => {
        return e * 1;
      });
      return { coord: [ latlng1, latlng2 ] };
    });

    const worldLine = new LineLayer()
      .source(world)
      .color('rgb(22,119,255)')
      .size(0.5)
      .style({
        opacity: 0.4
      });
    const worldPolygon = new PolygonLayer()
      .source(world)
      .shape('fill')
      .color('rgb(22,119,255)')
      .size(0.5)
      .style({
        opacity: 0.4,
        opacityLinear: {
          enable: true,
          dir: 'in' // in - out
        }
      });
    const dotPoint = new PointLayer({ bland: 'additive' })
      .source(dotData, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat'
        }
      })
      .shape('circle')
      .color('rgb(22,119,255)')
      .animate(true)
      .size(40);
    const flyLine = new LineLayer({
      blend: 'additive',
      zIndex: 2
    })
      .source(flydata, {
        parser: {
          type: 'json',
          coordinates: 'coord'
        }
      })
      .color('rgb(22,119,255)')
      .texture('plane')
      .shape('arc3d')
      .size(25)
      .animate({
        duration: 1,
        interval: 0.5,
        trailLength: 0.05
      })
      .style({
        textureBlend: 'replace',
        lineTexture: true, // 开启线的贴图功能
        iconStep: 8, // 设置贴图纹理的间距
      });

    const flyLine2 = new LineLayer()
      .source(flydata, {
        parser: {
          type: 'json',
          coordinates: 'coord'
        }
      })
      .color('rgb(22,119,255)')
      .shape('arc3d')
      .size(1)
      .style({
        lineType: 'dash',
        dashArray: [ 5, 5 ],
        opacity: 0.5
      });
    scene.addLayer(worldLine);
    scene.addLayer(worldPolygon);
    scene.addLayer(dotPoint);
    scene.addLayer(flyLine2);
    scene.addLayer(flyLine);
  });
});

// {
//   "filename": "plane_animate.js",
//   "title": "航向图",
//   "screenshot":"https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*8h-QSqDgzxYAAAAAAAAAAAAAARQnAQ"
// },