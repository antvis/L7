
declare module 'probe.gl' {
  class Log {
    constructor(options: { id: string });

    priority: number;
    enable(enabled?: boolean): Log;

    debug(priority: number, message: string): () => any;
    info(priority: number, message: string): () => any;
    warn(priority: number, message: string): () => any;
    error(priority: number, message: string): () => any;
    probe(priority: number, message: string): () => any;
  }
}
/// <reference path="../../../node_modules/eventemitter3/index.d.ts" />
