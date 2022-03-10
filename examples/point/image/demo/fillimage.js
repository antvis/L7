import { Scene, PointLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { animate, linear } from 'popmotion';

const path = [
  {
    lng: 168.3984375,
    lat: -4.565473550710278,
    img: 'img'
  },
  {
    lng: 165.05859375,
    lat: -5.7908968128719565,
    img: 'img'
  },
  {
    lng: 160.3125,
    lat: -5.7908968128719565,
    img: 'img'
  },
  {
    lng: 157.32421875,
    lat: -3.688855143147035,
    img: 'img'
  },
  {
    lng: 153.80859375,
    lat: -2.284550660236957,
    img: 'img'
  },
  {
    lng: 148.88671874999997,
    lat: -2.108898659243126,
    img: 'img'
  },
  {
    lng: 145.1953125,
    lat: -0.7031073524364783,
    img: 'img'
  },
  {
    lng: 140.44921875,
    lat: 0,
    img: 'img'
  },
  {
    lng: 135,
    lat: 1.4061088354351594,
    img: 'img'
  },
  {
    lng: 131.8359375,
    lat: 2.986927393334876,
    img: 'img'
  },
  {
    lng: 130.078125,
    lat: 5.965753671065536,
    img: 'img'
  },
  {
    lng: 128.49609375,
    lat: 9.102096738726456,
    img: 'img'
  },
  {
    lng: 127.265625,
    lat: 12.211180191503997,
    img: 'img'
  },
  {
    lng: 125.859375,
    lat: 15.453680224345835,
    img: 'img'
  },
  {
    lng: 123.92578125,
    lat: 18.312810846425442,
    img: 'img'
  },
  {
    lng: 121.11328124999999,
    lat: 19.80805412808859,
    img: 'img'
  },
  {
    lng: 117.94921874999999,
    lat: 20.96143961409684,
    img: 'img'
  },
  {
    lng: 115.31249999999999,
    lat: 22.917922936146045,
    img: 'img'
  }
];

let imageLayer;
let imageData = {
  lng: 168.3984375,
  lat: -4.565473550710278,
  img: 'img'
};
let lineLayer;
let lineData = [];
let timer2;
let pathCount = 0;
let rotation = 0;

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    center: [ 120, 10 ],
    zoom: 2
  })
});

scene.addImage(
  'img',
  'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*rd3kTp1VFxIAAAAAAAAAAAAAARQnAQ'
);

scene.on('loaded', () => {
  imageLayer = new PointLayer({ layerType: 'fillImage', zIndex: 2 })
    .source([ imageData ], {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat'
      }
    })
    .shape('img', img => img)
    .size(60)
    .active({
      color: '#f00',
      mix: 0.5
    })
    .style({
      opacity: 0.8,
      rotation
    });

  scene.addLayer(imageLayer);

  const data = [
    {
      id: '1',
      coord: lineData
    }
  ];
  lineLayer = new LineLayer()
    .source(data, {
      parser: {
        type: 'json',
        coordinates: 'coord'
      }
    })
    .shape('line')
    .size(2)
    .color('#f00')
    .style({
      opacity: 0.8,
      targetColor: '#0DCCFF',
      sourceColor: 'rbga(255,255,255, 0)'
    });

  scene.addLayer(lineLayer);

  const rotate = () => {
    rotation -= 2;
    imageLayer.style({
      rotation
    });
    scene.render();
    requestAnimationFrame(rotate);
  };
  rotate();

  updateLocation();
});

function updateLocation() {
  clearTimeout(timer2);

  if (pathCount < path.length) {
    timer2 = setTimeout(() => {
      const data = path[pathCount];

      const t = animate({
        from: {
          lng: imageData.lng,
          lat: imageData.lat
        },
        to: {
          lng: data.lng,
          lat: data.lat
        },
        ease: linear,
        duration: 500,
        onUpdate: o => {
          if (pathCount > 1) {
            imageData.lng = o.lng;
            imageData.lat = o.lat;
            imageLayer.setData([ imageData ]);

            lineData.push([ o.lng, o.lat ]);
            lineLayer.setData([
              {
                id: '1',
                coord: lineData
              }
            ]);
          }
        },
        onComplete: () => {
          t.stop();
          if (pathCount === path.length - 1) {
            lineData = [];
            lineLayer.setData([
              {
                id: '1',
                coord: lineData
              }
            ]);
          }
        }
      });

      pathCount++;
      updateLocation();
    }, 500);
  } else {
    lineData = [];
    imageData = {
      lng: 168.3984375,
      lat: -4.565473550710278,
      img: 'img'
    };
    pathCount = 0;
    updateLocation();
  }
}
