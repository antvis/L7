import '../src';
import {
  defaultRegistry,
  ParserNotFoundError,
  ParserRegistry,
  TransformNotFoundError,
} from '../src/parser-registry';

describe('ParserRegistry', () => {
  describe('registerParser / getParser', () => {
    it('returns a registered parser', () => {
      const registry = new ParserRegistry();
      const fake: any = () => ({ dataArray: [], dataArrayBuffer: [] });
      registry.registerParser('custom', fake);
      expect(registry.getParser('custom')).toBe(fake);
    });

    it('throws ParserNotFoundError for an unregistered type', () => {
      const registry = new ParserRegistry();
      expect(() => registry.getParser('nope')).toThrow(ParserNotFoundError);
      expect(() => registry.getParser('nope')).toThrow('nope');
    });

    it('ParserNotFoundError carries name + type + message and extends Error', () => {
      const registry = new ParserRegistry();
      let caught: ParserNotFoundError | undefined;
      try {
        registry.getParser('missing-type');
      } catch (err) {
        caught = err as ParserNotFoundError;
      }
      expect(caught).toBeInstanceOf(ParserNotFoundError);
      expect(caught).toBeInstanceOf(Error);
      expect(caught?.name).toBe('ParserNotFoundError');
      expect(caught?.type).toBe('missing-type');
      expect(caught?.message).toContain('missing-type');
    });
  });

  describe('registerTransform / getTransform', () => {
    it('returns a registered transform', () => {
      const registry = new ParserRegistry();
      const fake: any = (data: any) => data;
      registry.registerTransform('custom', fake);
      expect(registry.getTransform('custom')).toBe(fake);
    });

    it('throws TransformNotFoundError for an unregistered type', () => {
      const registry = new ParserRegistry();
      expect(() => registry.getTransform('nope')).toThrow(TransformNotFoundError);
      expect(() => registry.getTransform('nope')).toThrow('nope');
    });

    it('TransformNotFoundError carries name + type + message', () => {
      const registry = new ParserRegistry();
      let caught: TransformNotFoundError | undefined;
      try {
        registry.getTransform('missing-transform');
      } catch (err) {
        caught = err as TransformNotFoundError;
      }
      expect(caught).toBeInstanceOf(TransformNotFoundError);
      expect(caught?.name).toBe('TransformNotFoundError');
      expect(caught?.type).toBe('missing-transform');
    });
  });

  describe('defaultRegistry (builtins registered via index.ts)', () => {
    it('has all 13 built-in parsers registered', () => {
      const types = [
        'csv',
        'geojson',
        'geojsonvt',
        'image',
        'json',
        'jsonTile',
        'mvt',
        'ndi',
        'raster',
        'rasterTile',
        'rasterRgb',
        'rgb',
        'testTile',
      ];
      types.forEach((t) => {
        expect(typeof defaultRegistry.getParser(t)).toBe('function');
      });
    });

    it('has all 6 built-in transforms registered', () => {
      const types = ['cluster', 'filter', 'join', 'map', 'grid', 'hexagon'];
      types.forEach((t) => {
        expect(typeof defaultRegistry.getTransform(t)).toBe('function');
      });
    });

    it('throws ParserNotFoundError for an unregistered type on the singleton', () => {
      expect(() => defaultRegistry.getParser('not-a-real-parser')).toThrow(ParserNotFoundError);
    });

    it('throws TransformNotFoundError for an unregistered type on the singleton', () => {
      expect(() => defaultRegistry.getTransform('not-a-real-transform')).toThrow(
        TransformNotFoundError,
      );
    });
  });
});
