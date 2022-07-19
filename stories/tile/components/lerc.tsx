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
// @ts-ignore
import * as Lerc from 'lerc';

export default class RasterTile extends React.Component<
  any,
  { colorList: string[]; positions: number[] }
> {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      map: new Map({
        center: [120, 30],
        pitch: 0,
        // style: 'normal',
        style: 'blank',
        zoom: 3,
        // zooms: [4, 19]
      }),
    });

    this.scene.on('loaded', () => {
      const layer = new RasterLayer();
      layer
        .source(
          // 'https://alipay-cognition-dev.cn-hangzhou-alipay-b.oss-cdn.aliyun-inc.com/tile/tiff/landcover/{z}/{x}/{y}.tiff',
          // 'https://tiledimageservices.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Esri_2020_Land_Cover_V2/ImageServer/tile/{z}/{y}/{x}',
          'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}',

          {
            parser: {
              type: 'rasterTile',
              dataType: 'arraybuffer',
              tileSize: 256,
              zoomOffset: 0,
              // extent: [-180, -85.051129, 179, 85.051129],
              // minZoom: 5,
              // maxZoom: 10,
              // maxZoom: 10,
              format: async (data: any) => {
                // console.log(data);
                // 'https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/{z}/{y}/{x}.tif',
                // const tiff = await GeoTIFF.fromArrayBuffer(data);
                // const image = await tiff.getImage();
                // const width = image.getWidth();
                // const height = image.getHeight();
                // const values = await image.readRasters();
                // return { rasterData: values[0], width, height };
                // Lerc.decode(data, {
                //   // inputOffset: 10, // start from the 10th byte (default is 0)
                //   // pixelType: "U8", // only needed for lerc1 (default is F32)
                //   // returnPixelInterleavedDims: false // only applicable to n-dim lerc2 blobs (default is false)
                // });
                const image = Lerc.decode(data);
                return {
                  rasterData: image.pixels[0],
                  width: image.width,
                  height: image.height,
                };
              },
            },
          },
        )
        .style({
          // opacity: 0.5,
          domain: [0, 1024],
          // domain: [0, 10],
          // clampLow: true,
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
    });
  }

  public render() {
    return (
      <>
        {/* <Legent colorList = {this.state.colorList} positions = {this.state.positions}/> */}
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
