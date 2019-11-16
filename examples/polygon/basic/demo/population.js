import { Scene } from '@l7/scene';
import { PolygonLayer, LineLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'light',
  center: [0, 29.877025],
  zoom: 0,
});
Promise.all([
  fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/world.geo.json').then(d => d.json()),
  fetch('https://gw.alipayobjects.com/os/basement_prod/f3c467a4-9ae0-4f08-bb5f-11f9c869b2cb.json').then(d => d.json())
]).then(function onLoad([world, population]) {
    const popobj = {};
    population.forEach(element => {
      popobj[element.Code] = element['Population, female (% of total) (% of total)']
    });
   // 数据绑定
    world.features = world.features.map((fe)=>{
      fe.properties.female= popobj[fe.id] * 1|| 0;
      return fe;
    })
    console.log(world);
  var colors = ['#b2182b','#ef8a62','#fddbc7','#f7f7f7','#d1e5f0','#67a9cf','#2166ac'];
  const layer =
      new PolygonLayer({
      })
      .source(world)
      .scale('female', {
        type:'quantile'
      })
      .color('female', colors).shape('fill')
      .style({
        opacity: 0.9
      });

  const layer2 =
    new LineLayer({
      zIndex: 2
    })
      .source(world)
      .color('#fff')
      .size(0.3)
      .style({
        opacity: 1
      })

  scene.addLayer(layer);
  scene.addLayer(layer2);
  console.log(layer);
});
