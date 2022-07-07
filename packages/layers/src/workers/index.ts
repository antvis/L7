import { registerWorker, WorkerObject } from '@antv/l7-utils';

const LineTriangulationWorker: WorkerObject = {
  id: 'line-triangulation',
  name: 'line-triangulation',
  module: 'layers',
  options: {},
};

registerWorker(LineTriangulationWorker.id, LineTriangulationWorker);
