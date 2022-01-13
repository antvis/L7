import { Scene, PointLayer,Source } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.19382669582967, 30.258134 ],
    pitch: 0,
    style: 'dark',
    zoom: 3
  })
});
scene.on('loaded', () => {
const fontFamily = 'iconfont';
const fontPath = '//at.alicdn.com/t/font_2534097_fcae9o2mxbv.woff2?t=1622200439140';
scene.addFontFace(fontFamily, fontPath);
scene.addIconFont('icon1', '&#xe6d4;');
  fetch('https://gw.alipayobjects.com/os/bmw-prod/87e40417-a5da-4fdb-8313-c796ea15f982.csv')
    .then(res => res.text())
    .then(data => {
      const dataSource = new Source(data,{
        parser:{
          type:'csv',
          x:'lng',
          y:'lat'

        },
        cluster: true,
      })
      const pointLayer = new PointLayer({
        autoFit:true,
      })
        .source(dataSource)
        .shape('icon1','text')
        .scale('point_count', {
          type: 'quantile'
        })
        .size('point_count', [ 5, 10, 15, 20, 25 ])
        .active(true)
        .color('yellow')
        .style({
          opacity: 0.5,
          strokeWidth: 1,
          fontFamily,
          iconfont: true,
        });
      
      const pointLayerText= new PointLayer({
        autoFit:false,
      })
        .source(dataSource)
        .shape('point_count','text')
        .size('point_count', [ 10,25 ])
        .active(true)
        .color('#fff')
        .style({
          opacity: 1,
          strokeWidth: 1,
          
        });

      scene.addLayer(pointLayer);
      scene.addLayer(pointLayerText);
    });
});
