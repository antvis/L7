import * as THREE from '../../core/three';
import Material from './material';
import { getModule, wrapUniforms } from '../../util/shaderModule';
import merge from '@antv/util/lib/deep-mix';
export function LineMaterial(options) {
  const { vs, fs } = getModule('line');
  const material = new Material({
    uniforms: {
      u_opacity: { value: options.u_opacity || 1.0 },
      u_time: { value: options.u_time || 0 },
      u_zoom: { value: options.u_zoom || 10 },
      u_activeId: { value: options.activeId || 0 },
      u_activeColor: { value: options.activeColor || [ 1.0, 0, 0, 1.0 ] }
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE[Material.blendingEnum[options.blending]]
  });
  return material;
}
// 弧线绘制 大圆航线 3D弧线
export function ArcLineMaterial(options) {
  let moduleName = 'arcline';
  if (options.shapeType === 'greatCircle') {
    moduleName = 'greatcircle';
  }
  const { vs, fs, uniforms } = getModule(moduleName);
  const material = new Material({
    uniforms: wrapUniforms(merge(uniforms, {
      u_opacity: options.u_opacity,
      segmentNumber: 30,
      u_time: 0,
      u_zoom: options.u_zoom,
      u_activeId: options.activeId,
      u_activeColor: options.activeColor
    })),
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE[Material.blendingEnum[options.blending]]
  });
  return material;
}

export function MeshLineMaterial(options, defines) {
  const { vs, fs, uniforms } = getModule('meshline');
  const material = new Material({
    uniforms: wrapUniforms(merge(uniforms, options, {
      u_activeId: options.activeId,
      u_activeColor: options.activeColor
    })),
    defines,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE[Material.blendingEnum[options.blending]]
  });
  return material;
}
