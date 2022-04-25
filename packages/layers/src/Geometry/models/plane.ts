import {
  AttributeType,
  gl,
  IAttrubuteAndElements,
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
  protected terrainImage: HTMLImageElement;
  protected terrainImageLoaded: boolean = false;
  protected mapTexture: string | undefined;

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
    if (terrainTexture) {
      // 存在地形贴图的时候会根据地形贴图对顶点进行偏移
      this.loadTerrainTexture(positions, indices);
    }

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
    };
  }

  public clearModels(): void {
    // @ts-ignore
    this.terrainImage = null;
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
        // primitive: gl.LINES,
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

  public buildModels() {
    return this.initModels();
  }

  public createModelData(options?: any) {
    if (options) {
      const {
        widthSegments: oldwidthSegments,
        heightSegments: oldheightSegments,
        width: oldwidth,
        height: oldheight,
      } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
      const {
        widthSegments,
        heightSegments,
        width,
        height,
      } = options as IGeometryLayerStyleOptions;
      this.layer.style({
        widthSegments:
          widthSegments !== undefined ? widthSegments : oldwidthSegments,
        heightSegments:
          heightSegments !== undefined ? heightSegments : oldheightSegments,
        width: width !== undefined ? width : oldwidth,
        height: height !== undefined ? height : oldheight,
      });
    }
    const oldFeatures = this.layer.getEncodedData();
    const res = this.styleAttributeService.createAttributesAndIndices(
      oldFeatures,
      this.planeGeometryTriangulation,
    );
    return res;
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

  protected getImageData(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const { width, height } = img;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);

    return imageData;
  }

  protected translateVertex(
    positions: number[],
    indices: number[],
    image: HTMLImageElement,
    widthSegments: number,
    heightSegments: number,
    rgb2height: (r: number, g: number, b: number) => number,
  ) {
    const imgWidth = image.width;
    const imgHeight = image.height;
    const imageData = this.getImageData(image).data;

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
        positions[z] = rgb2height(r, g, b);
      }
    }

    const oldFeatures = this.layer.getEncodedData();
    const modelData = this.styleAttributeService.createAttributesAndIndices(
      oldFeatures,
      () => {
        return {
          vertices: positions,
          indices,
          size: 5,
        };
      },
    );
    this.layer.updateModelData(modelData as IAttrubuteAndElements);
    this.layerService.renderLayers();
  }

  /**
   * load terrain texture & offset attribute z
   */
  protected loadTerrainTexture(positions: number[], indices: number[]) {
    const {
      widthSegments = 1,
      heightSegments = 1,
      terrainTexture,
      rgb2height = (r: number, g: number, b: number) => r + g + b,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    if (this.terrainImage) {
      // 若当前已经存在 image，直接进行偏移计算（LOD）
      if (this.terrainImageLoaded) {
        this.translateVertex(
          positions,
          indices,
          this.terrainImage,
          widthSegments,
          heightSegments,
          rgb2height,
        );
      } else {
        this.terrainImage.onload = () => {
          this.translateVertex(
            positions,
            indices,
            this.terrainImage,
            widthSegments,
            heightSegments,
            rgb2height,
          );
        };
      }
    } else {
      // 加载地形贴图、根据地形贴图对 planeGeometry 进行偏移
      const terrainImage = new Image();
      this.terrainImage = terrainImage;
      terrainImage.crossOrigin = 'anonymous';
      terrainImage.onload = () => {
        this.terrainImageLoaded = true;
        // 图片加载完，触发事件，可以进行地形图的顶点计算存储
        setTimeout(() => this.layer.emit('terrainImageLoaded', null));
        this.translateVertex(
          positions,
          indices,
          terrainImage,
          widthSegments,
          heightSegments,
          rgb2height,
        );
      };
      terrainImage.src = terrainTexture as string;
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
