export enum InteractionEvent {
  Hover = 'hover',
  Click = 'click',
}

export interface IInteractionService {
  init(): void;
  destroy(): void;
  on(
    eventName: InteractionEvent,
    callback: (params: { x: number; y: number; type: string }) => void,
  ): void;
  triggerHover({ x, y, type }: { x: number; y: number; type?: string }): void;
}
