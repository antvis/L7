// @ts-nocheck
import React from 'react';
import {
  Scene,
  GaodeMap,
  GaodeMapV2,
  Mapbox,
  Map,
  PointLayer,
  Marker,
  MarkerLayer,
  Popup,
  HeatmapLayer,
  LineLayer,
} from '@antv/l7';

export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        // map: new GaodeMap({
        // map: new GaodeMapV2({
        // map: new Map({
        style: 'dark',
        center: [120, 30],
        zoom: 4,
      }),
    });

    this.scene = scene;

    const layer = new LineLayer()
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              color: '#0f0',
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [120, 40],
                [100, 30],
                [110, 20],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {
              color: '#f00',
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [130, 30],
                [100, 20],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {
              color: '#ff0',
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [100, 20],
                [130, 30],
              ],
            },
          },
        ],
      })
      .shape('halfLine')
      .size(20)
      .color('color')
      .active(true)
      .style({
        // opacity: 0.3,
        sourceColor: '#f00',
        targetColor: '#ff0',
        arrow: {
          enable: true,
          arrowWidth: 2,
          // arrowHeight: 3,
          // tailWidth: 0,
        },
      });

    scene.on('loaded', () => {
      scene.addLayer(layer);
      // console.log(scene.getMapService().lngLatToMercator([100, 30], 0))
    });
  }

  public render() {
    return (
      <>
        <div
          id="map"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        ></div>
      </>
    );
  }
}
