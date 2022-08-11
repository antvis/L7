import Camera, { CAMERA_TYPE } from '../src/services/camera/Camera';
import Landmark from '../src/services/camera/Landmark';
describe('CanvasLayer', () => {
  const camera = new Camera(CAMERA_TYPE.EXPLORING);
  const landmark = new Landmark('name', camera);
  it('init', () => {
    expect(camera.matrix.length).toEqual(16);
    expect(landmark.name).toEqual('name');
  });
});
