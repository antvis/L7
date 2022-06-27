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
  PolygonLayer,
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
      // stencil: true,
      map: new GaodeMap({
        center: [121, 29.4],
        // pitch: 60,
        // style: 'normal',
        zoom: 6.5,

        // center: [105, 60],
        // pitch: 0,
        // style: 'dark',
        style: 'blank',
        // zoom: 5,
      }),
    });
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    this.scene.on('loaded', () => {
      fetch(
        // 'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
        'https://gw.alipayobjects.com/os/bmw-prod/ecd1aaac-44c0-4232-b66c-c0ced76d5c7d.json',
      )
        .then((res) => res.json())
        .then((data) => {
          // const provincelayer = new LineLayer({})
          //   .source(data)
          //   .size(-300000)
          //   .shape('wall')
          //   .color('#0DCCFF')
          //   .style({
          //     // opacity: 0.8,
          //     heightfixed: true,
          //     sourceColor: 'rgb(0,109,44)',
          //     targetColor: 'rgb(229,245,224)',
          //   });
          // this.scene.addLayer(provincelayer);

          const layer = new RasterLayer({
            mask: true,
            maskfence: data,
          });
          layer
            .source(
              // 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
              // 'https://api.mapbox.com/raster/v1/mapbox.mapbox-terrain-dem-v1/{zoom}/{x}/{y}.pngraw?sku=YOUR_MAPBOX_SKU_TOKEN&access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ',
              'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ',
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

                    // @ts-ignore
                    let imgData = ctx.getImageData(0, 0, 256, 256).data;
                    let arr = [];
                    for (let i = 0; i < imgData.length; i += 4) {
                      const R = imgData[i];
                      const G = imgData[i + 1];
                      const B = imgData[i + 2];
                      const d = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;
                      arr.push(d);
                    }
                    // console.log(arr)
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
              domain: [0, 512],
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

          layer.on('mousemove', (e) => {
            const popup = new Popup({
              offsets: [0, 0],
              closeButton: false,
            });
            popup
              .setLnglat(e.lngLat)
              .setHTML(` <span>$当前海拔为 ${e.value} 米</span> `);

            this.scene.addPopup(popup);
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
        >
          {/* <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100px',
            height: '100px',
            background: '#fff',
            zIndex: 10
            // @ts-ignore
          }}>{this.state.text}</div> */}
        </div>
      </>
    );
  }
}
