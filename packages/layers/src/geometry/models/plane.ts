import type { IEncodeFeature, IModel, IModelUniform, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import BaseModel from '../../core/BaseModel';
import type { IGeometryLayerStyleOptions } from '../../core/interface';
import planeFrag from '../shaders/plane_frag.glsl';
import planeVert from '../shaders/plane_vert.glsl';

export default class PlaneModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      UV: 10,
    });
  }

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

  public planeGeometryTriangulation = () => {
    const {
      width = 1,
      height = 1,
      widthSegments = 1,
      heightSegments = 1,
      center = [120, 30],
      terrainTexture,
      rgb2height = (r: number, g: number, b: number) => r + g + b,
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
      return this.translateVertex(
        positions,
        indices,
        this.terrainImage,
        widthSegments,
        heightSegments,
        rgb2height,
      );
    }

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
      terrainClipHeight = 0,
      terrainTexture,
    } = this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    if (this.mapTexture !== mapTexture) {
      this.mapTexture = mapTexture;
      this.texture?.destroy();
      this.updateTexture(mapTexture);
    }
    const commonOptions = {
      u_opacity: opacity || 1,
      u_mapFlag: mapTexture ? 1 : 0,
      u_terrainClipHeight: terrainTexture ? terrainClipHeight : -1,
      u_texture: this.texture,
    };
    this.textures = [this.texture];
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public clearModels(): void {
    // @ts-ignore
    this.terrainImage = null;
    this.texture?.destroy();
    this.textures = [];
  }

  public async initModels(): Promise<IModel[]> {
    const { mapTexture, terrainTexture } =
      this.layer.getLayerConfig() as IGeometryLayerStyleOptions;
    this.mapTexture = mapTexture;

    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });

    this.updateTexture(mapTexture);
    this.initUniformsBuffer();

    if (terrainTexture) {
      this.terrainImage = await this.loadTerrainImage(terrainTexture);
    }

    const model = await this.layer.buildLayerModel({
      moduleName: 'geometryPlane',
      vertexShader: planeVert,
      fragmentShader: planeFrag,
      triangulation: this.planeGeometryTriangulation,
      defines: this.getDefines(),
      inject: this.getInject(),
      primitive: gl.TRIANGLES,
      depth: { enable: true },

      cull: {
        enable: true,
        face: gl.BACK, // gl.FRONT | gl.BACK;
      },
    });
    return [model];
  }

  public async buildModels(): Promise<IModel[]> {
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
      const { widthSegments, heightSegments, width, height } =
        options as IGeometryLayerStyleOptions;
      this.layer.style({
        widthSegments: widthSegments !== undefined ? widthSegments : oldwidthSegments,
        heightSegments: heightSegments !== undefined ? heightSegments : oldheightSegments,
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
        this.layerService.reRender();
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
    const heightStep = imgHeight / gridY;

    for (let iy = 0; iy < gridY1; iy++) {
      const imgIndexY = Math.floor(iy * heightStep);
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

    return {
      vertices: positions,
      indices,
      size: 5,
    };
  }

  private async loadTerrainImage(terrainTexture: string) {
    if (this.terrainImage) {
      // 若当前已经存在 image，直接进行偏移计算（LOD）
      if (this.terrainImageLoaded) {
        return this.terrainImage;
      } else {
        return new Promise<HTMLImageElement>((resolve) => {
          this.terrainImage.onload = () => {
            resolve(this.terrainImage);
          };
        });
      }
    } else {
      // 加载地形贴图、根据地形贴图对 planeGeometry 进行偏移
      const terrainImage = new Image();
      terrainImage.crossOrigin = 'anonymous';
      return new Promise<HTMLImageElement>((resolve) => {
        terrainImage.onload = () => {
          this.terrainImageLoaded = true;
          resolve(terrainImage);
          // 图片加载完，触发事件，可以进行地形图的顶点计算存储
          setTimeout(() => this.layer.emit('terrainImageLoaded', null));
        };
        terrainImage.src = terrainTexture as string;
      });
    }
  }

  protected registerBuiltinAttributes() {
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        shaderLocation: this.attributeLocation.UV,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
