import React, { useEffect } from 'react';
import * as L from 'leaflet';
import { RDBSource } from 'district-data';
import 'leaflet/dist/leaflet.css';


export default () => {
  useEffect(() => {
    const map = L.map('map', {
    crs: L.CRS.EPSG4326,
		center: [123, 30],
		zoom: 0
	});
  // 


	L.tileLayer('http://t{s}.tianditu.gov.cn/img_c/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles',{
    subdomains:['1','2','3','4','5'],
    zoomOffset:1,
  }).addTo(map);
  const source = new RDBSource({});
    source.getData({ level: 'province' }).then((data) => {
      const geojson = L.geoJson(data, {
        style: {
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7,
          fillColor: '#ff7800',
        },
      }).addTo(map);
      // map.fitBounds(geojson.getBounds());
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
