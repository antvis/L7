import Layer from '../core/layer';
import * as THREE from '../core/three';
import { RainSource } from '../source/rainSource';
import { RainBuffer } from '../geom/buffer/rain';
import DrawMaterial from '../core/extend/windframebuffer/drawMaterial';
import ImageMaterial from '../geom/material/imageMaterial';
import WindMaterial from '../core/extend/windframebuffer/windMaterial';
import UpdateMaterial from '../core/extend/windframebuffer/updateMaterial';
import { RenderPass } from '../core/engine/renderpass';


export default class RainLayer extends Layer {
  source(cfg = {}) {
    cfg.mapType = this.get('mapType');
    this.layerSource = new RainSource(cfg);
    return this;
  }
  render() {
    this.init();
    const source = this.layerSource;
    const screenPass01 = new RenderPass({
      camera: this.scene._engine._camera,
      renderer: this.scene._engine._renderer,
      clear: {
        clearColor: 0xff0000,
        clearAlpha: 0.0

      }
    });
    const screenPass02 = new RenderPass({
      camera: this.scene._engine._camera,
      renderer: this.scene._engine._renderer,
      clear: {
        clearColor: 0xff0000,
        clearAlpha: 0.0

      }
    });

    // 加载 完成事件
    source.on('imageLoaded', () => {
      const buffer = this.buffer = new RainBuffer({
        coordinates: source.geoData,
        extent: source.extent,
        image: source.image,
        uv: source.uv,
        particleImage1: source.particleImage1,
        particleImage0: source.particleImage0,
        backgroundImage: source.backgroundImage
      });
      const { bufferStruct } = buffer;
      const styleOptions = this.get('styleOptions');
      // this.screenGeo = new ImageGeometry({
      //   position: [[ 0, 0, 0 ], [ 1, 0, 0 ], [ 1, 1, 0 ], [ 0, 0, 0 ], [ 1, 1, 0 ], [ 0, 1, 0 ]],
      //   // position:buffer.bufferStruct.imgPos,
      //   uv: [[ 0, 1 ], [ 1, 1 ], [ 1, 0 ], [ 0, 1 ], [ 1, 0 ], [ 0, 0 ]]
      // });
      const u_wind_max = source.get('wind_max');
      const u_wind_min = source.get('wind_min');
      const u_extent = source.get('extent');
      const u_wind_res = source.get('wind_res');
      this.initGeometry(source.particleIndices);
      this.geometry.addAttribute('position', new THREE.Float32BufferAttribute(buffer.attributes.vertices, 3));
      this.geometry.getAttribute('position').count = source.particleIndices.length;
      this.geometry.getAttribute('position').needsUpdate = true;

      const imageGeo = this.initImageGeometry(buffer.attributes);
      const drawMaterial = new DrawMaterial({
        u_wind: bufferStruct.u_wind,
        u_particles: bufferStruct.particleStateTexture0,
        u_bbox: [ source.extent[0][0], source.extent[0][1], source.extent[1][0], source.extent[1][1] ],
        u_wind_max,
        u_wind_min,
        u_opacity: 1.0,
        u_particles_res: source.particleRes,
        u_color_ramp: bufferStruct.colorTexture
      });
      const updateMaterial = new UpdateMaterial({
        u_wind: buffer.bufferStruct.u_wind, // 风场 uv
        u_opacity: styleOptions.fadeOpacity,
        u_wind_min,
        u_wind_max,
        u_wind_res,
        u_extent,
        u_particles_res: source.particleRes,
        u_rand_seed: Math.random(),
        u_particles: bufferStruct.particleStateTexture0,
        u_speed_factor: styleOptions.speedFactor,
        u_drop_rate: styleOptions.dropRate,
        u_drop_rate_bump: styleOptions.dropRateBump,
        u_bbox: [ source.extent[0][0], source.extent[0][1], source.extent[1][0], source.extent[1][1] ]
      });


      const updateMesh = new THREE.Mesh(imageGeo, updateMaterial);
      const drawMesh = new THREE.Points(this.geometry, drawMaterial);
      screenPass01.add(updateMesh);
      screenPass02.add(drawMesh);

      // screenPass.render();
      const imagematerial = new WindMaterial({
        u_texture: screenPass02.texture,
        u_opacity: 1.0
      });
      // drawMesh.material.setValue('u_particles',screenPass01.texture)
      const imageMesh = new THREE.Mesh(imageGeo, imagematerial);
      drawMesh.onBeforeRender = function() {
        const temp = bufferStruct.particleStateTexture0;
        bufferStruct.particleStateTexture0 = screenPass01.pass.texture;
        screenPass01.pass.texture = temp;
        updateMesh.material.uniforms.needsUpdate = true;
        // screenPass01.render();

      };
      // updateMesh.onAfterRender = function(){
      //    drawMesh.material.setValue('u_particles',screenPass01.texture)
      // }

      // imageMesh.onBeforeRender=function(){
      //  // imageMesh.material.setValue('u_particles',screenPass02.texture)
      //   imageMesh.material.uniforms.needsUpdate = true;

      //   screenPass02.render();
      // }
      this.add(drawMesh);
      return this;
    //   this.imageGeo = new ImageGeometry({
    //     // position:[[0, 0, 0], [1, 0, 0], [1, 1,0],[0, 0,0], [1, 1,0],[0, 1,0]],
    //     position: buffer.bufferStruct.imgPos,
    //     uv: [[ 0, 1 ], [ 1, 1 ], [ 1, 0 ], [ 0, 1 ], [ 1, 0 ], [ 0, 0 ]]
    //   });
    //   this.imageMaterial = new ImageMaterial({
    //     name: 'TextureMat2',
    //     u_texture: buffer.bufferStruct.u_wind,
    //     u_opacity: 1.0
    //   });
    //   const camera = this.scene.render.camera;
    //   const { bufferStruct } = this.buffer;
    //   const styleOptions = this.get('styleOptions');
    //   const u_wind_max = source.get('wind_max');
    //   const u_wind_min = source.get('wind_min');
    //   const u_wind_res = source.get('wind_res');
    //   const backgroudNode = this.layerNode.createChild('backgroundNode');
    //   this.backgroudRenderer = backgroudNode.createAbility(AGeometryRenderer);
    //   this.backgroudRenderer.id = 'backgroudRenderer';
    //   this.updateTarget0 = new RenderTarget('updateTarget0', { width: targetSize, height: targetSize, clearColor: [ 0, 0.0, 0.0, 0.0 ] });
    //   this.updateTarget1 = new RenderTarget('updateTarget1', { width: targetSize, height: targetSize, clearColor: [ 0, 0.0, 0.0, 0.0 ] });
    //   this.screenTarget = new RenderTarget('screenTarget', { width: targetSize, height: targetSize, clearColor: [ 0, 0.0, 0.0, 0.0 ] });
    //   this.backgroundTarget = new RenderTarget('backgroundTarget', { width: targetSize, height: targetSize, clearColor: [ 0, 0.0, 0.0, 0.0 ] });
    //   // 绘制粒子
    //   this.updateTarget1.texture = bufferStruct.particleStateTexture1;
    //   this.backgroundTarget.texture = bufferStruct.backgroundTexture;
    //   const drawMaterial = this.drawMaterial = new DrawMaterial({
    //     u_wind: bufferStruct.u_wind,
    //     u_particles: bufferStruct.particleStateTexture0,
    //     u_bbox: [ source.extent[0][0], source.extent[0][1], source.extent[1][0], source.extent[1][1] ],
    //     u_wind_max,
    //     u_wind_min,
    //     u_opacity: 1.0,
    //     u_particles_res: source.particleRes,
    //     u_color_ramp: bufferStruct.colorTexture
    //   });
    //   const drawMaterial2 = this.drawMaterial2 = new DrawMaterial({
    //     u_wind: bufferStruct.u_wind,
    //     u_particles: bufferStruct.particleStateTexture0,
    //     u_bbox: [ source.extent[0][0], source.extent[0][1], source.extent[1][0], source.extent[1][1] ],
    //     u_wind_max,
    //     u_wind_min,
    //     u_opacity: 0.9,
    //     u_particles_res: source.particleRes,
    //     u_color_ramp: bufferStruct.colorTexture
    //   });
    //   // 更新粒子
    //   const updateMaterial = this.updateMaterial = new UpdateMaterial({
    //     name: 'updateMaterial',
    //     u_wind: buffer.bufferStruct.u_wind, // 风场 uv
    //     u_opacity: styleOptions.fadeOpacity,
    //     u_wind_min,
    //     u_wind_max,
    //     u_wind_res,
    //     u_extent,
    //     u_particles_res: source.particleRes,
    //     u_rand_seed: Math.random(),
    //     u_particles: bufferStruct.particleStateTexture0,
    //     u_speed_factor: styleOptions.speedFactor,
    //     u_drop_rate: styleOptions.dropRate,
    //     u_drop_rate_bump: styleOptions.dropRateBump,
    //     u_bbox: [ source.extent[0][0], source.extent[0][1], source.extent[1][0], source.extent[1][1] ]
    //   });
    //   this.drawParticles();// 生成geometry;
    //   this._drawTexture(bufferStruct.u_wind, 0); // render pass geo
    //   this.updatePass = new GeoRenderPass('updateTarget', -1, this.updateTarget0, 1, updateMaterial, this.layerId, () => {
    //     this.updateParticles(); // 更新粒子位置
    //   });
    //   this.screenPass = new GeoRenderPass('screenTarget', -1, this.screenTarget, 1, drawMaterial, 'wind', () => {
    //     // this._drawScreen(); // 更新过后的粒子绘制到画布
    //   });
    //   const renderer = camera.sceneRenderer;
    //   renderer.addRenderPass(this.screenPass);
    //   renderer.addRenderPass(this.updatePass);

    //   this.updateParticles();
    //   this._drawScreen();

    //   return this;
    });

  }
  _drawScreen() {
    // 交换背景
    this._drawWindTexture(this.screenTarget.texture, 1.0);
    //
    this._drawBackGround();
    const temp = this.backgroundTarget;
    this.backgroundTarget = this.screenTarget;
    this.screenTarget = temp;

  }
  _drawBackGround() {
     // 将文理
    const TextureMat = new WindMaterial({
      name: 'TextureMat',
      u_texture: this.backgroundTarget.texture,
      u_opacity: 0.99
    });
    this.backgroudRenderer.geometry = this.screenGeo;

    this.backgroudRenderer.setMaterial(TextureMat);
  }
  _drawTexture(texture, opacity) {
    // 将文理
    const TextureMat = new WindMaterial({
      name: 'TextureMat',
      u_texture: texture,
      u_opacity: opacity
    });
    this.renderer.geometry = this.screenGeo;

    this.renderer.setMaterial(TextureMat);
  }
  _drawWindTexture(texture) {
    // 将文理
    const TextureMat = new WindMaterial({
      name: 'TextureMat',
      u_texture: texture,
      u_opacity: 1
    });
    this.renderer.geometry = this.screenGeo;

    this.renderer.setMaterial(TextureMat);
  }
  drawParticles() {
    const windNode = this.layerNode.createChild('windNode');
    this.windRenderer = windNode.createAbility(AGeometryRenderer);
    this.windRenderer.id = 'wind';
    const source = this.layerSource;
    const drawGeometry = new DrawGeometry({
      index: source.particleIndices
    });
    this.windRenderer.renderPriority = 1;
    this.windRenderer.geometry = drawGeometry;
    this.windRenderer.setMaterial(new BlankMaterial('blanktest')); // 直接绘制到屏幕
    // this.backgroudRenderer.geometry = drawGeometry;
    // this.backgroudRenderer.setMaterial(this.drawMaterial2)
    // this.windRenderer.setMaterial(new BlankMaterial('blanktest'));

  }
 // 更新粒子运动位置
  updateParticles() {

    this.updatePass.replaceMaterial.setValue('u_particles', this.updateTarget0.texture);
    this.drawMaterial.setValue('u_particles', this.updateTarget0.texture);
    this.drawMaterial2.setValue('u_particles', this.updateTarget1.texture);
    const temp = this.updateTarget0;
    this.updateTarget0 = this.updateTarget1;
    this.updateTarget1 = temp;
    this.updatePass.renderTarget = this.updateTarget0;


  }
  initGeometry(a_index) {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('a_index', new THREE.Float32BufferAttribute(a_index, 1));

  }
  initUpdateGeometry() {
    this.geometry = new THREE.BufferGeometry();
  }
  initImageGeometry(attributes) {
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(new Float32Array([ 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0 ]), 3));
    geometry.addAttribute('uv', new THREE.Float32BufferAttribute(attributes.uvs, 2));
    return geometry;
  }

}
