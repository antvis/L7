export default function circleBuffer(layerData) {
  const index = [];
  const aExtrude = [];
  const aRadius = [];
  const aColor = [];
  const aPickingId = [];
  const aPosition = [];
  layerData.forEach(({ size = 0, color, id, coordinates }, i) => {
    // construct point coords
    aExtrude.push(-1, -1, 1, -1, 1, 1, -1, 1);
    aRadius.push(size, size, size, size);
    aColor.push(...color, ...color, ...color, ...color);
    aPickingId.push(id, id, id, id);
    aPosition.push(...coordinates, ...coordinates, ...coordinates, ...coordinates);
    index.push(...[ 0, 1, 2, 0, 2, 3 ].map(n => n + i * 4));
  });
  return {
    aExtrude,
    aRadius,
    aColor,
    aPickingId,
    aPosition,
    index
  };
}
