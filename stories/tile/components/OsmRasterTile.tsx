import * as React from 'react';
import * as turf from '@turf/turf';
import { RasterLayer, Scene, LineLayer, ILayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

export default class OsmRasterTile extends React.Component {
  private scene: Scene;
  private gridLayer: ILayer;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  private updateGridLayer = () => {
    const bounds = this.scene['mapService'].getBounds();
    const bbox = [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]];
    // console.log('bbox: ', bbox);
    const poly = turf.bboxPolygon(bbox as [number, number, number, number]);
    const data = { type: 'FeatureCollection', features: [poly] };

    if (this.gridLayer) {
      this.gridLayer.setData(data);
      return;
    }
    this.gridLayer = new LineLayer({ autoFit: false, zIndex: 10 })
      .source(data)
      .size(2)
      .color('red')
      .shape('line');
    this.scene.addLayer(this.gridLayer);
  };

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      map: new Map({
        center: [130, 30],
        pitch: 0,
        style: 'normal',
        zoom: 1.5,
      }),
    });

    // this.scene.on('mapchange', this.updateGridLayer);

    this.scene.on('loaded', () => {
      const layer = new RasterLayer({}).source(
        // 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        'http://t1.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=6557fd8a19b09d6e91ae6abf9d13ccbd',
        // 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        // 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        // 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        // 'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ',
        // 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
        // 'https://a.tile.osm.org/{z}/{x}/{y}.png',
        // 'https://t1.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=6557fd8a19b09d6e91ae6abf9d13ccbd',
        // 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
        {
          parser: {
            type: 'rasterTile',
            tileSize: 256,

            zoomOffset: 0,
            updateStrategy: 'overlap',
          },
        },
      );

      this.scene.addLayer(layer);

      // 注记服务
      const annotionLayer = new RasterLayer({
        zIndex: 2,
      });
      annotionLayer.source(
        'https://t1.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=6557fd8a19b09d6e91ae6abf9d13ccbd',
        {
          parser: {
            type: 'rasterTile',
          },
        },
      );

      this.scene.addLayer(annotionLayer);
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
