import {
  LineLayer,
  Scene,
  MaskLayer,
  PolygonLayer,
  PointLayer,
} from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_road2 extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMap({
        center: [120.165, 30.26],
        pitch: 0,
        zoom: 15,
        viewMode: '3D',
        style: 'dark',
      }),
    });
    this.scene = scene;
    const data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [120.16021728515624, 30.259660295442085],
                  [120.15987396240234, 30.25313608393673],
                  [120.16605377197266, 30.253729211980726],
                  [120.1658821105957, 30.258474107402265],
                ],
              ],
              [
                [
                  [120.1703453063965, 30.258474107402265],
                  [120.17086029052733, 30.254174055663515],
                  [120.17583847045898, 30.254915457324778],
                  [120.17446517944336, 30.258474107402265],
                ],
              ],
            ],
          },
        },
      ],
    };

    const data2 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [120.16536712646484, 30.26336704072365],
                  [120.16777038574219, 30.2657392842738],
                  [120.17086029052733, 30.26232916614846],
                ],
              ],
            ],
          },
        },
      ],
    };

    const data3 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [[]],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      const polygonlayer = new MaskLayer({})
        .source(data)
        .shape('fill')
        .color('red')
        .style({
          opacity: 0.3,
        });
      scene.addLayer(polygonlayer);

      let points = new PointLayer({ zIndex: 2 })
        .source(
          [
            {
              lng: 120.14871597290039,
              lat: 30.268407989758884,
            },
            {
              lng: 120.15352249145508,
              lat: 30.271669642392517,
            },
            {
              lng: 120.16502380371092,
              lat: 30.26944580007901,
            },
            {
              lng: 120.16485214233397,
              lat: 30.26425663877134,
            },
            {
              lng: 120.16073226928711,
              lat: 30.259067203213018,
            },
          ],
          {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          },
        )
        .shape('circle')
        .size(25)
        .color('#0ff')
        .style({
          opacity: 0.3,
        });
      scene.addLayer(points);

      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new LineLayer({ mask: true, maskInside: true }) // mask: true maskInside: true
            .source(data)
            .size(5)
            .shape('line')
            .color('rgb(20, 180, 90)')
            .style({
              borderWidth: 0.35,
              borderColor: '#fff',
              // opacity: 0.5,
              // lineTexture: true, // 开启线的贴图功能
              // iconStep: 80, // 设置贴图纹理的间距
            })
            .active(true);
          scene.addLayer(layer);

          const polygonlayer2 = new MaskLayer({})
            .source(data2)
            .shape('fill')
            .color('#ff0')
            .style({
              opacity: 0.3,
            });
          scene.addLayer(polygonlayer2);
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
