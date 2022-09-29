//@ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
//@ts-ignore
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [-119.5591, 37.715],
        zoom: 9,
        style: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g',
        token: 'pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2w4bXNyeHgzMGl0cjNvbXlmeHFjeDBwZCJ9.05W7JfyT6BVkpu12dYL58w'
      }),
    });

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    scene.on('loaded', () => {
      const layer = new RasterLayer();
      layer
        .source(
          // 'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2w3dHk3dnN4MDYzaDNycDkyMDl2bzh6NiJ9.YIrG9kwUpayLj01f6W23Gw',
          'https://api.mapbox.com/raster/v1/mapbox.mapbox-terrain-dem-v1/{z}/{x}/{y}.webp?sku=101xrmKJip7uQ&access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2w4bXNyeHgzMGl0cjNvbXlmeHFjeDBwZCJ9.05W7JfyT6BVkpu12dYL58w',
          // 'https://b.tiles.mapbox.com/v3/aj.sf-dem/12/657/1589.png',
          // https://b.tiles.mapbox.com/v3/aj.sf-dem/12/659/1589.png
          {
            parser: {
              type: 'rasterTile',
              dataType: 'arraybuffer',
              tileSize: 256,
              // extent: [-180, -85.051129, 179, 85.051129],
              format: async (data: any) => {
                const blob: Blob = new Blob([new Uint8Array(data)], {
                  type: 'image/png',
                });
                const img = await createImageBitmap(blob);
                ctx.clearRect(0, 0, 256, 256);
                ctx.drawImage(img, 0, 0, 256, 256);

                const shadeOptions = {
                  resolution: 256,
                  sunEl: 0,
                  sunAz: 131,
                  vert: 2
                }
                const elevationImage = ctx.getImageData(0, 0, 256, 256);
                const width = elevationImage.width;
                const height = elevationImage.height;
                const elevationData = elevationImage.data;
                const shadeData = new Uint8ClampedArray(elevationData.length);
                const dp = shadeOptions.resolution * 2;
                const maxX = width - 1;
                const maxY = height - 1;
                const pixel = [0, 0, 0, 0];
                const twoPi = 2 * Math.PI;
                const halfPi = Math.PI / 2;

                const sunEl = (Math.PI * shadeOptions.sunEl) / 180;
                const sunAz = (Math.PI * shadeOptions.sunAz) / 180;

                const cosSunEl = Math.cos(sunEl);
                const sinSunEl = Math.sin(sunEl);
                let pixelX,
                pixelY,
                x0,
                x1,
                y0,
                y1,
                offset,
                z0,
                z1,
                dzdx,
                dzdy,
                slope,
                aspect,
                cosIncidence,
                scaled;
                function calculateElevation(pixel) {
                  // The method used to extract elevations from the DEM.
                  // In this case the format used is
                  // red + green * 2 + blue * 3
                  //
                  // Other frequently used methods include the Mapbox format
                  // (red * 256 * 256 + green * 256 + blue) * 0.1 - 10000
                  // and the Terrarium format
                  // (red * 256 + green + blue / 256) - 32768
                  //
                  // return pixel[0] + pixel[1] * 2 + pixel[2] * 3;

                  return -10000 + (pixel[0] * 256 * 256 + pixel[1] * 2 * 256 + pixel[2]) * 0.1;
                
                }

                const arr2: number[] = [];

                for (pixelY = 0; pixelY <= maxY; ++pixelY) {
                  y0 = pixelY === 0 ? 0 : pixelY - 1;
                  y1 = pixelY === maxY ? maxY : pixelY + 1;
                  for (pixelX = 0; pixelX <= maxX; ++pixelX) {
                    x0 = pixelX === 0 ? 0 : pixelX - 1;
                    x1 = pixelX === maxX ? maxX : pixelX + 1;
              
                    // determine elevation for (x0, pixelY)
                    offset = (pixelY * width + x0) * 4;
                    pixel[0] = elevationData[offset];
                    pixel[1] = elevationData[offset + 1];
                    pixel[2] = elevationData[offset + 2];
                    pixel[3] = elevationData[offset + 3];
                    z0 = shadeOptions.vert * calculateElevation(pixel);
              
                    // determine elevation for (x1, pixelY)
                    offset = (pixelY * width + x1) * 4;
                    pixel[0] = elevationData[offset];
                    pixel[1] = elevationData[offset + 1];
                    pixel[2] = elevationData[offset + 2];
                    pixel[3] = elevationData[offset + 3];
                    z1 = shadeOptions.vert * calculateElevation(pixel);
              
                    dzdx = (z1 - z0) / dp;
              
                    // determine elevation for (pixelX, y0)
                    offset = (y0 * width + pixelX) * 4;
                    pixel[0] = elevationData[offset];
                    pixel[1] = elevationData[offset + 1];
                    pixel[2] = elevationData[offset + 2];
                    pixel[3] = elevationData[offset + 3];
                    z0 = shadeOptions.vert * calculateElevation(pixel);
              
                    // determine elevation for (pixelX, y1)
                    offset = (y1 * width + pixelX) * 4;
                    pixel[0] = elevationData[offset];
                    pixel[1] = elevationData[offset + 1];
                    pixel[2] = elevationData[offset + 2];
                    pixel[3] = elevationData[offset + 3];
                    z1 = shadeOptions.vert * calculateElevation(pixel);
              
                    dzdy = (z1 - z0) / dp;
              
                    slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy));
              
                    aspect = Math.atan2(dzdy, -dzdx);
                    if (aspect < 0) {
                      aspect = halfPi - aspect;
                    } else if (aspect > halfPi) {
                      aspect = twoPi - aspect + halfPi;
                    } else {
                      aspect = halfPi - aspect;
                    }
              
                    cosIncidence =
                      sinSunEl * Math.cos(slope) +
                      cosSunEl * Math.sin(slope) * Math.cos(sunAz - aspect);
              
                    offset = (pixelY * width + pixelX) * 4;
                    scaled = 255 * cosIncidence;
                    shadeData[offset + 1] = scaled;
                    shadeData[offset + 2] = scaled;
                    shadeData[offset + 3] = elevationData[offset + 3];

                    const r = shadeData[offset]
                    const g = shadeData[offset + 1]
                    const b = shadeData[offset + 2]
                    // (0.30*R)+(0.59*G)+(0.11*B)
                    arr2.push( 0.30 * r + 0.59 * g + 0.11 * b );
                  }
                }

                return {rasterData: arr2, width: width, height: height};
              },
            },
          },
        )
        .style({
          opacity: 0.5,
          domain: [0, 255],
          rampColors: {
            colors: [
              '#fff',
              '#000',
            ],
            positions: [0, 1.0],
          },
        });

      scene.addLayer(layer)
    
    });
  }, []);

  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};