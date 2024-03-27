// https://unpkg.com/xinzhengqu@1.0.0/data/2023_xian.pbf

// @ts-ignore
import { PolygonLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import { RDBSource } from 'district-data';
import React, { useEffect } from 'react';

// import geobuf from 'geobuf';
// import Pbf from 'pbf';

export default () => {
  // @ts-ignore
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.4, 31.258134],
        zoom: 2,
        pitch: 0,
        style: 'normal',
        doubleClickZoom: false,
      }),
    });

    const source = new RDBSource({});
    source
      .getChildrenData({
        parentAdcode: 110000,
        parentLevel: 'city',
        childrenLevel: 'county',
      })
      .then((data) => {
        const fill = new PolygonLayer({
          autoFit: true,
        })
          .source(data)
          .shape('fill')
          .color('name', [
            '#a6cee3',
            '#1f78b4',
            '#b2df8a',
            '#33a02c',
            '#fb9a99',
            '#e31a1c',
            '#fdbf6f',
            '#ff7f00',
            '#cab2d6',
            '#6a3d9a',
            '#ffff99',
            '#b15928',
          ])
          .active(false);
        scene.addLayer(fill);
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
