/**
 * 对于 polyline-normal 的改进
 * 超过阈值，miter 转成 bevel 接头，
 * 要注意 Three.js 中默认 THREE.FrontFaceDirectionCCW
 * @see https://zhuanlan.zhihu.com/p/59541559
 */
import { direction, normal, computeMiter } from 'polyline-miter-util';
import { create, copy, dot } from 'gl-vec2';

function extrusions(positions, out, miters, point, normal, scale) {
  addNext(out, miters, normal, -scale);
  addNext(out, miters, normal, scale);
  positions.push(...point);
  positions.push(...point);
}

function addNext(out, miters, normal, length) {
  out.push(normal[0], normal[1], 0);
  miters.push(length);
}

function lineSegmentDistance(end, start) {
  const dx = start[0] - end[0];
  const dy = start[1] - end[1];
  const dz = start[2] - end[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export default function(points, closed, indexOffset) {
  const lineA = [ 0, 0 ];
  const lineB = [ 0, 0 ];
  const tangent = [ 0, 0 ];
  const miter = [ 0, 0 ];
  let _lastFlip = -1;
  let _started = false;
  let _normal = null;
  const tmp = create();
  let count = indexOffset || 0;
  const miterLimit = 3;

  const out = [];
  const attrPos = [];
  const attrIndex = [];
  const miters = [];
  const attrDistance = [ 0, 0 ];
  if (closed) {
    points = points.slice();
    points.push(points[0]);
  }

  const total = points.length;

  for (let i = 1; i < total; i++) {
    const index = count;
    const last = points[i - 1];
    const cur = points[i];
    const next = i < points.length - 1 ? points[i + 1] : null;
    const d = lineSegmentDistance(cur, last) + attrDistance[attrDistance.length - 1];

    direction(lineA, cur, last);

    if (!_normal) {
      _normal = [ 0, 0 ];
      normal(_normal, lineA);
    }

    if (!_started) {
      _started = true;
      extrusions(attrPos, out, miters, last, _normal, 1);
    }

    attrIndex.push(index + 0, index + 2, index + 1);

     // no miter, simple segment
    if (!next) {
       // reset normal
      normal(_normal, lineA);
      extrusions(attrPos, out, miters, cur, _normal, 1);
      attrDistance.push(d, d);
      attrIndex.push(index + 1, index + 2, index + 3);
      count += 2;
    } else {
      // get unit dir of next line
      direction(lineB, next, cur);

      // stores tangent & miter
      let miterLen = computeMiter(tangent, miter, lineA, lineB, 1);

      // get orientation
      const flip = (dot(tangent, _normal) < 0) ? -1 : 1;
      const bevel = Math.abs(miterLen) > miterLimit;

      // 处理前后两条线段重合的情况，这种情况不需要使用任何接头（miter/bevel）。
      // 理论上这种情况下 miterLen = Infinity，本应通过 isFinite(miterLen) 判断，
      // 但是 AMap 投影变换后丢失精度，只能通过一个阈值（1000）判断。
      if (Math.abs(miterLen) > 1000) {
        normal(_normal, lineA);
        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrDistance.push(d, d);
        const indexData = _lastFlip === 1 ? [ index + 1, index + 3, index + 2 ]
        : [ index, index + 2, index + 3 ];
        attrIndex.push(...indexData);

        // 避免在 Material 中使用 THREE.DoubleSide
        attrIndex.push(index + 2, index + 3, index + 4);

        count += 2;
        _lastFlip = -1;
        continue;
      }

      if (bevel) {
        miterLen = miterLimit;

        // next two points in our first segment
        extrusions(attrPos, out, miters, cur, _normal, 1);

        attrIndex.push(index + 1, index + 2, index + 3);

        // now add the bevel triangle
        attrIndex.push(...(flip === 1 ? [ index + 2, index + 4, index + 5 ] : [ index + 4, index + 5, index + 3 ]));

        normal(tmp, lineB);
        copy(_normal, tmp); // store normal for next round

        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrDistance.push(d, d, d, d);

        // the miter is now the normal for our next join
        count += 4;
      } else {
        // next two points in our first segment
        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrIndex.push(index + 1, index + 2, index + 3);

        // now add the miter triangles
        addNext(out, miters, miter, miterLen * -flip);
        attrPos.push(...cur);
        attrIndex.push(index + 2, index + 4, index + 3);
        attrIndex.push(index + 4, index + 5, index + 6);
        normal(tmp, lineB);
        copy(_normal, tmp); // store normal for next round

        extrusions(attrPos, out, miters, cur, _normal, 1);
        attrDistance.push(d, d, d, d, d);

        // the miter is now the normal for our next join
        count += 5;
      }
      _lastFlip = flip;
    }
  }

  return {
    normals: out,
    attrIndex,
    attrPos,
    attrDistance,
    miters
  };
}
