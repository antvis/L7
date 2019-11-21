import 'reflect-metadata';
import ConfigService from '../ConfigService';
import { IGlobalConfigService } from '../IConfigService';

describe('ConfigService', () => {
  let configService: IGlobalConfigService;

  beforeEach(() => {
    configService = new ConfigService();
  });

  it("should validate layer's options according to JSON schema", () => {
    configService.registerLayerConfigSchemaValidator('testLayer', {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
        enablePicking: {
          type: 'boolean',
        },
      },
    });

    const { valid, errorText } = configService.validateLayerConfig(
      'testLayer',
      { opacity: 'invalid' },
    );
    expect(valid).toBeFalsy();
    expect(errorText).toMatch('opacity should be number');

    expect(
      configService.validateLayerConfig('testLayer', {
        opacity: 1.5,
      }).valid,
    ).toBeFalsy();

    expect(
      configService.validateLayerConfig('testLayer', {
        enablePicking: 1.5,
      }).valid,
    ).toBeFalsy();

    expect(
      configService.validateLayerConfig('testLayer', {
        opacity: 1.0,
      }).valid,
    ).toBeTruthy();

    expect(
      configService.validateLayerConfig('testLayer', {
        opacity: 0.0,
      }).valid,
    ).toBeTruthy();
  });
});
