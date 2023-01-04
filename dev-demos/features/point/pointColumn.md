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
          
                    
        scene.on('loaded', () => {
           scene.addLayer(pointLayer);
        //    scene.render();
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