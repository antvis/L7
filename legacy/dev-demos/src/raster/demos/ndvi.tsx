import { Scene, PolygonLayer, RasterLayer, LineLayer, Popup, GaodeMap, project } from '@antv/l7';

import * as GeoTIFF from 'geotiff';
import React, { useEffect, useState } from 'react';
import eachSeries from 'async/eachSeries';
import asyncMap from 'async/mapLimit';
import { Card,Spin } from 'antd';
import { Chart } from '@antv/g2';

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

async function  readTiffbyLngLat(tiffdata, lnglat) {
    const [x ,y] = project([lnglat.lng,lnglat.lat])
    const offset = [x-tiffdata.info.originX,y-tiffdata.info.originY];
    const offsetPixel = [offset[0]/tiffdata.info.uWidth, offset[1]/tiffdata.info.uHeight];
    const pixelX = Math.floor( tiffdata.info.width * offsetPixel[0] );
    const pixelY = Math.floor( tiffdata.info.height * offsetPixel[1] );

    const [ value ] = await tiffdata.image.readRasters( {
        interleave: true,
        window: [ pixelX, pixelY, pixelX + 1, pixelY + 1],
        samples: [ 0 ]
    } );

    return value
}

async function getTiffData(url) {
    const response = await fetch(
        url);
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const width = image.getWidth();
    const height = image.getHeight();
    const [ originX, originY ] = image.getOrigin();
    const [ xSize, ySize ] = image.getResolution();
    const uWidth = xSize * width;
    const uHeight = ySize * height;
    const values = await image.readRasters();
    return {
        data: values[0],
        info:{
            width,
            height,
            originX,
            originY,
            xSize,
            ySize,
            uWidth,
            uHeight,
        },
        image,
        
    };
}

const googleUrl = 'https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
const colors = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'];

export default () => {
    const [timestr,setTimeStr]= useState('20220301')
    const [loading,setLoding] =useState(true)
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
            const chart = new Chart({
                container: 'container',
                autoFit: true,
                height: 200,
              })
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
                        width: tiffdata.info.width,
                        height: tiffdata.info.height,
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
                        colors: colors

                    }
                });
            scene.addLayer(rlayer);

            const results = await asyncMap(ndviList, 3, async (item, callback) => {
                const tiffdata = await getTiffData(item.value);
                callback(null, {
                    name: item.name,
                    ...tiffdata 
                })

            });

            setLoding(false)
      
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
                // renderNDVI(results)

            }, 5000);

            scene.on('click',async (e)=>{
                console.time('readTiffbyLngLat')
               const list = await asyncMap(results, 3,async (item, callback) => {
                    const value = await readTiffbyLngLat(item, e.lnglat);
                    callback(null, {
                        time: item.name,
                        value
                    })
                })
                console.timeEnd('readTiffbyLngLat')
                chart.data(list);
                chart.scale('value', {
                    min: -0.5,
                    max: 1,
                  });
                chart.line().position('time*value').shape('smooth');;
                chart
                 .point()
                 .position('time*value')
                 .color('value',colors)
                 .shape('circle');
                chart.render();
            })


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
          <>
          <Spin spinning={loading}  />
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
            <Card title="作物生长曲线"  style={{ zIndex:10, width: '100%', height:300, position:'absolute', bottom: '0',}}>
            <div id="container"></div>
            </Card>
        </div>
        </>
    );
};