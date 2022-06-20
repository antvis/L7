import * as React from 'react';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  PolygonLayer,
  Source,
  Popup,
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
        // center: [121.268, 30.3628],
        // center: [122.76391708791607, 43.343389123718815],
        center: [105, 30],
        // style: 'normal',
        style: 'dark',
        zoom: 5,
        zooms: [4, 19],
        // zoom: 13,
        // center: [-122.447303, 37.753574],
      }),
    });

    this.scene.on('loaded', () => {
      const tileSource = new Source(
        'http://localhost:3000/file.mbtiles/{z}/{x}/{y}.pbf',
        // 'http://localhost:3000/germany.mbtiles/{z}/{x}/{y}.pbf',
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 8,
            // extent: [-180, -85.051129, 179, 85.051129],
          },
        },
      );

      const linelayer = new LineLayer({
        zIndex: 1,
        featureId: 'NAME_CHN',
        sourceLayer: 'city', // woods hillshade contour ecoregions ecoregions2 city
      })
        .source(tileSource)
        .color('#00f')
        .size(0.5)
        .style({
          opacity: 0.6,
        });
      this.scene.addLayer(linelayer);

      const polygonlayer = new PolygonLayer({
        featureId: 'NAME_CHN',
        sourceLayer: 'city', // woods hillshade contour ecoregions ecoregions2 city
      })
        .source(tileSource)
        .color('#0ff')

        .style({
          opacity: 0.4,
        })
        .active(true);
      this.scene.addLayer(polygonlayer);
      const popup = new Popup({
        offsets: [0, 0],
        closeButton: false,
      }).setHTML(`<span></span>`);

      polygonlayer.on('mousemove', (e) => {
        console.log(e);
        const { feature, lngLat } = e;
        if (lngLat && feature.properties?.osm_id) {
          popup.setLnglat(lngLat);
          let context = `
          <span> OSM ID: ${feature.properties?.NAME_CHN}</span>
          `;
          if (feature.properties?.name) {
            context += `</br><span> Name: ${feature.properties?.name}</span>`;
          }
          popup.setHTML(context);
          this.scene.addPopup(popup);
        }
      });
      polygonlayer.on('mouseout', () => {
        popup.setLnglat([0, 0]);
        popup.setHTML(`<span></span>`);
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
