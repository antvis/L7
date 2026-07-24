import BaseMap from '../src/lib/base-map';

/**
 * BaseMap 事件绑定契约测试（stage P2）。
 *
 * 锁定 BaseMap.concrete on/off 的行为：
 *  - MapServiceEvent 走 eventEmitter，不下沉原生 map
 *  - 原生 map 未就绪 → pendingHandlers 缓存，init 后重放
 *  - EventMap 单值/数组映射
 *  - buildProxy 默认 lngLat 归一化
 *  - 同一 handler 重复 on 去重
 *  - off 以原生 eventName 为键精确解绑（修复 tmap/tdtmap 历史以 L7 type 为键
 *    查 proxy 而 on 以原生名存 proxy 导致 off 空操作的泄漏 bug，与 P1b 同类）
 *  - 钩子可被子类覆盖：tmap mouseover container 监听、tdtmap .map 注入
 */

// ---- 测试用桩：替 BaseMap stub 全部抽象方法，仅暴露 on/off 事件契约 ----
class TestBaseMap extends BaseMap<any> {
  public map: any = null;
  protected viewport: any = null;
  public eventMap: Record<string, any> = {};
  protected getEventMap(): Record<string, any> {
    return this.eventMap;
  }
  public init(): Promise<void> {
    return Promise.resolve();
  }
  protected handleCameraChanged: () => void = () => {};
  public getMapStyle(): string {
    return '';
  }
  public getMapStyleConfig(): any {
    return {};
  }
  public getType(): string {
    return 'test';
  }
  public getContainer(): HTMLElement | null {
    return null;
  }
  public getMapCanvasContainer(): HTMLElement {
    return null as any;
  }
  public addMarkerContainer(): void {}
  public getSize(): [number, number] {
    return [0, 0];
  }
  public getZoom(): number {
    return 0;
  }
  public setZoom(_z: number): void {}
  public getCenter(): any {
    return { lng: 0, lat: 0 };
  }
  public setCenter(_l: [number, number]): void {}
  public getPitch(): number {
    return 0;
  }
  public getRotation(): number {
    return 0;
  }
  public getBounds(): any {
    return [
      [0, 0],
      [0, 0],
    ];
  }
  public getMinZoom(): number {
    return 0;
  }
  public getMaxZoom(): number {
    return 0;
  }
  public setRotation(_r: number): void {}
  public zoomIn(_o?: any, _e?: any): void {}
  public zoomOut(_o?: any, _e?: any): void {}
  public setPitch(_p: number): void {}
  public panTo(_p: [number, number]): void {}
  public panBy(_x: number, _y: number): void {}
  public fitBounds(_b: any, _o?: any): void {}
  public setMaxZoom(_m: number): void {}
  public setMinZoom(_m: number): void {}
  public setMapStatus(_o: any): void {}
  public setZoomAndCenter(_z: number, _c: [number, number]): void {}
  public setMapStyle(_n: any): void {}
  public pixelToLngLat(_p: [number, number]): any {
    return { lng: 0, lat: 0 };
  }
  public lngLatToPixel(_l: [number, number]): any {
    return { x: 0, y: 0 };
  }
  public containerToLngLat(_p: [number, number]): any {
    return { lng: 0, lat: 0 };
  }
  public lngLatToContainer(_l: [number, number]): any {
    return { x: 0, y: 0 };
  }
  public lngLatToMercator(_l: [number, number], _a: number): any {
    return { x: 0, y: 0, z: 0 };
  }
  public getModelMatrix(..._a: any[]): number[] {
    return [];
  }
  public exportMap(_t: 'jpg' | 'png'): string {
    return '';
  }
}

// tmap 风格：mouseover 走 container.addEventListener（历史 quirk：off 不解绑 container）
class TMapLikeBaseMap extends TestBaseMap {
  protected registerNative(eventName: string, proxy: (...args: any[]) => void): void {
    if (eventName === 'mouseover') {
      this.map.getContainer().addEventListener('mouseover', (e: any) => {
        proxy({ type: e.type, originalEvent: e });
      });
    }
    this.map.on(eventName, proxy);
  }
}

// tdtmap 风格：proxy 注入 args[0].map = this.map
class TdtLikeBaseMap extends TestBaseMap {
  protected buildProxy(handle: (...args: any[]) => void): (...args: any[]) => void {
    return (...args: any[]) => {
      if (args[0] && typeof args[0] === 'object' && !args[0].lngLat && !args[0].latlng) {
        args[0].lngLat = args[0].latlng || args[0].latLng || args[0].lnglat;
      }
      if (args[0] && typeof args[0] === 'object') {
        args[0].map = this.map;
      }
      handle(...args);
    };
  }
}

function makeMockMap() {
  const container = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  const listeners: Record<string, Array<(...args: any[]) => void>> = {};
  return {
    container,
    listeners,
    on: jest.fn((name: string, cb: (...a: any[]) => void) => {
      (listeners[name] = listeners[name] || []).push(cb);
    }),
    off: jest.fn((name: string, cb: (...a: any[]) => void) => {
      listeners[name] = (listeners[name] || []).filter((c) => c !== cb);
    }),
    getContainer: () => container,
  };
}

function makeInstance<T extends TestBaseMap>(Ctor: new () => T, map: any): T {
  const inst = new Ctor();
  // @ts-ignore 直接注入 map（绕过异步 init）
  inst.map = map;
  return inst;
}

describe.skip('BaseMap 事件绑定契约 (P2)', () => {
  // TODO(P2b): unskip once BaseMap on/off lifted into base class
  it('MapServiceEvent 走 eventEmitter，不调用原生 map.on', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    const cb = jest.fn();
    inst.on('mapchange', cb);
    expect(mockMap.on).not.toHaveBeenCalled();
    inst.emit('mapchange', 1);
    expect(cb).toHaveBeenCalledWith(1);
  });

  it('原生事件 on → map.on 被调用一次', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    const cb = jest.fn();
    inst.on('click', cb);
    expect(mockMap.on).toHaveBeenCalledTimes(1);
    expect(mockMap.on).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('buildProxy 默认 lngLat 归一化（latlng → lngLat）', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    const cb = jest.fn();
    inst.on('click', cb);
    const proxy = mockMap.on.mock.calls[0][1];
    proxy({ latlng: [120, 30] });
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ lngLat: [120, 30] }));
  });

  it('已有 lngLat 时不再覆盖', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    const cb = jest.fn();
    inst.on('click', cb);
    const proxy = mockMap.on.mock.calls[0][1];
    proxy({ lngLat: [1, 2] });
    expect(cb).toHaveBeenCalledWith({ lngLat: [1, 2] });
  });

  it('EventMap 单值映射（bmap/tmap: mapmove→moving）', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    inst.eventMap = { mapmove: 'moving' };
    inst.on('mapmove', jest.fn());
    expect(mockMap.on).toHaveBeenCalledWith('moving', expect.any(Function));
  });

  it('EventMap 数组映射（tmap: camerachange→[drag,pan,rotate,pitch,zoom]）', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    inst.eventMap = { camerachange: ['drag', 'pan', 'rotate', 'pitch', 'zoom'] };
    inst.on('camerachange', jest.fn());
    expect(mockMap.on).toHaveBeenCalledTimes(5);
    ['drag', 'pan', 'rotate', 'pitch', 'zoom'].forEach((n) =>
      expect(mockMap.on).toHaveBeenCalledWith(n, expect.any(Function)),
    );
  });

  it('同一 handler 重复 on 去重（仅一次 map.on）', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    const cb = jest.fn();
    inst.on('click', cb);
    inst.on('click', cb);
    expect(mockMap.on).toHaveBeenCalledTimes(1);
  });

  it('map 未就绪 → pending 缓存，init 后重放', () => {
    const inst = makeInstance(TestBaseMap, null);
    const cb = jest.fn();
    inst.on('click', cb);
    const mockMap = makeMockMap();
    // @ts-ignore
    inst.map = mockMap;
    inst.bindPendingEvents();
    expect(mockMap.on).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('off 原生事件 → 同一 proxy 精确解绑（map.off 收到 on 注册的同一函数引用）', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    const cb = jest.fn();
    inst.on('click', cb);
    const proxy = mockMap.on.mock.calls[0][1];
    inst.off('click', cb);
    expect(mockMap.off).toHaveBeenCalledWith('click', proxy);
    expect(inst.evtCbProxyMap.get('click')).toBeUndefined();
  });

  it('off EventMap 单值映射（dragging→drag）实际解绑（修复 tmap 历史 off 空操作）', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    inst.eventMap = { dragging: 'drag' };
    const cb = jest.fn();
    inst.on('dragging', cb);
    expect(mockMap.on).toHaveBeenCalledWith('drag', expect.any(Function));
    const proxy = mockMap.on.mock.calls[0][1];
    inst.off('dragging', cb);
    expect(mockMap.off).toHaveBeenCalledWith('drag', proxy);
    expect(inst.evtCbProxyMap.get('drag')).toBeUndefined();
  });

  it('off EventMap 数组映射全部解绑', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    inst.eventMap = { camerachange: ['drag', 'pan', 'rotate', 'pitch', 'zoom'] };
    const cb = jest.fn();
    inst.on('camerachange', cb);
    inst.off('camerachange', cb);
    expect(mockMap.off).toHaveBeenCalledTimes(5);
  });

  it('off 未注册的 handler → 安全 no-op，不抛错', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    expect(() => inst.off('click', jest.fn())).not.toThrow();
    expect(mockMap.off).not.toHaveBeenCalled();
  });

  it('map 未就绪时 off 从 pending 移除', () => {
    const inst = makeInstance(TestBaseMap, null);
    const cb = jest.fn();
    inst.on('click', cb);
    expect(inst.pendingHandlers).toHaveLength(1);
    inst.off('click', cb);
    expect(inst.pendingHandlers).toHaveLength(0);
  });

  it('tmap 风格：mouseover 注册 container.addEventListener（off 不解绑 container，历史 quirk）', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TMapLikeBaseMap, mockMap);
    const cb = jest.fn();
    inst.on('mouseover', cb);
    expect(mockMap.on).toHaveBeenCalledWith('mouseover', expect.any(Function));
    expect(mockMap.container.addEventListener).toHaveBeenCalledWith(
      'mouseover',
      expect.any(Function),
    );
    const proxy = mockMap.on.mock.calls[0][1];
    inst.off('mouseover', cb);
    expect(mockMap.off).toHaveBeenCalledWith('mouseover', proxy);
    // 历史 quirk：container 监听器不被 removeEventListener 移除
    expect(mockMap.container.removeEventListener).not.toHaveBeenCalled();
  });

  it('tdtmap 风格：proxy 注入 args[0].map = this.map', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TdtLikeBaseMap, mockMap);
    const cb = jest.fn();
    inst.on('click', cb);
    const proxy = mockMap.on.mock.calls[0][1];
    proxy({ latlng: [1, 2] });
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ map: mockMap }));
  });

  it('once 走 eventEmitter（继承自 BaseMap，bmap/tmap/tdtmap 不覆盖）', () => {
    const mockMap = makeMockMap();
    const inst = makeInstance(TestBaseMap, mockMap);
    const cb = jest.fn();
    inst.once('mapchange', cb);
    expect(mockMap.on).not.toHaveBeenCalled();
    inst.emit('mapchange');
    inst.emit('mapchange');
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
