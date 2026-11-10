import CameraService from '../../../src/services/camera/CameraService';
import type { IViewport } from '../../../src/services/camera/ICameraService';

describe('CameraService subViewports', () => {
  const mockViewport = (center: [number, number] = [0, 0]): IViewport => ({
    syncWithMapCamera: jest.fn(),
    getProjectionMatrix: () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    getModelMatrix: () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    getViewMatrix: () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    getViewMatrixUncentered: () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    getViewProjectionMatrix: () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    getViewProjectionMatrixUncentered: () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    getZoom: () => 1,
    getZoomScale: () => 2,
    getFocalDistance: () => 1,
    getCenter: () => center,
    projectFlat: (lngLat) => lngLat,
  });

  it('should return primary viewport when no subViewports exist', () => {
    const service = new CameraService();
    const primary = mockViewport([0, 0]);
    service.update(primary);

    const sub = service.getSubViewports();
    expect(sub.length).toBe(1);
    expect(sub[0]).toBe(primary);
  });

  it('should delegate getSubViewports to primary viewport', () => {
    const service = new CameraService();
    const primary = mockViewport([0, 0]);
    const sub1 = mockViewport([-360, 0]);
    const sub2 = mockViewport([360, 0]);
    primary.subViewports = [sub1, primary, sub2];

    service.update(primary);

    const sub = service.getSubViewports();
    expect(sub.length).toBe(3);
    expect(sub).toEqual([sub1, primary, sub2]);
  });

  it('should switch and reset viewport correctly', () => {
    const service = new CameraService();
    const primary = mockViewport([0, 0]);
    const sub1 = mockViewport([360, 0]);
    primary.subViewports = [primary, sub1];

    service.update(primary);
    expect(service.getCenter()).toEqual([0, 0]);

    service.setViewport(sub1);
    expect(service.getCenter()).toEqual([360, 0]);

    service.resetViewport();
    expect(service.getCenter()).toEqual([0, 0]);
  });
});
