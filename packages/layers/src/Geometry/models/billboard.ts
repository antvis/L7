import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import { IGeometryLayerStyleOptions } from '../../core/interface';
import planeFrag from '../shaders/billboard_frag.glsl';
import planeVert from '../shaders/billboard_vert.glsl';

export default class BillBoardModel extends BaseModel {
  protected texture: ITexture2D;
  private radian: number = 0; // 旋转的弧度

  public planeGeometryTriangulation = () => {
    const { center = [120, 30] } =
      this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    return {
      size: 4,
      indices: [0, 1, 2, 2, 3, 0],
      vertices: [
        ...center,
        ...[1, 1],
        ...center,
        ...[0, 1],
        ...center,
        ...[0, 0],
        ...center,
        ...[1, 0],
      ],
    };
  };

  public getUninforms(): IModelUniform {
    const {
      opacity,
      width = 1,
      height = 1,
      raisingHeight = 0,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;

    /**
     *               rotateFlag
     * DEFAULT            1
     * MAPBOX           1
     * GAODE2.x         -1
     * GAODE1.x         -1
     */
    let rotateFlag = 1;
    if (
      this.mapService.version === 'GAODE2.x' ||
      this.mapService.version === 'GAODE1.x'
    ) {
      rotateFlag = -1;
    }
    // 控制图标的旋转角度（绕 Z 轴旋转）
    this.radian =
      (rotateFlag * Math.PI * (this.mapService.getRotation() % 360)) / 180;

    return {
      u_raisingHeight: Number(raisingHeight),
      u_RotateMatrix: new Float32Array([
        // z
        Math.cos(this.radian),
        Math.sin(this.radian),
        -Math.sin(this.radian),
        Math.cos(this.radian),
      ]),
      u_opacity: opacity || 1,
      u_texture: this.texture,
      u_size: [width, height],
    };
  }

  public clearModels(): void {
    this.texture?.destroy();
  }

  public async initModels(): Promise<IModel[]> {
    const { drawCanvas } =
      this.layer.getLayerConfig() as IGeometryLayerStyleOptions;

    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });

    if (drawCanvas) {
      this.updateTexture(drawCanvas);
    }

    const model = await this.layer.buildLayerModel({
      moduleName: 'geometryBillboard',
      vertexShader: planeVert,
      fragmentShader: planeFrag,
      triangulation: this.planeGeometryTriangulation,
      primitive: gl.TRIANGLES,
      depth: { enable: true },
    });
    return [model];
  }

  public async buildModels(): Promise<IModel[]> {
    return this.initModels();
  }

  public updateTexture(drawCanvas: (canvas: HTMLCanvasElement) => void): void {
    const { createTexture2D } = this.rendererService;

    const { canvasWidth = 1, canvasHeight = 1 } =
      this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawCanvas(canvas);
      this.texture = createTexture2D({
        data: canvas,
        width: canvas.width,
        height: canvas.height,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      });
      this.layerService.reRender();
    }
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'extrude',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Extrude',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const extrude = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0];
          const extrudeIndex = (attributeIdx % 4) * 3;
          return [
            extrude[extrudeIndex],
            extrude[extrudeIndex + 1],
            extrude[extrudeIndex + 2],
          ];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[2], vertex[3]];
        },
      },
    });
  }
}
