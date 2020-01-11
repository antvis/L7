import { Container, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IMapService } from '../map/IMapService';
import { IMarker, IMarkerService, IMarkerServiceCfg } from './IMarkerService';

@injectable()
export default class MarkerService implements IMarkerService {
  public container: HTMLElement;
  private scene: Container;
  private mapsService: IMapService;
  private markers: IMarker[] = [];
  private unAddMarkers: IMarker[] = [];
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

  public removeMarker(marker: IMarker): void {
    marker.remove();
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
  }
}
