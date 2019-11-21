/// <reference types="node" />
import { ChildProcess } from 'child_process';
export interface QueuedSender {
    send: (msg: any) => void;
}
export declare function createQueuedSender(childProcess: ChildProcess): QueuedSender;
