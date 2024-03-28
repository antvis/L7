// @ts-ignore
import { PolygonLayer, RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import { useEffect } from 'react';
import * as wktParser from 'wellknown';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',

      map: new Map({
        center: [113.270854, 23.141717],
        zoom: 5,
      }),
    });

    const url1 =
      'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
    const url2 =
      'https://tiles{1-3}.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
    const layer1 = new RasterLayer({
      zIndex: 1,
    }).source(url1, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
      },
    });

    const layer2 = new RasterLayer({
      zIndex: 1,
    }).source(url2, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
      },
    });
    fetch(
      'https://tiles.geovisearth.com/geo/v1/district/getDisRange?code=131024',
      {
        headers: {
          Authorization:
            'b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
        },
      },
    )
      .then((res) => res.text())
      .then((data) => {
        const feature = wktParser(data);
        const polygonLayer = new PolygonLayer({
          zIndex: 10,
          autoFit: true,
        })
          .source({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: feature,
              },
            ],
          })
          .shape('fill')
          .color('red')
          .style({
            opacity: 0.3,
          });
        const polygonLayer2 = new PolygonLayer({
          zIndex: 10,
          autoFit: true,
        })
          .source({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: feature,
              },
            ],
          })
          .shape('line')
          .color('red')
          .style({
            opacity: 1,
          });
        scene.addLayer(polygonLayer);
        scene.addLayer(polygonLayer2);
      });

    scene.on('loaded', () => {
      scene.addLayer(layer1);
      scene.addLayer(layer2);
      // scene.addLayer(layer3);
      // scene.addLayer(layer4);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
