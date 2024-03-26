### point - image
```tsx
import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
    useEffect(() => {
        const scene = new Scene({
            id: 'point_fillImage',
            renderer: process.env.renderer,
            map: new GaodeMap({
                style: 'light',
                center: [120, 30],
                pitch: 0,
                zoom: 14
            }),
        });

        scene.addImage(
            'marker',
            'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ'
          ).then(()=>{
            console.log(1111)
          })

        const pointLayer = new PointLayer({ })
        .source([{
            lng: 120, lat: 30,  name: 'marker'
        }], {
            parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
            },
        })
        .shape('circle')
        .color('red')
        .size(20)

        const pointLayer2 = new PointLayer({  })
        .source([{
            lng: 120, lat: 30, name: 'marker'
        }], {
            parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
            },
        })
        .shape('marker')
        .size(24)
        .active(true)
        .style({
            offsets:{
                field:'name',
                value: ()=>{
                    return [0,20]
                }
            }
            // raisingHeight: 100,
            // heightfixed: true
        })

                   
        scene.on('loaded', () => {
            scene.addLayer(pointLayer);
            scene.addLayer(pointLayer2);
        })
    }, [])
    return (
        <div
            id="point_fillImage"
            style={{
                height:'500px',
                position: 'relative'
            }}
        />
    );
}
```