import * as React from 'react';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  PolygonLayer,
  Source,
} from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

export default class RasterTile extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMap({
      // map: new Mapbox({
        center: [120, 30],
        style: 'blank',
        zoom: 6,
        zooms: [0, 25],
        maxZoom: 25,
      }),
    });

    this.scene.on('loaded', () => {
      const point = new PointLayer({ zIndex: 7 })
        .source(
          [
            {
              lng: 120,
              lat: 30,
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
        .color('#ff0')
        // .active(true)
        .select(true)
        .size(10);

      this.scene.addLayer(point);
      function getRandomColor() {
        let r = Math.floor(Math.random() * 10);
        let g = Math.floor(Math.random() * 10);
        let b = Math.floor(Math.random() * 10);
        return '#' + r + g + b;
      }
      const colors = {};

      const tileSource = new Source(
        'http://localhost:3000/file.mbtiles/{z}/{x}/{y}.pbf',
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 9,
            extent: [-180, -85.051129, 179, 85.051129],
          },
        },
      );

      const linelayer = new LineLayer({
        // zIndex: 1,
        featureId: 'NAME_CHN',
        sourceLayer: 'city', // woods hillshade contour ecoregions ecoregions2 city
      })
        .source(tileSource)
        .color('#f00')
        .size(1)
        .style({
          opacity: 0.5,
        });
      this.scene.addLayer(linelayer);

      const polygonlayer = new PolygonLayer({
        featureId: 'NAME_CHN',
        sourceLayer: 'city', 
      })
        .source(tileSource)
        .color('citycode', (v: string) => {
          // @ts-ignore
          if (colors[v]) {
            // @ts-ignore
            return colors[v];
          } else {
            let color = getRandomColor();
            // @ts-ignore
            colors[v] = color;
            return color;
          }
        })
        .style({
          opacity: 0.4,
        })
        .select(true);
      this.scene.addLayer(polygonlayer);

      const pointlayer = new PointLayer({
        featureId: 'NAME_CHN',
        sourceLayer: 'city',
      })
        .source(tileSource)
        .shape('NAME_CHN', 'text')
        .color('#f00')
        .size(12)
        .style({
          stroke: '#fff',
          strokeWidth: 2,
        });

      this.scene.addLayer(pointlayer);
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
