import { RenderPass } from '@ali/r3-renderer-basic';
import { TextureFilter } from '@ali/r3-base';
export class GeoRenderPass extends RenderPass {

  constructor(name, priority, renderTarget, mask, Material, id, done) {
    renderTarget.texture.setFilter(TextureFilter.NEAREST, TextureFilter.NEAREST);
    super(name, priority, renderTarget, Material, mask);
    typeof (id) === 'string' || typeof (id) === 'number' && (id = [ id ]);
    this.id = id;
    this.renderPassFlags = [];
    this.done = done;
  }
    /* eslint-disable */
  preRender(camera, opaquaQueue, transparentQueue) {
    /* eslint-disable */
      
      opaquaQueue.items.forEach(item => {
        const nodeAbility = item.nodeAbility;
        this.renderPassFlags.push(nodeAbility.renderPassFlag);
        this.id.indexOf(nodeAbility.id) > -1 ? nodeAbility.renderPassFlag = 0 : nodeAbility.renderPassFlag = 1;
      });
     
     
  }

  postRender(camera, opaquaQueue, transparentQueue) {
      opaquaQueue.items.forEach((item, index) => {
        const nodeAbility = item.nodeAbility;
        nodeAbility.renderPassFlag = this.renderPassFlags[index];
      });
      this.renderPassFlags.length = 0;
      if(this.done) {
        this.done();
      }

  }
}

export { ColorRenderPass };
