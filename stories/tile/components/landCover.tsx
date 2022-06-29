import * as React from 'react';
import * as turf from '@turf/turf';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  MaskLayer,
  Popup,
} from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';
// @ts-ignore
import * as GeoTIFF from 'geotiff';

export default class RasterTile extends React.Component<
  any,
  { colorList: string[]; positions: any[] }
> {
  private scene: Scene;

  constructor(props: any) {
    super(props);
    this.state = {
      colorList: [
        '#419bdf',
        '#397d49',
        '#88b053',
        '#7a87c6',
        '#e49635',
        '#dfc35a',
        '#c4281b',
        '#a59b8f',
        '#a8ebff',
        '616161',
      ],
      positions: [
        'Water',
        'Trees',
        'Grass',
        'Vegetation',
        'Crops',
        'Shrub',
        'Built Area',
        'Bare ground',
        'Snow',
        'Clouds',
      ],
    };
  }

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMap({
        center: [116, 27],
        zoom: 6.5,
        // center: [117, 35],
        // zoom: 5,
        // style: 'normal',
        style: 'dark',
        // style: 'blank',
      }),
    });
    this.scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json',
      )
        .then((res) => res.json())
        .then((maskData) => {
          const layer = new RasterLayer({
            mask: true,
            maskfence: maskData,
          });
          layer
            .source(
              // 'http://localhost:3333/tiles/{z}/{x}/{y}.tiff',
              'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
              // 'http://30.230.85.41:8081/tiles/{z}/{x}/{y}.tiff',
              // 'http://30.230.85.41:8080/tiles/{z}/{x}/{y}.tiff',
              {
                parser: {
                  type: 'rasterTile',
                  dataType: 'arraybuffer',
                  tileSize: 256,
                  // zoomOffset: 1,
                  // extent: [-180, -85.051129, 179, 85.051129],
                  // minZoom: 10,
                  // maxZoom: 0,
                  maxZoom: 13.1,
                  format: async (data: any) => {
                    const tiff = await GeoTIFF.fromArrayBuffer(data);
                    const image = await tiff.getImage();
                    const width = image.getWidth();
                    const height = image.getHeight();
                    const values = await image.readRasters();
                    // console.log(values[0]);
                    return { rasterData: values[0], width, height };
                  },
                },
              },
            )
            .style({
              // opacity: 0.6,
              domain: [0.001, 11.001],
              clampLow: false,
              // clampHigh: false,
              rampColors: {
                colors: [
                  '#419bdf', // Water
                  '#419bdf',

                  '#397d49', // Tree
                  '#397d49',

                  '#88b053', // Grass
                  '#88b053',

                  '#7a87c6', // vegetation
                  '#7a87c6',

                  '#e49635', // Crops
                  '#e49635',

                  '#dfc35a', // shrub
                  '#dfc35a',

                  '#c4281b', // Built Area
                  '#c4281b',

                  '#a59b8f', // Bare ground
                  '#a59b8f',

                  '#a8ebff', // Snow
                  '#a8ebff',

                  '#616161', // Clouds
                  '#616161',
                ],
                positions: [
                  0.0,
                  0.1, // Water
                  0.1,
                  0.2, // Tree
                  0.2,
                  0.3, // Grass
                  0.3,
                  0.4, // vegetation
                  0.4,
                  0.5,
                  0.5,
                  0.6,
                  0.6,
                  0.7,
                  0.7,
                  0.8,
                  0.8,
                  0.9,
                  0.9,
                  1.0,
                ],
              },
            })
            .select(true);

          this.scene.addLayer(layer);
          const land = [
            'Water',
            'Trees',
            'Grass',
            'Vegetation',
            'Crops',
            'Shrub',
            'Built Area',
            'Bare ground',
            'Snow',
            'Clouds',
          ];

          // layer.on('mousemove', (e) => {
          //   const popup = new Popup({
          //     offsets: [0, 0],
          //     closeButton: false,
          //   });
          //   popup
          //     .setLnglat(e.lngLat)
          //     .setHTML(` <span>${land[e.value - 1]} </span> `);

          //   this.scene.addPopup(popup);
          // });
        });
    });
  }

  public render() {
    return (
      <>
        <Legent
          colorList={this.state.colorList}
          positions={this.state.positions}
        />
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

function Legent(props: { colorList: string[]; positions: number[] }) {
  const { colorList, positions } = props;

  let data: any[] = [];

  colorList.map((color, index) => {
    data.push({
      color: color,
      text: positions[index],
    });
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: '10px',
        bottom: '30px',
        zIndex: 10,
      }}
    >
      {data.map(({ color, text }) => {
        return (
          <div
            style={{
              display: 'inline-block',
              background: '#fff',
              padding: '5px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                lineHeight: '12px',
              }}
            >
              {text}
            </div>
            <div
              style={{
                marginTop: '5px',
                width: '48px',
                height: '8px',
                background: color,
                border: '1px solid',
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
