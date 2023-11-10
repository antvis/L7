import { IEncodeFeature } from '@antv/l7-core';
import { ILineArrow } from './interface';
// Arrow  Line


// Half Edge
export function FlowHalfArrowFillTriangulation(feature: IEncodeFeature) {
    // @ts-ignore
  const coord = (feature.coordinates as Array<[number, number]>).flat();
  console.log(coord);
  const tin = 1;
  const tout = 1.0;
  return {
    vertices: [
      1,
      0,
      0,
      ...coord, // 0
      1,
      2,
      -3,
      ...coord, // 1
      1,
      1,
      -3,
      ...coord, // 2
      0,
      1,
      0,
      ...coord, // 3
      0,
      0,
      0,
      ...coord, // 4
      1,
      0,
      0,
      ...coord, // 0
      1,
      2,
      -3,
      ...coord, // 1
      1,
      1,
      -3,
      ...coord, // 2
      0,
      1,
      0,
      ...coord, // 3
      0,
      0,
      0,
      ...coord, // 4
    ],
    normals: [
      -tin,
      2 * tout,
      1, // 0
      2 * tout,
      -tout,
      1, // 1
      tout,
      -tout,
      1, // 2
      tout,
      -tout,
      1, // 3
      -tin,
      -tout,
      1, // 4
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
    indices: [0, 1, 2, 0, 2, 3, 0, 3, 4, 5, 6, 7, 5, 7, 8, 5, 8, 9],
    size: 7,
  };
   
}

// Start Arrow
export function FlowStartArrowFillTriangulation(feature: IEncodeFeature, arrowOption: ILineArrow) {
    // @ts-ignore
    const coord = (feature.coordinates as Array<[number, number]>).flat();
    const tin = 1;
    const tout = 1.0;
    let indices = [0, 1, 6, 2, 3, 4, 2, 4, 5];
    if (arrowOption.position === 'both') {
        indices = [0, 1, 6, 2, 3, 4, 2, 4, 5, 7, 8, 9];
    }
    if (arrowOption.position === 'start') {
        indices = [2, 3, 4, 2, 4, 5, 7, 8, 9];
    }

    const vertices = [
        1,
        0,
        0,
        ...coord, // 0
        1,
        2, // 垂直
        -3, // 水平
        ...coord, // 1
        1,
        1 * 0.5, // 垂直
        -3,//  水平
        ...coord, // 2
        0,
        1 * 0.5,
        3,
        ...coord, // 3
        0,
        -1 * 0.5,// 垂直
        3,
        ...coord, // 4
        1,
        -1 * 0.5, // 垂直
        -3, // 水平
        ...coord, // 5
        1,
        -2, // 垂直
        -3,//  水平
        ...coord, // 6
        0,
        2, // 垂直
        3,
        ...coord, // 7
        0,
        0,
        0,
        ...coord, // 8
        0,
        -2, // 垂直
        3,
        ...coord, // 9
    ];

    return {
        vertices: [...vertices, ...vertices],
        normals: [
            0 * tin,
            2 * tout,
            1, // 0
            2 * tout,
            -tout,
            1, // 1
            tout,
            tout,// start 为 + 
            1, // 2
            tout,
            -tout,
            1, // 3
            -tin,
            -tout,
            1, // 4
            -tout,
            tout,//水平 start 为 +  other false
            1, // 5
            -2 * tout,
            -tout,
            1, // 6
            2 * tout,
            tout,
            1, // 7
            0,
            -2 * tout,
            1, // 8
            -2 * tin,
            1 * tout,
            1, // 9

            ...new Array(30).fill(0)],
        indices: [...indices, ...indices.map((i) => i + 10)],
        size: 7,
    };
}


export function FlowLineTriangulation(feature: IEncodeFeature, arrowOption?: unknown) {
    return (arrowOption as ILineArrow)?.type === 'arrow' ? FlowStartArrowFillTriangulation(feature, arrowOption as ILineArrow) : FlowHalfArrowFillTriangulation(feature);
}