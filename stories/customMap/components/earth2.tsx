// @ts-ignore
import { Scene } from '@antv/l7';
import { PointLayer, EarthLayer, LineLayer } from '@antv/l7-layers';
import { Earth } from '@antv/l7-maps';
import * as React from 'react';

export default class ScaleComponent extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Earth({}),
    });

    scene.setBgColor('#333');

    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json',
    )
      .then((d) => d.text())
      .then((flyline) => {
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
        const flyLine = new LineLayer({ blend: 'normal' })
          .source(flydata, {
            parser: {
              type: 'json',
              coordinates: 'coord',
            },
          })
          .color('#b97feb')
          .shape('arc3d')
          .size(0.5)
          .active(true)
          .animate({
            interval: 2,
            trailLength: 2,
            duration: 1,
          })
          .style({
            opacity: 1,
            segmentNumber: 60,
            globalArcHeight: 20,
          });
        scene.addLayer(flyLine);
      });

    const earthlayer = new EarthLayer()
      .source(
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
        {
          parser: {
            type: 'image',
          },
        },
      )
      .shape('base')
      .style({
        globelOtions: {
          ambientRatio: 0.6, // 环境光
          diffuseRatio: 0.4, // 漫反射
          specularRatio: 0.1, // 高光反射
          // earthTime: 4.0
          earthTime: 0.1,
        },
      })
      .animate(true);
    // earthlayer.setEarthTime(4.0)

    const atomLayer = new EarthLayer()
      .color('#2E8AE6')
      .shape('atomSphere')
      .style({
        opacity: 1,
      });

    const bloomLayer = new EarthLayer()
      .color('#fff')
      .shape('bloomSphere')
      .style({
        opacity: 0.5,
      });

    scene.on('loaded', () => {
      scene.addLayer(earthlayer);
      // scene.addLayer(pointlayer);
      // console.log(pointlayer)

      // earthlayer.setEarthTime(4.0);
      scene.addLayer(atomLayer);
      scene.addLayer(bloomLayer);
    });
  }

  public render() {
    return (
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
    );
  }
}
