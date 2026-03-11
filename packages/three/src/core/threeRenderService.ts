import type { IMapService, IMercator, IRendererService } from '@antv/l7';
import type { Camera } from 'three';
import { Matrix4, PerspectiveCamera, Scene as ThreeScene, WebGLRenderer } from 'three';

export interface IThreeRenderService {
  renderer: WebGLRenderer;
  camera: Camera;
  center: IMercator;
  init(): void;
  getRenderCamera(): Camera;
}

/**
 * 检查是否为 WebGL 2 上下文
 * Three.js r163+ 只支持 WebGL 2
 */
function isWebGL2(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
): gl is WebGL2RenderingContext {
  if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
    return true;
  }
  // @ts-ignore
  return Boolean(gl && gl._version === 2);
}

/**
 * 尝试从 canvas 获取 WebGL 2 上下文
 * 如果 canvas 已经有 WebGL 上下文，会返回相同的上下文
 */
function getWebGL2Context(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
  try {
    // 尝试获取 WebGL 2 上下文
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    return gl as WebGL2RenderingContext | null;
  } catch (e) {
    return null;
  }
}

export class ThreeRenderService implements IThreeRenderService {
  public renderer: WebGLRenderer;
  public camera: Camera;
  public center: IMercator;
  public aspect: number;
  public update: () => void;
  private scene: ThreeScene;

  // 初始状态相机变换矩阵
  private cameraTransform: Matrix4;

  constructor(
    private readonly rendererService: IRendererService,
    private readonly mapService: IMapService,
  ) {
    this.rendererService = rendererService;
    this.mapService = mapService;
  }

  public init() {
    // 从 L7 的 renderer 中获取可视化层的 canvas/gl
    const canvas = this.rendererService.getCanvas() as HTMLCanvasElement;
    const gl = this.rendererService.getGLContext();
    if (canvas && gl) {
      const center = this.mapService.getCenter();
      this.center = this.mapService.lngLatToMercator([center.lng, center.lat], 0);
    }
    const { x, y, z } = this.center;
    this.cameraTransform = new Matrix4().makeTranslation(x, y, z);

    // 检查 L7 提供的上下文是否为 WebGL 2
    // Three.js r163+ 只支持 WebGL 2
    const isWebGL2Context = gl && isWebGL2(gl);

    const rendererOptions: any = {
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    };

    if (isWebGL2Context) {
      // L7 使用 WebGL 2，共享上下文
      rendererOptions.context = gl;
    } else {
      // L7 使用 WebGL 1，尝试获取 WebGL 2 上下文
      // 注意：如果 canvas 已经有 WebGL 上下文，getContext 会返回同一个上下文
      const webgl2Context = getWebGL2Context(canvas);

      if (webgl2Context && isWebGL2(webgl2Context)) {
        // 成功获取 WebGL 2 上下文
        rendererOptions.context = webgl2Context;
        console.warn(
          '[L7-Three] L7 is using WebGL 1, but successfully acquired WebGL 2 context for Three.js.',
        );
      } else {
        // 无法获取 WebGL 2 上下文
        console.error(
          '[L7-Three] ERROR: L7 renderer is using WebGL 1, but Three.js r163+ requires WebGL 2. ' +
            'The canvas already has a WebGL 1 context which cannot be upgraded. ' +
            'Please configure L7 to use WebGL 2 by setting the renderer to use WebGL 2 context.',
        );
        // 尝试让 Three.js 自己创建，但很可能会失败
        // 不传入 context，让 Three.js 尝试
      }
    }

    // 根据 L7 的 canvas/gl 构建 threejs 的 renderer
    this.renderer = new WebGLRenderer(rendererOptions);

    this.renderer.autoClear = false;

    // Three.js r152+ 使用 outputColorSpace 替代 gammaFactor
    // Three.js 0.170+ 在使用外部 WebGL context 时，设置 outputColorSpace 会调用
    // gl.drawingBufferColorSpace = ColorManagement._getDrawingBufferColorSpace(colorSpace)
    // 但这个 API 在大多数浏览器中尚未完全支持，可能导致错误
    // 因此不再手动设置 outputColorSpace，使用 Three.js 默认值 (SRGBColorSpace)
    // 如需自定义颜色空间，请在创建 renderer 后手动配置

    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.scene = new ThreeScene();

    const width = gl?.drawingBufferWidth || canvas?.width || window.innerWidth;
    const height = gl?.drawingBufferHeight || canvas?.height || window.innerHeight;
    this.aspect = width / height;
    this.camera = new PerspectiveCamera(45, this.aspect, 1, 20000000);
  }

  public getRenderCamera(): Camera {
    switch (this.mapService.getType()) {
      case 'amap':
        return this.AMapCamera();
      case 'mapbox':
        return this.mapboxCamera();
      case 'default':
        return this.mapboxCamera();
      default:
        throw new Error('不支持其它地图');
    }
  }

  private mapboxCamera(): Camera {
    const mercatorMatrix = new Matrix4().fromArray(
      // @ts-ignore
      this.mapService.map.transform.customLayerMatrix(),
    );
    this.camera.projectionMatrix = mercatorMatrix.multiply(this.cameraTransform);
    // Three.js r150+ 使用 projectionMatrixInverse 做视锥剔除和光线投射，必须同步更新
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
    // Mapbox 已将 View 矩阵整合进 projectionMatrix，matrixWorldInverse 置为单位矩阵
    this.camera.matrixWorldInverse.identity();
    return this.camera;
  }

  private AMapCamera(): Camera {
    // @ts-expect-error
    const customCoords = this.mapService.map.customCoords;
    customCoords.setCenter([0, 0]);

    const camera = this.camera;
    const { near, far, fov, up, lookAt, position } = customCoords.getCameraParams();
    // @ts-ignore
    camera.near = near;
    // @ts-ignore
    camera.far = far;
    // @ts-ignore
    camera.fov = fov;
    // @ts-ignore
    camera.position.set(...position);
    // @ts-ignore
    camera.up.set(...up);
    // @ts-ignore
    camera.lookAt(...lookAt);
    // @ts-ignore
    camera.updateProjectionMatrix();
    // 同步 matrixWorldInverse（position/up/lookAt 变化后必须调用，否则视锥剔除使用陈旧矩阵）
    camera.updateMatrixWorld(true);

    return camera;
  }
}
