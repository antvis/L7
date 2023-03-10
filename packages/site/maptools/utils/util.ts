import extent from '@turf/envelope';
import { FeatureCollection } from '@turf/helpers';
// @ts-ignore
import geojson2svg from 'geojson2svg';
// @ts-ignore
import shpWrite from 'shp-write';
// @ts-ignore
import tokml from 'tokml';
// @ts-ignore
import * as topojson from 'topojson';

export function exportSVG(data: FeatureCollection) {
  const bbox = extent(data).bbox || [-180, -90, 180, 90];
  const width = 1000,
    height = 800;
  const converter = geojson2svg({
    mapExtent: { left: bbox[0], bottom: bbox[1], right: bbox[2], top: bbox[3] },
    precision: 8,
    attributes: [
      'properties.adcode',
      'properties.name',
      {
        property: 'stroke',
        value: 'blue',
        type: 'static',
      },
      {
        property: 'fill',
        value: '#aaa',
        type: 'static',
      },
    ],
    viewportSize: {
      width,
      height,
    },
    fitToViewBox: true,
    outputFormat: 'svg',
  });
  const svgStrings = converter.convert(data).join();

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"> ${svgStrings}</svg>`;
}

export function exportShpfile(data: FeatureCollection, name: string) {
  const options = {
    folder: name,
    types: {
      point: `${name}points`,
      polygon: `${name}polygons`,
      line: `${name}lines`,
    },
  };

  shpWrite.download(data, options);
}

export function exportTopoJSON(data: FeatureCollection) {
  return JSON.stringify(topojson.topology({ data }));
}

export function exportGeoJSON(data: FeatureCollection): string {
  return JSON.stringify(data);
}
export function exportCSV(data: FeatureCollection) {
  const features = data.features.map((feature) => feature.properties);
  if (features.length === 0) return;
  const keys = Object.keys(features[0] || {});
  const csv = [keys.join(',')];
  features.forEach((feature) => {
    const values = keys.map((key) => feature![key]);
    csv.push(values.join(','));
  });
  return csv.join('\n');
}

export function exportJSON(data: FeatureCollection): string {
  const features = data.features.map((feature) => feature.properties);
  return JSON.stringify(features);
}

export function exportKML(data: FeatureCollection) {
  const kml = tokml(data);
  return kml;
}

// 下载文本类型数据
export function downloadData(
  fileName: string,
  data: FeatureCollection,
  type: 'SVG' | 'TopoJSON' | 'GeoJSON' | 'CSV' | 'JSON' | 'KML',
) {
  const datastring =
    type === 'SVG'
      ? exportSVG(data)
      : type === 'TopoJSON'
      ? exportTopoJSON(data)
      : type === 'GeoJSON'
      ? exportGeoJSON(data)
      : type === 'CSV'
      ? exportCSV(data)
      : type === 'JSON'
      ? exportJSON(data)
      : type === 'KML'
      ? exportKML(data)
      : '';
  const download = document.createElement('a');
  download.download = `${fileName}.${type.toLowerCase()}`;
  download.href = `data:text/json;charset=utf-8,${encodeURIComponent(
    datastring,
  )}`;
  download.target = '_blank';
  download.rel = 'noreferrer';
  download.click();
}
