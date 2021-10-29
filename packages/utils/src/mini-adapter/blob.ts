// @ts-nocheck
// tslint:disable
export class Blob {
  /**
   *
   * @param buffers only support zero index
   * @param type mimetype image/png image/webp...
   */
  constructor(
    public readonly buffers: ArrayBuffer[],
    public readonly type: string | { type: string },
  ) {}

  public arraybuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(this.buffers[0]);
  }

  public stream() {
    throw new Error('not implemented');
  }

  public text() {
    throw new Error('not implemented');
  }

  public slice(start?: number, end?: number, contentType?: string) {
    throw new Error('not implemented');
  }
}
