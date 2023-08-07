import {
  AttributeType,
  gl,
  IEncodeFeature,
  IStyleAttribute,
} from '@antv/l7-core';
export function getCommonStyleAttributeOptions(
  name: string,
): Partial<IStyleAttribute> | undefined {
  switch (name) {
    case 'stroke':
      return {
        name: 'stroke',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Stroke',
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
