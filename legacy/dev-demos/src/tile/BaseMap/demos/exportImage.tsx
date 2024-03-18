// @ts-ignore
import { ISource, PolygonLayer, RasterLayer, Scene, Source } from '@antv/l7';
import { Button } from 'antd'
// @ts-ignore
import { Map } from '@antv/l7-maps';
import { useEffect, useState } from 'react';

export default () => {
  const [currentScene,setScene] = useState<Scene>()
  const [currentSource,setSource] = useState<ISource>()
  const exportCurrentImage = () => {
    const bounds = currentScene?.getBounds();
    const tiles = currentSource?.tileset.currentTiles;
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    tiles?.forEach((tile: {x:number,y:number,z:number}) => {
      minX = Math.min(minX,tile.x)
      minY = Math.min(minY,tile.y)
      maxX = Math.max(maxX,tile.x)
      maxY = Math.max(maxY,tile.y)
    })
    
    const canvas = document.createElement('canvas');
    canvas.width = (maxX - minX + 1) * 256;
    canvas.height = (maxY - minY + 1) * 256;
    const ctx = canvas.getContext('2d')!;
    console.log( canvas.width, canvas.height,minX,minY,maxX,maxY)
    tiles.forEach((tile: any) => {
      if (tile) {
        ctx?.drawImage(tile.data, (tile.x - minX) * 256, (tile.y - minY) * 256,256,256)
      }
    });

      // 创建一个a标签元素
      var downloadLink = document.createElement("a");

      // 设置a标签的href属性为DataURL格式的字符串
      downloadLink.href = canvas.toDataURL('image/png');

      // 设置a标签的download属性为要下载的文件名
      downloadLink.download = "myCanvas.png";

      // 创建并触发一个点击事件，以便触发文件下载
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

    // console.log(
    //   '%c ',
    //   `padding: 1024px 512px;
    //   background-image: url(${canvas.toDataURL('image/png')})` )
    
 

  }
  useEffect(() => {
    
    const scene = new Scene({
      id: 'map',

      map: new Map({
        center: [118.7545628,36.9700237],
        zoom: 17,
        minZoom:16
      }),
    });

    const url1 =
      'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
    const googleUrl = 'https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
    const url2 =
      'https://tiles{1-3}.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
      const layerSource = new Source(googleUrl, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
        },
      })
    const layer1 = new RasterLayer({
      zIndex: 1,
    }).source(layerSource);

   
    const layer2 = new RasterLayer({
      zIndex: 1,
    }).source(url2, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
      },
    });
    scene.on('loaded', () => {
      setScene(scene);
      setSource(layerSource)
      scene.addLayer(layer1);
    });
  }, []);
  return <>
    <Button onClick={exportCurrentImage }>导出图片</Button>
    <div
      id="map"
      style={{
        height: '60vh',
        position: 'relative',
      }}
     />
    </>

};
