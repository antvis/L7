import { PointLayer, Scene, LineLayer } from '@antv/l7';
import { GaodeMapV2 } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        center: [120, 30],
        // center: [122.692587367181758, 43.377451929339649],
        style: 'normal',
        zoom: 20,
        zooms: [0, 23]
      }),
    });
    
    this.scene = scene;
  
    scene.on('loaded', () => {
     
      let rect = new LineLayer()
      .source({
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [ 122.692587367181758, 43.377451929339649 ], [ 122.692587367181758, 43.377465856847415 ], [ 122.692574277855613, 43.377465856847415 ], [ 122.692574277855613, 43.377451929339649 ], [ 122.692587367181758, 43.377451929339649 ]
                ]
              ]
            }
          }
        ]
      })
      .shape('line')
      .size(2)
      .color('#f00')

      scene.addLayer(rect)
      const mapService = scene.getMapService()

      setTimeout(() => {
        
        scene.setCenter([ 122.692587367181758, 43.377451929339649 ])
          // @ts-ignore
          mapService.map.customCoords?.setCenter([
            122.692587367181758, 43.377451929339649
        ]);
        // @ts-ignore
        mapService.setCustomCoordCenter([122.692587367181758, 43.377451929339649]);
        rect.dataState.dataSourceNeedUpdate = true
      }, 2000)
      
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
        />
      </>
    );
  }
}
