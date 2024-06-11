import type { IModel, IModelUniform, ITexture2D } from '@antv/l7-core';
import { gl } from '@antv/l7-core';

import BaseModel from '../../core/BaseModel';
import type { IGeometryLayerStyleOptions } from '../../core/interface';
import spriteFrag from '../shaders/sprite_frag.glsl';
import spriteVert from '../shaders/sprite_vert.glsl';

enum SPRITE_ANIMATE_DIR {
  'UP' = 'up',
  'DOWN' = 'down',
}

export default class SpriteModel extends BaseModel {
  protected texture: ITexture2D;
  protected mapTexture: string | undefined;
  protected positions: number[];
  protected indices: number[];
  protected timer: number;
  protected spriteTop: number;
  protected spriteUpdate: number;
  protected spriteAnimate: SPRITE_ANIMATE_DIR;

  public initSprite(radius = 10, spriteCount = 100, lng = 120, lat = 30) {
    const indices = [];
    const positions = [];
    const heightLimit =
      this.spriteAnimate === SPRITE_ANIMATE_DIR.UP ? -this.spriteTop : this.spriteTop;
    for (let i = 0; i < spriteCount; i++) {
      const height = Math.random() * heightLimit;
      positions.push(...getPos(height));
    }
    for (let i = 0; i < spriteCount; i++) {
      indices.push(i);
    }

    function getPos(z: number) {
      const randomX = radius * Math.random();
      const randomY = radius * Math.random();
      const x = -radius / 2 + randomX;
      const y = -radius / 2 + randomY;

      return [x + lng, -y + lat, z, 0, 0];
    }

    return { indices, positions };
  }

  public planeGeometryUpdateTriangulation = () => {
    const { spriteBottom = -10 } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    const updateZ = this.spriteUpdate;
    const bottomZ = spriteBottom;
    const topZ = this.spriteTop;

    for (let i = 0; i < this.positions.length; i += 5) {
      if (this.spriteAnimate === SPRITE_ANIMATE_DIR.UP) {
        this.positions[i + 2] += updateZ;
        if (this.positions[i + 2] > topZ) {
          this.positions[i + 2] = bottomZ;
        }
      } else {
        this.positions[i + 2] -= updateZ;
        if (this.positions[i + 2] < bottomZ) {
          this.positions[i + 2] = topZ;
        }
      }
    }

    return {
      vertices: this.positions,
      indices: this.indices,
      size: 5,
    };
  };

  /**
   * Recalculate and update position attribute.
   */
  private updatePosition = () => {
    this.planeGeometryUpdateTriangulation();
    const vertexAttribute =
      this.styleAttributeService.getLayerStyleAttribute('position')?.vertexAttribute;
    if (vertexAttribute) {
      // [x1, y1, z1, x2, y2, z2...]
      const updated: number[] = [];
      for (let i = 0; i < this.positions.length; i += 5) {
        updated.push(this.positions[i], this.positions[i + 1], this.positions[i + 2]);
      }
      vertexAttribute.updateBuffer({
        data: updated,
        offset: 0,
      });
    }
    this.layerService.throttleRenderLayers();

    this.timer = requestAnimationFrame(this.updatePosition);
  };

  public planeGeometryTriangulation = () => {
    const {
      center = [120, 30],
      spriteCount = 100,
      spriteRadius = 10,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;

    const { indices, positions } = this.initSprite(spriteRadius, spriteCount, ...center);
    this.positions = positions;
    this.indices = indices;
    return {
      vertices: positions,
      indices,
      size: 5,
    };
  };

  public getUninforms(): IModelUniform {
    const commoninfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();
    return {
      ...commoninfo.uniformsOption,
      ...attributeInfo.uniformsOption,
    };
  }
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      opacity,
      mapTexture,
      spriteScale = 1,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    if (this.mapTexture !== mapTexture) {
      this.mapTexture = mapTexture;
      this.texture?.destroy();
      this.textures = [];
      this.updateTexture(mapTexture);
    }
    const commonOptions = {
      u_opacity: opacity || 1,
      u_mapFlag: mapTexture ? 1 : 0,
      u_Scale: spriteScale,
      u_texture: this.texture,
    };
    this.textures = [this.texture];
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public clearModels(): void {
    cancelAnimationFrame(this.timer);
    this.texture?.destroy();
    this.textures = [];
  }

  public async initModels(): Promise<IModel[]> {
    const {
      mapTexture,
      spriteTop = 300,
      spriteUpdate = 10,
      spriteAnimate = SPRITE_ANIMATE_DIR.DOWN,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    this.initUniformsBuffer();
    this.mapTexture = mapTexture;
    this.spriteTop = spriteTop;
    this.spriteUpdate = spriteUpdate;
    spriteAnimate === 'up'
      ? (this.spriteAnimate = SPRITE_ANIMATE_DIR.UP)
      : (this.spriteAnimate = SPRITE_ANIMATE_DIR.DOWN);

    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });

    this.updateTexture(mapTexture);

    setTimeout(() => {
      this.updatePosition();
    }, 100);

    const model = await this.layer.buildLayerModel({
      moduleName: 'geometrySprite',
      vertexShader: spriteVert,
      fragmentShader: spriteFrag,
      triangulation: this.planeGeometryTriangulation,
      defines: this.getDefines(),
      inject: this.getInject(),
      primitive: gl.POINTS,
      depth: { enable: false },
      blend: this.getBlend(),
    });
    return [model];
  }

  public async buildModels(): Promise<IModel[]> {
    return this.initModels();
  }

  public updateTexture(mapTexture: string | undefined): void {
    const { createTexture2D } = this.rendererService;

    if (mapTexture) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.texture = createTexture2D({
          data: img,
          width: img.width,
          height: img.height,
          wrapS: gl.CLAMP_TO_EDGE,
          wrapT: gl.CLAMP_TO_EDGE,
        });
        this.layerService.reRender();
      };
      img.src = mapTexture;
    } else {
      this.texture = createTexture2D({
        width: 1,
        height: 1,
      });
    }
  }

  protected registerBuiltinAttributes() {
    return '';
  }
}
