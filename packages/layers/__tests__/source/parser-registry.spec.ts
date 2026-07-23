import '../../src/source';
import {
  defaultRegistry,
  ParserNotFoundError,
  ParserRegistry,
  registerBuiltins,
  TransformNotFoundError,
} from '../../src/source';

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
  describe('registerBuiltins', () => {
    it('registers all 13 parsers + 6 transforms on a fresh registry', () => {
      const registry = new ParserRegistry();
      registerBuiltins(registry);
      const parserTypes = [
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
      parserTypes.forEach((t) => {
        expect(typeof registry.getParser(t)).toBe('function');
      });
      const transformTypes = ['cluster', 'filter', 'join', 'map', 'grid', 'hexagon'];
      transformTypes.forEach((t) => {
        expect(typeof registry.getTransform(t)).toBe('function');
      });
    });

    it('defaults to defaultRegistry when called with no argument', () => {
      // defaultRegistry already populated by index.ts side-effect import;
      // calling registerBuiltins() with no arg is idempotent re-registration.
      expect(() => registerBuiltins()).not.toThrow();
      expect(typeof defaultRegistry.getParser('geojson')).toBe('function');
      expect(typeof defaultRegistry.getTransform('cluster')).toBe('function');
    });

    it('does not pollute the singleton when registering on a fresh registry', () => {
      const registry = new ParserRegistry();
      registerBuiltins(registry);
      // Fresh registry has builtins; singleton's state is independent.
      expect(() => registry.getParser('geojson')).not.toThrow();
      // The fresh registry and singleton are distinct instances.
      expect(registry).not.toBe(defaultRegistry);
    });
  });
});
