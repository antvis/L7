import { LineLayer, PointLayer, PolygonLayer, Popup, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { lnglatDistance } from '@antv/l7-utils';
// import turfCircle from '@turf/circle';
import * as React from 'react';
const createGeoJSONCircle = (
  center: [number, number],
  radiusInKm: number,
  points: number = 64,
) => {
  const options = { steps: 64 };
  // const circle = turfCircle(center, radiusInKm, options);

  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
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
      scene.on('dragstart', (e: any) => {
        // @ts-ignore
        scene.map.dragdrag.disable();
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
      scene.on('drag', (e: any) => {
        // @ts-ignore
        const start = [startPoint.lng, startPoint.lat];
        const dis = lnglatDistance(
          // @ts-ignore
          start,
          [e.lngLat.lng, e.lngLat.lat],
        );
        const circleData = createGeoJSONCircle(
          start as [number, number],
          dis / 1000,
        );
        circleLayer.setData(circleData.data);
        const popup = new Popup().setText(`${dis}`).setLnglat(e.lngLat);
        scene.addPopup(popup);
      });
      scene.on('dragend', (e: any) => {
        // @ts-ignore
        scene.map.dragdrag.enable();
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
