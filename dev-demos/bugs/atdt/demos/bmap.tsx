import {PointLayer, Scene, TdtMap} from '@antv/l7';
// tslint:disable-next-line:no-duplicate-imports
import {FunctionComponent, useEffect} from 'react';

const Demo: FunctionComponent = () => {
  useEffect(() => {
    // const bmap = new BMapGL.Map('map');
    // const point = new BMapGL.Point(121.30654632240122, 31.25744185633306);
    // bmap.centerAndZoom(point, 3);
    // let marker1 = new BMapGL.Marker(new BMapGL.Point(116.404, 39.925));
    // bmap.addOverlay(marker1);

    const newScene = new Scene({
      id: 'map',
      map: new TdtMap({}),
    });

    newScene.on('loaded', () => {
      const pointLayer = new PointLayer({})
        .source(
          [
            {
              lng: 120,
              lat: 30,
              name: 'marker',
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
        .color('red')
        .size(20);
      newScene.addLayer(pointLayer);
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

export default Demo;
