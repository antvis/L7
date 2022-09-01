import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LineLayer } from '@antv/l7';
import { L7Layer } from '@antv/l7-leaflet';

import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const map = L.map('map').setView([30, 112], 3);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([30, 112])
      .addTo(map)
      .setIcon(
        new L.Icon({
          iconUrl:
            'https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*6ONoRKNECC0AAAAAAAAAAAAAARQnAQ',
          iconSize: [16, 16],
        }),
      )
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();

    const l7layer = new L7Layer().addTo(map);
    const scene = l7layer.getScene();
    fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
      .then((res) => res.text())
      .then((data) => {
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
        scene.addLayer(layer);
      });
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
