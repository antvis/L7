// @ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import initGdalJs from 'gdal3.js';

import * as GeoTIFF from 'geotiff';
// @ts-ignore
import * as readBoundingBox from 'geotiff-read-bbox';
const googleUrl = 'https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}';
const congurl2 =   'http://localhost:8080/3857_cog.tif';
const ndviurl = 'http://127.0.0.1:8080/ndvi2022-03-01.tiff';
function ArrayToImage(array: Uint8Array[], width: number, height: number) {
    const canvas = document.createElement('canvas');

    // Set the canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Get the canvas 2d context
    const context = canvas.getContext('2d')!;

    // Create a new ImageData object from the Uint8ClampedArray
    const imageData = new ImageData(new Uint8ClampedArray(width * height * 4), width, height);

    // Set the pixel data to your Uint8ClampedArray
    for(let i=0;i <width *height;i++){
        imageData.data[i*4] = array[0][i];
        imageData.data[i*4+1] = array[1][i];
        imageData.data[i*4+2] = array[2][i];
        imageData.data[i*4+3] = 255;
    }

    // Put the ImageData onto the canvas
    context.putImageData(imageData, 0, 0);

    // Create an <img> element and set its source to the canvas data URL
    return canvas.toDataURL();

}

// 定义一个函数将NDVI值转换为RGB颜色
function ndviToRgb(ndvi) {
    // 定义颜色映射范围和对应的RGB颜色
    const colorMap = [
        { value: -1, color: [0, 0, 255] },   // 蓝色，水体
        { value: 0, color: [255, 255, 255] }, // 白色，无植被
        { value: 1, color: [0, 255, 0] }     // 绿色，植被
    ];

    // 寻找NDVI值在颜色映射范围内的位置
    let lowerColor, upperColor;
    let lowerValue, upperValue;
    for (const entry of colorMap) {
        if (ndvi <= entry.value) {
            upperColor = entry.color;
            upperValue = entry.value;
            break;
        }
        lowerColor = entry.color;
        lowerValue = entry.value;
    }
    // 线性插值计算
    const t = (ndvi - lowerValue) / (upperValue - lowerValue);
 
    const rgb = [
        Math.round(lowerColor[0] + t * (upperColor[0] - lowerColor[0])),
        Math.round(lowerColor[1] + t * (upperColor[1] - lowerColor[1])),
        Math.round(lowerColor[2] + t * (upperColor[2] - lowerColor[2]))
    ];

    return rgb;
}







function ArrayToImage2(array: Float32Array, width: number, height: number) {
    const canvas = document.createElement('canvas');

    // Set the canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Get the canvas 2d context
    const context = canvas.getContext('2d')!;

    // Create a new ImageData object from the Uint8ClampedArray
    const imageData = new ImageData(new Uint8ClampedArray(width * height * 4), width, height);


    // Set the pixel data to your Uint8ClampedArray
    for(let i=0;i <width *height;i++){
        const [r,g,b] = ndviToRgb(array[i])

        imageData.data[i*4] = r;
        imageData.data[i*4+1] =g;
        imageData.data[i*4+2] = b;
        imageData.data[i*4+3] = 255;
    }

    // Put the ImageData onto the canvas
    context.putImageData(imageData, 0, 0);

    // Create an <img> element and set its source to the canvas data URL
    return canvas.toDataURL();

}

function tileXYZToLatLng(x, y, z) {
    const n = 2 ** z;
    const lon_deg = x / n * 360.0 - 180.0;
    const lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
    const lat_deg = lat_rad * 180.0 / Math.PI;
    return [lon_deg, lat_deg];
  }

export default () => {
  useEffect(() => {

    const scene = new Scene({
        id: 'map',
        map: new Map({
          center:[-111.9252,32.9023],  // [-122.10507094860077,48.00410458820935],
          zoom: 12,
        }),
      });
  
      const googleMap = new RasterLayer({
          zIndex: 1,
        }).source(googleUrl, {
          parser: {
            type: 'rasterTile',
            tileSize: 256,
          },
        });
  
    const url1 =
      'https://tiles{1-3}.geovisearth.com/base/v1/vec/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
   


    scene.on('loaded', async () => {
        const Gdal = await initGdalJs({ path: '../static' });
        console.log(Gdal);
        const fileData = await fetch(congurl2);
        const file = new File([await fileData.blob()], "test.tif");

        const dataset = (await Gdal.open(file)).datasets[0];

        const datasetInfo = await Gdal.getInfo(dataset);
    
        // const options = [
        // '-of', 'GTiff',
        // '-t_srs', 'EPSG:4326'
        // ];

    //   scene.addLayer(googleMap);
  
    //   const layer1 = new RasterLayer({
    //     zIndex: 1,
    //   }).source(congurl2, {
    //     parser: {
    //       type: 'rasterTile',
    //       dataType:'customImage',
    //       tileSize: 256,
    //       zoomOffset: 0,
    //       getCustomData:async(tile,cb)=>{
    //         const { x , y , z} = tile;
    //         const tiff = await GeoTIFF.fromUrl(ndviurl);
    //         const [minx,maxY] = tileXYZToLatLng(x,y,z)
    //         const [maxX,minY] = tileXYZToLatLng(x + 1,y -1,z);
    //         const boundingBox = [minx,minY,maxX,maxY];
    //         const name = `tile_${z}_${x}_${y}`
    //         const result = await readBoundingBox({
    //             bbox:boundingBox,
    //             debugLevel: 10,
    //             geotiff:tiff,
    //             srs: 4326,
    //             use_overview: true,
    //             target_height: 256,
    //             target_width: 256
         
    //         });
    //         console.timeEnd(name)
    //           const dataurl = ArrayToImage2(result.data[0],result.width,result.height)
    //           const res = new Image();
    //           res.src = dataurl;
    //         //   console.timeEnd(name)
    //           res.onload = () => {
               
    //             cb(null,res)
    //           }
  
    //       }
    //     },
    //   });

    //   scene.addLayer(layer1);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
