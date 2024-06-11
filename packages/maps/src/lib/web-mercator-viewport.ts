import type { IMapCamera, IViewport } from '@antv/l7-core';
import WebMercatorViewport from 'viewport-mercator-project';

export default class Viewport implements IViewport {
  public viewport = new WebMercatorViewport();

  public syncWithMapCamera(mapCamera: Partial<IMapCamera>) {
    const { center, zoom, pitch, bearing, viewportHeight, viewportWidth } = mapCamera;

    const preView = {
      width: this.viewport.width,
      height: this.viewport.height,
      longitude: this.viewport.center[0],
      latitude: this.viewport.center[1],
      zoom: this.viewport.zoom,
      pitch: this.viewport.pitch,
      bearing: this.viewport.bearing,
    };

    this.viewport = new WebMercatorViewport({
      ...preView,
      width: viewportWidth,
      height: viewportHeight,
      longitude: center && center[0],
      latitude: center && center[1],
      zoom,
      pitch,
      bearing,
    });
  }

  public getZoom(): number {
    return this.viewport.zoom;
  }

  public getZoomScale(): number {
    return Math.pow(2, this.getZoom());
  }

  public getCenter(): [number, number] {
    return [this.viewport.longitude, this.viewport.latitude];
  }

  public getProjectionMatrix(): number[] {
    return this.viewport.projectionMatrix;
  }

  public getModelMatrix(): number[] {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  public getViewMatrix(): number[] {
    return this.viewport.viewMatrix;
  }

  public getViewMatrixUncentered(): number[] {
    // @ts-ignore
    return this.viewport.viewMatrixUncentered;
  }

  public getViewProjectionMatrix(): number[] {
    // @ts-ignore
    return this.viewport.viewProjectionMatrix;
  }

  public getViewProjectionMatrixUncentered(): number[] {
    // @ts-ignore
    return this.viewport.viewProjectionMatrix;
  }

  public getFocalDistance() {
    return 1;
  }

  public projectFlat(lngLat: [number, number], scale?: number | undefined): [number, number] {
    return this.viewport.projectFlat(lngLat, scale);
  }
}
