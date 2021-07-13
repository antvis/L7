import { MarkerLayer, Marker, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_clustermarker extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    // this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 3,
      }),
    });

    scene.on('loaded', () => {
      addMarkers();
      scene.render();
    });
    function addMarkers() {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
      )
        .then((res) => res.json())
        .then((nodes) => {
          const markerLayer = new MarkerLayer({
            cluster: true,
          });
          for (let i = 0; i < nodes.features.length; i++) {
            const { coordinates } = nodes.features[i].geometry;
            const marker = new Marker().setLnglat({
              lng: coordinates[0],
              lat: coordinates[1],
            });
            markerLayer.addMarker(marker);
          }
          scene.addMarkerLayer(markerLayer);
        });
    }
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
        />
      </>
    );
  }
}
