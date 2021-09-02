import { IMapCamera, IViewport } from '@antv/l7-core';
import { isMini } from '@antv/l7-utils';
import { mat4, vec3 } from 'gl-matrix';
import WebMercatorViewport from 'viewport-mercator-project';

export default class Viewport implements IViewport {
  private viewport: WebMercatorViewport;

  public syncWithMapCamera(mapCamera: Partial<IMapCamera>) {
    const {
      center,
      zoom,
      pitch,
      bearing,
      viewportHeight,
      viewportWidth,
    } = mapCamera;

    /**
     * Deck.gl 使用的也是 Mapbox 同步相机，相机参数保持一致
     * 例如相机高度固定为 height * 1.5，因此不需要传
     */
    this.viewport = new WebMercatorViewport({
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

  public getViewMatrix(): number[] {
    return this.viewport.viewMatrix;
  }

  public getViewMatrixUncentered(): number[] {
    if (isMini) {
      return this.viewport.viewMatrix;
    }
    // @ts-ignore
    return this.viewport.viewMatrixUncentered;
  }
  public getViewProjectionMatrix(): number[] {
    if (isMini) {
      return this.viewport.viewMatrix;
    }
    // @ts-ignore
    return this.viewport.viewProjectionMatrix;
  }

  public getViewProjectionMatrixUncentered(): number[] {
    if (isMini) {
      return this.viewport.viewMatrix;
    }
    // @ts-ignore
    return this.viewport.viewProjectionMatrix;
  }
  public getFocalDistance() {
    return 1;
  }

  /**
   * P20 坐标系，固定 scale
   */

  public projectFlat(
    lngLat: [number, number],
    scale?: number | undefined,
  ): [number, number] {
    if (isMini) {
      const maxs = 85.0511287798;
      const lat = Math.max(Math.min(maxs, lngLat[1]), -maxs);
      // tslint:disable-next-line:no-bitwise
      const zoomScale = 256 << 20;
      let d = Math.PI / 180;
      let x = lngLat[0] * d;
      let y = lat * d;
      y = Math.log(Math.tan(Math.PI / 4 + y / 2));
      const a = 0.5 / Math.PI;
      const b = 0.5;
      const c = -0.5 / Math.PI;
      d = 0.5;
      x = zoomScale * (a * x + b) - 215440491;
      y = -(zoomScale * (c * y + d) - 106744817);
      return [x, y];
    } else {
      return this.viewport.projectFlat(lngLat, scale);
    }
  }
}
