import { Scene, PolygonLayer, LineLayer, Popup } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 0,
    style: 'light',
    center: [ -96, 37.8 ],
    zoom: 3
  })
});

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json'
)
  .then(res => res.json())
  .then(data => {
    const layer = new PolygonLayer({})
      .source(data)
      .color(
        'density', d => {
          return d > 1000 ? '#800026' :
            d > 500 ? '#BD0026' :
              d > 200 ? '#E31A1C' :
                d > 100 ? '#FC4E2A' :
                  d > 50 ? '#FD8D3C' :
                    d > 20 ? '#FEB24C' :
                      d > 10 ? '#FED976' :
                        '#FFEDA0';
        }
      )
      .shape('fill')
      .active(true)
      .style({
        opacity: 0.8
      });
    const layer2 = new LineLayer({
      zIndex: 2
    })
      .source(data)
      .color('#fff')
      .active(true)
      .size(1)
      .style({
        lineType: 'dash',
        dashArray: [ 2, 2 ],
        opacity: 1
      });
    scene.addLayer(layer);
    scene.addLayer(layer2);

    layer.on('mousemove', e => {
      const popup = new Popup({
        offsets: [ 0, 0 ]
      })
        .setLnglat(e.lngLat)
        .setHTML(`<span>${e.feature.properties.name}: ${e.feature.properties.density}</span>`);
      scene.addPopup(popup);
    });
  });
