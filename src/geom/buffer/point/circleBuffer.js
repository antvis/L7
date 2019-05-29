import { packUint8ToFloat } from '../../../util/vertex-compress';

// const LEFT_SHIFT2 = 4.0;
// const LEFT_SHIFT4 = 16.0;
const LEFT_SHIFT8 = 256.0;
const LEFT_SHIFT10 = 1024.0;
// const LEFT_SHIFT12 = 4096.0;

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
      // vec4(color, color, (8-bit size, 4-bit extrude), id)
      aPackedData.push(
        ...packedColor,
        size + (extrude[0] + 1) * LEFT_SHIFT8 + (extrude[1] + 1) * LEFT_SHIFT10,
        id
      );
    });

    aPosition.push(...coordinates, ...coordinates, ...coordinates, ...coordinates);
    index.push(...[ 0, 1, 2, 0, 2, 3 ].map(n => n + i * 4));
  });
  return {
    aPosition,
    index,
    aPackedData
  };
}
