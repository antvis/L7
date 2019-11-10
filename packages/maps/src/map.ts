import {
  Bounds,
  container,
  CoordinateSystem,
  ICoordinateSystemService,
  ILngLat,
  IMapConfig,
  IMapService,
  IPoint,
  IViewport,
  MapType,
  TYPES,
} from '@l7/core';
import { DOM } from '@l7/utils';
import { inject, injectable } from 'inversify';
import { IAMapEvent, IAMapInstance } from '../typings/index';

@injectable()
export default class MapService<MapInstance> implements IMapService {
  public map: MapInstance;

  @inject(TYPES.ICoordinateSystemService)
  protected readonly coordinateSystemService: ICoordinateSystemService;
  @inject(TYPES.IEventEmitter)
  protected eventEmitter: IEventEmitter;
  protected markerContainer: HTMLElement;
  protected $mapContainer: HTMLElement | null;

  private cameraChangedCallback: (viewport: IViewport) => void;

  public getMarkerContainer(): HTMLElement {
    return this.markerContainer;
  }
}
