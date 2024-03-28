import { ImageLayer, PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: { map: string; renderer: 'regl' | 'device' }) {
    const scene = new Scene({
        id: 'map',
        renderer: option.renderer,
        map: new allMap[option.map || 'Map']({
            style: 'light',
            center: [115.5268, 34.3628],
            zoom: 7,
        }),
    });
    scene.on('loaded', () => {
        const fill = new PolygonLayer().source({
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [-80.425, 46.437],
                                [-71.516, 46.437],
                                [-71.516, 37.936],
                                [-80.425, 37.936],
                                [-80.425, 46.437]
                            ]
                        ]
                    }
                }
            ]
        }

        ).shape('line').color('red').size(1).style({ opacity: 1 })
        const layer = new ImageLayer({
            autoFit: true
        });
        layer.source(
            'https://mdn.alipayobjects.com/huamei_gjo0cl/afts/img/A*vm_9S64uA0UAAAAAAAAAAAAADjDHAQ/original',

            {
                parser: {
                    type: 'image',
                    coordinates: [
                        [100.959388, 41.619522],
                        [101.229887, 41.572654],
                        [101.16971, 41.377836],
                        [100.900015, 41.424628],
                    ]
                },
            },
        );
        scene.addLayer(layer);
        scene.addLayer(fill);
        if (window['screenshot']) {
            window['screenshot']();
        }
    });
}
