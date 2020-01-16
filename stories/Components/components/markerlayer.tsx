// @ts-ignore
import { Marker, MarkerLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
export default class MarkerLayerComponent extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    function getColor(v: number) {
      return v > 50
        ? '#800026'
        : v > 40
        ? '#BD0026'
        : v > 30
        ? '#E31A1C'
        : v > 20
        ? '#FC4E2A'
        : v > 10
        ? '#FD8D3C'
        : v > 5
        ? '#FEB24C'
        : v > 0
        ? '#FED976'
        : '#FFEDA0';
    }

    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/67f47049-8787-45fc-acfe-e19924afe032.json',
    );
    const nodes = await response.json();
    const markerLayer = new MarkerLayer();
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 3,
      }),
    });
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].g !== '1' || nodes[i].v === '') {
        continue;
      }
      const el = document.createElement('label');
      el.className = 'labelclass';
      el.textContent = nodes[i].v + '℃';
      el.style.background = getColor(nodes[i].v);
      el.style.borderColor = getColor(nodes[i].v);
      const marker = new Marker({
        element: el,
      }).setLnglat({ lng: nodes[i].x * 1, lat: nodes[i].y });
      markerLayer.addMarker(marker);
    }
    scene.addMarkerLayer(markerLayer);
    this.scene = scene;
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
