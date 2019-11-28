import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../index';
import GlobalConfigService from '../ConfigService';
import { IGlobalConfigService } from '../IConfigService';

describe('ConfigService', () => {
  let container: Container;
  let configService: IGlobalConfigService;

  beforeAll(() => {
    container = new Container();
    container
      .bind<IGlobalConfigService>(TYPES.IGlobalConfigService)
      .to(GlobalConfigService);
    configService = container.get<IGlobalConfigService>(
      TYPES.IGlobalConfigService,
    );
  });

  afterAll(() => {
    container.unbind(TYPES.IGlobalConfigService);
  });

  it("should validate scene's options according to JSON schema", () => {
    const { valid, errorText } = configService.validateSceneConfig({
      id: 0,
    });
    expect(valid).toBeFalsy();
    expect(errorText).toMatch('id should be string');

    expect(
      configService.validateSceneConfig({
        id: 'map',
      }).valid,
    ).toBeTruthy();
  });

  it("should validate map's `zoom` option", () => {
    const { valid, errorText } = configService.validateMapConfig({
      zoom: 100,
      minZoom: 100,
      maxZoom: -1,
    });
    expect(valid).toBeFalsy();
    expect(errorText).toMatch('zoom should be <= 20');
    expect(errorText).toMatch('minZoom should be <= 20');
    expect(errorText).toMatch('maxZoom should be >= 0');

    expect(
      configService.validateMapConfig({
        zoom: 10,
        minZoom: 1,
        maxZoom: 15,
      }).valid,
    ).toBeTruthy();
  });

  it("should validate map's `pitch` option", () => {
    const { valid, errorText } = configService.validateMapConfig({
      pitch: '1',
    });
    expect(valid).toBeFalsy();
    expect(errorText).toMatch('pitch should be number');

    expect(
      configService.validateMapConfig({
        pitch: 10,
      }).valid,
    ).toBeTruthy();
  });

  it("should validate map's `center` option", () => {
    const { valid, errorText } = configService.validateMapConfig({
      center: [1, 2, 3],
    });
    expect(valid).toBeFalsy();
    expect(errorText).toMatch('center should NOT have more than 2 items');

    const { valid: v2, errorText: e2 } = configService.validateMapConfig({
      center: [1],
    });
    expect(v2).toBeFalsy();
    expect(e2).toMatch('center should NOT have fewer than 2 items');

    const { valid: v3, errorText: e3 } = configService.validateMapConfig({
      center: 100,
    });
    expect(v3).toBeFalsy();
    expect(e3).toMatch('center should be array');

    expect(
      configService.validateMapConfig({
        center: [100, 100],
      }).valid,
    ).toBeTruthy();
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
