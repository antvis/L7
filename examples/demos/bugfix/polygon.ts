import { Scene, PolygonLayer } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: {
    map: string
    renderer: 'regl' | 'device'
}) {
    const data = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              base_height: 100,
            },
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [119.948198, 30.339818],
                  [120.344273, 30.513865],
                  [120.414729, 30.288859],
                  [120.346177, 30.160522],
                  [120.100535, 30.041909],
                  [119.906306, 30.094644],
                  [119.845646, 30.175339],
                  [119.81137, 30.244454],
                  [119.807562, 30.352965],
                  [119.948198, 30.339818]
                ]
              ]
            }
          }
        ]
      }
    const scene = new Scene({
        id: 'map',
      renderer: option.renderer,
        map: new allMap[option.map || 'Map']({
            style: 'light',
            center: [120.100535, 30.51909],
            zoom: 14.83
        })
    });
    scene.on('loaded', () => {
    const layer = new PolygonLayer({
        autoFit: true,
      })
        .source(data)
        .shape('fill')
        .active(true)
        .color('red');
        scene.addLayer(layer);
    })
        // @ts-ignore
        // window.scene = scene;
    // layer.on('inited', (e: any) => { 

    //   console.log(layer.styleAttributeService.getLayerStyleAttribute('position'))
    // });
   

}
