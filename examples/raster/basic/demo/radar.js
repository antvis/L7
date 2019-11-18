import { Scene } from '@l7/scene';
import { ImageLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'dark',
  center: [115.52680, 34.3628],
  zoom: 7,
});

const layer = new ImageLayer({});
layer.source(
  'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*8SUaRr7bxNsAAAAAAAAAAABkARQnAQ',
  {
    parser: {
      type: 'image',
      extent: [ 113.1277263548,32.3464238863,  118.1365790452, 36.4786759137 ]
    },
  },
);
scene.on('loaded',()=>{
  scene.addLayer(layer);
})

