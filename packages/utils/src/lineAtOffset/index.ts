import { arcLineAtOffset } from './arc';
import { greatCircleLineAtOffset } from './greatCircle';
import { ILineAtOffset, Source } from './interface';
import { pathLineAtOffset } from './line';

export function lineAtOffset(source: Source, option: ILineAtOffset) {
  const { featureId } = option;
  let features = source.data.dataArray;
  if (typeof featureId === 'number') {
    features = features.filter(({ id }: { id: number }) => id === featureId);
  }
  return features.map((feature: any) => {
    const position = getLineOffsetPosition(feature, option);
    return {
      ...feature,
      ...position,
    };
  });
}

export function lineAtOffsetAsyc(source: Source, option: ILineAtOffset) {
  return new Promise((resolve) => {
    if (source.inited) {
      resolve(lineAtOffset(source, option));
    } else {
      source.once('update', () => {
        resolve(lineAtOffset(source, option));
      });
    }
  });
}

function getLineOffsetPosition(feature: any, option: ILineAtOffset) {
  const {
    offset,
    shape,
    thetaOffset,
    mapVersion,
    segmentNumber = 30,
    autoFit = true,
  } = option;
  const { coordinates } = feature;
  if (shape === 'line') {
    return pathLineAtOffset(coordinates, offset);
  }

  const source = coordinates[0];
  const target = coordinates[1];
  const linetheatOffset =
    typeof thetaOffset === 'string' ? feature[thetaOffset] || 0 : thetaOffset;

  let calFunc;
  switch (shape) {
    case 'arc':
      calFunc = arcLineAtOffset;
      break;
    case 'greatcircle':
      calFunc = greatCircleLineAtOffset;
      break;
    default:
      calFunc = arcLineAtOffset;
  }
  const [lng, lat, height] = calFunc(
    source,
    target,
    offset,
    linetheatOffset,
    mapVersion,
    segmentNumber,
    autoFit,
  );

  return {
    lng,
    lat,
    height,
  };
}
