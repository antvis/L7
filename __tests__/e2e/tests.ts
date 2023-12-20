/**
 * TODO: extract url from dumi md & tsx
 */
export const tests = {
    'point-circle': 'features/point/circle',
    'point-billboard': 'features/point/point-billboard',
    'point-column': 'features/point/point-column',
    'point-fill-image': 'features/point/point-fill-image',
    'point-normal-device': 'features/point/point-normal-device',
    'citybuilding-amap1': 'features/citybuilding/amap1',
    'line-arc-plane': 'features/line/line-arc-plane',
};

export const TestDemoList: Array<{
    type: string,
    demos: Array<{
        name: string;
        sleepTime?: number;
    }>
}> = [
        {
            type: 'Point',
            demos: [{
                name: "PointFill",
                sleepTime: 1

            }, {
                name: "PointImage",
                sleepTime: 1
            }]
        },
        {
            type: 'Line',
            demos: [
                {
                    name: 'arc'
                },
                {
                    name: 'flow'
                }
                ,
                {
                    name: 'arc'
                }
                ,
                {
                    name: 'dash'
                }
            ]

        },
        {
            type: 'Polygon',
            demos: [
                {
                    name: 'extrude'
                },
                {
                    name: 'fill'
                }
                ,
                {
                    name: 'ocean'
                }
                ,
                {
                    name: 'texture'
                }
                ,
                {
                    name: 'water'
                }
            ]

        },
        {
            type: 'HeatMap',
            demos: [
                {
                    name: 'grid'
                },
                {
                    name: 'hexagon'
                },
                {
                    name: 'normal'
                }
            ]
        },
        {
            type: 'Raster',
            demos: [{
                name: "tiff",
                sleepTime: 2
            }]
        }
    ]
