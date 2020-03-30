import { ILayer, LineLayer, PointLayer, PolygonLayer } from '@antv/l7';
import { FeatureCollection } from '@turf/helpers';
export function renderFeature(fe: FeatureCollection, style: any): ILayer[] {
  const type = fe.features[0].geometry.type;
  let layers;
  switch (type) {
    case 'Point':
      layers = drawPoint(fe, style.point);
      break;
    case 'LineString':
      layers = drawLine(fe, style.line);
      break;
    case 'Polygon':
      layers = drawPolyon(fe, style.polygon);
      break;
  }
  return layers as ILayer[];
}

function drawPoint(fe: FeatureCollection, style: any) {
  const layer = new PointLayer()
    .source(fe)
    .shape('circle')
    .color(style.color)
    .size(style.size)
    .style(style.style);
  return [layer];
}

function drawLine(fe: FeatureCollection, style: any) {
  const layer = new LineLayer({
    pickingBuffer: 3,
  })
    .source(fe)
    .shape('line')
    .color(style.color)
    .size(style.size)
    .style(style.style);
  return [layer];
}

function drawPolyon(fe: FeatureCollection, style: any) {
  const fill = new PolygonLayer()
    .source(fe)
    .shape('fill')
    .color(style.color)
    .size(style.size)
    .style({
      opacity: style.style.opacity,
    });
  const line = new PolygonLayer()
    .source(fe)
    .shape('line')
    .color(style.style.stroke)
    .size(style.style.strokeWidth)
    .style({
      opacity: style.style.strokeOpacity,
      lineType: style.style.lineType,
      dashArray: style.style.dashArray,
    });
  return [fill, line];
}
