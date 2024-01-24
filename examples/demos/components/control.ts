import { Scene, Zoom,PointLayer } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: {
    map: string
    renderer: 'regl' | 'device'
}) {

    const scene = new Scene({
        id: 'map',
      renderer: option.renderer,
        map: new allMap[option.map || 'Map']({
            style: 'dark',
            center: [121.46552,31.223009],
            zoom: 19
        })
    });

    fetch(
        'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const imageLayerText = new PointLayer()
            .source([{
                longitude:121.46552,
                latitude:31.223009

            }], {
              parser: {
                type: 'json',
                x: 'longitude',
                y: 'latitude',
              },
            })
            .shape('circle')
            .color('#f00')
            .size(10)
            .style({
                opacity: 0.8
            })
          scene.addLayer(imageLayerText);

        })

    const newControl = new Zoom({
        showZoom: true,
      });
    scene.addControl(newControl);
    // @ts-ignore
    window.scene = scene;
    scene.on('loaded',()=>{
        console.log(scene.getZoom())
    })
   

}
