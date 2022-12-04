/**
 * render w/ regl
 * @see https://github.com/regl-project/regl/blob/gh-pages/API.md
 */
import {
  IAttributeInitializationOptions,
  IBufferInitializationOptions,
  IClearOptions,
  IElementsInitializationOptions,
  IExtensions,
  IModel,
  IModelInitializationOptions,
} from '@antv/l7-core';
import { injectable } from 'inversify';
import regl from 'l7regl';
import 'reflect-metadata';

/**
 * regl renderer
 */
@injectable()
export default class ReglRendererService {
  public extensionObject: IExtensions;
  private gl: regl.Regl;

  public init(
    canvas: HTMLCanvasElement,
  ) {
    
    this.gl = regl({
      // creates a full screen canvas element and WebGLRenderingContext
      // var regl = require('regl')()
      canvas: canvas,
      attributes: {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        stencil: false,
      },
      // TODO: use extensions
      extensions: [
        'OES_element_index_uint',
        'OES_standard_derivatives', // wireframe
        'ANGLE_instanced_arrays', // VSM shadow map
      ],
      optionalExtensions: [
        'oes_texture_float_linear',
        'OES_texture_float',
        'EXT_texture_filter_anisotropic',
        'EXT_blend_minmax',
        'WEBGL_depth_texture',
      ],
      profile: true,
    });
    return this.gl;
  }

  public createModel = (options: IModelInitializationOptions): IModel =>
    new ReglModel(this.gl, options);

  public createAttribute = (
    options: IAttributeInitializationOptions,
  ) => {
    const { buffer, offset, stride, normalized, size, divisor } = options;
   
    const attribute = {
      buffer,
      offset: offset || 0,
      stride: stride || 0,
      normalized: normalized || false,
      divisor: divisor || 0,
    };

    if (size) {
      attribute.size = size;
    }
    return attribute;
  }
  public createBuffer = (options: IBufferInitializationOptions) => {
    const { data } = options;
    return this.gl.buffer({
      data,
      usage: 'static',
    });
  }
    

  public createElements = (
    options: IElementsInitializationOptions,
  ) => {
    
    const { data, count } = options;
    return this.gl.elements({
      data,
      usage: "static",
      count,
    });
  };

  public clear = (options: IClearOptions) => {
    const { color, depth, stencil } = options;
    const reglClearOptions: regl.ClearOptions = {
      color,
      depth,
      stencil,
    };
    this.gl?.clear(reglClearOptions);
  };
}

class ReglModel {
  private drawCommand: any;  
  private uniforms: any = {};

  constructor(reGl: any, options: any) {
    const {
      vs,
      fs,
      attributes,
      uniforms,
      elements,
    } = options;
    const reglUniforms: any = {};
    
    this.uniforms = this.extractUniforms(uniforms);
    Object.keys(uniforms).forEach((uniformName) => {
      // pass data into regl
      reglUniforms[uniformName] = reGl.prop(uniformName);
    });
    

    const reglAttributes: any = {};
    Object.keys(attributes).forEach((name: string) => {
      reglAttributes[name] = attributes[name];
    });
    const drawParams: any = {
      attributes: reglAttributes,
      frag: fs,
      uniforms: reglUniforms,
      vert: vs,
      primitive: 'triangles'
    };

    drawParams.elements = elements;
    this.drawCommand = reGl(drawParams);
  }

  public addUniforms(uniforms: any ) {
    this.uniforms = {
      ...this.uniforms,
      ...this.extractUniforms(uniforms),
    };
  }

  public draw(options: any) {
    this.drawCommand(this.uniforms);
  }

  private extractUniforms(uniforms:any): any {
    const extractedUniforms = {};
    Object.keys(uniforms).forEach((uniformName) => {
      extractedUniforms[uniformName] = uniforms[uniformName];
    });
    
    return extractedUniforms;
  }
}
