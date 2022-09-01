import { Scene, LineLayer } from '@antv/l7';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map } from '@antv/l7-leaflet';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        pitch: 0,
        center: [112, 37.8],
        zoom: 3,
      }),
    });
    scene.on('loaded', () => {
      console.log('loaded');
      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt',
      )
        .then((res) => res.text())
        .then((data) => {
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(scene.map);

          L.marker([37.8, 112])
            .addTo(scene.map)
            .setIcon(
              new L.Icon({
                iconUrl:
                  'https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*6ONoRKNECC0AAAAAAAAAAAAAARQnAQ',
                iconSize: [16, 16],
              }),
            )
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();
          const layer = new LineLayer({})
            .source(data, {
              parser: {
                type: 'csv',
                x: 'lng1',
                y: 'lat1',
                x1: 'lng2',
                y1: 'lat2',
              },
            })
            .size(1)
            .shape('arc')
            .color('#8C1EB2')
            .style({
              opacity: 0.8,
              blur: 0.99,
            });
          console.log(scene);
          scene.addLayer(layer);
        });
    });

    return () => {
      scene.destroy();
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
