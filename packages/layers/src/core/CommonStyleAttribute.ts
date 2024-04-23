import type { IEncodeFeature, IStyleAttribute } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';

/**
 * Attribute Layout Location in Shader
 */
export const COMMON_ATTRIBUTE_LOCATION = {
  // common attribute in RegisterStyleAttributePlugin
  POSITION: 0,
  // low part for double precision POSITION attribute
  POSITION_64LOW: 1,
  COLOR: 2,
  PICKING_COLOR: 3,

  // common style attribute
  STROKE: 4,
  OPACITY: 5,
  OFFSETS: 6,
  ROTATION: 7,

  // last index
  MAX: 8,
} as const;

export function getCommonStyleAttributeOptions(name: string): Partial<IStyleAttribute> | undefined {
  switch (name) {
    // // roate
    case 'rotation':
      return {
        name: 'Rotation',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Rotation',
          shaderLocation: COMMON_ATTRIBUTE_LOCATION.ROTATION,
          buffer: {
            usage: gl.DYNAMIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 1,
          update: (feature: IEncodeFeature) => {
            const { rotation = 0 } = feature;
            return Array.isArray(rotation) ? [rotation[0]] : [rotation as number];
          },
        },
      };
    case 'stroke':
      return {
        name: 'stroke',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Stroke',
          shaderLocation: COMMON_ATTRIBUTE_LOCATION.STROKE,
          buffer: {
            // give the WebGL driver a hint that this buffer may change
            usage: gl.DYNAMIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 4,
          update: (feature: IEncodeFeature) => {
            const { stroke = [1, 1, 1, 1] } = feature;
            return stroke;
          },
        },
      };
    case 'opacity':
      return {
        name: 'opacity',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Opacity',
          shaderLocation: COMMON_ATTRIBUTE_LOCATION.OPACITY,
          buffer: {
            // give the WebGL driver a hint that this buffer may change
            usage: gl.STATIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 1,
          update: (feature: IEncodeFeature) => {
            const { opacity: op = 1 } = feature;
            return [op];
          },
        },
      };
    case 'offsets':
      return {
        name: 'offsets',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Offsets',
          shaderLocation: COMMON_ATTRIBUTE_LOCATION.OFFSETS,
          buffer: {
            // give the WebGL driver a hint that this buffer may change
            usage: gl.STATIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 2,
          update: (feature: IEncodeFeature) => {
            const { offsets: epo } = feature;
            return epo;
          },
        },
      };
    default:
      return undefined;
  }
}
