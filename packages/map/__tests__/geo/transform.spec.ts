import Point from '@mapbox/point-geometry';
import { LngLat } from '../../src/map/geo/lng_lat';
import { MAX_VALID_LATITUDE, Transform } from '../../src/map/geo/transform';
import { fixedCoord, fixedLngLat } from '../libs/fixed';

describe('transform', () => {
  test('creates a transform', () => {
    const transform = new Transform(0, 22, 0, 60, true);
    transform.resize(500, 500);
    expect(transform.unmodified).toBe(true);
    expect(transform.tileSize).toBe(512);
    expect(transform.worldSize).toBe(512);
    expect(transform.width).toBe(500);
    expect(transform.minZoom).toBe(0);
    expect(transform.minPitch).toBe(0);
    // Support signed zero
    expect(transform.bearing === 0 ? 0 : transform.bearing).toBe(0);
    expect((transform.bearing = 1)).toBe(1);
    expect(transform.bearing).toBe(1);
    expect((transform.bearing = 0)).toBe(0);
    expect(transform.unmodified).toBe(false);
    expect((transform.minZoom = 10)).toBe(10);
    expect((transform.maxZoom = 10)).toBe(10);
    expect(transform.minZoom).toBe(10);
    expect(transform.center).toEqual({ lng: 0, lat: 0 });
    expect(transform.maxZoom).toBe(10);
    expect((transform.minPitch = 10)).toBe(10);
    expect((transform.maxPitch = 10)).toBe(10);
    expect(transform.size.equals(new Point(500, 500))).toBe(true);
    expect(transform.centerPoint.equals(new Point(250, 250))).toBe(true);
    expect(transform.scaleZoom(0)).toBe(-Infinity);
    expect(transform.scaleZoom(10)).toBe(3.3219280948873626);
    expect(transform.point).toEqual(new Point(262144, 262144));
    expect(transform.height).toBe(500);
    expect(fixedLngLat(transform.pointLocation(new Point(250, 250)))).toEqual({ lng: 0, lat: 0 });
    expect(fixedCoord(transform.pointCoordinate(new Point(250, 250)))).toEqual({
      x: 0.5,
      y: 0.5,
      z: 0,
    });
    expect(transform.locationPoint(new LngLat(0, 0))).toEqual({ x: 250, y: 250 });
    expect(transform.locationCoordinate(new LngLat(0, 0))).toEqual({ x: 0.5, y: 0.5, z: 0 });
  });

  test('does not throw on bad center', () => {
    expect(() => {
      const transform = new Transform(0, 22, 0, 60, true);
      transform.resize(500, 500);
      transform.center = new LngLat(50, -90);
    }).not.toThrow();
  });

  test('setLocationAt', () => {
    const transform = new Transform(0, 22, 0, 60, true);
    transform.resize(500, 500);
    transform.zoom = 4;
    expect(transform.center).toEqual({ lng: 0, lat: 0 });
    transform.setLocationAtPoint(new LngLat(13, 10), new Point(15, 45));
    expect(fixedLngLat(transform.pointLocation(new Point(15, 45)))).toEqual({ lng: 13, lat: 10 });
  });

  test('setLocationAt tilted', () => {
    const transform = new Transform(0, 22, 0, 60, true);
    transform.resize(500, 500);
    transform.zoom = 4;
    transform.pitch = 50;
    expect(transform.center).toEqual({ lng: 0, lat: 0 });
    transform.setLocationAtPoint(new LngLat(13, 10), new Point(15, 45));
    expect(fixedLngLat(transform.pointLocation(new Point(15, 45)))).toEqual({ lng: 13, lat: 10 });
  });

  test('has a default zoom', () => {
    const transform = new Transform(0, 22, 0, 60, true);
    transform.resize(500, 500);
    expect(transform.tileZoom).toBe(0);
    expect(transform.tileZoom).toBe(transform.zoom);
  });

  test('set zoom inits tileZoom with zoom value', () => {
    const transform = new Transform(0, 22, 0, 60);
    transform.zoom = 5;
    expect(transform.tileZoom).toBe(5);
  });

  test('set zoom clamps tileZoom to non negative value ', () => {
    const transform = new Transform(-2, 22, 0, 60);
    transform.zoom = -2;
    expect(transform.tileZoom).toBe(0);
  });

  test('set fov', () => {
    const transform = new Transform(0, 22, 0, 60, true);
    transform.fov = 10;
    expect(transform.fov).toBe(10);
    transform.fov = 10;
    expect(transform.fov).toBe(10);
  });

  test('lngRange & latRange constrain zoom and center', () => {
    const transform = new Transform(0, 22, 0, 60, true);
    transform.center = new LngLat(0, 0);
    transform.zoom = 10;
    transform.resize(500, 500);

    transform.lngRange = [-5, 5];
    transform.latRange = [-5, 5];

    transform.zoom = 0;
    expect(transform.zoom).toBe(5.1357092861044045);

    transform.center = new LngLat(-50, -30);
    expect(transform.center).toEqual(new LngLat(0, -0.0063583052861417855));

    transform.zoom = 10;
    transform.center = new LngLat(-50, -30);
    expect(transform.center).toEqual(new LngLat(-4.828338623046875, -4.828969771321582));
  });

  test('lngRange can constrain zoom and center across meridian', () => {
    const transform = new Transform(0, 22, 0, 60, true);
    transform.center = new LngLat(180, 0);
    transform.zoom = 10;
    transform.resize(500, 500);

    // equivalent ranges
    const lngRanges: [number, number][] = [
      [175, -175],
      [175, 185],
      [-185, -175],
      [-185, 185],
    ];

    for (const lngRange of lngRanges) {
      transform.lngRange = lngRange;
      transform.latRange = [-5, 5];

      transform.zoom = 0;
      expect(transform.zoom).toBe(5.1357092861044045);

      transform.center = new LngLat(-50, -30);
      expect(transform.center).toEqual(new LngLat(180, -0.0063583052861417855));

      transform.zoom = 10;
      transform.center = new LngLat(-50, -30);
      expect(transform.center).toEqual(new LngLat(-175.171661376953125, -4.828969771321582));

      transform.center = new LngLat(230, 0);
      expect(transform.center).toEqual(new LngLat(-175.171661376953125, 0));

      transform.center = new LngLat(130, 0);
      expect(transform.center).toEqual(new LngLat(175.171661376953125, 0));
    }
  });

  test('coveringZoomLevel', () => {
    const options = {
      minzoom: 1,
      maxzoom: 10,
      tileSize: 512,
      roundZoom: false,
    };

    const transform = new Transform(0, 22, 0, 60, true);

    transform.zoom = 0;
    expect(transform.coveringZoomLevel(options)).toBe(0);

    transform.zoom = 0.1;
    expect(transform.coveringZoomLevel(options)).toBe(0);

    transform.zoom = 1;
    expect(transform.coveringZoomLevel(options)).toBe(1);

    transform.zoom = 2.4;
    expect(transform.coveringZoomLevel(options)).toBe(2);

    transform.zoom = 10;
    expect(transform.coveringZoomLevel(options)).toBe(10);

    transform.zoom = 11;
    expect(transform.coveringZoomLevel(options)).toBe(11);

    transform.zoom = 11.5;
    expect(transform.coveringZoomLevel(options)).toBe(11);

    options.tileSize = 256;

    transform.zoom = 0;
    expect(transform.coveringZoomLevel(options)).toBe(1);

    transform.zoom = 0.1;
    expect(transform.coveringZoomLevel(options)).toBe(1);

    transform.zoom = 1;
    expect(transform.coveringZoomLevel(options)).toBe(2);

    transform.zoom = 2.4;
    expect(transform.coveringZoomLevel(options)).toBe(3);

    transform.zoom = 10;
    expect(transform.coveringZoomLevel(options)).toBe(11);

    transform.zoom = 11;
    expect(transform.coveringZoomLevel(options)).toBe(12);

    transform.zoom = 11.5;
    expect(transform.coveringZoomLevel(options)).toBe(12);

    options.roundZoom = true;

    expect(transform.coveringZoomLevel(options)).toBe(13);
  });

  test('clamps latitude', () => {
    const transform = new Transform(0, 22, 0, 60, true);

    expect(transform.project(new LngLat(0, -90))).toEqual(
      transform.project(new LngLat(0, -MAX_VALID_LATITUDE)),
    );
    expect(transform.project(new LngLat(0, 90))).toEqual(
      transform.project(new LngLat(0, MAX_VALID_LATITUDE)),
    );
  });

  test('clamps pitch', () => {
    const transform = new Transform(0, 22, 0, 60, true);

    transform.pitch = 45;
    expect(transform.pitch).toBe(45);

    transform.pitch = -10;
    expect(transform.pitch).toBe(0);

    transform.pitch = 90;
    expect(transform.pitch).toBe(60);
  });

  test('maintains high float precision when calculating matrices', () => {
    const transform = new Transform(0, 22, 0, 60, true);
    transform.resize(200.25, 200.25);
    transform.zoom = 20.25;
    transform.pitch = 67.25;
    transform.center = new LngLat(0.0, 0.0);
    transform._calcMatrices();

    expect(transform.customLayerMatrix()[0].toString().length).toBeGreaterThan(10);
    expect(transform.glCoordMatrix[0].toString().length).toBeGreaterThan(10);
    expect(transform.maxPitchScaleFactor()).toBeCloseTo(2.366025418080343, 5);
  });

  test('pointCoordinate with terrain when returning null should fall back to 2D', () => {
    const transform = new Transform(0, 22, 0, 60, true);
    transform.resize(500, 500);
    const coordinate = transform.pointCoordinate(new Point(0, 0));

    expect(coordinate).toBeDefined();
  });

  test('horizon', () => {
    const transform = new Transform(0, 22, 0, 85, true);
    transform.resize(500, 500);
    transform.pitch = 75;
    const horizon = transform.getHorizon();

    expect(horizon).toBeCloseTo(170.8176101748407, 10);
  });

  test('getBounds with horizon', () => {
    const transform = new Transform(0, 22, 0, 85, true);
    transform.resize(500, 500);

    transform.pitch = 60;
    expect(transform.getBounds().getNorthWest().toArray()).toStrictEqual(
      transform.pointLocation(new Point(0, 0)).toArray(),
    );

    transform.pitch = 75;
    const top = Math.max(0, transform.height / 2 - transform.getHorizon());
    expect(top).toBeCloseTo(79.1823898251593, 10);
    expect(transform.getBounds().getNorthWest().toArray()).toStrictEqual(
      transform.pointLocation(new Point(0, top)).toArray(),
    );
  });

  test('lngLatToCameraDepth', () => {
    const transform = new Transform(0, 22, 0, 85, true);
    transform.resize(500, 500);
    transform.center = new LngLat(10.0, 50.0);

    expect(transform.lngLatToCameraDepth(new LngLat(10, 50), 4)).toBeCloseTo(0.9997324396231673);
    transform.pitch = 60;
    expect(transform.lngLatToCameraDepth(new LngLat(10, 50), 4)).toBeCloseTo(0.9865782165762236);
  });
});
