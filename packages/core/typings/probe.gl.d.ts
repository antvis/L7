declare module 'probe.gl' {
  class Log {
    constructor(options: { id: string });

    priority: number;
    enable(enabled?: boolean): Log;

    debug(priority: number, message: string): () => any;
    info(priority: number, message: string): () => any;
    warn(message: string): () => any;
    error(message: string): () => any;
    probe(priority: number, message: string): () => any;
  }
}
