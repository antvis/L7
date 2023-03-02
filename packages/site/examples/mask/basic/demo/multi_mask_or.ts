// @ts-ignore
import { Scene, RasterLayer, Source, PolygonLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

const scene = new Scene({
    id: 'map',

    map: new Map({
        center: [110, 30],
        // zoom: 12,
        zoom: 3,
    }),
});
const worldSource = new Source('https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
    {
        parser: {
            type: 'mvt',
            tileSize: 256,
            maxZoom: 9,
            extent: [-180, -85.051129, 179, 85.051129],
        },
    })
const maskData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [
                    [
                        [
                            99.70402975806178,
                            36.598520593127276
                        ],
                        [
                            99.70402975806178,
                            23.990050715201292
                        ],
                        [
                            114.1889649431626,
                            23.990050715201292
                        ],
                        [
                            114.1889649431626,
                            36.598520593127276
                        ],
                        [
                            99.70402975806178,
                            36.598520593127276
                        ]
                    ]
                ],
                "type": "Polygon"
            }
        }
    ]
};
const maskData2 = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [
                    [
                        [
                            109.50019979654019,
                            32.46162165361247
                        ],
                        [
                            125.99460575876572,
                            29.37353862575138
                        ],
                        [
                            127.50170884160855,
                            39.24004564990585
                        ],
                        [
                            114.69133263744305,
                            41.22139040282963
                        ],
                        [
                            109.50019979654019,
                            32.46162165361247
                        ]
                    ]
                ],
                "type": "Polygon"
            }
        }
    ]
}
const maskData3 = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates": [
                    [
                        [
                            111.67712647175739,
                            27.533314060876805
                        ],
                        [
                            131.7718342429976,
                            27.533314060876805
                        ],
                        [
                            131.7718342429976,
                            34.55577879114256
                        ],
                        [
                            111.67712647175739,
                            34.55577879114256
                        ],
                        [
                            111.67712647175739,
                            27.533314060876805
                        ]
                    ]
                ],
                "type": "Polygon"
            }
        }
    ]
}

const maskLayer1 = new PolygonLayer({
    visible: true,
    maskOperation: 'or',
    zIndex: 14,
}).source(maskData).shape('fill').color('#f00').style({ opacity: 0.4 });
const maskLayer2 = new PolygonLayer({ visible: true, maskOperation: 'or', zIndex: 14 }).source(maskData2).shape('fill').color('#f00').style({ opacity: 0.4 });
const maskLayer3 = new PolygonLayer({ visible: true, maskOperation: 'or', zIndex: 14 }).source(maskData3).shape('fill').color('#f00').style({ opacity: 0.4 });


const layer = new RasterLayer({
    zIndex: 1,
    maskLayers: [maskLayer1, maskLayer2,maskLayer3],
    enableMask: true,
    maskInside: true,
    maskOperation: 'or',
}).source(
    'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
    {
        parser: {
            type: 'rasterTile',
            tileSize: 256,
        },
    },
).style({
    opacity: 1
});

scene.on('loaded', () => {

    scene.addLayer(layer);
    scene.addLayer(maskLayer1);
    scene.addLayer(maskLayer2);
    scene.addLayer(maskLayer3);

});
