// @ts-ignore
import { isMini } from '@antv/l7-utils';
import { mat2, mat4, vec4 } from 'gl-matrix';
import Point from '../geo/point';
import { clamp, interpolate, wrap } from '../util';
import EdgeInsets, { IPaddingOptions } from './edge_insets';
import LngLat from './lng_lat';
import LngLatBounds from './lng_lat_bounds';
import MercatorCoordinate, {
  mercatorXfromLng,
  mercatorYfromLat,
  mercatorZfromAltitude,
} from './mercator';
export const EXTENT = 8192;
export default class Transform {
  get minZoom(): number {
    return this._minZoom;
  }
  set minZoom(zoom: number) {
    if (this._minZoom === zoom) {
      return;
    }
    this._minZoom = zoom;
    this.zoom = Math.max(this.zoom, zoom);
  }

  get maxZoom(): number {
    return this._maxZoom;
  }
  set maxZoom(zoom: number) {
    if (this._maxZoom === zoom) {
      return;
    }
    this._maxZoom = zoom;
    this.zoom = Math.min(this.zoom, zoom);
  }

  get minPitch(): number {
    return this._minPitch;
  }
  set minPitch(pitch: number) {
    if (this._minPitch === pitch) {
      return;
    }
    this._minPitch = pitch;
    this._pitch = Math.max(this._pitch, pitch);
  }

  get maxPitch(): number {
    return this._maxPitch;
  }
  set maxPitch(pitch: number) {
    if (this._maxPitch === pitch) {
      return;
    }
    this._maxPitch = pitch;
    this._pitch = Math.min(this._pitch, pitch);
  }

  get renderWorldCopies(): boolean {
    return this._renderWorldCopies;
  }
  set renderWorldCopies(renderWorldCopies: boolean) {
    if (renderWorldCopies === undefined) {
      renderWorldCopies = true;
    } else if (renderWorldCopies === null) {
      renderWorldCopies = false;
    }

    this._renderWorldCopies = renderWorldCopies;
  }

  get worldSize(): number {
    return this.tileSize * this.scale;
  }

  get centerOffset(): Point {
    return this.centerPoint._sub(this.size._div(2));
  }

  get size(): Point {
    return new Point(this.width, this.height);
  }

  get bearing(): number {
    return (-this.angle / Math.PI) * 180;
  }
  set bearing(bearing: number) {
    const b = (-wrap(bearing, -180, 180) * Math.PI) / 180;
    if (this.angle === b) {
      return;
    }
    this.unmodified = false;
    this.angle = b;
    this.calcMatrices();

    // 2x2 matrix for rotating points
    this.rotationMatrix = mat2.create();
    mat2.rotate(this.rotationMatrix, this.rotationMatrix, this.angle);
  }

  get pitch(): number {
    return (this._pitch / Math.PI) * 180;
  }
  set pitch(pitch: number) {
    const p = (clamp(pitch, this._minPitch, this._maxPitch) / 180) * Math.PI;
    if (this._pitch === p) {
      return;
    }
    this.unmodified = false;
    this._pitch = p;
    this.calcMatrices();
  }

  get fov(): number {
    return (this._fov / Math.PI) * 180;
  }

  set fov(fov: number) {
    fov = Math.max(0.01, Math.min(60, fov));
    if (this._fov === fov) {
      return;
    }
    this.unmodified = false;
    this._fov = (fov / 180) * Math.PI;
    this.calcMatrices();
  }

  get zoom(): number {
    return this._zoom;
  }

  set zoom(zoom: number) {
    const z = Math.min(Math.max(zoom, this._minZoom), this._maxZoom);
    if (this._zoom === z) {
      return;
    }
    this.unmodified = false;
    this._zoom = z;
    this.scale = this.zoomScale(z);
    this.tileZoom = Math.floor(z);
    this.zoomFraction = z - this.tileZoom;
    this.constrain();
    this.calcMatrices();
  }

  get center(): LngLat {
    return this._center;
  }

  set center(center: LngLat) {
    if (center.lat === this._center.lat && center.lng === this._center.lng) {
      return;
    }
    this.unmodified = false;
    this._center = center;
    this.constrain();
    this.calcMatrices();
  }

  get padding(): IPaddingOptions {
    return this.edgeInsets.toJSON();
  }

  set padding(padding: IPaddingOptions) {
    if (this.edgeInsets.equals(padding)) {
      return;
    }
    this.unmodified = false;
    // Update edge-insets inplace
    this.edgeInsets.interpolate(this.edgeInsets, padding, 1);
    this.calcMatrices();
  }

  /**
   * The center of the screen in pixels with the top-left corner being (0,0)
   * and +y axis pointing downwards. This accounts for padding.
   *
   * @readonly
   * @type {Point}
   * @memberof Transform
   */
  get centerPoint(): Point {
    return this.edgeInsets.getCenter(this.width, this.height);
  }

  get point(): Point {
    return this.project(this.center);
  }
  public tileSize: number;
  public tileZoom: number;
  public lngRange?: [number, number];
  public latRange?: [number, number];
  public maxValidLatitude: number;
  public scale: number;
  public width: number;
  public height: number;
  public angle: number;
  public rotationMatrix: mat2;
  public pixelsToGLUnits: [number, number];
  public cameraToCenterDistance: number;
  public mercatorMatrix: mat4;
  public projMatrix: mat4;
  public invProjMatrix: mat4;
  public alignedProjMatrix: mat4;
  public pixelMatrix: mat4;
  public pixelMatrixInverse: mat4;
  public glCoordMatrix: mat4;
  public labelPlaneMatrix: mat4;
  // tslint:disable:variable-name
  private _fov: number;
  private _pitch: number;
  private _zoom: number;
  private _renderWorldCopies: boolean;
  private _minZoom: number;
  private _maxZoom: number;
  private _minPitch: number;
  private _maxPitch: number;
  private _center: LngLat;
  // tslint:enable
  private zoomFraction: number;
  private unmodified: boolean;
  private edgeInsets: EdgeInsets;
  private constraining: boolean;
  private posMatrixCache: { [_: string]: Float32Array };
  private alignedPosMatrixCache: { [_: string]: Float32Array };
  constructor(
    minZoom: number,
    maxZoom: number,
    minPitch: number,
    maxPitch: number,
    renderWorldCopies: boolean | void,
  ) {
    this.tileSize = 512; // constant
    this.maxValidLatitude = 85.051129; // constant

    this._renderWorldCopies = (
      renderWorldCopies === undefined ? true : renderWorldCopies
    ) as boolean;
    this._minZoom = minZoom || 0;
    this._maxZoom = maxZoom || 22;

    this._minPitch = minPitch === undefined || minPitch === null ? 0 : minPitch;
    this._maxPitch =
      maxPitch === undefined || maxPitch === null ? 60 : maxPitch;

    this.setMaxBounds();

    this.width = 0;
    this.height = 0;
    this._center = new LngLat(0, 0);
    this.zoom = 0;
    this.angle = 0;
    this._fov = 0.6435011087932844;
    this._pitch = 0;
    this.unmodified = true;
    this.edgeInsets = new EdgeInsets();
    this.posMatrixCache = {};
    this.alignedPosMatrixCache = {};
  }

  public clone(): Transform {
    const clone = new Transform(
      this._minZoom,
      this._maxZoom,
      this._minPitch,
      this._maxPitch,
      this._renderWorldCopies,
    );
    clone.tileSize = this.tileSize;
    clone.latRange = this.latRange;
    clone.width = this.width;
    clone.height = this.height;
    clone.center = this._center;
    clone.zoom = this.zoom;
    clone.angle = this.angle;
    clone.fov = this._fov;
    clone.pitch = this._pitch;
    clone.unmodified = this.unmodified;
    clone.edgeInsets = this.edgeInsets.clone();
    clone.calcMatrices();
    return clone;
  }

  /**
   * Returns if the padding params match
   *
   * @param {IPaddingOptions} padding
   * @returns {boolean}
   * @memberof Transform
   */
  public isPaddingEqual(padding: IPaddingOptions): boolean {
    return this.edgeInsets.equals(padding);
  }

  /**
   * Helper method to upadte edge-insets inplace
   *
   * @param {IPaddingOptions} target
   * @param {number} t
   * @memberof Transform
   */
  public interpolatePadding(
    start: IPaddingOptions,
    target: IPaddingOptions,
    t: number,
  ) {
    this.unmodified = false;
    this.edgeInsets.interpolate(start, target, t);
    this.constrain();
    this.calcMatrices();
  }

  /**
   * Return a zoom level that will cover all tiles the transform
   * @param {Object} options options
   * @param {number} options.tileSize Tile size, expressed in screen pixels.
   * @param {boolean} options.roundZoom Target zoom level. If true, the value will be rounded to the closest integer. Otherwise the value will be floored.
   * @returns {number} zoom level An integer zoom level at which all tiles will be visible.
   */
  public coveringZoomLevel(options: { roundZoom?: boolean; tileSize: number }) {
    const z = (options.roundZoom ? Math.round : Math.floor)(
      this.zoom + this.scaleZoom(this.tileSize / options.tileSize),
    );
    // At negative zoom levels load tiles from z0 because negative tile zoom levels don't exist.
    return Math.max(0, z);
  }

  /**
   * Return any "wrapped" copies of a given tile coordinate that are visible
   * in the current view.
   *
   * @private
   */
  // public getVisibleUnwrappedCoordinates(tileID: CanonicalTileID) {
  //   const result = [new UnwrappedTileID(0, tileID)];
  //   if (this._renderWorldCopies) {
  //     const utl = this.pointCoordinate(new Point(0, 0));
  //     const utr = this.pointCoordinate(new Point(this.width, 0));
  //     const ubl = this.pointCoordinate(new Point(this.width, this.height));
  //     const ubr = this.pointCoordinate(new Point(0, this.height));
  //     const w0 = Math.floor(Math.min(utl.x, utr.x, ubl.x, ubr.x));
  //     const w1 = Math.floor(Math.max(utl.x, utr.x, ubl.x, ubr.x));

  //     // Add an extra copy of the world on each side to properly render ImageSources and CanvasSources.
  //     // Both sources draw outside the tile boundaries of the tile that "contains them" so we need
  //     // to add extra copies on both sides in case offscreen tiles need to draw into on-screen ones.
  //     const extraWorldCopy = 1;

  //     for (let w = w0 - extraWorldCopy; w <= w1 + extraWorldCopy; w++) {
  //       if (w === 0) {
  //         continue;
  //       }
  //       result.push(new UnwrappedTileID(w, tileID));
  //     }
  //   }
  //   return result;
  // }

  /**
   * Return all coordinates that could cover this transform for a covering
   * zoom level.
   * @param {Object} options
   * @param {number} options.tileSize
   * @param {number} options.minzoom
   * @param {number} options.maxzoom
   * @param {boolean} options.roundZoom
   * @param {boolean} options.reparseOverscaled
   * @param {boolean} options.renderWorldCopies
   * @returns {Array<OverscaledTileID>} OverscaledTileIDs
   * @private
   */
  // public coveringTiles(options: {
  //   tileSize: number;
  //   minzoom?: number;
  //   maxzoom?: number;
  //   roundZoom?: boolean;
  //   reparseOverscaled?: boolean;
  //   renderWorldCopies?: boolean;
  // }): OverscaledTileID[] {
  //   let z = this.coveringZoomLevel(options);
  //   const actualZ = z;

  //   if (options.minzoom !== undefined && z < options.minzoom) {
  //     return [];
  //   }
  //   if (options.maxzoom !== undefined && z > options.maxzoom) {
  //     z = options.maxzoom;
  //   }

  //   const centerCoord = MercatorCoordinate.fromLngLat(this.center);
  //   const numTiles = Math.pow(2, z);
  //   const centerPoint = [numTiles * centerCoord.x, numTiles * centerCoord.y, 0];
  //   const cameraFrustum = Frustum.fromInvProjectionMatrix(
  //     this.invProjMatrix,
  //     this.worldSize,
  //     z,
  //   );

  //   // No change of LOD behavior for pitch lower than 60 and when there is no top padding: return only tile ids from the requested zoom level
  //   let minZoom = options.minzoom || 0;
  //   // Use 0.1 as an epsilon to avoid for explicit == 0.0 floating point checks
  //   if (this._pitch <= 60.0 && this.edgeInsets.top < 0.1) {
  //     minZoom = z;
  //   }

  //   // There should always be a certain number of maximum zoom level tiles surrounding the center location
  //   const radiusOfMaxLvlLodInTiles = 3;

  //   const newRootTile = (wrap: number): any => {
  //     return {
  //       // All tiles are on zero elevation plane => z difference is zero
  //       aabb: new Aabb(
  //         [wrap * numTiles, 0, 0],
  //         [(wrap + 1) * numTiles, numTiles, 0],
  //       ),
  //       zoom: 0,
  //       x: 0,
  //       y: 0,
  //       wrap,
  //       fullyVisible: false,
  //     };
  //   };

  //   // Do a depth-first traversal to find visible tiles and proper levels of detail
  //   const stack = [];
  //   const result = [];
  //   const maxZoom = z;
  //   const overscaledZ = options.reparseOverscaled ? actualZ : z;

  //   if (this._renderWorldCopies) {
  //     // Render copy of the globe thrice on both sides
  //     for (let i = 1; i <= 3; i++) {
  //       stack.push(newRootTile(-i));
  //       stack.push(newRootTile(i));
  //     }
  //   }

  //   stack.push(newRootTile(0));

  //   while (stack.length > 0) {
  //     const it = stack.pop();
  //     const x = it.x;
  //     const y = it.y;
  //     let fullyVisible = it.fullyVisible;

  //     // Visibility of a tile is not required if any of its ancestor if fully inside the frustum
  //     if (!fullyVisible) {
  //       const intersectResult = it.aabb.intersects(cameraFrustum);

  //       if (intersectResult === 0) {
  //         continue;
  //       }

  //       fullyVisible = intersectResult === 2;
  //     }

  //     const distanceX = it.aabb.distanceX(centerPoint);
  //     const distanceY = it.aabb.distanceY(centerPoint);
  //     const longestDim = Math.max(Math.abs(distanceX), Math.abs(distanceY));

  //     // We're using distance based heuristics to determine if a tile should be split into quadrants or not.
  //     // radiusOfMaxLvlLodInTiles defines that there's always a certain number of maxLevel tiles next to the map center.
  //     // Using the fact that a parent node in quadtree is twice the size of its children (per dimension)
  //     // we can define distance thresholds for each relative level:
  //     // f(k) = offset + 2 + 4 + 8 + 16 + ... + 2^k. This is the same as "offset+2^(k+1)-2"
  //     const distToSplit =
  //       radiusOfMaxLvlLodInTiles + (1 << (maxZoom - it.zoom)) - 2;

  //     // Have we reached the target depth or is the tile too far away to be any split further?
  //     if (
  //       it.zoom === maxZoom ||
  //       (longestDim > distToSplit && it.zoom >= minZoom)
  //     ) {
  //       result.push({
  //         tileID: new OverscaledTileID(
  //           it.zoom === maxZoom ? overscaledZ : it.zoom,
  //           it.wrap,
  //           it.zoom,
  //           x,
  //           y,
  //         ),
  //         distanceSq: vec2.sqrLen([
  //           centerPoint[0] - 0.5 - x,
  //           centerPoint[1] - 0.5 - y,
  //         ]),
  //       });
  //       continue;
  //     }

  //     for (let i = 0; i < 4; i++) {
  //       const childX = (x << 1) + (i % 2);
  //       const childY = (y << 1) + (i >> 1);

  //       stack.push({
  //         aabb: it.aabb.quadrant(i),
  //         zoom: it.zoom + 1,
  //         x: childX,
  //         y: childY,
  //         wrap: it.wrap,
  //         fullyVisible,
  //       });
  //     }
  //   }

  //   return result
  //     .sort((a, b) => a.distanceSq - b.distanceSq)
  //     .map((a) => a.tileID);
  // }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.pixelsToGLUnits = [2 / width, -2 / height];
    this.constrain();
    this.calcMatrices();
  }

  public zoomScale(zoom: number) {
    return Math.pow(2, zoom);
  }
  public scaleZoom(scale: number) {
    return Math.log(scale) / Math.LN2;
  }

  public project(lnglat: LngLat) {
    const lat = clamp(
      lnglat.lat,
      -this.maxValidLatitude,
      this.maxValidLatitude,
    );
    return new Point(
      mercatorXfromLng(lnglat.lng) * this.worldSize,
      mercatorYfromLat(lat) * this.worldSize,
    );
  }

  public unproject(point: Point): LngLat {
    return new MercatorCoordinate(
      point.x / this.worldSize,
      point.y / this.worldSize,
    ).toLngLat();
  }

  public setLocationAtPoint(lnglat: LngLat, point: Point) {
    const a = this.pointCoordinate(point);
    const b = this.pointCoordinate(this.centerPoint);
    const loc = this.locationCoordinate(lnglat);
    const newCenter = new MercatorCoordinate(
      loc.x - (a.x - b.x),
      loc.y - (a.y - b.y),
    );
    this.center = this.coordinateLocation(newCenter);
    if (this._renderWorldCopies) {
      this.center = this.center.wrap();
    }
  }

  public pointCoordinate(p: Point) {
    const targetZ = 0;
    // since we don't know the correct projected z value for the point,
    // unproject two points to get a line and then find the point on that
    // line with z=0

    const coord0 = new Float64Array([p.x, p.y, 0, 1]);
    const coord1 = new Float64Array([p.x, p.y, 1, 1]);

    // @ts-ignore
    vec4.transformMat4(coord0, coord0, this.pixelMatrixInverse);
    // @ts-ignore
    vec4.transformMat4(coord1, coord1, this.pixelMatrixInverse);

    const w0 = coord0[3];
    const w1 = coord1[3];
    const x0 = coord0[0] / w0;
    const x1 = coord1[0] / w1;
    const y0 = coord0[1] / w0;
    const y1 = coord1[1] / w1;
    const z0 = coord0[2] / w0;
    const z1 = coord1[2] / w1;

    const t = z0 === z1 ? 0 : (targetZ - z0) / (z1 - z0);

    return new MercatorCoordinate(
      interpolate(x0, x1, t) / this.worldSize,
      interpolate(y0, y1, t) / this.worldSize,
    );
  }

  /**
   * Returns the map's geographical bounds. When the bearing or pitch is non-zero, the visible region is not
   * an axis-aligned rectangle, and the result is the smallest bounds that encompasses the visible region.
   * @returns {LngLatBounds} Returns a {@link LngLatBounds} object describing the map's geographical bounds.
   */
  public getBounds(): LngLatBounds {
    return new LngLatBounds()
      .extend(this.pointLocation(new Point(0, 0)))
      .extend(this.pointLocation(new Point(this.width, 0)))
      .extend(this.pointLocation(new Point(this.width, this.height)))
      .extend(this.pointLocation(new Point(0, this.height)));
  }

  /**
   * Returns the maximum geographical bounds the map is constrained to, or `null` if none set.
   * @returns {LngLatBounds} {@link LngLatBounds}
   */
  public getMaxBounds(): LngLatBounds | null {
    if (
      !this.latRange ||
      this.latRange.length !== 2 ||
      !this.lngRange ||
      this.lngRange.length !== 2
    ) {
      return null;
    }

    return new LngLatBounds(
      [this.lngRange[0], this.latRange[0]],
      [this.lngRange[1], this.latRange[1]],
    );
  }

  /**
   * Sets or clears the map's geographical constraints.
   * @param {LngLatBounds} bounds A {@link LngLatBounds} object describing the new geographic boundaries of the map.
   */
  public setMaxBounds(bounds?: LngLatBounds) {
    if (bounds) {
      this.lngRange = [bounds.getWest(), bounds.getEast()];
      this.latRange = [bounds.getSouth(), bounds.getNorth()];
      this.constrain();
    } else {
      this.lngRange = undefined;
      this.latRange = [-this.maxValidLatitude, this.maxValidLatitude];
    }
  }

  public customLayerMatrix(): number[] {
    return (this.mercatorMatrix as number[]).slice();
  }

  public maxPitchScaleFactor() {
    // calcMatrices hasn't run yet
    if (!this.pixelMatrixInverse) {
      return 1;
    }

    const coord = this.pointCoordinate(new Point(0, 0));
    const p = new Float32Array([
      coord.x * this.worldSize,
      coord.y * this.worldSize,
      0,
      1,
    ]);
    const topPoint = vec4.transformMat4(p, p, this.pixelMatrix);
    return topPoint[3] / this.cameraToCenterDistance;
  }

  /*
   * The camera looks at the map from a 3D (lng, lat, altitude) location. Let's use `cameraLocation`
   * as the name for the location under the camera and on the surface of the earth (lng, lat, 0).
   * `cameraPoint` is the projected position of the `cameraLocation`.
   *
   * This point is useful to us because only fill-extrusions that are between `cameraPoint` and
   * the query point on the surface of the earth can extend and intersect the query.
   *
   * When the map is not pitched the `cameraPoint` is equivalent to the center of the map because
   * the camera is right above the center of the map.
   */
  public getCameraPoint() {
    const pitch = this._pitch;
    const yOffset = Math.tan(pitch) * (this.cameraToCenterDistance || 1);
    return this.centerPoint.add(new Point(0, yOffset));
  }

  /*
   * When the map is pitched, some of the 3D features that intersect a query will not intersect
   * the query at the surface of the earth. Instead the feature may be closer and only intersect
   * the query because it extrudes into the air.
   *
   * This returns a geometry that includes all of the original query as well as all possible ares of the
   * screen where the *base* of a visible extrusion could be.
   *  - For point queries, the line from the query point to the "camera point"
   *  - For other geometries, the envelope of the query geometry and the "camera point"
   */
  public getCameraQueryGeometry(queryGeometry: Point[]): Point[] {
    const c = this.getCameraPoint();

    if (queryGeometry.length === 1) {
      return [queryGeometry[0], c];
    } else {
      let minX = c.x;
      let minY = c.y;
      let maxX = c.x;
      let maxY = c.y;
      for (const p of queryGeometry) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
      return [
        new Point(minX, minY),
        new Point(maxX, minY),
        new Point(maxX, maxY),
        new Point(minX, maxY),
        new Point(minX, minY),
      ];
    }
  }

  /**
   * Given a coordinate, return the screen point that corresponds to it
   * @param {Coordinate} coord
   * @returns {Point} screen point
   * @private
   */
  public coordinatePoint(coord: MercatorCoordinate) {
    const p = vec4.fromValues(
      coord.x * this.worldSize,
      coord.y * this.worldSize,
      0,
      1,
    );
    vec4.transformMat4(p, p, this.pixelMatrix);
    return new Point(p[0] / p[3], p[1] / p[3]);
  }
  /**
   * Given a location, return the screen point that corresponds to it
   * @param {LngLat} lnglat location
   * @returns {Point} screen point
   * @private
   */
  public locationPoint(lnglat: LngLat) {
    return this.coordinatePoint(this.locationCoordinate(lnglat));
  }

  /**
   * Given a point on screen, return its lnglat
   * @param {Point} p screen point
   * @returns {LngLat} lnglat location
   * @private
   */
  public pointLocation(p: Point) {
    // if(p.x !== 0 && p.x !== 1001) {
    //   console.log(p.x)
    // }

    return this.coordinateLocation(this.pointCoordinate(p));
  }

  /**
   * Given a geographical lnglat, return an unrounded
   * coordinate that represents it at this transform's zoom level.
   * @param {LngLat} lnglat
   * @returns {Coordinate}
   * @private
   */
  public locationCoordinate(lnglat: LngLat) {
    return MercatorCoordinate.fromLngLat(lnglat);
  }

  /**
   * Given a Coordinate, return its geographical position.
   * @param {Coordinate} coord
   * @returns {LngLat} lnglat
   * @private
   */
  public coordinateLocation(coord: MercatorCoordinate) {
    return coord.toLngLat();
  }

  public getProjectionMatrix(): mat4 {
    return this.projMatrix;
  }
  /**
   * Calculate the posMatrix that, given a tile coordinate, would be used to display the tile on a map.
   * @param {UnwrappedTileID} unwrappedTileID;
   * @private
   */
  // private calculatePosMatrix(
  //   unwrappedTileID: UnwrappedTileID,
  //   aligned: boolean = false,
  // ): Float32Array {
  //   const posMatrixKey = unwrappedTileID.key;
  //   const cache = aligned ? this.alignedPosMatrixCache : this.posMatrixCache;
  //   if (cache[posMatrixKey]) {
  //     return cache[posMatrixKey];
  //   }

  //   const canonical = unwrappedTileID.canonical;
  //   const scale = this.worldSize / this.zoomScale(canonical.z);
  //   const unwrappedX =
  //     canonical.x + Math.pow(2, canonical.z) * unwrappedTileID.wrap;

  //   const posMatrix = mat4.identity(new Float64Array(16));
  //   mat4.translate(posMatrix, posMatrix, [
  //     unwrappedX * scale,
  //     canonical.y * scale,
  //     0,
  //   ]);
  //   mat4.scale(posMatrix, posMatrix, [scale / EXTENT, scale / EXTENT, 1]);
  //   mat4.multiply(
  //     posMatrix,
  //     aligned ? this.alignedProjMatrix : this.projMatrix,
  //     posMatrix,
  //   );

  //   cache[posMatrixKey] = new Float32Array(posMatrix);
  //   return cache[posMatrixKey];
  // }

  private constrain() {
    if (!this.center || !this.width || !this.height || this.constraining) {
      return;
    }

    this.constraining = true;

    let minY = -90;
    let maxY = 90;
    let minX = -180;
    let maxX = 180;
    let sy;
    let sx;
    let x2;
    let y2;
    const size = this.size;
    const unmodified = this.unmodified;
    if (this.latRange) {
      const latRange = this.latRange;
      minY = mercatorYfromLat(latRange[1]) * this.worldSize;
      maxY = mercatorYfromLat(latRange[0]) * this.worldSize;
      sy = maxY - minY < size.y ? size.y / (maxY - minY) : 0;
    }

    if (this.lngRange) {
      const lngRange = this.lngRange;
      minX = mercatorXfromLng(lngRange[0]) * this.worldSize;
      maxX = mercatorXfromLng(lngRange[1]) * this.worldSize;
      sx = maxX - minX < size.x ? size.x / (maxX - minX) : 0;
    }

    const point = this.point;

    // how much the map should scale to fit the screen into given latitude/longitude ranges
    const s = Math.max(sx || 0, sy || 0);

    if (s) {
      this.center = this.unproject(
        new Point(
          sx ? (maxX + minX) / 2 : point.x,
          sy ? (maxY + minY) / 2 : point.y,
        ),
      );
      if (isMini) {
        this.zoom = Math.max(this.zoom, Math.max(-1, this.minZoom));
      } else {
        this.zoom += this.scaleZoom(s);
      }

      this.unmodified = unmodified;
      this.constraining = false;
      return;
    }

    if (this.latRange) {
      const y = point.y;
      const h2 = size.y / 2;

      if (y - h2 < minY) {
        y2 = minY + h2;
      }
      if (y + h2 > maxY) {
        y2 = maxY - h2;
      }
    }

    if (this.lngRange) {
      const x = point.x;
      const w2 = size.x / 2;

      if (x - w2 < minX) {
        x2 = minX + w2;
      }
      if (x + w2 > maxX) {
        x2 = maxX - w2;
      }
    }

    // pan the map if the screen goes off the range
    if (x2 !== undefined || y2 !== undefined) {
      this.center = this.unproject(
        new Point(
          x2 !== undefined ? x2 : point.x,
          y2 !== undefined ? y2 : point.y,
        ),
      );
    }

    this.unmodified = unmodified;
    this.constraining = false;
  }

  private calcMatrices() {
    if (!this.height) {
      return;
    }

    const halfFov = this._fov / 2;
    const offset = this.centerOffset;
    this.cameraToCenterDistance = (0.5 / Math.tan(halfFov)) * this.height;

    // Find the distance from the center point [width/2 + offset.x, height/2 + offset.y] to the
    // center top point [width/2 + offset.x, 0] in Z units, using the law of sines.
    // 1 Z unit is equivalent to 1 horizontal px at the center of the map
    // (the distance between[width/2, height/2] and [width/2 + 1, height/2])
    const groundAngle = Math.PI / 2 + this._pitch;
    const fovAboveCenter = this._fov * (0.5 + offset.y / this.height);
    const topHalfSurfaceDistance =
      (Math.sin(fovAboveCenter) * this.cameraToCenterDistance) /
      Math.sin(
        clamp(Math.PI - groundAngle - fovAboveCenter, 0.01, Math.PI - 0.01),
      );
    const point = this.point;
    const x = point.x;
    const y = point.y;

    // Calculate z distance of the farthest fragment that should be rendered.
    const furthestDistance =
      Math.cos(Math.PI / 2 - this._pitch) * topHalfSurfaceDistance +
      this.cameraToCenterDistance;
    // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
    const farZ = furthestDistance * 1.01;

    // The larger the value of nearZ is
    // - the more depth precision is available for features (good)
    // - clipping starts appearing sooner when the camera is close to 3d features (bad)
    //
    // Smaller values worked well for mapbox-gl-js but deckgl was encountering precision issues
    // when rendering it's layers using custom layers. This value was experimentally chosen and
    // seems to solve z-fighting issues in deckgl while not clipping buildings too close to the camera.
    const nearZ = this.height / 50;

    // matrix for conversion from location to GL coordinates (-1 .. 1)
    // 使用 Float64Array 的原因是为了避免计算精度问题、 mat4.create() 默认使用 Float32Array
    let m = new Float64Array(16);
    // @ts-ignore
    mat4.perspective(m, this._fov, this.width / this.height, nearZ, farZ);

    // Apply center of perspective offset
    m[8] = (-offset.x * 2) / this.width;
    m[9] = (offset.y * 2) / this.height;

    // @ts-ignore
    mat4.scale(m, m, [1, -1, 1]);
    // @ts-ignore
    mat4.translate(m, m, [0, 0, -this.cameraToCenterDistance]);
    // @ts-ignore
    mat4.rotateX(m, m, this._pitch);
    // @ts-ignore
    mat4.rotateZ(m, m, this.angle);
    // @ts-ignore
    mat4.translate(m, m, [-x, -y, 0]);

    // The mercatorMatrix can be used to transform points from mercator coordinates
    // ([0, 0] nw, [1, 1] se) to GL coordinates.
    // @ts-ignore
    this.mercatorMatrix = mat4.scale([], m, [
      this.worldSize,
      this.worldSize,
      this.worldSize,
    ]);
    // scale vertically to meters per pixel (inverse of ground resolution):

    // @ts-ignore
    mat4.scale(m, m, [
      1,
      1,
      mercatorZfromAltitude(1, this.center.lat) * this.worldSize,
      1,
    ]);
    // @ts-ignore
    this.projMatrix = m;
    // @ts-ignore
    this.invProjMatrix = mat4.invert([], this.projMatrix);

    // Make a second projection matrix that is aligned to a pixel grid for rendering raster tiles.
    // We're rounding the (floating point) x/y values to achieve to avoid rendering raster images to fractional
    // coordinates. Additionally, we adjust by half a pixel in either direction in case that viewport dimension
    // is an odd integer to preserve rendering to the pixel grid. We're rotating this shift based on the angle
    // of the transformation so that 0°, 90°, 180°, and 270° rasters are crisp, and adjust the shift so that
    // it is always <= 0.5 pixels.
    const xShift = (this.width % 2) / 2;
    const yShift = (this.height % 2) / 2;
    const angleCos = Math.cos(this.angle);
    const angleSin = Math.sin(this.angle);
    const dx = x - Math.round(x) + angleCos * xShift + angleSin * yShift;
    const dy = y - Math.round(y) + angleCos * yShift + angleSin * xShift;
    // const alignedM = mat4.clone(m);
    const alignedM = new Float64Array(m);
    // @ts-ignore
    mat4.translate(alignedM, alignedM, [
      dx > 0.5 ? dx - 1 : dx,
      dy > 0.5 ? dy - 1 : dy,
      0,
    ]);
    // @ts-ignore
    this.alignedProjMatrix = alignedM;

    // @ts-ignore
    m = mat4.create();
    // @ts-ignore
    mat4.scale(m, m, [this.width / 2, -this.height / 2, 1]);
    // @ts-ignore
    mat4.translate(m, m, [1, -1, 0]);
    // @ts-ignore
    this.labelPlaneMatrix = m;

    // @ts-ignore
    m = mat4.create();
    // @ts-ignore
    mat4.scale(m, m, [1, -1, 1]);
    // @ts-ignore
    mat4.translate(m, m, [-1, -1, 0]);
    // @ts-ignore
    mat4.scale(m, m, [2 / this.width, 2 / this.height, 1]);
    // @ts-ignore
    this.glCoordMatrix = m;

    // matrix for conversion from location to screen coordinates
    this.pixelMatrix = mat4.multiply(
      // @ts-ignore
      new Float64Array(16),
      this.labelPlaneMatrix,
      this.projMatrix,
    );

    // inverse matrix for conversion from screen coordinaes to location
    // @ts-ignore
    m = mat4.invert(new Float64Array(16), this.pixelMatrix);
    if (!m) {
      throw new Error('failed to invert matrix');
    }
    // @ts-ignore
    this.pixelMatrixInverse = m;

    this.posMatrixCache = {};
    this.alignedPosMatrixCache = {};
  }
}
