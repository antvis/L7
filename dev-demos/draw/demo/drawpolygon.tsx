import { Marker, PointLayer, Scene } from '@antv/l7';
import { DrawEvent, DrawPoint } from '@antv/l7-draw';
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect, useState } from 'react';

const id = String(Math.random());

const Demo: React.FC = () => {
  const [, setLineDrawer] = useState<DrawPoint | null>(null);

  useEffect(() => {
    const scene = new Scene({
      id,
      map: new Mapbox({
        center: [116.39153415221631, 39.90678816789074],
        pitch: 0,
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 22,
        token:
          'pk.eyJ1IjoibW9ob25nIiwiYSI6ImNrNGFsdjY5ZzA1NW4zbG14b2JoMnA5c3IifQ.1qVWFsyHW2wKThTgQg08SA',
      }),
    });

    scene.on('loaded', () => {
      const point = new PointLayer()
        .source({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                coordinates: [116.39153415221631, 39.90678816789074],
                type: 'Point',
              },
            },
          ],
        })
        .color('red')
        .shape('circle')
        .size(5);

      const marker = new Marker().setLnglat({
        lng: 116.39153415221631,
        lat: 39.90678816789074,
      });
      scene.addMarker(marker);
      scene.addLayer(point);
      const drawer = new DrawPoint(scene, {
        // liveUpdate: true,
      });
      scene.on('zoomend', () => {
        console.log(scene.getZoom());
      });

      setLineDrawer(drawer);
      drawer.enable();
      drawer.on(DrawEvent.Add, (newPoint, pointList) => {
        console.log('add', newPoint, pointList);
      });
    });
  }, []);

  return (
    <div>
      <div id={id} style={{ height: 400, position: 'relative' }} />
    </div>
  );
};

export default Demo;
