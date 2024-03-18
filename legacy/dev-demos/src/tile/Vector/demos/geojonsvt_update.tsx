// @ts-ignore
import { PolygonLayer, Scene, Source } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'geojsonvt',

      map: new GaodeMap({
        center: [121.268, 30.3628],
        pitch: 0,
        zoom: 1,
      }),
    });

    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/2b7aae6e-5f40-437f-8047-100e9a0d2808.json',
    )
      .then((d) => d.json())
      .then((data) => {
        const source = new Source(data, {
          parser: {
            type: 'geojsonvt',
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 9,
          },
        });

        const polygon = new PolygonLayer({
        //   featureId: 'COLOR',
        })
          .source(source)
          .color('red')
          .shape('fill')
          // .active(true)
          .select(true)
          .style({
            opacity: 1,
          });
        scene.addLayer(polygon);
        setTimeout(async () => {
          const newData = await fetch(
            'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
          ).then((d) => d.json());

          source.setData(newData);
        }, 5000);
      });
  }, []);
  return (
    <div
      id="geojsonvt"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
