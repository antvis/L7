// https://github.com/mrdoob/three.js/blob/master/src/core/Clock.js
export default class Clock {
  private autoStart: boolean;
  private startTime: number = 0;
  private oldTime: number = 0;
  private running: boolean = false;
  private elapsedTime: number = 0;
  constructor(autoStart = true) {
    this.autoStart = autoStart;
  }
  public start() {
    this.startTime = (
      typeof performance === 'undefined' ? Date : performance
    ).now();

    this.oldTime = this.startTime;
    this.elapsedTime = 0;
    this.running = true;
  }
  public stop() {
    this.getElapsedTime();
    this.running = false;
    this.autoStart = false;
  }

  public getElapsedTime() {
    this.getDelta();
    return this.elapsedTime;
  }
  public getDelta() {
    let diff = 0;

    if (this.autoStart && !this.running) {
      this.start();
      return 0;
    }

    if (this.running) {
      const newTime = (
        typeof performance === 'undefined' ? Date : performance
      ).now();
      diff = (newTime - this.oldTime) / 1000;
      this.oldTime = newTime;
      this.elapsedTime += diff;
    }
    return diff;
  }
}
