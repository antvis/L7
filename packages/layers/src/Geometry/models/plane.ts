import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { Version } from '@antv/l7-maps';
import { getMask, isMini } from '@antv/l7-utils';
// import { mat4, vec3 } from 'gl-matrix';
import BaseModel from '../../core/BaseModel';
import { IGeometryLayerStyleOptions } from '../../core/interface';
import planeFrag from '../shaders/plane_frag.glsl';
import planeVert from '../shaders/plane_vert.glsl';

export default class PlaneModel extends BaseModel {
  protected texture: ITexture2D;
  protected mapTexture: string | undefined;
  protected positions: number[];
  protected indices: number[];

  public initPlane(
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
        if (this.mapService.version === Version['GAODE2.x']) {
          // @ts-ignore
          const [a, b] = this.mapService.lngLatToCoord([x + lng, -y + lat]) as [
            number,
            number,
          ];
          positions.push(a, b, 0);
        } else {
          positions.push(x + lng, -y + lat, 0);
        }

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

  public planeGeometryTriangulation = () => {
    const {
      width = 1,
      height = 1,
      widthSegments = 1,
      heightSegments = 1,
      center = [120, 30],
      terrainTexture,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;

    const { indices, positions } = this.initPlane(
      width,
      height,
      widthSegments,
      heightSegments,
      ...center,
    );
    this.positions = positions;
    this.indices = indices;

    if (terrainTexture) {
      // 存在地形贴图的时候会根据地形贴图对顶点进行偏移
      this.loadTerrainTexture();
    }

    return {
      vertices: positions,
      indices,
      size: 5,
    };
  };
  public planeGeometryUpdateTriangulation = () => {
    return {
      vertices: this.positions,
      indices: this.indices,
      size: 5,
    };
  };

  public getUninforms(): IModelUniform {
    const {
      opacity,
      mapTexture,
      terrainClipHeight = 0,
      terrainTexture,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    if (this.mapTexture !== mapTexture) {
      this.mapTexture = mapTexture;
      this.texture?.destroy();
      this.updateTexture(mapTexture);
    }
    return {
      u_opacity: opacity || 1,
      u_mapFlag: mapTexture ? 1 : 0,
      u_terrainClipHeight: terrainTexture ? terrainClipHeight : -1,
      u_texture: this.texture,
      // u_ModelMatrix: mat4.translate(mat4.create(), mat4.create(), [1, 0, 0])
      // u_ModelMatrix: mat4.rotateZ(mat4.create(), mat4.create(), 10)
      // u_ModelMatrix: mat4.rotateZ(mat4.create(), mat4.create(), 10)
      // u_ModelMatrix: this.rotateZ()
    };
  }

  public clearModels(): void {
    this.texture?.destroy();
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
        depth: { enable: true },
        blend: this.getBlend(),
        stencil: getMask(mask, maskInside),
        cull: {
          enable: true,
          face: gl.BACK, // gl.FRONT | gl.BACK;
        },
      }),
    ];
  }

  public getImageData(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const { width, height } = img;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);

    return imageData;
  }

  /**
   * load terrain texture & offset attribute z
   */
  public loadTerrainTexture(): void {
    const {
      mask = false,
      maskInside = true,
      widthSegments = 1,
      heightSegments = 1,
      terrainTexture,
      rgb2height = (r: number, g: number, b: number) => r + g + b,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    const terrainImage = new Image();
    terrainImage.crossOrigin = 'anonymous';
    terrainImage.onload = () => {
      const imgWidth = terrainImage.width;
      const imgHeight = terrainImage.height;

      const imageData = this.getImageData(terrainImage).data;

      const gridX = Math.floor(widthSegments);
      const gridY = Math.floor(heightSegments);

      const gridX1 = gridX + 1;
      const gridY1 = gridY + 1;

      const widthStep = imgWidth / gridX;
      const heihgtStep = imgHeight / gridY;

      for (let iy = 0; iy < gridY1; iy++) {
        const imgIndexY = Math.floor(iy * heihgtStep);
        const imgLen = imgIndexY * imgWidth;

        for (let ix = 0; ix < gridX1; ix++) {
          const imgIndexX = Math.floor(ix * widthStep);
          const imgDataIndex = (imgLen + imgIndexX) * 4;

          const r = imageData[imgDataIndex];
          const g = imageData[imgDataIndex + 1];
          const b = imageData[imgDataIndex + 2];

          const z = (iy * gridX1 + ix) * 5 + 2;
          this.positions[z] = rgb2height(r, g, b);
        }
      }

      this.layer.models = [
        this.layer.buildLayerModel({
          moduleName: 'geometry_plane',
          vertexShader: planeVert,
          fragmentShader: planeFrag,
          triangulation: this.planeGeometryUpdateTriangulation,
          primitive: gl.TRIANGLES,
          depth: { enable: true },
          blend: this.getBlend(),
          stencil: getMask(mask, maskInside),
          cull: {
            enable: true,
            face: gl.BACK,
          },
        }),
      ];
      this.layerService.renderLayers();
    };
    terrainImage.src = terrainTexture as string;
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
