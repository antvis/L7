import {
  AttributeType,
  gl,
  IAnimateOption,
  IEncodeFeature,
  ILayerConfig,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { Version } from '@antv/l7-maps';

import BaseModel from '../../core/BaseModel';
import { IGeometryLayerStyleOptions } from '../../core/interface';
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
    const mapService = this.mapService;
    const heightLimit =
      this.spriteAnimate === SPRITE_ANIMATE_DIR.UP
        ? -this.spriteTop
        : this.spriteTop;
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
      if (mapService.version === Version['GAODE2.x']) {
        // @ts-ignore
        const [a, b] = mapService.lngLatToCoord([x + lng, -y + lat]) as [
          number,
          number,
        ];
        return [a, b, z, 0, 0];
      } else {
        return [x + lng, -y + lat, z, 0, 0];
      }
    }

    return { indices, positions };
  }

  public planeGeometryUpdateTriangulation = () => {
    const updateZ = this.spriteUpdate;
    const bottomZ = -100000;
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

  public updateModel = () => {
    // @ts-ignore
    const attributes = this.layer.createAttrubutes({
      triangulation: this.planeGeometryUpdateTriangulation,
    });
    this.layer.models.map((m) => {
      m.updateAttributes(attributes);
    });
    this.layer.renderLayers();

    this.timer = requestAnimationFrame(this.updateModel);
  };

  public planeGeometryTriangulation = () => {
    const {
      center = [120, 30],
      spriteCount = 100,
      spriteRadius = 10,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;

    const { indices, positions } = this.initSprite(
      spriteRadius,
      spriteCount,
      ...center,
    );
    this.positions = positions;
    this.indices = indices;
    return {
      vertices: positions,
      indices,
      size: 5,
    };
  };

  public getUninforms(): IModelUniform {
    const {
      opacity,
      mapTexture,
      spriteScale = 1,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    if (this.mapTexture !== mapTexture) {
      this.mapTexture = mapTexture;
      this.texture?.destroy();
      this.updateTexture(mapTexture);
    }
    return {
      u_opacity: opacity || 1,
      u_mapFlag: mapTexture ? 1 : 0,
      u_texture: this.texture,
      u_Scale: spriteScale,
    };
  }

  public clearModels(): void {
    cancelAnimationFrame(this.timer);
    this.texture?.destroy();
  }

  public initModels() {
    const {
      mapTexture,
      spriteTop = 5000000,
      spriteUpdate = 10000,
      spriteAnimate = SPRITE_ANIMATE_DIR.DOWN,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
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
      this.updateModel();
    }, 100);

    return [
      this.layer.buildLayerModel({
        moduleName: 'geometry_sprite',
        vertexShader: spriteVert,
        fragmentShader: spriteFrag,
        triangulation: this.planeGeometryTriangulation,
        primitive: gl.POINTS,
        depth: { enable: false },
        blend: this.getBlend(),
      }),
    ];
  }

  public buildModels() {
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
        this.layerService.updateLayerRenderList();
        this.layerService.renderLayers();
      };
      img.src = mapTexture;
    } else {
      this.texture = createTexture2D({
        width: 0,
        height: 0,
      });
    }
  }

  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }

  protected registerBuiltinAttributes() {
    return '';
  }
}
