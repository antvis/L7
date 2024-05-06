import type { IEncodeFeature, IModel, IModelUniform, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import type { IGeometryLayerStyleOptions } from '../../core/interface';
import planeFrag from '../shaders/billboard_frag.glsl';
import planeVert from '../shaders/billboard_vert.glsl';

export default class BillBoardModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      EXTRUDE: 9,
      UV: 10,
    });
  }

  protected texture: ITexture2D;
  private radian: number = 0; // 旋转的弧度

  public planeGeometryTriangulation = () => {
    const { center = [120, 30] } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
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
      width = 1,
      height = 1,
      raisingHeight = 0,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;

    /**
     *               rotateFlag
     * DEFAULT            1
     * MAPBOX             1
     * AMAP              -1
     */
    let rotateFlag = 1;
    if (this.mapService.getType() === 'amap') {
      rotateFlag = -1;
    }
    // 控制图标的旋转角度（绕 Z 轴旋转）
    this.radian = (rotateFlag * Math.PI * (this.mapService.getRotation() % 360)) / 180;

    const commonOptions = {
      u_size: [width, height],
      u_raisingHeight: Number(raisingHeight),
      u_rotation: this.radian,
      u_opacity: opacity || 1,
      u_texture: this.texture,
    };
    this.textures = [this.texture];
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public clearModels(): void {
    this.texture?.destroy();
  }

  public async initModels(): Promise<IModel[]> {
    const { drawCanvas } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;

    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });

    if (drawCanvas) {
      this.updateTexture(drawCanvas);
    }
    this.initUniformsBuffer();
    const model = await this.layer.buildLayerModel({
      moduleName: 'geometryBillboard',
      vertexShader: planeVert,
      fragmentShader: planeFrag,
      triangulation: this.planeGeometryTriangulation,
      defines: this.getDefines(),
      inject: this.getInject(),
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
        shaderLocation: this.attributeLocation.EXTRUDE,
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
          return [extrude[extrudeIndex], extrude[extrudeIndex + 1], extrude[extrudeIndex + 2]];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        shaderLocation: this.attributeLocation.UV,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[2], vertex[3]];
        },
      },
    });
  }
}
