import Zoom from '../zoom';
import TestScene from '../../../../utils/src/test/test-scene'


describe('zoom', () => {
   const zoom = new Zoom()
    it('zoom getDefault', () => {
         expect(zoom.getDefault().name).toEqual('zoom');
         const scene = TestScene();
         scene.addControl(zoom);
         zoom.disable();
    
      });
      
    
  });
  