import { packUint8ToFloat } from '../../../util/vertex-compress';
import Global from '../../../global';
const { pointShape } = Global;

const LEFT_SHIFT17 = 131072.0;
// const LEFT_SHIFT18 = 262144.0;
// const LEFT_SHIFT19 = 524288.0;
// const LEFT_SHIFT20 = 1048576.0;
const LEFT_SHIFT21 = 2097152.0;
// const LEFT_SHIFT22 = 4194304.0;
const LEFT_SHIFT23 = 8388608.0;
// const LEFT_SHIFT24 = 16777216.0;

export default function circleBuffer(layerData) {
  const index = [];
  const aPosition = [];
  const aPackedData = [];

  layerData.forEach(({ size = 0, color, id, coordinates, shape }, i) => {

    const shapeIndex = pointShape['2d'].indexOf(shape) || 0;

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
      // vec4(color, color, (4-bit extrude, 4-bit shape, 16-bit size), id)
      aPackedData.push(
        ...packedColor,
        (extrude[0] + 1) * LEFT_SHIFT23 + (extrude[1] + 1) * LEFT_SHIFT21
          + shapeIndex * LEFT_SHIFT17
          + size,
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
