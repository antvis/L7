import { packUint8ToFloat } from '../../../util/vertex-compress';

const LEFT_SHIFT18 = 262144.0;
const LEFT_SHIFT20 = 1048576.0;

export default function circleBuffer(layerData) {
  const index = [];
  const aPosition = [];
  const aPackedData = [];
  layerData.forEach(({ size = 0, color, id, coordinates }, i) => {

    if (isNaN(size)) {
      size = 0;
    }

    // pack color(vec4) into vec2
    const packedColor = [
      packUint8ToFloat(color[0] * 255, color[1] * 255),
      packUint8ToFloat(color[2] * 255, color[3] * 255)
    ];

    // construct point coords
    [
      [ -1, -1 ],
      [ 1, -1 ],
      [ 1, 1 ],
      [ -1, 1 ]
    ].forEach(extrude => {
      // vec4(color, color, (4-bit extrude, 16-bit size), id)
      aPackedData.push(
        ...packedColor,
        (extrude[0] + 1) * LEFT_SHIFT20 + (extrude[1] + 1) * LEFT_SHIFT18 + size,
        id
      );
    });

    // TODO：如果使用相对瓦片坐标，还可以进一步压缩
    aPosition.push(...coordinates, ...coordinates, ...coordinates, ...coordinates);
    index.push(...[ 0, 1, 2, 0, 2, 3 ].map(n => n + i * 4));
  });
  return {
    aPosition,
    index,
    aPackedData
  };
}
