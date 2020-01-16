// @ts-ignore
import { Marker, MarkerLayer, PolygonLayer, Scene } from '@antv/l7';
import { Mapbox, GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
export default class ClusterMarkerLayer extends React.Component {
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
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
    );
    const nodes = await response.json();
    const markerLayer = new MarkerLayer({
      cluster: true,
    });
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'dark',
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 3,
      }),
    });
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < nodes.features.length; i++) {
      const { coordinates } = nodes.features[i].geometry;
      const marker = new Marker().setLnglat({
        lng: coordinates[0],
        lat: coordinates[1],
      });
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
