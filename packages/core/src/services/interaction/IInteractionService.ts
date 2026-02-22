import type { ILngLat } from '../map/IMapService';

export enum InteractionEvent {
  Hover = 'hover',
  Click = 'click',
  DblClick = 'dblclick',
  Select = 'select',
  Active = 'active',
  Drag = 'drag',
  Press = 'press',
}

export interface IInteractionTarget {
  x: number;
  y: number;
  lngLat: ILngLat;
  type: string;
  featureId?: number;
  target: MouseEvent | TouchEvent | PointerEvent;
}

export interface IInteractionService {
  indragging: boolean;
  init(): void;
  destroy(): void;
  on(eventName: InteractionEvent, callback: (params: IInteractionTarget) => void): void;
  triggerHover({ x, y, type }: Partial<IInteractionTarget>): void;
  triggerSelect(id: number): void;
  triggerActive(id: number): void;
}
