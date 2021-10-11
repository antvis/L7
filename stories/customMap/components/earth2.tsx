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
      map: new Earth({
        center: [120, 30],
        pitch: 0,
        zoom: 3,
      }),
    });

    let data = [
      {
        lng1: 100,
        lat1: 30.0,
        lng2: 130,
        lat2: 30
      }
    ];

    const lineLayer = new LineLayer({
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
      .size(2)
      .shape('arc3d')
      .color('#8C1EB2')
      // .animate(true)
    // .animate({
    //   duration: 50,
    //   interval: 0.2,
    //   trailLength: 0.05,
    // });
    fetch('https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json')
    .then(d => d.text())
    .then(flyline => {
      // @ts-ignore
      const flydata = eval(flyline).map(item => {
        // @ts-ignore
        const latlng1 = item.from.split(',').map(e => { return e * 1; });
        // @ts-ignore
        const latlng2 = item.to.split(',').map(e => { return e * 1; });
        return { coord: [ latlng1, latlng2 ] };
      });
      const flyLine = new LineLayer({ blend: 'normal',})
      .source(flydata, {
        parser: {
          type: 'json',
          coordinates: 'coord'
        }
      })
      .color('#b97feb')
      .shape('arc3d')
      .size(1)
      .active(true)
      .animate({
        interval: 2,
        trailLength: 2,
        duration: 1
      })
      .style({
        opacity: 1,
        segmentNumber: 60,
        globalArcHeight: 20
      });
      scene.addLayer(flyLine)
    })


    const earthlayer = new EarthLayer()
      .source(
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
        {
          parser: {
            type: 'image',
            extent: [121.168, 30.2828, 121.384, 30.4219],
          },
        },
      )
      .color('#2E8AE6')
      .shape('fill')
      .style({
        opacity: 1.0,
        radius: 40,
        globelOtions: {
          ambientRatio: 0.6, // 环境光
          diffuseRatio: 0.4, // 漫反射
          specularRatio: 0.1, // 高光反射
          // earthTime: 4.0
          earthTime: 0.1,
        },
      });
    // .animate(true);
    // earthlayer.setEarthTime(4.0)
    scene.on('loaded', () => {
      scene.addLayer(earthlayer);
      // scene.addLayer(pointlayer);
      // console.log(pointlayer)

      // earthlayer.setEarthTime(4.0);

      scene.addLayer(lineLayer);
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
