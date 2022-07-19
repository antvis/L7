import { PointLayer, Scene, Source } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
import data1 from '../data/cluster1.json';
import data2 from '../data/cluster2.json';
export default class Point3D extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'light',
        center: [33, 15],
        zoom: 8,
      }),
    });
    scene.on('loaded', () => {
      // 模拟第一次渲染
      const dataSource = new Source(data1, {
        parser: {
          type: 'json',
          x: 'longtitude',
          y: 'latitide',
        },
        cluster: true,
      });
      const pointLayer = new PointLayer({})
        // 这边传入 firstData 就不会有问题
        .source(dataSource)
        .shape('circle')
        .scale('point_count', {
          type: 'quantile',
        })
        .size('point_count', [15, 20, 25, 30, 35])
        .active(true)
        .color('#CC3D00')
        .style({
          opacity: 1,
        });
      // 聚合图标注
      const pointLayerText = new PointLayer({})
        .source(dataSource)
        .shape('point_count', 'text')
        .size(15)
        .color('#fff')
        .style({
          opacity: 1,
          strokeWidth: 0,
          stroke: '#fff',
        });
      scene.addLayer(pointLayer);
      scene.addLayer(pointLayerText);
      this.scene = scene;
      // 模拟第二次渲染,样式错乱了
      setTimeout(() => {
        dataSource.setData(data2);
        console.log(pointLayerText);
      }, 2000);
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
