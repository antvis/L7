export type CallBack = (...args: any[]) => any;
export interface IHook {
  call: (...args: any[]) => void;
  tap(name: string, task: CallBack): void;
}
