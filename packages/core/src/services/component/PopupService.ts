import { Container, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IMapService } from '../map/IMapService';
import { IPopup, IPopupService } from './IPopupService';

@injectable()
export default class PopupService implements IPopupService {
  private scene: Container;
  private popup: IPopup;

  public removePopup(popup: IPopup): void {
    popup.remove();
  }

  public destroy(): void {
    this.popup.remove();
  }

  public addPopup(popup: IPopup) {
    this.popup.remove();
    popup.addTo(this.scene);
    this.popup = popup;
  }

  public init(scene: Container) {
    this.scene = scene;
  }
}
