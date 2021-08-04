import { Container, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../types';
import { IMapService } from '../map/IMapService';
import {
  IMarker,
  IMarkerLayer,
  IMarkerService,
  IMarkerServiceCfg,
} from './IMarkerService';

@injectable()
export default class MarkerService implements IMarkerService {
  public container: HTMLElement;
  private scene: Container;
  private mapsService: IMapService;
  private markers: IMarker[] = [];
  private markerLayers: IMarkerLayer[] = [];
  private unAddMarkers: IMarker[] = [];
  private unAddMarkerLayers: IMarkerLayer[] = [];

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
  }

  public removeAllMarkers(): void {
    this.destroy();
  }

  public init(scene: Container): void {
    // this.container = cfg.container;
    this.scene = scene;
    this.mapsService = scene.get<IMapService>(TYPES.IMapService);
  }
  public destroy(): void {
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
