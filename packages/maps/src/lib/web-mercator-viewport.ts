import type { IMapCamera, IViewport } from '@antv/l7-core';
import WebMercatorViewport from 'viewport-mercator-project';

export class SubViewport implements IViewport {
  public viewport: WebMercatorViewport;
  public worldCopyIndex: number;

  constructor(viewport: WebMercatorViewport, worldCopyIndex: number) {
    this.viewport = viewport;
    this.worldCopyIndex = worldCopyIndex;
  }

  public syncWithMapCamera(mapCamera: Partial<IMapCamera>): void {
    // sub-viewport is managed by primary viewport
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

export default class Viewport implements IViewport {
  public viewport = new WebMercatorViewport();
  public subViewports: IViewport[] = [];

  public getSubViewports(): IViewport[] {
    return this.subViewports.length > 0 ? this.subViewports : [this];
  }

  public syncWithMapCamera(mapCamera: Partial<IMapCamera>) {
    const { center, zoom, pitch, bearing, viewportHeight, viewportWidth, renderWorldCopies } =
      mapCamera;

    const preView = {
      width: this.viewport.width,
      height: this.viewport.height,
      longitude: this.viewport.center[0],
      latitude: this.viewport.center[1],
      zoom: this.viewport.zoom,
      pitch: this.viewport.pitch,
      bearing: this.viewport.bearing,
    };

    const targetCenter: [number, number] = [
      center ? center[0] : preView.longitude,
      center ? center[1] : preView.latitude,
    ];

    const currentWidth = viewportWidth || preView.width;
    const currentHeight = viewportHeight || preView.height;
    const currentZoom = zoom !== undefined ? zoom : preView.zoom;
    const currentPitch = pitch !== undefined ? pitch : preView.pitch;
    const currentBearing = bearing !== undefined ? bearing : preView.bearing;

    this.viewport = new WebMercatorViewport({
      ...preView,
      width: currentWidth,
      height: currentHeight,
      longitude: targetCenter[0],
      latitude: targetCenter[1],
      zoom: currentZoom,
      pitch: currentPitch,
      bearing: currentBearing,
    });

    if (renderWorldCopies) {
      const copies = this.calculateWorldCopies(
        this.viewport,
        currentWidth,
        currentHeight,
        targetCenter,
      );

      if (copies.length > 1 || (copies.length === 1 && copies[0] !== 0)) {
        this.subViewports = copies.map((copyIndex) => {
          if (copyIndex === 0) {
            return this;
          }
          const subWebMercatorViewport = new WebMercatorViewport({
            width: currentWidth,
            height: currentHeight,
            longitude: targetCenter[0] - copyIndex * 360,
            latitude: targetCenter[1],
            zoom: currentZoom,
            pitch: currentPitch,
            bearing: currentBearing,
          });
          return new SubViewport(subWebMercatorViewport, copyIndex);
        });
      } else {
        this.subViewports = [this];
      }
    } else {
      this.subViewports = [this];
    }
  }

  private calculateWorldCopies(
    viewport: any,
    width: number,
    height: number,
    center: [number, number],
  ): number[] {
    if (!width || !height) {
      return [0];
    }
    try {
      const samplePoints: [number, number][] = [
        [0, 0],
        [width, 0],
        [0, height],
        [width, height],
        [0, height / 2],
        [width, height / 2],
        [width / 2, 0],
        [width / 2, height],
      ];

      const lngs: number[] = [];
      for (const pt of samplePoints) {
        try {
          const lngLat = viewport.unproject(pt);
          if (lngLat && !isNaN(lngLat[0]) && isFinite(lngLat[0])) {
            lngs.push(lngLat[0]);
          }
        } catch {
          // ignore unproject failures near horizon
        }
      }

      if (lngs.length === 0) {
        return [0];
      }

      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const minK = Math.max(-3, Math.ceil((minLng - 180) / 360));
      const maxK = Math.min(3, Math.floor((maxLng + 180) / 360));

      if (minK > maxK) {
        return [0];
      }

      const copies: number[] = [];
      for (let k = minK; k <= maxK; k++) {
        copies.push(k);
      }
      return copies.length > 0 ? copies : [0];
    } catch {
      return [0];
    }
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
