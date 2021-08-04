import {
  CameraUniform,
  CoordinateUniform,
  ICameraService,
  ICoordinateSystemService,
  ILayer,
  ILayerPlugin,
  IRendererService,
  TYPES,
} from '@antv/l7-core';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

const lightTypeUniformMap = {
  directional: {
    lights: 'u_DirectionalLights',
    num: 'u_NumOfDirectionalLights',
  },
  spot: {
    lights: 'u_SpotLights',
    num: 'u_NumOfSpotLights',
  },
};

interface IDirectionalLight {
  type: 'directional';
  direction: [number, number, number];
  ambient: [number, number, number];
  diffuse: [number, number, number];
  specular: [number, number, number];
}

interface ISpotLight {
  type: 'spot';
  position: [number, number, number];
  direction: [number, number, number];
  ambient: [number, number, number];
  diffuse: [number, number, number];
  specular: [number, number, number];
  constant: number;
  linear: number;
  quadratic: number;
  angle: number;
  exponent: number;
  blur: number;
}

const DEFAULT_LIGHT: IDirectionalLight = {
  type: 'directional',
  direction: [1, 10.5, 12],
  ambient: [0.2, 0.2, 0.2],
  diffuse: [0.6, 0.6, 0.6],
  specular: [0.1, 0.1, 0.1],
};

const DEFAULT_DIRECTIONAL_LIGHT = {
  direction: [0, 0, 0],
  ambient: [0, 0, 0],
  diffuse: [0, 0, 0],
  specular: [0, 0, 0],
};

const DEFAULT_SPOT_LIGHT = {
  position: [0, 0, 0],
  direction: [0, 0, 0],
  ambient: [0, 0, 0],
  diffuse: [0, 0, 0],
  specular: [0, 0, 0],
  constant: 1,
  linear: 0,
  quadratic: 0,
  angle: 14,
  exponent: 40,
  blur: 5,
};

const COLOR_ATTRIBUTES = ['ambient', 'diffuse', 'specular'];

export function generateLightingUniforms(
  lights?: Array<Partial<IDirectionalLight | ISpotLight>>,
) {
  const lightsMap: {
    u_DirectionalLights: Array<Omit<IDirectionalLight, 'type'>>;
    u_NumOfDirectionalLights: number;
    u_SpotLights: Array<Omit<ISpotLight, 'type'>>;
    u_NumOfSpotLights: number;
  } = {
    u_DirectionalLights: new Array(3).fill({ ...DEFAULT_DIRECTIONAL_LIGHT }),
    u_NumOfDirectionalLights: 0,
    u_SpotLights: new Array(3).fill({ ...DEFAULT_SPOT_LIGHT }),
    u_NumOfSpotLights: 0,
  };
  if (!lights || !lights.length) {
    lights = [DEFAULT_LIGHT];
  }
  lights.forEach(({ type = 'directional', ...rest }, i) => {
    const lightsUniformName = lightTypeUniformMap[type].lights;
    const lightsNumUniformName = lightTypeUniformMap[type].num;

    // Object.keys(rest).forEach(key => {
    //   if (Util.isString(rest[key]) && COLOR_ATTRIBUTES.indexOf(key) > -1) {
    //     rest[key] = ColorUtil.color2RGBA(rest[key]).slice(0, 3);
    //   }
    // });

    // @ts-ignore
    const num = lightsMap[lightsNumUniformName];
    // @ts-ignore
    lightsMap[lightsUniformName][num] = {
      // @ts-ignore
      ...lightsMap[lightsUniformName][num],
      ...rest,
    };
    // @ts-ignore
    lightsMap[lightsNumUniformName]++;
  });
  return lightsMap;
}

/**
 * 光照 & Shadow
 */
@injectable()
export default class LightingPlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.beforeRender.tap('LightingPlugin', () => {
      const { enableLighting } = layer.getLayerConfig();
      if (enableLighting) {
        layer.models.forEach((model) =>
          // @ts-ignore
          model.addUniforms({
            ...generateLightingUniforms(),
          }),
        );
      }
    });
  }
}
