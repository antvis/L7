// @ts-ignore
import { PolygonLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as React from 'react';
import mapboxgl from 'mapbox-gl';

export default class MapboxInstance extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    mapboxgl.accessToken =
      'pk.eyJ1IjoibHp4dWUiLCJhIjoiY2tvaWZuM2s4MWZuYjJ1dHI5ZGduYTlrdiJ9.DQCfMRbZzx0VSwecQ69McA';
    // pk.eyJ1IjoibHp4dWUiLCJhIjoiY2tvaWZuM2s4MWZuYjJ1dHI5ZGduYTlrdiJ9.DQCfMRbZzx0VSwecQ69McA
    const map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        mapInstance: map,
      }),
    });
    this.scene = scene;
    const layer = new PolygonLayer({});

    layer
      .source(await response.json())
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', () => {
        return 'red';
      })
      .shape('fill')
      .style({
        opacity: 0.8,
      });
    scene.addLayer(layer);
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
