import type { L7Container } from '../../inversify.config';
import type { IMapService } from '../map/IMapService';
import type { IPopup, IPopupService } from './IPopupService';

export default class PopupService implements IPopupService {
  private scene: L7Container;
  private mapsService: IMapService;
  private popups: IPopup[] = [];
  private unAddPopups: IPopup[] = [];

  public get isMarkerReady() {
    return this.mapsService.map && this.mapsService.getMarkerContainer();
  }

  public removePopup(popup: IPopup): void {
    if (popup?.isOpen()) {
      popup.remove();
    }

    const targetIndex = this.popups.indexOf(popup);
    if (targetIndex > -1) {
      this.popups.splice(targetIndex, 1);
    }

    const targetUnAddIndex = this.unAddPopups.indexOf(popup);
    if (targetUnAddIndex > -1) {
      this.unAddPopups.splice(targetUnAddIndex, 1);
    }
  }

  public destroy(): void {
    this.popups.forEach((popup) => popup.remove());
  }

  public addPopup(popup: IPopup) {
    if (popup && popup.getOptions().autoClose) {
      [...this.popups, ...this.unAddPopups].forEach((otherPopup) => {
        if (otherPopup.getOptions().autoClose) {
          this.removePopup(otherPopup);
        }
      });
    }

    if (this.isMarkerReady) {
      popup.addTo(this.scene);
      this.popups.push(popup);
    } else {
      this.unAddPopups.push(popup);
    }

    popup.on('close', () => {
      this.removePopup(popup);
    });
  }
  public initPopup() {
    if (this.unAddPopups.length) {
      this.unAddPopups.forEach((popup) => {
        this.addPopup(popup);
        this.unAddPopups = [];
      });
    }
  }

  public init(scene: L7Container) {
    this.scene = scene;
    this.mapsService = scene.mapService;
  }
}
