// @ts-nocheck
import { PointLayer, Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class AmapPlugin extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [116.47, 39.98],
        pitch: 0,
        zoom: 12.5,
        plugin: ['AMap.ToolBar', 'AMap.LineSearch'],
      }),
    });
    this.scene = scene;
    scene.addImage(
      'road',
      'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
    );
    scene.addImage(
      'start',
      'https://gw.alipayobjects.com/zos/bmw-prod/1c301f25-9bb8-4e67-8d5c-41117c877caf.svg',
    );
    scene.addImage(
      'end',
      'https://gw.alipayobjects.com/zos/bmw-prod/f3db4998-e657-4c46-b5ab-205ddc12031f.svg',
    );

    scene.addImage(
      'busStop',
      'https://gw.alipayobjects.com/zos/bmw-prod/54345af2-1d01-43e1-9d11-cd9bb953202c.svg',
    );

    scene.on('loaded', () => {
      window.AMap.plugin(['AMap.ToolBar', 'AMap.LineSearch'], () => {
        scene.map.addControl(new AMap.ToolBar());

        var linesearch = new AMap.LineSearch({
          pageIndex: 1, //页码，默认值为1
          pageSize: 1, //单页显示结果条数，默认值为20，最大值为50
          city: '北京', //限定查询城市，可以是城市名（中文/中文全拼）、城市编码，默认值为『全国』
          extensions: 'all', //是否返回公交线路详细信息，默认值为『base』
        });

        //执行公交路线关键字查询
        linesearch.search('536', function(status, result) {
          //打印状态信息status和结果信息result

          const { path, via_stops } = result.lineInfo[0];
          const startPoint = [path[0]];
          const endpoint = [path[path.length - 1]];
          const budStopsData = via_stops.map((stop) => ({
            lng: stop.location.lng,
            lat: stop.location.lat,
            name: stop.name,
          }));
          const data = [
            {
              id: '1',
              coord: path.map((p) => [p.lng, p.lat]),
            },
          ];

          const busLine = new LineLayer({ blend: 'normal' })
            .source(data, {
              parser: {
                type: 'json',
                coordinates: 'coord',
              },
            })
            .size(5)
            .shape('line')
            .color('rgb(99, 166, 242)')
            .texture('road')
            .animate({
              interval: 1, // 间隔
              duration: 1, // 持续时间，延时
              trailLength: 2, // 流线长度
            })
            .style({
              lineTexture: true,
              iconStep: 25,
            });

          scene.addLayer(busLine);

          const startPointLayer = new PointLayer({ zIndex: 1 })
            .source(startPoint, {
              parser: {
                x: 'lng',
                y: 'lat',
                type: 'json',
              },
            })
            .shape('start')
            .size(20)
            .style({
              offsets: [0, 25],
            });
          scene.addLayer(startPointLayer);

          const endPointLayer = new PointLayer({ zIndex: 1 })
            .source(endpoint, {
              parser: {
                x: 'lng',
                y: 'lat',
                type: 'json',
              },
            })
            .shape('end')
            .size(25)
            .style({
              offsets: [0, 25],
            });
          scene.addLayer(endPointLayer);

          const busStops = new PointLayer()
            .source(budStopsData, {
              parser: {
                x: 'lng',
                y: 'lat',
                type: 'json',
              },
            })
            .shape('busStop')
            .size(13)
            .style({
              offsets: [20, 0],
            });
          scene.addLayer(busStops);

          const busStopsName = new PointLayer()
            .source(budStopsData, {
              parser: {
                x: 'lng',
                y: 'lat',
                type: 'json',
              },
            })
            .shape('name', 'text')
            .size(12)
            .color('#000')
            .style({
              textAnchor: 'left',
              textOffset: [80, 0],
              stroke: '#fff',
              strokeWidth: 1,
            });
          scene.addLayer(busStopsName);
        });
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
