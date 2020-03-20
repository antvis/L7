import { LineLayer, PointLayer, PolygonLayer, Popup, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
const createGeoJSONRect = (
  point1: [number, number],
  point2: [number, number],
) => {
  const minX = Math.min(point1[0], point2[0]);
  const minY = Math.min(point1[1], point2[1]);
  const maxX = Math.max(point1[0], point2[0]);
  const maxY = Math.max(point1[1], point2[1]);

  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [minX, minY],
                [minX, maxY],
                [maxX, maxY],
                [maxX, minY],
                [minX, minY],
              ],
            ],
          },
        },
      ],
    },
  };
};
export default class MultiPolygon extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        pitch: 0,
        style: 'normal',
        center: [121.775374, 31.31067],
        zoom: 15,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      let startPoint = {};
      const circleLayer = new PolygonLayer()
        .source({
          type: 'FeatureCollection',
          features: [],
        })
        .color('#fbb03b')
        .shape('fill')
        .style({
          opacity: 0.6,
        });
      scene.addLayer(circleLayer);
      scene.on('panstart', (e: any) => {
        // @ts-ignore
        scene.map.dragPan.disable();
        startPoint = e.lngLat;
        const layer = new PointLayer()
          .source([startPoint], {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .shape('circle')
          .color('#fbb03b')
          .size(5)
          .style({
            stroke: '#fff',
            strokeWidth: 2,
          });
        scene.addLayer(layer);
      });
      scene.on('panmove', (e: any) => {
        // @ts-ignore
        const start = [startPoint.lng, startPoint.lat];

        const circleData = createGeoJSONRect(start as [number, number], [
          e.lngLat.lng,
          e.lngLat.lat,
        ]);
        circleLayer.setData(circleData.data);
        // const popup = new Popup().setText(`${dis}`).setLnglat(e.lngLat);
        // scene.addPopup(popup);
      });
      scene.on('panend', (e: any) => {
        // @ts-ignore
        scene.map.dragPan.enable();
      });
    });
  }

  public render() {
    return (
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
    );
  }
}
