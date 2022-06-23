import * as React from 'react';
import * as turf from '@turf/turf';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  MaskLayer,
} from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

export default class RasterTile extends React.Component<
  any,
  { colorList: string[]; positions: number[] }
> {
  private scene: Scene;

  constructor(props: any) {
    super(props);
    this.state = {
      colorList: [
        '#f7fcf5',
        '#e5f5e0',
        '#c7e9c0',
        '#a1d99b',
        '#74c476',
        '#41ab5d',
        '#238b45',
        '#006d2c',
        '#00441b',
      ],
      positions: [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0],
    };
  }

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [130, 30],
        pitch: 0,
        // style: 'normal',
        style: 'dark',
        // style: 'blank',
        zoom: 2,
      }),
    });
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    this.scene.on('loaded', () => {
      const layer = new RasterLayer();
      layer
        .source(
          // 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          // 'https://api.mapbox.com/raster/v1/mapbox.mapbox-terrain-dem-v1/{zoom}/{x}/{y}.pngraw?sku=YOUR_MAPBOX_SKU_TOKEN&access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ',
          // 'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ',
          // 'https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/{z}/{y}/{x}.tif',
          // 'http://rd1yhmrzc.hn-bkt.clouddn.com/Mapnik/{z}/{x}/{y}.png',
          'http://localhost:3333/Mapnik/{z}/{x}/{y}.png',
          {
            parser: {
              type: 'rasterTile',
              dataType: 'arraybuffer',
              tileSize: 256,
              zoomOffset: 1,
              // extent: [-180, -85.051129, 179, 85.051129],
              minZoom: 1,
              // maxZoom: 0,
              maxZoom: 7,
              format: async (data: any) => {
                const blob: Blob = new Blob([new Uint8Array(data)], {
                  type: 'image/png',
                });
                const img = await createImageBitmap(blob);
                // @ts-ignore
                ctx.clearRect(0, 0, 256, 256);
                // @ts-ignore
                ctx.drawImage(img, 0, 0, 256, 256);

                // @ts-ignore
                let imgData = ctx.getImageData(0, 0, 256, 256).data;
                let arr = [];
                for (let i = 0; i < imgData.length; i += 4) {
                  const R = imgData[i];
                  arr.push(R);
                }
                return {
                  rasterData: arr,
                  width: 256,
                  height: 256,
                };
              },
            },
          },
        )
        .style({
          // opacity: 0.6,
          domain: [25, 160],
          clampLow: false,
          // clampHigh: false,
          rampColors: {
            colors: [
              '#2b9348',
              '#55a630',
              '#80b918',
              '#aacc00',
              '#bfd200',
              '#d4d700',
              '#dddf00',
              '#eeef20',
              '#ffff3f',
              // '#ffffcc',
              // '#ff0',
            ],
            positions: [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0],
            // positions: [0,  1]
          },
        })
        .select(true);

      this.scene.addLayer(layer);
    });
  }

  public render() {
    return (
      <>
        {/* <Legent
          colorList={this.state.colorList}
          positions={this.state.positions}
        /> */}
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
                width: '30px',
                height: '8px',
                background: color,
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
