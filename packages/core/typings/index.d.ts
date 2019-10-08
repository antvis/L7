declare module 'probe.gl' {
  class Log {
    constructor(options: { id: string });

    enable(enabled?: boolean): Log;

    warn(message: string): () => any;
    info(message: string): () => any;
    error(message: string): () => any;
  }
}