import { lngLatToMeters } from '@antv/l7-utils';
import earcut from 'earcut';

export function MultipleOfFourNumber(num: number) {
  return Math.max(Math.ceil(num / 4) * 4, 4);
}

/**
 * Get vertex indices for drawing polygon mesh (triangulation)
 */
export function getPolygonSurfaceIndices(
  positions: number[],
  holeIndices: number[],
  positionSize: number,
  preproject = true,
) {
  const is3d = positionSize === 3;

  if (preproject) {
    positions = positions.slice();
    const p: number[] = [];
    for (let i = 0; i < positions.length; i += positionSize) {
      p[0] = positions[i];
      p[1] = positions[i + 1];

      if (is3d) {
        p[2] = positions[i + 2];
      }

      // earcut is a 2D triangulation algorithm, and handles 3D data as if it was projected onto the XY plane
      const xy = lngLatToMeters(p, true, { enable: false, decimal: 1 });

      positions[i] = xy[0];
      positions[i + 1] = xy[1];

      if (is3d) {
        positions[i + 2] = xy[2];
      }
    }
  }

  const indices = earcut(positions, holeIndices, positionSize);

  return indices;
}
