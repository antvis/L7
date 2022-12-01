### point - circle
```tsx
import { PointLayer, Scene } from '@antv/l7';
import { GaodeMapV1 } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
    useEffect(() => {
        const scene = new Scene({
            id: 'point_circle',
            map: new GaodeMapV1({
                style: 'light',
                center: [120, 30],
                pitch: 0,
                zoom: 6.45,
            }),
        });
          const pointLayer = new PointLayer({})
            .source([{
                x: 120, y: 30
            }], {
                parser: {
                    type: 'json',
                    x: 'x',
                    y: 'y',
                },
            })
            .shape('circle')
            .size(16)
            .active(true)
            .select({
                color: 'red',
            })
            .color('#f00')
            .style({
                opacity: 1,
                strokeWidth: 0,
                stroke: '#fff',
            });
                    
        scene.on('loaded', () => {
           scene.addLayer(pointLayer);
        })
    }, [])
    return (
        <div
            id="point_circle"
            style={{
                height:'500px',
                position: 'relative'
            }}
        />
    );
}

```