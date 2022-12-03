import {
  IModel,
  IModelDrawOptions,
  IModelInitializationOptions,
  IUniform,
} from '@antv/l7-core';
import regl from 'l7regl';
import { isPlainObject, isTypedArray } from 'lodash';
import ReglAttribute from './ReglAttribute';
import ReglElements from './ReglElements';

/**
 * adaptor for regl.DrawCommand
 */
export default class ReglModel implements IModel {
  private reGl: regl.Regl;
  private drawCommand: regl.DrawCommand;  
  private uniforms: {
    [key: string]: IUniform;
  } = {};

  constructor(reGl: regl.Regl, options: IModelInitializationOptions) {
    this.reGl = reGl;
    const {
      vs,
      fs,
      attributes,
      uniforms,
      elements,
    } = options;
    const reglUniforms: { [key: string]: IUniform } = {};
    
    
    if (uniforms) {
      this.uniforms = this.extractUniforms(uniforms);
      Object.keys(uniforms).forEach((uniformName) => {
        // use regl prop API
        // @ts-ignore
        reglUniforms[uniformName] = reGl.prop(uniformName);
      });
    }
    

    const reglAttributes: { [key: string]: regl.Attribute } = {};
    Object.keys(attributes).forEach((name: string) => {
      reglAttributes[name] = (attributes[name] as ReglAttribute).get();
    });
    const drawParams: regl.DrawConfig = {
      attributes: reglAttributes,
      frag: fs,
      uniforms: reglUniforms,
      vert: vs,
      primitive: 'triangles'
    };

    drawParams.elements = (elements as ReglElements).get();
    this.drawCommand = reGl(drawParams);
  }

  public addUniforms(uniforms: { [key: string]: IUniform }) {
    this.uniforms = {
      ...this.uniforms,
      ...this.extractUniforms(uniforms),
    };
  }

  public draw(options: IModelDrawOptions) {
    this.drawCommand(this.uniforms);
  }

  /**
   * 考虑结构体命名, eg:
   * a: { b: 1 }  ->  'a.b'
   * a: [ { b: 1 } ] -> 'a[0].b'
   */
  private extractUniforms(uniforms: { [key: string]: IUniform }): {
    [key: string]: IUniform;
  } {
    const extractedUniforms = {};
    Object.keys(uniforms).forEach((uniformName) => {
      this.extractUniformsRecursively(
        uniformName,
        uniforms[uniformName],
        extractedUniforms,
        '',
      );
    });

    return extractedUniforms;
  }

  private extractUniformsRecursively(
    uniformName: string,
    uniformValue: IUniform,
    uniforms: {
      [key: string]: IUniform;
    },
    prefix: string,
  ) {
    if (
      uniformValue === null ||
      typeof uniformValue === 'number' || // u_A: 1
      typeof uniformValue === 'boolean' || // u_A: false
      (Array.isArray(uniformValue) && typeof uniformValue[0] === 'number') || // u_A: [1, 2, 3]
      isTypedArray(uniformValue) || // u_A: Float32Array
      // @ts-ignore
      uniformValue === '' ||
      'resize' in uniformValue
    ) {
      uniforms[`${prefix && prefix + '.'}${uniformName}`] = uniformValue;
      return;
    }

    // u_Struct.a.b.c
    if (isPlainObject(uniformValue)) {
      Object.keys(uniformValue).forEach((childName) => {
        this.extractUniformsRecursively(
          childName,
          // @ts-ignore
          uniformValue[childName],
          uniforms,
          `${prefix && prefix + '.'}${uniformName}`,
        );
      });
    }

    // u_Struct[0].a
    if (Array.isArray(uniformValue)) {
      uniformValue.forEach((child, idx) => {
        Object.keys(child).forEach((childName) => {
          this.extractUniformsRecursively(
            childName,
            // @ts-ignore
            child[childName],
            uniforms,
            `${prefix && prefix + '.'}${uniformName}[${idx}]`,
          );
        });
      });
    }
  }
}
