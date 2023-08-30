import { Scene, PolygonLayer, RasterLayer, LineLayer, Popup, GaodeMap } from '@antv/l7';

import * as GeoTIFF from 'geotiff';
import React, { useEffect, useState } from 'react';
import eachSeries from 'async/eachSeries';
import asyncMap from 'async/mapLimit';
import { Card } from 'antd';

const ndviList = [
    {
        name: '20220301',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*sZpWQZK21NIAAAAAAAAAAAAADmJ7AQ/ndvi2022-03-01.glb',
    },
    {
        name: '20220401',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*zn4YQaNSxzEAAAAAAAAAAAAADmJ7AQ/ndvi2022-04-01.NDVI.glb',
    },
    {
        name: '20220501',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*OnDOQrRoonIAAAAAAAAAAAAADmJ7AQ/ndvi2022-05-01.NDVI.glb',
    },
    {
        name: '20220601',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*CvtvTqIg3VoAAAAAAAAAAAAADmJ7AQ/ndvi2022-06-01.NDVI.glb',
    },
    {
        name: '20220701',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*PBTRQ6lnpj8AAAAAAAAAAAAADmJ7AQ/ndvi2022-07-01.NDVI.glb',
    },
    {
        name: '20220801',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*j5eXQJGyr2wAAAAAAAAAAAAADmJ7AQ/ndvi2022-08-01.NDVI.glb',
    }, {
        name: '20220901',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*JeHQTIzN4_kAAAAAAAAAAAAADmJ7AQ/ndvi2022-10-01.NDVI.glb',
    }, {
        name: '20221001',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*JeHQTIzN4_kAAAAAAAAAAAAADmJ7AQ/ndvi2022-10-01.NDVI.glb',
    },
    {
        name: '20221101',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*mhucTbYhYuwAAAAAAAAAAAAADmJ7AQ/ndvi2022-11-01.NDVI.glb',
    }, {
        name: '20221201',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*ZvT-TYTxmf0AAAAAAAAAAAAADmJ7AQ/ndvi2022-12-01.NDVI.glb',
    },
    {
        name: '20230101',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*qvALQJZYRh4AAAAAAAAAAAAADmJ7AQ/ndvi2023-01-01.NDVI.glb',
    }, {
        name: '20230201',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*g363SYTH2PEAAAAAAAAAAAAADmJ7AQ/ndvi2023-02-01.NDVI.glb',
    },
    {
        name: '20230301',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*l_NQTqxtzawAAAAAAAAAAAAADmJ7AQ/ndvi2023-03-01.NDVI.glb',
    }, {
        name: '20230401',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*fc8uTqKrrFMAAAAAAAAAAAAADmJ7AQ/ndvi2023-06-01.NDVI.glb',
    },
    {
        name: '20230501',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*fc8uTqKrrFMAAAAAAAAAAAAADmJ7AQ/ndvi2023-06-01.NDVI.glb',
    }, {
        name: '20230601',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*fc8uTqKrrFMAAAAAAAAAAAAADmJ7AQ/ndvi2023-06-01.NDVI.glb',
    },
    {
        name: '20230701',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*Ezs6RKIHiVcAAAAAAAAAAAAADmJ7AQ/ndvi2023-07-01.NDVI.glb',
    }, {
        name: '20230801',
        value: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*G3ALRLGesSgAAAAAAAAAAAAADmJ7AQ/ndvi2023-08-01.NDVI.glb',
    }
]

async function getTiffData(url) {
    const response = await fetch(
        url);
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const width = image.getWidth();
    const height = image.getHeight();
    const values = await image.readRasters();
    return {
        data: values[0],
        width,
        height,
        image
    };
}

const googleUrl = 'https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'

export default () => {
    const [timestr,setTimeStr]= useState('20220301')
    useEffect(() => {
      
        const scene = new Scene({
            id: 'map',
            map: new GaodeMap({
                style: 'light',
                center: [-96, 37.8],
                zoom: 14
            })
        });

        scene.on('loaded', async () => {
            const google = new RasterLayer({
                zIndex: 0,
            }).source(
                googleUrl, {
                parser: {
                    type: 'rasterTile',
                    tileSize: 256,
                    updateStrategy: 'overlap',
                },
            },
            );
            scene.addLayer(google);

            const data = await (await fetch(
                'https://mdn.alipayobjects.com/afts/file/A*Whj8Sp6p8QcAAAAAAAAAAAAADrd2AQ/2023-08-22.json'
            )).json();

            const color = ['rgb(255,255,217)', 'rgb(237,248,177)', 'rgb(199,233,180)', 'rgb(127,205,187)', 'rgb(65,182,196)', 'rgb(29,145,192)', 'rgb(34,94,168)', 'rgb(12,44,132)'];
            const layer = new PolygonLayer({
                autoFit: true,
                visible: false,

            })
                .source(data)
                .color('#4575b4')
                .shape('fill')
                .style({
                    opacity: 1
                });
            const layer2 = new LineLayer({
                zIndex: 2
            })
                .source(data)
                .color('#fff')
                .active(true)
                .size(0.5)
                .style({
                });
            scene.addLayer(layer);
            scene.addLayer(layer2);

            const tiffdata = await getTiffData(ndviList[0].value);
            const image = tiffdata.image;
            
            
            const rlayer = new RasterLayer({
                maskLayers: [layer]
            });
            rlayer
                .source(tiffdata.data, {
                    parser: {
                        type: 'raster',
                        width: tiffdata.width,
                        height: tiffdata.height,
                        extent: [-112.117293306503, 32.78212288135407, -111.77216057434428, 33.10568277278276]
                    }
                })
                .style({
                    clampLow: false,
                    clampHigh: false,
                    domain: [-1, 1],
                    nodataValue: 0,
                    rampColors: {
                        type: 'linear',
                        positions: [-0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0],// 数据需要换成 0-1
                        colors: ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850']

                    }
                });
            scene.addLayer(rlayer);

            const results = await asyncMap(ndviList, 3, async (item, callback) => {
                const tiffdata = await getTiffData(item.value);
                callback(null, {
                    name: item.name,
                    data: tiffdata.data
                })

            });
      
            const renderNDVI = (results) => {
                eachSeries(results, async (item, callback) => {
                    console.log(item)
                    rlayer.setData(item.data);
                    setTimeout(() => {
                        setTimeStr(item.name)
                        callback();
                    }, 200)

                }, (err) => {
                    console.log('更新完成')
                    renderNDVI(results)

                });
            };

            setTimeout(() => {
                console.log('开始更新')
                renderNDVI(results)

            }, 5000);




            //    scene.on('click',async ()=>{
            //         const image = await await scene.exportPng("png")
            //         const anchor = document.createElement("a");
            //         anchor.href = image;
            //         anchor.download = "image.png"; // Change the filename if needed
            //         anchor.style.display = "none";

            //         // Append the anchor to the body and click it
            //         document.body.appendChild(anchor);
            //         anchor.click();

            //         // Clean up
            //         document.body.removeChild(anchor);
            //       })

        });


    }, []);
    return (
            <div
                id="map"
                style={{
                    height: '100vh',
                    position: 'relative',
                }}
            >
            <Card style={{ zIndex:10, width: 180, position:'absolute', top: '20px', right:'20px'}}>
            <strong>日期: {`${timestr.slice(0,4)}-${timestr.slice(4,6)}-${timestr.slice(6,8)}`}</strong>

        </Card>
        </div>
    );
};