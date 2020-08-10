/* eslint-disable no-eval */
import { Scene, LineLayer, PointLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 40,
    style: 'dark',
    center: [ 3.438, 40.16797 ],
    zoom: 0.51329
  })
});
Promise.all(
  [ fetch('https://gw.alipayobjects.com/os/basement_prod/9acd4831-5655-41a5-b0a0-831603e0092d.json').then(function(d) {
    return d.text();
  }).then(JSON.parse), fetch('https://gw.alipayobjects.com/os/basement_prod/dbe4e40b-3fbf-4a20-b36b-7a8bd3b8aef2.csv').then(function(d) {
    return d.text();
  }), fetch('https://gw.alipayobjects.com/os/basement_prod/89d20ef7-77df-44ca-a238-6e3679ab3ae4.csv').then(function(d) {
    return d.text();
  }) ]).then(function onLoad([ coordinates, trips, stations ]) {
  const stationArray = parseCSV(stations);
  const stationObj = {};
  stationArray.forEach(function(st) {
    stationObj[st.station_id] = {
      x: st.longitude * 1,
      y: st.latitude * 1
    };
  });
  const tripsArray = parseCSV(trips);
  const triplines = [];
  tripsArray.forEach(function(trip) {
    if (stationObj[trip.start_station] && stationObj[trip.end_station]) {
      const line = {
        x: stationObj[trip.start_station].x,
        y: stationObj[trip.start_station].y,
        x1: stationObj[trip.end_station].x,
        y1: stationObj[trip.end_station].y,
        duration: trip.duration
      };
      triplines.push(line);
    }
  });
  const roadlayer = new LineLayer().source(coordinates).shape('line')
    .size(0.6)
    .color('#eee')
    .active(true)
    .style({
      opacity: 0.9
    });
  const stationLayer = new PointLayer().source(stations, {
    parser: {
      type: 'csv',
      x: 'longitude',
      y: 'latitude'
    }
  }).shape('circle')
    .active(true)
    .size(40)
    .color('#fec44f')
    .animate(true)
    .style({
      opacity: 1.0
    })
    .render();

  const arclayer = new LineLayer().source(triplines.slice(0, 1000), {
    parser: {
      type: 'json',
      x: 'x',
      y: 'y',
      x1: 'x1',
      y1: 'y1'
    }
  })
    .color('#ff6b34')
    .shape('arc3d')
    .size(1)
    .style({
      opacity: 1.0
    })
    .animate({
      interval: 0.5,
      trailLength: 0.5,
      duration: 1
    });
  arclayer.fitBounds();
  scene.addLayer(roadlayer);
  scene.addLayer(stationLayer);
  scene.addLayer(arclayer);


});

function parseCSV(data) {
  const lines = data.split('\n');
  const header = lines[0];
  const columns = header.split(',');
  return lines.slice(1).filter(function(l) {
    return l;
  }).map(function(line) {
    const obj = {};
    line.split(',').forEach(function(value, i) {
      const name = columns[i];
      obj[name] = value;
    });
    return obj;
  });
}

