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
// @ts-ignore
import * as GeoTIFF from 'geotiff';

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
      map: new GaodeMap({
        center: [105, 60],
        pitch: 0,
        style: 'normal',
        // style: 'blank',
        zoom: 4,
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
          // https://tiledimageservices.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Esri_2020_Land_Cover_V2/ImageServer/tile/7/28/193
          // self
          'https://alipay-cognition-dev.cn-hangzhou-alipay-b.oss-cdn.aliyun-inc.com/tile/tiff/landcover/{z}/{x}/{y}.tiff',
          // 'https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/{z}/{y}/{x}.tif',
          // 'http://rd1yhmrzc.hn-bkt.clouddn.com/Mapnik/{z}/{x}/{y}.png',
          {
            parser: {
              type: 'rasterTile',
              dataType: 'arraybuffer',
              tileSize: 256,
              zoomOffset: 0,
              extent: [-180, -85.051129, 179, 85.051129],
              minZoom: 0,
              // maxZoom: 0,
              // maxZoom: 10,
              format: async (data: any) => {
                // const blob: Blob = new Blob([new Uint8Array(data)], {
                //   type: 'image/png',
                // });
                // const img = await createImageBitmap(blob);
                // // @ts-ignore
                // ctx.clearRect(0, 0, 256, 256);
                // // @ts-ignore
                // ctx.drawImage(img, 0, 0, 256, 256);

                // 'https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/{z}/{y}/{x}.tif',
                const tiff = await GeoTIFF.fromArrayBuffer(data);
                const image = await tiff.getImage();
                const width = image.getWidth();
                const height = image.getHeight();
                const values = await image.readRasters();
                return { rasterData: values[0], width, height };

                // // 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                // // @ts-ignore
                // let imgData = ctx.getImageData(0, 0, 256, 256).data;
                // let arr = [];
                // for (let i = 0; i < imgData.length; i += 4) {
                //   const R = imgData[i];
                //   const G = imgData[i + 1];
                //   const B = imgData[i + 2];
                //   const d = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;
                //   arr.push(d);
                // }
                // // console.log(arr)
                // return {
                //   rasterData: arr,
                //   width: 256,
                //   height: 256,
                // };
              },
            },
          },
        )
        .style({
          domain: [0, 1014],
          clampLow: true,
          rampColors: {
            colors: [
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
          },
        })
        .select(true);

      this.scene.addLayer(layer);

      // let count = 0;
      // let colors = [
      //   [
      //     '#f7fcf5',
      //     '#e5f5e0',
      //     '#c7e9c0',
      //     '#a1d99b',
      //     '#74c476',
      //     '#41ab5d',
      //     '#238b45',
      //     '#006d2c',
      //     '#00441b',
      //   ],
      //   [
      //     '#fff5f0',
      //     '#fee0d2',
      //     '#fcbba1',
      //     '#fc9272',
      //     '#fb6a4a',
      //     '#ef3b2c',
      //     '#cb181d',
      //     '#a50f15',
      //     '#67000d'
      //   ],
      //   [
      //     '#f7fbff',
      //     '#deebf7',
      //     '#c6dbef',
      //     '#9ecae1',
      //     '#6baed6',
      //     '#4292c6',
      //     '#2171b5',
      //     '#08519c',
      //     '#08306b'
      //   ]
      // ]
      // setInterval(() => {
      //   const colorList = colors[count]
      //   this.setState({
      //     colorList: colorList
      //   })
      //   layer.style({
      //     rampColors: {
      //       colors: colorList,
      //       positions: [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0],
      //     },
      //   })
      //   this.scene.render()
      //   count++;
      //   if(count > colors.length - 1) {
      //     count = 0;
      //   }

      // }, 2000)
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
