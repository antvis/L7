import {
  GaodeMap,
  LayerPopup,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Scene,
  // anchorType,
} from '@antv/l7';
import { circle, featureCollection, point } from '@turf/turf';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scene, setScene] = useState<Scene | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [popup, setPopup] = useState<LayerPopup | null>(null);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120.104697, 30.260704],
        pitch: 0,
        zoom: 15,
      }),
      // logoVisible: false,
    });
    newScene.on('loaded', () => {
      const pointLayer = new PointLayer({
        name: 'pointLayer',
      });
      pointLayer
        .source(
          featureCollection([
            point([120.105697, 30.260704], {
              name: '测试点1',
              lng: 120.104697,
              lat: 30.260704,
            }),
            point([120.103697, 30.260704], {
              name: '测试点1',
              lng: 120.104697,
              lat: 30.260704,
            }),
          ]),
        )
        .color('#ffffff')
        .size(10);

      const polygonLayer = new PolygonLayer({
        name: 'polygonLayer',
      });
      polygonLayer
        .source(
          featureCollection([
            circle([120.104697, 30.260704], 30, {
              units: 'meters',
              properties: {
                name: '测试点1',
                lng: 120.104697,
                lat: 30.260704,
              },
            }),
            circle([120.104697, 30.261715], 30, {
              units: 'meters',
              properties: {
                name: '测试点1',
                lng: 120.104697,
                lat: 30.260704,
              },
            }),
          ]),
        )
        .color('#ff0000')
        .size(10)
        .shape('circle');

      const lineString = new LineLayer({
        name: 'lineLayer',
      });
      lineString
        .source(
          featureCollection([
            {
              type: 'Feature',
              properties: {
                name: '测试线3',
              },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [120.103615, 30.262026],
                  [120.103172, 30.261771],
                  [120.102697, 30.261934],
                ],
              },
            },
          ]),
        )
        .size(6)
        .color('#00ff00');
      newScene.addLayer(pointLayer);
      newScene.addLayer(polygonLayer);
      newScene.addLayer(lineString);
      const newPopup = new LayerPopup({
        items: [
          {
            layer: 'pointLayer',
            fields: [
              {
                field: 'name',
                formatField: () => {
                  return '名称';
                },
              },
              'lng',
              'lat',
            ],
          },
          {
            layer: 'lineLayer',
            fields: ['name'],
          },
          {
            layer: 'polygonLayer',
            fields: ['name'],
          },
        ],
        trigger: 'mousemove',
      });
      newScene.addPopup(newPopup);
      setPopup(newPopup);
      setScene(newScene);
    });
  }, []);

  return (
    <>
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    </>
  );
};

export default Demo;
