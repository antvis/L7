import { mat4, vec3 } from 'gl-matrix';
// 该文件专门记录地球模式的数值

// 地球网格半径
export const EARTH_RADIUS = 100;
export const EARTH_SEGMENTS = 36;

export const EARTH_RADIUS_OUTER = 40;

/**
 * 角度转弧度
 * @param deg
 * @returns
 */
function torad(deg: number) {
  return (deg / 180) * Math.acos(-1);
}
/**
 * 经纬度转xyz
 * @param longitude 经度
 * @param latitude 纬度
 * @param radius 半径
 */
export function lglt2xyz(lnglat: [number, number]) {
  // TODO: + Math.PI/2 是为了对齐坐标
  const lng = torad(lnglat[0]) + Math.PI / 2;
  const lat = torad(lnglat[1]);

  // TODO: 手动增加一些偏移，减轻面的冲突
  const radius = EARTH_RADIUS + Math.random() * 0.4;

  const z = radius * Math.cos(lat) * Math.cos(lng);
  const x = radius * Math.cos(lat) * Math.sin(lng);
  const y = radius * Math.sin(lat);
  return [x, y, z];
}

/**
 * 构建地球球体网格
 * @param radius
 * @param opt
 * @returns
 */
export function primitiveSphere(
  radius: number,
  opt: {
    segments: number;
  },
) {
  const matRotY = mat4.create();
  const matRotZ = mat4.create();
  const up = vec3.fromValues(0, 1, 0);
  const tmpVec3 = vec3.fromValues(0, 0, 0);

  opt = opt || {};
  radius = typeof radius !== 'undefined' ? radius : 1;
  const segments = typeof opt.segments !== 'undefined' ? opt.segments : 32;

  const totalZRotationSteps = 2 + segments;
  const totalYRotationSteps = 2 * totalZRotationSteps;

  const indices = [];
  const indicesArr = [];
  const positions = [];
  const positionsArr = [];
  const normalArr = [];
  const uvs = [];

  for (
    let zRotationStep = 0;
    zRotationStep <= totalZRotationSteps;
    zRotationStep++
  ) {
    const normalizedZ = zRotationStep / totalZRotationSteps;
    const angleZ = normalizedZ * Math.PI;

    for (
      let yRotationStep = 0;
      yRotationStep <= totalYRotationSteps;
      yRotationStep++
    ) {
      const normalizedY = yRotationStep / totalYRotationSteps;
      const angleY = normalizedY * Math.PI * 2;

      mat4.identity(matRotZ);
      mat4.rotateZ(matRotZ, matRotZ, -angleZ);

      mat4.identity(matRotY);
      mat4.rotateY(matRotY, matRotY, angleY);

      vec3.transformMat4(tmpVec3, up, matRotZ);
      vec3.transformMat4(tmpVec3, tmpVec3, matRotY);

      vec3.scale(tmpVec3, tmpVec3, -radius);

      positions.push(tmpVec3.slice());
      positionsArr.push(...tmpVec3.slice());

      vec3.normalize(tmpVec3, tmpVec3);
      normalArr.push(...tmpVec3.slice());

      uvs.push([normalizedY, 1 - normalizedZ]);

      // position 和 uv 一起存储
      positionsArr.push(normalizedY, 1 - normalizedZ);
    }

    if (zRotationStep > 0) {
      const verticesCount = positions.length;
      let firstIndex = verticesCount - 2 * (totalYRotationSteps + 1);
      for (
        ;
        firstIndex + totalYRotationSteps + 2 < verticesCount;
        firstIndex++
      ) {
        indices.push([
          firstIndex,
          firstIndex + 1,
          firstIndex + totalYRotationSteps + 1,
        ]);

        indicesArr.push(
          firstIndex,
          firstIndex + 1,
          firstIndex + totalYRotationSteps + 1,
        );
        indices.push([
          firstIndex + totalYRotationSteps + 1,
          firstIndex + 1,
          firstIndex + totalYRotationSteps + 2,
        ]);
        indicesArr.push(
          firstIndex + totalYRotationSteps + 1,
          firstIndex + 1,
          firstIndex + totalYRotationSteps + 2,
        );
      }
    }
  }

  return {
    cells: indices,
    positions,
    uvs,
    positionsArr,
    indicesArr,
    normalArr,
  };
}
