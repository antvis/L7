### point wave
```tsx
import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
    useEffect(() => {
        const scene = new Scene({
            id: 'point_wave',
            map: new GaodeMapV2({
                style: 'light',
                center: [120, 30],
                pitch: 60,
                zoom: 14
            }),
        });
        const pointLayer = new PointLayer()
        .source([{
            lng: 120, lat: 30
        }], {
            parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
            },
        })
        .shape('circle')
        .size(36)
        .active(true)
        .select({
            color: 'red',
        })
        .color('red')
        .animate(true)

        const pointLayer2 = new PointLayer()
        .source([{
            lng: 120, lat: 30
        }], {
            parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
            },
        })
        .shape('circle')
        .size(36)
        .active(true)
        .select({
            color: 'red',
        })
        .color('red')
        .animate(true)
        .style({
            raisingHeight: 200,
            heightfixed: true
        })

                   
        scene.on('loaded', () => {
            scene.addLayer(pointLayer);
            scene.addLayer(pointLayer2);
        })
    }, [])
    return (
        <div
            id="point_wave"
            style={{
                height:'500px',
                position: 'relative'
            }}
        />
    );
}

```