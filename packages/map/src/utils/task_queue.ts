export type TaskID = number; // can't mark opaque due to https://github.com/flowtype/flow-remove-types/pull/61
interface ITask {
  callback: (timeStamp: number) => void;
  id: TaskID;
  cancelled: boolean;
}

class TaskQueue {
  private queue: ITask[];
  private id: TaskID;
  private cleared: boolean;
  private currentlyRunning: ITask[] | false;

  constructor() {
    this.queue = [];
    this.id = 0;
    this.cleared = false;
    this.currentlyRunning = false;
  }

  public add(callback: (timeStamp: number) => void): TaskID {
    const id = ++this.id;
    const queue = this.queue;
    queue.push({ callback, id, cancelled: false });
    return id;
  }

  public remove(id: TaskID) {
    const running = this.currentlyRunning;
    const queue = running ? this.queue.concat(running) : this.queue;
    for (const task of queue) {
      if (task.id === id) {
        task.cancelled = true;
        return;
      }
    }
  }

  public run(timeStamp: number = 0) {
    const queue = (this.currentlyRunning = this.queue);

    // Tasks queued by callbacks in the current queue should be executed
    // on the next run, not the current run.
    this.queue = [];

    for (const task of queue) {
      if (task.cancelled) {
        continue;
      }
      task.callback(timeStamp);
      if (this.cleared) {
        break;
      }
    }

    this.cleared = false;
    this.currentlyRunning = false;
  }

  public clear() {
    if (this.currentlyRunning) {
      this.cleared = true;
    }
    this.queue = [];
  }
}

export default TaskQueue;
