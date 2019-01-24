import Worker from '../worker/main.worker.js';
class WorkerPool {
  constructor(workerCount) {
    this.workerCount = workerCount || Math.max(Math.floor(window.navigator.hardwareConcurrency / 2), 1);
    this.workers = []; // worker线程池
    this.workerQueue = []; // 任务队列
    this._initWorker(); // 初始化线程池
  }
  _initWorker() {
    while (this.workers.length < this.workerCount) {
      this.workers.push(new Worker());
    }
  }
  runTask(payload) {
    return new Promise((resolve, reject) => {
      if (this.workers.length > 0) {
        const worker = this.workers.shift(); // 从线程池取出一个worker
        worker.postMessage(payload); // 向线程发送数据
        const workerCallback = e => {
          resolve(e.data); // 成功则返回数据
          // 移除事件监听
          worker.removeEventListener('message', workerCallback);
          // 重新放回线程池
          this.workers.push(worker);
          // 如果任务队列的数据还有则从任务队列继续取数据执行任务
          if (this.workerQueue.length > 0) {
            const queueData = this.workerQueue.shift();
            this.runTask(queueData.payload).then(data => {
              queueData.resolve(data);
            });
          }
        };
        // 监听worker事件
        worker.addEventListener('message', workerCallback);
        worker.addEventListener('error', e => {
          reject('filename:' + e.filename + '\nmessage:' + e.message + '\nlineno:' + e.lineno);
        });
      } else {
        // 如果线程池都被占用，则将数据丢入任务队列，并保存对应的resolve和reject
        this.workerQueue.push({
          payload,
          resolve,
          reject
        });
      }
    });
  }
  release() {
    this.workers.forEach(worker => {
      worker.terminate();
    });
  }
}
export default WorkerPool;
