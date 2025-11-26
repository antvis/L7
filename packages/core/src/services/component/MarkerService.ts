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
  private mapEventsRegistered: boolean = false;

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
      this.registerMapEvents();
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
    this.registerMapEvents();
  }

  public addMarkerLayers(): void {
    this.unAddMarkerLayers.forEach((markerLayer: IMarkerLayer) => {
      this.markerLayers.push(markerLayer);
      markerLayer.addTo(this.scene);
    });
    this.unAddMarkers = [];
  }

  public removeMarker(marker: IMarker): void {
    marker.remove();
    this.markers.indexOf(marker);
    const markerIndex = this.markers.indexOf(marker);
    if (markerIndex > -1) {
      this.markers.splice(markerIndex, 1);
    }
    // 如果所有 marker 都被移除，注销地图事件
    if (this.markers.length === 0) {
      this.unregisterMapEvents();
    }
  }

  public removeAllMarkers(): void {
    this.destroy();
  }

  public init(scene: L7Container): void {
    this.scene = scene;
    this.mapsService = scene.mapService;
  }

  public destroy(): void {
    this.unregisterMapEvents();
    this.markers.forEach((marker: IMarker) => {
      marker.remove();
    });
    this.markers = [];
    this.markerLayers.forEach((layer: IMarkerLayer) => {
      layer.destroy();
    });
    this.markerLayers = [];
  }

  private updateAllMarkers = () => {
    this.markers.forEach((marker: IMarker) => {
      marker.update();
    });
  };

  private registerMapEvents(): void {
    if (this.mapEventsRegistered || !this.mapsService) {
      return;
    }
    this.mapEventsRegistered = true;
    // 监听地图的相机变化事件（兼容不同底图）
    // camerachange: 适用于高德1.x、mapbox等
    // viewchange: 适用于高德2.0
    this.mapsService.on('camerachange', this.updateAllMarkers);
    this.mapsService.on('viewchange', this.updateAllMarkers);
  }

  private unregisterMapEvents(): void {
    if (!this.mapEventsRegistered || !this.mapsService) {
      return;
    }
    this.mapEventsRegistered = false;
    this.mapsService.off('camerachange', this.updateAllMarkers);
    this.mapsService.off('viewchange', this.updateAllMarkers);
  }

  private removeMakerLayerMarker(layer: IMarkerLayer) {
    layer.destroy();
  }
}
