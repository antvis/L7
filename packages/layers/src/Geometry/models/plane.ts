import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { getMask, isMini } from '@antv/l7-utils';
// import { mat4, vec3 } from 'gl-matrix';
import BaseModel from '../../core/BaseModel';
import { IGeometryLayerStyleOptions } from '../../core/interface';
import planeFrag from '../shaders/plane_frag.glsl';
import planeVert from '../shaders/plane_vert.glsl';

function initPlane(
  width = 1,
  height = 1,
  widthSegments = 1,
  heightSegments = 1,
  lng = 120,
  lat = 30,
) {
  // https://github.com/mrdoob/three.js/blob/dev/src/geometries/PlaneGeometry.js
  const widthHalf = width / 2;
  const heightHalf = height / 2;

  const gridX = Math.floor(widthSegments);
  const gridY = Math.floor(heightSegments);

  const gridX1 = gridX + 1;
  const gridY1 = gridY + 1;

  const segmentWidth = width / gridX;
  const segmentHeight = height / gridY;

  const indices = [];
  const positions = [];

  for (let iy = 0; iy < gridY1; iy++) {
    const y = iy * segmentHeight - heightHalf;

    for (let ix = 0; ix < gridX1; ix++) {
      const x = ix * segmentWidth - widthHalf;

      positions.push(x + lng, -y + lat, 0);

      positions.push(ix / gridX);
      positions.push(1 - iy / gridY);
    }
  }

  for (let iy = 0; iy < gridY; iy++) {
    for (let ix = 0; ix < gridX; ix++) {
      const a = ix + gridX1 * iy;
      const b = ix + gridX1 * (iy + 1);
      const c = ix + 1 + gridX1 * (iy + 1);
      const d = ix + 1 + gridX1 * iy;

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  return { indices, positions };
}

export default class PlaneModel extends BaseModel {
  protected texture: ITexture2D;
  protected mapTexture: string | undefined;
  public planeGeometryTriangulation = () => {
    const {
      width = 1,
      height = 1,
      widthSegments = 1,
      heightSegments = 1,
      center = [120, 30],
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    const { indices, positions } = initPlane(
      width,
      height,
      widthSegments,
      heightSegments,
      ...center,
    );
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
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    if (this.mapTexture !== mapTexture) {
      this.mapTexture = mapTexture;
      this.texture.destroy();
      this.updateTexture(mapTexture);
    }
    return {
      u_opacity: opacity || 1,
      u_mapFlag: mapTexture ? 1 : 0,

      u_texture: this.texture,
      // u_ModelMatrix: mat4.translate(mat4.create(), mat4.create(), [1, 0, 0])
      // u_ModelMatrix: mat4.rotateZ(mat4.create(), mat4.create(), 10)
      // u_ModelMatrix: mat4.rotateZ(mat4.create(), mat4.create(), 10)
      // u_ModelMatrix: this.rotateZ()
    };
  }

  // public rotateZ(): mat4 {
  //   const res = mat4.create()
  //   const roZero = mat4.translate(mat4.create(), mat4.create(), [-120, 0, -30])
  //   const rotate = mat4.rotateZ(mat4.create(), mat4.create(), 10)
  //   const roOrigin = mat4.translate(mat4.create(), mat4.create(), [120, 0, 30])
  //   mat4.multiply(res, res, roZero)
  //   mat4.multiply(res, res, rotate)
  //   mat4.multiply(res, res, roOrigin)
  //   return res
  // }

  public clearModels(): void {
    this.texture.destroy();
  }

  public initModels() {
    const {
      mask = false,
      maskInside = true,
      mapTexture,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    this.mapTexture = mapTexture;

    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });

    this.updateTexture(mapTexture);

    return [
      this.layer.buildLayerModel({
        moduleName: 'geometry_plane',
        vertexShader: planeVert,
        fragmentShader: planeFrag,
        triangulation: this.planeGeometryTriangulation,
        primitive: gl.TRIANGLES,
        // primitive: gl.POINTS,
        depth: { enable: false },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
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
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
