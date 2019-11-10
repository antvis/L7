import { Scene } from '@l7/scene';
import { DashLineLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [120.2336, 30.2002],
  zoom: 3,
});
const lineData ={
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            102.98583984374999,
            37.666429212090605
          ],
          [
            111.33544921874999,
            37.23032838760387
          ],
          [
            111.24755859375,
            34.92197103616377
          ],
          [
            98.15185546874999,
            35.44277092585766
          ],
          [
            98.701171875,
            41.09591205639546
          ],
          [
            100.5908203125,
            41.0130657870063
          ],
          [
            101.09619140625,
            41.0130657870063
          ],
          [
            101.689453125,
            41.0130657870063
          ],
          [
            102.26074218749999,
            41.0130657870063
          ],
          [
            102.26074218749999,
            40.58058466412761
          ],
          [
            102.23876953125,
            40.329795743702064
          ],
          [
            102.23876953125,
            39.977120098439634
          ],
          [
            102.26074218749999,
            40.212440718286466
          ],
          [
            102.48046875,
            39.87601941962116
          ]
        ]
      }
    }
  ]
};
fetch('https://gw.alipayobjects.com/os/basement_prod/65e9cebb-8063-45e7-b18f-727da84e9908.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new DashLineLayer({
      })
        .source(lineData)
        .size(1.5)
        .shape('line')
        .color(
          '#5B8FF9'
        )
    scene.addLayer(layer);
    console.log(layer);

  });
