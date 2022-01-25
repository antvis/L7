import { PointLayer, LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_arcLine3dLinear extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 40,
        center: [3.438, 40.16797],
        zoom: 0,
        viewMode: '3D',
        style: 'dark',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      // scene.addImage(
      //   'plane',
      //   'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg',
      // );
      Promise.all([
        fetch(
          'https://gw.alipayobjects.com/os/bmw-prod/2960e1fc-b543-480f-a65e-d14c229dd777.json',
        ).then((d) => d.json()),
        fetch(
          'https://gw.alipayobjects.com/os/basement_prod/4472780b-fea1-4fc2-9e4b-3ca716933dc7.json',
        ).then((d) => d.text()),
        fetch(
          'https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json',
        ).then((d) => d.text()),
      ]).then(function onLoad([world, dot, flyline]) {
        const dotData = eval(dot);
        // @ts-ignore
        const flydata = eval(flyline).map((item) => {
          // @ts-ignore
          const latlng1 = item.from.split(',').map((e) => {
            return e * 1;
          });
          // @ts-ignore
          const latlng2 = item.to.split(',').map((e) => {
            return e * 1;
          });
          return { coord: [latlng1, latlng2] };
        });

        const worldLine = new LineLayer()
          .source(world)
          .color('#41fc9d')
          .size(0.5)
          .style({
            opacity: 0.4,
          });
        const dotPoint = new PointLayer()
          .source(dotData, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('circle')
          .color('#ffed11')
          .animate(true)
          .size(40)
          .style({
            opacity: 1.0,
          });
        const flyLine = new LineLayer({ blend: 'normal' })
          .source(flydata, {
            parser: {
              type: 'json',
              coordinates: 'coord',
            },
          })
          .color('#ff6b34')
          // .texture('plane')
          .shape('arc3d')
          // .shape('arc')
          .size(2)
          // .active(true)
          .animate({
            duration: 2,
            interval: 2,
            trailLength: 2,
          })
          .style({
            // textureBlend: 'replace',
            // lineTexture: true, // 开启线的贴图功能
            // iconStep: 10, // 设置贴图纹理的间距
            sourceColor: '#f00',
            targetColor: '#0f0',
            opacity: 0.5,
          });

        // const flyLine2 = new LineLayer({blend: 'normal'})
        // .source(flydata, {
        //   parser: {
        //     type: 'json',
        //     coordinates: 'coord',
        //   },
        // })
        // .color('#ff6b34')
        // // .shape('arc3d')
        // .shape('arc')
        // .size(1)
        // // .active(true)
        // .style({
        //   lineType: 'dash',
        //   dashArray: [5, 5],
        //   opacity: 0.5
        // });
        scene.addLayer(worldLine);
        scene.addLayer(dotPoint);
        // scene.addLayer(flyLine2)
        scene.addLayer(flyLine);
      });
    });
  }

  public render() {
    return (
      <>
        <div
          id="map"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </>
    );
  }
}
