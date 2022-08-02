// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { PointLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 4,
      }),
    });

    const layer = new PointLayer({
      featureId: 'COLOR',
      sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
    });
    layer
      .source(
        'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 9,
            extent: [-180, -85.051129, 179, 85.051129],
          },
        },
      )
      .shape('NNH_NAME', 'text')
      .color('COLOR')
      .size(12)
      .style({
        stroke: '#00f',
        strokeWidth: 1,
        textAllowOverlap: false,
      });

    scene.on('loaded', () => {
      scene.addLayer(layer);
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
      ></div>
    );
  }
}
