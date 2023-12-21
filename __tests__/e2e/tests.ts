export const TestDemoList: Array<{
    type: string,
    demos: Array<{
        name: string;
        sleepTime?: number;
    }>
}> = [
        {
            type: 'Point',
            demos: [
                {
                    name:'billboard'
                },{
                    name:'column'
                },
                {
                    name:'fill_image'
                },
                {
                name: "fill",
                sleepTime: 1

            }, {
                name: "image",
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
                    name: 'arc_plane'
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
                    name: 'grid',
                    sleepTime: 2
                },
                {
                    name: 'hexagon',
                    sleepTime: 2
                },
                {
                    name: 'normal',
                    sleepTime: 2
                }
            ]
        },
        {
            type: 'Raster',
            demos: [{
                name: "tiff",
                sleepTime: 2
            },
            {
                name: "image",
            }
        ]
        },{
            type: 'Gallery',
            demos: [{
                name: "fujian",
                sleepTime: 2
            }]
        }
    ]
