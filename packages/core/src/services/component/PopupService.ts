import { Container, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../types';
import { IMapService } from '../map/IMapService';
import { IPopup, IPopupService } from './IPopupService';

@injectable()
export default class PopupService implements IPopupService {
  private scene: Container;
  private popup: IPopup;
  private mapsService: IMapService;
  private unAddPopup: IPopup | null;

  public removePopup(popup: IPopup): void {
    popup.remove();
  }

  public destroy(): void {
    this.popup.remove();
  }

  public addPopup(popup: IPopup) {
    if (this.popup) {
      this.popup.remove();
    }
    if (this.mapsService.map && this.mapsService.getMarkerContainer()) {
      popup.addTo(this.scene);
      this.popup = popup;
    } else {
      this.unAddPopup = popup;
    }
  }
  public initPopup() {
    if (this.unAddPopup) {
      this.addPopup(this.unAddPopup);
      this.unAddPopup = null;
    }
  }

  public init(scene: Container) {
    this.scene = scene;
    this.mapsService = scene.get<IMapService>(TYPES.IMapService);
  }
}
