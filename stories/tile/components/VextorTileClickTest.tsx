// @ts-ignore
import { PointLayer, Scene, LineLayer, PolygonLayer, ILayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox, Map } from '@antv/l7-maps';
import * as React from 'react';
export default class GaodeMapComponent extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public currentSelectPID: number = -1;
  public alllayers: ILayer[] = [];
  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.11, 30.264701434772807],
        zoom: 14,
      }),
    });
  
      let layer = new PointLayer({}) 
      .source(
        [
          {
            lng: 120.111,
            lat: 30.264701434772807,
            pid: 1001
          },
          {
            lng: 120.111,
            lat: 30.2635,
            pid: 1002
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
      .color('#ff0')
      .size(15)

      let layer2 = new PointLayer({}) 
      .source(
        [
          {
            lng: 120.11,
            lat: 30.264701434772807,
            pid: 1001
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
      .color('#f00')
      .size(15)

      let layer3 = new PointLayer({}) 
      .source(
        [
          {
            lng: 120.11,
            lat: 30.266,
            pid: 1001
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
      .color('#0f0')
      .size(15)

    this.scene = scene;

    this.alllayers = [layer, layer2, layer3]

    scene.on('loaded', () => {
      scene.addLayer(layer3);
      scene.addLayer(layer2);
      scene.addLayer(layer);
      this.registAllLayers();
    });
   
  }

  public registAllLayers() {
      this.alllayers.map((layer: ILayer) => {
        layer.on('click', (e) => {
          // get current select pid
          let selectPID = this.getLayerPID(layer, e.featureId)
          if(selectPID !== this.currentSelectPID) {
            // handle restLayers select state
            this.handleRestLayerSelectState(layer, selectPID)
            // handle current layer
            layer.setSelect(e.featureId);
            this.currentSelectPID = selectPID;
          } else {
            // handle restLayers select state
            this.handleRestLayerSelectState(layer, selectPID)
            // handle current layer
            layer.setSelect(-1);
            this.currentSelectPID = -1;
          }
           
        })
      })
  }

  public handleRestLayerSelectState(layer: ILayer, selectPID: number) {
     // get rest layers
     let restLayers = this.getRestLayers(this.alllayers, layer);
     // set restLayers select state
     this.setRestLayersSelectState(restLayers, selectPID)
  }

  public setLayerSelectStateWithPID(layer: ILayer, featureId: number, selectPID: number) {
    if(selectPID !== this.currentSelectPID) {
      layer.setSelect(featureId)
    } else {
      layer.setSelect(-1)
    }
  }

  public setRestLayersSelectState(restLayers: ILayer[], selectPID: number) {
    restLayers.map((layer: ILayer) => {
      let layerSource = layer.getSource()
      let feature = this.getFeatureIdByPID(selectPID, layerSource.data.dataArray)[0]
      if(feature) {
        this.setLayerSelectStateWithPID(layer, feature._id, selectPID);
      } else {
        layer.setSelect(-1);
      }
    })
  }

  public getRestLayers(allLayers: ILayer[], currentLayer: ILayer) {
    return allLayers.filter((layer: any) => layer !== currentLayer);
  }

  public getLayerPID(layer: ILayer, featureId: number) {
    let layerSource = layer.getSource();
    let selectedFeature = layerSource.getFeatureById(featureId);
    // @ts-ignore
    return selectedFeature.pid;
  }

  public getFeatureIdByPID(PID: number, data: any) {
    return data.filter((d: any) => d.pid === PID)
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
