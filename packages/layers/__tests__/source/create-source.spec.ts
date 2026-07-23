import '../../src/source';
import { defaultRegistry, ParserRegistry, registerBuiltins } from '../../src/source';
import Source from '../../src/source/base-source';
import { createSource } from '../../src/source/create-source';
import Point from './data/point';
import Polygon from './data/polygon';

describe('createSource factory (stage 2.5)', () => {
  it('returns a Source instance (default registry)', () => {
    const source = createSource(Polygon);
    expect(source).toBeInstanceOf(Source);
    expect(source.extent).toEqual([
      114.24373626708983, 30.55560910664438, 114.32424545288086, 30.60807236997211,
    ]);
  });

  it('equivalent to new Source(data, cfg) for the default path', () => {
    const viaFactory = createSource(Polygon);
    const viaCtor = new Source(Polygon);
    expect(viaFactory.extent).toEqual(viaCtor.extent);
    expect(viaFactory.data.dataArray.length).toEqual(viaCtor.data.dataArray.length);
  });

  it('supports cluster via default registry', () => {
    const source = createSource(Point, {
      cluster: true,
      clusterOptions: { method: 'sum', field: 'mag' },
    });
    source.updateClusterData(2);
    expect(source.data.dataArray.length).toBeGreaterThan(50);
  });

  it('injects a custom registry used end-to-end (parser + cluster)', () => {
    const customRegistry = new ParserRegistry();
    registerBuiltins(customRegistry);
    expect(customRegistry).not.toBe(defaultRegistry);

    // Spy on the custom registry to prove Source uses it (not the singleton).
    const getParserSpy = jest.spyOn(customRegistry, 'getParser');

    const source = createSource(
      Point,
      { cluster: true, clusterOptions: { method: 'sum', field: 'mag' } },
      customRegistry,
    );
    // executeParser ran synchronously during construction: geojson parser was pulled
    // from the injected customRegistry, not the default singleton.
    expect(getParserSpy).toHaveBeenCalledWith('geojson');
    expect(source.extent).toBeDefined();

    // ClusterManager shares the same injected registry: re-parse cluster data also
    // routes through customRegistry.getParser('geojson').
    const callsBeforeCluster = getParserSpy.mock.calls.length;
    source.updateClusterData(2);
    expect(getParserSpy.mock.calls.length).toBeGreaterThan(callsBeforeCluster);
    expect(source.data.dataArray.length).toBeGreaterThan(50);

    getParserSpy.mockRestore();
  });

  it('isolates custom registry state from the default singleton', () => {
    const customRegistry = new ParserRegistry();
    registerBuiltins(customRegistry);
    // Register a custom parser type that only exists on the custom registry.
    const customParser = () => ({ dataArray: [], dataArrayBuffer: [] });
    customRegistry.registerParser('custom-only', customParser);
    expect(customRegistry.getParser('custom-only')).toBe(customParser);
    // The default singleton must NOT have this custom type registered.
    expect(() => defaultRegistry.getParser('custom-only')).toThrow(/ParserNotFoundError/);
  });
});
