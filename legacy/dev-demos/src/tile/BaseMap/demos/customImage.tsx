// @ts-ignore
import { Scene, RasterLayer, TileDebugLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [113.270854, 23.141717],
        zoom: 5,
        style: 'blank',
        pitch: 0,
      }),
    });

    const url1 =
      'https://tiles{1-3}.geovisearth.com/base/v1/vec/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';

    const layer1 = new RasterLayer({
      zIndex: 1,
    }).source(url1, {
      parser: {
        type: 'rasterTile',
        dataType:'customImage',
        tileSize: 256,
        zoomOffset: 0,
        getCustomData:(tile,cb)=>{
            // 通过 Image 对象获取图像数据
            const imageUrl = `https://tiles1.geovisearth.com/base/v1/vec/${tile.z}/${tile.x}/${tile.y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788`;
            const img = new Image();
            img.crossOrigin = "anonymous"; // enable CORS for the image
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d')!;
              ctx?.drawImage(img, 0, 0);
              const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              const width = imageData.width;
              const height = imageData.height;

            // Iterate over each pixel in the ImageData object
            for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Calculate the index of the current pixel in the array
                const index = (y * width + x) * 4;

                // Read the Red, Green, Blue, and Alpha components of the pixel
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];
                data[index] = 255;
                data[index + 1] = r;
                data[index + 2] = r;
            }
            }
              // Use the 'imageData' object here

              ctx.putImageData(imageData, 0, 0);

              // 获取canvas图像
              const res = new Image();
              res.src = canvas.toDataURL();
              res.onload = () => {
                cb(null,res)
              }
                              
            };
            img.src = imageUrl;

           
        }
      },
    });


    scene.on('loaded', () => {
      scene.addLayer(layer1);
      const debugerLayer = new TileDebugLayer();
      scene.addLayer(debugerLayer);

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
