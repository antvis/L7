export function bindAll(fns: string[], context: any) {
  fns.forEach((fn) => {
    if (!context[fn]) {
      return;
    }
    context[fn] = context[fn].bind(context);
  });
}

// 频率控制器
export class FrequencyController {
  private duration: number = 16;
  private timestamp: number = new Date().getTime();
  constructor(duration: number = 16) {
    this.duration = duration;
  }
  public run(callback: () => any) {
    const currentTime = new Date().getTime();
    const timeCut = currentTime - this.timestamp;
    this.timestamp = currentTime;

    if (timeCut >= this.duration) {
      callback();
    }
  }
}
