import { fill, extrude } from '../../shape/polygon';
export default function hexagonBuffer(layerData) {
  const attribute = {
    vertices: [],
    miter: [],
    colors: [],
    pickingIds: []
  };
  const a = Math.cos(Math.PI / 6);
  const points = [
    [ 0, -1, 0 ],
    [ -a, -0.5, 0 ],
    [ -a, 0.5, 0 ],
    [ 0, 1, 0 ],
    [ a, 0.5, 0 ],
    [ a, -0.5, 0 ],
    [ 0, -1, 0 ]
  ];
  // const hexgonPoints = polygonPath(6);
  const hexgonFill = fill([ points ]);
  const { positionsIndex, positions } = hexgonFill;
  layerData.forEach(element => {
    positionsIndex.forEach(pointIndex => {
      attribute.vertices.push(...element.coordinates);
      attribute.miter.push(positions[pointIndex][0], positions[pointIndex][1]);
      attribute.pickingIds.push(element.id);
      attribute.colors.push(...element.color);
    });
  });
  return attribute;
}
