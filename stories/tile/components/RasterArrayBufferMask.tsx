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

export default class RasterTile extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      stencil: true,
      map: new Mapbox({
        center: [100, 30],
        pitch: 0,
        // style: 'normal',
        style: 'blank',
        zoom: 4,
      }),
    });
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    this.scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new RasterLayer({
            mask: true,
            maskfence: data,
          });
          layer
            .source(
              'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
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
                    const blob: Blob = new Blob([new Uint8Array(data)], {
                      type: 'image/png',
                    });
                    const img = await createImageBitmap(blob);
                    // @ts-ignore
                    ctx.clearRect(0, 0, 256, 256);
                    // @ts-ignore
                    ctx.drawImage(img, 0, 0, 256, 256);

                    // 'https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/{z}/{y}/{x}.tif',
                    // const tiff = await GeoTIFF.fromArrayBuffer(data);
                    // const image = await tiff.getImage();
                    // const width = image.getWidth();
                    // const height = image.getHeight();
                    // const values = await image.readRasters();
                    // return { rasterData: values[0], width, height };

                    // 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                    // @ts-ignore
                    let imgData = ctx.getImageData(0, 0, 256, 256).data;
                    let arr = [];
                    for (let i = 0; i < imgData.length; i += 4) {
                      arr.push(imgData[i]);
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
              opacity: 1,
              domain: [0, 256],
              clampLow: true,
              rampColors: {
                colors: [
                  // 'rgb(166,97,26)',
                  // 'rgb(223,194,125)',
                  // 'rgb(245,245,245)',
                  // 'rgb(128,205,193)',
                  // 'rgb(1,133,113)',

                  'rgb(0,0,255)',
                  'rgb(0,0,0)',
                  'rgb(0,255,0)',
                  'rgb(255,0,0)',
                  'rgb(255,0,0)',
                ],
                positions: [0, 0.25, 0.5, 0.75, 1.0],
              },
            })
            .select(true);

          this.scene.addLayer(layer);

          layer.on('click', (e) => {
            console.log('click');
            // console.log(e.pickedColors)
            console.log(e);
          });
          // layer.on('mousemove', (e) => console.log(e.value));

          // setTimeout(() => {
          //   layer.style({
          //     rampColors: {
          //       colors: [
          //         // 'rgb(166,97,26)',
          //         // 'rgb(223,194,125)',
          //         // 'rgb(245,245,245)',
          //         // 'rgb(128,205,193)',
          //         // 'rgb(1,133,113)',

          //         'rgb(0,0,0)',
          //         'rgb(0,0,0)',
          //         'rgb(0,245,0)',
          //         'rgb(255,0,0)',
          //         'rgb(255,0,0)',
          //       ],
          //       positions: [0, 0.25, 0.5, 0.75, 1.0],
          //     },
          //   });
          //   this.scene.render();
          // }, 3000);
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
