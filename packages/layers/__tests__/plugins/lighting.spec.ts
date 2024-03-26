import { generateLightingUniforms } from '../../src/plugins/LightingPlugin';

describe('LightingPlugin', () => {
  it('should generate proper uniforms for a directional light', () => {
    const lightsMap = generateLightingUniforms([
      {
        type: 'directional',
      },
    ]);

    expect(lightsMap.u_NumOfDirectionalLights).toEqual(1);
    expect(lightsMap.u_NumOfSpotLights).toEqual(0);
  });

  it('should generate proper uniforms for directional and spot lights', () => {
    const lightsMap = generateLightingUniforms([
      {
        type: 'directional',
      },
      {
        type: 'spot',
      },
    ]);

    expect(lightsMap.u_NumOfDirectionalLights).toEqual(1);
    expect(lightsMap.u_NumOfSpotLights).toEqual(1);
  });

  it('should generate proper uniforms for directional and spot lights', () => {
    const lightsMap = generateLightingUniforms([
      {
        type: 'directional',
        ambient: [1, 1, 1],
      },
      {
        type: 'spot',
        angle: 10,
      },
    ]);

    expect(lightsMap.u_NumOfDirectionalLights).toEqual(1);
    expect(lightsMap.u_NumOfSpotLights).toEqual(1);
    expect(lightsMap.u_DirectionalLights[0].ambient).toEqual([1, 1, 1]);
    expect(lightsMap.u_SpotLights[0].angle).toEqual(10);
  });
});
