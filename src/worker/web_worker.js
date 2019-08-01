import L7 from '../index';
export default function() {
  return (new Worker(L7.workerUrl));
}
