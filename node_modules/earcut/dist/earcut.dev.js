(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.earcut = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

module.exports = earcut;
module.exports.default = earcut;

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

    var minX, minY, maxX, maxY, x, y, invSize;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 1 / invSize : 0;
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) break;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            removeNode(ear);

            // skipping the next vertex leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, invSize) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

    // z-order range for the current triangle bbox;
    var minZ = zOrder(minTX, minTY, minX, minY, invSize),
        maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

    var p = ear.prevZ,
        n = ear.nextZ;

    // look for points inside the triangle in both directions
    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;

        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    // look for remaining points in decreasing z-order
    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    // look for remaining points in increasing z-order
    while (n && n.z <= maxZ) {
        if (n !== ear.prev && n !== ear.next &&
            pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return filterPoints(p);
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, invSize);
                earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        eliminateHole(queue[i], outerNode);
        outerNode = filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    outerNode = findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = splitPolygon(outerNode, hole);
        filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m;

    do {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if (locallyInside(p, hole) &&
                (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    } while (p !== stop);

    return m;
}

// whether sector in vertex m contains sector in vertex p in the same coordinates
function sectorContainsSector(m, p) {
    return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
    var p = start;
    do {
        if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }
            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
           (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
            (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
            equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    var o1 = sign(area(p1, q1, p2));
    var o2 = sign(area(p1, q1, q2));
    var o3 = sign(area(p2, q2, p1));
    var o4 = sign(area(p2, q2, q1));

    if (o1 !== o2 && o3 !== o4) return true; // general case

    if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
    if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
    if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
    if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

    return false;
}

// for collinear points p, q, r, check if point q lies on segment pr
function onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

function sign(num) {
    return num > 0 ? 1 : num < 0 ? -1 : 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertex index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertex nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZWFyY3V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBlYXJjdXQ7XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gZWFyY3V0O1xuXG5mdW5jdGlvbiBlYXJjdXQoZGF0YSwgaG9sZUluZGljZXMsIGRpbSkge1xuXG4gICAgZGltID0gZGltIHx8IDI7XG5cbiAgICB2YXIgaGFzSG9sZXMgPSBob2xlSW5kaWNlcyAmJiBob2xlSW5kaWNlcy5sZW5ndGgsXG4gICAgICAgIG91dGVyTGVuID0gaGFzSG9sZXMgPyBob2xlSW5kaWNlc1swXSAqIGRpbSA6IGRhdGEubGVuZ3RoLFxuICAgICAgICBvdXRlck5vZGUgPSBsaW5rZWRMaXN0KGRhdGEsIDAsIG91dGVyTGVuLCBkaW0sIHRydWUpLFxuICAgICAgICB0cmlhbmdsZXMgPSBbXTtcblxuICAgIGlmICghb3V0ZXJOb2RlIHx8IG91dGVyTm9kZS5uZXh0ID09PSBvdXRlck5vZGUucHJldikgcmV0dXJuIHRyaWFuZ2xlcztcblxuICAgIHZhciBtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZLCB4LCB5LCBpbnZTaXplO1xuXG4gICAgaWYgKGhhc0hvbGVzKSBvdXRlck5vZGUgPSBlbGltaW5hdGVIb2xlcyhkYXRhLCBob2xlSW5kaWNlcywgb3V0ZXJOb2RlLCBkaW0pO1xuXG4gICAgLy8gaWYgdGhlIHNoYXBlIGlzIG5vdCB0b28gc2ltcGxlLCB3ZSdsbCB1c2Ugei1vcmRlciBjdXJ2ZSBoYXNoIGxhdGVyOyBjYWxjdWxhdGUgcG9seWdvbiBiYm94XG4gICAgaWYgKGRhdGEubGVuZ3RoID4gODAgKiBkaW0pIHtcbiAgICAgICAgbWluWCA9IG1heFggPSBkYXRhWzBdO1xuICAgICAgICBtaW5ZID0gbWF4WSA9IGRhdGFbMV07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IGRpbTsgaSA8IG91dGVyTGVuOyBpICs9IGRpbSkge1xuICAgICAgICAgICAgeCA9IGRhdGFbaV07XG4gICAgICAgICAgICB5ID0gZGF0YVtpICsgMV07XG4gICAgICAgICAgICBpZiAoeCA8IG1pblgpIG1pblggPSB4O1xuICAgICAgICAgICAgaWYgKHkgPCBtaW5ZKSBtaW5ZID0geTtcbiAgICAgICAgICAgIGlmICh4ID4gbWF4WCkgbWF4WCA9IHg7XG4gICAgICAgICAgICBpZiAoeSA+IG1heFkpIG1heFkgPSB5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWluWCwgbWluWSBhbmQgaW52U2l6ZSBhcmUgbGF0ZXIgdXNlZCB0byB0cmFuc2Zvcm0gY29vcmRzIGludG8gaW50ZWdlcnMgZm9yIHotb3JkZXIgY2FsY3VsYXRpb25cbiAgICAgICAgaW52U2l6ZSA9IE1hdGgubWF4KG1heFggLSBtaW5YLCBtYXhZIC0gbWluWSk7XG4gICAgICAgIGludlNpemUgPSBpbnZTaXplICE9PSAwID8gMSAvIGludlNpemUgOiAwO1xuICAgIH1cblxuICAgIGVhcmN1dExpbmtlZChvdXRlck5vZGUsIHRyaWFuZ2xlcywgZGltLCBtaW5YLCBtaW5ZLCBpbnZTaXplKTtcblxuICAgIHJldHVybiB0cmlhbmdsZXM7XG59XG5cbi8vIGNyZWF0ZSBhIGNpcmN1bGFyIGRvdWJseSBsaW5rZWQgbGlzdCBmcm9tIHBvbHlnb24gcG9pbnRzIGluIHRoZSBzcGVjaWZpZWQgd2luZGluZyBvcmRlclxuZnVuY3Rpb24gbGlua2VkTGlzdChkYXRhLCBzdGFydCwgZW5kLCBkaW0sIGNsb2Nrd2lzZSkge1xuICAgIHZhciBpLCBsYXN0O1xuXG4gICAgaWYgKGNsb2Nrd2lzZSA9PT0gKHNpZ25lZEFyZWEoZGF0YSwgc3RhcnQsIGVuZCwgZGltKSA+IDApKSB7XG4gICAgICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IGRpbSkgbGFzdCA9IGluc2VydE5vZGUoaSwgZGF0YVtpXSwgZGF0YVtpICsgMV0sIGxhc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IGVuZCAtIGRpbTsgaSA+PSBzdGFydDsgaSAtPSBkaW0pIGxhc3QgPSBpbnNlcnROb2RlKGksIGRhdGFbaV0sIGRhdGFbaSArIDFdLCBsYXN0KTtcbiAgICB9XG5cbiAgICBpZiAobGFzdCAmJiBlcXVhbHMobGFzdCwgbGFzdC5uZXh0KSkge1xuICAgICAgICByZW1vdmVOb2RlKGxhc3QpO1xuICAgICAgICBsYXN0ID0gbGFzdC5uZXh0O1xuICAgIH1cblxuICAgIHJldHVybiBsYXN0O1xufVxuXG4vLyBlbGltaW5hdGUgY29saW5lYXIgb3IgZHVwbGljYXRlIHBvaW50c1xuZnVuY3Rpb24gZmlsdGVyUG9pbnRzKHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoIXN0YXJ0KSByZXR1cm4gc3RhcnQ7XG4gICAgaWYgKCFlbmQpIGVuZCA9IHN0YXJ0O1xuXG4gICAgdmFyIHAgPSBzdGFydCxcbiAgICAgICAgYWdhaW47XG4gICAgZG8ge1xuICAgICAgICBhZ2FpbiA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghcC5zdGVpbmVyICYmIChlcXVhbHMocCwgcC5uZXh0KSB8fCBhcmVhKHAucHJldiwgcCwgcC5uZXh0KSA9PT0gMCkpIHtcbiAgICAgICAgICAgIHJlbW92ZU5vZGUocCk7XG4gICAgICAgICAgICBwID0gZW5kID0gcC5wcmV2O1xuICAgICAgICAgICAgaWYgKHAgPT09IHAubmV4dCkgYnJlYWs7XG4gICAgICAgICAgICBhZ2FpbiA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAgPSBwLm5leHQ7XG4gICAgICAgIH1cbiAgICB9IHdoaWxlIChhZ2FpbiB8fCBwICE9PSBlbmQpO1xuXG4gICAgcmV0dXJuIGVuZDtcbn1cblxuLy8gbWFpbiBlYXIgc2xpY2luZyBsb29wIHdoaWNoIHRyaWFuZ3VsYXRlcyBhIHBvbHlnb24gKGdpdmVuIGFzIGEgbGlua2VkIGxpc3QpXG5mdW5jdGlvbiBlYXJjdXRMaW5rZWQoZWFyLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgaW52U2l6ZSwgcGFzcykge1xuICAgIGlmICghZWFyKSByZXR1cm47XG5cbiAgICAvLyBpbnRlcmxpbmsgcG9seWdvbiBub2RlcyBpbiB6LW9yZGVyXG4gICAgaWYgKCFwYXNzICYmIGludlNpemUpIGluZGV4Q3VydmUoZWFyLCBtaW5YLCBtaW5ZLCBpbnZTaXplKTtcblxuICAgIHZhciBzdG9wID0gZWFyLFxuICAgICAgICBwcmV2LCBuZXh0O1xuXG4gICAgLy8gaXRlcmF0ZSB0aHJvdWdoIGVhcnMsIHNsaWNpbmcgdGhlbSBvbmUgYnkgb25lXG4gICAgd2hpbGUgKGVhci5wcmV2ICE9PSBlYXIubmV4dCkge1xuICAgICAgICBwcmV2ID0gZWFyLnByZXY7XG4gICAgICAgIG5leHQgPSBlYXIubmV4dDtcblxuICAgICAgICBpZiAoaW52U2l6ZSA/IGlzRWFySGFzaGVkKGVhciwgbWluWCwgbWluWSwgaW52U2l6ZSkgOiBpc0VhcihlYXIpKSB7XG4gICAgICAgICAgICAvLyBjdXQgb2ZmIHRoZSB0cmlhbmdsZVxuICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2gocHJldi5pIC8gZGltKTtcbiAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKGVhci5pIC8gZGltKTtcbiAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKG5leHQuaSAvIGRpbSk7XG5cbiAgICAgICAgICAgIHJlbW92ZU5vZGUoZWFyKTtcblxuICAgICAgICAgICAgLy8gc2tpcHBpbmcgdGhlIG5leHQgdmVydGV4IGxlYWRzIHRvIGxlc3Mgc2xpdmVyIHRyaWFuZ2xlc1xuICAgICAgICAgICAgZWFyID0gbmV4dC5uZXh0O1xuICAgICAgICAgICAgc3RvcCA9IG5leHQubmV4dDtcblxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBlYXIgPSBuZXh0O1xuXG4gICAgICAgIC8vIGlmIHdlIGxvb3BlZCB0aHJvdWdoIHRoZSB3aG9sZSByZW1haW5pbmcgcG9seWdvbiBhbmQgY2FuJ3QgZmluZCBhbnkgbW9yZSBlYXJzXG4gICAgICAgIGlmIChlYXIgPT09IHN0b3ApIHtcbiAgICAgICAgICAgIC8vIHRyeSBmaWx0ZXJpbmcgcG9pbnRzIGFuZCBzbGljaW5nIGFnYWluXG4gICAgICAgICAgICBpZiAoIXBhc3MpIHtcbiAgICAgICAgICAgICAgICBlYXJjdXRMaW5rZWQoZmlsdGVyUG9pbnRzKGVhciksIHRyaWFuZ2xlcywgZGltLCBtaW5YLCBtaW5ZLCBpbnZTaXplLCAxKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhpcyBkaWRuJ3Qgd29yaywgdHJ5IGN1cmluZyBhbGwgc21hbGwgc2VsZi1pbnRlcnNlY3Rpb25zIGxvY2FsbHlcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFzcyA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGVhciA9IGN1cmVMb2NhbEludGVyc2VjdGlvbnMoZmlsdGVyUG9pbnRzKGVhciksIHRyaWFuZ2xlcywgZGltKTtcbiAgICAgICAgICAgICAgICBlYXJjdXRMaW5rZWQoZWFyLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgaW52U2l6ZSwgMik7XG5cbiAgICAgICAgICAgIC8vIGFzIGEgbGFzdCByZXNvcnQsIHRyeSBzcGxpdHRpbmcgdGhlIHJlbWFpbmluZyBwb2x5Z29uIGludG8gdHdvXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhc3MgPT09IDIpIHtcbiAgICAgICAgICAgICAgICBzcGxpdEVhcmN1dChlYXIsIHRyaWFuZ2xlcywgZGltLCBtaW5YLCBtaW5ZLCBpbnZTaXplKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGNoZWNrIHdoZXRoZXIgYSBwb2x5Z29uIG5vZGUgZm9ybXMgYSB2YWxpZCBlYXIgd2l0aCBhZGphY2VudCBub2Rlc1xuZnVuY3Rpb24gaXNFYXIoZWFyKSB7XG4gICAgdmFyIGEgPSBlYXIucHJldixcbiAgICAgICAgYiA9IGVhcixcbiAgICAgICAgYyA9IGVhci5uZXh0O1xuXG4gICAgaWYgKGFyZWEoYSwgYiwgYykgPj0gMCkgcmV0dXJuIGZhbHNlOyAvLyByZWZsZXgsIGNhbid0IGJlIGFuIGVhclxuXG4gICAgLy8gbm93IG1ha2Ugc3VyZSB3ZSBkb24ndCBoYXZlIG90aGVyIHBvaW50cyBpbnNpZGUgdGhlIHBvdGVudGlhbCBlYXJcbiAgICB2YXIgcCA9IGVhci5uZXh0Lm5leHQ7XG5cbiAgICB3aGlsZSAocCAhPT0gZWFyLnByZXYpIHtcbiAgICAgICAgaWYgKHBvaW50SW5UcmlhbmdsZShhLngsIGEueSwgYi54LCBiLnksIGMueCwgYy55LCBwLngsIHAueSkgJiZcbiAgICAgICAgICAgIGFyZWEocC5wcmV2LCBwLCBwLm5leHQpID49IDApIHJldHVybiBmYWxzZTtcbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNFYXJIYXNoZWQoZWFyLCBtaW5YLCBtaW5ZLCBpbnZTaXplKSB7XG4gICAgdmFyIGEgPSBlYXIucHJldixcbiAgICAgICAgYiA9IGVhcixcbiAgICAgICAgYyA9IGVhci5uZXh0O1xuXG4gICAgaWYgKGFyZWEoYSwgYiwgYykgPj0gMCkgcmV0dXJuIGZhbHNlOyAvLyByZWZsZXgsIGNhbid0IGJlIGFuIGVhclxuXG4gICAgLy8gdHJpYW5nbGUgYmJveDsgbWluICYgbWF4IGFyZSBjYWxjdWxhdGVkIGxpa2UgdGhpcyBmb3Igc3BlZWRcbiAgICB2YXIgbWluVFggPSBhLnggPCBiLnggPyAoYS54IDwgYy54ID8gYS54IDogYy54KSA6IChiLnggPCBjLnggPyBiLnggOiBjLngpLFxuICAgICAgICBtaW5UWSA9IGEueSA8IGIueSA/IChhLnkgPCBjLnkgPyBhLnkgOiBjLnkpIDogKGIueSA8IGMueSA/IGIueSA6IGMueSksXG4gICAgICAgIG1heFRYID0gYS54ID4gYi54ID8gKGEueCA+IGMueCA/IGEueCA6IGMueCkgOiAoYi54ID4gYy54ID8gYi54IDogYy54KSxcbiAgICAgICAgbWF4VFkgPSBhLnkgPiBiLnkgPyAoYS55ID4gYy55ID8gYS55IDogYy55KSA6IChiLnkgPiBjLnkgPyBiLnkgOiBjLnkpO1xuXG4gICAgLy8gei1vcmRlciByYW5nZSBmb3IgdGhlIGN1cnJlbnQgdHJpYW5nbGUgYmJveDtcbiAgICB2YXIgbWluWiA9IHpPcmRlcihtaW5UWCwgbWluVFksIG1pblgsIG1pblksIGludlNpemUpLFxuICAgICAgICBtYXhaID0gek9yZGVyKG1heFRYLCBtYXhUWSwgbWluWCwgbWluWSwgaW52U2l6ZSk7XG5cbiAgICB2YXIgcCA9IGVhci5wcmV2WixcbiAgICAgICAgbiA9IGVhci5uZXh0WjtcblxuICAgIC8vIGxvb2sgZm9yIHBvaW50cyBpbnNpZGUgdGhlIHRyaWFuZ2xlIGluIGJvdGggZGlyZWN0aW9uc1xuICAgIHdoaWxlIChwICYmIHAueiA+PSBtaW5aICYmIG4gJiYgbi56IDw9IG1heFopIHtcbiAgICAgICAgaWYgKHAgIT09IGVhci5wcmV2ICYmIHAgIT09IGVhci5uZXh0ICYmXG4gICAgICAgICAgICBwb2ludEluVHJpYW5nbGUoYS54LCBhLnksIGIueCwgYi55LCBjLngsIGMueSwgcC54LCBwLnkpICYmXG4gICAgICAgICAgICBhcmVhKHAucHJldiwgcCwgcC5uZXh0KSA+PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHAgPSBwLnByZXZaO1xuXG4gICAgICAgIGlmIChuICE9PSBlYXIucHJldiAmJiBuICE9PSBlYXIubmV4dCAmJlxuICAgICAgICAgICAgcG9pbnRJblRyaWFuZ2xlKGEueCwgYS55LCBiLngsIGIueSwgYy54LCBjLnksIG4ueCwgbi55KSAmJlxuICAgICAgICAgICAgYXJlYShuLnByZXYsIG4sIG4ubmV4dCkgPj0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBuID0gbi5uZXh0WjtcbiAgICB9XG5cbiAgICAvLyBsb29rIGZvciByZW1haW5pbmcgcG9pbnRzIGluIGRlY3JlYXNpbmcgei1vcmRlclxuICAgIHdoaWxlIChwICYmIHAueiA+PSBtaW5aKSB7XG4gICAgICAgIGlmIChwICE9PSBlYXIucHJldiAmJiBwICE9PSBlYXIubmV4dCAmJlxuICAgICAgICAgICAgcG9pbnRJblRyaWFuZ2xlKGEueCwgYS55LCBiLngsIGIueSwgYy54LCBjLnksIHAueCwgcC55KSAmJlxuICAgICAgICAgICAgYXJlYShwLnByZXYsIHAsIHAubmV4dCkgPj0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBwID0gcC5wcmV2WjtcbiAgICB9XG5cbiAgICAvLyBsb29rIGZvciByZW1haW5pbmcgcG9pbnRzIGluIGluY3JlYXNpbmcgei1vcmRlclxuICAgIHdoaWxlIChuICYmIG4ueiA8PSBtYXhaKSB7XG4gICAgICAgIGlmIChuICE9PSBlYXIucHJldiAmJiBuICE9PSBlYXIubmV4dCAmJlxuICAgICAgICAgICAgcG9pbnRJblRyaWFuZ2xlKGEueCwgYS55LCBiLngsIGIueSwgYy54LCBjLnksIG4ueCwgbi55KSAmJlxuICAgICAgICAgICAgYXJlYShuLnByZXYsIG4sIG4ubmV4dCkgPj0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBuID0gbi5uZXh0WjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gZ28gdGhyb3VnaCBhbGwgcG9seWdvbiBub2RlcyBhbmQgY3VyZSBzbWFsbCBsb2NhbCBzZWxmLWludGVyc2VjdGlvbnNcbmZ1bmN0aW9uIGN1cmVMb2NhbEludGVyc2VjdGlvbnMoc3RhcnQsIHRyaWFuZ2xlcywgZGltKSB7XG4gICAgdmFyIHAgPSBzdGFydDtcbiAgICBkbyB7XG4gICAgICAgIHZhciBhID0gcC5wcmV2LFxuICAgICAgICAgICAgYiA9IHAubmV4dC5uZXh0O1xuXG4gICAgICAgIGlmICghZXF1YWxzKGEsIGIpICYmIGludGVyc2VjdHMoYSwgcCwgcC5uZXh0LCBiKSAmJiBsb2NhbGx5SW5zaWRlKGEsIGIpICYmIGxvY2FsbHlJbnNpZGUoYiwgYSkpIHtcblxuICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2goYS5pIC8gZGltKTtcbiAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKHAuaSAvIGRpbSk7XG4gICAgICAgICAgICB0cmlhbmdsZXMucHVzaChiLmkgLyBkaW0pO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgdHdvIG5vZGVzIGludm9sdmVkXG4gICAgICAgICAgICByZW1vdmVOb2RlKHApO1xuICAgICAgICAgICAgcmVtb3ZlTm9kZShwLm5leHQpO1xuXG4gICAgICAgICAgICBwID0gc3RhcnQgPSBiO1xuICAgICAgICB9XG4gICAgICAgIHAgPSBwLm5leHQ7XG4gICAgfSB3aGlsZSAocCAhPT0gc3RhcnQpO1xuXG4gICAgcmV0dXJuIGZpbHRlclBvaW50cyhwKTtcbn1cblxuLy8gdHJ5IHNwbGl0dGluZyBwb2x5Z29uIGludG8gdHdvIGFuZCB0cmlhbmd1bGF0ZSB0aGVtIGluZGVwZW5kZW50bHlcbmZ1bmN0aW9uIHNwbGl0RWFyY3V0KHN0YXJ0LCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgaW52U2l6ZSkge1xuICAgIC8vIGxvb2sgZm9yIGEgdmFsaWQgZGlhZ29uYWwgdGhhdCBkaXZpZGVzIHRoZSBwb2x5Z29uIGludG8gdHdvXG4gICAgdmFyIGEgPSBzdGFydDtcbiAgICBkbyB7XG4gICAgICAgIHZhciBiID0gYS5uZXh0Lm5leHQ7XG4gICAgICAgIHdoaWxlIChiICE9PSBhLnByZXYpIHtcbiAgICAgICAgICAgIGlmIChhLmkgIT09IGIuaSAmJiBpc1ZhbGlkRGlhZ29uYWwoYSwgYikpIHtcbiAgICAgICAgICAgICAgICAvLyBzcGxpdCB0aGUgcG9seWdvbiBpbiB0d28gYnkgdGhlIGRpYWdvbmFsXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBzcGxpdFBvbHlnb24oYSwgYik7XG5cbiAgICAgICAgICAgICAgICAvLyBmaWx0ZXIgY29saW5lYXIgcG9pbnRzIGFyb3VuZCB0aGUgY3V0c1xuICAgICAgICAgICAgICAgIGEgPSBmaWx0ZXJQb2ludHMoYSwgYS5uZXh0KTtcbiAgICAgICAgICAgICAgICBjID0gZmlsdGVyUG9pbnRzKGMsIGMubmV4dCk7XG5cbiAgICAgICAgICAgICAgICAvLyBydW4gZWFyY3V0IG9uIGVhY2ggaGFsZlxuICAgICAgICAgICAgICAgIGVhcmN1dExpbmtlZChhLCB0cmlhbmdsZXMsIGRpbSwgbWluWCwgbWluWSwgaW52U2l6ZSk7XG4gICAgICAgICAgICAgICAgZWFyY3V0TGlua2VkKGMsIHRyaWFuZ2xlcywgZGltLCBtaW5YLCBtaW5ZLCBpbnZTaXplKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiID0gYi5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIGEgPSBhLm5leHQ7XG4gICAgfSB3aGlsZSAoYSAhPT0gc3RhcnQpO1xufVxuXG4vLyBsaW5rIGV2ZXJ5IGhvbGUgaW50byB0aGUgb3V0ZXIgbG9vcCwgcHJvZHVjaW5nIGEgc2luZ2xlLXJpbmcgcG9seWdvbiB3aXRob3V0IGhvbGVzXG5mdW5jdGlvbiBlbGltaW5hdGVIb2xlcyhkYXRhLCBob2xlSW5kaWNlcywgb3V0ZXJOb2RlLCBkaW0pIHtcbiAgICB2YXIgcXVldWUgPSBbXSxcbiAgICAgICAgaSwgbGVuLCBzdGFydCwgZW5kLCBsaXN0O1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gaG9sZUluZGljZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc3RhcnQgPSBob2xlSW5kaWNlc1tpXSAqIGRpbTtcbiAgICAgICAgZW5kID0gaSA8IGxlbiAtIDEgPyBob2xlSW5kaWNlc1tpICsgMV0gKiBkaW0gOiBkYXRhLmxlbmd0aDtcbiAgICAgICAgbGlzdCA9IGxpbmtlZExpc3QoZGF0YSwgc3RhcnQsIGVuZCwgZGltLCBmYWxzZSk7XG4gICAgICAgIGlmIChsaXN0ID09PSBsaXN0Lm5leHQpIGxpc3Quc3RlaW5lciA9IHRydWU7XG4gICAgICAgIHF1ZXVlLnB1c2goZ2V0TGVmdG1vc3QobGlzdCkpO1xuICAgIH1cblxuICAgIHF1ZXVlLnNvcnQoY29tcGFyZVgpO1xuXG4gICAgLy8gcHJvY2VzcyBob2xlcyBmcm9tIGxlZnQgdG8gcmlnaHRcbiAgICBmb3IgKGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWxpbWluYXRlSG9sZShxdWV1ZVtpXSwgb3V0ZXJOb2RlKTtcbiAgICAgICAgb3V0ZXJOb2RlID0gZmlsdGVyUG9pbnRzKG91dGVyTm9kZSwgb3V0ZXJOb2RlLm5leHQpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXRlck5vZGU7XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVYKGEsIGIpIHtcbiAgICByZXR1cm4gYS54IC0gYi54O1xufVxuXG4vLyBmaW5kIGEgYnJpZGdlIGJldHdlZW4gdmVydGljZXMgdGhhdCBjb25uZWN0cyBob2xlIHdpdGggYW4gb3V0ZXIgcmluZyBhbmQgYW5kIGxpbmsgaXRcbmZ1bmN0aW9uIGVsaW1pbmF0ZUhvbGUoaG9sZSwgb3V0ZXJOb2RlKSB7XG4gICAgb3V0ZXJOb2RlID0gZmluZEhvbGVCcmlkZ2UoaG9sZSwgb3V0ZXJOb2RlKTtcbiAgICBpZiAob3V0ZXJOb2RlKSB7XG4gICAgICAgIHZhciBiID0gc3BsaXRQb2x5Z29uKG91dGVyTm9kZSwgaG9sZSk7XG4gICAgICAgIGZpbHRlclBvaW50cyhiLCBiLm5leHQpO1xuICAgIH1cbn1cblxuLy8gRGF2aWQgRWJlcmx5J3MgYWxnb3JpdGhtIGZvciBmaW5kaW5nIGEgYnJpZGdlIGJldHdlZW4gaG9sZSBhbmQgb3V0ZXIgcG9seWdvblxuZnVuY3Rpb24gZmluZEhvbGVCcmlkZ2UoaG9sZSwgb3V0ZXJOb2RlKSB7XG4gICAgdmFyIHAgPSBvdXRlck5vZGUsXG4gICAgICAgIGh4ID0gaG9sZS54LFxuICAgICAgICBoeSA9IGhvbGUueSxcbiAgICAgICAgcXggPSAtSW5maW5pdHksXG4gICAgICAgIG07XG5cbiAgICAvLyBmaW5kIGEgc2VnbWVudCBpbnRlcnNlY3RlZCBieSBhIHJheSBmcm9tIHRoZSBob2xlJ3MgbGVmdG1vc3QgcG9pbnQgdG8gdGhlIGxlZnQ7XG4gICAgLy8gc2VnbWVudCdzIGVuZHBvaW50IHdpdGggbGVzc2VyIHggd2lsbCBiZSBwb3RlbnRpYWwgY29ubmVjdGlvbiBwb2ludFxuICAgIGRvIHtcbiAgICAgICAgaWYgKGh5IDw9IHAueSAmJiBoeSA+PSBwLm5leHQueSAmJiBwLm5leHQueSAhPT0gcC55KSB7XG4gICAgICAgICAgICB2YXIgeCA9IHAueCArIChoeSAtIHAueSkgKiAocC5uZXh0LnggLSBwLngpIC8gKHAubmV4dC55IC0gcC55KTtcbiAgICAgICAgICAgIGlmICh4IDw9IGh4ICYmIHggPiBxeCkge1xuICAgICAgICAgICAgICAgIHF4ID0geDtcbiAgICAgICAgICAgICAgICBpZiAoeCA9PT0gaHgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGh5ID09PSBwLnkpIHJldHVybiBwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaHkgPT09IHAubmV4dC55KSByZXR1cm4gcC5uZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtID0gcC54IDwgcC5uZXh0LnggPyBwIDogcC5uZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHAgPSBwLm5leHQ7XG4gICAgfSB3aGlsZSAocCAhPT0gb3V0ZXJOb2RlKTtcblxuICAgIGlmICghbSkgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAoaHggPT09IHF4KSByZXR1cm4gbTsgLy8gaG9sZSB0b3VjaGVzIG91dGVyIHNlZ21lbnQ7IHBpY2sgbGVmdG1vc3QgZW5kcG9pbnRcblxuICAgIC8vIGxvb2sgZm9yIHBvaW50cyBpbnNpZGUgdGhlIHRyaWFuZ2xlIG9mIGhvbGUgcG9pbnQsIHNlZ21lbnQgaW50ZXJzZWN0aW9uIGFuZCBlbmRwb2ludDtcbiAgICAvLyBpZiB0aGVyZSBhcmUgbm8gcG9pbnRzIGZvdW5kLCB3ZSBoYXZlIGEgdmFsaWQgY29ubmVjdGlvbjtcbiAgICAvLyBvdGhlcndpc2UgY2hvb3NlIHRoZSBwb2ludCBvZiB0aGUgbWluaW11bSBhbmdsZSB3aXRoIHRoZSByYXkgYXMgY29ubmVjdGlvbiBwb2ludFxuXG4gICAgdmFyIHN0b3AgPSBtLFxuICAgICAgICBteCA9IG0ueCxcbiAgICAgICAgbXkgPSBtLnksXG4gICAgICAgIHRhbk1pbiA9IEluZmluaXR5LFxuICAgICAgICB0YW47XG5cbiAgICBwID0gbTtcblxuICAgIGRvIHtcbiAgICAgICAgaWYgKGh4ID49IHAueCAmJiBwLnggPj0gbXggJiYgaHggIT09IHAueCAmJlxuICAgICAgICAgICAgICAgIHBvaW50SW5UcmlhbmdsZShoeSA8IG15ID8gaHggOiBxeCwgaHksIG14LCBteSwgaHkgPCBteSA/IHF4IDogaHgsIGh5LCBwLngsIHAueSkpIHtcblxuICAgICAgICAgICAgdGFuID0gTWF0aC5hYnMoaHkgLSBwLnkpIC8gKGh4IC0gcC54KTsgLy8gdGFuZ2VudGlhbFxuXG4gICAgICAgICAgICBpZiAobG9jYWxseUluc2lkZShwLCBob2xlKSAmJlxuICAgICAgICAgICAgICAgICh0YW4gPCB0YW5NaW4gfHwgKHRhbiA9PT0gdGFuTWluICYmIChwLnggPiBtLnggfHwgKHAueCA9PT0gbS54ICYmIHNlY3RvckNvbnRhaW5zU2VjdG9yKG0sIHApKSkpKSkge1xuICAgICAgICAgICAgICAgIG0gPSBwO1xuICAgICAgICAgICAgICAgIHRhbk1pbiA9IHRhbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHAgPSBwLm5leHQ7XG4gICAgfSB3aGlsZSAocCAhPT0gc3RvcCk7XG5cbiAgICByZXR1cm4gbTtcbn1cblxuLy8gd2hldGhlciBzZWN0b3IgaW4gdmVydGV4IG0gY29udGFpbnMgc2VjdG9yIGluIHZlcnRleCBwIGluIHRoZSBzYW1lIGNvb3JkaW5hdGVzXG5mdW5jdGlvbiBzZWN0b3JDb250YWluc1NlY3RvcihtLCBwKSB7XG4gICAgcmV0dXJuIGFyZWEobS5wcmV2LCBtLCBwLnByZXYpIDwgMCAmJiBhcmVhKHAubmV4dCwgbSwgbS5uZXh0KSA8IDA7XG59XG5cbi8vIGludGVybGluayBwb2x5Z29uIG5vZGVzIGluIHotb3JkZXJcbmZ1bmN0aW9uIGluZGV4Q3VydmUoc3RhcnQsIG1pblgsIG1pblksIGludlNpemUpIHtcbiAgICB2YXIgcCA9IHN0YXJ0O1xuICAgIGRvIHtcbiAgICAgICAgaWYgKHAueiA9PT0gbnVsbCkgcC56ID0gek9yZGVyKHAueCwgcC55LCBtaW5YLCBtaW5ZLCBpbnZTaXplKTtcbiAgICAgICAgcC5wcmV2WiA9IHAucHJldjtcbiAgICAgICAgcC5uZXh0WiA9IHAubmV4dDtcbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICB9IHdoaWxlIChwICE9PSBzdGFydCk7XG5cbiAgICBwLnByZXZaLm5leHRaID0gbnVsbDtcbiAgICBwLnByZXZaID0gbnVsbDtcblxuICAgIHNvcnRMaW5rZWQocCk7XG59XG5cbi8vIFNpbW9uIFRhdGhhbSdzIGxpbmtlZCBsaXN0IG1lcmdlIHNvcnQgYWxnb3JpdGhtXG4vLyBodHRwOi8vd3d3LmNoaWFyay5ncmVlbmVuZC5vcmcudWsvfnNndGF0aGFtL2FsZ29yaXRobXMvbGlzdHNvcnQuaHRtbFxuZnVuY3Rpb24gc29ydExpbmtlZChsaXN0KSB7XG4gICAgdmFyIGksIHAsIHEsIGUsIHRhaWwsIG51bU1lcmdlcywgcFNpemUsIHFTaXplLFxuICAgICAgICBpblNpemUgPSAxO1xuXG4gICAgZG8ge1xuICAgICAgICBwID0gbGlzdDtcbiAgICAgICAgbGlzdCA9IG51bGw7XG4gICAgICAgIHRhaWwgPSBudWxsO1xuICAgICAgICBudW1NZXJnZXMgPSAwO1xuXG4gICAgICAgIHdoaWxlIChwKSB7XG4gICAgICAgICAgICBudW1NZXJnZXMrKztcbiAgICAgICAgICAgIHEgPSBwO1xuICAgICAgICAgICAgcFNpemUgPSAwO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGluU2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcFNpemUrKztcbiAgICAgICAgICAgICAgICBxID0gcS5uZXh0WjtcbiAgICAgICAgICAgICAgICBpZiAoIXEpIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcVNpemUgPSBpblNpemU7XG5cbiAgICAgICAgICAgIHdoaWxlIChwU2l6ZSA+IDAgfHwgKHFTaXplID4gMCAmJiBxKSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHBTaXplICE9PSAwICYmIChxU2l6ZSA9PT0gMCB8fCAhcSB8fCBwLnogPD0gcS56KSkge1xuICAgICAgICAgICAgICAgICAgICBlID0gcDtcbiAgICAgICAgICAgICAgICAgICAgcCA9IHAubmV4dFo7XG4gICAgICAgICAgICAgICAgICAgIHBTaXplLS07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZSA9IHE7XG4gICAgICAgICAgICAgICAgICAgIHEgPSBxLm5leHRaO1xuICAgICAgICAgICAgICAgICAgICBxU2l6ZS0tO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0YWlsKSB0YWlsLm5leHRaID0gZTtcbiAgICAgICAgICAgICAgICBlbHNlIGxpc3QgPSBlO1xuXG4gICAgICAgICAgICAgICAgZS5wcmV2WiA9IHRhaWw7XG4gICAgICAgICAgICAgICAgdGFpbCA9IGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHAgPSBxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFpbC5uZXh0WiA9IG51bGw7XG4gICAgICAgIGluU2l6ZSAqPSAyO1xuXG4gICAgfSB3aGlsZSAobnVtTWVyZ2VzID4gMSk7XG5cbiAgICByZXR1cm4gbGlzdDtcbn1cblxuLy8gei1vcmRlciBvZiBhIHBvaW50IGdpdmVuIGNvb3JkcyBhbmQgaW52ZXJzZSBvZiB0aGUgbG9uZ2VyIHNpZGUgb2YgZGF0YSBiYm94XG5mdW5jdGlvbiB6T3JkZXIoeCwgeSwgbWluWCwgbWluWSwgaW52U2l6ZSkge1xuICAgIC8vIGNvb3JkcyBhcmUgdHJhbnNmb3JtZWQgaW50byBub24tbmVnYXRpdmUgMTUtYml0IGludGVnZXIgcmFuZ2VcbiAgICB4ID0gMzI3NjcgKiAoeCAtIG1pblgpICogaW52U2l6ZTtcbiAgICB5ID0gMzI3NjcgKiAoeSAtIG1pblkpICogaW52U2l6ZTtcblxuICAgIHggPSAoeCB8ICh4IDw8IDgpKSAmIDB4MDBGRjAwRkY7XG4gICAgeCA9ICh4IHwgKHggPDwgNCkpICYgMHgwRjBGMEYwRjtcbiAgICB4ID0gKHggfCAoeCA8PCAyKSkgJiAweDMzMzMzMzMzO1xuICAgIHggPSAoeCB8ICh4IDw8IDEpKSAmIDB4NTU1NTU1NTU7XG5cbiAgICB5ID0gKHkgfCAoeSA8PCA4KSkgJiAweDAwRkYwMEZGO1xuICAgIHkgPSAoeSB8ICh5IDw8IDQpKSAmIDB4MEYwRjBGMEY7XG4gICAgeSA9ICh5IHwgKHkgPDwgMikpICYgMHgzMzMzMzMzMztcbiAgICB5ID0gKHkgfCAoeSA8PCAxKSkgJiAweDU1NTU1NTU1O1xuXG4gICAgcmV0dXJuIHggfCAoeSA8PCAxKTtcbn1cblxuLy8gZmluZCB0aGUgbGVmdG1vc3Qgbm9kZSBvZiBhIHBvbHlnb24gcmluZ1xuZnVuY3Rpb24gZ2V0TGVmdG1vc3Qoc3RhcnQpIHtcbiAgICB2YXIgcCA9IHN0YXJ0LFxuICAgICAgICBsZWZ0bW9zdCA9IHN0YXJ0O1xuICAgIGRvIHtcbiAgICAgICAgaWYgKHAueCA8IGxlZnRtb3N0LnggfHwgKHAueCA9PT0gbGVmdG1vc3QueCAmJiBwLnkgPCBsZWZ0bW9zdC55KSkgbGVmdG1vc3QgPSBwO1xuICAgICAgICBwID0gcC5uZXh0O1xuICAgIH0gd2hpbGUgKHAgIT09IHN0YXJ0KTtcblxuICAgIHJldHVybiBsZWZ0bW9zdDtcbn1cblxuLy8gY2hlY2sgaWYgYSBwb2ludCBsaWVzIHdpdGhpbiBhIGNvbnZleCB0cmlhbmdsZVxuZnVuY3Rpb24gcG9pbnRJblRyaWFuZ2xlKGF4LCBheSwgYngsIGJ5LCBjeCwgY3ksIHB4LCBweSkge1xuICAgIHJldHVybiAoY3ggLSBweCkgKiAoYXkgLSBweSkgLSAoYXggLSBweCkgKiAoY3kgLSBweSkgPj0gMCAmJlxuICAgICAgICAgICAoYXggLSBweCkgKiAoYnkgLSBweSkgLSAoYnggLSBweCkgKiAoYXkgLSBweSkgPj0gMCAmJlxuICAgICAgICAgICAoYnggLSBweCkgKiAoY3kgLSBweSkgLSAoY3ggLSBweCkgKiAoYnkgLSBweSkgPj0gMDtcbn1cblxuLy8gY2hlY2sgaWYgYSBkaWFnb25hbCBiZXR3ZWVuIHR3byBwb2x5Z29uIG5vZGVzIGlzIHZhbGlkIChsaWVzIGluIHBvbHlnb24gaW50ZXJpb3IpXG5mdW5jdGlvbiBpc1ZhbGlkRGlhZ29uYWwoYSwgYikge1xuICAgIHJldHVybiBhLm5leHQuaSAhPT0gYi5pICYmIGEucHJldi5pICE9PSBiLmkgJiYgIWludGVyc2VjdHNQb2x5Z29uKGEsIGIpICYmIC8vIGRvbmVzJ3QgaW50ZXJzZWN0IG90aGVyIGVkZ2VzXG4gICAgICAgICAgIChsb2NhbGx5SW5zaWRlKGEsIGIpICYmIGxvY2FsbHlJbnNpZGUoYiwgYSkgJiYgbWlkZGxlSW5zaWRlKGEsIGIpICYmIC8vIGxvY2FsbHkgdmlzaWJsZVxuICAgICAgICAgICAgKGFyZWEoYS5wcmV2LCBhLCBiLnByZXYpIHx8IGFyZWEoYSwgYi5wcmV2LCBiKSkgfHwgLy8gZG9lcyBub3QgY3JlYXRlIG9wcG9zaXRlLWZhY2luZyBzZWN0b3JzXG4gICAgICAgICAgICBlcXVhbHMoYSwgYikgJiYgYXJlYShhLnByZXYsIGEsIGEubmV4dCkgPiAwICYmIGFyZWEoYi5wcmV2LCBiLCBiLm5leHQpID4gMCk7IC8vIHNwZWNpYWwgemVyby1sZW5ndGggY2FzZVxufVxuXG4vLyBzaWduZWQgYXJlYSBvZiBhIHRyaWFuZ2xlXG5mdW5jdGlvbiBhcmVhKHAsIHEsIHIpIHtcbiAgICByZXR1cm4gKHEueSAtIHAueSkgKiAoci54IC0gcS54KSAtIChxLnggLSBwLngpICogKHIueSAtIHEueSk7XG59XG5cbi8vIGNoZWNrIGlmIHR3byBwb2ludHMgYXJlIGVxdWFsXG5mdW5jdGlvbiBlcXVhbHMocDEsIHAyKSB7XG4gICAgcmV0dXJuIHAxLnggPT09IHAyLnggJiYgcDEueSA9PT0gcDIueTtcbn1cblxuLy8gY2hlY2sgaWYgdHdvIHNlZ21lbnRzIGludGVyc2VjdFxuZnVuY3Rpb24gaW50ZXJzZWN0cyhwMSwgcTEsIHAyLCBxMikge1xuICAgIHZhciBvMSA9IHNpZ24oYXJlYShwMSwgcTEsIHAyKSk7XG4gICAgdmFyIG8yID0gc2lnbihhcmVhKHAxLCBxMSwgcTIpKTtcbiAgICB2YXIgbzMgPSBzaWduKGFyZWEocDIsIHEyLCBwMSkpO1xuICAgIHZhciBvNCA9IHNpZ24oYXJlYShwMiwgcTIsIHExKSk7XG5cbiAgICBpZiAobzEgIT09IG8yICYmIG8zICE9PSBvNCkgcmV0dXJuIHRydWU7IC8vIGdlbmVyYWwgY2FzZVxuXG4gICAgaWYgKG8xID09PSAwICYmIG9uU2VnbWVudChwMSwgcDIsIHExKSkgcmV0dXJuIHRydWU7IC8vIHAxLCBxMSBhbmQgcDIgYXJlIGNvbGxpbmVhciBhbmQgcDIgbGllcyBvbiBwMXExXG4gICAgaWYgKG8yID09PSAwICYmIG9uU2VnbWVudChwMSwgcTIsIHExKSkgcmV0dXJuIHRydWU7IC8vIHAxLCBxMSBhbmQgcTIgYXJlIGNvbGxpbmVhciBhbmQgcTIgbGllcyBvbiBwMXExXG4gICAgaWYgKG8zID09PSAwICYmIG9uU2VnbWVudChwMiwgcDEsIHEyKSkgcmV0dXJuIHRydWU7IC8vIHAyLCBxMiBhbmQgcDEgYXJlIGNvbGxpbmVhciBhbmQgcDEgbGllcyBvbiBwMnEyXG4gICAgaWYgKG80ID09PSAwICYmIG9uU2VnbWVudChwMiwgcTEsIHEyKSkgcmV0dXJuIHRydWU7IC8vIHAyLCBxMiBhbmQgcTEgYXJlIGNvbGxpbmVhciBhbmQgcTEgbGllcyBvbiBwMnEyXG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIGZvciBjb2xsaW5lYXIgcG9pbnRzIHAsIHEsIHIsIGNoZWNrIGlmIHBvaW50IHEgbGllcyBvbiBzZWdtZW50IHByXG5mdW5jdGlvbiBvblNlZ21lbnQocCwgcSwgcikge1xuICAgIHJldHVybiBxLnggPD0gTWF0aC5tYXgocC54LCByLngpICYmIHEueCA+PSBNYXRoLm1pbihwLngsIHIueCkgJiYgcS55IDw9IE1hdGgubWF4KHAueSwgci55KSAmJiBxLnkgPj0gTWF0aC5taW4ocC55LCByLnkpO1xufVxuXG5mdW5jdGlvbiBzaWduKG51bSkge1xuICAgIHJldHVybiBudW0gPiAwID8gMSA6IG51bSA8IDAgPyAtMSA6IDA7XG59XG5cbi8vIGNoZWNrIGlmIGEgcG9seWdvbiBkaWFnb25hbCBpbnRlcnNlY3RzIGFueSBwb2x5Z29uIHNlZ21lbnRzXG5mdW5jdGlvbiBpbnRlcnNlY3RzUG9seWdvbihhLCBiKSB7XG4gICAgdmFyIHAgPSBhO1xuICAgIGRvIHtcbiAgICAgICAgaWYgKHAuaSAhPT0gYS5pICYmIHAubmV4dC5pICE9PSBhLmkgJiYgcC5pICE9PSBiLmkgJiYgcC5uZXh0LmkgIT09IGIuaSAmJlxuICAgICAgICAgICAgICAgIGludGVyc2VjdHMocCwgcC5uZXh0LCBhLCBiKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIHAgPSBwLm5leHQ7XG4gICAgfSB3aGlsZSAocCAhPT0gYSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIGNoZWNrIGlmIGEgcG9seWdvbiBkaWFnb25hbCBpcyBsb2NhbGx5IGluc2lkZSB0aGUgcG9seWdvblxuZnVuY3Rpb24gbG9jYWxseUluc2lkZShhLCBiKSB7XG4gICAgcmV0dXJuIGFyZWEoYS5wcmV2LCBhLCBhLm5leHQpIDwgMCA/XG4gICAgICAgIGFyZWEoYSwgYiwgYS5uZXh0KSA+PSAwICYmIGFyZWEoYSwgYS5wcmV2LCBiKSA+PSAwIDpcbiAgICAgICAgYXJlYShhLCBiLCBhLnByZXYpIDwgMCB8fCBhcmVhKGEsIGEubmV4dCwgYikgPCAwO1xufVxuXG4vLyBjaGVjayBpZiB0aGUgbWlkZGxlIHBvaW50IG9mIGEgcG9seWdvbiBkaWFnb25hbCBpcyBpbnNpZGUgdGhlIHBvbHlnb25cbmZ1bmN0aW9uIG1pZGRsZUluc2lkZShhLCBiKSB7XG4gICAgdmFyIHAgPSBhLFxuICAgICAgICBpbnNpZGUgPSBmYWxzZSxcbiAgICAgICAgcHggPSAoYS54ICsgYi54KSAvIDIsXG4gICAgICAgIHB5ID0gKGEueSArIGIueSkgLyAyO1xuICAgIGRvIHtcbiAgICAgICAgaWYgKCgocC55ID4gcHkpICE9PSAocC5uZXh0LnkgPiBweSkpICYmIHAubmV4dC55ICE9PSBwLnkgJiZcbiAgICAgICAgICAgICAgICAocHggPCAocC5uZXh0LnggLSBwLngpICogKHB5IC0gcC55KSAvIChwLm5leHQueSAtIHAueSkgKyBwLngpKVxuICAgICAgICAgICAgaW5zaWRlID0gIWluc2lkZTtcbiAgICAgICAgcCA9IHAubmV4dDtcbiAgICB9IHdoaWxlIChwICE9PSBhKTtcblxuICAgIHJldHVybiBpbnNpZGU7XG59XG5cbi8vIGxpbmsgdHdvIHBvbHlnb24gdmVydGljZXMgd2l0aCBhIGJyaWRnZTsgaWYgdGhlIHZlcnRpY2VzIGJlbG9uZyB0byB0aGUgc2FtZSByaW5nLCBpdCBzcGxpdHMgcG9seWdvbiBpbnRvIHR3bztcbi8vIGlmIG9uZSBiZWxvbmdzIHRvIHRoZSBvdXRlciByaW5nIGFuZCBhbm90aGVyIHRvIGEgaG9sZSwgaXQgbWVyZ2VzIGl0IGludG8gYSBzaW5nbGUgcmluZ1xuZnVuY3Rpb24gc3BsaXRQb2x5Z29uKGEsIGIpIHtcbiAgICB2YXIgYTIgPSBuZXcgTm9kZShhLmksIGEueCwgYS55KSxcbiAgICAgICAgYjIgPSBuZXcgTm9kZShiLmksIGIueCwgYi55KSxcbiAgICAgICAgYW4gPSBhLm5leHQsXG4gICAgICAgIGJwID0gYi5wcmV2O1xuXG4gICAgYS5uZXh0ID0gYjtcbiAgICBiLnByZXYgPSBhO1xuXG4gICAgYTIubmV4dCA9IGFuO1xuICAgIGFuLnByZXYgPSBhMjtcblxuICAgIGIyLm5leHQgPSBhMjtcbiAgICBhMi5wcmV2ID0gYjI7XG5cbiAgICBicC5uZXh0ID0gYjI7XG4gICAgYjIucHJldiA9IGJwO1xuXG4gICAgcmV0dXJuIGIyO1xufVxuXG4vLyBjcmVhdGUgYSBub2RlIGFuZCBvcHRpb25hbGx5IGxpbmsgaXQgd2l0aCBwcmV2aW91cyBvbmUgKGluIGEgY2lyY3VsYXIgZG91Ymx5IGxpbmtlZCBsaXN0KVxuZnVuY3Rpb24gaW5zZXJ0Tm9kZShpLCB4LCB5LCBsYXN0KSB7XG4gICAgdmFyIHAgPSBuZXcgTm9kZShpLCB4LCB5KTtcblxuICAgIGlmICghbGFzdCkge1xuICAgICAgICBwLnByZXYgPSBwO1xuICAgICAgICBwLm5leHQgPSBwO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcC5uZXh0ID0gbGFzdC5uZXh0O1xuICAgICAgICBwLnByZXYgPSBsYXN0O1xuICAgICAgICBsYXN0Lm5leHQucHJldiA9IHA7XG4gICAgICAgIGxhc3QubmV4dCA9IHA7XG4gICAgfVxuICAgIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiByZW1vdmVOb2RlKHApIHtcbiAgICBwLm5leHQucHJldiA9IHAucHJldjtcbiAgICBwLnByZXYubmV4dCA9IHAubmV4dDtcblxuICAgIGlmIChwLnByZXZaKSBwLnByZXZaLm5leHRaID0gcC5uZXh0WjtcbiAgICBpZiAocC5uZXh0WikgcC5uZXh0Wi5wcmV2WiA9IHAucHJldlo7XG59XG5cbmZ1bmN0aW9uIE5vZGUoaSwgeCwgeSkge1xuICAgIC8vIHZlcnRleCBpbmRleCBpbiBjb29yZGluYXRlcyBhcnJheVxuICAgIHRoaXMuaSA9IGk7XG5cbiAgICAvLyB2ZXJ0ZXggY29vcmRpbmF0ZXNcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG5cbiAgICAvLyBwcmV2aW91cyBhbmQgbmV4dCB2ZXJ0ZXggbm9kZXMgaW4gYSBwb2x5Z29uIHJpbmdcbiAgICB0aGlzLnByZXYgPSBudWxsO1xuICAgIHRoaXMubmV4dCA9IG51bGw7XG5cbiAgICAvLyB6LW9yZGVyIGN1cnZlIHZhbHVlXG4gICAgdGhpcy56ID0gbnVsbDtcblxuICAgIC8vIHByZXZpb3VzIGFuZCBuZXh0IG5vZGVzIGluIHotb3JkZXJcbiAgICB0aGlzLnByZXZaID0gbnVsbDtcbiAgICB0aGlzLm5leHRaID0gbnVsbDtcblxuICAgIC8vIGluZGljYXRlcyB3aGV0aGVyIHRoaXMgaXMgYSBzdGVpbmVyIHBvaW50XG4gICAgdGhpcy5zdGVpbmVyID0gZmFsc2U7XG59XG5cbi8vIHJldHVybiBhIHBlcmNlbnRhZ2UgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBwb2x5Z29uIGFyZWEgYW5kIGl0cyB0cmlhbmd1bGF0aW9uIGFyZWE7XG4vLyB1c2VkIHRvIHZlcmlmeSBjb3JyZWN0bmVzcyBvZiB0cmlhbmd1bGF0aW9uXG5lYXJjdXQuZGV2aWF0aW9uID0gZnVuY3Rpb24gKGRhdGEsIGhvbGVJbmRpY2VzLCBkaW0sIHRyaWFuZ2xlcykge1xuICAgIHZhciBoYXNIb2xlcyA9IGhvbGVJbmRpY2VzICYmIGhvbGVJbmRpY2VzLmxlbmd0aDtcbiAgICB2YXIgb3V0ZXJMZW4gPSBoYXNIb2xlcyA/IGhvbGVJbmRpY2VzWzBdICogZGltIDogZGF0YS5sZW5ndGg7XG5cbiAgICB2YXIgcG9seWdvbkFyZWEgPSBNYXRoLmFicyhzaWduZWRBcmVhKGRhdGEsIDAsIG91dGVyTGVuLCBkaW0pKTtcbiAgICBpZiAoaGFzSG9sZXMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGhvbGVJbmRpY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBob2xlSW5kaWNlc1tpXSAqIGRpbTtcbiAgICAgICAgICAgIHZhciBlbmQgPSBpIDwgbGVuIC0gMSA/IGhvbGVJbmRpY2VzW2kgKyAxXSAqIGRpbSA6IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgcG9seWdvbkFyZWEgLT0gTWF0aC5hYnMoc2lnbmVkQXJlYShkYXRhLCBzdGFydCwgZW5kLCBkaW0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciB0cmlhbmdsZXNBcmVhID0gMDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdHJpYW5nbGVzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIHZhciBhID0gdHJpYW5nbGVzW2ldICogZGltO1xuICAgICAgICB2YXIgYiA9IHRyaWFuZ2xlc1tpICsgMV0gKiBkaW07XG4gICAgICAgIHZhciBjID0gdHJpYW5nbGVzW2kgKyAyXSAqIGRpbTtcbiAgICAgICAgdHJpYW5nbGVzQXJlYSArPSBNYXRoLmFicyhcbiAgICAgICAgICAgIChkYXRhW2FdIC0gZGF0YVtjXSkgKiAoZGF0YVtiICsgMV0gLSBkYXRhW2EgKyAxXSkgLVxuICAgICAgICAgICAgKGRhdGFbYV0gLSBkYXRhW2JdKSAqIChkYXRhW2MgKyAxXSAtIGRhdGFbYSArIDFdKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvbHlnb25BcmVhID09PSAwICYmIHRyaWFuZ2xlc0FyZWEgPT09IDAgPyAwIDpcbiAgICAgICAgTWF0aC5hYnMoKHRyaWFuZ2xlc0FyZWEgLSBwb2x5Z29uQXJlYSkgLyBwb2x5Z29uQXJlYSk7XG59O1xuXG5mdW5jdGlvbiBzaWduZWRBcmVhKGRhdGEsIHN0YXJ0LCBlbmQsIGRpbSkge1xuICAgIHZhciBzdW0gPSAwO1xuICAgIGZvciAodmFyIGkgPSBzdGFydCwgaiA9IGVuZCAtIGRpbTsgaSA8IGVuZDsgaSArPSBkaW0pIHtcbiAgICAgICAgc3VtICs9IChkYXRhW2pdIC0gZGF0YVtpXSkgKiAoZGF0YVtpICsgMV0gKyBkYXRhW2ogKyAxXSk7XG4gICAgICAgIGogPSBpO1xuICAgIH1cbiAgICByZXR1cm4gc3VtO1xufVxuXG4vLyB0dXJuIGEgcG9seWdvbiBpbiBhIG11bHRpLWRpbWVuc2lvbmFsIGFycmF5IGZvcm0gKGUuZy4gYXMgaW4gR2VvSlNPTikgaW50byBhIGZvcm0gRWFyY3V0IGFjY2VwdHNcbmVhcmN1dC5mbGF0dGVuID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgZGltID0gZGF0YVswXVswXS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdCA9IHt2ZXJ0aWNlczogW10sIGhvbGVzOiBbXSwgZGltZW5zaW9uczogZGltfSxcbiAgICAgICAgaG9sZUluZGV4ID0gMDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRhdGFbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGltOyBkKyspIHJlc3VsdC52ZXJ0aWNlcy5wdXNoKGRhdGFbaV1bal1bZF0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgICAgaG9sZUluZGV4ICs9IGRhdGFbaSAtIDFdLmxlbmd0aDtcbiAgICAgICAgICAgIHJlc3VsdC5ob2xlcy5wdXNoKGhvbGVJbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG4iXX0=
