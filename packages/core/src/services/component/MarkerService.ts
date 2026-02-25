import type { L7Container } from '../../inversify.config';
import type { IMapService } from '../map/IMapService';
import type { IMarker, IMarkerLayer, IMarkerService } from './IMarkerService';

export default class MarkerService implements IMarkerService {
  public container: HTMLElement;
  private scene: L7Container;
  private mapsService: IMapService;
  private markers: IMarker[] = [];
  private markerLayers: IMarkerLayer[] = [];
  private unAddMarkers: IMarker[] = [];
  private unAddMarkerLayers: IMarkerLayer[] = [];
  private eventRegistered: boolean = false;

  public addMarkerLayer(markerLayer: IMarkerLayer): void {
    if (this.mapsService.map && this.mapsService.getMarkerContainer()) {
      this.markerLayers.push(markerLayer);
      markerLayer.addTo(this.scene);
    } else {
      this.unAddMarkerLayers.push(markerLayer);
    }
  }

  public removeMarkerLayer(layer: IMarkerLayer): void {
    layer.destroy();
    this.markerLayers.indexOf(layer);
    const markerIndex = this.markerLayers.indexOf(layer);
    if (markerIndex > -1) {
      this.markerLayers.splice(markerIndex, 1);
    }
  }

  public addMarker(marker: IMarker): void {
    if (this.mapsService.map && this.mapsService.getMarkerContainer()) {
      this.markers.push(marker);
      marker.addTo(this.scene);
      // 注册相机变化事件来更新 marker 位置
      this.registerCameraEvents();
    } else {
      this.unAddMarkers.push(marker);
    }
  }

  public addMarkers(): void {
    this.unAddMarkers.forEach((marker: IMarker) => {
      marker.addTo(this.scene);
      this.markers.push(marker);
    });
    this.unAddMarkers = [];
    // 注册相机变化事件来更新 marker 位置
    if (this.markers.length > 0) {
      this.registerCameraEvents();
    }
  }

  public addMarkerLayers(): void {
    this.unAddMarkerLayers.forEach((markerLayer: IMarkerLayer) => {
      this.markerLayers.push(markerLayer);
      markerLayer.addTo(this.scene);
    });
    this.unAddMarkerLayers = [];
  }

  public removeMarker(marker: IMarker): void {
    marker.remove();
    this.markers.indexOf(marker);
    const markerIndex = this.markers.indexOf(marker);
    if (markerIndex > -1) {
      this.markers.splice(markerIndex, 1);
    }
    // 当所有 marker 被移除时，取消注册相机变化事件
    if (this.markers.length === 0) {
      this.unregisterCameraEvents();
    }
  }

  public removeAllMarkers(): void {
    this.destroy();
  }

  public init(scene: L7Container): void {
    this.scene = scene;
    this.mapsService = scene.mapService;
  }

  private registerCameraEvents(): void {
    if (this.eventRegistered || !this.mapsService) {
      return;
    }
    this.mapsService.on('camerachange', this.updateMarkers);
    this.mapsService.on('viewchange', this.updateMarkers);
    this.eventRegistered = true;
  }

  private unregisterCameraEvents(): void {
    if (!this.eventRegistered || !this.mapsService) {
      return;
    }
    this.mapsService.off('camerachange', this.updateMarkers);
    this.mapsService.off('viewchange', this.updateMarkers);
    this.eventRegistered = false;
  }

  private updateMarkers = (): void => {
    this.markers.forEach((marker: IMarker) => {
      if (marker && typeof (marker as any).update === 'function') {
        (marker as any).update();
      }
    });
  };

  public destroy(): void {
    // 取消注册相机变化事件
    this.unregisterCameraEvents();
    this.markers.forEach((marker: IMarker) => {
      marker.remove();
    });
    this.markers = [];
    this.markerLayers.forEach((layer: IMarkerLayer) => {
      layer.destroy();
    });
    this.markerLayers = [];
  }

  private removeMakerLayerMarker(layer: IMarkerLayer) {
    layer.destroy();
  }
}
